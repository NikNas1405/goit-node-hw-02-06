const {
  contactValidationSchema,
  updateContactStatusValidationSchemas,
} = require("./contactsValidationSchemas");

const { userValidationSchema } = require("./userValidationSchemas");

module.exports = {
  contactValidationSchema,
  updateContactStatusValidationSchemas,
  userValidationSchema,
};
