const multer = require('multer');
const path = require('path')
const env = require("dotenv").config({ path: "../../.env" });
const use_gcp_storage = ( process.env.GOOGLE_CLOUD_STORAGE_ENABLED === 'true' ) ? true : false
const use_aws_s3_storage = ( process.env.AWS_S3_STORAGE_ENABLED === 'true' ) ? true : false
const { gcp_storage, save_file_to_gcp, gcp_bucket, save_file_to_gcp_for_bulk_files} = require('./google_cloud_storage')
const { get_multers3_storage, s3_bucket, save_file_to_aws_s3, save_file_to_aws_s3_for_bulk_files } = require('./aws_s3_storage')
const { get_multer_disk_storage, get_multer_disk_storage_for_bulk_files, } = require('./disk_storage')
const { checkFileTypeForImages, checkFileTypeForImageAndVideo, checkFileTypeForImagesAndExcelSheet, } = require('./file_filters')


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


function get_file_path_to_use(timestamp, file_to_save, folder_name){

	let filename_to_use = path.basename( file_to_save.originalname, path.extname( file_to_save.originalname ) ) + '-' + timestamp + path.extname( file_to_save.originalname )

	// console.log('filename_to_use')
	// console.log(filename_to_use)

	// console.log(`assets/uploads/${folder_name}/${filename_to_use}`)

	if (use_gcp_storage){

		// return `${bucket_name}/${file_to_save.originalname}` 
		return `https://storage.googleapis.com/${gcp_bucket}/${folder_name}/${filename_to_use}` 

	} else if (use_aws_s3_storage){

		// return `${bucket_name}/${file_to_save.originalname}`
		return `http://s3.amazonaws.com/${s3_bucket}/${folder_name}/${filename_to_use}`

	} else {

		return `assets/uploads/${folder_name}/${filename_to_use}`	

	}	
}


function get_file_path_to_use_for_bulk_files(timestamp, folder_name, file_to_save){

	// let filename_to_use = path.basename( file_to_save.originalname, path.extname( file_to_save.originalname ) ) + '-' + timestamp + path.extname( file_to_save.originalname )
	let filename_to_use = file_to_save.originalname

	// console.log('filename_to_use')
	// console.log(filename_to_use)

	// console.log(`assets/uploads/${folder_name}/${filename_to_use}`)

	if (use_gcp_storage){

		// return `${bucket_name}/${file_to_save.originalname}` 
		return `https://storage.googleapis.com/${gcp_bucket}/${folder_name}/${timestamp}/${filename_to_use}` 

	} else if (use_aws_s3_storage){

		// return `${bucket_name}/${file_to_save.originalname}`
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

	checkFileTypeForImages,
	checkFileTypeForImageAndVideo,
	checkFileTypeForImagesAndExcelSheet,
}