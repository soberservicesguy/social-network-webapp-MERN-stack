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

frontendURL_for_App='http://localhost:3000'
frontendURL_for_Containerized_Version=$baseURL_for_Containerized_Version
frontendURL_for_Kubernetes_Version=$baseURL_for_Kubernetes_Version
frontendURL_for_Heroku=$baseURL_for_Heroku

updateBackendRoutesIntoContainersAndKubernetesFolders
generateVersionAppBuildAndCopyToBackend
generateVersionContainerBuildAndCopyToBackend
generateVersionKubernetesBuildAndCopyToBackend
generateDockerImages
deployApp
createNewGithubPR