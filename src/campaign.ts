import { Params } from "./types/types";
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
    (phones.length * interval) / 60,
    "minutes"
  );
  for (let i = 0; i < updatedPhones.length; i++) {
    const phone = updatedPhones[i];
    try {
      await client.sendMessage(phone.phone + "@s.whatsapp.net", {
        text: province.message.replace("{{nombre}}", phone.nombre),
      });
      console.log(phone.phone);
      await delay(interval * 1000);
    } catch (e) {
      console.error("failed", phone.nombre, phone.phone, e);
    }
  }
};

export default campaign;
