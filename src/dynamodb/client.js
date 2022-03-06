const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID } = require('../config');

const TABLE_NAME = 'geohospital';
const SORT_KEY = 'history';

const dynamoDbClient = new DynamoDBClient({
	region: 'us-east-1',
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY
	}
});

const ddbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

const addItemToDb = (payload) => {
	const comm = new PutCommand({ TableName: TABLE_NAME, Item: { ...payload, x_user: SORT_KEY } });
	ddbDocClient
		.send(comm)
		.then(() => {
			return payload;
		})
		.catch((err) => {
			throw new Error(`Error could not add item ${err.message}`);
		});
};

const getItemFromDb = async (id) => {
	const comm = new GetCommand({ TableName: TABLE_NAME, Key: { id, x_user: SORT_KEY } });

	try {
		const res = await ddbDocClient.send(comm);
		return res.Item;
	} catch (error) {
		throw new Error(`Error could not get item ${error.message}`);
	}
};

const addToUserHistory = async (id, payload) => {
    try {
        const existing = await getItemFromDb(id);
        const history = existing?.history?.length ? existing.history : [];
        const newHistory = [...history, payload];
        addItemToDb({id, history: newHistory})
    } catch (error) {
        throw new Error(`Error could not add item ${error.message}`);
    }
}

module.exports = {
	ddbDocClient,
	addItemToDb,
	getItemFromDb,
    addToUserHistory
};
