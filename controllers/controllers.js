const Contacts = require("../models/contact");

const {
  contactValidationSchema,
  updateContactStatusValidationSchemas,
} = require("../utils/validation");

const listContacts = async (req, res, next) => {
  try {
    const contacts = await Contacts.find().exec();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contacts.findById(contactId).exec();
    if (!contact) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = contactValidationSchema.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ message: "missing required name field" });
    }
    const newContact = await Contacts.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const removedContact = await Contacts.findByIdAndDelete(contactId);
    if (!removedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({
      message: "contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const { error } = contactValidationSchema.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ message: "missing fields" });
    }
    const updatedContact = await Contacts.findByIdAndUpdate(
      contactId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const { error } = updateContactStatusValidationSchemas.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ message: "missing field favorite" });
    }
    const updatedContact = await Contacts.findByIdAndUpdate(
      contactId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
