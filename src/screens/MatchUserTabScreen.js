import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet } from 'react-native';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Text, Card } from 'react-native-elements';
import { getDocs, collection } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';


const MatchUserTabScreen = ({ navigation, user }) => {

  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => getChatList(), [])

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

    const matchingUserRef = collection(firestore, `users`);
    const matchingUserSnap = await getDocs(matchingUserRef);

    let userList = [];
    matchingUserSnap.docs.forEach((doc) => {
      const i = matchingList.indexOf(doc.id);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.childContainer}>
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
      <Card.Title style={styles.titleStyle}>マッチしたユーザーがいません...</Card.Title>
      <Card.Divider />
      <Text style={styles.textStyle}>あなたからも積極的にいいねをすればマッチング率アップ！</Text>
    </Card>
  </View>
);

const ListItem = ({ navigation, user }) => (
  <TouchableOpacity
    style={[styles.flexify, styles.bordered]}
    onPress={() => {navigation.navigate('Chatroom', {...user})}}
  >
    <View style={{ width: '40%' }}>
      <Card>
        <Card.Title>{user.name}</Card.Title>
        <Card.Divider />
        <Card.Image
          style={{ padding: 0 }}
          resizeMode="cover"
          source={{ uri : user.imgURL ? user.imgURL : undefined }} 
        />
        <Text style={{ marginBottom: 10 }}>{user.introduction}</Text>
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

export { MatchUserTabScreen };