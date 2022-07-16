import React, { useEffect, useState } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { DELETE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { QUERY_USER } from '../utils/queries';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [deleteBook, { error }] = useMutation(DELETE_BOOK);
  
  const { loading, data } = useQuery(QUERY_USER, {
    variables: { username: Auth.getProfile().data.username },
  });  
  const [userData, setUserData] = useState({});
  
  useEffect(() => {
    const user = data?.user || {};
      setUserData(user);
    }, [loading])
    
    // handler for deleting a book
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      console.log('No Token!');
      return false;
    }

    try {
      const updatedUser = await deleteBook({
        variables: { bookId: bookId, username: Auth.getProfile().data.username },
      });
      console.log(updatedUser);
      setUserData({});
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (!userData?._id) {
    return <div><h1>Loading..........</h1></div>;
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
          {userData.savedBooks.length > 0
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
                  <p className='small'>
                    Authors: {book.authors.map((author) => {return (` ${author},`)})}
                  </p>
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
