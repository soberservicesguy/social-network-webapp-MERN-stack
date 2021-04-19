const router = require('express').Router();

router.use('/socialposts', require('./social_post/socialposts'));

module.exports = router;