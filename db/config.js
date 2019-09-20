const Datastore = require ('nedb');
const path = require ('path');

let db = {};
const dbConfig = () => {
  db.events = new Datastore ({
    filename: path.join (__dirname, './datasets/events.db'),
  });
  db.events.loadDatabase ();
};

module.exports = {dbConfig, db};
