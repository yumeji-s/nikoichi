import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { getDocs, collection, query, where, limit } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';
import { LoadingScreen } from './LoadingScreen';
import { Deck } from '../components/FromPartnerCard';

const FromPartnerScreen = ({ navigation, user }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    // リクエストをもらった人のuidを取得
    const requestRef = collection(firestore, `request/${auth.currentUser.uid}/${auth.currentUser.uid}`);
    const q = query(requestRef, where(`request`, "==", true), limit(10));
    const requestUsersSnap = await getDocs(q);
    let uids = [];
    requestUsersSnap.docs.forEach((doc) => {
      uids.push(doc.id);
    });
    
    // リクエストがなかったらテキトーな値を入れておく
    if(uids.length == 0){
      uids.push("0");
    }

    // リクエストをもらった人の情報を取得
    const usersRef = collection(firestore, `users/`);
    const userQuery = query(usersRef, where(`uid`, 'in', uids));
    const usersSnap = await getDocs(userQuery);
    let users = [];
    usersSnap.docs.forEach((doc) => {
      users.push(
        {
          ...doc.data(),
          uri : doc.data().imgURL == '' ? null : doc.data().imgURL,
        }
      );
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
      backgroundColor: '#fff',
      alignItems: 'center',
    },
});


export {FromPartnerScreen};