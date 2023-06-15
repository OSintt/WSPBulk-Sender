import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom';
import * as XLSX from "xlsx";
import * as path from "path";
import * as fs from "fs/promises";
import { config } from 'dotenv';
import campaign from './campaign';
import { Phone } from './types/types';
const filePath = path.join(__dirname, "xlsx");
config();

const getPhones = async (): Promise<Phone[]> => {
  const phones: Phone[] = [];
  const files = await fs.readdir(filePath);
  for (let file of files) {
    console.log(file);
    const workbook = XLSX.readFile(path.join(filePath, file));
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const sheetData = XLSX.utils.sheet_to_json(worksheet);

    sheetData.forEach((row: any) => {
      const newPhone = new Phone();
      newPhone.phone = row['Numero'];
      newPhone.name = row['Nombre'];
      phones.push(newPhone);
    });
  }
  
  return phones;
};



async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });
    sock.ev.on("creds.update", saveCreds);
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection');
            campaign(sock, await getPhones(), 2);
        }
    })
}

connectToWhatsApp()


