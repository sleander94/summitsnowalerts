import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  textAlert: boolean;
  emailAlert: boolean;
  mountains: mountainsObj;
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

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  textAlert: { type: Boolean, required: true },
  emailAlert: { type: Boolean, required: true },
  mountains: { type: Object, required: true },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
