const Joi = require("joi");

const contactValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk", "ua"] },
    })
    .required(),
  phone: Joi.string()
    .regex(
      /\+?\d{1,4}?[ .\-\s]?\(?\d{1,3}?\)?[ .\-\s]?\d{1,4}[ .\-\s]?\d{1,4}[ .\-\s]?\d{1,9}/
    )
    .required(),

  favorite: Joi.boolean().required(),
});

module.exports = { contactValidationSchema };
