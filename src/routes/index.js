import express from 'express';
import authroute from './authRoute.js';
import fileroute from './fileRoutes.js';
import { setUserLanguage } from '../middleware/setUserLanguage.js';
import { protect } from '../middleware/protect.js';

const app = express();
app.use('/', authroute);
// app.use('/', protect, setUserLanguage, fileroute);

export default app;
