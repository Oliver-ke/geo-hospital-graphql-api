const { addItemToDb, getItemFromDb, addToUserHistory } = require('../dynamodb/client');
const googleQuery = require('../google/google');

module.exports = {
  Query: {
    search: async (_, args) => {
      const { query, radius, lng, lat } = args;
      const { results } = await googleQuery(query, radius, lng, lat);
      const filteredResult = results.map(({ place_id, name, vicinity, formatted_address, geometry }) => {
        const { location } = geometry;
        let address = vicinity ? vicinity : formatted_address;
        return { name, address, location, id: place_id }
      })
      return filteredResult.length > 0 ? filteredResult : [];
    },
    searchWithSaveHistory: async (_, args, { req }) => {
      const { user } = req;
      if (!user) {
        throw new Error("Invalid user, provide valid X_USER in request header");
      }
      const { query, radius, lng, lat } = args;
      const { results } = await googleQuery(query, radius, lng, lat);

      const filteredResult = results.map(({ place_id, name, vicinity, formatted_address, geometry }) => {
        const { location } = geometry;
        let address = vicinity ? vicinity : formatted_address;
        return { name, address, location, id: place_id }
      })
  
      addToUserHistory(user, {query, results: filteredResult, id: user });
      return filteredResult.length > 0 ? filteredResult : [];
    },
    userHistory: async (_, args, { req }) => {
      const { user } = req;
      if (!user) {
        throw new Error("Invalid user, provide valid X_USER in request header");
      }
      const payload = await getItemFromDb(user);
      return payload?.history || [];
    }
  },
  Mutation: {
    addHistroy: async (_, args, { req }) => {
      const { query, results } = args;
      const { user } = req;
      if (!user) {
        throw new Error("Invalid user, provide valid X_USER in request header");
      }
      addItemToDb({id: user, query, results: results });
      return { query, results }
    }
  }
}
