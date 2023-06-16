import * as fs from 'fs/promises';
import { Phone } from "./types/types";
import path = require('path');

const campaign = async (client: any, phones: Phone[], interval: number) => {
  /*const message = await RecaudoMessage.findOne({ province });
    if (!message) return console.log('No existe una provincia con ese nombre');*/
  const updatedPhones = phones.map((number) => {
    if (!/^5930/.test(number.phone) && !/^593\d/.test(number.phone)) {
      number = {
        ...number,
        phone: number.phone.replace(/^(0*)(?!5930)(.*)$/, "5930$2"),
      };
    }
    const transformedPhone = number.phone
      .replace(/[- ]/g, "")
      .replace(/(?<=593)0/g, "");
    return {
      ...number,
      phone: transformedPhone,
    };
  });

  const message = await fs.readFile(path.join(__dirname, 'text'), 'utf8');
  let i = 0;
  let sended = [];
  let errs = [];
  console.log('expected execution time:', (phones.length * interval) / 60, 'minutes');
  const startTime = performance.now();
  for (let phone of updatedPhones) {
    setTimeout(async () => {
      try {
        await client.sendMessage(phone.phone + "@s.whatsapp.net", {
          text: message.replace("{{nombre}}", phone.name),
        });
        sended.push(phone);
      } catch (e) {
        console.error("failed", phone.name, phone.phone, e);
        errs.push(phone);
      }
    }, i * interval * 1000);
    i++;
  }
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  console.log("Execution time:", executionTime, "milliseconds");
  console.log("campaign terminated");
  console.log("sended:", sended.length);
  console.log("failed:", errs.length, errs);
};

export default campaign;
