const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const app = express();
const authRouter = require('./routers/authRouter');
const newsRouter = require('./routers/newsRouter');
const userRouter = require('./routers/userRouter');
const {db_url} = require('./config');

app.use(express.json());
app.use('/auth', authRouter);
app.use('/news', newsRouter);
app.use('/user', userRouter);

const start = async () => {
  try {
    await mongoose.connect(db_url)
      .then(
        () => console.log('DB connected'),
        err => console.log(err)
      );
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();