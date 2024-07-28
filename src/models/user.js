import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  { timestamps: true }
);

Schema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', Schema);
