const express = require("express");
const bodyParser = require('body-parser')
const path = require("path");
const mongoose = require("mongoose");
const Country = require('country-state-city').Country;
const State = require('country-state-city').State;
const port = 3000;
const app = express();
// database
mongoose.connect("mongodb://localhost:27017/Task");
// schema
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
const StateSchema = mongoose.model("StateSchema", newschema);
module.exports = {
            StateSchema
        };

