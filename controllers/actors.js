const dbSetUp = require ('../db/config');
const db = dbSetUp.db;

const getOccurrence = (events, actor) =>
	events.filter (event => event.actor.id === actor.id).length;
	
const getDay = (date) => {
 const day =	new Date(date).getTime();
 return (Math.floor(day/86400000))
}

const getDaysOccurrence = (events, actorEvent) =>
  events.filter (event => (event.actor.id === actorEvent.actor.id && getDay(event.created_at) !== getDay(actorEvent.created_at))).length;

const getAllActors = (req, res) => {
  db.events.find ({}, {_id: 0}, (err, events) => {
		let actors = [];
    events.forEach (event => {
      const actorEvents = getOccurrence (events, event.actor);
      if (!actors.find (actor => actor.event.actor.id === event.actor.id)) {
        actors.push ({actorEvents, event});
      }
    });

    allActors = actors.sort ((a, b) => {
      const eventA = a.event;
      const eventB = b.event;
      if (a.actorEvents === b.actorEvents) {
        const dateA = new Date (eventA.created_at).getTime ();
        const dateB = new Date (eventB.created_at).getTime ();
        if (dateA === dateB) {
          if (eventA.actor.login > eventB.actor.login) return -1;
          if (eventB.actor.login > eventA.actor.login) return 1;
          return 0;
        }
        return dateB - dateA;
      }
      return b.actorEvents - a.actorEvents;
    });

    if (events.length) {
      return res.status (200).json (actors.map (actor => actor.event.actor));
    }
    return res.status (400).json();
  });
};

const updateActor = (req, res) => {
  const {body, body: {avatar_url, id}} = req;
  const invalidFields = !Object.keys (body).every (element =>
    ['id', 'login', 'avatar_url'].includes (element)
  );
  if (invalidFields) {
    return res.status (400).json();
  }
  db.events.update (
    {'actor.id': Number (id)},
    {$set: {'actor.avatar_url': avatar_url}},
    {multi: true},
    (err, numReplaced) => {
      if (numReplaced < 1) {
        return res.status (404).json();
      }
      return res.status (200).json();
    }
  );
};

const getStreak = (req, res) => {
	db.events.find ({}, {_id: 0}, (err, events) => {
    // events.forEach (event => {
    //   const actorEvents = getDaysOccurrence(events, event);
      
    //   if (!actors.find (actor => actor.event.actor.id === event.actor.id)) {
    //     actors.push ({actorEvents, event});
    //   }
    // });
  
let oldIndex = null;
let occurence = 1;
let obj={};

events.forEach((event, index) => {
   if (obj[event.actor.id] === undefined){
          obj[event.actor.id] = {event, occurence: 1};
   }
  if (oldIndex && events[index].actor.id === events[oldIndex].actor.id) {
     occurence += 1;
    if (obj[event.actor.id].occurence < occurence)
      obj[event.actor.id] = {event, occurence: occurence};
  }
   else {
     occurence = 1;
    if(obj[event.actor.id].occurence <= occurence)
    obj[event.actor.id] = {event, occurence};
   }
  oldIndex = index;
  if(obj[event.actor.id].occurence > 1) {
    // console.log(obj[event.actor.id],']]]]]]]]]]]]]]]]]' )
  }
})

  const actors = Object.keys(obj).map(element => obj[element]);

    allActors = actors.sort ((a, b) => {
      const eventA = a.event;
      const eventB = b.event;
      if (a.occurence === b.occurence) {
        const dateA = new Date (eventA.created_at).getTime ();
        const dateB = new Date (eventB.created_at).getTime ();
        if (dateA === dateB) {
          if (eventA.actor.login > eventB.actor.login) return -1;
          if (eventB.actor.login > eventA.actor.login) return 1;
          return 0;
        }
        return dateB - dateA;
      }
      return b.occurence - a.occurence;
    });

    if (events.length) {
      const result = allActors.map(actor => actor.occurence);
      console.log(result, '>>>>>>>>>>>>>>>>>>>>>>>')
      return res.status (200).json (result);
    }
    return res.status (400).json();
  });
};

module.exports = {
  updateActor: updateActor,
  getAllActors: getAllActors,
  getStreak: getStreak,
};
