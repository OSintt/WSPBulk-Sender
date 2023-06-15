import RecaudoMessage from "./models/RecaudoMessage";
import { Phone } from "./types/types";

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

  const message = `Estimado(a) cliente {{nombre}}
    Este comunicado es para informarle que mantiene un valor pendiente de pago en instancia
    EXTRAJUDICIAL, relacionado al servicio FIJO - MOVIL prestado/s por la CNT EP.
    El no pago de los valores antes detallados dará derecho a la Corporación Nacional de Telecomunicaciones
    CNT-E.P., a continuar con el PROCESO DE COBRO MEDIANTE LA EJECUCIÓN COACTIVA de acuerdo con la
    normativa legal vigente, misma que permite interponer medidas cautelares como el Bloqueo de Cuentas
    bancarias y demás.
    Le solicitamos se ACERQUE a la brevedad posible a cancelar sus obligaciones en las oficinas de la
    CORPORACIÓN NACIONAL DE TELECOMUNICACIONES E.P., en la agencia que se encuentre más cercana a
    su domicilio, estas se encuentran ubicadas en:
    ●
    Quevedo: Av. June Guzmán Y Séptima, esquina Piso 1 (lunes - viernes, 08:00 a 16:00)
    Babahoyo: Juan X Marcos entre Eloy Alfaro Y Rocafuerte, planta baja (lunes - viernes, 08:00 a 16:00)
    Agencias en las cuales podrá acceder a diferentes formas de pago, entre esas el pago diferido de sus
    obligaciones mediante su TARJETA DE CRÉDITO preferida.`;
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
        console.log("message sent to", phone.name, phone.phone, "succesfully");
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
