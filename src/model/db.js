const mongoose = require('mongoose')

function mydb(){

mongoose.connect("mongodb://localhost:27017/myDatabase")
.then(()=>{
    console.log("connection established")
})
.catch((err)=>{
    console.log("No connection")
})

}

module.exports = mydb;