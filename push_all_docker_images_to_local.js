const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var arguments_supplied = process.argv.slice(2);
var appName = arguments_supplied[0]


let containers_sources = './Kubernetes_Version/container_sources'

let all_image_folders = []

function get_all_deployment_files(){
	fs.readdirSync(containers_sources).forEach(async folder => {
		all_image_folders.push(folder)
	})

	return all_image_folders

}

async function buildLocally(image_folder){
	let imageSuffix = image_folder.replace('_source', '')
	imageSuffix = imageSuffix.replace('-', '_')

	await exec(`cd Kubernetes_Version/container_sources/${image_folder} && docker image build -t ${appName}_${imageSuffix} . && cd ../../`, (err, stdout, stderr) => {
		if (err || stderr) {
			err && console.log(err)
			stderr && console.log(stderr)
			return false;
		}

		console.log(`stdout: ${stdout}`);
		return true
	});
}

all_image_folders = get_all_deployment_files()

function push_all_docker_images_to_local(){

	let file_to_execute
	all_image_folders.map(async (image_folder) => {

		console.log(' ')
		console.log(`ABOUT TO BUILD IMAGE LOCALLY FOR ${image_folder}`)
		console.log(' ')
		await buildLocally(image_folder)

	})

}

push_all_docker_images_to_local()

module.exports = push_all_docker_images_to_local