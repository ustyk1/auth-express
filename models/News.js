const {Schema, model} = require('mongoose');

const News = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
});

module.exports = model('News', News);
