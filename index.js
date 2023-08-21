const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const app = express();
const authRouter = require('./authRouter');

app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
  try {
    mongoose.connect('mongodb+srv://eugeniaustyk1:Qwerty-1@cluster1.en1agfw.mongodb.net/project?retryWrites=true&w=majority');
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();