const { ApolloServer } = require("apollo-server");
const resolvers = require('./resolvers/resolver');
const typeDefs = require('./schama/schema');
const authContext = require('./authContext');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req) => authContext(req),
  playground: true,
  introspection: true
})

const PORT = process.env.PORT || 5000;

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
})