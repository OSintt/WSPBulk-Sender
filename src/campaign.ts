import * as fs from "fs/promises";
import { Phone } from "./types/types";
import path = require("path");

const campaign = async (client: any, phones: Phone[], interval: number) => {
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
  const message = await fs.readFile(
    path.join(__dirname, "text", "text.txt"),
    "utf8"
  );
  console.log(
    "expected execution time:",
    (phones.length * interval) / 60,
    "minutes"
  );
  for (let i = 0; i < updatedPhones.length; i++) {
    const phone = updatedPhones[i];
    setTimeout(async () => {
      try {
        await client.sendMessage(phone.phone + "@s.whatsapp.net", {
          text: message.replace("{{nombre}}", phone.name),
        });
      } catch (e) {
        console.error("failed", phone.name, phone.phone, e);
      }
    }, interval);
  }
};

export default campaign;
