import express from 'express';
import router from './routes';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'], // Разрешённые HTTP методы
  allowedHeaders: ['Content-Type'], // Разрешённые заголовки
};

if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in .env file');
}

//
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use('/rest/v1/', router);

mongoose
  .connect(mongoUri as string)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    if (err instanceof Error) {
      console.error(`Error connecting to MongoDB: ${err.message}`);
    } else {
      console.error('Unknown error connecting to MongoDB');
    }
  });
