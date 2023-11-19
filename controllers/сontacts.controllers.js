const {
  listContactsServices,
  getContactByIdServices,
  addContactServices,
  removeContactServices,
  updateContactServices,
  updateStatusContactServices,
} = require("../services/contacts.services");

const controllerWrapper = require("../utils/controllerWrapper");

const listContacts = controllerWrapper(async (req, res, next) => {
  const { id: owner } = req.user;
  
  const contacts = await listContactsServices(owner);
  res.status(200).json(contacts);
});

const getContactById = controllerWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const { id: owner } = req.user;
  const contact = await getContactByIdServices(contactId, owner);
  res.status(200).json(contact);
});

const addContact = controllerWrapper(async (req, res, next) => {
  const { id: owner } = req.user;
  const newContact = await addContactServices(req.body, owner);
  res.status(201).json(newContact);
});

const removeContact = controllerWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const { id: owner } = req.user;
  await removeContactServices(contactId, owner);
  res.json({
    message: "contact deleted",
  });
});

const updateContact = controllerWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const { id: owner } = req.user;
  const updatedContact = updateContactServices(contactId, req.body, owner);
  res.status(200).json(updatedContact);
});

const updateStatusContact = controllerWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const { id: owner } = req.user;
  const updatedContact = updateStatusContactServices(
    contactId,
    req.body,
    owner
  );
  res.status(200).json(updatedContact);
});

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
