const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

const authRouter = require('./routers/authRouter');
const newsRouter = require('./routers/newsRouter');
const userRouter = require('./routers/userRouter');
const {db_url} = require('./config');
const cors = require('cors');

const app = express();

app.use(express.json());
const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Доступ заборонено'));
    }
  },
};
app.use(cors(corsOptions));

// app.use(cors({
//   origin: 'http://localhost:5173',
//   // origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true
// }));

app.use('/auth', authRouter);
app.use('/news', newsRouter);
app.use('/user', userRouter);

const start = async () => {
  try {
    await mongoose.connect(db_url)
      .then(
        () => console.log('DB connected'),
        err => console.log('DB connection error: ', err)
      );
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log('ar Start error: ', error);
  }
}

start();