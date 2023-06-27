import "./db";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import campaign from "./campaign";
import { Phone, Cliente as ClientType } from "./types/types";
import * as readline from "readline";
import NumberModel from "./models/Number";
import Client from "./models/Client";
import * as path from "path";
import * as fs from "fs/promises";
import Provincia from "./models/Provincia";

const cleanDB = async () => {
  
};

cleanDB();
const saveTexts = async () => {
  const client: ClientType = await Client.findOne({ nombre: "NM" }).populate({
    path: "provincias",
    model: Provincia,
    populate: {
      path: "numbers",
      model: NumberModel,
    },
  });
  console.log(client.provincias.map((p) => p.numbers.length));
  const files = await fs.readdir(path.join(__dirname, "/text"));
  for (let file of files) {
    const fileBaseName = file.replace(/\.[^/.]+$/, "");
    console.log(fileBaseName);
    const content = await fs.readFile(
      path.join(__dirname, "/text", file),
      "utf-8"
    );
    const province = client.provincias.find(
      (p) => p.name.toLowerCase() === fileBaseName
    );
    if (province) {
      province.message = content;
      await province.save();
      console.log(province);
    }
  }
};
/*
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getPhones = async (params: any[]) => {
  const province = await params[0].populate({
    path: "numbers",
    model: NumberModel,
  });
  if (province) {
    const phones: Phone[] = province.numbers;
    return { phones: phones.slice(params[1][0], params[1][1]), province };
  }
  return null;
};

const getParams = async (): Promise<any[] | null> => {
  const clients = await Client.find().populate("provincias");
  let client;
  let province;
  let slice: Number[];
  console.log("Seleccione una opción:");
  clients.forEach(({ nombre }, index) => {
    console.log(`${index + 1}. ${nombre}`);
  });
  const question = await new Promise<number>((resolve) => {
    rl.question("Ingrese el número de la opción seleccionada: ", (answer) => {
      resolve(parseInt(answer) - 1);
    });
  });
  if (question >= 0 && question < clients.length) {
    const selectedOption = clients[question];
    console.log(`Ha seleccionado: ${selectedOption.nombre}`);
    client = selectedOption;
  } else {
    throw new Error("Opción inválida");
  }
  console.log(
    "Ingresa la provincia del cliente a la que deseas hacer campaña:"
  );
  client.provincias.forEach(({ name }, index) => {
    console.log(`${index + 1}. ${name}`);
  });
  const answer1 = await new Promise<number>((resolve) => {
    rl.question(`Ingrese el número de la opción seleccionada: `, (answer) => {
      resolve(parseInt(answer) - 1);
    });
  });
  if (answer1 >= 0 && answer1 < client.provinces.length) {
    const selectedOption = client.provinces[answer1];
    console.log(`Ha seleccionado: ${selectedOption.name}`);
    province = selectedOption;
  } else {
    throw new Error("Opción inválida");
  }
  const answer2 = await new Promise<string>((resolve) => {
    rl.question(
      `Ingrese el split (inicio final) (${province.numbers.length} datos disponibles): `,
      (answer) => {
        resolve(answer);
      }
    );
  });
  slice = answer2.split(" ").map((a) => {
    const number = Number(a);
    if (isNaN(number))
      throw new Error("El valor ingresado no es un número válido");
    return number;
  });
  if (slice[0] > slice[1])
    throw new Error("Los valores del slice son incorrectos");
  rl.close();
  return [province, slice];
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
*/
//saveTexts();
//connectToWhatsApp();
