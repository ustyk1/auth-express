const validationRegistrationSchema = {
  email: {
    isEmpty: { 
      errorMessage: 'Пошта має бути заповнена',
      trim: true,
      negated: true,
      bail: true
    },
    isEmail: { 
      errorMessage: 'Пошта невалідна',
      bail: true,
    } 
  },
  firstName: {
    trim: true,
    notEmpty: {
      errorMessage: 'FirstName має бути заповненим',
    },
    isString: {
      errorMessage: 'FirstName має бути строкою',
    }
  },
  lastName: {
    trim: true,
    notEmpty: {
      errorMessage: 'LastName має бути заповненим',
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
};

const validationPasswordSchema = {
  newPassword: {
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
        if (req.body.newPassword === req.body.confirmPassword) {
          return true;
        } else {
          return false;
        }
      },
      errorMessage: 'Підтвердження пароля не відповідає паролю'
    }
  }
};

const validationUpdateUserSchema = {
  userId: {
    isEmpty: {
      errorMessage: 'UserId має бути заповненим',
      trim: true,
      negated: true,
      bail: true
    },
    trim: true,
    isString: {
      errorMessage: 'UserId має бути строкою',
    }
  },
  firstName: {
    optional: true,
    trim: true,
    isString: {
      errorMessage: 'FirstName має бути строкою',
    }
  },
  lastName: {
    optional: true,
    trim: true,
    isString: {
      errorMessage: 'LastName має бути строкою',
    }
  },
  email: {
    optional: true,
    isEmail: {
      errorMessage: 'Пошта невалідна'
    }
  },
  sex: {
    optional: true,
    isString: {
      errorMessage: 'Sex має бути строкою',
    },
    isIn: { options: [['male', 'female']] },
  },
  phone: {
    optional: true,
    trim: true,
    isString: true
  }
};

module.exports = {
  validationRegistrationSchema,
  validationUpdateUserSchema,
  validationPasswordSchema
};