var express = require('express');
var router = express.Router();
var eventsController = require('../controllers/events');

router.get('/', eventsController.getAllEvents);
router.post('/', eventsController.addEvent);
router.get('/actors/:id', eventsController.getByActor);


module.exports = router;