import express from "express";
import mysql from "mysql2";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });