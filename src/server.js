import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import i18nextMiddleware from './config/i18n.js';
import language from './middleware/language.js';
import swaggerDocs from './config/swagger.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(i18nextMiddleware);
app.use(express.json());
app.use(language);
app.use('/', swaggerDocs);
app.use('/', routes);

const db = process.env.DB_URL;

mongoose
  .connect(db, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  })
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection error:', error.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
