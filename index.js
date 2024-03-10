const express = require('express')
const mydb = require('./db')
const User = require('./schema') //now we are gonna use newTodo as an class
const MethodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 3000;
mydb();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(MethodOverride('_method'));
app.set('view engine', 'ejs');
app.use(MethodOverride('_method'));
// static files
app.use(express.static('public'));

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

app.get("/sidebar", async (req, res) => {
    res.render('sidebar')
})
app.get("/dashboard", async (req, res) => {
    res.render('dashboard')
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

app.post("/login", async (req, res) => {
    try {
        const data = await User.findOne({ fmail: req.body.fmail });
        console.log(data.fmail)

        if (data.fmail === req.body.fmail && data.fpass === req.body.fpass) {
            res.send(" Login Successful");
        } else {
            res.send(data + "Oops...Something went wrong ");
        }

    } catch (error) {
        res.status(400).send(error)
    }
})


app.listen(port, () => {
    console.log("http://localhost:3000");
})