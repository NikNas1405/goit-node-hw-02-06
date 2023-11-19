const { HttpError } = require("../utils/HttpError");
const Contacts = require("../models/contact.model");

async function listContactsServices(owner) {
  return await Contacts.find(owner).exec();
}

async function getContactByIdServices(contactId, owner) {
  const contact = await Contacts.findById(contactId).exec();

  if (!contact) {
    throw new HttpError(404, "Not found");
  }

  if (contact.owner && contact.owner.toString() !== owner) {
    throw new HttpError(403, "Forbidden");
  }

  return contact;
}

async function addContactServices(body, owner) {
  const newContact = await Contacts.create({ ...body, owner });
  return newContact;
}

async function removeContactServices(contactId, owner) {
  const removedContact = await Contacts.findByIdAndDelete(contactId);

  if (!removedContact) {
    throw new HttpError(404, "Not found");
  }
  if (removedContact.owner && removedContact.owner.toString() !== owner) {
    throw new HttpError(403, "Forbidden");
  }
}

async function updateContactServices(contactId, body, owner) {
  const updatedContact = await Contacts.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (updatedContact.owner.toString() !== owner) {
    throw new HttpError(403, "Forbidden");
  }

  if (!updatedContact) {
    throw new HttpError(404, "Not found");
  }
  return updatedContact;
}

async function updateStatusContactServices(contactId, body, owner) {
  const updatedContact = await Contacts.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (updatedContact.owner.toString() !== owner) {
    throw new HttpError(403, "Forbidden");
  }

  if (!updatedContact) {
    throw new HttpError(404, "Not found");
  }
  return updatedContact;
}

module.exports = {
  listContactsServices,
  getContactByIdServices,
  addContactServices,
  updateContactServices,
  removeContactServices,
  updateStatusContactServices,
};
