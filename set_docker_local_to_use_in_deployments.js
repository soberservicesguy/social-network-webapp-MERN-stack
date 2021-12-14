const fs = require('fs')
const YAML = require('yaml')

var arguments_supplied = process.argv.slice(2);
var appName = arguments_supplied[0]


let containers_sources = './Kubernetes_Version/container_sources'
let deployment_path = './Kubernetes_Version'



async function updateDeploymentFileForLocal(image_folder){
	let regex_for_depl_image = /\s*image\:/
	let imageSuffix = image_folder.replace('_source', '')
	imageSuffix = imageSuffix.replace('_', '-')
	let file_path = `${deployment_path}/${imageSuffix}-depl-serv.yaml`
	var file_lines_content = fs.readFileSync(file_path).toString().split("\n");
	let file_lines_with_matched_regex = file_lines_content.filter((line) => {
		return regex_for_depl_image.test(line) === true
	})
	file_lines_with_matched_regex = file_lines_with_matched_regex[0]
	const index = file_lines_content.indexOf( file_lines_with_matched_regex );
	
	let newLine = `\t\t\t\timage: ${appName}_${imageSuffix}:latest`

	if (index > -1) {
		// file_lines_content.splice(index, 1);
		// file_lines_content.splice(index, 0, newLine);
		file_lines_content.splice(index, 1, newLine);
	}
	

	let final_content_to_write = file_lines_content.join("\n")	
	await fs.writeFile(file_path, final_content_to_write, function (err) {
		if (err) return console.log(err);
	});

}

function get_all_deployment_files(){
	let all_image_folders = []
	fs.readdirSync(containers_sources).forEach(async folder => {
		all_image_folders.push(folder)
	})
	return all_image_folders
}


function set_docker_local_to_use_in_deployments(){
	let all_image_folders = get_all_deployment_files()
	all_image_folders.map(async (image_folder) => {
		console.log(' ')
		console.log(`ABOUT TO BUILD IMAGE LOCALLY FOR ${image_folder}`)
		console.log(' ')
		await updateDeploymentFileForLocal(image_folder)
	})
}

set_docker_local_to_use_in_deployments()

module.exports = set_docker_local_to_use_in_deployments