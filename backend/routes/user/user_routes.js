// for using jwt in subsequest requests, put the jwt in 'bearer token` OR Authorization key in header of request'
// ALSO IN REACT / REACT NATIVE PUT IT IN EVERY REQUEST OTHERWISE route will not be shown

// passport jwt strategy checks jwt token in each request to verify the user is valid or should be entertained or not
// passport local strategy checks session ie user.loggedin / isauthenticated methods, once user is logged in it can do what he is allowed to do untill he logs out
const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('User');
const utils = require('../../lib/utils');
const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const get_allowed_privileges_list = require("../../handy_functions/get_allowed_privileges_list")

const base64_encode = require('../../lib/image_to_base64')

router.post('/signup-with-facebook-and-get-permission', passport.authenticate('facebook', { scope: ['user_friends', 'manage_pages'] }))
router.post('/signup-with-facebook-and-get-permission-again', passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['user_friends', 'manage_pages'] }))
router.post('/login-with-facebook', passport.authenticate('facebook', { 
	successRedirect: '/profile', 
	failureRedirect: '/login' 
}))

router.post('/signup-with-google', passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }))
router.post('/login-with-google', passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }, { 
	successRedirect: '/profile', 
	failureRedirect: '/login' 
}))

router.get('/protected', passport.authenticate(['facebook', 'google', 'jwt'], { session: false }), isAllowedSurfing, (req, res, next) => {
	// // payload recieved from passport.authenticate jwt middleware
	// console.log(req.user.msg)
	// console.log(req.user.user_object)

	// // payload recieved from last middleware
	// console.log(req.local)

	res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!", privileges: req.user.privileges});
});



// Validate an existing user and issue a JWT
router.post('/login', async function(req, res, next){

	User.findOneAndUpdate({ phone_number: req.body.phone_number }, { $set:{ isLoggedIn:true } }, { new: true }, async (err, user) => {
	    if (err) {

	        res.status(401).json({ success: false, msg: "could not find user" });

	    }

		if (!user) {
			res.status(401).json({ success: false, msg: "could not find user" });
		}

	// Function defined at bottom of app.js
		const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

		if (isValid) {

		// not needed here, this is done in passport middleware
		// 	let privileges_list = []
		// 	user.privileges.map((privilege_object) => {

		// 		if ( privilege_object.privilege_name === 'allow_surfing' ){
			
		// 			privileges_list.push( 'Basic' )

		// 		} else if ( privilege_object.privilege_name === 'is_allowed_image_upload' ){

		// 			privileges_list.push( 'Images control' )

		// 		} else if ( privilege_object.privilege_name === 'is_allowed_video_upload' ){

		// 			privileges_list.push( 'Videos control' )

		// 		} else if ( privilege_object.privilege_name === 'is_allowed_writing_blopost' ){

		// 			privileges_list.push( 'Blogposts control' )

		// 		} else {
		// 		}

		// 	})

		// // add revoked or privileges that are not given
		// 	if ( !privileges_list.includes('Basic') ){
		// 		privileges_list.push('Revoke Basic')
		// 	} 

		// 	if ( !privileges_list.includes('Images control') ){
		// 		privileges_list.push('Revoke Images control')
		// 	} 

		// 	if ( !privileges_list.includes('Videos control') ){
		// 		privileges_list.push('Revoke Videos control')
		// 	} 

		// 	if ( !privileges_list.includes('Blogposts control') ){
		// 		privileges_list.push('Revoke Blogposts control')
		// 	} 

			const tokenObject = utils.issueJWT(user);

			let privileges_list = await get_allowed_privileges_list(user)

			console.log(privileges_list)

			res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires, privileges: privileges_list });

		} else {

			res.status(401).json({ success: false, msg: "you entered the wrong password" });

		}
	    // console.log(user);
	})
	.catch((err1) => {

		next(err1);

	});

});

// 'facebook', 'google', 
router.post('/update-settings', passport.authenticate(['jwt'], { session: false }), function(req, res, next){

	console.log('incoming')


	User.findOneAndUpdate({ phone_number: req.user.user_object.phone_number }, { 
		$set:{ 
			user_name_in_profile: req.body.user_name_in_profile,
			user_cover_image: req.body.user_cover_image,
			user_brief_intro: req.body.user_brief_intro,
			user_about_me: req.body.user_about_me,
			user_working_zone: req.body.user_working_zone,
			user_education: req.body.user_education,
			user_contact_details: req.body.user_contact_details,
		}
	}, { new: true }, (err, user) => {

		let user_details = {
			user_name_in_profile: user.user_name_in_profile,
			user_cover_image: user.user_cover_image,
			user_brief_intro: user.user_brief_intro,
			user_about_me: user.user_about_me,
			user_working_zone: user.user_working_zone,
			user_education: user.user_education,
			user_contact_details: user.user_contact_details,

			user_avatar_image: base64_encode( user.user_avatar_image ),
			user_cover_image: base64_encode( user.user_cover_image ),
		}

		res.status(200).json({ success: true, message: 'user_updated', user_details: user_details});

	})
	.catch((err1) => {

		next(err1);

	});

});


// Validate an existing user and issue a JWT
router.post('/login-with-jwt', function(req, res, next){

	User.findOneAndUpdate({ phone_number: req.body.phone_number }, { $set:{ isLoggedIn:true } }, { new: true }, (err, user) => {
	    if (err) {

	        res.status(401).json({ success: false, msg: "could not find user" });

	    }

		if (!user) {
			res.status(401).json({ success: false, msg: "could not find user" });
		}

	// Function defined at bottom of app.js
		const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

		if (isValid) {

			const tokenObject = utils.issueJWT(user);

			let privileges_list = get_allowed_privileges_list(user)

			res.status(200).json({ 
				success: true, 
				token: tokenObject.token, 
				expiresIn: tokenObject.expires, 
				privileges: privileges_list,

				user_name_in_profile: user.user_name_in_profile,
				user_avatar_image: user.user_avatar_image,
				user_cover_image: user.user_cover_image,
				user_brief_intro: user.user_brief_intro,
				user_about_me: user.user_about_me,
				user_working_zone: user.user_working_zone,
				user_education: user.user_education,
				user_contact_details: user.user_contact_details,
			});

		} else {

			res.status(401).json({ success: false, msg: "you entered the wrong password" });

		}
	    // console.log(user);
	})
	.catch((err1) => {

		next(err1);

	});

});


// DEPRECATED
// 	User.findOne({ phone_number: req.body.phone_number })
// 	.then((user) => {

// 		console.log(user)

// 		if (!user) {
// 			res.status(401).json({ success: false, msg: "could not find user" });
// 		}

// 		// Function defined at bottom of app.js
// 		const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

// 		if (isValid) {

// 			const tokenObject = utils.issueJWT(user);
// 			res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });

// 		} else {

// 			res.status(401).json({ success: false, msg: "you entered the wrong password" });

// 		}

// 	})
// 	.catch((err) => {
// 		next(err);
// 	});
// });

// Register a new user
router.post('/register', function(req, res, next){

	const saltHash = utils.genPassword(req.body.password);
	
	const salt = saltHash.salt;
	const hash = saltHash.hash;

	const newUser = new User({
		user_name: req.body.user_name,
		phone_number: req.body.phone_number,
		hash: hash,
		salt: salt,
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

module.exports = router;