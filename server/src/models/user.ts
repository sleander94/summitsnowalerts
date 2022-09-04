import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  _id: any;
  name: string;
  email: string;
  phone: string;
  password: string;
  notifications: {
    text: boolean;
    email: boolean;
    times: timesObj;
    days: daysObj;
  };
  mountains: mountainsObj;
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    notifications: {
      text: { type: Boolean, required: true },
      email: { type: Boolean, required: true },
      times: { type: Object, required: true },
      days: {
        sunday: { type: Boolean, required: true },
        monday: { type: Boolean, required: true },
        tuesday: { type: Boolean, required: true },
        wednesday: { type: Boolean, required: true },
        thursday: { type: Boolean, required: true },
        friday: { type: Boolean, required: true },
        saturday: { type: Boolean, required: true },
      },
    },
    mountains: { type: Object, required: true },
  },
  { minimize: false }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;

export interface timesObj {
  0: boolean;
  1: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
  5: boolean;
  6: boolean;
  7: boolean;
  8: boolean;
  9: boolean;
  10: boolean;
  11: boolean;
  12: boolean;
  13: boolean;
  14: boolean;
  15: boolean;
  16: boolean;
  17: boolean;
  18: boolean;
  19: boolean;
  20: boolean;
  21: boolean;
  22: boolean;
  23: boolean;
}

export interface daysObj {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

export interface mountainsObj {
  Breckenridge?: number;
  Keystone?: number;
  Vail?: number;
  Monarch?: number;
  'Arapahoe Basin'?: number;
  Copper?: number;
  'Winter Park'?: number;
  Steamboat?: number;
  'Beaver Creek'?: number;
  'Crested Butte'?: number;
  Eldora?: number;
  Aspen?: number;
}
