require('../../models/video');
require('../../models/comment');
require('../../models/like');
require('../../models/user');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedUploadingVideos } = require('../authMiddleware/isAllowedUploadingVideos')

const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Video = mongoose.model('Video');
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const User = mongoose.model('User');

const multer = require('multer');
const path = require('path')

const fs = require('fs')

var ffmpeg = require('fluent-ffmpeg') // for setting thumbnail of video upload using snapshot


// bulk importing script
const sheet_to_class = require('../../excel_to_databases/import_bulkvideos')
const bulk_delete_all_videos = require('../../excel_to_databases/delete_all_videos')

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
	checkFileTypeForVideosAndExcelSheet,
} = require('../../config/storage/')

let timestamp
let currentDate
let currentTime

// Set The Storage Engine


// Init Upload
function bulk_upload_videos(timestamp, folder_name){
	return multer({
		storage: get_multer_storage_to_use_for_bulk_files(timestamp, folder_name),
		limits:{fileSize: 200000000}, // 1 mb
		fileFilter: function(req, file, cb){
			checkFileTypeForVideosAndExcelSheet(file, cb);
		}
	}).fields([
		{ name: 'videos_to_upload', maxCount: 1000 },
		{ name: 'excel_sheet', maxCount: 1 }, 
	])  // these are the fields that will be dealt
	// .single('image_thumbnails'); 
	// .array('photos', 12)
}

// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/bulk-upload-videos', passport.authenticate('jwt', { session: false }), isAllowedUploadingVideos, async function(req, res, next){
	
	// console.log('OUTER LOG')
	// console.log(req.body)

	timestamp = Date.now()
	currentDate = timestamp.toLocaleDateString("en-US").split("/").join(" | ");
	currentTime = timestamp.toLocaleTimeString("en-US").split("/").join(" | ");

	bulk_upload_videos( `${currentDate}_${currentTime}`, 'bulk_videos' )(req, res, async (err) => {
		if(err){

			console.log(err)

		} else {

			{(async () => {

				let images

				if (use_gcp_storage){

					await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', req.files['excel_sheet'][0] )
					videos = req.files['videos_to_upload']
					Promise.all(videos.map((video_file) => {
						await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', video_file )
					}))
					console.log('SAVED TO GCP')

				} else if (use_aws_s3_storage) {

					await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', req.files['excel_sheet'][0])
					videos = req.files['videos_to_upload']
					Promise.all(videos.map((video_file) => {
						await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', video_file )
					}))
					console.log('SAVED TO AWS')

				} else {

					console.log('SAVED TO DISK STORAGE')

				}

			})()}


			var uploaded_videos = req.files['videos_to_upload']

			let create_all_snapshot = await Promise.all(uploaded_videos.map((uploaded_video) => {
				if(uploaded_video == undefined){

					res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${uploaded_video.filename}`})

				} else {
					console.log('FILE NAME IS BELOW')
					console.log( path.extname(uploaded_video.filename) )
				// video is uploaded , NOW creating thumbnail from video using snapshot
	 				ffmpeg(`./assets/bulk_videos/videos/${uploaded_video.filename}`)
					// screenshots at mentioned times
					// .takeScreenshots({ 
					// 	count: 2, 
					// 	timemarks: [ '00:00:02.000', '6' ], 
					// 	filenames: [
					// 		`${filename_used_to_store_video_in_assets_without_format}1.png`, 
					// 		`${filename_used_to_store_video_in_assets_without_format}2.png`, 
					// 	],
					// 	size: '150x100', 
					// }, '../assets/videos/uploads/upload_thumbnails/')
					// screenshots at % completion ie 20%, 40%, 60%, 80%
					.screenshots({
						// filename: 'name-of-file.png', // if single snapshot is needed
						// timemarks: [ '00:00:02.000', '6' ], 
						// Will take screenshots at 20%, 40%, 60% and 80% of the video
						filename:`${uploaded_video.filename.replace( path.extname(uploaded_video.filename), "")}.png`,
						// filenames: [
						// 	`${uploaded_video.filename}1.png`, 
						// 	`${uploaded_video.filename}2.png`, 
						// 	`${uploaded_video.filename}3.png`, 
						// 	`${uploaded_video.filename}4.png`,
						// ],
						count: 4,
						size: '150x100', 
						folder: './assets/bulk_videos/thumbnails_images/',
					})
					.on('end', function() {
						console.log('Screenshots taken');
					})
					.on('error', function(err) {
						console.error(err);
					})
					.on('filenames', function(filenames) {
						console.log('screenshots are ' + filenames.join(', '));
					})

				// // saving video in DB
				// 	video_id = new mongoose.Types.ObjectId()
				// 	const newVideo = new Video({
				// 		_id: video_id,
				// 		image_thumbnail: `${filename_used_to_store_video_in_assets_without_format}1.png`,
				// 		timestamp_of_uploading: String( Date.now() ),
				// 		video_filepath: `./assets/videos/uploads/videos_uploaded_by_users/${filename_used_to_store_video_in_assets}`,
				// 		category: req.body.category,
				// 		title: req.body.title,
				// 		all_tags: req.body.all_tags,
				// 		description: req.body.description,
				// 		// endpoint:String, // will be taken care at db model
				// 	})

				// 	newVideo.save(function (err, newVideo) {

				// 		if (err){
				// 			res.status(404).json({ success: false, msg: 'couldnt create video database entry'})
				// 			return console.log(err)
				// 		}

				// 		// assign user object then save
				// 		User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
				// 		.then((user) => {
				// 			if (user){

				// 				newVideo.user = user
				// 				newVideo.save()
				// 			// finding video saved to access its endpoint since its created at model level
								
				// 			} else {

				// 				res.status(200).json({ success: false, msg: "user doesnt exists, try logging in again" });

				// 			}
				// 		})
				// 		.then(() => {

				// 			Video.findOne({ _id: video_id })
				// 			.then((saved_video) => {
				// 				res.status(200).json({ success: true, msg: 'new user saved', video_endpoint: saved_video.endpoint});	

				// 			})

				// 		})
				// 		.catch((err) => {

				// 			next(err);

				// 		})

				// 		// not needed, used for multer
				// 		// res.status(200).json({ success: false, msg: 'couldnt create video database entry',file: `uploads/${req.file.filename}`})
				// 	})

				}

			}))
			.then(() => {

				// give excel file name and run bulk import function
				// req.files['excel_sheet_for_user'][0] // pull data from it and create users
				let user_id = ''
			// finding the user who is uploading so that it can be passed to sheet_to_class for assignment on posts
				User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
				.then((user) => {
					if (user){

						user_id = user._id
						// console.log( req.files['excel_sheet_for_socialpost'][0] )
						// give path
						let uploaded_excel_sheet = path.join(__dirname , `../../assets/bulk_videos/${currentDate}_${currentTime}/${req.files['excel_sheet'][0].filename}`) 
						sheet_to_class( uploaded_excel_sheet, user_id )
						res.status(200).json({ success: true, msg: 'new videos created'});	

					} else {
						res.status(200).json({ success: false, msg: "new videos NOT created, try again" });
					}

				})
				.catch((error) => {
					res.status(200).json({ success: false, msg: "new videos NOT created, try again" });
				})
				// give excel file name and run bulk import function
				// req.files['excel_sheet'][0] // pull data from it and create blogposts
			})

		}
	})
})


router.get('/bulk-delete-videos', passport.authenticate('jwt', { session: false }), isAllowedUploadingVideos, function(req, res, next){
	try{

		bulk_delete_all_videos()
		res.status(200).json({ success: true, msg: "all videos deleted" });

	} catch (err){

		res.status(200).json({ success: false, msg: err });

	}

})

module.exports = router;