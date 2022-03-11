const {
	get_image_to_display
} = require('../../../config/storage/')
const base64_encode = require('../../../lib/image_to_base64')

async function get_post_details(type_of_post, post_created, post_details){

	let image_for_post_to_use
	let video_thumbnail_image_to_use
	let post_image
	console.log({type_of_post})
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
			post_image = await get_image_to_display(image_for_post, object_files_hosted_at)

			post_details = { ...post_details, image_for_post: post_image, image_for_post_host:object_files_hosted_at }
			// image_for_post = null
			break

		case "video_post":

			var { video_for_post, video_thumbnail_image, object_files_hosted_at } = post_created
			// OLD VERSION
			// video_thumbnail_image_to_use = await get_image_to_display(video_thumbnail_image, object_files_hosted_at)
			// NEW VERSION
			video_thumbnail_image_to_use = video_thumbnail_image
			post_image = await get_image_to_display(video_thumbnail_image, object_files_hosted_at)
			post_details = { ...post_details, video_for_post, video_thumbnail_image: post_image, video_thumbnail_image_host: object_files_hosted_at}									

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
			post_image = await get_image_to_display(image_for_post, object_files_hosted_at)
			post_details = { ...post_details, post_text, image_for_post:post_image, image_for_post_host: object_files_hosted_at}									
			break

		case "text_with_video_post":

			var { post_text, video_for_post, video_thumbnail_image, object_files_hosted_at } = post_created
			// OLD VERSION
			// video_thumbnail_image_to_use = await get_image_to_display(video_thumbnail_image, object_files_hosted_at)
			// NEW VERSION
			video_thumbnail_image_to_use = video_thumbnail_image
			post_image = await get_image_to_display(video_thumbnail_image, object_files_hosted_at)
			post_details = { ...post_details, post_text, video_for_post, video_thumbnail_image: post_image, video_thumbnail_image_host: object_files_hosted_at}								
			break

		case "created_book":
			var { book_image, book_image_host } = post_created
			book_image = book_image.replace('/app/', '')
			console.log({book_image})
			post_image = await get_image_to_display(book_image, book_image_host)
			post_details = {...post_details, book_image: post_image}
			break

		case "got_interested_in_book":
			var { book_image, book_image_host } = post_created
			book_image = book_image.replace('/app/', '')
			console.log({book_image})
			post_image = await get_image_to_display(book_image, book_image_host)
			post_details = {...post_details, book_image: post_image}
			break

		case "created_page":
			var { page_image, page_image_host } = post_created
			page_image = page_image.replace('/app/', '')
			console.log({page_image})
			post_image = await get_image_to_display(page_image, page_image_host)
			post_details = {...post_details, page_image: post_image}
			break

		case "got_interested_in_page":
			var { page_image, page_image_host } = post_created
			page_image = page_image.replace('/app/', '')
			console.log({page_image})
			post_image = await get_image_to_display(page_image, page_image_host)
			post_details = {...post_details, page_image: post_image}
			break

		case "created_sport":
			var { sport_image, sport_image_host } = post_created
			sport_image = sport_image.replace('/app/', '')
			console.log({sport_image})
			post_image = await get_image_to_display(sport_image, sport_image_host)
			post_details = {...post_details, sport_image: post_image}
			break

		case "got_interested_in_sport":
			var { sport_image, sport_image_host } = post_created
			sport_image = sport_image.replace('/app/', '')
			console.log({sport_image})
			post_image = await get_image_to_display(sport_image, sport_image_host)
			post_details = {...post_details, sport_image: post_image}
			break

		case "created_advertisement":
			var { ad_image, ad_image_host } = post_created
			ad_image = ad_image.replace('/app/', '')
			console.log({ad_image})
			post_image = await get_image_to_display(ad_image, ad_image_host)
			post_details = {...post_details, ad_image: post_image}
			break

		case "got_interested_in_advertisement":
			var { ad_image, ad_image_host } = post_created
			ad_image = ad_image.replace('/app/', '')
			console.log({ad_image})
			post_image = await get_image_to_display(ad_image, ad_image_host)
			post_details = {...post_details, ad_image: post_image}
			break

		default:
			null
	}

	return post_details
}


module.exports = get_post_details