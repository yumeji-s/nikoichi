import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, NativeBaseProvider } from 'native-base'; 
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';

import { auth } from '../../firebase';

const ProfileScreen = () => {
  
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('logout');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
        <View style={styles.actionBar}>
          <Text>{auth.currentUser.uid}</Text>
          <Button style={styles.button} onPress={handleLogout}>ログアウト</Button>
        </View>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    alignContent: 'center',
  },
  actionBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    padding: 12,
    borderRadius: 50,
    backgroundColor: 'rgb(29, 161, 242)',
  },
  tweetButtonText: {
    color: '#ffffff',
  },
  input: {
    height: 400,
    backgroundColor: '#f8f8f8',
    padding: 12,
  },
})

export {ProfileScreen};
