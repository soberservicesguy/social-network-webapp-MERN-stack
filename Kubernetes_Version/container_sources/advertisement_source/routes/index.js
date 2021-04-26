const router = require('express').Router();

router.use('/advertisements', require('./advertisement/advertisements'));

module.exports = router;