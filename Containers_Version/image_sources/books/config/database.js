const mongoose = require('mongoose');


mongoose.connect('mongodb://mongodb:27017/social_db', { // FOR DOCKER
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Database connected');
});