const mongoose = require("mongoose");
const validator = require("validator");

const express = require("express");
const bodyParser = require('body-parser')
const path = require("path");
const Country = require('country-state-city').Country;
const State = require('country-state-city').State;
const port = 3000;
const app = express();

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
    },
    state: {
        type: Boolean,
        default: true // Default value can be true or false depending on your requirement
    },
    resetToken: {
        type: String,
        default: null,
    },
    photo: {
        type: String,
        default: './img/boyPic.png'
    },

}, { versionKey: false });

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming there's a User model associated with this
    },
    pname: {
        type: String,
        required: true
    },
    pquantity: {
        type: Number,
        required: true,
        min: 1
    },
    pprice: {
        type: Number,
        required: true,
        min: 1
    }
}, { versionKey: false });


// REGION SCHEMA
const regionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming there's a User model associated with this
        required: true
    },
    regionCountry: {
        type: String,
        required: true
    },
    regionState: {
        type: String,
        required: true
    },
    regionCity: {
        type: String,
        required: true
    }
}, { versionKey: false });


const newschema = new mongoose.Schema({
    User_id: {
        type: String,
        required: true,
    },
    State: {
        type: String,
        required: true,
    },
    State_code:{
        type: Number,
        required: true,
    },
    State_ISOcode:{
        type: String,
        required: true,
    }
})



const Region = mongoose.model('Region', regionSchema);
const User = mongoose.model('Registration', registrationSchema);
const Product = mongoose.model('Product', productSchema);
const StateSchema = mongoose.model("StateSchema", newschema);





module.exports = {
    User,
    Product,
    Region,
    StateSchema
};

