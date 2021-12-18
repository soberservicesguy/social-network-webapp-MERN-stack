
const cors = require("cors");

let cors_policy = cors({
	origin: "https://appointment-mern-web.herokuapp.com", // restrict calls to those this address
	methods: ['GET', 'POST'] // only allow GET, POST requests
})

module.exports = cors_policy
