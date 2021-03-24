const path = require('path')
const { Storage } = require("@google-cloud/storage");
const gcp_storage = new Storage({
	keyFilename: path.join(__dirname, "../keys/android-app-backend-307507-d8ea1fdf8d98.json"),
	projectId: "android-app-backend-307507",
})

let gcp_bucket = 'portfolio_social_app'

async function save_file_to_gcp(timestamp, file_payload, folder_name, bucket_name){

// hardcode gcp_bucket if not supplied
	if (typeof(bucket_name) === 'undefined'){
		bucket_name = gcp_bucket
	}

	let the_bucket = gcp_storage.bucket(bucket_name)

	let the_file = the_bucket.file(`${folder_name}/${path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + timestamp + path.extname( file.originalname )}`);

	try{
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



module.exports = {
	gcp_storage,
	save_file_to_gcp,
	gcp_bucket,
}