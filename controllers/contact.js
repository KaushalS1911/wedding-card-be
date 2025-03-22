const asyncHandler = require('express-async-handler');
const ContactModel = require('../models/contact');

// Create a contact
const createContact = asyncHandler(async (req, res) => {
    const {email, topic, name, description} = req.body;

    const contactExist = await ContactModel.exists({email});
    if (contactExist) throw new Error('Contact with this email already exists');

    const newContact = await ContactModel.create(req.body);

    res.status(201).json({data: newContact, message: 'Contact created successfully'});
});

// Get all contacts
const contacts = asyncHandler(async (req, res) => {
    const contacts = await ContactModel.find({});
    res.status(200).json({data: contacts});
});

// Get a single contact by ID
const contactById = asyncHandler(async (req, res) => {
    const contact = await ContactModel.findById(req.params.id);
    if (!contact) throw new Error('Contact not found');

    res.status(200).json({data: contact});
});

// Update a contact
const updateContact = asyncHandler(async (req, res) => {
    const contact = await ContactModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if (!contact) throw new Error('Contact not found');

    res.status(200).json({data: contact, message: 'Contact updated successfully'});
});

// Delete a contact
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await ContactModel.findByIdAndDelete(req.params.id);
    if (!contact) throw new Error('Contact not found');

    res.status(200).json({message: 'Contact deleted successfully'});
});

module.exports = {createContact, contacts, contactById, updateContact, deleteContact};
