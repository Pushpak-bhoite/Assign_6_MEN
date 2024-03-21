const express = require('express')
const app = express();

const ejs = require('ejs')
const mydb = require('./model/db')
const { User, Product, Region ,StateSchema } = require('./model/schema') //now we are gonna use newTodo as an class
const MethodOverride = require('method-override');
const { initializingPassport, isAuthenticated } = require('./model/passportConfig');
const LocalStrategy = require("passport-local").Strategy;

const passport = require('passport');
const expressSession = require('express-session');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const transporter = require("./model/mail");
const flash = require("express-flash");
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path')
const { State, City } = require('country-state-city')


const methodOverride = require('method-override');

const port = process.env.PORT || 3000;

// Call Functions
mydb();

//------------Middlewares-------------
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
                req.flash('message', '')
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
        res.render('pandalogin', { flashMsg });
        req.flash('message', '')
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
app.post('/register', async (req, res) => {
    //  console.log(req);
    try {
        var form = new formidable.IncomingForm();
        let newpath;
        let oldPath;
        let result;
        try {
            // [fields, files] = await form.parse(req);'

            form.parse(req, async function (err, fields, files) {

                oldPath = files.profilePic[0].filepath;
                newpath = path.join(__dirname, '../template/views/uploads/' + "/" + files.profilePic[0].originalFilename);
                const hexaPass = await bcrypt.hash(fields.fpass[0], 10);
                if (files) {
                    const newUser = new User({
                        ffname: fields.ffname[0],
                        flname: fields.flname[0],
                        fphone: fields.fphone[0],
                        fgender: fields.fgender[0],
                        fmail: fields.fmail[0],
                        fpass: hexaPass,
                        photo: files.profilePic[0].originalFilename
                    });
                    result = await newUser.save();
                    // console.log(newUser);
                    let UserID = result._id.toString()
                    var folderpath = path.join(__dirname, '../template/views/uploads/' + UserID);
                    if (!fs.existsSync(folderpath)) {
                        fs.mkdirSync(path.join(__dirname, '../template/views/uploads/' + UserID));
                    }
                    var newpath = path.join(__dirname, '../template/views/uploads/' + UserID + "/" + files.profilePic[0].originalFilename);
                    // let  og_file_path = path.join(__dirname, '../template/views/uploads') + '/' + files.profilePic[0].originalFilename;
                    fs.copyFile(oldPath, newpath, function (err) {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Internal Server Error');
                        }
                    });
                }
            })
            res.send("Registered Successfully");

        }
        catch (err) {
            console.log(err)
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).redirect('/register');
    }
});


// Edit profile route
app.post("/editUser", async (req, res) => {
    try {
        var form = new formidable.IncomingForm();
        let newpath;
        let oldPath;
        let result;
        try {
            form.parse(req, async function (err, fields, files) {
                oldPath = files.profilePic[0].filepath;
                const userId = fields._id[0];
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).send("User not found");
                }
                if (files) {
                    const result = await User.updateOne(
                        { _id: userId },
                        {
                            $set: {
                                ffname: fields.ffname[0],
                                flname: fields.flname[0],
                                fphone: fields.fphone[0],
                                fgender: fields.fgender[0],
                                fmail: fields.fmail[0],
                                photo: files.profilePic[0].originalFilename
                            }
                        }
                    );
                    var folderpath = path.join(__dirname, '../template/views/uploads/' + userId);
                    if (!fs.existsSync(folderpath)) {
                        fs.mkdirSync(path.join(__dirname, '../template/views/uploads/' + userId));
                    }
                    newpath = path.join(__dirname, '../template/views/uploads/' + userId + "/" + files.profilePic[0].originalFilename);
                    // let  og_file_path = path.join(__dirname, '../template/views/uploads') + '/' + files.profilePic[0].originalFilename;
                    fs.copyFile(oldPath, newpath, function (err) {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Internal Server Error');
                        }
                    });
                }
            })
            res.redirect("/dashboard");

        }
        catch (err) {
            console.log(err)
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).redirect('/register');
    }
});




app.get('/editUsers', async (req, res) => {
    try {
        const UserData = await User.find();
        const ProductData = await Product.find();
        // const PRefData = await Product.find().populate("65f0b05b3bae264704aa3746");
        // console.log(PRefData);
        res.render('editUsers', {
            Udata: UserData,
            Sdata: sessionData,
            Pdata: ProductData,
        })
    } catch (error) {
        res.send('An error occured ==>> ' + error);
    }
})

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


//--------------------------------- UPLOAD IMAGE ---------------------------------
app.get('/upload', (req, res) => {
    res.render('upload')
})

app.post('/upload', (req, res, next) => {
    console.log(req.body.mydata + "***********")
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        if (err) {
            console.log(err);
            return res.status(500).send('intenal server Error ')
        }

        // Check if files were uploaded
        if (!files || !files.profilePic || !files.profilePic.length) {
            return res.status(400).send('No files uploaded or incorrect field name');
        }

        let oldPath = files.profilePic[0].filepath;
        let newPath = path.join(__dirname, '../template/views/uploads') + `/` + files.profilePic[0].originalFilename
        console.log(newPath + "-------------")
        let rawData = fs.readFileSync(oldPath)

        fs.writeFile(newPath, rawData, function (err) {
            if (err) console.log(err + "******************")
            return res.send("Successfully uploaded")
        })
    })
});

//--------------------------------- NAVBAR FUNCTIONALITY ---------------------------------
app.get('/addUser', (req, res) => {
    res.render('addUser')
})

app.post("/addUser", async (req, res) => {
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
        res.redirect('/users')
    } catch (error) {
        // Handle any errors that occur during registration
        res.status(500).send("An error occurred during registration");
    }
});

//--------------------------------- States ---------------------------------

app.get('/states', async (req, res) => {
    const indiaStates = State.getStatesOfCountry('IN');
    const message = req.flash('message');
    req.flash('message', "")
    try {
        const UserData = await User.find();
        const ProductData = await Product.find();
        // const PRefData = await Product.find().populate("65f0b05b3bae264704aa3746");
        // console.log(PRefData);
        if (req.isAuthenticated()) {
            const rData = await StateSchema.find();
            res.render('states', {
                Udata: UserData,
                Sdata: sessionData,
                rData: rData,
                indiaStates: indiaStates,
                message: message
            })
        }
        else {
            res.redirect('/states')
        }

    } catch (error) {
        res.send('An error occured ==>> ' + error);
    }
})



app.post("/addState", async (req, res) => {
    try{
            if (req.isAuthenticated())
            {
                // const thisUser = req.user
                let state_codes={'AD': 37,'AR': 12,'AS': 18,'BR': 10,'CG': 22,'DL': 7,'GA': 30,'GJ': 24,'HR': 6,'HP': 2,'JK': 1,'JH': 20,'KA': 29,'KL': 32,'LD': 31,'MP': 23,'MH': 27,'MN': 14,'ML': 17,'MZ': 15,'NL': 13,'OD': 21,'PY': 34,'PB': 3,'RJ': 8,'SK': 11,'TN': 33,'TS': 36,'TR': 16,'UP': 9,'UK': 5,'WB': 19}
                if(state_codes[req.body.State]==req.body.State_code){
                    const temp = State.getStateByCodeAndCountry(req.body.State,"IN");
                    const Rdata = new StateSchema({ User_id:req.body.User_id, State:temp.name ,State_code:req.body.State_code,State_ISOcode:req.body.State})
                    await Rdata.save();
                    res.redirect('/states')
                }
                else{
                    req.flash('message','invalid state code');
                    res.redirect('/region')
                }
            }
            else{
                res.redirect('/states');
            }
    }
    catch (e) {
        console.log(e);
        res.status(400).redirect("/states");
    }
});



//--------------------------------- LISTEN ---------------------------------

app.listen(port, () => {
    console.log("http://localhost:3000");
})










