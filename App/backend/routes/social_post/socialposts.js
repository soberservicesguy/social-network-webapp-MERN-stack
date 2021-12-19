require('../../models/socialpost');
require('../../models/comment');
require('../../models/like');
require('../../models/share');
require('../../models/user');
require('../../models/advertisement');
require('../../models/book');
require('../../models/page');
require('../../models/sport');


const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedCreatingPosts } = require('../authMiddleware/isAllowedCreatingPosts')
const { isAllowedInteractingWithOthersPosts } = require('../authMiddleware/isAllowedInteractingWithOthersPosts')


const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const SocialPost = mongoose.model('SocialPost');
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const Share = mongoose.model('Share');
const User = mongoose.model('User');
const Advertisement = mongoose.model('Advertisement');
const Book = mongoose.model('Book');
const Page = mongoose.model('Page');
const Sport = mongoose.model('Sport');


require('../../models/activity');
const Activity = mongoose.model('Activity');


const multer = require('multer');
const path = require('path')

// var ffmpeg = require('fluent-ffmpeg') // for setting thumbnail of video upload using snapshot

const {
	get_image_to_display,
	get_file_path_to_use_alternate,
	store_video_at_tmp_and_get_its_path,
	delete_video_at_tmp,
	// get_multer_storage_to_use,
	get_multer_storage_to_use_alternate,
	// get_multer_storage_to_use_for_bulk_files,
	get_file_storage_venue,
	get_file_path_to_use,
	// get_file_path_to_use_for_bulk_files,
	// get_snapshots_storage_path,
	get_snapshots_fullname_and_path,

	gcp_bucket,
	// save_file_to_gcp_storage,
	save_file_to_gcp,
	// save_file_to_gcp_for_bulk_files,
	use_gcp_storage,
	get_file_from_gcp,
	
	s3_bucket,
	use_aws_s3_storage,
	// save_file_to_s3,
	get_file_from_aws,
	save_file_to_aws_s3,
	// save_file_to_aws_s3_for_bulk_files,

	// checkFileTypeForImages,
	checkFileTypeForImageAndVideo,
	// checkFileTypeForImagesAndExcelSheet,
} = require('../../config/storage/')

const {
	// select_random_screenshot,
	create_snapshots_from_uploaded_video,
	save_socialpost_and_activity,
	save_generated_snapshots,
	get_post_details,
} = require('./functions')

let timestamp

// const images_upload_path = 'assets/uploads/social_post_images'
// const video_upload_path = `assets/uploads/social_post_videos`
// const video_image_thumbnail_path = `assets/uploads/thumbnails_for_social_videos`

let total_snapshots_count = 4



 
// Init Upload
function upload_image_or_video_in_social_post(timestamp){
	return multer({
		storage: get_multer_storage_to_use_alternate(timestamp),
		limits:{fileSize: 200000000}, // 1 mb
		fileFilter: function(req, file, cb){
			checkFileTypeForImageAndVideo('social_post_image', 'social_post_video')(file, cb);
		}
	}).fields([
		{ name: 'social_post_image', maxCount: 1 }, 
		{ name: 'social_post_video', maxCount: 1 }
	])  // these are the fields that will be dealt
	// .single('blogpost_image_main'); 
	// .array('photos', 12)
}




// USED IN CREATING BLOGPOST
router.post('/create-socialpost-with-user', passport.authenticate('jwt', { session: false }), isAllowedCreatingPosts, function(req, res, next){

	let social_post_id = ''
	let social_post_type = ''

	timestamp = Date.now()

	upload_image_or_video_in_social_post(timestamp)(req, res, (err) => {

		{(async () => {

			if(err){

				console.log(err)

			} else {

				let promises = []
				let save_image_or_video_promise

			// saving image and video files first if available
				if ( req.files['social_post_image'] ){

						if (use_gcp_storage){

							// save_image_or_video_promise = await save_file_to_gcp( timestamp, req.files['social_post_image'][0] )
							save_image_or_video_promise = save_file_to_gcp( timestamp, req.files['social_post_image'][0] )
							promises.push(save_image_or_video_promise)

						} else if (use_aws_s3_storage) {

							// save_image_or_video_promise = await save_file_to_aws_s3( req.files['social_post_image'][0], timestamp )
							save_image_or_video_promise = save_file_to_aws_s3( req.files['social_post_image'][0], timestamp )
							promises.push(save_image_or_video_promise)
							console.log('SAVED TO AWS')
							// console.log(save_image_or_video_promise)

						} else {

							console.log('SAVED TO DISK STORAGE')

						}

				} else if ( req.files['social_post_video'] ){


						if (use_gcp_storage){

							// save_image_or_video_promise = await save_file_to_gcp(timestamp, req.files['social_post_video'][0])
							save_image_or_video_promise = save_file_to_gcp(timestamp, req.files['social_post_video'][0])
							promises.push(save_image_or_video_promise)

							console.log('SAVED TO GCP')

						} else if (use_aws_s3_storage) {

							// console.log(`req.files['social_post_video']`)
							// console.log(req.files['social_post_video'][0])
							// save_image_or_video_promise = await save_file_to_aws_s3( req.files['social_post_video'][0] )
							save_image_or_video_promise = save_file_to_aws_s3( req.files['social_post_video'][0], timestamp )
							promises.push(save_image_or_video_promise)
							// console.log(save_image_or_video_promise)
							console.log('SAVED TO AWS')

						} else {

							console.log('SAVED TO DISK STORAGE')

						}

				} else {
				} 


				social_post_id = new mongoose.Types.ObjectId()
				let image_path = ''
				let video_path = ''

				let newSocialPost
				let store_video_at_tmp_promise
				let create_snapshots_promise
				let save_snapshots_promises
				let save_socialpost_promise

				let promise_fulfilled

				// console.log('HERE 1')


					if (req.files['social_post_image'] !== undefined && req.body.post_text){

						social_post_type = 'text_with_image_post'
						image_path = get_file_path_to_use(req.files['social_post_image'][0], 'social_post_images', timestamp)
						// image_path = path.join(images_upload_path, `${req.files['social_post_image'][0].filename}`)
						newSocialPost = new SocialPost({
							_id: social_post_id,
							type_of_post: social_post_type,
							post_text: req.body.post_text,
							image_for_post: image_path,
							object_files_hosted_at: get_file_storage_venue(),
							// image_for_post: get_file_path_to_use(req.files['social_post_image'][0], 'social_post_images'),
							// image_for_post: `./assets/images/uploads/social_post_images/${req.files['social_post_image'][0].filename}`,
						});

						await Promise.all(promises)
						save_socialpost_promise = await save_socialpost_and_activity(req, res, err, newSocialPost, social_post_type, social_post_id, total_snapshots_count)

					} else if (req.files['social_post_image'] !== undefined && !req.body.post_text){

						social_post_type = 'image_post'
						image_path = get_file_path_to_use(req.files['social_post_image'][0], 'social_post_images', timestamp)
						// console.log('image_path')
						// console.log(images_upload_path)
						// image_path = path.join(images_upload_path, `${req.files['social_post_image'][0].filename}`)
						newSocialPost = new SocialPost({
							_id: social_post_id,
							type_of_post: social_post_type,
							image_for_post: image_path,
							object_files_hosted_at: get_file_storage_venue(),
							// image_for_post: get_file_path_to_use(req.files['social_post_image'][0], 'social_post_images'),
							// image_for_post: `./assets/images/uploads/social_post_images/${req.files['social_post_image'][0].filename}`,
						});


						await Promise.all(promises)
						save_socialpost_promise = await save_socialpost_and_activity(req, res, err, newSocialPost, social_post_type, social_post_id, total_snapshots_count)

					} else if (req.files['social_post_video'] !== undefined && req.body.post_text){

						video_path = get_file_path_to_use_alternate(req.files['social_post_video'][0], 'social_post_videos', timestamp)
						let video_for_post
						if (use_gcp_storage){

							video_for_post = `${ gcp_bucket }/${ video_path }`

						} else if (use_aws_s3_storage){

							// since we will be using cloud front
							video_for_post = `${ video_path }`

						} else {

							video_for_post = get_file_path_to_use_alternate(req.files['social_post_video'][0], 'social_post_videos', timestamp)

						}
					// video_path = path.join(video_upload_path, `${req.files['social_post_video'][0].filename}`)
						function after_screenshot_callback(){

							social_post_type = 'text_with_video_post'
							let file_without_format = path.basename( req.files['social_post_video'][0].originalname, path.extname( req.files['social_post_video'][0].originalname ) )

							newSocialPost = new SocialPost({
								_id: social_post_id,
								type_of_post: social_post_type,
								post_text: req.body.post_text,
								video_for_post: video_for_post,
								// video_for_post: video_path,
								video_thumbnail_image: get_snapshots_fullname_and_path('thumbnails_for_social_videos', file_without_format, timestamp),
								object_files_hosted_at: get_file_storage_venue(),
								// video_thumbnail_image: `${get_snapshots_storage_path()}/${file_without_format}_${select_random_screenshot(4)}.png`,
								// video_for_post: get_file_path_to_use_alternate(req.files['social_post_video'][0], 'social_post_videos'),
								// video_for_post: get_file_path_to_use_alternate(req.files['social_post_video'][0].filename, 'social_post_videos'),
								// video_for_post: `./assets/videos/uploads/social_post_videos/${req.files['social_post_video'][0].filename}`,
								// video_thumbnail_image: `${get_snapshots_storage_path()}/${req.files['social_post_video'][0].filename}-${timestamp}.png`,
							});

							return newSocialPost
						}

						if (use_gcp_storage || use_aws_s3_storage){

							store_video_at_tmp_promise = store_video_at_tmp_and_get_its_path( req.files['social_post_video'][0], video_path )
							promises.push(store_video_at_tmp_promise)

							promise_fulfilled = await Promise.all(promises)

							create_snapshots_promise = await create_snapshots_from_uploaded_video(timestamp, req.files['social_post_video'][0], promise_fulfilled[1], total_snapshots_count)


						} else {

							create_snapshots_promise = await create_snapshots_from_uploaded_video(timestamp, req.files['social_post_video'][0], video_for_post, total_snapshots_count)

						}

						save_socialpost_promise = await save_socialpost_and_activity(req, res, err,  after_screenshot_callback(), social_post_type, social_post_id, total_snapshots_count)
						// await Promise.all(save_snapshots_promises)




					} else if (req.files['social_post_video'] !== undefined && !req.body.post_text){

						
						video_path = get_file_path_to_use_alternate(req.files['social_post_video'][0], 'social_post_videos', timestamp)
						let video_for_post
						if (use_gcp_storage){

							video_for_post = `${ gcp_bucket }/${ video_path }`

						} else if (use_aws_s3_storage){

							// since we will be using cloud front
							video_for_post = `${ video_path }`

						} else {

							video_for_post = get_file_path_to_use_alternate(req.files['social_post_video'][0], 'social_post_videos', timestamp)
						}
					// video_path = path.join(video_upload_path, `${req.files['social_post_video'][0].filename}`)

						function after_screenshot_callback(){

							social_post_type = 'video_post'
							let file_without_format = path.basename( req.files['social_post_video'][0].originalname, path.extname( req.files['social_post_video'][0].originalname ) )

							newSocialPost = new SocialPost({
								_id: social_post_id,
								type_of_post: social_post_type,
								video_for_post: video_for_post,
								// video_for_post: video_path,
								video_thumbnail_image: get_snapshots_fullname_and_path('thumbnails_for_social_videos', file_without_format, timestamp),
								object_files_hosted_at: get_file_storage_venue(),
								// video_thumbnail_image: `${get_snapshots_storage_path()}/${file_without_format}-${timestamp}_.png`, // ${select_random_screenshot(4)}
								// video_thumbnail_image: `${get_snapshots_storage_path()}/${file_without_format}-${timestamp}_${i+1}.png`,
								// video_thumbnail_image: `${get_snapshots_storage_path()}/${file_without_format}_${select_random_screenshot(4)}.png`,
								// video_for_post: get_file_path_to_use_alternate(req.files['social_post_video'][0], 'social_post_videos'),
								// video_for_post: get_file_path_to_use_alternate(req.files['social_post_video'][0].filename, 'social_post_videos'),
								// video_for_post: `./assets/videos/uploads/social_post_videos/${req.files['social_post_video'][0].filename}`,
								// video_thumbnail_image: `${get_snapshots_storage_path()}/${req.files['social_post_video'][0].filename}-${timestamp}.png`,
							})

							return newSocialPost
						}

						if (use_gcp_storage || use_aws_s3_storage){

							store_video_at_tmp_promise = store_video_at_tmp_and_get_its_path( req.files['social_post_video'][0], video_path )
							promises.push(store_video_at_tmp_promise)

							promise_fulfilled = await Promise.all(promises)

							create_snapshots_promise = await create_snapshots_from_uploaded_video(timestamp, req.files['social_post_video'][0], promise_fulfilled[1], total_snapshots_count)
							save_snapshots_promises = save_generated_snapshots(req.files['social_post_video'][0], timestamp, total_snapshots_count)
							await Promise.all(save_snapshots_promises)

						} else {

							create_snapshots_promise = await create_snapshots_from_uploaded_video(timestamp, req.files['social_post_video'][0], video_for_post, total_snapshots_count)
							save_snapshots_promises = save_generated_snapshots(req.files['social_post_video'][0], timestamp, total_snapshots_count)
							// await Promise.all(save_snapshots_promises)

						}

						save_socialpost_promise = await save_socialpost_and_activity(req, res, err,  after_screenshot_callback(), social_post_type, social_post_id, total_snapshots_count)



					} else {

						social_post_type = 'text_post'
						newSocialPost = new SocialPost({
							_id: social_post_id,
							type_of_post: social_post_type,
							post_text: req.body.post_text,
						});

						save_socialpost_promise = await save_socialpost_and_activity(req, res, err,  newSocialPost, social_post_type, social_post_id)

					}


					// not needed, this is used only in multer
					// res.status(200).json({ success: true, msg: 'File Uploaded!',file: `uploads/${req.file.filename}`})
				// }
			}

		})()}

	})

})

router.get('/get-image', passport.authenticate('jwt', { session: false }), async function(req, res, next){


	let image_key = req.query.image_object_id
	let image_host = req.query.host

	console.log('image_key')
	console.log(image_key)

	console.log('image_host')
	console.log(image_host)

	try {

		image_in_base64_encoding = await get_image_to_display(image_key, image_host)
		res.status(200).json({
			success: true,
			image: image_in_base64_encoding
		})

	} catch (err){

		res.status(200).json({
			success: false,
		})

	}


})



router.get('/get-socialpost', passport.authenticate('jwt', { session: false }), async function(req, res, next){

	try{
		let social_post = await SocialPost.findOne({ endpoint: req.query.endpoint })

		var { type_of_post, total_likes, total_shares, total_comments, endpoint, user } = social_post

		let user_owning_socialpost = await User.findOne({_id: user})
		let user_owning_socialpost_avatar = await get_image_to_display(user_owning_socialpost.user_avatar_image, user_owning_socialpost.object_files_hosted_at)



		// incorporating notification_type
		let post_details = { type_of_post, total_likes, total_shares, total_comments, endpoint }
		post_details = await get_post_details(type_of_post, social_post, post_details)

		res.status(200).json({
			...post_details,
			friends_user_name: user_owning_socialpost.user_name_in_profile,
			friends_user_avatar_image: user_owning_socialpost_avatar, 
		})

	} catch (err){
		return err
	}
})



// USED 
// get posts from friends for wall
router.get('/get-socialposts-from-friends', passport.authenticate('jwt', { session: false }), async function(req, res, next){

	let posts_to_show_per_friend = 5

	try{

		let user_checking_others_posts = await User.findOne({ phone_number: req.user.user_object.phone_number }).populate('friends') // using req.user from passport js middleware
		let { friends, last_timestamp_of_checking_notification, object_files_hosted_at } =  user_checking_others_posts

		let activities_to_send = []



		let send_posts = true

		let list_of_promises = []

		// let all_friends = await Promise.all(friends.map(async (friend) => {
		list_of_promises.push((async () => {


			for (let i = 0; i < friends.length; i++) {

				let friend = friends[i]


			// access friend data here
				var { user_name_in_profile, user_avatar_image } = friend
				let friends_user_name = user_name_in_profile
				let friends_user_avatar_image = user_avatar_image
				let friend_endpoint = friend.endpoint

				let friends_user_avatar_image_to_use
				let friends_user_avatar_image_to_use_host
				let cloud_resp

				// OLD VERSION
				// friends_user_avatar_image_to_use = await get_image_to_display(friends_user_avatar_image, object_files_hosted_at)
				// NEW VERSION
				friends_user_avatar_image_to_use = friends_user_avatar_image
				friends_user_avatar_image_to_use_host = object_files_hosted_at

				// we have reduced activities link for each user to last 50 in user model
				let last_n_activities_of_friend = friend.activities


				if ( req.query.request_number === 1 ){
					
					// last_n_activities_of_friend = friend.activities.slice(1).slice(-posts_to_show_per_friend)
					last_n_activities_of_friend.slice(1).slice(-posts_to_show_per_friend)

				} else {

					// last_n_activities_of_friend = friend.activities.slice(1).slice( -posts_to_show_per_friend * req.query.request_number, -posts_to_show_per_friend * (req.query.request_number-1)  )
					last_n_activities_of_friend.slice(1).slice( -posts_to_show_per_friend * req.query.request_number, -posts_to_show_per_friend * (req.query.request_number-1)  )

				}


				let activities_for_first_request = last_n_activities_of_friend.slice(1).slice(-posts_to_show_per_friend)
				let activities_for_subsequent_request = last_n_activities_of_friend.slice(1).slice( -posts_to_show_per_friend * req.query.request_number, -posts_to_show_per_friend * (req.query.request_number-1)  )

				let new_activities = activities_for_subsequent_request.filter(
					function(item){
						return !activities_for_first_request.includes(item)
					}
				)


				if (req.query.request_number > 1 && new_activities.length === 0){

					console.log('SAME ACTIVITIES TO SEND, THEREFORE NOT SENDING')
					res.status(200).json([])
					send_posts = false
					break
					// return
				}



				// let all_activities = await Promise.all(friend.activities.map(async (activity) => {
				let all_activities = await Promise.all(last_n_activities_of_friend.map(async (activity) => {

					activity = await Activity.findOne({_id: activity})


					let post_details = {}
					if (friends_user_avatar_image_to_use_host === 'disk_storage') {
						friends_user_avatar_image_to_use = base64_encode(friends_user_avatar_image_to_use)
					}
					
					friends_user_avatar_image_to_use = await get_image_to_display(friends_user_avatar_image_to_use, friends_user_avatar_image_to_use_host)
					post_details = { friends_user_name, friends_user_avatar_image: friends_user_avatar_image_to_use, friend_endpoint, timestamp:activity.timestamp, friends_user_avatar_image_host: friends_user_avatar_image_to_use_host }

					if ( last_timestamp_of_checking_notification !== null && Number(activity.timestamp) < Number(last_timestamp_of_checking_notification) ){
						// console.log('INNER TRIGGERED')
						let { activity_type } = activity
						let user_owning_post
						let image_in_base64_encoding

						switch (activity_type) {

							case "created_post":

								var { post_created } = activity
								post_created = await SocialPost.findOne({_id: post_created})
								var { type_of_post, total_likes, total_shares, total_comments, endpoint } = post_created
								post_details = { ...post_details, notification_type:'created_post', activity_type, type_of_post, total_likes, total_shares, total_comments, endpoint }
								post_details = await get_post_details(type_of_post, post_created, post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)
									console.log('PUSHED')

								}

								break

							case "liked_post":

								var { post_liked } = activity
								post_liked = await SocialPost.findOne({_id: post_liked})
								var { type_of_post, total_likes, total_shares, total_comments, endpoint } = post_liked
								// incorporating notification_type
								post_details = { ...post_details, notification_type:'liked_post', activity_type, type_of_post, total_likes, total_shares, total_comments, endpoint }
								// incorporating user_owning_post user_name and user_avatar_image
								user_owning_post = await User.findOne({_id: post_liked.user})
								var { user_name, user_avatar_image, object_files_hosted_at } = user_owning_post
								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(user_avatar_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = user_avatar_image
								post_details = {...post_details, user_name, user_avatar_image: image_in_base64_encoding, user_avatar_image_host: object_files_hosted_at}
								post_details = await get_post_details(type_of_post, post_liked, post_details)
								// activities_to_send.push(post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							case "shared_post":

								var { post_share } = activity
								post_share = await SocialPost.findOne({_id: post_share})
								var { type_of_post, total_likes, total_shares, total_comments, endpoint } = post_share
								// incorporating notification_type
								post_details = { ...post_details, notification_type:'shared_post', activity_type, type_of_post, total_likes, total_shares, total_comments, endpoint }
								// incorporating user_owning_post user_name and user_avatar_image
								user_owning_post = await User.findOne({_id: post_share.user})
								var { user_name, user_avatar_image, object_files_hosted_at } = user_owning_post
								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(user_avatar_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = user_avatar_image
								post_details = {...post_details, user_name, user_avatar_image: image_in_base64_encoding, user_avatar_image_host: object_files_hosted_at}
								post_details = await get_post_details(type_of_post, post_share, post_details)
								// activities_to_send.push(post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							case "commented_on_post":

								var { post_commented } = activity
								post_commented = await Comment.findOne({_id: post_commented})
								let original_post = post_commented.socialpost
								original_post = await SocialPost.findOne({_id: original_post})
								var { comment_text } = post_commented
								var { type_of_post, total_likes, total_shares, total_comments, endpoint } = original_post
								// incorporating notification_type
								post_details = { ...post_details, notification_type:'commented_on_post', activity_type, comment_text, type_of_post, total_likes, total_shares, total_comments, endpoint }
								// incorporating user_owning_post user_name and user_avatar_image
								user_owning_post = await User.findOne({_id: post_commented.user})
								var { user_name, user_avatar_image, object_files_hosted_at } = user_owning_post
								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(user_avatar_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = user_avatar_image
								post_details = {...post_details, user_name, user_avatar_image: image_in_base64_encoding, user_avatar_image_host: object_files_hosted_at}
								post_details = await get_post_details(type_of_post, post_commented, post_details)
								// activities_to_send.push(post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							case "created_book":

								let { book_created } = activity
								book_created = await Book.findOne({_id: book_created})
								var { book_name, book_image, book_description, interested_users, endpoint, object_files_hosted_at, type_of_post } = book_created
								// incorporating notification_type
								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(book_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = book_image
								post_details = { ...post_details, notification_type:'created_book', activity_type, book_name, book_image: image_in_base64_encoding, book_description, endpoint, book_image_host: object_files_hosted_at }
								type_of_post = 'created_book'
								try {
									post_details = await get_post_details(type_of_post, book_created, post_details)
								} catch (error5){
									console.log('ERROR CAUGHT WHILE GETTING IMAGE')
									console.log(error5)
								}
								// activities_to_send.push(post_details)
								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							case "got_interested_in_book":

								let { book_liked } = activity
								book_liked = await Book.findOne({_id: book_liked})
								var { book_name, book_image, book_description, endpoint, object_files_hosted_at, type_of_post } = book_liked
								// incorporating notification_type

								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(book_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = book_image
								post_details = { ...post_details, notification_type:'got_interested_in_book', activity_type, book_name, book_image: get_image_to_display, book_description, endpoint, book_image_host: object_files_hosted_at}
								type_of_post = 'got_interested_in_book'
								try {
									post_details = await get_post_details(type_of_post, book_liked, post_details)
								} catch (error5){
									console.log('ERROR CAUGHT WHILE GETTING IMAGE')
									console.log(error5)
								}
								// activities_to_send.push(post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							case "created_page":

								let { page_created } = activity
								page_created = await Page.findOne({_id: page_created})
								var { page_name, page_image, page_description, endpoint, object_files_hosted_at, type_of_post } = page_created
								// incorporating notification_type

								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(page_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = page_image

								post_details = { ...post_details, notification_type:'created_page', activity_type, page_name, page_image: image_in_base64_encoding, page_description, endpoint, page_image_host: object_files_hosted_at }
								type_of_post = 'created_page'
								try {
									post_details = await get_post_details(type_of_post, page_created, post_details)
								} catch (error5){
									console.log('ERROR CAUGHT WHILE GETTING IMAGE')
									console.log(error5)
								}
								// activities_to_send.push(post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							case "got_interested_in_page":

								let { page_liked } = activity
								page_liked = await Page.findOne({_id: page_liked})
								var { page_name, page_image, page_description, endpoint, object_files_hosted_at, type_of_post } = page_liked
								// incorporating notification_type

								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(page_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = page_image

								post_details = { ...post_details, notification_type:'got_interested_in_page', activity_type, page_name, page_image: image_in_base64_encoding, page_description, endpoint, page_image_host: object_files_hosted_at }
								type_of_post = 'got_interested_in_page'
								try {
									post_details = await get_post_details(type_of_post, page_liked, post_details)
								} catch (error5){
									console.log('ERROR CAUGHT WHILE GETTING IMAGE')
									console.log(error5)
								}
								// activities_to_send.push(post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							case "created_sport":

								let { sport_created } = activity
								sport_created = await Sport.findOne({_id: sport_created})
								var { sport_name, sport_image, sport_description, endpoint, object_files_hosted_at, type_of_post } = sport_created
								// incorporating notification_type

								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(sport_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = sport_image

								post_details = { ...post_details, notification_type:'created_sport', activity_type, sport_name, sport_image: image_in_base64_encoding, sport_description, endpoint, sport_image_host: object_files_hosted_at }
								type_of_post = 'created_sport'
								try {
									post_details = await get_post_details(type_of_post, sport_created, post_details)
								} catch (error5){
									console.log('ERROR CAUGHT WHILE GETTING IMAGE')
									console.log(error5)
								}
								// activities_to_send.push(post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							case "got_interested_in_sport":

								let { sport_liked } = activity
								sport_liked = await Sport.findOne({_id: sport_liked})
								var { sport_name, sport_image, sport_description, endpoint, object_files_hosted_at, type_of_post } = sport_created
								// incorporating notification_type

								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(sport_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = sport_image

								post_details = { ...post_details, notification_type:'got_interested_in_sport', activity_type, sport_name, sport_image: image_in_base64_encoding, sport_description, endpoint, sport_image_host: object_files_hosted_at }
								type_of_post = 'got_interested_in_sport'
								try {
									post_details = await get_post_details(type_of_post, sport_liked, post_details)
								} catch (error5){
									console.log('ERROR CAUGHT WHILE GETTING IMAGE')
									console.log(error5)
								}
								// activities_to_send.push(post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							case "created_advertisement":

								let { ad_created } = activity
								ad_created = await Advertisement.findOne({_id: ad_created})
								var { ad_name, ad_image, ad_description, endpoint, object_files_hosted_at, type_of_post } = ad_created
								// incorporating notification_type

								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(ad_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = ad_image

								post_details = { ...post_details, notification_type:'created_advertisement', activity_type, ad_name, ad_image: image_in_base64_encoding, ad_description, endpoint, ad_image_host: object_files_hosted_at }
								type_of_post = 'created_advertisement'
								try {
									post_details = await get_post_details(type_of_post, ad_created, post_details)
								} catch (error5){
									console.log('ERROR CAUGHT WHILE GETTING IMAGE')
									console.log(error5)
								}
								// activities_to_send.push(post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							case "got_interested_in_advertisement":


								let { ad_liked } = activity
								ad_liked = await Advertisement.findOne({_id: ad_liked})
								var { ad_name, ad_image, ad_description, endpoint, object_files_hosted_at, type_of_post } = ad_liked
								// incorporating notification_type

								// OLD VERSION
								// image_in_base64_encoding = await get_image_to_display(ad_image, object_files_hosted_at)
								// NEW VERSION
								image_in_base64_encoding = ad_image

								post_details = { ...post_details, notification_type:'got_interested_in_advertisement', activity_type, ad_name, ad_image: image_in_base64_encoding, ad_description, endpoint, ad_image_host: object_files_hosted_at }
								type_of_post = 'got_interested_in_advertisement'
								try {
									post_details = await get_post_details(type_of_post, ad_liked, post_details)
								} catch (error5){
									console.log('ERROR CAUGHT WHILE GETTING IMAGE')
									console.log(error5)
								}
								// activities_to_send.push(post_details)

								if ( !activities_to_send.includes(post_details) ){

									activities_to_send.push(post_details)

								}

								break

							default:
								null
						}
					}
				}))

		// })) of .map
			}
		})())


	// sort activities with time as latest
		activities_to_send = activities_to_send.sort(function sortActivitiesByTimestamp(a, b) {
			a = Number(a.timestamp)
			b = Number(b.timestamp)
			return b - a
		});

		Promise.all(list_of_promises)
		.then(async () => {

			// friends_user_name

			if(send_posts){
				user_checking_others_posts.last_timestamp_of_checking_notification = String( Date.now() )

				res.status(200).json(activities_to_send)
				// activities_to_send.map((act) => {
				// 	res.write(act)
				// })
				// res.end();

				await user_checking_others_posts.save()
			}

		})

	} catch (err) {

		console.log(err)

	}
})



router.get('/get-socialposts-of-someone', passport.authenticate('jwt', { session: false }), async function(req, res, next){

	let posts_to_show_per_request = 5
	let user_owning_socialposts
	let friends_of_user
	let user_checking_others_posts


	if (req.query.user_id){

		user_checking_others_posts = await User.findOne({ phone_number: req.user.user_object.phone_number }).populate('friends') // using req.user from passport js middleware
		friends_of_user = user_checking_others_posts.friends
		user_owning_socialposts = friends_of_user.filter(
			function(item){
				return item.endpoint === req.query.user_id
			}
		)

		user_owning_socialposts = user_owning_socialposts[0]

		if (user_owning_socialposts === null){
			res.status(200).json([])
			return
		}

	} else {

		user_owning_socialposts = await User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware 

	}


	try{

		let activities_to_send = []

		// access friend data here
		var { user_name_in_profile, user_avatar_image, object_files_hosted_at } = user_owning_socialposts
		let friends_user_name = user_name_in_profile
		let friends_user_avatar_image = user_avatar_image
		let friend_endpoint = user_owning_socialposts.endpoint

		let friends_user_avatar_image_to_use
		let friends_user_avatar_image_to_use_host
		let cloud_resp

		// OLD VERSION
		// friends_user_avatar_image_to_use = await get_image_to_display(friends_user_avatar_image, object_files_hosted_at)
		// NEW VERSION
		friends_user_avatar_image_to_use = friends_user_avatar_image
		friends_user_avatar_image_to_use_host = object_files_hosted_at

		// we have reduced activities link for each user to last 50 in user model
		let last_n_activities_of_friend = user_owning_socialposts.activities

		// console.log('last_n_activities_of_friend')
		// console.log(last_n_activities_of_friend)

		if ( req.query.request_number === 1 ){
			
			last_n_activities_of_friend.slice(1).slice(-posts_to_show_per_request)

		} else {

			last_n_activities_of_friend.slice(1).slice( -posts_to_show_per_request * req.query.request_number, -posts_to_show_per_request * (req.query.request_number-1)  )

		}

		let activities_for_first_request = last_n_activities_of_friend.slice(1).slice(-posts_to_show_per_request)
		let activities_for_subsequent_request = last_n_activities_of_friend.slice(1).slice( -posts_to_show_per_request * req.query.request_number, -posts_to_show_per_request * (req.query.request_number-1)  )

		let new_activities = activities_for_subsequent_request.filter(
			function(item){
				return !activities_for_first_request.includes(item)
			}
		)

		if (req.query.request_number > 1 && new_activities.length === 0){

			res.status(200).json([])
			return
		}

		let all_activities = await Promise.all(last_n_activities_of_friend.map(async (activity) => {

			activity = await Activity.findOne({_id: activity})

			let post_details = {}
			post_details = { friends_user_name, friends_user_avatar_image: friends_user_avatar_image_to_use, friends_user_avatar_image_host: friends_user_avatar_image_to_use_host,friend_endpoint, timestamp:activity.timestamp }

			let { activity_type } = activity
			let user_owning_post
			let image_in_base64_encoding

			switch (activity_type) {
				case "created_post":

					var { post_created } = activity
					post_created = await SocialPost.findOne({_id: post_created})
					var { type_of_post, total_likes, total_shares, total_comments, endpoint } = post_created
					// incorporating notification_type
					post_details = { ...post_details, notification_type:'created_post', activity_type, type_of_post, total_likes, total_shares, total_comments, endpoint }

					post_details = await get_post_details(type_of_post, post_created, post_details)
					activities_to_send.push(post_details)
					break

				case "liked_post":

					var { post_liked } = activity
					post_liked = await SocialPost.findOne({_id: post_liked})
					var { type_of_post, total_likes, total_shares, total_comments, endpoint } = post_liked
					// incorporating notification_type
					post_details = { ...post_details, notification_type:'liked_post', activity_type, type_of_post, total_likes, total_shares, total_comments, endpoint }
					// incorporating user_owning_post user_name and user_avatar_image
					user_owning_post = await User.findOne({_id: post_liked.user})
					var { user_name, user_avatar_image, object_files_hosted_at } = user_owning_post
					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(user_avatar_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = user_avatar_image

					post_details = {...post_details, user_name, user_avatar_image: image_in_base64_encoding, user_avatar_image_host:object_files_hosted_at}
					post_details = await get_post_details(type_of_post, post_liked, post_details)
					activities_to_send.push(post_details)
					break

				case "shared_post":

					var { post_share } = activity
					post_share = await SocialPost.findOne({_id: post_share})
					var { type_of_post, total_likes, total_shares, total_comments, endpoint } = post_share
					// incorporating notification_type
					post_details = { ...post_details, notification_type:'shared_post', activity_type, type_of_post, total_likes, total_shares, total_comments, endpoint }
					// incorporating user_owning_post user_name and user_avatar_image
					user_owning_post = await User.findOne({_id: post_share.user})
					var { user_name, user_avatar_image, object_files_hosted_at } = user_owning_post
					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(user_avatar_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = user_avatar_image

					post_details = {...post_details, user_name, user_avatar_image: image_in_base64_encoding, user_avatar_image_host: object_files_hosted_at}
					post_details = await get_post_details(type_of_post, post_share, post_details)
					activities_to_send.push(post_details)
					break

				case "commented_on_post":

					var { post_commented } = activity
					post_commented = await Comment.findOne({_id: post_commented})
					let original_post = post_commented.socialpost
					original_post = await SocialPost.findOne({_id: original_post})
					var { comment_text } = post_commented
					var { type_of_post, total_likes, total_shares, total_comments, endpoint } = original_post
					// incorporating notification_type
					post_details = { ...post_details, notification_type:'commented_on_post', activity_type, comment_text, type_of_post, total_likes, total_shares, total_comments, endpoint }
					// incorporating user_owning_post user_name and user_avatar_image
					user_owning_post = await User.findOne({_id: post_commented.user})
					var { user_name, user_avatar_image, object_files_hosted_at } = user_owning_post
					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(user_avatar_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = user_avatar_image

					post_details = {...post_details, user_name, user_avatar_image: image_in_base64_encoding, user_avatar_image_host: object_files_hosted_at}
					post_details = await get_post_details(type_of_post, post_commented, post_details)
					activities_to_send.push(post_details)
					break

				case "created_book":

					let { book_created } = activity
					book_created = await Book.findOne({_id: book_created})
					var { book_name, book_image, book_description, interested_users, endpoint, object_files_hosted_at } = book_created
					// incorporating notification_type
					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(book_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = book_image

					post_details = { ...post_details, notification_type:'created_book', activity_type, book_name, book_image: image_in_base64_encoding, book_description, endpoint, book_image_host: object_files_hosted_at }
					activities_to_send.push(post_details)
					break

				case "got_interested_in_book":

					let { book_liked } = activity
					book_liked = await Book.findOne({_id: book_liked})
					var { book_name, book_image, book_description, endpoint, object_files_hosted_at } = book_liked
					// incorporating notification_type
					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(book_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = book_image

					post_details = { ...post_details, notification_type:'got_interested_in_book', activity_type, book_name, book_image: get_image_to_display, book_description, endpoint, book_image_host:object_files_hosted_at }
					activities_to_send.push(post_details)
					break

				case "created_page":

					let { page_created } = activity
					page_created = await Page.findOne({_id: page_created})
					var { page_name, page_image, page_description, endpoint, object_files_hosted_at } = page_created
					// incorporating notification_type
					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(page_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = page_image

					post_details = { ...post_details, notification_type:'created_page', activity_type, page_name, page_image: image_in_base64_encoding, page_description, endpoint, page_image_host:object_files_hosted_at }
					activities_to_send.push(post_details)
					break

				case "got_interested_in_page":

					let { page_liked } = activity
					page_liked = await Page.findOne({_id: page_liked})
					var { page_name, page_image, page_description, endpoint, object_files_hosted_at } = page_liked
					// incorporating notification_type

					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(page_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = page_image

					post_details = { ...post_details, notification_type:'got_interested_in_page', activity_type, page_name, page_image: image_in_base64_encoding, page_description, endpoint, page_image_host: object_files_hosted_at }
					activities_to_send.push(post_details)
					break

				case "created_sport":

					let { sport_created } = activity
					sport_created = await Sport.findOne({_id: sport_created})
					var { sport_name, sport_image, sport_description, endpoint, object_files_hosted_at } = sport_created
					// incorporating notification_type

					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(sport_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = sport_image

					post_details = { ...post_details, notification_type:'created_sport', activity_type, sport_name, sport_image: image_in_base64_encoding, sport_description, endpoint, sport_image_host:object_files_hosted_at }
					activities_to_send.push(post_details)
					break

				case "got_interested_in_sport":

					let { sport_liked } = activity
					sport_liked = await Sport.findOne({_id: sport_liked})
					var { sport_name, sport_image, sport_description, endpoint, object_files_hosted_at } = sport_created
					// incorporating notification_type
					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(sport_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = sport_image

					post_details = { ...post_details, notification_type:'got_interested_in_sport', activity_type, sport_name, sport_image: image_in_base64_encoding, sport_description, endpoint, sport_image_host: object_files_hosted_at }
					activities_to_send.push(post_details)
					break

				case "created_advertisement":

					let { ad_created } = activity
					ad_created = await Advertisement.findOne({_id: ad_created})
					var { ad_name, ad_image, ad_description, endpoint, object_files_hosted_at } = ad_created
					// incorporating notification_type

					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(ad_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = ad_image

					post_details = { ...post_details, notification_type:'created_advertisement', activity_type, ad_name, ad_image: image_in_base64_encoding, ad_description, endpoint, ad_image_host:object_files_hosted_at }
					activities_to_send.push(post_details)
					break

				case "got_interested_in_advertisement":

					let { ad_liked } = activity
					ad_liked = await Advertisement.findOne({_id: ad_liked})
					var { ad_name, ad_image, ad_description, endpoint, object_files_hosted_at } = ad_liked
					// incorporating notification_type

					// OLD VERSION
					// image_in_base64_encoding = await get_image_to_display(ad_image, object_files_hosted_at)
					// NEW VERSION
					image_in_base64_encoding = ad_image

					post_details = { ...post_details, notification_type:'got_interested_in_advertisement', activity_type, ad_name, ad_image: image_in_base64_encoding, ad_description, endpoint, ad_image_host: object_files_hosted_at }
					activities_to_send.push(post_details)
					break

				default:
					null

			}

		}))


	// sort activities with time as latest
		activities_to_send = activities_to_send.sort(function sortActivitiesByTimestamp(a, b) {
			a = Number(a.timestamp)
			b = Number(b.timestamp)
			return b - a
		});


		res.status(200).json(activities_to_send)



	} catch (err) {

		console.log(err)

	}
})





// USED 
// get posts from friends for wall
router.get('/get-notifications-from-friends', passport.authenticate('jwt', { session: false }), async function(req, res, next){


	let posts_to_show_per_friend = 5

	try{

		let user_checking_others_posts = await User.findOne({ phone_number: req.user.user_object.phone_number }).populate('friends') // using req.user from passport js middleware
		let { friends, last_timestamp_of_checking_notification } =  user_checking_others_posts

		let activities_to_send = []


		let send_posts = true

		let list_of_promises = []

		// let all_friends = await Promise.all(friends.map(async (friend) => {
		list_of_promises.push((async () => {
			for (let i = 0; i < friends.length; i++) {
				let friend = friends[i]


			// var friend = await User.findOne({_id: friend_id})

			// access friend data here
			var { user_name, user_avatar_image, object_files_hosted_at } = friend
			let friends_user_name = user_name
			let friends_user_avatar_image = user_avatar_image
			let friend_endpoint = friend.endpoint

			let friends_user_avatar_image_to_use
			let friends_user_avatar_image_to_use_host
			let cloud_resp

			// OLD VERSION
			// friends_user_avatar_image_to_use = await get_image_to_display(friends_user_avatar_image, object_files_hosted_at)
			// NEW VERSION
			friends_user_avatar_image_to_use = friends_user_avatar_image
			friends_user_avatar_image_to_use_host = object_files_hosted_at

	// DRYed OUT
			// if (object_files_hosted_at === 'gcp_storage'){

			// 	cloud_resp = await get_file_from_gcp(friends_user_avatar_image)
			// 	friends_user_avatar_image_to_use = cloud_resp.toString('base64')

			// } else if (object_files_hosted_at === 'aws_s3'){

			// 	cloud_resp = await get_file_from_aws(friends_user_avatar_image)
			// 	friends_user_avatar_image_to_use = cloud_resp.toString('base64')

			// } else {

			// 	friends_user_avatar_image_to_use = base64_encode( friends_user_avatar_image )

			// }


			// we have reduced activities link for each user to last 50 in user model
			let last_n_activities_of_friend = friend.activities


			if ( req.query.request_number === 1 ){
				
				// last_n_activities_of_friend = friend.activities.slice(1).slice(-posts_to_show_per_friend)
				last_n_activities_of_friend.slice(1).slice(-posts_to_show_per_friend)

			} else {

				// last_n_activities_of_friend = friend.activities.slice(1).slice( -posts_to_show_per_friend * req.query.request_number, -posts_to_show_per_friend * (req.query.request_number-1)  )
				last_n_activities_of_friend.slice(1).slice( -posts_to_show_per_friend * req.query.request_number, -posts_to_show_per_friend * (req.query.request_number-1)  )

			}


			let activities_for_first_request = last_n_activities_of_friend.slice(1).slice(-posts_to_show_per_friend)
			let activities_for_subsequent_request = last_n_activities_of_friend.slice(1).slice( -posts_to_show_per_friend * req.query.request_number, -posts_to_show_per_friend * (req.query.request_number-1)  )

			let new_activities = activities_for_subsequent_request.filter(
				function(item){
					return !activities_for_first_request.includes(item)
				}
			)


			if (req.query.request_number > 1 && new_activities.length === 0){

				console.log('SAME ACTIVITIES TO SEND, THEREFORE NOT SENDING')
				res.status(200).json([])
				send_posts = false
				break
			}



			// let all_activities = await Promise.all(friend.activities.map(async (activity) => {
			let all_activities = await Promise.all(last_n_activities_of_friend.map(async (activity) => {

				activity = await Activity.findOne({_id: activity})


				let post_details = {}
				post_details = { friends_user_name, friends_user_avatar_image: friends_user_avatar_image_to_use, friends_user_avatar_image_host: friends_user_avatar_image_to_use_host, friend_endpoint, timestamp:activity.timestamp }

				if ( last_timestamp_of_checking_notification !== null && Number(activity.timestamp) < Number(last_timestamp_of_checking_notification) ){
					let { activity_type } = activity
					let user_owning_post

					switch (activity_type) {

						case "created_post":

							var { post_created } = activity
							post_created = await SocialPost.findOne({_id: post_created})
							var { type_of_post, endpoint } = post_created
							post_details = { ...post_details, notification_type:'created_post', activity_type, type_of_post, endpoint }
							activities_to_send.push(post_details)
							break

						case "liked_post":

							var { post_liked } = activity
							post_liked = await SocialPost.findOne({_id: post_liked})
							var { type_of_post, endpoint } = post_liked
							post_details = { ...post_details, notification_type:'liked_post', activity_type, type_of_post, endpoint }
							activities_to_send.push(post_details)
							break

						case "shared_post":

							var { post_share } = activity
							post_share = await SocialPost.findOne({_id: post_share})
							var { type_of_post, endpoint } = post_share
							post_details = { ...post_details, notification_type:'shared_post', activity_type, type_of_post, endpoint }
							activities_to_send.push(post_details)
							break

						case "commented_on_post":

							var { post_commented } = activity
							let original_post = post_commented.socialpost
							original_post = await SocialPost.findOne({_id: original_post})
							var { type_of_post, endpoint } = original_post
							post_details = { ...post_details, notification_type:'commented_on_post', activity_type, comment_text, type_of_post, endpoint }
							activities_to_send.push(post_details)
							break

						case "created_book":

							let { book_created } = activity
							book_created = await Book.findOne({_id: book_created})
							var { endpoint } = book_created
							post_details = { ...post_details, notification_type:'created_book', activity_type, endpoint }
							activities_to_send.push(post_details)
							break

						case "got_interested_in_book":

							let { book_liked } = activity
							book_liked = await Book.findOne({_id: book_liked})
							var { endpoint } = book_liked
							post_details = { ...post_details, notification_type:'got_interested_in_book', activity_type, endpoint }
							activities_to_send.push(post_details)
							break

						case "created_page":

							let { page_created } = activity
							page_created = await Page.findOne({_id: page_created})
							var { endpoint } = page_created
							post_details = { ...post_details, notification_type:'created_page', activity_type, endpoint }
							activities_to_send.push(post_details)
							break

						case "got_interested_in_page":

							let { page_liked } = activity
							page_liked = await Page.findOne({_id: page_liked})
							var { endpoint } = page_liked
							post_details = { ...post_details, notification_type:'got_interested_in_page', activity_type, endpoint }
							activities_to_send.push(post_details)
							break

						case "created_sport":

							let { sport_created } = activity
							sport_created = await Sport.findOne({_id: sport_created})
							var { endpoint } = sport_created
							post_details = { ...post_details, notification_type:'created_sport', activity_type, endpoint }
							activities_to_send.push(post_details)
							break

						case "got_interested_in_sport":

							let { sport_liked } = activity
							sport_liked = await Sport.findOne({_id: sport_liked})
							var { endpoint } = sport_created
							post_details = { ...post_details, notification_type:'got_interested_in_sport', activity_type, endpoint }
							activities_to_send.push(post_details)
							break

						case "created_advertisement":

							let { ad_created } = activity
							ad_created = await Advertisement.findOne({_id: ad_created})
							var { endpoint } = ad_created
							post_details = { ...post_details, notification_type:'created_advertisement', activity_type, endpoint }
							activities_to_send.push(post_details)
							break

						case "got_interested_in_advertisement":

							let { ad_liked } = activity
							ad_liked = await Advertisement.findOne({_id: ad_liked})
							var { endpoint } = ad_liked
							post_details = { ...post_details, notification_type:'got_interested_in_advertisement', activity_type, endpoint }
							activities_to_send.push(post_details)
							break

						default:
							null
					}
				}
			}))

		// })) of .map
			}
		})())


	// sort activities with time as latest
		activities_to_send = activities_to_send.sort(function sortActivitiesByTimestamp(a, b) {
			a = Number(a.timestamp)
			b = Number(b.timestamp)
			return b - a
		});

		Promise.all(list_of_promises)
		.then(async () => {

			if(send_posts){
				user_checking_others_posts.last_timestamp_of_checking_notification = String( Date.now() )

				res.status(200).json(activities_to_send)

				// activities_to_send.map((act) => {
				// 	res.write([act])
				// })
				// res.end();

				await user_checking_others_posts.save()
			}

		})

	} catch (err) {

		console.log(err)

	}
})






// get socialposts_list_with_children
// USED
router.get('/socialposts-list-with-children', async function(req, res, next){
	console.log('triggered')

	SocialPost.
	find().
	limit(10).
	populate('comments').
	populate('likes').
	populate('shares').
	populate('user').
	then(async (socialposts) => {

		var newSocialPosts_list = []

		socialposts.map(async (socialpost, index)=>{

			var newSocialPost = {}

			newSocialPost.type_of_post = socialpost[ 'type_of_post' ]
			// newSocialPost.post_text = socialpost[ 'post_text' ]
			// newSocialPost.image_for_post = base64_encode( socialpost[ 'image_for_post' ] )
			// newSocialPost.video_thumbnail_image = base64_encode( socialpost[ 'video_thumbnail_image' ] )
			( socialpost[ 'post_text' ] !== null ) ? newSocialPost.post_text = socialpost[ 'post_text' ] : null
			( socialpost[ 'image_for_post' ] !== null ) ? newSocialPost.image_for_post = await get_image_to_display(socialpost.image_for_post, socialpost.object_files_hosted_at) : null
			// ( socialpost[ 'image_for_post' ] !== null ) ? newSocialPost.image_for_post = base64_encode( socialpost[ 'image_for_post' ] ) : null
			( socialpost[ 'video_for_post' ] !== null ) ? newSocialPost.video_for_post = socialpost[ 'video_for_post' ] : null
			( socialpost[ 'video_thumbnail_image' ] !== null ) ? newSocialPost.video_thumbnail_image = await get_image_to_display(socialpost.video_thumbnail_image, socialpost.object_files_hosted_at) : null
			// ( socialpost[ 'video_thumbnail_image' ] !== null ) ? newSocialPost.video_thumbnail_image = base64_encode( socialpost[ 'video_thumbnail_image' ] ) : null

			newSocialPost.total_likes = socialpost[ 'total_likes' ]
			newSocialPost.total_shares = socialpost[ 'total_shares' ]
			newSocialPost.endpoint = socialpost[ 'endpoint' ]
			newSocialPost.timestamp = socialpost[ 'timestamp' ]

			newSocialPosts_list.push({...newSocialPost})
			newSocialPost = {}
		});

		return newSocialPosts_list
	})
	.then((newSocialPosts_list) => {

		if (!newSocialPosts_list) {

			res.status(401).json({ success: false, msg: "could not find SocialPosts_list" });

		} else {

			res.status(200).json(newSocialPosts_list);

		}

	})
	.catch((err) => {

		next(err);

	});

});


// USED FOR CREATING COMMENT
router.post('/create-comment-for-socialpost', passport.authenticate('jwt', { session: false }), isAllowedInteractingWithOthersPosts, async function(req, res, next){

	var comment_text = req.body.comment_text	
	var socialpost_endpoint = req.body.socialpost_endpoint

	var newComment = new Comment({
		_id: new mongoose.Types.ObjectId(),
		comment_text:comment_text,
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then(async (user) => {
					
		newComment.user = user
		user.socialpost_comments.push(newComment)


	// finding BlogPost object
		SocialPost.findOne({endpoint: socialpost_endpoint})
		.then(async (socialpost) => {

			let user_owning_socialpost = await User.findOne({_id: socialpost.user})
			let user_owning_socialpost_avatar = await get_image_to_display(user_owning_socialpost.user_avatar_image, user_owning_socialpost.object_files_hosted_at)

			socialpost.comments.push( newComment )

			newComment.socialpost = socialpost
			
			newComment.save(function (err, newComment) {
				if (err) return console.log(err);
			})

			let base64_encoded_image
			socialpost.save(async (err, socialpost) => {

				if (socialpost.type_of_post === 'text_post'){

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						post_text: socialpost.post_text,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,
					}) 

				} else if (socialpost.type_of_post === 'image_post') {

					base64_encoded_image = await get_image_to_display(socialpost.image_for_post, socialpost.object_files_hosted_at)
					
					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						image_for_post: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,
					}) 

				} else if (socialpost.type_of_post === 'video_post') {

					base64_encoded_image = await get_image_to_display(socialpost.video_thumbnail_image, socialpost.object_files_hosted_at)

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						video_for_post: socialpost.video_for_post,
						video_thumbnail_image: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,
					}) 

				} else if (socialpost.type_of_post === 'text_with_image_post') {

					base64_encoded_image = await get_image_to_display(socialpost.image_for_post, socialpost.object_files_hosted_at)

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						post_text: socialpost.post_text,
						image_for_post: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,
					}) 

				} else if (socialpost.type_of_post === 'text_with_video_post') {

					base64_encoded_image = await get_image_to_display(socialpost.video_thumbnail_image, socialpost.object_files_hosted_at)

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						post_text: socialpost.post_text,
						video_for_post: socialpost.video_for_post,
						video_thumbnail_image: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,
					}) 

				} else {

					res.status(200).json({
						post_type: 'unknown'
					}) 
				}

			})


			let newActivity = new Activity({
				_id: new mongoose.Types.ObjectId(),
				user: user,
				activity_type: 'commented_on_post',
				post_commented: socialpost,
				comment_link: newComment,
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


// will be used for creating like
// USED
router.post('/create-like-for-socialpost', passport.authenticate('jwt', { session: false }), isAllowedInteractingWithOthersPosts, async function(req, res, next){

	var socialpost_endpoint = req.body.socialpost_endpoint


	var newLike = new Like({
		_id: new mongoose.Types.ObjectId(),
	})


	let post = await SocialPost.findOne({endpoint: socialpost_endpoint})
	console.log(post)

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then(async (user) => {

		let user_owning_socialpost = await User.findOne({_id: post.user})
		let user_owning_socialpost_avatar = await get_image_to_display(user_owning_socialpost.user_avatar_image, user_owning_socialpost.object_files_hosted_at)

					
		newLike.user = user
		user.socialpost_likes.push(newLike)



	// finding BlogPost object
		SocialPost.findOne({endpoint: socialpost_endpoint})
		.then(async (socialpost) => {

			socialpost.likes.push( newLike )

			newLike.socialpost = socialpost

			newLike.save(function (err, newLike) {
				if (err) return console.log(err);
			})

			let base64_encoded_image				
			socialpost.save(async (err, socialpost) => {

				if (socialpost.type_of_post === 'text_post'){

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						post_text: socialpost.post_text,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,
					}) 

				} else if (socialpost.type_of_post === 'image_post') {

					base64_encoded_image = await get_image_to_display(socialpost.image_for_post, socialpost.object_files_hosted_at)

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						image_for_post: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,
					}) 

				} else if (socialpost.type_of_post === 'video_post') {

					base64_encoded_image = await get_image_to_display(socialpost.video_thumbnail_image, socialpost.object_files_hosted_at)

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						video_for_post: socialpost.video_for_post,
						video_thumbnail_image: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,

					}) 

				} else if (socialpost.type_of_post === 'text_with_image_post') {

					base64_encoded_image = await get_image_to_display(socialpost.image_for_post, socialpost.object_files_hosted_at)

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						post_text: socialpost.post_text,
						image_for_post: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,

					}) 

				} else if (socialpost.type_of_post === 'text_with_video_post') {

					base64_encoded_image = await get_image_to_display(socialpost.video_thumbnail_image, socialpost.object_files_hosted_at)
					
					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						post_text: socialpost.post_text,
						video_for_post: socialpost.video_for_post,
						video_thumbnail_image: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,

					}) 

				} else {

					res.status(200).json({
						post_type: 'unknown'
					}) 
				}

			})

			let newActivity = new Activity({
				_id: new mongoose.Types.ObjectId(),
				user: user,
				activity_type: 'liked_post',
				post_liked: socialpost,
				like_link: newLike,
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



// will be used for creating share
// USED
router.post('/create-share-for-socialpost', passport.authenticate('jwt', { session: false }), isAllowedInteractingWithOthersPosts, async function(req, res, next){

	var socialpost_endpoint = req.body.socialpost_endpoint

	var newShare = new Share({
		_id: new mongoose.Types.ObjectId(),
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then(async (user) => {
					
		newShare.user = user
		user.socialpost_shares.push(newShare)

	// finding BlogPost object
		SocialPost.findOne({endpoint: socialpost_endpoint})
		.then(async (socialpost) => {

			console.log('socialpost.user')
			console.log(socialpost.user)

			let user_owning_socialpost = await User.findOne({_id: socialpost.user})
			let user_owning_socialpost_avatar = await get_image_to_display(user_owning_socialpost.user_avatar_image, user_owning_socialpost.object_files_hosted_at)

			socialpost.shares.push( newShare )

			newShare.socialpost = socialpost

			newShare.save(function (err, newShare) {
				if (err) return console.log(err);
			})

			let base64_encoded_image

			socialpost.save(async (err, socialpost) => {

				if (socialpost.type_of_post === 'text_post'){

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						post_text: socialpost.post_text,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,

					}) 

				} else if (socialpost.type_of_post === 'image_post') {

					base64_encoded_image = await get_image_to_display(socialpost.image_for_post, socialpost.object_files_hosted_at)
					
					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						image_for_post: base64_encode( socialpost.image_for_post ),
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,

					}) 

				} else if (socialpost.type_of_post === 'video_post') {

					base64_encoded_image = await get_image_to_display(socialpost.video_thumbnail_image, socialpost.object_files_hosted_at)

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						video_for_post: socialpost.video_for_post,
						video_thumbnail_image: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,

					}) 

				} else if (socialpost.type_of_post === 'text_with_image_post') {

					base64_encoded_image = await get_image_to_display(socialpost.image_for_post, socialpost.object_files_hosted_at)

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						post_text: socialpost.post_text,
						image_for_post: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,

					}) 

				} else if (socialpost.type_of_post === 'text_with_video_post') {

					base64_encoded_image = await get_image_to_display(socialpost.video_thumbnail_image, socialpost.object_files_hosted_at)

					res.status(200).json({
						type_of_post: socialpost.type_of_post,
						post_text: socialpost.post_text,
						video_for_post: socialpost.video_for_post,
						video_thumbnail_image: base64_encoded_image,
						total_comments: socialpost.total_comments,
						total_likes: socialpost.total_likes,
						total_shares: socialpost.total_shares,
						friends_user_name: user_owning_socialpost.user_name_in_profile,
						friends_user_avatar_image: user_owning_socialpost_avatar,

					}) 

				} else {

					res.status(200).json({
						post_type: 'unknown'
					}) 
				}

			})


			let newActivity = new Activity({
				_id: new mongoose.Types.ObjectId(),
				user: user,
				activity_type: 'shared_post',
				post_share: socialpost,
				share_link: newShare,
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


// get n childs of blogpost
// USED 
router.get('/get-all-comments-of-socialpost', async function(req, res, next){

	var socialpost_with_comments = await SocialPost.findOne({endpoint:req.query.endpoint}).populate('comments')

	let base64_encoded_image

	var final_result = await Promise.all(socialpost_with_comments.comments.map(async (comment_object) => {
	// find user from each like
		let user_object = await User.findOne({_id:comment_object.user})

		base64_encoded_image = await get_image_to_display(user_object.user_avatar_image, user_object.object_files_hosted_at)

		return {
			user_name:user_object.user_name_in_profile,
			user_avatar_image:base64_encoded_image,
			comment_text:comment_object.comment_text
		}
	}))

	res.status(200).json( final_result );
})


// USED
router.get('/get-all-likes-of-socialpost',async function(req, res, next){

	var socialpost_with_likes = await SocialPost.findOne({endpoint:req.query.endpoint}).populate('likes')

	let users_list_who_liked = await Promise.all(socialpost_with_likes.likes.map(async (like_object) => {
	// find user from each like
		let user_object = await User.findOne({_id:like_object.user})
		return user_object
	}))

	let base64_encoded_image
	let final_result = []
	let final_liked_payload = await Promise.all(users_list_who_liked.map(async (user_object) => {
		
		base64_encoded_image = await get_image_to_display(user_object.user_avatar_image, user_object.object_files_hosted_at)
		

		final_result.push({
			user_name:user_object.user_name_in_profile,
			user_avatar_image:base64_encoded_image,
		})

	}))

	res.status(200).json( final_result );

})


router.get('/get-all-shares-of-socialpost',async function(req, res, next){

	var socialpost_with_shares = await SocialPost.findOne({endpoint:req.query.endpoint}).populate('shares')

	let users_list_who_shared = await Promise.all(socialpost_with_shares.shares.map(async (share_object) => {
	// find user from each like
		let user_object = await User.findOne({_id:share_object.user})
		return user_object
	}))

	let base64_encoded_image
	let final_result = []
	let final_shared_payload = await Promise.all(users_list_who_shared.map(async (user_object) => {

		base64_encoded_image = await get_image_to_display(user_object.user_avatar_image, user_object.object_files_hosted_at)

		final_result.push({
			user_name:user_object.user_name_in_profile,
			user_avatar_image:base64_encoded_image,
		})

	}))


	res.status(200).json( final_result );
})




















// create a new socialpost with children

router.post('/create-socialpost-with-children', function(req, res, next){
	const newSocialPost = new SocialPost({

		_id: new mongoose.Types.ObjectId(),
		type_of_post: req.body.parent.type_of_post,
		post_text: req.body.parent.post_text,
		image_for_post: req.body.parent.image_for_post,
		video_for_post: req.body.parent.video_for_post,
		video_thumbnail_image: req.body.parent.video_thumbnail_image,
		total_likes: req.body.parent.total_likes,
		total_shares: req.body.parent.total_shares,
		endpoint: req.body.parent.endpoint,
		date_of_publishing: req.body.parent.date_of_publishing,

	});

	newSocialPost.save(function (err, newSocialPost) {
		if (err) return console.log(err);

		const newComment = new Comment({

			_id: new mongoose.Types.ObjectId(),
			comment_text: req.body.children.comment_text,
			date_of_publishing: req.body.children.date_of_publishing,

		//assigning parent
			socialpost:newSocialPost._id,
			user:newSocialPost._id,

		});

		newSocialPost.comments.push(newComment._id)
		const newLike = new Like({

			_id: new mongoose.Types.ObjectId(),

		//assigning parent
			socialpost:newSocialPost._id,
			user:newSocialPost._id,

		});

		newSocialPost.likes.push(newLike._id)
		const newShare = new Share({

			_id: new mongoose.Types.ObjectId(),

		//assigning parent
			socialpost:newSocialPost._id,
			user:newSocialPost._id,

		});

		newSocialPost.shares.push(newShare._id)
		const newUser = new User({

			_id: new mongoose.Types.ObjectId(),
			phone_number: req.body.children.phone_number,
			user_name: req.body.children.user_name,
			user_name_in_profile: req.body.children.user_name_in_profile,
			user_avatar_image: req.body.children.user_avatar_image,
			user_cover_image: req.body.children.user_cover_image,
			user_brief_intro: req.body.children.user_brief_intro,
			user_about_me: req.body.children.user_about_me,
			user_working_zone: req.body.children.user_working_zone,
			user_education: req.body.children.user_education,
			user_contact_details: req.body.children.user_contact_details,

		//assigning parent
			socialposts:newSocialPost._id,
			comments:newSocialPost._id,
			likes:newSocialPost._id,
			shares:newSocialPost._id,

		});

		newSocialPost.users.push(newUser._id)

	newSocialPost.save();

	});

});

// find socialpost
	
router.get('/find-socialpost', function(req, res, next){

	SocialPost.findOne({ endpoint: req.body.endpoint })
	.then((socialpost) => {

		socialpost[ image_for_post ] = base64_encode( socialpost[ 'image_for_post' ] )
		socialpost[ video_thumbnail_image ] = base64_encode( socialpost[ 'video_thumbnail_image' ] )

		if (!socialpost) {

			res.status(401).json({ success: false, msg: "could not find socialpost" });

		} else {

			res.status(200).json(socialpost);

		}

	})
	.catch((err) => {

		next(err);

	});

});

// find comment
	
router.get('/find-comment', function(req, res, next){

	Comment.findOne({ comment_order: req.body.comment_order })
	.then((comment) => {
		if (!comment) {

			res.status(401).json({ success: false, msg: "could not find comment" });

		} else {

			res.status(200).json(comment);

		}

	})
	.catch((err) => {

		next(err);

	});

});

// find like
	
router.get('/find-like', function(req, res, next){

	Like.findOne({ comment_order: req.body.comment_order })
	.then((like) => {
		if (!like) {

			res.status(401).json({ success: false, msg: "could not find like" });

		} else {

			res.status(200).json(like);

		}

	})
	.catch((err) => {

		next(err);

	});

});

// find share
	
router.get('/find-share', function(req, res, next){

	Share.findOne({ comment_order: req.body.comment_order })
	.then((share) => {
		if (!share) {

			res.status(401).json({ success: false, msg: "could not find share" });

		} else {

			res.status(200).json(share);

		}

	})
	.catch((err) => {

		next(err);

	});

});

// find user
	
router.get('/find-user', function(req, res, next){

	User.findOne({ phone_number: req.body.phone_number })
	.then((user) => {

		user[ user_avatar_image ] = base64_encode( user[ 'user_avatar_image' ] )
		user[ user_cover_image ] = base64_encode( user[ 'user_cover_image' ] )

		if (!user) {

			res.status(401).json({ success: false, msg: "could not find user" });

		} else {

			res.status(200).json(user);

		}

	})
	.catch((err) => {

		next(err);

	});

});

// get n childs of socialpost

router.get('/top-n-share-of-socialpost', function(req, res, next){
	SocialPost.
	findOne({endpoint:req.body.endpoint}).
	populate('shares').
	exec(function (err, socialpost_with_shares) {

		if (err) return console.log(err);

		var shares = socialpost_with_shares.shares
		new_share_collection = []				
			for (let i = 0; i < shares.length; i++) {
				if ( i === req.body.child_count ){
					break
				}

				new_share_collection.push( shares[i] )
			} 


		res.status(200).json(new_share_collection);

	});
})

// get n childs of socialpost

router.get('/get-all-shares-of-socialpost', function(req, res, next){
	SocialPost.findOne({endpoint:req.query.endpoint}).
	populate('shares').
	exec(function (err, socialpost_with_shares) {

		if (err) return console.log(err);

		if ( socialpost_with_shares ){

			var shares = socialpost_with_shares.shares
			res.status(200).json( shares );

		} else {

			res.status(500).json({msg: 'sorry no socialpost found'});				

		}
	})
})


// create socialpost with undefined

router.post('/create-socialpost-with-user', function(req, res, next){
	
	var socialpost_object = req.body.socialpost_object
	var user_object = req.body.user_object

	var newSocialPost = new SocialPost({
		_id: new mongoose.Types.ObjectId(),
		...socialpost_object
	})

	newSocialPost.save(function (err, newSocialPost) {
		if (err) return console.log(err);

			User.
			findOne({...user_object})
		.then((user) => {
			
			if( !user ){
			
				console.log('no User found')
			
			} else {
			
				newSocialPost.user = user
				res.status(200).json( newSocialPost )
			
			}
		})
		.catch((err) => {
			console.log(err)
		})
	})
})



// create Share for socialpost

router.post('/create-share-for-socialpost', function(req, res, next){

	var share_object = req.body.share_object	
	var socialpost_object = req.body.socialpost_object
	var user_object = req.body.user_object

	var newShare = new Share({
		_id: new mongoose.Types.ObjectId(),
		...share_object
	})

	newShare.save(function (err, newShare) {
		if (err) return console.log(err);

			User.findOne({...user_object})
		.then((user) => {
			
			if( !user ){
			
				console.log('no User found')
			
			} else {
			
				newShare.user = user

			// finding SocialPost object
					SocialPost.findOne({endpoint: socialpost_object.endpoint})
				.then((socialpost) => {

					if ( !socialpost ){

						console.log('no SocialPost found')

					} else {

						socialpost.shares.push( newShare )
						socialpost.save((err, blogpost) => res.status(200).json(socialpost) )
						
					}
				})
				.catch((err1) => {
					console.log(err1)
				})

			}
		})
		.catch((err) => {
			console.log(err)
		})
	})
})



// get socialposts_list

router.get('/socialposts-list', function(req, res, next){

	SocialPost.
	find().
	limit(10).
	then((socialposts)=>{
		var newSocialPosts_list = []
		socialposts.map((socialpost, index)=>{
			var newSocialPost = {}

			newSocialPost.type_of_post = socialpost[ 'type_of_post' ]
			newSocialPost.post_text = socialpost[ 'post_text' ]
			newSocialPost.image_for_post = base64_encode( socialpost[ 'image_for_post' ] )
			newSocialPost.video_for_post = socialpost[ 'video_for_post' ]
			newSocialPost.video_thumbnail_image = base64_encode( socialpost[ 'video_thumbnail_image' ] )
			newSocialPost.total_likes = socialpost[ 'total_likes' ]
			newSocialPost.total_shares = socialpost[ 'total_shares' ]
			newSocialPost.endpoint = socialpost[ 'endpoint' ]
			newSocialPost.date_of_publishing = socialpost[ 'date_of_publishing' ]

			newSocialPosts_list.push({...newSocialPost})
			newSocialPost = {}
		});

		return newSocialPosts_list
	})
	.then((newSocialPosts_list) => {

		if (!newSocialPosts_list) {

			res.status(401).json({ success: false, msg: "could not find SocialPosts_list" });

		} else {

			res.status(200).json(newSocialPosts_list);

		}

	})
	.catch((err) => {

		next(err);

	});
});


// get socialposts_list_next_10_with_children

router.get('/socialposts-list-next-10-with-children', function(req, res, next){

	SocialPost.
	find().
	skip(10).
	limit(10).
	populate('comments').
	populate('likes').
	populate('shares').
	populate('user').
	then((socialposts)=>{
		var newSocialPosts_list = []
		socialposts.map((socialpost, index)=>{
			var newSocialPost = {}

			newSocialPost.type_of_post = socialpost[ 'type_of_post' ]
			newSocialPost.post_text = socialpost[ 'post_text' ]
			newSocialPost.image_for_post = base64_encode( socialpost[ 'image_for_post' ] )
			newSocialPost.video_for_post = socialpost[ 'video_for_post' ]
			newSocialPost.video_thumbnail_image = base64_encode( socialpost[ 'video_thumbnail_image' ] )
			newSocialPost.total_likes = socialpost[ 'total_likes' ]
			newSocialPost.total_shares = socialpost[ 'total_shares' ]
			newSocialPost.endpoint = socialpost[ 'endpoint' ]
			newSocialPost.date_of_publishing = socialpost[ 'date_of_publishing' ]

			newSocialPosts_list.push({...newSocialPost})
			newSocialPost = {}
		});

		return newSocialPosts_list
	})
	.then((newSocialPosts_list) => {

		if (!newSocialPosts_list) {

			res.status(401).json({ success: false, msg: "could not find SocialPosts_list" });

		} else {

			res.status(200).json(newSocialPosts_list);

		}

	})
	.catch((err) => {

		next(err);

	});

});

// get socialpost with children

router.get('/socialpost-with-children', function(req, res, next){

	SocialPost.
	findOne({endpoint:req.body.endpoint}).

	populate('comments').
	populate('likes').
	populate('shares').
	populate('user').

	exec(function (err, socialpost_with_children) {
		if (err) return console.log(err);

		res.status(200).json(socialpost_with_children);
	});

})


// get socialpost with summarized children

router.get('/socialpost-with-summarized-children', function(req, res, next){
	SocialPost.
	findOne({endpoint:req.body.endpoint}).
	populate('comments').
	populate('likes').
	populate('shares').
	populate('user').
	exec(function (err, blogpost_with_children) {

		if (err) return console.log(err);


		var current_comments = socialpost_with_children.comments
		new_comments = []

		var current_likes = socialpost_with_children.likes
		new_likes = []

		var current_shares = socialpost_with_children.shares
		new_shares = []

		var current_user = socialpost_with_children.user
		new_user = []

		current_comments.map((comment, index)=>{
			var newComment = {}


			newComment.comment_text = comment[ 'comment_text' ]
			newComment.date_of_publishing = comment[ 'date_of_publishing' ]

			new_comments.push({...newComment})
			newComment = {}
		});

		socialpost_with_children.comments = new_comments

		current_likes.map((like, index)=>{
			var newLike = {}



			new_likes.push({...newLike})
			newLike = {}
		});

		socialpost_with_children.likes = new_likes

		current_shares.map((share, index)=>{
			var newShare = {}



			new_shares.push({...newShare})
			newShare = {}
		});

		socialpost_with_children.shares = new_shares

		current_users.map((user, index)=>{
			var newUser = {}


			newUser.phone_number = user[ 'phone_number' ]
			newUser.user_name = user[ 'user_name' ]

			new_users.push({...newUser})
			newUser = {}
		});

		socialpost_with_children.users = new_users

		res.status(200).json(socialpost_with_children);

	});
})

// get next 10 socialposts_list

router.get('/socialposts-next-10-list', function(req, res, next){

	SocialPost.
	find().
	limit(10).
	skip(10).
	then( 
		(socialposts) => {
			var newSocialPosts_list = []
			socialposts.map((socialpost, index) => {
				var newSocialPost = {}

				newSocialPost.type_of_post = socialpost[ 'type_of_post' ]
				newSocialPost.post_text = socialpost[ 'post_text' ]
				newSocialPost.image_for_post = base64_encode( socialpost[ 'image_for_post' ] )
				newSocialPost.video_for_post = socialpost[ 'video_for_post' ]
				newSocialPost.video_thumbnail_image = base64_encode( socialpost[ 'video_thumbnail_image' ] )
				newSocialPost.total_likes = socialpost[ 'total_likes' ]
				newSocialPost.total_shares = socialpost[ 'total_shares' ]
				newSocialPost.endpoint = socialpost[ 'endpoint' ]
				newSocialPost.date_of_publishing = socialpost[ 'date_of_publishing' ]

				newSocialPosts_list.push({...newSocialPost})
				newSocialPost = {}
			})
		})

		return newSocialPosts_list
	.then((newSocialPosts_list) => {

		if (!newSocialPosts_list) {

			res.status(401).json({ success: false, msg: "could not find SocialPosts_list" });

		} else {

			res.status(200).json(newSocialPosts_list);

		}

	})
	.catch((err) => {

		next(err);

	});

});
// create a comment for some socialpost
router.post('/remove-comment-from-socialpost', function(req, res, next){

	SocialPost.findOne({ endpoint: req.body.endpoint })
	.then((socialpost) => {

		socialpost.save(function (err, socialpost) {
			if (err) return console.log(err);

				Comment.findOne({ comment_order: req.body.child_index })


				.then((comment)=>{

				let index_of_comment = socialpost.comments.indexOf(comment);

				if (index_of_comment !== -1){

					socialpost.comments.splice(index, 1);

				}
			})

			Comment.findOneAndRemove( { comment_order: req.body.child_index }, (err) => {
				if (err) { console.log(err) }
			})

		});

		socialpost.save();

	});

});

// create a like for some socialpost
router.post('/remove-like-from-socialpost', function(req, res, next){

	SocialPost.findOne({ endpoint: req.body.endpoint })
	.then((socialpost) => {

		socialpost.save(function (err, socialpost) {
			if (err) return console.log(err);

				Like.findOne({ comment_order: req.body.child_index })


				.then((like)=>{

				let index_of_like = socialpost.likes.indexOf(like);

				if (index_of_like !== -1){

					socialpost.likes.splice(index, 1);

				}
			})

			Like.findOneAndRemove( { comment_order: req.body.child_index }, (err) => {
				if (err) { console.log(err) }
			})

		});

		socialpost.save();

	});

});

// create a share for some socialpost
router.post('/remove-share-from-socialpost', function(req, res, next){

	SocialPost.findOne({ endpoint: req.body.endpoint })
	.then((socialpost) => {

		socialpost.save(function (err, socialpost) {
			if (err) return console.log(err);

				Share.findOne({ comment_order: req.body.child_index })


				.then((share)=>{

				let index_of_share = socialpost.shares.indexOf(share);

				if (index_of_share !== -1){

					socialpost.shares.splice(index, 1);

				}
			})

			Share.findOneAndRemove( { comment_order: req.body.child_index }, (err) => {
				if (err) { console.log(err) }
			})

		});

		socialpost.save();

	});

});


// create User



module.exports = router;