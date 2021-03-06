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

const multer = require('multer');
const path = require('path');

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

			// console.log(privileges_list)

			let user_details = {
				user_name_in_profile: user.user_name_in_profile,
				user_cover_image: user.user_cover_image,
				user_brief_intro: user.user_brief_intro,
				user_about_me: user.user_about_me,
				user_working_zone: user.user_working_zone,
				user_education: user.user_education,
				user_contact_details: user.user_contact_details,

				user_avatar_image: base64_encode( user.user_avatar_image ),
				endpoint: user.endpoint,
				// user_cover_image: base64_encode( user.user_cover_image ),
			}


			res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires, privileges: privileges_list, user_details: user_details });

		} else {

			res.status(401).json({ success: false, msg: "you entered the wrong password" });

		}
	    // console.log(user);
	})
	.catch((err1) => {

		next(err1);

	});

});





// Set The Storage Engine
const cover_and_avatar_storage = multer.diskStorage({
	// destination: path.join(__dirname , '../../assets/bulk_blogposts/'),
	destination:function(req, file, cb){
		// let file_path = `./uploads/${type}`;
		currentDate = new Date().toLocaleDateString("en-US").split("/").join(" | ");
		currentTime = new Date().toLocaleTimeString("en-US").split("/").join(" | ");

		if (file.fieldname === "avatar_image") {

			let file_path = path.join(__dirname , '../../assets/images/uploads/avatar_image/')
			console.log(file_path)
			cb(null, file_path)	

		} else {

			
			let file_path = path.join(__dirname , `../../assets/images/uploads/cover_image/`)
			console.log(file_path)
			cb(null, file_path)	

		}

	},
	filename: function(req, file, cb){
		// file name pattern fieldname-currentDate-fileformat
		// filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
		// filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

		filename_used_to_store_image_in_assets = file.originalname
		cb(null, file.originalname);

	}
});

// Check File Type
function checkFileTypeForCoverAndAvatarImages(file, cb){

	// Allowed ext
	let filetypes_for_image = /jpeg|jpg|png|gif/

	// Check ext
	let extname_for_image = filetypes_for_image.test( path.extname(file.originalname).toLowerCase() );

	// Check mime
	let mimetype_for_image = filetypes_for_image.test( file.mimetype );

	if (file.fieldname === "avatar_image") { // if uploading resume
		
		if (mimetype_for_image && extname_for_image) {
			cb(null, true);
		} else {
			cb('Error: jpeg, jpg, png, gif Images Only!');
		}

	} else { // else uploading images

		if (mimetype_for_image && extname_for_image) {
			cb(null, true);
		} else {
			cb('Error: jpeg, jpg, png, gif Images Only!');
		}

	}

}

// Init Upload
const avatar_and_cover_upload = multer({
	storage: cover_and_avatar_storage,
	limits:{fileSize: 200000000}, // 1 mb
	fileFilter: function(req, file, cb){
		checkFileTypeForCoverAndAvatarImages(file, cb);
	}
}).fields([
	{ name: 'avatar_image', maxCount: 1 }, 
	{ name: 'cover_image', maxCount: 1 }
])  // these are the fields that will be dealt
// .single('blogpost_image_main'); 
// .array('photos', 12)

router.post('/accept-friend-request', passport.authenticate(['jwt'], { session: false }), isAllowedSurfing, async (req, res, next) => {

	let user = await User.findOne({ phone_number: req.user.user_object.phone_number })
	let user_to_accept_request = await User.findOne({ endpoint: req.body.endpoint })

	user.friends.push(user_to_accept_request)

	user_to_accept_request.friends.push(user)

	await user.save()
	await user_to_accept_request.save()

	res.status(200).json({ success: true });

});

router.post('/send-friend-request', passport.authenticate(['jwt'], { session: false }), isAllowedSurfing, async (req, res, next) => {

	console.log('INCOMING')

	let user = await User.findOne({ phone_number: req.user.user_object.phone_number })
	let user_to_send_request = await User.findOne({ endpoint: req.body.endpoint })

	user.friend_requests_sent.push(user_to_send_request)

	user_to_send_request.friend_requests.push(user)

	await user.save()
	await user_to_send_request.save()

	res.status(200).json({ success: true });
});




router.get('/friends', passport.authenticate(['jwt'], { session: false }), isAllowedSurfing, async (req, res, next) => {
	let user = await User.findOne({ phone_number: req.user.user_object.phone_number })
	user.friends
})

router.get('/friend-requests', passport.authenticate(['jwt'], { session: false }), isAllowedSurfing, async (req, res, next) => {

})

// 'facebook', 'google', 
router.get('/friend-suggestions', passport.authenticate(['jwt'], { session: false }), isAllowedSurfing, async (req, res, next) => {

	let users_count_to_show_for_suggestion = 10
	let list_of_promises = []

	let user = await User.findOne({ phone_number: req.user.user_object.phone_number })

	list_of_promises.push(user)

	let { friends } = user
	let non_friends_ids = []


	let all_users_ids = await User.find({})

	let last_n_users_ids = all_users_ids.slice(1).slice(-users_count_to_show_for_suggestion)
	
	non_friends_ids = last_n_users_ids.filter(
		function(some_user_id){
			return !friends.includes(some_user_id) && some_user_id !== user._id
		}
	)

	let friend_suggestions = []
	await Promise.all( non_friends_ids.map(async (non_friend_id) => {

		let non_friend = await User.findOne({ _id: non_friend_id })
		let {user_avatar_image, user_name_in_profile, endpoint} = non_friend

		let image_64_encoded

		try{

			image_64_encoded = base64_encode(user_avatar_image)

		} catch (err1){

			console.log(err1)
			image_64_encoded = ''

		}

		friend_suggestions.push({
			// user_avatar_image: base64_encode(user_avatar_image), 
			user_avatar_image: image_64_encoded, 
			user_name_in_profile, 
			endpoint
		})

	}))

	// console.log(friend_suggestions)
	res.status(200).json({ success: true, friend_suggestions: friend_suggestions});
});

router.get('/delete-all-users', async (req, res, next) => {

	await User.deleteMany({}, ()=>null)
	res.status(200).json({ success: true, message: 'all users deleted'});

});

// 'facebook', 'google', 
router.post('/update-settings', passport.authenticate(['jwt'], { session: false }), function(req, res, next){

	console.log('incoming')

	avatar_and_cover_upload(req, res, (err) => {

		if(err){

			console.log(err)

		} else {

			User.findOneAndUpdate({ phone_number: req.user.user_object.phone_number }, { 

				$set:{ 
					user_name_in_profile: req.body.user_name_in_profile,
					user_cover_image: req.body.user_cover_image,
					user_brief_intro: req.body.user_brief_intro,
					user_about_me: req.body.user_about_me,
					user_working_zone: req.body.user_working_zone,
					user_education: req.body.user_education,
					user_contact_details: req.body.user_contact_details,

					user_avatar_image: `assets/images/uploads/avatar_image/${req.files['avatar_image'][0].filename}`,
					user_cover_image: `assets/images/uploads/cover_image/${req.files['cover_image'][0].filename}`,
				}

			}, { new: true }, (err, user) => {

				console.log('BELOW')
				console.log( path.join(__dirname ,`../../assets/images/uploads/avatar_image/${req.files['avatar_image'][0].filename}`) )
				console.log(user.user_avatar_image)

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
		}
	})
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