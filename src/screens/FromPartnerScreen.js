import React, { useCallback, useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { getDocs, collection, query, where, limit, onSnapshot } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';
import { LoadingScreen } from './LoadingScreen';
import { Deck } from '../components/FromPartnerSwipeCard';

const FromPartnerScreen = ({ navigation, user }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const unsubscribes = useRef([]);
  

  useEffect(async () => {
    // リクエストをもらった人のuidを取得
    const requestRef = collection(firestore, `request/${auth.currentUser.uid}/${auth.currentUser.uid}`);
    const q = query(requestRef, where(`request`, "==", true), limit(10));
    // リスナーを作成
    unsubscribes.current.push(requestListener());
    
    setLoading(false);
  },[]);

  const getUserData = async (uids) => {

    let users = [];
    // リクエストがある時はユーザデータを取りに行く
    if(uids.length != 0){
      // リクエストをもらった人の情報を取得（ where メソッドの 'in' が最大10件までしか検索できないから10件だけ）
      const usersRef = collection(firestore, `users/`);
      const userQuery = query(usersRef, where(`uid`, 'in', uids));
      const usersSnap = await getDocs(userQuery);

      usersSnap.docs.forEach((doc) => {
        users.push(
          {
            ...doc.data(),
            imgURL : doc.data().imgURL == '' ? null : doc.data().imgURL,
          }
        );
      });
      
    }
    return users;
  }

  const requestListener = () => {
    const requestRef = collection(firestore, `request/${auth.currentUser.uid}/${auth.currentUser.uid}`);
    const q = query(requestRef, where(`request`, "==", true), limit(10));

    return onSnapshot(q, async (snapshot) => {
      // 最大10件取得
      const uids = snapshot.docs.map((doc) => {
        return doc.id;
      });
      // リクエストをくれたユーザデータの配列を更新
      const datas = await getUserData(uids);
      setData(datas);
    });
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