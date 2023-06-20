
import { Document }  from 'mongoose';

export class Phone {
  phone: string;
  name: string;
}

export interface Province extends Document {
  numbers: Phone[];
  name: string;
  message: string;
}