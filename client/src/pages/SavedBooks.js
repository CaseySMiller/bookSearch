import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { DELETE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { GET_USER } from '../utils/queries';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  console.log(userData);
  // create state to hold delete book
  const [deleteBook, { error }] = useMutation(DELETE_BOOK);
  const loggedInUser = Auth.getProfile().data;
  const { loading, data } = useQuery(GET_USER,
    {
      variables: { ...loggedInUser },
    }
  );
  console.log(data);
  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;
  console.log(userDataLength);

  useEffect(() => {
    
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        
        if (!token) {
          return false;
        }
        const user = loggedInUser;
        setUserData(user);
        console.log('sucess!!!');

      } catch (err) {
        console.error('failure');
      }
    };

    getUserData();
  }, [0]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(bookId);
    if (!token) {
      return false;
    }

    try {
      // code here----------------------------------------------------------
      if (error) {
        console.error(error);
      }

      const updatedUser = await deleteBook({
        variables: { bookId: bookId },
      });

      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
