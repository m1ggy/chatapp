import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { firestore } from '../firebase/firebase';
import uniqid from 'uniqid';
export default function Register() {
  const [creds, setCreds] = useState({
    email: '',
    password: '',
  });
  const { signup, currentUser } = useAuth();
  const history = useHistory();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    console.log(loading);
    setLoading(true);
    console.log(loading);
    signup(creds.email, creds.password)
      .then(() => {
        const id = uniqid();
        firestore
          .collection('users')
          .doc(id)
          .set(
            {
              id,
              email: creds.email,
              password: creds.password,
              channels: [],
            },
            { merge: true }
          )
          .then(() => {
            history.push('/dashboard');
          });
      })
      .catch((e) => {
        setLoading(false);
        setMessage(e.message);
      });
  }

  useEffect(() => {
    if (currentUser) {
      history.push('/dashboard');
    }
  }, [currentUser, history]);
  return (
    <Card
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        width: '400px',
        marginTop: '300px',
      }}
    >
      <Card.Body style={{ textAlign: 'center' }}>
        <Col>
          <Card.Title>
            <h1>Chat App using React and Firebase</h1>
          </Card.Title>
          <Card.Title>Register</Card.Title>
          <Row as={Form} onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='text'
                required
                value={creds.email}
                onChange={(e) => setCreds({ ...creds, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group style={{ marginBottom: 10 }}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                required
                value={creds.password}
                onChange={(e) =>
                  setCreds({ ...creds, password: e.target.value })
                }
              />
            </Form.Group>
            <Button
              type='submit'
              style={{ marginTop: 50, width: `100px`, margin: `auto` }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Register'}
            </Button>
          </Row>
        </Col>
      </Card.Body>
      <Card.Footer style={{ textAlign: 'center' }}>
        <p>
          Already have an Account? <Link to='/'>Login</Link>{' '}
        </p>
        {message}
      </Card.Footer>
    </Card>
  );
}
