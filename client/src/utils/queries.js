import { gql } from '@apollo/client';

export const GET_USER = gql`
    query getSingleUser($user: String, $_id: String) {
        getSingleUser(user: $user, _id: $_id) {
            _id
            username
            email
            savedBooks
        }
    }
`;

export const ME = gql`
    query me {
        me {
            _id
            username
            email
            savedBooks
        }
    }
`;
