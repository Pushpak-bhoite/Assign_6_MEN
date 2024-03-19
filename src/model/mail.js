const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     port: 587,
//     debug: true,
//     secure: false,
//     auth: {
//         user: 'anushka.adcs@gmail.com',
//     }
// });
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    debug: true,
    secure: true,
    auth: {
        user: 'pushpakbhoitephotos@gmail.com',
        pass: 'gjgb xulv oujv gtnm'
    }
});
 
module.exports = transporter;