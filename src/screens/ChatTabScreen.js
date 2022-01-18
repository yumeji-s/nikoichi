import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Avatar, Input, Overlay, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import Images from '../../assets/index';

const ChatTabScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([])

  useEffect(() => getChatList(), [])

  const getChatList = () => {
    const userList = [{
      uid: 1,
      name: "浜辺　美波",
      avatar: Images.minami,
    },{
      uid: 2,
      name: "今田　美桜",
      avatar: Images.mio,
    }]
    setUsers(userList);
  }

  return (
    <SafeAreaView>
      <Header navigation={navigation} />
      <ScrollView style={styles.container} dataSet={{ media: styles.container }}>
        <Search />
        {users.map((user, index) => (
          <ListItem key={index} user={user} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const Header = ({ navigation }) => {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')

  const toggleOverlay = () => {
    setVisible(!visible)
  }

  const addFriend = (email) => {
    console.log(email)
  }

  return (
    <View style={styles.headerWrapper} dataSet={{ media: styles.headerWrapper }}>
      <View
        style={[
          styles.container,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}
        dataSet={{ media: styles.container }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="rowing" size={24} color="gray" />
          </TouchableOpacity>

          <Text style={{ fontWeight: "500", marginLeft: 20 }} h4>
            Messaging
          </Text>
        </View>

        <View style={styles.flexify}>
          <TouchableOpacity style={{ marginRight: 40 }}>
            <Icon name="rowing" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleOverlay}>
            <Icon name="edit" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View
          style={[styles.flexify, { marginHorizontal: 5, marginTop: 10 }]}
          dataSet={{ media: styles.flexify }}
        >
          <Input
            placeholder="Add user by email..."
            leftIcon={<Icon name="user" size={18} color="gray" />}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={() => addFriend(email)}
            value={email}
          />
        </View>
      </Overlay>
    </View>
  )
}

const Search = () => (
  <View
    style={[styles.flexify, { marginHorizontal: 5, marginTop: 10 }]}
    dataSet={{ media: styles.flexify }}
  >
    <Input
      placeholder="Search messages"
      leftIcon={<Icon name="search" size={24} color="gray" />}
      inputContainerStyle={{ borderBottomWidth: 0 }}
    />

    <Icon name="rowing" size={24} color="gray" />
  </View>
)

const ListItem = ({ navigation, user }) => (
  <TouchableOpacity
    style={[styles.flexify, styles.bordered]}
    dataSet={{ media: styles.flexify }}
    onPress={() =>
      navigation.navigate('ChatRoomScreen', {
        id: user.uid,
        name: user.name,
        avatar: user.avatar,
      })
    }
  >
    <View style={styles.flexify} dataSet={{ media: styles.flexify }}>
      <Avatar rounded source={{ uri: user.avatar }} />
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
  container: {
    paddingHorizontal: 20,
    height: '100%',
    width: '75%',
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