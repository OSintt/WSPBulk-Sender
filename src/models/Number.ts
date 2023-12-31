import { Schema, Types, model } from "mongoose";
import { NumberModel } from "../types/types";
const NumberSchema = new Schema<NumberModel>({
  _id: Types.ObjectId,
  nombre: String,
  cedula: {
    type: String,
    required: true,
    unique: true
  },
  provincia: {
    type: Types.ObjectId,
    ref: 'Provincia'
  },
  fecha_defuncion: Date,
  telefono: {
    type: String,
    required: true,
    unique: true,
  },
  eliminar: {
    type: Boolean,
    default: false,
  },
  mensajes: [{
    type: Types.ObjectId,
    ref: 'Message'
  }],
  enviado: {
    default: false,
    type: Boolean
  },
  email: String,
  causa: String,
});

export default model<NumberModel>("Number", NumberSchema);
