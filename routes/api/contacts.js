const express = require("express");
const router = express.Router();
const jsonParser = express.json();

const ContactsControllers = require("../../controllers/controllers");

router.get("/", ContactsControllers.listContacts);

router.get("/:contactId", ContactsControllers.getContactById);

router.post("/", jsonParser, ContactsControllers.addContact);

router.delete("/:contactId", ContactsControllers.removeContact);

router.put("/:contactId", jsonParser, ContactsControllers.updateContact);

router.patch(
  "/:contactId/favorite",
  jsonParser,
  ContactsControllers.updateStatusContact
);

module.exports = { contactsRouter: router };
