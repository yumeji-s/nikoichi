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
import { Avatar, Input, Overlay, Icon, Card } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons  } from '@expo/vector-icons';
import { doc, setDoc, getDoc, getDocs, updateDoc, collection, query, where, limit } from 'firebase/firestore';

import { auth, firestore, storage } from '../../firebase';
import { LoadingScreen } from './LoadingScreen';


const MatchUserTabScreen = () => {
  const navigation = useNavigation();
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
        <Search />
        {users.map((user, index) => (
          <ListItem key={index} user={user} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const Search = () => (
  <View
    style={[styles.flexify, { marginHorizontal: 5, marginTop: 10 }]}
  >
    <Input
      placeholder="Search Match Users"
      leftIcon={<Icon name="search" size={24} color="gray" />}
      inputContainerStyle={{ borderBottomWidth: 0 }}
      // onChangeText={}
    />

    <Icon name="rowing" size={24} color="gray" />
  </View>
)

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
          source={{ uri: user.imgURL }}
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

export { MatchUserTabScreen };