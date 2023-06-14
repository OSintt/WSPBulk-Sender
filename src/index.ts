import * as wbm from "wbm";
import * as XLSX from "xlsx";
import * as path from "path";
import * as fs from "fs/promises";

const filePath = path.join(__dirname, "xlsx");

class Phone {
  phone: string;
  name: string;
}

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

wbm
  .start()
  .then(async () => {
    const phones = await getPhones();
    console.log(phones);
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
    await wbm.send(phones, message);
    await wbm.end();
  })
  .catch((e) => console.log(e));
