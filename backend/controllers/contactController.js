const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

//1-Get all contacts
const getContacts = asyncHandler(async (req, res) => {
    //Tìm tất cả các contact có trong database và lưu vào mảng contacts
    const contacts = await Contact.find();
    res.status(200).json(contacts);
});

//2-Create contact
const createContacts = asyncHandler(async (req, res) => {
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("Vui lòng nhập đầy đủ dữ liệu");
    }
    const contact = await Contact.create({
        name,
        email,
        phone
    });
    res.status(201).json(contact);
});

//3-Get contact by ID
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Không tìm thấy liên hệ!");
    }
    res.status(200).json(contact);
});

//4-Update contact by ID
const updateContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Không tìm thấy liên hệ!");
    }
    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json(updateContact);
});

//5-Delete contact by ID
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Không tìm thấy liên hệ!");
    }
    await contact.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
});

module.exports = {
    getContacts,
    createContacts,
    getContact,
    updateContact,
    deleteContact,
};
