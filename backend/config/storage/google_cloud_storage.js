const path = require('path')
const { Storage } = require("@google-cloud/storage");
const gcp_storage = new Storage({
	keyFilename: path.join(__dirname, "../../keys/android-app-backend-307507-d8ea1fdf8d98.json"),
	projectId: "android-app-backend-307507",
})

let gcp_bucket = 'portfolio_social_app'

async function save_file_to_gcp(timestamp, file_payload, avoid_timestamp){

	let the_bucket = gcp_storage.bucket(gcp_bucket)
	let the_file

	try{

		if (avoid_timestamp){

			the_file = the_bucket.file(`${file_payload.fieldname}s/${path.basename( file_payload.originalname, path.extname( file_payload.originalname ) ) + path.extname( file_payload.originalname )}`);

		} else {

			the_file = the_bucket.file(`${file_payload.fieldname}s/${path.basename( file_payload.originalname, path.extname( file_payload.originalname ) ) + '-' + timestamp + path.extname( file_payload.originalname )}`);

		}

		await the_file.save(file_payload.buffer)

	} catch (err){

		console.log(err)

	}

	// let file_write_stream = the_file.createWriteStream();

	// console.log('finish1')

	// return new Promise(function(resolve, reject){
	// 	file_write_stream.on('error', (err) => {
	// 		console.log('saving file error', err);
	// 		next(err);
	// 		reject()
	// 			console.log('finish2')

	// 		return;
	// 	})
	// 	.on('finish', () => {
	// 		console.log(`${file_payload.originalname} uploaded to gcp`)
	// console.log('finish3')

	// 	})
	// 	// .end( file_payload.buffer ); // as seen in https://stackoverflow.com/questions/43171193/retrieving-images-from-google-cloud-storage-in-node-js-without-public-url#_=_
	// 	.on('end', function () {
	// 		// res.end();
	// 			console.log('finish4')

	// 		resolve()
	// 	});
	// })

}

// USE THIS WAY save_file_to_gcp_for_bulk_files( get_proper_date(timestamp), 'bulk_ads', req.files['das'][0] )
async function save_file_to_gcp_for_bulk_files(timestamp, folder_name, file){

	let the_bucket = gcp_storage.bucket(gcp_bucket)
	let the_file

	try{

		the_file = the_bucket.file(`${folder_name}/${timestamp}/${file}`)
		await the_file.save(file_payload.buffer)

	} catch (err){

		console.log(err)

	}

}



module.exports = {
	gcp_storage,
	save_file_to_gcp,
	save_file_to_gcp_for_bulk_files,
	gcp_bucket,
}