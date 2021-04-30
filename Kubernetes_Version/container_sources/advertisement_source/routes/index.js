const router = require('express').Router();

router.use('/ad', require('./advertisement/advertisement_routes'));
router.use('/ads', require('./advertisement/ads'));

// router.use('/advertisements', require('./advertisement/advertisements'));

module.exports = router;