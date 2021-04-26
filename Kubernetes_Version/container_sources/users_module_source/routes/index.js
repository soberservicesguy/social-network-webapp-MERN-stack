const router = require('express').Router();

router.use('/users', require('./user/user_routes'));
router.use('/users', require('./user/sign_up'));

module.exports = router;