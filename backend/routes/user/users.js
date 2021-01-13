// for using jwt in subsequest requests, put the jwt in 'bearer token` OR Authorization key in header of request'
// ALSO IN REACT / REACT NATIVE PUT IT IN EVERY REQUEST OTHERWISE route will not be shown

// passport jwt strategy checks jwt token in each request to verify the user is valid or should be entertained or not
// passport local strategy checks session ie user.loggedin / isauthenticated methods, once user is logged in it can do what he is allowed to do untill he logs out

const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../../lib/utils');

require('../../models/user');
const base64_encode = require('../../lib/image_to_base64')


router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

// Validate an existing user and issue a JWT
router.post('/login', function(req, res, next){

    User.findOne({ username: req.body.username })
        .then((user) => {

            if (!user) {
                res.status(401).json({ success: false, msg: "could not find user" });
            }
            
            // Function defined at bottom of app.js
            const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
            
            if (isValid) {

                const tokenObject = utils.issueJWT(user);

                res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });

            } else {

                res.status(401).json({ success: false, msg: "you entered the wrong password" });

            }

        })
        .catch((err) => {
            next(err);
        });
});

// Register a new user
router.post('/register', function(req, res, next){
    const saltHash = utils.genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    });

    try {
    
        newUser.save()
            .then((user) => {
                res.json({ success: true, user: user });
            });

    } catch (err) {
        
        res.json({ success: false, msg: err });
    
    }

});

router.post('/create-user', function(req, res, next){
    console.log('triggered create-user')

    User.findOne({
        phone_number: req.body.phone_number,
        user_name: req.body.user_name,
        // user_name_in_profile: req.body.user_name_in_profile,
        // user_avatar_image: req.body.user_avatar_image,
        // user_cover_image: req.body.user_cover_image,
        // user_brief_intro: req.body.user_brief_intro,
        // user_about_me: req.body.user_about_me,
        // user_working_zone: req.body.user_working_zone,
        // user_education: req.body.user_education,
        // user_contact_details: req.body.user_contact_details,
    })
    .then((user) => {

        if (!user) {


            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                phone_number: req.body.phone_number,
                user_name: req.body.user_name,
                user_name_in_profile: req.body.user_name_in_profile,
                user_avatar_image: req.body.user_avatar_image,
                user_cover_image: req.body.user_cover_image,
                user_brief_intro: req.body.user_brief_intro,
                user_about_me: req.body.user_about_me,
                user_working_zone: req.body.user_working_zone,
                user_education: req.body.user_education,
                user_contact_details: req.body.user_contact_details,
            });

            newUser.save(function (err, newUser) {

                if (err) return console.log(err);

                res.status(200).json({success: true})
                
            })

        } else {

            res.status(401).json({ success: false, msg: "user already registered, try another or login" })

        }

    })
    .catch((err) => {

        console.log(err)
        // next(err)

    });
})


module.exports = router;