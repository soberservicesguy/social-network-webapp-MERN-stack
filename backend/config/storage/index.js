const multer = require('multer');
const path = require('path')
const env = require("dotenv").config({ path: "../../.env" });
const use_gcp_storage = ( process.env.GOOGLE_CLOUD_STORAGE_ENABLED === 'true' ) ? true : false
const use_aws_s3_storage = ( process.env.AWS_S3_STORAGE_ENABLED === 'true' ) ? true : false
const { gcp_storage, save_file_to_gcp, gcp_bucket, save_file_to_gcp_for_bulk_files, get_file_from_gcp} = require('./google_cloud_storage')
const { get_multers3_storage, s3_bucket, save_file_to_aws_s3, save_file_to_aws_s3_for_bulk_files, get_file_from_aws } = require('./aws_s3_storage')
const { get_multer_disk_storage, get_multer_disk_storage_for_bulk_files, } = require('./disk_storage')
const { checkFileTypeForImages, checkFileTypeForImageAndVideo, checkFileTypeForImagesAndExcelSheet, } = require('./file_filters')

async function get_image_to_display(image_path_field, image_location_field){

	let cloud_resp

	let image

	if (image_location_field === 'gcp_storage'){

		cloud_resp = await get_file_from_gcp(image_path_field)
		image = cloud_resp.toString('base64')

	} else if (image_location_field === 'aws_s3'){

		cloud_resp = await get_file_from_aws(image_path_field)
		image = cloud_resp.toString('base64')

	} else {

		image = base64_encode( image_path_field )

	}

	return image

}


function get_multer_storage_to_use(timestamp){
	if (use_gcp_storage){
	
		return multer.memoryStorage()
	
	} else if (use_aws_s3_storage){
	
		return get_multers3_storage(timestamp)
	
	} else {
	
		return get_multer_disk_storage(timestamp)
	
	}
}

function get_multer_storage_to_use_for_bulk_files(timestamp, folder_name){
	if (use_gcp_storage){
	
		return multer.memoryStorage()
	
	} else if (use_aws_s3_storage){
	
		return multer.memoryStorage()
	
	} else {
	
		return get_multer_disk_storage_for_bulk_files(timestamp, folder_name)
	
	}
}


function get_file_storage_venue(){
	if (use_gcp_storage){
	
		return 'gcp_storage'
	
	} else if (use_aws_s3_storage){
	
		return 'aws_s3'
	
	} else {
	
		return 'disk_storage'
	
	}
}


function get_file_path_to_use(file_to_save, folder_name, timestamp){

	let filename_to_use

	if (use_gcp_storage){

		// since  gcp doesnt use multer therefore originalname property should be used as there is no filename property by default
		filename_to_use = path.basename( file_to_save.originalname, path.extname( file_to_save.originalname ) ) + '-' + timestamp + path.extname( file_to_save.originalname )
		
		console.log('FILE BEING CALLED FROM HERE')
		console.log(`https://storage.googleapis.com/${gcp_bucket}/${folder_name}/${filename_to_use}`)

		// return `https://storage.googleapis.com/${gcp_bucket}/${folder_name}/${filename_to_use}` 
		return `${folder_name}/${filename_to_use}` 

	} else if (use_aws_s3_storage){

		filename_to_use = path.basename( file_to_save.originalname, path.extname( file_to_save.originalname ) ) + '-' + timestamp + path.extname( file_to_save.originalname )
		// return `http://s3.amazonaws.com/${s3_bucket}/${folder_name}/${filename_to_use}`
		return `${folder_name}/${filename_to_use}` 

	} else {

		filename_to_use = path.basename( file_to_save.filename, path.extname( file_to_save.filename ) ) + path.extname( file_to_save.filename )
		return `assets/uploads/${folder_name}/${filename_to_use}`	

	}	
}


function get_file_path_to_use_for_bulk_files(timestamp, folder_name, file_to_save){

	// let filename_to_use = path.basename( file_to_save, path.extname( file_to_save ) ) + '-' + timestamp + path.extname( file_to_save )
	let filename_to_use = file_to_save

	// console.log('filename_to_use')
	// console.log(filename_to_use)

	// console.log(`assets/uploads/${folder_name}/${filename_to_use}`)

	if (use_gcp_storage){

		// return `${bucket_name}/${file_to_save}` 
		return `https://storage.googleapis.com/${gcp_bucket}/${folder_name}/${timestamp}/${filename_to_use}` 

	} else if (use_aws_s3_storage){

		// return `${bucket_name}/${file_to_save}`
		return `http://s3.amazonaws.com/${s3_bucket}/${folder_name}/${timestamp}/${filename_to_use}`

	} else {

		return `assets/uploads/${folder_name}/${timestamp}/${filename_to_use}`

	}	
}


function get_snapshots_storage_path(){

	if (use_gcp_storage || use_aws_s3_storage){
	
		return '/tmp'
		
	} else {
	
		return 'assets/uploads/thumbnails_for_social_videos'
	
	}	

}

module.exports = {
	get_image_to_display,
	get_multer_storage_to_use,
	get_multer_storage_to_use_for_bulk_files,
	get_file_storage_venue,
	get_file_path_to_use,
	get_file_path_to_use_for_bulk_files,

	use_gcp_storage,
	use_aws_s3_storage,

	get_file_from_gcp,
	save_file_to_gcp,
	save_file_to_gcp_for_bulk_files,
	gcp_bucket,

	get_snapshots_storage_path,

	get_file_from_aws,
	save_file_to_aws_s3,
	save_file_to_aws_s3_for_bulk_files,

	checkFileTypeForImages,
	checkFileTypeForImageAndVideo,
	checkFileTypeForImagesAndExcelSheet,
}