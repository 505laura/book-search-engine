const { AuthenticationError, ApolloError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async(parent, args, context) => {
      if(!context.user) {
        throw new AuthenticationError('User was not logged in.');
      }
      // Look for logged in user in db
      const userInformation = await User.findOne({_id: context.user._id});
      if(!userInformation) {
        throw new ApolloError('User was not found in the database.');
      }
    }
  },
  Mutation: {
    addUser: async(parent, args, context) => {
      const createdUser = await User.create(args);
      const token = signToken(createdUser);
      return {token, user: createdUser};
    },
    login: async(parent, args, context) => {
      const userFromDatabase = await User.findOne({email: args.email});
      const correctPw = await userFromDatabase.isCorrectPassword(args.password);
      
      if (!correctPw) {
        throw new AuthenticationError('Incorrect email or password.');
      }
      const token = signToken(userFromDatabase);
      return {token, user: userFromDatabase};
    },
    saveBook: async(parent, args, context) => {
      if(!context.user) {
        throw new AuthenticationError('User was not logged in.');
      }
      console.log(context.user);
      const updatedUser = await User.findOneAndUpdate(
        {_id: context.user._id},
        {$addToSet: {savedBooks: args.input}},
        {new: true, runValidators: true}
      );
      return updatedUser;
    },
    removeBook: async(parent, args, context) => {
      if(!context.user) {
        throw new AuthenticationError('User was not logged in.');
      }
      const updatedUser = await User.findOneAndUpdate(
        {_id: context.user._id},
        {$pull: {savedBooks: {bookId: args.bookId}}},
        {new: true}
      );
      return updatedUser;
    },
  }
};
  
module.exports = resolvers;
  