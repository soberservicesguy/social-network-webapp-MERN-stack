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
const axios = require('axios')

require('../../models/socialpost');
require('../../models/advertisement');
require('../../models/book');
require('../../models/page');
require('../../models/sport');
require('../../models/activity');
const Activity = mongoose.model('Activity');
const SocialPost = mongoose.model('SocialPost');
const Advertisement = mongoose.model('Advertisement');
const Book = mongoose.model('Book');
const Page = mongoose.model('Page');
const Sport = mongoose.model('Sport');


const multer = require('multer');
const path = require('path');

const base64_encode = require('../../lib/image_to_base64')

const {
	get_image_to_display,
	get_multer_storage_to_use,
	get_file_storage_venue,
	get_file_path_to_use,

	use_gcp_storage,
	use_aws_s3_storage,

	get_file_from_gcp,
	save_file_to_gcp,
	gcp_bucket,

	get_snapshots_storage_path,

	get_file_from_aws,
	save_file_to_aws_s3,

	checkFileTypeForImages,
} = require('../../config/storage/')

let timestamp


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

router.get('/user-details', async function(req, res, next){
	
	let user = await User.findOne({ endpoint: req.query.user_id })
	res.status(200).json({
		user_name_in_profile: user.user_name_in_profile,
		user_avatar_image: base64_encode(user.user_avatar_image),
		user_cover_image: base64_encode(user.user_cover_image),
		total_friends: user.total_friends,
	});

})




// Validate an existing user and issue a JWT
router.post('/login', async function(req, res, next){

	console.log('INCOMING')

	User.findOneAndUpdate({ phone_number: req.body.phone_number }, { $set:{ isLoggedIn:true } }, { new: true }, async (err, user) => {
	    if (err) {

	        res.status(401).json({ success: false, msg: "could not find user" });

	    }

		if (!user || user === null) {
			res.status(401).json({ success: false, msg: "could not find user" });
			return
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

		// we need to look where image is hosted and then get it from there
			// let user_cover_image_to_use

			let user_avatar_image_to_use = await get_image_to_display(user.user_avatar_image, user.object_files_hosted_at)

			let user_details = {
				// user_cover_image: user_cover_image_to_use,
				user_avatar_image: user_avatar_image_to_use,

				user_name_in_profile: user.user_name_in_profile,
				user_brief_intro: user.user_brief_intro,
				user_about_me: user.user_about_me,
				user_working_zone: user.user_working_zone,
				user_education: user.user_education,
				user_contact_details: user.user_contact_details,

				total_friends: user.total_friends,
		
				endpoint: user.endpoint,
			}

			res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires, privileges: privileges_list, user_details: user_details })

		} else {

			res.status(200).json({ success: false, msg: "you entered the wrong password" });

		}
	    // console.log(user);
	})
	.catch((err1) => {

		next(err1);

	});

});





// Set The Storage Engine DRYed IT
// const cover_and_avatar_storage = multer.diskStorage({
// 	// destination: path.join(__dirname , '../../assets/bulk_blogposts/'),
// 	destination:function(req, file, cb){
// 		// let file_path = `./uploads/${type}`;
// 		currentDate = new Date().toLocaleDateString("en-US").split("/").join(" | ");
// 		currentTime = new Date().toLocaleTimeString("en-US").split("/").join(" | ");

// 		if (file.fieldname === "avatar_image") {

// 			let file_path = path.join(__dirname , '../../assets/images/uploads/avatar_image/')
// 			console.log(file_path)
// 			cb(null, file_path)	

// 		} else {

			
// 			let file_path = path.join(__dirname , `../../assets/images/uploads/cover_image/`)
// 			console.log(file_path)
// 			cb(null, file_path)	

// 		}

// 	},
// 	filename: function(req, file, cb){
// 		// file name pattern fieldname-currentDate-fileformat
// 		// filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
// 		// filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

// 		filename_used_to_store_image_in_assets = file.originalname
// 		cb(null, file.originalname);

// 	}
// });


// Check File Type DRYed out
// function checkFileTypeForImages(file, cb){

// 	// Allowed ext
// 	let filetypes_for_image = /jpeg|jpg|png|gif/

// 	// Check ext
// 	let extname_for_image = filetypes_for_image.test( path.extname(file.originalname).toLowerCase() );

// 	// Check mime
// 	let mimetype_for_image = filetypes_for_image.test( file.mimetype );

// 	if (file.fieldname === "avatar_image") { // if uploading resume
		
// 		if (mimetype_for_image && extname_for_image) {
// 			cb(null, true);
// 		} else {
// 			cb('Error: jpeg, jpg, png, gif Images Only!');
// 		}

// 	} else { // else uploading images

// 		if (mimetype_for_image && extname_for_image) {
// 			cb(null, true);
// 		} else {
// 			cb('Error: jpeg, jpg, png, gif Images Only!');
// 		}

// 	}

// }


// Init Upload


function upload_avatar_and_cover(timestamp){
	return multer({
		// storage: get_multer_storage_to_use(cover_and_avatar_storage),
		storage: get_multer_storage_to_use(timestamp),
		limits:{fileSize: 200000000}, // 1 mb
		fileFilter: function(req, file, cb){
			checkFileTypeForImages(file, cb);
		}
	}).fields([
		{ name: 'avatar_image', maxCount: 1 }, 
		{ name: 'cover_image', maxCount: 1 }
	])  // these are the fields that will be dealt
	// .single('blogpost_image_main'); 
	// .array('photos', 12)
}


// DRYed out
// const upload_avatar_and_cover = multer({
// 	// storage: get_multer_storage_to_use(cover_and_avatar_storage),
// 	storage: get_multer_storage_to_use(file, folder_name, timestamp),
// 	limits:{fileSize: 200000000}, // 1 mb
// 	fileFilter: function(req, file, cb){
// 		checkFileTypeForImages(file, cb);
// 	}
// }).fields([
// 	{ name: 'avatar_image', maxCount: 1 }, 
// 	{ name: 'cover_image', maxCount: 1 }
// ])  // these are the fields that will be dealt
// // .single('blogpost_image_main'); 
// // .array('photos', 12)


router.post('/accept-friend-request', passport.authenticate(['jwt'], { session: false }), isAllowedSurfing, async (req, res, next) => {

	// REMOVE FROM FRIEND REQUESTS
	// console.log('req.body.endpoint')
	// console.log(req.body.endpoint)

	console.log('req.user.user_object.phone_number')
	console.log(req.user.user_object.phone_number)

	console.log('req.body.endpoint')
	console.log(req.body.endpoint)

	let user = await User.findOne({ phone_number: req.user.user_object.phone_number })
	let user_to_accept_request = await User.findOne({ endpoint: req.body.endpoint })

	console.log('user_to_accept_request')
	console.log(user_to_accept_request)

	user.friends.push(user_to_accept_request)

	user_to_accept_request.friends.push(user)

	let index1 = user.friend_requests.indexOf( user_to_accept_request._id );

	if (index1 > -1) {
		user.friend_requests.splice(index1, 1);
	}

	let index2= user_to_accept_request.friend_requests_sent.indexOf( user._id );

	if (index2 > -1) {
		user_to_accept_request.friend_requests_sent.splice(index2, 1);
	}

	await user.save()
	await user_to_accept_request.save()

	res.status(200).json({ success: true, });

});

router.post('/send-friend-request', passport.authenticate(['jwt'], { session: false }), isAllowedSurfing, async (req, res, next) => {

	console.log('INCOMING')

	let user = await User.findOne({ phone_number: req.user.user_object.phone_number })
	console.log({user})
	let user_to_send_request = await User.findOne({ endpoint: req.body.endpoint })
	console.log(req.body.endpoint)
	console.log({user_to_send_request})

	user.friend_requests_sent.push(user_to_send_request)

	user_to_send_request.friend_requests.push(user)

	await user.save()
	await user_to_send_request.save()

	res.status(200).json({ success: true });
});




router.get('/friends-list', passport.authenticate(['jwt'], { session: false }), isAllowedSurfing, async (req, res, next) => {
	
	let user = await User.findOne({ phone_number: req.user.user_object.phone_number })

	let friends_list = []
	
	await Promise.all( user.friends.map(async (friend_id) => {

		let friend = await User.findOne({ _id: friend_id })
		let {user_avatar_image, user_name_in_profile, endpoint, object_files_hosted_at} = friend

		let image_64_encoded = await get_image_to_display(user_avatar_image, object_files_hosted_at)

		friends_list.push({
			// user_avatar_image: base64_encode(user_avatar_image), 
			user_avatar_image: image_64_encoded, 
			endpoint: endpoint,
			user_name_in_profile: user_name_in_profile, 
		})

	}))

	// console.log('friends_list sent')
	// console.log(friends_list.length)
	res.status(200).json({ success: true, friends_list: friends_list});

})

router.get('/friend-requests', passport.authenticate(['jwt'], { session: false }), isAllowedSurfing, async (req, res, next) => {

	let user = await User.findOne({ phone_number: req.user.user_object.phone_number })

	let friends_requests = []
	
	await Promise.all( user.friend_requests.map(async (friend_id) => {

		let friend_request = await User.findOne({ _id: friend_id })
		let {user_avatar_image, user_name_in_profile, endpoint, object_files_hosted_at} = friend_request

		let image_64_encoded = await get_image_to_display(user_avatar_image, object_files_hosted_at)

		friends_requests.push({
			// user_avatar_image: base64_encode(user_avatar_image), 
			user_avatar_image: image_64_encoded, 
			endpoint: endpoint,
			user_name_in_profile: user_name_in_profile, 
		})

	}))

	// console.log('friends_requests sent')
	// console.log(friends_requests.length)
	res.status(200).json({ success: true, friends_requests: friends_requests});

})

// 'facebook', 'google', 
router.get('/friend-suggestions', passport.authenticate(['jwt'], { session: false }), isAllowedSurfing, async (req, res, next) => {

	// console.log('CALLED')
	let users_count_to_show_for_suggestion = 10
	let list_of_promises = []

	let user = await User.findOne({ phone_number: req.user.user_object.phone_number })

	// console.log('user._id')
	// console.log(user._id)

	list_of_promises.push(user)

	let { friends } = user
	let non_friends_ids = []

	// console.log('friends')
	// console.log(friends)


	let all_users = await User.find({})

	// console.log('all_users')
	// console.log(all_users)

	let last_n_users_ids = all_users.slice(1).slice(-users_count_to_show_for_suggestion)
	
	non_friends = last_n_users_ids.filter(
		function(some_user){
			// console.log({some_user:some_user._id, user:user._id})
			return !friends.includes(some_user._id) && String(some_user._id) !== String(user._id) 
		}
	)

	// console.log('non_friends')
	// console.log(non_friends)


	let friend_suggestions = []
	await Promise.all( non_friends.map(async (non_friend_object) => {

		// console.log('non_friend')
		// console.log(non_friend_object)

		let non_friend = await User.findOne({ _id: non_friend_object._id })

		// console.log('non_friend')
		// console.log(non_friend)

		let {user_avatar_image, user_name_in_profile, endpoint, object_files_hosted_at} = non_friend

		// console.log('endpoint')
		// console.log(endpoint)

		let image_64_encoded = await get_image_to_display(user_avatar_image, object_files_hosted_at)

		friend_suggestions.push({
			// user_avatar_image: base64_encode(user_avatar_image), 
			user_avatar_image: image_64_encoded, 
			endpoint: endpoint,
			user_name_in_profile: user_name_in_profile, 
		})


	}))


	// console.log('friend_suggestions sent')
	// console.log(friend_suggestions.length)
	// friend_suggestions.map((sug) => {
		// console.log('sug.endpoint')
		// console.log(sug.endpoint)
	// })
	res.status(200).json({ success: true, friend_suggestions: friend_suggestions});
});

router.get('/delete-all-activities', async (req, res, next) => {

	await Activity.deleteMany({}, ()=>null)
	res.status(200).json({ success: true, message: 'all activities deleted'});

});


router.get('/delete-all-users', async (req, res, next) => {

	await User.deleteMany({}, ()=>null)
	res.status(200).json({ success: true, message: 'all users deleted'});

});

router.get('/delete-all-socialposts', async (req, res, next) => {

	await SocialPost.deleteMany({}, ()=>null)
	res.status(200).json({ success: true, message: 'all soocialposts deleted'});

});

router.get('/delete-all-books', async (req, res, next) => {

	await Book.deleteMany({}, ()=>null)
	res.status(200).json({ success: true, message: 'all books deleted'});

});

router.get('/delete-all-pages', async (req, res, next) => {

	await Page.deleteMany({}, ()=>null)
	res.status(200).json({ success: true, message: 'all pages deleted'});

});

router.get('/delete-all-sports', async (req, res, next) => {

	await Sport.deleteMany({}, ()=>null)
	res.status(200).json({ success: true, message: 'all sports deleted'});

});

router.get('/delete-all-ads', async (req, res, next) => {

	await Advertisement.deleteMany({}, ()=>null)
	res.status(200).json({ success: true, message: 'all ads deleted'});

});



// 'facebook', 'google', 
router.post('/update-settings', passport.authenticate(['jwt'], { session: false }), function(req, res, next){

	console.log('incoming')

	timestamp = Date.now()

	upload_avatar_and_cover(timestamp)(req, res, (err) => {

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

					object_files_hosted_at: get_file_storage_venue(),
					user_avatar_image: get_file_path_to_use( req.files['avatar_image'][0], 'avatar_images', timestamp ), 
					// user_avatar_image: get_file_path_to_use( timestamp, req.files['avatar_image'][0], 'avatar_images' ), 
					user_cover_image: get_file_path_to_use( req.files['cover_image'][0], 'cover_images', timestamp ), 
					// user_cover_image: get_file_path_to_use( timestamp, req.files['cover_image'][0], 'cover_images' ), 
				}

			}, { new: true }, (err, user) => {

				// console.log('BELOW')
				// console.log( path.join(__dirname ,`../../assets/images/uploads/avatar_image/${req.files['avatar_image'][0].filename}`) )
				// console.log(user.user_avatar_image)


			let user_avatar_image_to_use
			let user_cover_image_to_use

			// WE NEED UPLOADED FILES THEREFORE CREATING CONDITIONS OF USING GCP, AWS, OR DISK STORAGE
				{(async () => {

					if (use_gcp_storage){

						let promises = []
						promises.push( save_file_to_gcp(timestamp, req.files['avatar_image'][0]) )
						promises.push( save_file_to_gcp(timestamp, req.files['cover_image'][0]) )
						await Promise.all(promises)

					} else if (use_aws_s3_storage) {

						console.log('SAVED AUTOMATICALLY TO AWS')

					} else {

						console.log('SAVED AUTOMATICALLY TO LOCAL DISK')

					}

					user_avatar_image_to_use = await get_image_to_display(user.user_avatar_image, user.object_files_hosted_at)
					user_cover_image_to_use = await get_image_to_display(user.user_cover_image, user.object_files_hosted_at)

					let user_details = {
						user_name_in_profile: user.user_name_in_profile,
						// user_cover_image: user.user_cover_image,
						user_brief_intro: user.user_brief_intro,
						user_about_me: user.user_about_me,
						user_working_zone: user.user_working_zone,
						user_education: user.user_education,
						user_contact_details: user.user_contact_details,

						object_files_hosted_at: get_file_storage_venue(),
						user_avatar_image: user_avatar_image_to_use,
						user_cover_image: user_cover_image_to_use,
					}

					res.status(200).json({ success: true, message: 'user_updated', user_details: user_details});

				})()}
			
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