import { model, Schema } from 'mongoose';

const RecaudoSchema = new Schema({
    content: String,
    province: String
});

export default model('RecaudoMessage', RecaudoSchema);