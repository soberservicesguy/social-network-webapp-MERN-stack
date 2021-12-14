const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);


let containers_sources = './Kubernetes_Version/container_sources'

let all_image_folders = []

function get_all_deployment_files(){
	fs.readdirSync(containers_sources).forEach(async folder => {
		all_image_folders.push(folder)
	})

	return all_image_folders

}

async function buildAndPushToDockerRegistry(image_folder){
	await exec(`cd Kubernetes_Version/container_sources/${image_folder} && bash build_image_and_push.sh && cd ../../`, (err, stdout, stderr) => {
		if (err || stderr) {
			err && console.log(err)
			stderr && console.log(stderr)
			return false;
		}

		console.log(`stdout: ${stdout}`);
		return true
	});
}

async function buildLocally(image_folder){
	let imageSuffix = image_folder.replace('_source', '')

	await exec(`cd Kubernetes_Version/container_sources/${image_folder} && docker image build -t socialapp_${imageSuffix} . && cd ../../`, (err, stdout, stderr) => {
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

function push_all_docker_images_to_docker_registy(){

	let file_to_execute
	all_image_folders.map(async (image_folder) => {

		console.log(' ')
		console.log(`ABOUT TO BUILD IMAGE LOCALLY FOR ${image_folder}`)
		console.log(' ')
		buildLocally(image_folder)

		// TO BUILD AND PUSH CONTAINER TO REGISTERY, USE BELOW BLOCK
		/*console.log(' ')
		console.log(`ABOUT TO BUILD IMAGE AND PUSH TO REGISTERY FOR ${image_folder}`)
		console.log(' ')
		for (let i = 0; i < 10; i++) {
			let result = await buildAndPushToDockerRegistry(image_folder)
			if (result){
				console.log(' ')
				console.log('PUSHED TO DOCKER SUCCESSFULLY')
				console.log(' ')
				break
			}
		}*/

	})

}

push_all_docker_images_to_docker_registy()

module.exports = push_all_docker_images_to_docker_registy