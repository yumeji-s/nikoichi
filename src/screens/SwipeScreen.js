import { Deck } from '../components/SwipeCard';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { getDocs, collection, query, where, limit, onSnapshot, orderBy, startAfter } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';
import { LoadingScreen } from './LoadingScreen';

const SwipeScreen = ({ navigation, user }) => {

  const [hideUids, setHideUids] = useState([]);
  const [data, setData] = useState([]);
  const [render, setRender] = useState(true);
  const [loading, setLoading] = useState(true);
  const unsubscribes = useRef([]);
  
  const requestRef = collection(firestore, `request/${auth.currentUser.uid}/${auth.currentUser.uid}`);
  const usersRef = collection(firestore, `users/`);
  const partnerSex = user.sex == 'man' ? 'woman':'man';
  
  

  useEffect(() => {
    // 自分、リクエストをくれた人、マッチングした人のuidを取得(リスナーを使う)
    unsubscribes.current.push(requestListener());    
    
  },[]);

  const requestListener = () => {
    const q = query(requestRef);

    return onSnapshot(q, async (snapshot) => {
      let uids = snapshot.docs.map((doc) => {
        return doc.id;
      });
      if(render){
        getUserData(uids);
        setLoading(false);
        setRender(false);
      }
      // リクエストをくれたユーザデータの配列を更新
      const prevHideUids = [...hideUids];
      const newHideUids = prevHideUids.concat(uids);
      setHideUids(newHideUids);
    });
  }

  const getUserData = async (uids = hideUids) => {
    // 最大10件取得して非表示ユーザ以外をセット
    let users = [];
    let startUid = '';
    while(users.length < 10){
      // 表示されやすさはここでいじる
      const userQuery = query(usersRef, where('sex', '==', partnerSex), orderBy('uid', 'asc'), startAfter(startUid), limit(30));
      const usersSnap = await getDocs(userQuery);
      usersSnap.docs.forEach((doc) => {
        // 非表示ユーザ以外を users に追加
        if(!(uids.includes(doc.id))){
          users.push(
            {
              ...doc.data(),
              imgURL : doc.data().imgURL == '' ? null : doc.data().imgURL,
            }
          );
        }
      });
      
      // startAtを更新
      if(usersSnap.docs.length != 0){
        startUid = usersSnap.docs[usersSnap.docs.length - 1].data().uid;
      }else{
        break;
      }
    }
    setData(users);
  }

  const clear = useCallback(() => {
    for(const unsubscribe of unsubscribes.current){
      unsubscribe();
    }
  },[]);

  useEffect(() => { return () => clear() }, [clear]);

  if(loading){
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Deck data={data} getUserData={getUserData} />
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