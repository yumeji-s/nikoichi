import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button, NativeBaseProvider } from 'native-base'; 
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { signOut } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';

const ProfileScreen = () => {
  
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [image, setImage] = useState(null);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('logout');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


  const updateProfile = () => {
    const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
    setDoc(userRef, {
      name : "",
      birth : new Date(),
      imgURL : "",
    },{ capital: true }, { merge: true });
    console.log("update");
  }

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
        <View style={styles.actionBar}>
          <Text>{auth.currentUser.uid}</Text>
          <Button style={styles.button} onPress={handleLogout}>ログアウト</Button>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button onPress={pickImage}>画像を選択</Button>
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
        <View>
          <Button onPress={updateProfile}>firestore追加</Button>
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
