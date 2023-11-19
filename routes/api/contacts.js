const express = require("express");

const router = express.Router();

const jsonParser = express.json();

const ContactsControllers = require("../../controllers/сontacts.controllers");
const { validateBody } = require("../../utils/validateBody");

const {
  contactValidationSchema,
  updateContactStatusValidationSchemas,
} = require("../../utils/validation/index");

router
  .route("/")
  .get(ContactsControllers.listContacts)
  .post(
    jsonParser,
    validateBody(contactValidationSchema),
    ContactsControllers.addContact
  );

router
  .route("/:contactId")
  .get(ContactsControllers.getContactById)
  .delete(ContactsControllers.removeContact)
  .put(jsonParser, ContactsControllers.updateContact);

router.patch(
  "/:contactId/favorite",
  jsonParser,
  validateBody(updateContactStatusValidationSchemas),
  ContactsControllers.updateStatusContact
);

module.exports = { contactsRouter: router };
