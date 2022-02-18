import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Avatar, Input, Overlay, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons  } from '@expo/vector-icons';
import { doc, setDoc, getDoc, getDocs, updateDoc, collection, query, where, limit } from 'firebase/firestore';

import { auth, firestore, storage } from '../../firebase';


const ChatTabScreen = () => {

  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  
  useEffect(() => getChatList(), []);

  const getChatList = async () => {

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
    setUsers(userList);
  }

  // 最後のメッセージを取得
  const getMessages = (user) => {
    
    return message;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.childContainer}>
        <Search />
        {users.map((user, index) => (
          <ListItem key={index} user={user} lastMessage={getMessages(user)} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const now = Date.now();
const lastMessageSnapshotListener = (chatRoom) => {

  const unsubscribes = useRef([]);
  const [messages, setMessages] = useState([]);
  const messageRef = collection(firestore, `chat/${chatRoom}/messages`);  // メッセージ登録用

  // 未来（最新メッセージ）の購読リスナー
  // const registLatestMessageListener = useCallback(() => {
  //     return onSnapshot(query(messageRef, orderBy("createdAt","asc"), startAfter(now), limit(1)), (snapshot) => {dispMsgSnap(snapshot)});
  // },[]);

  //過去メッセージの購読リスナー
  const registPastMessageListener = useCallback((time) => {
      return onSnapshot(query(messageRef, orderBy("createdAt","desc"), startAfter(time), limit(1)), (snapshot) => {dispMsgSnap(snapshot)});
  },[]);

  // 初回ロード
  const initRead = useCallback(() => {
    // 未来のメッセージを購読する
    // unsubscribes.current.push(registLatestMessageListener());
    // 現時刻よりも古いデータを一定数、購読する
    unsubscribes.current.push(registPastMessageListener(now));
  },[registPastMessageListener]);

  // 登録解除(Unmount時に解除）
  const clear = useCallback(() => {
    for(const unsubscribe of unsubscribes.current){
      unsubscribe();
    }
  },[]);

  useEffect(() => { return () => { clear(); }; }, [clear]);

  const dispMsgSnap = (snapshot) => {
    // 取得したメッセージを表示できるように加工
    snapshot.docChanges().forEach((change) => {
      const id = change.doc.id;
      const chat = change.doc.data();
      const newMessage = {
        _id: id,
        text: chat.text,
        createdAt: chat.createdAt.toDate(),
        user: {
          _id: chat.user._id,
          name: chat.user.name,
          avatar: chat.user.avatar
        }
      };
      switch(change.type){
      case 'added':
        msgAppend(newMessage);
        break;
      case 'modified':
        break;
      case 'removed':
        break;
      default: 
        break;
      }
    });
  };
  
  const msgAppend = (newMessage = []) => {
    // 最新メッセージを表示
    
  };
  return { initRead, readMore, messages };
};

const Search = () => (
  <View
    style={[styles.flexify, { marginHorizontal: 5, marginTop: 10 }]}
  >
    <Input
      placeholder="Search messages"
      leftIcon={<Icon name="search" size={24} color="gray" />}
      inputContainerStyle={{ borderBottomWidth: 0 }}
      // onChangeText={}
    />

    <Icon name="rowing" size={24} color="gray" />
  </View>
)

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
        <Text>{lastMessage.text}</Text>
      </View>
    </View>

    <Text>{lastMessage.createdAt}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  headerWrapper: {
    shadowColor: '#171717',
    shadowOffset:{
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  childContainer: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
    width: '90%',
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