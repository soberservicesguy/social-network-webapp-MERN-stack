const path = require('path')
const multer = require('multer');
const fs = require('fs')
const env = require("dotenv").config({ path: "../../.env" });
const use_gcp_storage = ( process.env.GOOGLE_CLOUD_STORAGE_ENABLED === 'true' ) ? true : false
const use_aws_s3_storage = ( process.env.AWS_S3_STORAGE_ENABLED === 'true' ) ? true : false

let path_for_saving_files = '../../assets/uploads'

if (use_gcp_storage === false && use_aws_s3_storage === false){

	// all are exact plural  of fieldnames

	let all_links = [
	// images
		'./assets/uploads/advertisement_images',
		'./assets/uploads/avatar_images',
		'./assets/uploads/book_imagess',
		'./assets/uploads/cover_images',
		'./assets/uploads/page_images',
		'./assets/uploads/social_post_images',
		'./assets/uploads/sport_images',

	// videos
		'./assets/uploads/social_post_videos',
		'./assets/uploads/thumbnails_for_social_videos',
	]

	Promise.all(all_links.map(async (dirpath) => {

		try {

			await fs.promises.mkdir(dirpath, { recursive: true })
			console.log(`created ${dirpath}`)

		} catch (err){

			console.log(`was already created probably${dirpath}`)
			console.log(err)

		}

	}))

}



function get_multer_disk_storage(timestamp){
	// currentDate = new Date().toLocaleDateString("en-US").split("/").join(" | ");
	// currentTime = new Date().toLocaleTimeString("en-US").split("/").join(" | ");

	return multer.diskStorage({
		destination: async function(req, file, cb){

			let file_path = path.join(__dirname , `${path_for_saving_files}/${file.fieldname}s`)

			await fs.access(file_path, function(err) {
				if (err && err.code === 'ENOENT') {
					fs.mkdir(file_path); //Create dir in case not found
				}
			});

			cb(null, file_path)	

		},

		filename: function(req, file, cb){

			// let file_format = file.fieldname + '-' + timestamp + path.extname(file.originalname)
			let file_format = path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + timestamp + path.extname(file.originalname)
			cb(null, file_format);

		},
	})

}


function checkFileTypeForImages(file, cb){

	// Allowed ext
	let filetypes_for_image = /jpeg|jpg|png|gif/

	// Check ext
	let extname_for_image = filetypes_for_image.test( path.extname(file.originalname).toLowerCase() );

	// Check mime
	let mimetype_for_image = filetypes_for_image.test( file.mimetype );

		
	if (mimetype_for_image && extname_for_image) {
		cb(null, true);
	} else {
		cb('Error: jpeg, jpg, png, gif Images Only!');
	}

}

// works when image field is kept image_upload
function checkFileTypeForImageAndVideo(file, cb){
	// Allowed ext
	let filetypes_for_image = /jpeg|jpg|png|gif/
	// let filetypes_for_video = /xlsx|xls/
	let filetypes_for_video = /mp4|mov|avi|flv/;

	// Check ext
	let extname_for_image = filetypes_for_image.test( path.extname(file.originalname).toLowerCase() );
	let extname_for_video = filetypes_for_video.test( path.extname(file.originalname).toLowerCase() );

	// Check mime
	let mimetype_for_image = filetypes_for_image.test( file.mimetype );
	let mimetype_for_video = filetypes_for_video.test( file.mimetype );

	if (file.fieldname === "image_upload") { // if uploading resume
		
		if (mimetype_for_image && extname_for_image) {
			cb(null, true);
		} else {
			cb('Error: jpeg, jpg, png, gif Images Only!');
		}

	} else { // else uploading images

		if (mimetype_for_video && extname_for_video) {
			cb(null, true);
		} else {
			cb('Error: mp4, mov, avi, flv Videos Only!');
		}

	}

}

// works when excel sheet field is kept excel_sheet
function checkFileTypeForImagesAndExcelSheet(file, cb){

	// Allowed ext
	let filetypes_for_image = /jpeg|jpg|png|gif/
	// let filetypes_for_excelsheet = /xlsx|xls/
	let filetypes_for_excelsheet = /[A-Za-z]+/

	// Check ext
	let extname_for_image = filetypes_for_image.test( path.extname(file.originalname).toLowerCase() );
	let extname_for_excelsheet = filetypes_for_excelsheet.test( path.extname(file.originalname).toLowerCase() );

	// Check mime
	let mimetype_for_image = filetypes_for_image.test( file.mimetype );
	let mimetype_for_excelsheet = filetypes_for_excelsheet.test( file.mimetype );


	if (file.fieldname === "excel_sheet") { // if uploading resume
		
		if (mimetype_for_excelsheet && extname_for_excelsheet) {
			cb(null, true);
		} else {
			cb('Error: only .xlsx, .xls for excel files');
		}

	} else { // else uploading images

		if (mimetype_for_image && extname_for_image) {
			cb(null, true);
		} else {
			cb('Error: jpeg, jpg, png, gif Images Only!');
		}

	}

}


// NOT NEEDED ANYMORE
// const image_storage = multer.diskStorage({
// 	destination: path.join(__dirname , '../../assets/uploads/avatar_image'),
// 	filename: function(req, file, cb){
// 		// file name pattern fieldname-currentDate-fileformat
// 		filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
// 		filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

// 		cb(null, filename_used_to_store_image_in_assets);

// 	}
// });


// const cover_and_avatar_storage = multer.diskStorage({
// 	// destination: path.join(__dirname , '../../assets/bulk_blogposts/'),
// 	destination:function(req, file, cb){
// 		// let file_path = `./uploads/${type}`;
// 		currentDate = new Date().toLocaleDateString("en-US").split("/").join(" | ");
// 		currentTime = new Date().toLocaleTimeString("en-US").split("/").join(" | ");

// 		if (file.fieldname === "avatar_image") {

// 			let file_path = path.join(__dirname , '../../assets/uploads/avatar_image/')
// 			console.log(file_path)
// 			cb(null, file_path)	

// 		} else {

			
// 			let file_path = path.join(__dirname , `../../assets/uploads/cover_image/`)
// 			console.log(file_path)
// 			cb(null, file_path)	

// 		}

// 	},
// 	filename: function(req, file, cb){
// 		// file name pattern fieldname-currentDate-fileformat
// 		// filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
// 		// filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

// 		filename_used_to_store_image_in_assets = file.originalname
// 		cb(null, file.originalname);

// 	}
// });


module.exports = {
	get_multer_disk_storage,

	checkFileTypeForImages,
	checkFileTypeForImageAndVideo,
	checkFileTypeForImagesAndExcelSheet,
}