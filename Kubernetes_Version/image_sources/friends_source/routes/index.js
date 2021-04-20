const router = require('express').Router();

router.use('/friends', require('./friend_requests/friend_request_accept'));

module.exports = router;