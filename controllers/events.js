var dbSetUp = require('../db/config');
var db = dbSetUp.db;

var getAllEvents = (req, res) => {
	db.events.find({}, {_id: 0}, (err, events) => { 
		allEvents = events.sort((a, b) => Number(a.id) - Number(b.id))	
		return res.status(200).json(allEvents);
	})
};

var addEvent = (req, res) => {
	var { body, body: { id } } = req;
	db.events.find({id}, {_id: 0}, (err, event) => { 
		if(event.length > 0) {
			return res.status(400).json()
		}
			db.events.insert({...body}, (err, newEvent) => {
				return res.status(201).json()
			})
	});
};


var getByActor = (req, res) => {
	var { params: { id }} = req;
	db.events.find({ "actor.id": Number(id)}, {_id: 0 }, (err, events) => { 
		allEvents = events.sort((a, b) => Number(a.id) - Number(b.id))	
		if(events.length) {
			return res.status(200).json(allEvents)
		}
		return res.status(404).json()
	})
};


var eraseEvents = (req, res) => {
	db.events.remove({}, { multi: true }, (err, numRemoved) => {
		console.log(numRemoved);
		return res.status(200).json();
	});
};

module.exports = {
	getAllEvents: getAllEvents,
	addEvent: addEvent,
	getByActor: getByActor,
	eraseEvents: eraseEvents
};

















