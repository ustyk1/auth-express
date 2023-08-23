const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const app = express();
const authRouter = require('./authRouter');

app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://eugeniaustyk1:Qwerty-1@cluster1.en1agfw.mongodb.net/project?retryWrites=true&w=majority')
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