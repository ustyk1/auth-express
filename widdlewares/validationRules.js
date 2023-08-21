const passwordValidator = require('password-validator');

const schema = new passwordValidator();

schema
.is().min(8)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); 

exports.passwordCheck = (req, res, next) => {
  const { password } = req.body;

  const validationsErrors = schema.validate(password, { list: true });

  if (validationsErrors.includes('min')) {
    return res.status(400).json({ message: 'Password must be longer than 8 characters.' });
  }

  if (validationsErrors.includes('uppercase')) {
    return res.status(400).json({ message: 'At least one Uppercase' });
  }

  if (validationsErrors.includes('lowercase')) {
    return res.status(400).json({ message: 'At least one Lowercase' });
  }

  if (validationsErrors.includes('digits')) {
    return res.status(400).json({ message: 'At least two Number' });
  }

  if (!validationsErrors.length) {
    next();
  } else {
    return res
      .status(400)
      .json({ message: 'Validation error' })
  }
}
