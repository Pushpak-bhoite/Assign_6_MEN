const express = require('express')
const app = express();

const path = require('path')
const ejs = require('ejs')
const mydb = require('./model/db')
const { User, Product } = require('./model/schema') //now we are gonna use newTodo as an class
const MethodOverride = require('method-override');
const { initializingPassport, isAuthenticated } = require('./model/passportConfig');
const LocalStrategy = require("passport-local").Strategy;

const passport = require('passport');
const expressSession = require('express-session');

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


// app.get("/", async (req, res) => {
//     try {
//         const UserData = await User.find();
//         res.render('dashboard', {
//             Udata: UserData
//         })
//     } catch (error) {
//         res.send(error);
//     }
// })


/*--------------------------------- PASSPORT --------------------------------- */
// below middlewears are for the sake of passport authentication
app.use(expressSession({  //this  MV(middleweare) should be before below  two
    secret: "secret", resave: false, saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

initializingPassport(passport);//PASSPORT=this function working as middleware check it out


let sessionData;
app.post('/login', passport.authenticate('local', { failureRedirect: '/register' }),
    async (req, res) => {
        sessionData = req.user             //session stored

        if (req.isAuthenticated()) {
            try {
                if (req.user.frole === "Admin") {
                    res.redirect('/dashboard')
                } else {
                    res.render('user');
                }

            } catch (error) {
                res.send(error);
            }
        } else {
            console.log("Login failed");
        }
    });

app.get("/dashboard", isAuthenticated, async (req, res) => {
    try {
        const UserData = await User.find();
        const ProductData = await Product.find();
        // const PRefData = await Product.find().populate("65f0b05b3bae264704aa3746");
        // console.log(PRefData);
        res.render('dashboard', {
            Udata: UserData,
            Sdata: sessionData,
            Pdata: ProductData
        })
    } catch (error) {
        res.send('An error occured ==>> ' + error);
    }
})

app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).send("An error occurred during logout");
        }
        res.redirect("/");
    });
});


/*--------------------------------- PRODUCTS ROUT --------------------------------- */
app.post("/addProduct", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();

        res.send("product added");
    } catch (error) {
        // Handle any errors that occur during registration
        res.status(500).send("An error occurred during registration");
    }

});


/*--------------------------------- ROUTS --------------------------------- */



app.get("/", async (req, res) => {
    try {
        res.render('pandalogin')
    } catch (error) {
        res.send(error);
    }
})

app.get("/register", async (req, res) => {
    res.render('index')
})

app.get("/", async (req, res) => {
    res.render('index')
})

app.get("/product", async (req, res) => {
    res.render('product')
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

        // Create a new user
        const newUser = new User({
            ffname: req.body.ffname,
            flname: req.body.flname,
            fmail: req.body.fmail,
            fphone: req.body.fphone,
            fpass: req.body.fpass,
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




/*--------------------------------- CHANGE - STATE --------------------------------- */
// app.post("/addProduct", async (req, res) => {
//     console.log(req.body.pname);
//   
//     }

// });

// UPDATE
app.post("/stateChange/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        // async function myFunc() {

            console.log(req.body.state === "true")


            if (req.body.state === "true") {
                console.log("hello")
                const updatedData = { state: false };

                const result = await User.findByIdAndUpdate({ _id: userId }, { $set: updatedData });
                // return result;
                res.redirect('/dashboard');

            } else {
                console.log(" jsdbvdsj  ")

                const updatedData = { state: true };
                const result = await User.findByIdAndUpdate({ _id: userId }, { $set: updatedData });
                // return result
            res.redirect('/dashboard');

            }
        // }

        // const result = await myFunc();
        // console.log(result)
        // if (result.matchedCount === 1) {
        //     res.redirect('/dashboard');
        // } else {
        //     res.status(404).send("User not found or operation failed");
        // }


    } catch (error) {
        // Handle any errors that occur during the update operation
        res.status(500).send(error);
    }
});






app.listen(port, () => {
    console.log("http://localhost:3000");
})