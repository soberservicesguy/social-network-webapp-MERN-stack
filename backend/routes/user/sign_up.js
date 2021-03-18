// require('../../models/image');
require('../../models/user');
require('../../models/privilige');
require('../../models/image');

const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('User');
const Image = mongoose.model('Image');
const Privilege = mongoose.model('Privilege');

const passport = require('passport');
const utils = require('../../lib/utils');

const multer = require('multer');
const path = require('path');

var filename_used_to_store_image_in_assets = ''
var filename_used_to_store_image_in_assets_without_format = ''

// Set The Storage Engine
const image_storage = multer.diskStorage({
	destination: path.join(__dirname , '../../assets/images/uploads/avatar_image'),
	filename: function(req, file, cb){
		// file name pattern fieldname-currentDate-fileformat
		filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
		filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

		cb(null, filename_used_to_store_image_in_assets);

	}
});

// Init Upload
const user_avatar_image_upload = multer({
	storage: image_storage,
	limits:{fileSize: 2000000}, // 1 mb
	fileFilter: function(req, file, cb){
		checkFileTypeForUserAvatar(file, cb);
	}
}).single('avatar_image'); // this is the field that will be dealt

// Check File Type
function checkFileTypeForUserAvatar(file, cb){
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

// router.post('/protected-avatar-image-upload', passport.authenticate('jwt', { session: false }), (req, res, next) => {
router.post('/signup-and-get-privileges', (req, res, next) => {

//	here there will be no req.body due to multer 
	// console.log('OUTER LOG')
	// console.log(req.body)

	user_avatar_image_upload(req, res, (err) => {
		
	// wrapping in IIFE since await requires async keyword which cant be applied to above multer function
		{(async () => {

			if(err){

				console.log(err)

			} else {

				if(req.file == undefined){
					console.log('nothing')
					res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

				} else {

					let newUser
					let newImage
				// saving image
					try{

						newImage = new Image({

							_id: new mongoose.Types.ObjectId(),
							image_filepath: `./assets/images/uploads/avatar_image/${filename_used_to_store_image_in_assets}`,
							category: req.body.category,
							timestamp_of_uploading: String( Date.now() ),
							// title: req.body.title,
							// description: req.body.description,
							// all_tags: req.body.all_tags,
							// endpoint: req.body.endpoint, // this will be taken care in db model

						});


					} catch (image_error){
						res.status(404).json({ success: false, msg: 'couldnt create image database entry'})
					}

				// creating user, which needs image object
					try{
						let user_found = await User.findOne({ phone_number: req.body.phone_number })
						if (!user_found){
							const saltHash = utils.genPassword(req.body.password);							
							const salt = saltHash.salt;
							const hash = saltHash.hash;

							newUser = new User({

								_id: new mongoose.Types.ObjectId(),
								user_name: req.body.user_name,
								phone_number: req.body.phone_number,
								user_image: `./assets/images/uploads/avatar_image/${filename_used_to_store_image_in_assets}`,
								user_avatar_image: `./assets/images/uploads/avatar_image/${filename_used_to_store_image_in_assets}`,
								hash: hash,
								salt: salt,

							});
							// await newUser.save()

						} else {
							res.status(200).json({ success: false, msg: "user already exists, try another" });
						}

					} catch (err){
						console.log(err)
					}

					// getting privileges to assign
					let privileges_list = []					
					if ( req.body.privileges_selected === 'Basic' ){

						privileges_list.push('allow_surfing')

					} else if ( req.body.privileges_selected === 'Posts Interaction' ){

						privileges_list.push('allow_interacting_with_others_post')

					} else if ( req.body.privileges_selected === 'Posts Creation' ){

						privileges_list.push('allow_post_creating')

					} else if ( req.body.privileges_selected === 'Ads Creation' ){

						privileges_list.push('allow_ad_creating')

					} else if ( req.body.privileges_selected === 'Books Creation' ){

						privileges_list.push('allow_book_creating')

					} else if ( req.body.privileges_selected === 'Pages Creation' ){

						privileges_list.push('allow_page_creating')

					} else if ( req.body.privileges_selected === 'Sports Creation' ){

						privileges_list.push('allow_sport_creating')

					} else if ( req.body.privileges_selected === 'Total control' ){

						privileges_list.push('allow_interacting_with_others_post')
						privileges_list.push('allow_post_creating')
						privileges_list.push('allow_ad_creating')
						privileges_list.push('allow_book_creating')
						privileges_list.push('allow_page_creating')
						privileges_list.push('allow_sport_creating')

					} else {
					}

					// going to assign privileges
					let all_work = await Promise.all(privileges_list.map(async (privilege_name, index) => {

						let privilege = await Privilege.findOne({ privilege_name: privilege_name })

						if (!privilege){

							const newPrivilege = new Privilege({

								_id: new mongoose.Types.ObjectId(),
								privilege_name: privilege_name,

							})
																		
							newPrivilege.users.push(newUser)
							await newPrivilege.save()

							newUser.privileges.push(newPrivilege)

						} else if (privilege) {

							privilege.users.push(newUser)
							await privilege.save()

							newUser.privileges.push(privilege)

						} else {
						}

					}))
					// await new Image({args}).save shortcut
					newImage.user = newUser
					await newImage.save()
					await newUser.save()
					res.status(200).json({ success: true, msg: 'new user saved' });

				}
			}
		})()}

	})

})

module.exports = router
