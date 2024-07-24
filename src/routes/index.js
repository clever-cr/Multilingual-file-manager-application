import express from "express";
import authroute from "./authRoute.js"
import fileroute from "./fileRoutes.js"

const app = express();
app.use("/",authroute);
app.use("/", fileroute);

export default app;