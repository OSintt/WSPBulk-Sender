import { Schema, Types, model } from "mongoose";
const NumberSchema = new Schema({
  _id: Types.ObjectId,
  nombre: String,
  cedula: {
    type: String,
    required: true,
  },
  fecha_defuncion: Date,
  telefono: {
    type: String,
    required: true,
  },
  eliminar: {
    type: Boolean,
    default: false,
  },
  email: String,
  causa: String,
});

export default model("Number", NumberSchema);
