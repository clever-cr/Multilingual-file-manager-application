import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import passport from "./config/passportConfig.js";
import session from "express-session";
import i18next from "i18next";
import ii18nextMiddleware from "i18next-http-middleware";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(ii18nextMiddleware.handle(i18next));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUnitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);

const db = process.env.DB_URL;

mongoose.connect(db).then(() => {
  console.log("Database connected successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
