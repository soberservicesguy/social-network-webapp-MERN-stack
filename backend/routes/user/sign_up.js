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

const env = require("dotenv").config({ path: "../../.env" });
const use_gcp_storage = ( process.env.GOOGLE_CLOUD_STORAGE_ENABLED === 'true' ) ? true : false
const use_aws_s3_storage = ( process.env.AWS_S3_STORAGE_ENABLED === 'true' ) ? true : false
const { gcp_storage, save_file_to_gcp, get_file_from_gcp, gcp_bucket } = require('../../config/google_cloud_storage')
const { multers3_storage, s3_bucket } = require('../../config/aws_s3_storage')

var filename_used_to_store_image_in_assets = ''
var filename_used_to_store_image_in_assets_without_format = ''

function get_storage_to_use(){
	if (use_gcp_storage){
	
		return multer.memoryStorage()
	
	} else if (use_aws_s3_storage){
	
		return multers3_storage
	
	} else {
	
		return cover_and_avatar_storage
	
	}
}

function get_file_storage_place(){
	if (use_gcp_storage){
	
		return 'gcp_storage'
	
	} else if (use_aws_s3_storage){
	
		return 'aws_s3'
	
	} else {
	
		return 'disk_storage'
	
	}
}


function get_file_path_to_use(file_to_save, folder_name){

	if (use_gcp_storage){

		// return `${bucket_name}/${file_to_save.originalname}` 
		return `https://storage.googleapis.com/${gcp_bucket}/${folder_name}/${file_to_save.originalname}` 

	} else if (use_aws_s3_storage){

		// return `${bucket_name}/${file_to_save.originalname}`
		return `http://s3.amazonaws.com/${s3_bucket}/${folder_name}/${file_to_save.originalname}`

	} else {

		return `assets/images/uploads/avatar_image/${file_to_save.originalname}`	

	}	
}

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
const upload_user_avatar_image = multer({
	storage: get_storage_to_use(), // image_storage,
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

	upload_user_avatar_image(req, res, (err) => {
		
	// wrapping in IIFE since await requires async keyword which cant be applied to above multer function
		{(async () => {

			if(err){

				console.log(err)

			} else {

				if(req.file == undefined){

					res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

				} else {

					let newUser
					let newImage

				// WE NEED UPLOADED FILES THEREFORE CREATING CONDITIONS OF USING GCP, AWS, OR DISK STORAGE
				// not needed since we not getting the image
					// let user_avatar_image_to_use
					if (use_gcp_storage){

						// console.log('req.file')
						// console.log(req.file)
						// console.log(filename_used_to_store_image_in_assets)
						await save_file_to_gcp(req.file, gcp_bucket, 'avatar_images')
					// not needed since we not getting the image
						// user_avatar_image_to_use = await get_file_from_gcp( req.file )

					} else if (use_aws_s3_storage) {

						console.log('SAVED AUTOMATICALLY TO AWS')

					// not needed since we not getting the image
						// let avatar_filename = req.file.key // name of file
						// let avatar_location = req.file.location // url
						// user_avatar_image_to_use = avatar_location

					} else {

					// not needed since we not getting the image
						// user_avatar_image_to_use = user.user_avatar_image

					}

				// saving image
					try{

						newImage = new Image({

							_id: new mongoose.Types.ObjectId(),
							// image_filepath: `./assets/images/uploads/avatar_image/${filename_used_to_store_image_in_assets}`,
							image_filepath: get_file_path_to_use(req.file, 'avatar_images'),
							category: req.body.category,
							timestamp_of_uploading: String( Date.now() ),
							images_hosted_location: get_file_storage_place(),
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

						if (user_found){

							res.status(200).json({ success: false, msg: "user already exists, try another" });
							return

						} else {

							const saltHash = utils.genPassword(req.body.password);							
							const salt = saltHash.salt;
							const hash = saltHash.hash;

							newUser = new User({

								_id: new mongoose.Types.ObjectId(),
								user_name: req.body.user_name,
								phone_number: req.body.phone_number,
								user_image: get_file_path_to_use(req.file, 'avatar_images'),
								user_avatar_image: get_file_path_to_use(req.file, 'avatar_images'),
								hash: hash,
								salt: salt,
								images_hosted_location: get_file_storage_place(),
							});

						}

					} catch (err){
						console.log('user not created')
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