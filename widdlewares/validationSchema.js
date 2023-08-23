const validationSchema = {
  email: {
    isEmpty: { 
      errorMessage: 'Пароль має бути заповненим',
      trim: true,
      negated: true,
      bail: true
    },
    isEmail: { 
      errorMessage: 'Пароль невалідний', 
      bail: true,
    } 
  },
  userName: {
    trim: true,
    notEmpty: {
      errorMessage: 'UserName має бути заповненим',
    },
    isString: {
      errorMessage: 'UserName не має бути числом',
    }
  },
  surname: {
    trim: true,
    notEmpty: {
      errorMessage: 'Surname має бути заповненим',
    },
  },
  password: {
    trim: true,
    notEmpty: {
      errorMessage: 'Пароль має бути заповненим',
    },
    isLength: { 
      options: { min: 8, max: 16 },
      errorMessage: 'Пароль має містити щонайменше 8 символів та максимум',
    },
    matches: { 
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      errorMessage: 'Пароль має містити хоча б одну велику та малу літери, одне число та символ',
   }
  },
  confirmPassword: {
    trim: true,
    notEmpty: {
      errorMessage: 'Підтвердження пароля має бути заповненим',
    },
    custom: {
      options: (value, {req}) => {
        if (req.body.password === req.body.confirmPassword) {
          return true;
        } else {
          return false;
        }
      }, 
      errorMessage: 'Підтвердження пароля не відповідає паролю'
    }
  },
  sex: {
    trim: true,
    notEmpty: {
      errorMessage: 'Стать має бути заповнена',
    },
    isIn: { options: [['male', 'female']] },
  },
  phone: {
    trim: true,
    notEmpty: {
      errorMessage: 'Номер телефону має бути заповнений',
    },
    isString: true
  }
}

module.exports = validationSchema;