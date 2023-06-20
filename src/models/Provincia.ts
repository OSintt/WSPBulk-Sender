import { model, Schema, Types } from "mongoose";
import { Province } from "../types/types";
const ProvinciaSchema = new Schema({
  name: String,
  message: String,
  numbers: [{ type: Types.ObjectId, ref: "Number" }],
});

export default model<Province>("Provincia", ProvinciaSchema);
