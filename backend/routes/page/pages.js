require('../../models/page');
require('../../models/user');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedCreatingPages } = require('../authMiddleware/isAllowedCreatingPages')


const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Page = mongoose.model('Page');
const User = mongoose.model('User');


const multer = require('multer');
const path = require('path')

// Set The Storage Engine
const image_storage = multer.diskStorage({
	destination: path.join(__dirname , '../../assets/images/uploads/page_images'),
	filename: function(req, file, cb){
		// file name pattern fieldname-currentDate-fileformat
		// filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
		// filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

		filename_used_to_store_image_in_assets = file.originalname
		cb(null, file.originalname);

	}
});

// Check File Type
function checkFileTypeForImage(file, cb){
	// Allowed ext
	let filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	let mimetype = filetypes.test(file.mimetype);

	if(mimetype && extname){
		return cb(null,true);
	} else {
		cb('Error: jpeg, jpg, png, gif Images Only!');
	}
}

// Init Upload
const upload_book_by_user = multer({
	storage: image_storage,
	limits:{fileSize: 200000000}, // 1 mb
	fileFilter: function(req, file, cb){
		checkFileTypeForImage(file, cb);
	}
}).single('page_image'); // this is the field that will be dealt
// .array('page_images', 12)




// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/create-blogpost-with-user', passport.authenticate('jwt', { session: false }), isAllowedCreatingPages, function(req, res, next){
	
	// console.log('OUTER LOG')
	// console.log(req.body)

	upload_book_by_user(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			if(req.file == undefined){

				res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

			} else {
				// console.log('INNER LOG')
				// console.log(req.body)

			// image is uploaded , now saving image in db
				const newPage = new Page({

					_id: new mongoose.Types.ObjectId(),
					page_name: req.body.parent.page_name,
					page_image: `./assets/images/uploads/page_images/${filename_used_to_store_image_in_assets}`,
					page_description: req.body.parent.page_description,
					// endpoint: req.body.parent.endpoint,

				});

				newPage.save(function (err, newPage) {

					if (err){
						res.status(404).json({ success: false, msg: 'couldnt create page database entry'})
						return console.log(err)
					}
					// assign user object then save
					User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
					.then((user) => {
						if (user){

							newPage.page_created_by_user = user
							newPage.save()


							// in response sending new image too with base64 encoding
							let base64_encoded_image = base64_encode(newPage.page_image)

							let new_page = {
								page_name: newPage,
								page_image: base64_encoded_image,
								page_description: newPage,
							}

							res.status(200).json({ success: true, msg: 'new page saved', new_page: new_page});	

						} else {

							res.status(200).json({ success: false, msg: "user doesnt exists, try logging in again" });

						}
					})
					.catch((err) => {

						next(err);

					});

				})

				// not needed, this is used only in multer
				// res.status(200).json({ success: true, msg: 'File Uploaded!',file: `uploads/${req.file.filename}`})
			}
		}
	})
})

// USED
router.get('/pages-list-with-children', function(req, res, next){

	Page.
	find().
	limit(10).
	populate('interested_users').
	then((pages)=>{
		var newPages_list = []
		pages.map((page, index)=>{
			var newPage = {}

			newPage.page_name = page[ 'page_name' ]
			newPage.page_image = base64_encode( page[ 'page_image' ] )
			newPage.page_description = page[ 'page_description' ]
			newPage.endpoint = page[ 'endpoint' ]

			newPages_list.push({...newPage})
			newPage = {}
		});

		return newPages_list
	})

	.then((newPages_list) => {

		if (!newPages_list) {

			res.status(401).json({ success: false, msg: "could not find Pages_list" });

		} else {

			res.status(200).json(newPages_list);

		}

	})
	.catch((err) => {

		next(err);

	});
});



















// create a new page with children

router.post('/create-page-with-children', function(req, res, next){
	const newPage = new Page({

		_id: new mongoose.Types.ObjectId(),
		page_name: req.body.parent.page_name,
		page_image: req.body.parent.page_image,
		page_description: req.body.parent.page_description,
		endpoint: req.body.parent.endpoint,

	});

	newPage.save(function (err, newPage) {
		if (err) return console.log(err);




	newPage.save();

	});

});

// find page
	
router.get('/find-page', function(req, res, next){

	Page.findOne({ endpoint: req.body.endpoint })
		.then((page) => {

			page[ page_image ] = base64_encode( page[ 'page_image' ] )

			if (!page) {

				res.status(401).json({ success: false, msg: "could not find page" });

			} else {

				res.status(200).json(page);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// get pages_list

router.get('/pages-list', function(req, res, next){

Page.
	find().
	limit(10).
	then((pages)=>{
		var newPages_list = []
		pages.map((page, index)=>{
			var newPage = {}

			newPage.page_name = page[ 'page_name' ]
			newPage.page_image = base64_encode( page[ 'page_image' ] )
			newPage.page_description = page[ 'page_description' ]
			newPage.endpoint = page[ 'endpoint' ]

			newPages_list.push({...newPage})
			newPage = {}
		});

		return newPages_list
	})

	.then((newPages_list) => {

		if (!newPages_list) {

			res.status(401).json({ success: false, msg: "could not find Pages_list" });

		} else {

			res.status(200).json(newPages_list);

		}

	})
	.catch((err) => {

		next(err);

	});
});

// get pages_list_with_children


// get pages_list_next_10_with_children

router.get('/pages-list-next-10-with-children', function(req, res, next){

	Page.
	find().
	skip(10).
	limit(10).
	populate('interested_users').
	then((pages)=>{
		var newPages_list = []
		pages.map((page, index)=>{
			var newPage = {}

			newPage.page_name = page[ 'page_name' ]
			newPage.page_image = base64_encode( page[ 'page_image' ] )
			newPage.page_description = page[ 'page_description' ]
			newPage.endpoint = page[ 'endpoint' ]

			newPages_list.push({...newPage})
			newPage = {}
		});

		return newPages_list
	})

	.then((newPages_list) => {

		if (!newPages_list) {

			res.status(401).json({ success: false, msg: "could not find Pages_list" });

		} else {

			res.status(200).json(newPages_list);

		}

	})
	.catch((err) => {

		next(err);

	});
});

// get page with children

router.get('/page-with-children', function(req, res, next){
	Page.
		findOne({endpoint:req.body.endpoint}).


		exec(function (err, page_with_children) {
			if (err) return console.log(err);

			res.status(200).json(page_with_children);
		});
})


// get page with summarized children

router.get('/page-with-summarized-children', function(req, res, next){
	Page.
		findOne({endpoint:req.body.endpoint}).


		exec(function (err, blogpost_with_children) {

			if (err) return console.log(err);


		res.status(200).json(page_with_children);

	});
})

// get next 10 pages_list

router.get('/pages-next-10-list', function(req, res, next){

	Page.
		find().
		limit(10).
		skip(10).
		then( 
			(pages) => {
				var newPages_list = []
				pages.map((page, index) => {
					var newPage = {}
	
					newPage.page_name = page[ 'page_name' ]
					newPage.page_image = base64_encode( page[ 'page_image' ] )
					newPage.page_description = page[ 'page_description' ]
					newPage.endpoint = page[ 'endpoint' ]

					newPages_list.push({...newPage})
					newPage = {}
					})
			})

			return newPages_list

		.then((newPages_list) => {

			if (!newPages_list) {

				res.status(401).json({ success: false, msg: "could not find Pages_list" });

			} else {

				res.status(200).json(newPages_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// create User

router.post('/create-user', function(req, res, next){

	User.findOne({
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