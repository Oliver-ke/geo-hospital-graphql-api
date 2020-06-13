const isTokenValid = require('../validator/validate');
const { addUserHistory, getUserHistory } = require('../firebase/firebase');
const googleQuery = require('../google/google');

module.exports = {
  Query: {
    search: async (_, args) => {
      const { query, radius, lng, lat } = args;
      const { results } = await googleQuery(query, radius, lng, lat);
      const filteredResult = results.map(({ id, name, vicinity, formatted_address, geometry }) => {
        const { location } = geometry;
        let address = vicinity ? vicinity : formatted_address;
        return { name, address, location, id }
      })
      return filteredResult.length > 0 ? filteredResult : [];
    },

    searchWithSaveHistory: async (_, args) => {
      const { query, radius, lng, lat } = args;

      const { results } = await googleQuery(query, radius, lng, lat);

      const filteredResult = results.map(({ id, name, vicinity, formatted_address, geometry }) => {
        const { location } = geometry;
        let address = vicinity ? vicinity : formatted_address;
        return { name, address, location, id }
      })
      // save search to user histories
      await addUserHistory('12jjush', { query: "clean spring", results: filteredResult });
      return filteredResult.length > 0 ? filteredResult : [];
    },
    userHistory: async (_, args) => {
      const { userId } = args;
      const history = await getUserHistory(userId);
      return history;
    }
  },
  Mutation: {
    addHistroy: (_, args) => {
      const { query, results } = args;
      return { query, results: [] }
    }
  }
}


// 4.8283, 7.0579