import { Params } from "./types/types";
import NumberModel from "./models/Number";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const campaign = async (client: any, params: Params, interval: number) => {
  const { phones, province } = params;
  const updatedPhones = phones.map((number) => {
    if (!/^5930/.test(number.telefono) && !/^593\d/.test(number.telefono)) {
      number = {
        ...number,
        telefono: number.telefono.replace(/^(0*)(?!5930)(.*)$/, "5930$2"),
      };
    }
    const transformedPhone = number.telefono
      .replace(/[- ]/g, "")
      .replace(/(?<=593)0/g, "");
    return {
      ...number,
      phone: transformedPhone,
    };
  });
  console.log(
    "expected execution time:",
    (phones.length * (interval + 3)) / 60,
    "minutes", phones.length, 'números'
  );
  for (let i = 0; i < updatedPhones.length; i++) {
    const phone: any = updatedPhones[i];
    const timeOut = i === 100 ? 300 : interval;
    try {
      await client.sendMessage(phone.phone + "@s.whatsapp.net", {
       text: province.message.replace("{{nombre}}", phone._doc.nombre),
      });
      
      const foundPhone = await NumberModel.findOne({
        cedula: phone._doc.cedula,
      });
      foundPhone.enviado = true;
      const savedPhone = await foundPhone.save();
      console.log(savedPhone.telefono, savedPhone.enviado, i);
      await delay(timeOut * 1000);
    } catch (e) {
      console.error("failed", phone._doc.nombre, phone.phone, e);
    }
  }
};

export default campaign;
