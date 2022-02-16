import {Deck} from '../components/SwipeCard';
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { getDocs, collection, query, where, limit } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';
import { LoadingScreen } from './LoadingScreen';


const SwipeScreen = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    // 自分、リクエストをくれた人、マッチングした人のuidを取得
    const requestRef = collection(firestore, `request/${auth.currentUser.uid}/${auth.currentUser.uid}`);
    const requestUsersSnap = await getDocs(requestRef);
    let uids = [];
    requestUsersSnap.docs.forEach((doc) => {
      uids.push(doc.id);
    });

    // 最大30件取得して非表示ユーザ以外をセット
    const usersRef = collection(firestore, `users/`);
    const userQuery = query(usersRef, limit(30));
    const usersSnap = await getDocs(userQuery);
    let users = [];
    usersSnap.docs.forEach((doc) => {
      if(!uids.includes(doc.id)){
        users.push(
          {
            ...doc.data(),
            uri : doc.data().imgURL == '' ? null : doc.data().imgURL,
          }
        );
      }
    });
    
    setData(users);
    setLoading(false);
  },[]);

  if(loading){
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Deck data={data} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 40,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
});


export {SwipeScreen};