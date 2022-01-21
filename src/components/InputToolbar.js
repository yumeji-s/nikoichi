import React from 'react';
import { Image } from 'react-native';
import { InputToolbar, Actions, Composer, Send } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: '#bdb76b',
      paddingTop: 6,
    }}
    primaryStyle={{ alignItems: 'center' }}
  />
);

export const renderActions = (props) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Ionicons name="md-document" size={32} style={{ width: 32, height: 32 }}/>
    )}
    options={{
      'Choose From Library': () => {
        console.log('Choose From Library');
      },
      Cancel: () => {
        console.log('Cancel');
      },
    }}
    optionTintColor="#222B45"
  />
);

export const renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: '#222B45',
      backgroundColor: '#EDF1F7',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#E4E9F2',
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
    }}
  />
);

export const renderSend = (props) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}
  >
  <Ionicons name="send" size={32} style={{ width: 32, height: 32 }}/>
  </Send>
);