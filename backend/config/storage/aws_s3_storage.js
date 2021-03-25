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


function save_file_to_aws_s3(file_save_folder, file){

	let params = {...s3_params, Key:file_save_folder, Body: file}
	let conditions = {partSize: 10 * 1024 * 1024, queueSize: 1}

	new aws.S3.upload(params, conditions, function(err, data){
		console.log(err, data);
	})

}

module.exports = {
	get_multers3_storage,
	s3_bucket,

	save_file_to_aws_s3,
}