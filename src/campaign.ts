import { Params, Province, NumberModel as NumberType } from "./types/types";
import NumberModel from "./models/Number";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const campaign = async (client: any, params: Params, interval: number) => {
  const { phones, province }: { phones: NumberType[]; province: Province } =
    params;
  console.log(
    "expected execution time:",
    (phones.length * (interval + 3)) / 60,
    "minutes",
    phones.length,
    "números"
  );
  for (let i = 0; i < phones.length; i++) {
    const phone: any = phones[i];
    const timeOut = i === 100 ? 300 : interval;
    try {
      await client.sendMessage(phone.telefono + "@s.whatsapp.net", {
        text: province.message.replace("{{nombre}}", `${phone.nombre} con la cédula ${phone.cedula}`),
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
