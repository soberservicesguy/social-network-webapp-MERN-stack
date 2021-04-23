
const utils = {
    baseUrl:'http://localhost:3001', // for development
    // baseUrl:'http://localhost:80', // for docker
    // baseUrl:'http://hello-world.info:80', // for Kubernetes 

// THIS IS DIFFERENT FROM NATIVE, IN NATIVE NO .default needed
    image:require("./images/samosa.jpeg").default,

	notification_image: require("./images/notification_bell.jpeg").default,
	user_settings_image: require("./images/user_settings.jpg").default,



    maroonColor:'#dc4734',

}

export default utils