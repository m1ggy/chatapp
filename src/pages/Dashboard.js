import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { Col, Form, Row, Jumbotron, Button, Spinner } from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { useHistory } from 'react-router';
import NewMessageModal from '../components/NewMessageModal';
import NotificationToast from '../components/NotificationToast';
import uniqid from 'uniqid';
export default function Dashboard() {
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [show, setShow] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState({});
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [notification, setNotification] = useState('');
  const { currentUser, logout } = useAuth();

  const history = useHistory();
  useEffect(() => {
    setLoading(true);
    function fetchData() {
      firestore
        .collection('users')
        .where('email', '==', currentUser.email)
        .get()
        .then((res) => {
          if (res.empty) {
            return;
          }

          res.docs.forEach((doc) => {
            setUser(doc.data());
          });
        });
    }

    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (user !== {})
      if (user.channels != null)
        user.channels.forEach((channel) => {
          firestore
            .collection('channels')
            .where('id', '==', channel)
            .get()
            .then((res) => {
              if (res.empty) {
                return;
              }

              res.docs.forEach((doc) => {
                console.log(doc);
                setChannels((channels) => [...channels, doc.data()]);
              });
            });
        });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    console.log(channels);
  }, [channels]);

  useEffect(() => {
    console.log(user);
  }, [user]);
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    if (selectedChannel !== {})
      if (selectedChannel.id != null) {
        let unsubscribe = firestore
          .collection('messages')
          .where('channelId', '==', selectedChannel.id)
          .orderBy('timestamp', 'asc')
          .onSnapshot((snapshot) => {
            if (snapshot.empty) {
              return;
            }

            // let temp = [];
            // snapshot.docs.forEach((doc) => {
            //   temp.push(doc.data());
            // });
            // setMessages(temp);

            snapshot.docChanges().forEach((change) => {
              // if (change.doc.data().sender !== currentUser.email) {
              //   setNotification(change.doc.data().sender);
              //   setShowToast(true);
              // }
              setMessages((msg) => [...msg, change.doc.data()]);
              setLoading(false);
            });
          });

        return unsubscribe;
      }
  }, [selectedChannel]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  function handleMessage(e) {
    e.preventDefault();
    const messageId = uniqid();
    firestore.collection('messages').doc(messageId).set({
      id: messageId,
      content: newMessage,
      channelId: selectedChannel.id,
      sender: currentUser.email,
      timestamp: new Date(),
    });
    setNewMessage('');
  }
  return (
    <div
      style={{
        width: '100%',
        height: '750px',
      }}
    >
      <NotificationToast show={showToast} setShow={setShowToast} />
      <NewMessageModal show={show} setShow={setShow} user={notification} />
      <Jumbotron className='bg-light w-100'>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <h1>Dashboard</h1>

          <Row
            className='w-100'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginLeft: '20px',
              marginRight: '20px',
            }}
          >
            <Button
              variant='success'
              style={{ width: '150px', margin: '10px', height: '55px' }}
              onClick={() => setShow(true)}
            >
              Send a Message
            </Button>
            <Button
              variant='danger'
              style={{ width: '125px', margin: '10px', height: '45px' }}
              onClick={() => logout().then(() => history.push('/'))}
            >
              Sign out
            </Button>
            <p>signed in as {currentUser.email}</p>
            <div style={{ minHeight: '100px' }}>
              {' '}
              {loading && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-evenly' }}
                >
                  <Spinner animation='border' size='sm' />
                </div>
              )}
            </div>
          </Row>
          <Row className='border h-100'>
            <Col lg={3}></Col>
            <Col className='border' lg={2}>
              <Row>
                <h3>Conversations</h3>
              </Row>
              <Row
                as='div'
                style={{ width: '100%', height: '400px', overflowY: 'scroll' }}
              >
                {channels.length ? (
                  <ul>
                    {channels.map((channel) => {
                      return (
                        <li
                          onClick={() => setSelectedChannel(channel)}
                          key={channel.id}
                          style={{ textAlign: 'center', minHeight: '50px' }}
                          className={
                            channel.id === selectedChannel.id
                              ? 'border border-success'
                              : 'border'
                          }
                        >
                          {channel.sender === currentUser.email
                            ? channel.recipient
                            : channel.sender}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  'user does not have any conversation.'
                )}
              </Row>
            </Col>
            <Col
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
              className='border'
            >
              <Row className='w-100'>
                {selectedChannel ? (
                  <p
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                  >
                    {selectedChannel.sender === currentUser.email
                      ? selectedChannel.recipient
                      : selectedChannel.sender}
                  </p>
                ) : (
                  <p>Select a conversation to begin</p>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    flexDirection: 'column',
                    height: '600px',
                    overflowY: 'scroll',
                    marginBottom: '100px',
                  }}
                >
                  {messages &&
                    messages.map((message) => {
                      return (
                        <div
                          key={message.id}
                          style={
                            currentUser.email === message.sender
                              ? {
                                  alignSelf: 'flex-end',
                                  minWidth: '250px',
                                  margin: '5px',
                                  borderRadius: '30px',
                                  minHeight: '75px',
                                }
                              : {
                                  alignSelf: 'flex-start',
                                  minWidth: '250px',
                                  margin: '5px',
                                  borderRadius: '30px',
                                  minHeight: '75px',
                                }
                          }
                          className='border'
                        >
                          <p style={{ textAlign: 'center' }}>
                            {message.content}
                          </p>
                          <p
                            style={{
                              fontSize: '7px',
                              bottom: 0,
                              right: 0,
                              color: 'gray',
                              textAlign: 'left',
                              margin: '10px',
                            }}
                          >
                            {message.timestamp
                              .toDate()
                              .toLocaleTimeString('en') +
                              (currentUser.email === message.sender
                                ? ', me'
                                : '')}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </Row>
              <Row
                className='w-100 border'
                style={{
                  position: 'absolute',
                  bottom: 0,
                  padding: '25px',
                  height: '100px',
                }}
              >
                {selectedChannel && Object.keys(selectedChannel).length > 0 && (
                  <Form style={{ display: 'flex' }} onSubmit={handleMessage}>
                    <Form.Control
                      type='text'
                      style={{ width: '75%' }}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                      variant='success'
                      type='submit'
                      disabled={newMessage === '' ? true : false}
                      style={{ margin: '10px' }}
                    >
                      Send
                    </Button>
                  </Form>
                )}
              </Row>
            </Col>
            <Col lg={3}></Col>
          </Row>
        </Row>
      </Jumbotron>
    </div>
  );
}
