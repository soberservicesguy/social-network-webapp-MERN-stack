const router = require('express').Router();

router.use('/books', require('./book/books'));

module.exports = router;