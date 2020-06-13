const { gql } = require('apollo-server')

const typeDefs = gql`
  type Location {
    lat: Float
    lng: Float
  }
  type Search {
    id: ID
    location: Location
    address: String
    name: String
  }
  type QueryHistory {
    id: ID
    query: String
    results: [Search]!
  }
  input LocationInput{
    lat: Float
    lng: Float
  }
  input resultsInput{
    id: ID
    location: LocationInput
    address: String
    name: String
  }
  type Query {
    userHistory(userId: String!): [QueryHistory]!
    searchWithSaveHistory(query: String!, radius: Int!, lng: Float!, lat: Float!): [Search]!
    search(query: String!, radius: Int!, lng: Float!, lat: Float!): [Search]!
  }
  type Mutation {
    addHistroy(query: String!, results: [resultsInput]): QueryHistory
  }
`;



module.exports = typeDefs