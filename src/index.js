const express = require('express')
const app = express();

const path = require('path')
const ejs = require('ejs')
const mydb = require('./model/db')
const { User, Product, Region } = require('./model/schema') //now we are gonna use newTodo as an class
const MethodOverride = require('method-override');
const { initializingPassport, isAuthenticated } = require('./model/passportConfig');
const LocalStrategy = require("passport-local").Strategy;

const passport = require('passport');
const expressSession = require('express-session');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const transporter = require("./model/mail");
const flash = require("express-flash");

const port = process.env.PORT || 3000;

// Call Functions
mydb();

//------------Middlewares-------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(MethodOverride('_method'));
app.use(MethodOverride('_method'));
// static files
app.use(express.static(path.join(__dirname, '../template/views')));

app.set('view engine', 'ejs');
app.set('views', path.join('../template/views'));


/*--------------------------------- PASSPORT --------------------------------- */
// below middlewears are for the sake of passport authentication
app.use(expressSession({  //this  MV(middleweare) should be before below  two
    secret: "secret", resave: false, saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

initializingPassport(passport);//PASSPORT=this function working as middleware check it out


let sessionData;
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),
    async (req, res) => {
        sessionData = req.user             //session stored
        try {
            if (req.isAuthenticated()) {
                res.redirect('/dashboard')
            }
            else {
                req.flash('message','')
            }
        } catch (error) {
            res.send(error);
        }
    });

app.get("/users", isAuthenticated, async (req, res) => {
    try {
        const UserData = await User.find();
        const ProductData = await Product.find();
        res.render('users', {
            Udata: UserData,
            Sdata: sessionData,
            Pdata: ProductData,
        })
    } catch (error) {
        res.send('An error occured ==>> ' + error);
    }
})

app.get("/logout", (req, res) => {

    console.log("Helloooo")
    req.logout(function (err) {
        if (err) {
            return res.status(500).send("An error occurred during logout");
        }
        res.redirect("/");
    });
});

/*--------------------------------- ROUTS --------------------------------- */

app.get("/", async (req, res) => {
    try {
        const flashMsg = req.flash('message')
        res.render('pandalogin',{flashMsg});
        req.flash('message','')
    } catch (error) {
        res.send(error);
    }
})

app.get("/register", async (req, res) => {
    res.render('index')
})

app.get("/dashboard", isAuthenticated, async (req, res) => {
    try {
        const UserData = await User.find();
        const ProductData = await Product.find();
        // const PRefData = await Product.find().populate("65f0b05b3bae264704aa3746");
        // console.log(PRefData);
        res.render('dashboard', {
            Udata: UserData,
            Sdata: sessionData,
            Pdata: ProductData,
        })
    } catch (error) {
        res.send('An error occured ==>> ' + error);
    }
})

//========================== CRAETE ==========================

app.post("/register", async (req, res) => {
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ fmail: req.body.fmail });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }

        // Check if password matches confirm password
        if (req.body.fpass !== req.body.fcpass) {
            return res.status(400).send("Passwords do not match");
        }
        // DATA ENCRYPTION
        const hashPassword = await bcrypt.hash(req.body.fpass, 10);
        // Create a new user
        const newUser = new User({
            ffname: req.body.ffname,
            flname: req.body.flname,
            fmail: req.body.fmail,
            fphone: req.body.fphone,
            fpass: hashPassword,
            fgender: req.body.fgender
        });

        // Save the user to the database
        await newUser.save();

        // Send response indicating successful registration
        res.render('pandalogin')
    } catch (error) {
        // Handle any errors that occur during registration
        res.status(500).send("An error occurred during registration");
    }
});

app.patch("/editUser/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const newData = req.body; // Assuming the updated data is sent as 'data'
        const result = await User.findByIdAndUpdate({ _id: userId }, { $set: newData }, { new: true });
        console.log(result)

        if (!result) {
            return res.status(404).send("User not found");
        }
        // res.redirect("/dashboard"); // Redirect to the homepage or any other appropriate page after successful update
        res.redirect('/users');

    } catch (error) {
        res.status(500).send(error + "This is error");
    }
});


//---------------------------------ACTIVE -NONACTIVE USERS ---------------------------------
app.post("/stateChange/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        console.log(req.body.state === "true")

        if (req.body.state === "true") {
            console.log("hello")
            const updatedData = { state: false };

            const result = await User.findByIdAndUpdate({ _id: userId }, { $set: updatedData });
            // return result;
            res.redirect('/users');

        } else {
            console.log(" jsdbvdsj  ")

            const updatedData = { state: true };
            const result = await User.findByIdAndUpdate({ _id: userId }, { $set: updatedData });
            res.redirect('/users');

        }

    } catch (error) {
        // Handle any errors that occur during the update operation
        res.status(500).send(error);
    }
});

//---------------------------------PRODUCT ROUT ---------------------------------
app.get("/product", isAuthenticated, async (req, res) => {
    try {
        const UserData = await User.find();
        const ProductData = await Product.find();
        // const PRefData = await Product.find().populate("65f0b05b3bae264704aa3746");
        res.render('product', {
            Udata: UserData,
            Sdata: sessionData,
            Pdata: ProductData,
        })
    } catch (error) {
        res.send('An error occured ==>> ' + error);
    }
})

app.post("/product", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();

        res.redirect('product');
    } catch (error) {
        // Handle any errors that occur during registration
        res.status(500).send("An error occurred during registration");
    }

});

//--------------------------------- REGION ROUT -----------------------------------
app.get("/region", isAuthenticated, async (req, res) => {
    try {
        const RegionData = await Region.find();
        // const PRefData = await Product.find().populate("65f0b05b3bae264704aa3746");
        // console.log(RegionData+"----------------");
        res.render('region', {
            Sdata: sessionData,
            Rdata: RegionData,
        })
    } catch (error) {
        res.send('An error occured ==>> ' + error);
    }
})

app.post("/region", async (req, res) => {
    try {
        const newRegion = new Region(req.body);
        await newRegion.save();
        res.redirect('region');
    } catch (error) {
        // Handle any errors that occur during registration
        res.status(500).send("An error occurred during registration");
    }
});

// **************************RESET PASS **************************
app.get("/reset", async (req, res) => {
    res.render('resetpass')
})

app.get('/forget', (req, res) => {
    const resetToken = req.query.resettoken
    // console.log(req.query)
    console.log(resetToken)
    res.render("forget", { resetToken });
});

app.post('/reset', async (req, res) => {
    try {
        const { fmail } = req.body;
        const user = await User.findOne({ fmail: fmail });
        if (!user) {
            throw new Error('User not found');
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        req.session.resetToken = resetToken
        req.session.fmail = fmail
        user.resetTokenExpiration = Date.now() + 600000;

        console.log(resetToken + "\t" + user.resetToken + "\t" + req.session.resetToken + "\t" + req.session.fmail + "\t" + user.resetTokenExpiration)
        await user.save();

        // Create the password reset link
        const resetLink = `http://localhost:3000/forget?resettoken=${resetToken}`;
        // console.log(user.Email);

        const mailOptions = {
            from: 'pushpakbhoitephotos@gmail.com',
            to: user.fmail,
            subject: 'Password Reset Request',
            html: `<P>Please click on the following link to reset your password: ${resetLink}</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                throw new Error('Failed to send email');
            } else {
                console.log('Email sent: ');
                // res.redirect('/forget');
                res.send("link sent on email")
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/rsSuccess', async (req, res) => {
    try {
        const { password, confirm_password, resetToken } = req.body;
        console.log(req.body)
        if (password !== confirm_password) {
            throw new Error("Passwords do not match");
        }

        // const user = await Data.findOne({ Email: email, resetToken, resetTokenExpiration: { $gt: Date.now() } });
        const user = await User.findOne({ resetToken: req.body.resetToken });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.Password = hashedPassword;
        user.fpass = password;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error in resetting the password');
    }
});

//--------------------------------- LISTEN ---------------------------------

app.listen(port, () => {
    console.log("http://localhost:3000");
})










