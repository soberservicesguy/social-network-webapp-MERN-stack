const path = require('path')
const {
	get_snapshots_storage_path,
	save_file_to_gcp_storage,
	save_file_to_s3,
} = require('../../../config/storage/')

function save_generated_snapshots(video_file, timestamp){

	let file_without_format = path.basename( video_file.originalname, path.extname( video_file.originalname	 ) )
	let array_from_snapshot_count = new Array(total_snapshots_count)

	// saving snapshots in gcp store or aws s3 if needed
	let file_path
		
	if ( use_gcp_storage || use_aws_s3_storage ){

		console.log('ENTERED HERE')

		let promises = []
		let response

		for (let i = 0; i < array_from_snapshot_count.length; i++) {

			file_path = `${get_snapshots_storage_path()}/${file_without_format}-${timestamp}_${i+1}.png`

			if (use_gcp_storage){

				response = save_file_to_gcp_storage( file_path, `${file_without_format}-${timestamp}_${i+1}.png` ,'thumbnails_for_social_videos' )
				promises.push(response) // not working this way AND TAKING LONGER


			} else if (use_aws_s3_storage){

				response = save_file_to_s3( file_path, `${file_without_format}-${timestamp}_${i+1}.png` ,'thumbnails_for_social_videos' )
				promises.push(response)

			} else {
			}
	
		}

		return promises


	} else {

		console.log('FILE ALREADY AT DISK STORAGE NO NEED TO SAVE ANYWHERE')

	}

		// Promise.all(promises).then((vals) => {

		// 	console.log(vals)
		// 	console.log('REOVEDEDS')
		// 	resolve()

		// })

}

module.exports = save_generated_snapshots