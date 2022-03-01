import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Avatar, Card, Text } from 'react-native-elements';
import { getDocs, collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore';

import { auth, firestore, storage } from '../../firebase';
import { messageListener } from '../components/ChatListener';
import { LoadingScreen } from '../screens/LoadingScreen'


const ChatTabScreen = ({ route, navigation }) => {

  const [users, setUsers] = useState([]);
  const unsubscribes = useRef([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(async () => {

    let unmounted = false;

    // マッチングしたユーザのuid取得
    const matchingRef = collection(firestore, `matching/${auth.currentUser.uid}/${auth.currentUser.uid}`);
    const matchingSnap = await getDocs(matchingRef);
    let matchingList = [];
    let chatNameList = [];
    matchingSnap.docs.forEach((doc) => {
      matchingList.push(doc.id);
      chatNameList.push(doc.data().chatName);
    });

    // とりあえずユーザ全員取得
    // 後で10件ずつ検索してこれるように変更
    const matchingUserRef = collection(firestore, `users`);
    const matchingUserSnap = await getDocs(matchingUserRef);
    let userList = [];
    matchingUserSnap.docs.forEach((doc) => {

      // マッチした人がいるか検索
      const i = matchingList.indexOf(doc.id);
      // いたらユーザリストに追加
      if(i != -1){
        userList.push(
          {
            ...doc.data(),
            chatRoom : chatNameList[i],
          }
        );
      }
    });



    // メッセージ取得前にsetUsersが動いてる
    // メッセージ取得後setUser動かす、
    // やり取りした順に並べる
    
    // userListに最新のメッセージ追加

    const result = await Promise.all(userList.map(async (user, index) => {
      const messageRef = collection(firestore, `chat/${user.chatRoom}/messages`);
      const q = query(messageRef, orderBy("createdAt","desc"), limit(1));
      await onSnapshot(q, (snapshot) => {
        const targets = snapshot.docs.map((doc) => {
          return {...doc.data()};
        });
        if(targets.length == 0){
          user.messages = [{
            _id: "",
            createdAt: "",
            text: "",
            user: {
              _id: "",
              avatar: "",
              name: "",
            }
          }];
        }else{
          user.messages = targets;
        }
      });
    }));

    // const result = await Promise.all(userList.map(async (user, index) => {
    //   const messageRef = collection(firestore, `chat/${user.chatRoom}/messages`);
    //   const q = query(messageRef, orderBy("createdAt","desc"), limit(1));
    //   unsubscribes.current.push(await onSnapshot(q, (snapshot) => {
    //     const targets = snapshot.docs.map((doc) => {
    //       return {...doc.data()};
    //     });
    //     if(targets.length == 0){
    //       user.messages = [{
    //         _id: "",
    //         createdAt: "",
    //         text: "",
    //         user: {
    //           _id: "",
    //           avatar: "",
    //           name: "",
    //         }
    //       }];
    //     }else{
    //       user.messages = targets;
    //     }
    //   }));
    // }));

    if(!unmounted){
      setUsers(userList);
      setLoading(false);
    }

    return () => { unmounted = true; };
  }, []);

  const clear = useCallback(() => {
    for(const unsubscribe of unsubscribes.current){
      unsubscribe();
    }
  },[]);

  useEffect(() => { return () => clear() }, [clear]);

  if(loading){
    return <LoadingScreen/>
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.childContainer}>        
        {users.length == 0 ? <NoUsers /> : users.map((user, index) => (
          <ListItem key={index} user={user} lastMessage={user.messages} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const NoUsers = () => (
  <View style={styles.noUserStyle}>
    <Card>
      <Card.Title style={styles.titleStyle}>マッチしたユーザーがいません...</Card.Title>
      <Card.Divider />
      <Text style={styles.textStyle}>あなたからも積極的にいいねをすればマッチング率アップ！</Text>
    </Card>
  </View>
);


// const now = Date.now();
// const lastMessagesSnapshotListener = (users) => {

//   users.map((user) => {
//     const messageRef = collection(firestore, `chat/${user.chatRoom}/messages`);  // メッセージ登録用
//   });
  

//   //過去メッセージの購読リスナー
//   const registPastMessageListener = useCallback((time) => {
//       return onSnapshot(query(messageRef, orderBy("createdAt","desc"), startAfter(time), limit(1)), (snapshot) => {dispMsgSnap(snapshot)});
//   },[]);

//   // 初回ロード
//   const initRead = useCallback(() => {
//     // 未来のメッセージを購読する
//     // unsubscribes.current.push(registLatestMessageListener());
//     // 現時刻よりも古いデータを一定数、購読する
//     unsubscribes.current.push(registPastMessageListener(now));
//   },[registPastMessageListener]);

//   return { messages, initRead };
// };

const ListItem = ({ navigation, user, lastMessage }) => (
  <TouchableOpacity
    style={[styles.flexify, styles.bordered]}
    onPress={() => {navigation.navigate('Chatroom', {...user})}}
  >
    <View style={styles.flexify}>
      {user.imgURL != "" 
        ? <Avatar rounded source={{uri: user.imgURL}} activeOpacity={0.7} />
        : <Avatar rounded icon={{name: 'user', color: 'white', type: 'font-awesome'}} containerStyle={{backgroundColor: "gray"}} activeOpacity={0.7} />
      }
      <View style={{ marginLeft: 10 }}>
        <Text h4 style={{ fontWeight: "600" }}>
          {user.name}
        </Text>
    <Text>{lastMessage != undefined ? lastMessage.text : ""}</Text>
      </View>
    </View>

    <Text>{lastMessage != undefined ? lastMessage.createdAt : ""}</Text>
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
  childContainer: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
    width: '100%',
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
})

export { ChatTabScreen };