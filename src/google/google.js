const axios = require('axios');
const {GOOGLE_MAP } = require('../config')

const key = GOOGLE_MAP;

const googleQuery = async (query, radius, lng, lat) => {
  try {
    let searchEntity = 'textsearch'
    const baseUri = `https://maps.googleapis.com/maps/api/place/${searchEntity}/json`;
    let queryParams = encodeURI(`?query=${query}&location=${lat},${lng}&radius=${radius}&type=hospital`);
    const matchKeyword = checkTypeFromQuery(query);
    if (matchKeyword) {
      searchEntity = "nearbysearch";
      queryParams = encodeURI(`?keyword=${query}&location=${lat},${lng}&radius=${radius}`);
    }
    const uri = `${baseUri}${queryParams}&key=${key}`;
    const { data } = await axios.get(uri);
    return data;
  } catch (error) {
    throw new Error(error)
  }
}

const checkTypeFromQuery = (query) => {
  const queryLowerCase = query.toLocaleLowerCase();
  const regex = new RegExp(/ \b(\w*pharmacies|pharmacy|clinics|clinic|medical offices|medical office\w*)\b/);
  const isMatch = regex.exec(queryLowerCase);
  if (isMatch) {
    return queryLowerCase;
  }
  return false;
}

module.exports = googleQuery;