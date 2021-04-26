const router = require('express').Router();

router.use('/pages', require('./page/pages'));

module.exports = router;