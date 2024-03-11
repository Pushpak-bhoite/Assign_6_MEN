const express = require('express')
const app = express();

const ejs = require('ejs')
const mydb = require('./db')
const { User, Product } = require('./schema') //now we are gonna use newTodo as an class
const MethodOverride = require('method-override');
const { initializingPassport } = require('./passportConfig');
const LocalStrategy = require("passport-local").Strategy;


const passport = require('passport');
const expressSession = require('express-session');

app.use(expressSession({
    secret: "secret", resave: false, saveUninitialized: false
}))

const port = process.env.PORT || 3000;

// Call Functions
mydb();



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(MethodOverride('_method'));
app.set('view engine', 'ejs');
app.use(MethodOverride('_method'));
// static files
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());


initializingPassport(passport)  ;//PASSPORT=this function working as middleware check it out

app.post('/login',passport.authenticate('local', { failureRedirect: '/product' }),
    (req, res) => {
        if (req.isAuthenticated()) {
            console.log("Login successful");
            res.send(req.body);
        } else {
            console.log("Login failed");
        }
    });


// READ
app.get("/", async (req, res) => {
    try {
        const FormData = await User.find();
        res.render('index')
    } catch (error) {
        res.send(error);
    }
})

app.get("/login", async (req, res) => {
    res.render('login')
})

app.get("/register", async (req, res) => {
    res.render('index')
})

app.get("/", async (req, res) => {
    res.render('index')
})


app.get("/dashboard", async (req, res) => {
    try {
        const UserData = await User.find();
        // res.render('dashboard')
        res.send(UserData)
    } catch (error) {
        res.send(error);
    }
})

app.get("/product", async (req, res) => {
    res.render('product')
})



// CRAETE

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
        res.send("Registration successful");
    } catch (error) {
        // Handle any errors that occur during registration
        res.status(500).send("An error occurred during registration");
    }
});


// LOGIN


// // LOGIN

// app.post("/login", async (req, res) => {
//     try {
//         const data = await User.findOne({ fmail: req.body.fmail });
//         console.log(data.fmail)

//         if (data.fmail === req.body.fmail && data.fpass === req.body.fpass) {
//             res.send(" Login Successful");
//         } else {
//             res.send(data + "Oops...Something went wrong ");
//         }
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })


app.post("/addProduct", async (req, res) => {
    console.log(req.body.pname);
    try {
        const newProduct = new Product({
            pname: req.body.pname
        });
        await newProduct.save();

        res.send("Registration successful");
    } catch (error) {
        // Handle any errors that occur during registration
        res.status(500).send("An error occurred during registration");
    }

});


app.listen(port, () => {
    console.log("http://localhost:3000");
})