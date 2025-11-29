// src/middlewares/validate.js

// DISABLED express-validator middleware so file upload + form-data works.
// Always calls next(), never blocks request.

module.exports = (req, res, next) => {
  next();
};
