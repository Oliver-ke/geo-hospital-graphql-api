const { addItemToDb, getItemFromDb } = require('./dynamodb/client');


getItemFromDb('oliver');
// addItemToDb({id: 'oliver', todo: "yello"})