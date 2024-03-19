const { User } = require("./schema");
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt')

exports.initializingPassport = (passport) => {

    passport.use(new LocalStrategy({ usernameField: "fmail", passwordField: 'fpass', passReqToCallback: true }, async (req, fmail, fpass, done) => {

        try {

            const user = await User.findOne({ fmail: fmail })

            if (!user) {
                req.flash('message',' wrong Email ') ;
                return done(null, false, { message: "wrong credentials" });
            }

            const isMatch = await bcrypt.compare(fpass ,user.fpass)

            if (!isMatch) {
                req.flash('message',' Incorrect password') ;
                return done(null, false, { message: "Incorrect password" });
            }

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

