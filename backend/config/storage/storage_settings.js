const path = require('path')
const env = require("dotenv").config({ path: "../../.env" });
const use_gcp_storage = ( process.env.GOOGLE_CLOUD_STORAGE_ENABLED === 'true' ) ? true : false
const use_aws_s3_storage = ( process.env.AWS_S3_STORAGE_ENABLED === 'true' ) ? true : false
const { gcp_storage, save_file_to_gcp, gcp_bucket } = require('./google_cloud_storage')
const { get_multers3_storage, s3_bucket } = require('./aws_s3_storage')

const { get_multer_disk_storage, checkFileTypeForImages } = require('./disk_storage')

function get_multer_storage_to_use(timestamp){
	if (use_gcp_storage){
	
		return multer.memoryStorage()
	
	} else if (use_aws_s3_storage){
	
		return get_multers3_storage(timestamp)
	
	} else {
	
		return get_multer_disk_storage(timestamp)
	
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

	let path_to_use = path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + timestamp + path.extname( file.originalname )

	if (use_gcp_storage){

		// return `${bucket_name}/${file_to_save.originalname}` 
		return `https://storage.googleapis.com/${gcp_bucket}/${path_to_use}` 

	} else if (use_aws_s3_storage){

		// return `${bucket_name}/${file_to_save.originalname}`
		return `http://s3.amazonaws.com/${s3_bucket}/${path_to_use}`

	} else {

		return `assets/uploads/${path_to_use}`	

	}	
}



module.exports = {
	get_multer_storage_to_use,
	get_file_storage_venue,
	get_file_path_to_use,

	use_gcp_storage,
	use_aws_s3_storage,

	save_file_to_gcp,
	gcp_bucket,

	checkFileTypeForImages,
}