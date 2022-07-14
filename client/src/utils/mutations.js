import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            _id
            username
            email
            savedBooks
        }
    }
`;

export const LOGIN = gql`
    mutation login($username: String!, $email: String!, $password: String!) {
        login(username: $username, email: $email, password: $password) {
            _id
            username
            email
            savedBooks
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($book: Book!) {
        saveBook(book: $book) {
            savedBooks
        }
    }
`;

export const DELETE_BOOK = gql`
    mutation deleteBook($bookId: ID!) {
        deleteBook(bookId: $bookId) {
            savedBooks
        }
    }
`;