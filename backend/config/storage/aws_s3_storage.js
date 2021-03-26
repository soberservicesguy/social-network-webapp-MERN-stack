const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const path = require( 'path' );

let s3_bucket = 'portfolio-social-app'

s3_params = {
	accessKeyId: 'AKIAW2YVB4HUU247OPCY',
	secretAccessKey: '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',
	Bucket: s3_bucket, // bucket name
// not needed
	// region: 'Asia Pacific (Singapore) ap-southeast-1',
	// s3BucketEndpoint:true,
	// endpoint:"http://" + s3_bucket + ".s3.amazonaws.com",	
}

const s3 = new aws.S3(s3_params)


// const multers3_storage = multerS3({
// 	s3: s3,
// 	bucket: s3_bucket, // bucket name
// 	acl: 'aws-exec-read',
// 	key: function (req, file, cb) {
// 		cb(null, `${'avatar_images'}/${path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + timestamp_in_aws_multer + path.extname( file.originalname )}`)
// 	}
// })

function get_multers3_storage(timestamp){

	return multerS3({
		s3: s3,
		bucket: s3_bucket, // bucket name
		acl: 'aws-exec-read',
		key: function (req, file, cb) {
			cb(null, `${file.fieldname}s/${path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + timestamp + path.extname( file.originalname )}`)
		}
	})

}

// USED FOR SAVING SNAPSHOTS
async function save_file_to_aws_s3(folder_name, file_payload, file_content){

	let params = { ...s3_params, Key:`${folder_name}/${file_payload}`, Body: file_content }

	let s3_client = new aws.S3.client
	return s3_client.putObject(params, function(resp){
		console.log(resp)
	})

	// let params = {...s3_params, Key:file_name_with_path, Body: file_content}
	// let conditions = {partSize: 10 * 1024 * 1024, queueSize: 1}
	// new aws.S3.upload(params, conditions, function(err, data){
	// 	console.log(err, data);
	// })

}

// USER THIS WAY save_file_to_aws_s3_for_bulk_files( get_proper_date(timestamp), 'bulk_ads', req.files['das'][0] )
async function save_file_to_aws_s3_for_bulk_files(timestamp, folder_name, file){

	let params = { ...s3_params, Key:`${folder_name}/${timestamp}/${file}`, Body: file }

	let s3_client = new aws.S3.client
	return s3_client.putObject(params, function(resp){
		console.log(resp)
	})

}

module.exports = {
	get_multers3_storage,
	s3_bucket,

	save_file_to_aws_s3,
	save_file_to_aws_s3_for_bulk_files,
}