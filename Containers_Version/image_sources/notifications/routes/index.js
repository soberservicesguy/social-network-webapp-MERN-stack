const router = require('express').Router();

router.use('/notifications', require('./notification/push_notifications'));

module.exports = router;