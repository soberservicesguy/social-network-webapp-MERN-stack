require('../../models/page');
require('../../models/user');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedCreatingPages } = require('../authMiddleware/isAllowedCreatingPages')
const { isAllowedInteractingWithOthersPosts } = require('../authMiddleware/isAllowedInteractingWithOthersPosts')

const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Page = mongoose.model('Page');
const User = mongoose.model('User');

require('../../models/activity');
const Activity = mongoose.model('Activity');

const multer = require('multer');
const path = require('path')

const { 
	get_image_to_display,

	get_multer_storage_to_use,
	get_file_storage_venue,
	get_file_path_to_use,

	use_gcp_storage,
	use_aws_s3_storage,

	save_file_to_gcp,
	gcp_bucket,

	get_snapshots_storage_path,

	save_file_to_aws_s3,

	checkFileTypeForImages,
} = require('../../config/storage/')

let timestamp

// Init Upload
function upload_page_by_user(timestamp){ 
	return multer({
		storage: get_multer_storage_to_use(timestamp),
		limits:{fileSize: 200000000}, // 1 mb
		fileFilter: function(req, file, cb){
			checkFileTypeForImages(file, cb);
		}
	}).single('page_image'); // this is the field that will be dealt
	// .array('page_images', 12)
}




// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/create-page-with-user', passport.authenticate('jwt', { session: false }), isAllowedCreatingPages, function(req, res, next){
	
	// console.log('OUTER LOG')
	// console.log(req.body)
	timestamp = Date.now()

	upload_page_by_user(timestamp)(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			if(req.file == undefined){

				res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

			} else {
				// console.log('INNER LOG')
				// console.log(req.body)
				{(async () => {

					if (use_gcp_storage){

						await save_file_to_gcp(timestamp, req.file, 'page_images')
						console.log('SAVED TO GCP')

					} else if (use_aws_s3_storage) {

						console.log('SAVED TO AWS')

					} else {

						console.log('SAVED TO DISK STORAGE')

					}

				// image is uploaded , now saving image in db
					const newPage = new Page({

						_id: new mongoose.Types.ObjectId(),
						page_name: req.body.page_name,
						page_image: get_file_path_to_use(req.file, 'page_images', timestamp),
						// page_image: `./assets/images/uploads/page_images/${filename_used_to_store_image_in_assets}`,
						page_description: req.body.page_description,
						// endpoint: req.body.endpoint,
						object_files_hosted_at: get_file_storage_venue(),

					});

					newPage.save(function (err, newPage) {

						if (err){
							res.status(404).json({ success: false, msg: 'couldnt create page database entry'})
							return console.log(err)
						}
						// assign user object then save
						User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
						.then(async (user) => {
							if (user){

								newPage.page_created_by_user = user
								newPage.save()

								let base64_encoded_image
								base64_encoded_image = await get_image_to_display(newPage.page_image, newPage.object_files_hosted_at)

								// in response sending new image too with base64 encoding
								// if (use_gcp_storage){

								// 	{(async () => {

								// 		cloud_resp = await axios.get(newPage.page_image)
								// 		base64_encoded_image = base64_encode( cloud_resp.data )

								// 	})()}

								// } else if (use_aws_s3_storage) {

								// 	{(async () => {

								// 		cloud_resp = await axios.get(newPage.page_image)
								// 		base64_encoded_image = base64_encode( cloud_resp.data )

								// 	})()}


								// } else {

								// 	base64_encoded_image = base64_encode( newPage.page_image )

								// }

								let new_page = {
									page_name: newPage.page_name,
									page_image: base64_encoded_image,
									page_description: newPage.page_description,
									page_endpoint: newPage.endpoint,

								}


								res.status(200).json({ success: true, msg: 'new page saved', new_page: new_page});	


								let newActivity = new Activity({
									_id: new mongoose.Types.ObjectId(),
									user: user,
									activity_type: 'created_page',
									page_created: newPage,
								})
								newActivity.save()
								user.activities.push(newActivity)
								user.save()


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
				})()}

			}
		}
	})
})

// USED
router.get('/pages-list-with-children', async function(req, res, next){

	Page.
	find().
	limit(10).
	populate('interested_users').
	then(async (pages)=>{

		if (pages){

			var newPages_list = []
			let all_pages = await Promise.all(pages.map(async (page, index)=>{
				var newPage = {}

				newPage.page_name = page[ 'page_name' ]
				// OLD VERSION
				// newPage.page_image = await get_image_to_display(page.page_image, page.object_files_hosted_at)
				// NEW VERSION
				newPage.page_image = page.page_image
				newPage.page_image_host = page.object_files_hosted_at
				newPage.page_description = page[ 'page_description' ]
				newPage.endpoint = page[ 'endpoint' ]

				newPages_list.push({...newPage})
				newPage = {}
			}));

			res.status(200).json(newPages_list);

		} else {

			res.status(401).json({ success: false, msg: "could not find Pages_list" });

		}

	})
	.catch((err) => {

		next(err);

	});
});



// will be used for creating interest
// USED
router.post('/create-interest-for-page', passport.authenticate('jwt', { session: false }), isAllowedInteractingWithOthersPosts, function(req, res, next){

	var page_endpoint = req.body.page_endpoint

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then((user) => {
					
		// newLike.user = user

	// finding BlogPost object
		Page.findOne({endpoint: page_endpoint})
		.then((page) => {

			if (!page){
				console.log('PAGE NOT FOUND')
				return
			}
			page.interested_users.push( user )

			// newLike.page = page

			// newLike.save(function (err, newLike) {
			// 	if (err) return console.log(err);
			// })
				
			page.save((err, page) => res.status(200).json(page) )


			let newActivity = new Activity({
				_id: new mongoose.Types.ObjectId(),
				user: user,
				activity_type: 'got_interested_in_page',
				page_liked: page,
			})
			newActivity.save()
			user.activities.push(newActivity)
			user.save()


		})
		.catch((err1) => {
			console.log(err1)
		})

	})
	.catch((err) => {
		console.log(err)
	})

})



// USED
router.get('/get-all-interest-in-page',async function(req, res, next){

	let list_of_promises = []

// find blogpost
	var page_with_interested_users = await Page.findOne({endpoint:req.query.endpoint}).
	populate('interested_users').
	then((page_with_interested_users) => {

		if ( page_with_interested_users ){

			return page_with_interested_users.interested_users
	
		} else {

			null

		}

	})

	list_of_promises.push( page_with_interested_users )

// find likes from blogpost
	let final_interested_payload = await Promise.all(page_with_interested_users.map(async (like_object) => {

	// find user from each like
		return await User.findOne({_id:like_object.user})
		.then(async (user_object) => {

			if (user_object){

				// return user_object
				return {
					user_name:user_object.user_name,
					user_avatar_image:base64_encode(user_object.user_avatar_image),
				}

			} else {
				null
			}
		})
		
	}))


	Promise.all(list_of_promises)
	.then(() => {

		// console.log(final_interested_payload)
		res.status(200).json( final_interested_payload );

	})

})














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