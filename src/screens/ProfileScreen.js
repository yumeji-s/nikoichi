import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, NativeBaseProvider,Icon } from 'native-base'; 
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { ref } from "firebase/storage";

import { auth, storage } from '../../firebase';

const ProfileScreen = () => {
  
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [state, setState] = useState({
    url: '../../assets/mei.jpg',
    progress: '',
  });

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('logout');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const imageChoiceAndUpload = async () => {

    try {

        // CAMERA_ROLLのパーミッション確認
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            if (status !== 'granted') {
                alert("利用には許可が必要です。");
                return;
            }
        }

        // 画像を選ぶ
        const result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled) {

            // 撮影された（ローカルの）写真を取得
            const localUri = await fetch(result.uri);
            // blobを取得
            const localBlob = await localUri.blob();

            // filename 実際はUIDとかユーザー固有のIDをファイル名にする感じかと
            const filename = localUri;

            // firebase storeのrefを取得
            const storageRef = ref(storage).child(`images/${auth.currentUser.uid}/${filename}`);

            // upload
            // const putTask = await storageRef.put(localBlob);
            // 進捗を取得したいのでawaitは使わず
            const putTask = storageRef.put(localBlob);
            putTask.on('state_changed', (snapshot) => {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setState({
                    url: state.url,
                    progress: parseInt(progress) + "%",
                });
            }, (error) => {
                console.log(error);
                alert("アップロードに失敗しました。サイズが大きい可能性あり。");
            }, () => {
                putTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    console.log(downloadURL);
                    setState({
                        progress: '',
                        url: downloadURL,
                    });
                })
            })
        }
    } catch (e) {
        console.log(e.message);
        alert("サイズが大きい可能性あり。");
    }
  }

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
        <View style={styles.actionBar}>
          <Text>{auth.currentUser.uid}</Text>
          <Button style={styles.button} onPress={handleLogout}>ログアウト</Button>
          <Icon
              size="large"
              title="NI"
              onPress={imageChoiceAndUpload}
              source={{ uri: state.url }}
          />
          <Text style={{ alignSelf: 'center' }}>{state.progress}</Text>
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
  image: {
    height: 200,
    width: 200,
  }
})

export {ProfileScreen};
