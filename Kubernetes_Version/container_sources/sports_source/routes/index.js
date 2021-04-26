const router = require('express').Router();

router.use('/sports', require('./sport/sports'));

module.exports = router;