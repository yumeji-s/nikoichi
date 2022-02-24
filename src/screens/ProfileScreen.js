import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Button, NativeBaseProvider, ScrollView } from 'native-base'; 
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { auth, firestore, storage } from '../../firebase';
import { LoadingScreen } from './LoadingScreen';
import { ProfileList, Introduction } from '../components/ProfileList';

const ProfileScreen = () => {
  
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [icon, setIcon] = useState(null);
  const [iconUpdateAt, setIconUpdateAt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    // 最初のレンダリング時にアイコンなどを取得
    const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
    const snapShot = await getDoc(userRef);
    if(snapShot.data().imgURL != ''){
      setIcon(snapShot.data().imgURL);
      setIconUpdateAt(snapShot.data().updateAt);
    }
    setUser({
      ...snapShot.data(),
    });
    setLoading(false);
  },[]);

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

    // アイコンが更新されたら五分間更新できないようにする
    const update = (new Date() - iconUpdateAt) / (1000 * 60) < 5;
    if(update){
      return;
    }

    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== 'granted') {
          alert("利用には許可が必要です。");
          return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      updateIcon(result.uri);
    }
  };

  const updateIcon = async (url) => {
    const iconRef = ref(storage, `images/${auth.currentUser.uid}/icon`);
    const localUri = await fetch(url);
    const localBlob = await localUri.blob();

    const metadata = {
      name : 'icon',
    };

    uploadBytes(iconRef, localBlob, metadata).then(async (snapshot) => {
      const userIconRef = doc(firestore, `users/${auth.currentUser.uid}`);
      const imgUrl = await getDownloadURL(ref(storage, `images/${auth.currentUser.uid}/icon`));
      updateDoc(userIconRef, {
        imgURL : imgUrl,
        updateAt : new Date(),
      }, { capital: true });
      setIconUpdateAt(new Date());
      setIcon(url);
    });
  };

  if(loading){
    return <LoadingScreen />;
  }

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
        <ScrollView h="80" _contentContainerStyle={{
          px: "20px",
          mb: "4",
          minW: "72"
        }}>
          <View style={styles.actionBar}>
            <Text>{user.name}</Text>
            <Button style={styles.button} onPress={handleLogout}>ログアウト</Button>
          </View>
          <View alignSelf="center">
            {icon && <Avatar rounded size="xlarge" source={{uri: icon}} activeOpacity={0.7} key={icon} onPress={pickImage}>
              <Avatar.Accessory size={50} onPress={pickImage} />
            </Avatar>}
            {!icon && <Avatar rounded size="xlarge" icon={{name: 'user', color: 'white', type: 'font-awesome'}}
                containerStyle={{backgroundColor: "gray"}} activeOpacity={0.7} key={icon} onPress={pickImage}>
              <Avatar.Accessory size={50} onPress={pickImage} />
            </Avatar>}
          </View>
          <View>
            <Introduction introduction={user.introduction} />
            <ProfileList user={user} />
          </View>
        </ScrollView>
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
