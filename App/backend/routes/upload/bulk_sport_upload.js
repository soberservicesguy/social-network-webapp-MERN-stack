require('../../models/sport');
require('../../models/comment');
require('../../models/like');
require('../../models/user');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedCreatingSports } = require('../authMiddleware/isAllowedCreatingSports')

const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();

const Sport = mongoose.model('Sport');

const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const User = mongoose.model('User');

const multer = require('multer');
const path = require('path')

const fs = require('fs')

// bulk importing script
const sheet_to_class = require('../../excel_to_databases/import_bulksports')
const delete_all_sports = require('../../excel_to_databases/delete_all_sports')

const {
	get_multer_storage_to_use,
	get_multer_storage_to_use_for_bulk_files,
	get_file_storage_venue,
	get_file_path_to_use,
	get_file_path_to_use_for_bulk_files,

	use_gcp_storage,
	use_aws_s3_storage,

	save_file_to_gcp,
	save_file_to_gcp_for_bulk_files,
	gcp_bucket,

	get_snapshots_storage_path,

	save_file_to_aws_s3,
	save_file_to_aws_s3_for_bulk_files,

	get_multer_disk_storage_for_bulk_files,

	checkFileTypeForImages,
	checkFileTypeForImageAndVideo,
	checkFileTypeForImagesAndExcelSheet,
} = require('../../config/storage/')

let timestamp
let currentDate
let currentTime

// Set The Storage Engine
// const bulk_sports_storage = multer.diskStorage({
// 	// destination: path.join(__dirname , '../../assets/bulk_sports/'),
// 	destination:function(req, file, cb){
// 		// let file_path = `./uploads/${type}`;
// 		currentDate = new Date().toLocaleDateString("en-US").split("/").join(" | ");
// 		currentTime = new Date().toLocaleTimeString("en-US").split("/").join(" | ");

// 		if (file.fieldname === "sport_image") {

// 			let file_path = path.join(__dirname , '../../assets/bulk_sports/images')
// 			cb(null, file_path)	

// 		} else {

// 			fs.mkdir( path.join(__dirname , `../../assets/bulk_sports/${currentDate}_${currentTime}`), { recursive: true }, (err) => {
// 				if (err) throw err;
// 			})
			
// 			let file_path = path.join(__dirname , `../../assets/bulk_sports/${currentDate}_${currentTime}`)
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


// Init Upload
function bulk_upload_sports(timestamp, folder_name){

	return multer({
		storage: get_multer_storage_to_use_for_bulk_files(timestamp, folder_name),
		limits:{fileSize: 200000000}, // 1 mb
		fileFilter: function(req, file, cb){
			checkFileTypeForImagesAndExcelSheet(file, cb);
		}
	}).fields([
		{ name: 'excel_sheet', maxCount: 1 }, 
		{ name: 'sport_image', maxCount: 1000 }
	])  // these are the fields that will be dealt
	// .single('sport_image'); 
	// .array('photos', 12)
} 


// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/bulk-upload-sports', passport.authenticate('jwt', { session: false }), isAllowedCreatingSports, function(req, res, next){
	
	// console.log('OUTER LOG')
	// console.log(req.body)
	timestamp = Date.now()
	currentDate = timestamp.toLocaleDateString("en-US").split("/").join(" | ");
	currentTime = timestamp.toLocaleTimeString("en-US").split("/").join(" | ");

	bulk_upload_sports( `${currentDate}_${currentTime}`, 'bulk_sports' )(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			// give excel file name and run bulk import function
			// req.files['excel_sheet'][0] // pull data from it and create sports
			{(async () => {

				let images

				if (use_gcp_storage){

					await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_sports', req.files['excel_sheet'][0] )
					images = req.files['sport_image']
					Promise.all(images.map((image_file) => {
						await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_sports', image_file )
					}))
					console.log('SAVED TO GCP')

				} else if (use_aws_s3_storage) {

					await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_sports', req.files['excel_sheet'][0])
					images = req.files['sport_image']
					Promise.all(images.map((image_file) => {
						await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_sports', image_file )
					}))
					console.log('SAVED TO AWS')

				} else {

					console.log('SAVED TO DISK STORAGE')

				}

			})()}


			let user_id = ''
		// finding the user who is uploading so that it can be passed to sheet_to_class for assignment on posts
			User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
			.then((user) => {
				if (user){

					user_id = user._id
					// console.log( req.files['excel_sheet_for_socialpost'][0] )
					// give path

					let uploaded_excel_sheet = path.join(__dirname , `../../assets/bulk_sports/${currentDate}_${currentTime}/${req.files['excel_sheet'][0].filename}`) 
					sheet_to_class( uploaded_excel_sheet, user_id )
					res.status(200).json({ success: true, msg: 'new sports created'});	

				} else {
					res.status(200).json({ success: false, msg: "new sports NOT created, try again" });
				}
			})
			.catch((error) => {
				res.status(200).json({ success: false, msg: "new sports NOT created, try again" });
			})

		}
	})
})


router.get('/bulk-delete-sports', passport.authenticate('jwt', { session: false }), isAllowedCreatingSports, function(req, res, next){
	
	try{

		delete_all_sports()
		res.status(200).json({ success: true, msg: "all sports deleted" });

	} catch (err){

		res.status(200).json({ success: false, msg: err });

	}

})

module.exports = router;