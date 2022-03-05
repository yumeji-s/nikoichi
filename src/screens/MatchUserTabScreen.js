import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Button, Text, Card } from 'react-native-elements';
import { getDocs, collection, query, where, onSnapshot } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';


const MatchUserTabScreen = ({ navigation, user }) => {

  const [users, setUsers] = useState([]);
  // const [index, setIndex] = useState(0);
  const unsubscribes = useRef([]);

  // useEffect(() => getChatList(), []);

  // const getChatList = async () => {

  //   // マッチングしたユーザのuid取得
  //   // const matchingRef = collection(firestore, `matching/${auth.currentUser.uid}/${auth.currentUser.uid}`);
  //   // const matchingSnap = await getDocs(matchingRef);
  //   // let matchingList = [];
  //   // let chatNameList = [];
  //   // matchingSnap.docs.forEach((doc) => {
  //   //   matchingList.push(doc.id);
  //   //   chatNameList.push(doc.data().chatName);
  //   // });

    // const matchingUserRef = collection(firestore, `users`);
    // const matchingUserSnap = await getDocs(matchingUserRef);

    // let userList = [];
    // matchingUserSnap.docs.forEach((doc) => {
    //   const i = matchingList.indexOf(doc.id);
    //   if(i != -1){
    //     userList.push(
    //       {
    //         ...doc.data(),
    //         chatRoom : chatNameList[i],
    //       }
    //     );
    //   }
    // });
  //   // setUsers(userList);
  // }
  useEffect(() => {
    unsubscribes.current.push(matchListener());
  }, []);
  const matchListener = () => {
    
    const matchingRef = collection(firestore, `matching/${auth.currentUser.uid}/${auth.currentUser.uid}`);
    const q = query(matchingRef);
    return onSnapshot(q, async (snapshot) => {
      // マッチした人の uid 取得
      const datas = snapshot.docs.map((doc) => {
        return { uid: doc.id, chatName: doc.data().chatName };
      });
      // uid からユーザ情報を取得
      
      datas.map(async (data) => {
        const q = query(collection(firestore, `users`), where('uid', '==', data.uid));
        const matchingUserSnap = await getDocs(q);
        let userList = [];
        matchingUserSnap.forEach((doc) => {
          userList.push(
            {
              ...doc.data(),
              chatRoom : data.chatName,
            }
          );
        });
        setUsers((prevUsers) => prevUsers.concat(userList));
      });
    });
  }

  const clear = useCallback(() => {
    for(const unsubscribe of unsubscribes.current){
      unsubscribe();
    }
  },[]);

  useEffect(() => { return () => clear() }, [clear]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.childContainer}
        contentContainerStyle={{
          justifyContent: 'space-between'
        }}
      >
        {users.length == 0 ? <NoUsers /> : users.map((user, index) => (
          <ListItem key={index} user={user} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const NoUsers = () => (
  <View style={styles.noUserStyle}>
    <Card>
      <Card.Title>マッチしたユーザーがいません...</Card.Title>
      <Card.Divider />
      <Text style={styles.textStyle}>あなたからも積極的にいいねをすればマッチング率アップ！</Text>
    </Card>
  </View>
);

const ListItem = ({ navigation, user }) => (
  <TouchableOpacity
    style={[styles.flexify, styles.bordered]}
    onPress={() => {navigation.navigate('Chatroom', {chatRoom: user.chatRoom, name: user.name})}}
  >
    <View style={styles.cardStyle}>
      <Card>
        <Card.Title>{user.name}</Card.Title>
        <Card.Divider />
        {user.imgURL != ''
          ? <Card.Image source={{ uri : user.imgURL ? user.imgURL : undefined }}  style={styles.imageStyle} resizeMode="cover" />
          : <Card.Image source={require('../../assets/defaultUserIcon.png')} style={styles.imageStyle} resizeMode='cover' />}
        <Text style={{ marginBottom: 10 }}>{user.introduction}</Text>
        <Button buttonStyle={styles.buttonStyle} title="プロフィールを見る" onPress={() => {navigation.navigate('Confirm', { item: user })}} />
      </Card>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  noUserStyle: {
    alignSelf: 'center',
  },
  cardStyle: {
    width: '100%',
    height: '95%',
    borderRadius: 50,
  },
  imageStyle: {
    width: '100%',
  },
  childContainer: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
    marginVertical: 0,
    marginHorizontal: 'auto',
  },
  flexify: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bordered: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
    paddingVertical: 10,
  },
  buttonStyle: {
    borderRadius: 50,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
})

export { MatchUserTabScreen };