var express = require('express');
var router = express.Router();
var eventsController = require('../controllers/events');

router.delete('/', eventsController.eraseEvents);


module.exports = router;