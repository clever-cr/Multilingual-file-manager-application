import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    userName: String,
    password:{
      type: String,
      required: true
    }
  }
)
// const User = sequelize.define('User', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// //   preferredLanguage: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //     defaultValue: 'en',
// //   },
// });


export default mongoose.model("User",Schema);
