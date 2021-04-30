const router = require('express').Router();

// router.use('/advertisements', require('./advertisement/advertisements'));
router.use('/ad', require('./advertisement/advertisement_routes'));
router.use('/ads', require('./advertisement/ads'));


module.exports = router;