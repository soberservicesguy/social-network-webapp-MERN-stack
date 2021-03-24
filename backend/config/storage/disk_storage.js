const path = require('path')

let path_for_saving_files = '../../assets/uploads'

function get_multer_disk_storage(timestamp){
	// currentDate = new Date().toLocaleDateString("en-US").split("/").join(" | ");
	// currentTime = new Date().toLocaleTimeString("en-US").split("/").join(" | ");

	return multer.diskStorage({
		destination: function(req, file, cb){

			let file_path = path.join(__dirname , `${path_for_saving_files}/${file.fieldname}s`)
			cb(null, file_path)	

		},

		filename: function(req, file, cb){

			let file_format = file.fieldname + '-' + timestamp + path.extname(file.originalname)
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
}