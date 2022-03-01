import { Deck } from '../components/SwipeCard';
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { getDocs, collection, query, where, limit } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';
import { LoadingScreen } from './LoadingScreen';


const SwipeScreen = ({ navigation, user }) => {

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
    // not-in が使えるのは hides 配列側が10件までなので、最大限取得できるように
    const usersRef = collection(firestore, `users/`);
    let users = [];
    const partnerSex = user.sex == 'man' ? 'woman':'man';
    let i = 0;
    for(i = 0; i < uids.length; i += 10){
      let hides = uids.slice(i, i + 10);
      const userQuery = query(usersRef, where('sex', '==', partnerSex), where('uid', 'not-in', hides), limit(30));
      const usersSnap = await getDocs(userQuery);
      usersSnap.docs.forEach((doc) => {
        // 非表示ユーザ以外を users に追加
        if(!(uids.includes(doc.id)) && !users.some((user) => user.uid == doc.id)){
          users.push(
            {
              ...doc.data(),
              uri : doc.data().imgURL == '' ? null : doc.data().imgURL,
            }
          );
        }
      });
    }
    
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
      backgroundColor: '#fff',
      alignItems: 'center',
    },
});


export {SwipeScreen};