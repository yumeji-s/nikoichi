import React, { useState, useEffect } from 'react';
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


const ChatTabScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([])

  useEffect(() => getChatList(), [])

  const getChatList = () => {
    const userList = [{
      uid: 1,
      name: "浜辺　美波",
      avatar: "",
    },{
      uid: 2,
      name: "今田　美桜",
      avatar: "",
    }]
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
      placeholder="Search messages"
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
    onPress={() =>
      navigation.navigate('Chatroom', {
        id: user.uid,
        name: user.name,
        avatar: user.avatar,
      })
    }
  >
    <View style={styles.flexify}>
      <Avatar rounded source={{ uri: '../../assets/minami.jpg' }} />
      <View style={{ marginLeft: 10 }}>
        <Text h4 style={{ fontWeight: "600" }}>
          {user.name}
        </Text>
        {/* <Text>Nice to meet you too!</Text> */}
      </View>
    </View>

    {/* <Text>Nov 12</Text> */}
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