const {Schema, model} = require('mongoose');

const User = new Schema({
  userName: {
    type: String, 
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{type: String, ref: 'Role'}],
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  confirmPassword: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
}); 

//mongoose додасть id самостійно

module.exports = model('User', User);
