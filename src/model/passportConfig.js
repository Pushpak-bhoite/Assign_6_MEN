const { User } = require("./schema");
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy;


exports.initializingPassport = (passport) => {


    passport.use(new LocalStrategy({ usernameField: "fmail", passwordField: 'fpass', passReqToCallback: true }, async (req, fmail, fpass, done) => {

        try {

            const user = await User.findOne({ fmail: fmail })

            if (!user) {
                console.log(user + "Not authenticated")
                return done(null, false, { message: "wrong credentials" });
            }

            if (user.fpass !== fpass) {
                console.log(user + "Wrong password")
                return done(null, false, { message: "Incorrect password" });
            }

            // if (req.body.frole !== user.frole) {
            //     console.log("Invalid Role");
            //     return done(null, false, { message: "Invalid Role" });
            // }

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }

    }))
    // Boiler PLate OR mandatory step
    passport.serializeUser((user, done) => {   //creates user id 
        done(null, user.id);
    })

    passport.deserializeUser(async (id, done) => {      //fids user by id
        try {
            const user = await User.findById(id)
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    });
};

exports.isAuthenticated = (req,res ,next) =>{
    if(req.user) return next();
    res.redirect("/");
}   

