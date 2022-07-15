const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // get a single user
        user: async (parent, { username }) => {
            return User.findOne({ username })
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('thoughts');
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        // create a user
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        // log in user by email and password
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
    
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }
    
            const correctPw = await user.isCorrectPassword(password);
    
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
    
            const token = signToken(user);
    
            return { token, user };
        },
        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        saveBook: async (parent, { input: { authors, description, bookId, image, link, title }, username }) => {
            const newBook = {
                authors: [],
                description: description,
                bookId: bookId,
                image: image,
                link: link,
                title: title
            }
            authors.forEach(element => {
                newBook.authors.push(element)
            });

            if (bookId && username) {
                return User.findOneAndUpdate(
                    { username: username },
                    { $addToSet: { savedBooks: newBook } },
                    { new: true, runValidators: true }
                );
            };

            


            // throw error if not logged in
            throw new AuthenticationError('You need to be logged in!');
        },
        // remove a book from savedBooks
        deleteBook: async (parent, { bookId, username }) => {
            if (bookId && username) {
                return User.findOneAndUpdate(
                    { username: username },
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
