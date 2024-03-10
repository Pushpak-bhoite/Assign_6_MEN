const mongoose = require("mongoose");
const validator = require("validator");

const registrationSchema = new mongoose.Schema({
    ffname: {
        type: String,
        required: false,
        minlength: 3
    },
    flname: {
        type: String,
        required: false,
        minlength: 3
    },
    fphone: {
        type: Number,
        required: false,
        // minlength: 10, // assuming mobile number is 10 digits long
        // maxlength: 10
    },
    fgender: {
        type: String,
        enum: ['male', 'female'], // only allow 'male' or 'female'
        required: false
    },
    fmail: {
        type: String,
        required: false,
        minlength: 3,
        // validate: [validator.isEmail, 'Invalid email'] // validate email format using validator library
    },
    fpass: {
        type: String,
        required: false,
        minlength: 1 // assuming minimum password length is 8 characters
    }
}, { versionKey: false });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
