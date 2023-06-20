import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as path from "path";
import { config } from "dotenv";
import campaign from "./campaign";
import { Phone, Province } from "./types/types";
import Provincia from "./models/Provincia";
import mongoose from "mongoose";
import * as readline from "readline";
import * as fs from 'fs/promises';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

config();

/*const saveTexts = async () => {
  const files = await fs.readdir(path.join(__dirname, '/text'));
  for (let file of files) {
    const fileBaseName = file.replace(/\.[^/.]+$/, '');
    console.log(file)
    const content = await fs.readFile(path.join(__dirname, '/text', file), 'utf-8');
    const province = await Provincia.findOne({ name: { $regex: `^${fileBaseName}$`, $options: 'i' }  });
    if (province) {
      province.message = content;
      await province.save();
      console.log(province);
    }
  }
};*/

const db = async () => {
  await mongoose
    .connect(process.env.URI)
    .then(() => console.log("Base de datos online"));
};
db();

const getProvince = async (name: string): Promise<Province | null> => {
  const province = (await Provincia.findOne({ name })).populate("numbers");
  if (!province) {
    console.error("Esa provincia no existe en mi base de datos");
    throw new Error('Esa provincia no existe');
  }
  return province;
};
const getPhones = async (params: any[]) => {
  const province = await getProvince(params[0]);
  if (province) {
    const phones: Phone[] = province.numbers;
    return phones.slice(params[1][0], params[1][1]);
  }
  return null;
};

const getParams = async (): Promise<any[] | null> => {
  const options = await Provincia.find();
  let selected;
  let slice: Number[];
  console.log("Seleccione una opción:");
  options.forEach(({ name }, index) => {
    console.log(`${index + 1}. ${name}`);
  });
  rl.question("Ingrese el número de la opción seleccionada: ", (answer) => {
    const selectedOptionIndex = parseInt(answer) - 1;

    if (selectedOptionIndex >= 0 && selectedOptionIndex < options.length) {
      const selectedOption = options[selectedOptionIndex];
      console.log(`Ha seleccionado: ${selectedOption}`);
      selected = selectedOption;
    } else {
      throw new Error("Opción inválida");
    }

    rl.question('Ingrese el split (inicio final)', (answer2) => {
      slice = answer2.split(' ').map(a => {
        const number = Number(a);
        if (isNaN(number)) throw new Error('El valor ingresado no es un número válido');
        return number;
      });
      if (slice[1] > slice[0]) throw new Error('Los valores del slice son incorrectos');
      rl.close();
    });
    
  });
  return [selected, slice];
};

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
      campaign(sock, await getPhones(await getParams()), 6);
    }
  });
}

connectToWhatsApp()
