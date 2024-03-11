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
    },
    frole: {
        type: String,
        default: "User"
    }


}, { versionKey: false });


const productSchema = new mongoose.Schema({
    pname: {
        type: String,
        required: true,
        minlength: 3
    }
}, { versionKey: false })

const User = mongoose.model('Registration', registrationSchema);
const Product = mongoose.model('Product', productSchema);

// module.exports = Registration;

module.exports = {
    User,
    Product
};

