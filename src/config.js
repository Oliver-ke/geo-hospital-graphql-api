const {config} = require('dotenv');
config();

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const GOOGLE_MAP = process.env.GOOGLE_MAP;

module.exports = {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    GOOGLE_MAP
}
