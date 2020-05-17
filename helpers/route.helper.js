const Joi = require("joi");

module.exports = {
  validateBody: schema => {
    return (req, res, next) => {
      // Validate the user input based on the authSchema
      const result = Joi.validate(req.body, schema);

      // Return error if the input is invalid
      if (result.error) return res.status(400).json(result.error);

      // Assign the validated data
      if (!req.value) req.value = {};
      req.value.body = result.value;

      // Call the callback function
      return next();
    };
  },
  schemas: {
    registerSchema: Joi.object().keys({
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required()
    }),
    registerFinalSchema: Joi.object().keys({
      method: Joi.string().required(),
      local: Joi.object().required()
      // email: Joi.string()
      //   .email({ minDomainAtoms: 2 })
      //   .required(),
      // password: Joi.string().required(),
      // firstName: Joi.string().required(),
      // lastName: Joi.string().required(),
      // birthDate: Joi.number().required(),
      // currentStatus: Joi.string().required(),
      // country: Joi.string().required(),
      // city: Joi.string().required(),
      // genre: Joi.string().required(),
      // zipCode: Joi.string().required(),
      // phoneNumber: Joi.string().required(),
    }),
    authSchema: Joi.object().keys({
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required(),
      password: Joi.string().required()
    }),
    forgotPasswordSchema: Joi.object().keys({
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required()
    })
  }
};
