import express from "express";
import authroute from "./authRoute.js"

const app = express();
app.use("/",authroute);

export default app;