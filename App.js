/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState, useCallback, useRef} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import database from '@react-native-firebase/database';

const userId = uuid.v4();
const App = () => {
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState(undefined);

  const db = database();

  const startedAt = useRef(null);

  useEffect(() => {
    startedAt.current = new Date();
    setMessages([
      {
        _id: 1,
        text: 'Hello there, type user first message is your username, type it now ⌨️',
        createdAt: startedAt.current,
        user: {
          _id: 0,
          name: 'Maher',
          avatar:
            'https://gravatar.com/avatar/adb9b86a5c022432afeff2bc4458d7a8?s=200&d=wavatar&r=pg',
        },
      },
    ]);
  }, []);

  useEffect(() => {
    db.ref('poc').on('child_added', snapshot => {
      if (
        snapshot.val().user._id !== userId &&
        snapshot.val().createdAt &&
        snapshot.val().createdAt > startedAt.current
      ) {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, snapshot.val()),
        );
      }
    });
  }, [db]);

  const onSend = useCallback(
    (m = []) => {
      const msg = m[0];
      msg.createdAt = new Date().getTime();
      if (!userName) {
        setUserName(msg.text);
        msg.text = `${msg.text} join the chat`;
      }
      db.ref('poc').push(msg);
      setMessages(previousMessages => GiftedChat.append(previousMessages, m));
    },
    [db, userName],
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={m => onSend(m)}
      showUserAvatar
      renderUsernameOnMessage
      user={{
        _id: userId,
        name: userName || '',
        avatar: `https://gravatar.com/avatar/${userId}?s=200&d=wavatar&r=pg`,
      }}
    />
  );
};

export default App;
