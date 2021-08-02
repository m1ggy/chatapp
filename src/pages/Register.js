import React, { useState } from 'react';
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/authContext';
export default function Register() {
  const [creds, setCreds] = useState({
    email: '',
    password: '',
  });
  const { loading, setLoading, signup } = useAuth();
  const history = useHistory();
  const [message, setMessage] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    signup(creds.email, creds.password)
      .then(() => {
        history.push('/dashboard');
        setMessage('Logged in');
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <Card
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        width: '400px',
        height: '300px',
        marginTop: '300px',
      }}
    >
      <Card.Body style={{ textAlign: 'center' }}>
        <Card.Title>REgister</Card.Title>
        <Col>
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
              <Form.Label>password</Form.Label>
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
            >
              Register
            </Button>
          </Row>
        </Col>
      </Card.Body>
      <Card.Footer style={{ textAlign: 'center' }}>
        <p>
          Already have an Account?<Link to='/'>Login</Link>{' '}
        </p>
        {message}
      </Card.Footer>
    </Card>
  );
}
