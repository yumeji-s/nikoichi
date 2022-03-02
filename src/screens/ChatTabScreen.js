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

import { auth, firestore } from '../../firebase';
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
    console.log('start');
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
    
    // リスナーを作成
    userList.map((user, index) => {
      unsubscribes.current.push(chatlistener(user, index));
    })

    if(!unmounted){
      setUsers(userList);
      setLoading(false);
    }

    return () => { unmounted = true; };
  }, []);

  const chatlistener = (user, index) => {
    
    const messageRef = collection(firestore, `chat/${user.chatRoom}/messages`);
    const q = query(messageRef, orderBy("createdAt","desc"), limit(1));
    return onSnapshot(q, (snapshot) => {
      // 0件 or 1件 取得
      const targets = snapshot.docs.map((doc) => {
        return {...doc.data()};
      });

      // usersはstateだから最新の値を取得できない
      let cpUsers = {...users};
      // console.log(cpUsers);
      let msg;
      // メッセージがない時は空白で初期化
      if(targets.length == 0){
        msg = {
          _id: "",
          createdAt: "",
          text: "",
          user: {
            _id: "",
            avatar: "",
            name: "",
          }
        };
      }else{
        msg = {
          _id: targets[0]._id,
          createdAt: targets[0].createdAt.toDate(),
          text: targets[0].text,
          user: {
            _id: targets[0].user._id,
            avatar: targets[0].user.avatar,
            name: targets[0].user.name,
          }
        };
      }
      console.log('setUsers'); 

      // state（連想配列の配列）の一部だけ更新
      setUsers((prevUsers) =>
        prevUsers.map((user, i) => (
          i == index 
            ? { ...user, messages : msg}
            : user
        ))
      );
    });
  }

  const clear = useCallback(() => {
    for(const unsubscribe of unsubscribes.current){
      unsubscribe();
      console.log('clear');
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

const ListItem = ({ navigation, user, lastMessage }) => (
  <TouchableOpacity
    style={[styles.flexify, styles.bordered]}
    onPress={() => {navigation.navigate('Chatroom', {...user})}}
  >
    <View style={styles.flexify}>
      {user.imgURL != "" 
        ? <Avatar rounded source={{uri: user.imgURL}} activeOpacity={0.7} size={'medium'} marginLeft={10} />
        : <Avatar rounded icon={{name: 'user', color: 'white', type: 'font-awesome'}} containerStyle={{backgroundColor: "gray"}} activeOpacity={0.7} size={'medium'} marginLeft={10} />
      }
      <View style={{ marginLeft: 20 }}>
        <Text numberOfLines={1} style={{ fontSize: 20, marginTop: 10}}>
          {user.name}
        </Text>
        <Text numberOfLines={1} style={{lineHeight: 40, fontSize: 20, marginTop: 10}}>
          {lastMessage != undefined ? lastMessage.text : ""}
        </Text>
      </View>
    </View>

    <Text style={{lineHeight: 40, fontSize: 20, marginRight: 30 }}>{lastMessage != undefined ? getCreateTime(lastMessage.createdAt) : ""}</Text>
  </TouchableOpacity>
);

const getCreateTime = (createAt) => {
  const today = new Date();
  // 今日なら時間、一週間以内なら曜日、今年なら月日、それ以前なら年月日
  let format = 'hh:mm';
  format = format.replace(/hh/g, createAt.getHours());
  format = format.replace(/mm/g, createAt.getMinutes());
  return format;
}

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
    backgroundColor: 'lavender'
  },
  bordered: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
    paddingVertical: 10,
  },
})

export { ChatTabScreen };