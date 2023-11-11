const { contactValidationSchema } = require("./contactsValidationSchemas");
const {
  updateContactStatusValidationSchemas,
} = require("./updateContactStatusValidationSchemas");

module.exports = {
  contactValidationSchema,
  updateContactStatusValidationSchemas,
};
