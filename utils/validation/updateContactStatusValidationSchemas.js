const Joi = require("joi");

const updateContactStatusValidationSchemas = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { updateContactStatusValidationSchemas };
