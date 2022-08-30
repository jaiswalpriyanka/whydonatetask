const {check, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

     const extractedErrors = []
      errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
    
      return res.status(400).json({
        status:false,
        message: extractedErrors,
      });
    }
    next();
}

const validateR = {
    validate
  };
  module.exports = validateR;