const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // get a single user
        getSingleUser: async (parent, { user = null, _id }, { username }) => {
            return User.findOne({
                $or: [{ _id: user ? user._id : _id }, { username: username }],
            });
        },
        me: async (parent, args, context) => {
            console.log('i am trying')
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        // create a user
        createUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        // log in user by email and password
        login: async (parent, { email, password }) => {
            console.log(`this is being called`);
            const user = await User.findOne( { email: email } )
            if (!user) {
                throw new AuthenticationError('No user with this email or username found!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return { token, user };
        },
        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book } },
                    { new: true, runValidators: true }
                );
            };
            // throw error if not logged in
            throw new AuthenticationError('You need to be logged in!');
        },
        // remove a book from savedBooks
        deleteBook: async (parent, { bookId }, context) => {
            console.log(context.user); // added for testing
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true, runValidators: true }
                );
            };
            // throw error if not logged in
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

module.exports = resolvers;
