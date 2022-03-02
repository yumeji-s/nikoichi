import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import { NativeBaseProvider, ScrollView, Text } from 'native-base';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { auth, firestore, storage } from '../../firebase';
import { ProfileList, Introduction } from '../components/ProfileList';

const ProfileScreen = ({ navigation, user }) => {
  
  const [icon, setIcon] = useState(user.imgURL);
  const [iconUpdateAt, setIconUpdateAt] = useState(null);
 

  // 画像フォルダを開く
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

  // アイコンを更新する
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

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
        <ScrollView h="80" _contentContainerStyle={{
          px: "20px",
          mb: "4",
          minW: "72"
        }}>
          <View style={styles.userName}>
            <Text fontSize='2xl'>{user.name}</Text>
          </View>
          <View alignSelf="center">
            {icon != '' ? 
              (<Avatar rounded size="xlarge" source={{uri: icon}} activeOpacity={0.7} key={icon} onPress={pickImage}>
                <Avatar.Accessory size={50} onPress={pickImage} />
              </Avatar>)
            : (<Avatar rounded size="xlarge" icon={{name: 'user', color: 'white', type: 'font-awesome'}}
                containerStyle={{backgroundColor: "gray"}} activeOpacity={0.7} key={icon} onPress={pickImage}>
              <Avatar.Accessory size={50} onPress={pickImage} />
            </Avatar>)}
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
  userName: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
