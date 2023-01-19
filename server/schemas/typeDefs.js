const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    me: User
  }

  input SaveBookInput {
    authors: [String]
    description: String
    title: String
    bookId: Int
    image: String
    link: String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: SaveBookInput): User
    removeBook(bookId: Int!): User
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: Int
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: String
    user: User
  }
`;

module.exports = typeDefs;
