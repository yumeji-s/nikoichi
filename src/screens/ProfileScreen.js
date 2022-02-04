import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button, NativeBaseProvider, Avatar } from 'native-base'; 
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { auth, firestore, storage } from '../../firebase';

const ProfileScreen = () => {
  
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [icon, setIcon] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(async () => {
    // iconが更新されるごとにアイコンを取得
    const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
    const snapShot = await getDoc(userRef);
    if(snapShot.data().imgURL != ""){
      const iconUrl = await getDownloadURL(ref(storage, `images/${auth.currentUser.uid}/icon`));
      console.log(iconUrl);
      setIcon(iconUrl);
    }else{
      setIcon(null);
    }
  },[icon]);

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

  const updateIcon = async () => {
    if(!image){
      return;
    }
    const iconRef = ref(storage, `images/${auth.currentUser.uid}/icon`);
    const localUri = await fetch(image);
    const localBlob = await localUri.blob();

    const metadata = {
      name : 'icon',
    };

    uploadBytes(iconRef, localBlob, metadata).then((snapshot) => {
      const userIconRef = doc(firestore, `users/${auth.currentUser.uid}`);
      updateDoc(userIconRef, {
        imgURL : snapshot.metadata.fullPath,
      }, { capital: true });
      setIcon(null);
      // setIcon(getDownloadURL(ref(storage, `images/${auth.currentUser.uid}/icon`)));
    });
  }

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
        <View style={styles.actionBar}>
          <Text>{auth.currentUser.uid}</Text>
          <Button style={styles.button} onPress={handleLogout}>ログアウト</Button>
        </View>
        <View>
          {image && <Avatar bg="indigo.500" alignSelf="center" size={"2xl"} source={{ uri: image }} />}
          {!image && <Avatar bg="indigo.500" alignSelf="center" size={"2xl"} source={{ uri: image }} />}
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button onPress={pickImage}>画像を選択</Button>
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
        <View>
          <Button onPress={updateIcon}>icon更新</Button>
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
