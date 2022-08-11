import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  name: { type: String; required: true };
  email: { type: String; required: true };
  phone: { type: String; required: false };
  password: { type: String; required: true };
  textAlert: { type: Boolean; required: true };
  emailAlert: { type: Boolean; required: true };
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  textAlert: { type: Boolean, required: true },
  emailAlert: { type: Boolean, required: true },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
