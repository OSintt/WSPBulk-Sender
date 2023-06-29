import { Schema, model, Types } from 'mongoose';
import { Message as MessageType } from '../types/types';
const MessageSchema = new Schema({
  author: {
    type: Types.ObjectId,
    ref: 'Number'
  },
  content: String,
  date: Date
});

export default model<MessageType>('Message', MessageSchema);