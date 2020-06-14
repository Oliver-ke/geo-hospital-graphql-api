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
    searchWithSaveHistory: async (_, args, { req }) => {
      const { user } = req;
      if (!user) {
        throw new Error("Invalid user, provide valid X_USER in request header");
      }
      const { query, radius, lng, lat } = args;
      const { results } = await googleQuery(query, radius, lng, lat);

      const filteredResult = results.map(({ id, name, vicinity, formatted_address, geometry }) => {
        const { location } = geometry;
        let address = vicinity ? vicinity : formatted_address;
        return { name, address, location, id }
      })

      await addUserHistory(user, { query, results: filteredResult });
      return filteredResult.length > 0 ? filteredResult : [];
    },
    userHistory: async (_, args, { req }) => {
      const { user } = req;
      if (!user) {
        throw new Error("Invalid user, provide valid X_USER in request header");
      }
      const history = await getUserHistory(user);
      return history;
    }
  },
  Mutation: {
    addHistroy: async (_, args, { req }) => {
      const { query, results } = args;
      const { user } = req;
      console.log(user);
      if (!user) {
        throw new Error("Invalid user, provide valid X_USER in request header");
      }
      await addUserHistory(user, { query, results });
      return { query, results }
    }
  }
}
