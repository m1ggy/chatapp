import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { firestore, firebase } from '../firebase/firebase';
import uniqid from 'uniqid';
import { useAuth } from '../context/authContext';
export default function NewMessageModal({ show, setShow }) {
  const handleClose = () => setShow(false);
  const [info, setInfo] = useState({ user: '', message: '' });
  const [message, setMessage] = useState({ message: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const { currentUser } = useAuth();
  useEffect(() => {
    firestore
      .collection('users')
      .where('email', '==', info.user)
      .get()
      .then((res) => {
        if (res.empty) {
          return setMessage({
            status: 'danger',
            message: `No user with the email of ${info.user}`,
          });
        }

        if (currentUser.email === info.user) {
          return setMessage({
            status: 'danger',
            message: `You cannot send a message to yourself.`,
          });
        }

        if (res.docs.length !== 0) {
          res.docs.forEach((doc) => {
            setRecipient(doc.data());
          });
          setMessage({ status: 'success', message: 'Found User!' });
        }
      });
  }, [info.user]);

  useEffect(() => {
    firestore
      .collection('users')
      .where('email', '==', currentUser.email)
      .get()
      .then((res) => {
        if (res.empty) {
          return;
        }
        console.log(res.docs);
        res.docs.forEach((doc) => {
          console.log(doc);
          setSender(doc.data());
        });
      });
  }, [currentUser]);

  function createNewChannel(e) {
    e.preventDefault();
    setLoading(true);
    if (message.status === 'danger') {
      return setMessage({
        status: 'danger',
        message: `Please make sure the recipient is valid!`,
      });
    }
    let inplace = { exists: false };
    if (sender.channels.length > 0) {
      sender.channels.forEach((channel) => {
        recipient.channels.forEach((c) => {
          if (c === channel) {
            return (inplace = { exist: true, id: c });
          }
        });
      });
    }

    if (inplace.exists === false) {
      let id = uniqid();
      inplace.id = id;
      firestore
        .collection('users')
        .doc(sender.id)
        .set(
          {
            channels: firebase.firestore.FieldValue.arrayUnion(id),
          },
          { merge: true }
        )
        .catch((e) => {
          console.log(e);
        });
      firestore
        .collection('users')
        .doc(recipient.id)
        .set(
          {
            channels: firebase.firestore.FieldValue.arrayUnion(id),
          },
          { merge: true }
        )
        .catch((e) => {
          console.log(e);
        });
    }
    let id = inplace.id;
    const messageId = uniqid();
    firestore.collection('messages').doc(messageId).set({
      id: messageId,
      content: info.message,
      channelId: id,
      sender: currentUser.email,
      timestamp: new Date(),
    });

    firestore
      .collection('channels')
      .doc(id)
      .set(
        {
          id,
          sender: currentUser.email,
          recipient: info.user,
          createdAt: new Date(),
        },
        { merge: true }
      )
      .then(() => {
        setLoading(false);
        setShow(false);
      })
      .catch(() => {
        setLoading(false);
        setMessage({ status: 'danger', message: 'an error occurred.' });
      });
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Compose new Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={createNewChannel}>
          <Form.Group>
            <Form.Label>Recipient</Form.Label>

            <Form.Control
              type='text'
              value={info.user}
              onChange={(e) => setInfo({ ...info, user: e.target.value })}
              required
            />
            <Form.Label>Message</Form.Label>
            <Form.Control
              type='textarea'
              value={info.message}
              onChange={(e) => setInfo({ ...info, message: e.target.value })}
              columns={30}
              required
            />
          </Form.Group>
          <div
            style={{
              margin: 'auto',
              marginTop: '25px',
              display: 'flex',
              justifyContent: 'space-evenly',
            }}
          >
            {' '}
            <Button variant='danger' onClick={handleClose} disabled={loading}>
              {loading ? 'Loading...' : 'Close'}
            </Button>
            <Button variant='success' type='submit' disabled={loading}>
              {loading ? 'Loading...' : 'Send!'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ textAlign: 'center' }}>
        <p className={`text-${message.status}`}>{message.message}</p>
      </Modal.Footer>
    </Modal>
  );
}
