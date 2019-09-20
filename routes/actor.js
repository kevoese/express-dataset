var express = require('express');
var router = express.Router();
var actorsController = require('../controllers/actors');

router.get('/', actorsController.getAllActors);
router.put('/', actorsController.updateActor);
router.get('/streak', actorsController.getStreak);


module.exports = router;