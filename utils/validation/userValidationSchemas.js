const Joi = require("joi");

const userValidationSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk", "ua"] },
    })
    .required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

module.exports = { userValidationSchema };
