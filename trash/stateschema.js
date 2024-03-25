app.get("/city", async (req, res) => {
    const thisUser = req.user
    const message = req.flash('message');
    req.flash('message', "")
    // console.log(indiaStates);
    try {
        if (req.isAuthenticated()) {
            const rData = await StateSchema.find();
            const cityData = await CitySchema.find()
            res.render('city', { thisUser, rData, cityData, message });
        }
        else {
            res.redirect('/')
        }
    } catch (e) {
        console.log(e)
    }
})
app.get('/city/get_cities', async (req, res) => {
    try {
        console.log(req.query.state)
        const temp = City.getCitiesOfState("IN", req.query.state)
        res.json(temp)
    }
    catch (e) {
        console.log(e);
        res.redirect('/')
    }
});
// addding city data post req
app.post('/get_cities', async (req, res) => {
    try {
        const temp = State.getStateByCodeAndCountry(req.body.state, "IN")
        const c = new CitySchema({ User_id: req.body.User_id, State: temp.name, City_Name: req.body.City })
        await c.save()
        req.flash('message', 'City Saved SuccesFully')
        res.redirect('/city')
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})
// delete city
app.post('/deleteCity',async(req,res)=>{
    try {
        await CitySchema.deleteOne({_id:req.body.cid})
        req.flash('message','1 city deleted')
        res.redirect('/city')
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})






const express = require("express");
const bodyParser = require('body-parser')
const path = require("path");
const mongoose = require("mongoose");
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
    State:{
        type: String,
        required: true,
    },
    City_Name:{
        type: String,
        required: true,
    }
})
const CitySchema = mongoose.model("city", newschema);
module.exports = {
    CitySchema
        };






