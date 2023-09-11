const {Schema, model} = require('mongoose');
const {isBoolean} = require("validator");

const User = new Schema({
  firstName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{type: String, ref: 'Role'}],
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  isActivated: {
    type: Boolean,
    default: false
  }
}); 

//mongoose додасть id самостійно

module.exports = model('User', User);
