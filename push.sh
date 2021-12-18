#!/usr/bin/expect -f
. ../../pipeline/push.sh --source-only

appName='appointment'

dockerLocation='Local'
# dockerLocation='DockerRegistery'


# almost same in all
baseURL_for_App='http://localhost:3001'
baseURL_for_Containerized_Version='http://localhost:80'
baseURL_for_Kubernetes_Version='http://hello-world.info:80'

# change for each project
baseURL_for_Heroku='https://appointment-mern-web.herokuapp.com'
aws_s3_accessKeyId='AKIAW2YVB4HUWASTJCER'
aws_s3_secretAccessKey='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'
aws_s3_bucket='portfolio-apps-mern-native'

# FIXED
frontendURL_for_App='http://localhost:3000'
frontendURL_for_Containerized_Version=$baseURL_for_Containerized_Version
frontendURL_for_Kubernetes_Version=$baseURL_for_Kubernetes_Version
frontendURL_for_Heroku=$baseURL_for_Heroku
utilities_file_path='./App/frontend/src/utilities.js'
app_frontend_file_path='./App/frontend/'
app_backend_file_path='./App/backend/'
app_backend_env_file_path='./App/backend/.env'
docker_images_path='./Containers_Version/image_sources'
kubernetes_containers_path='./Kubernetes_Version/container_sources'
kubernetes_path='./Kubernetes_Version'

# updateBackendRoutesIntoContainersAndKubernetesFolders $app_backend_file_path $docker_images_path $kubernetes_containers_path
# generateVersionAppBuildAndCopyToBackend $baseURL_for_App $utilities_file_path
# generateVersionContainerBuildAndCopyToBackend $baseURL_for_Containerized_Version $utilities_file_path  
# generateVersionKubernetesBuildAndCopyToBackend $baseURL_for_Kubernetes_Version $utilities_file_path
# generateDockerImages $kubernetes_containers_path $kubernetes_path
# deployApp $baseURL_for_Heroku $utilities_file_path $aws_s3_accessKeyId $aws_s3_secretAccessKey $aws_s3_bucket
createNewGithubPR $baseURL_for_App $app_backend_file_path $docker_images_path $kubernetes_containers_path $baseURL_for_Containerized_Version $app_backend_env_file_path