import express from "express";
import mysql from "mysql2";
import "dotenv/config";
import mongoose from "mongoose";
import routes from "./routes/index.js";
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", routes);

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
//   });
const db = process.env.DB_URL;

mongoose.connect(db).then(() => {
  console.log("Database connected successfully");
});

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to Database:', err);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
