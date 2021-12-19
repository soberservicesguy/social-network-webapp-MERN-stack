const {
	get_image_to_display
} = require('../../../config/storage/')
const base64_encode = require('../../../lib/image_to_base64')

async function get_post_details(type_of_post, post_created, post_details){

	let image_for_post_to_use
	let video_thumbnail_image_to_use

	switch (type_of_post) {
		case "text_post":

			var { post_text } = post_created
			post_details = { ...post_details, post_text }
			break

		case "image_post":

			var { image_for_post, object_files_hosted_at } = post_created
			// OLD VERSION
			// image_for_post_to_use = await get_image_to_display(image_for_post, object_files_hosted_at)
			// NEW VERSION
			if (object_files_hosted_at === 'disk_storage'){
				console.log({object_files_hosted_at})
				image_for_post_to_use = base64_encode(image_for_post)
			}
			post_details = { ...post_details, image_for_post: image_for_post_to_use, image_for_post_host:object_files_hosted_at }
			// image_for_post = null
			break

		case "video_post":

			var { video_for_post, video_thumbnail_image, object_files_hosted_at } = post_created
			// OLD VERSION
			// video_thumbnail_image_to_use = await get_image_to_display(video_thumbnail_image, object_files_hosted_at)
			// NEW VERSION
			video_thumbnail_image_to_use = video_thumbnail_image
			post_details = { ...post_details, video_for_post, video_thumbnail_image: video_thumbnail_image_to_use, video_thumbnail_image_host: object_files_hosted_at}									

			break

		case "text_with_image_post":

			var { post_text, image_for_post, object_files_hosted_at } = post_created
			// OLD VERSION
			// image_for_post_to_use = await get_image_to_display(image_for_post, object_files_hosted_at)
			// NEW VERSION
			if (object_files_hosted_at === 'disk_storage'){
				console.log({object_files_hosted_at})
				image_for_post_to_use = base64_encode(image_for_post)
			}
			post_details = { ...post_details, post_text, image_for_post:image_for_post_to_use, image_for_post_host: object_files_hosted_at}									
			break

		case "text_with_video_post":

			var { post_text, video_for_post, video_thumbnail_image, object_files_hosted_at } = post_created
			// OLD VERSION
			// video_thumbnail_image_to_use = await get_image_to_display(video_thumbnail_image, object_files_hosted_at)
			// NEW VERSION
			video_thumbnail_image_to_use = video_thumbnail_image
			post_details = { ...post_details, post_text, video_for_post, video_thumbnail_image: video_thumbnail_image_to_use, video_thumbnail_image_host: object_files_hosted_at}								
			break

		default:
			null
	}

	return post_details
}


module.exports = get_post_details