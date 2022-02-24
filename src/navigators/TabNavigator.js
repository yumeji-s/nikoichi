import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { onAuthStateChanged } from 'firebase/auth'

import { ChatRoomScreen } from '../screens/ChatRoomScreen'
import { ChatTabScreen } from '../screens/ChatTabScreen'
import { MatchUserTabScreen } from '../screens/MatchUserTabScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { SearchTabScreen } from '../screens/SearchTabScreen'
import { SwipeScreen } from '../screens/SwipeScreen'
import { FromPartnerScreen } from '../screens/FromPartnerScreen'
import { LoginScreen } from '../screens/LoginScreen'
import { RegisterScreen } from '../screens/RegisterScreen'
import { LoadingScreen } from '../screens/LoadingScreen'
import { auth } from '../../firebase'

const Stack = createStackNavigator()

const HomeStackNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={SwipeScreen}
      options={{
        headerTitle: 'メイン',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
)

const FromPartnerStackNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={FromPartnerScreen}
      options={{
        headerTitle: 'メイン',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
)

const MatchUserStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      component={MatchUserTabScreen}
      options={{
        headerTitle: 'やりとり',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        // headerShown: false,
      }}
    />
  </Stack.Navigator>
)

const ChatStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      component={ChatTabScreen}
      options={{
        headerTitle: 'やりとり',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        // headerShown: false,
      }}
    />
    <Stack.Screen
      name="Chatroom"
      component={ChatRoomScreen}
      options={{
        headerTitle: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
)

const SearchStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      component={SearchTabScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
)

const ProfileNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      component={ProfileScreen}
      options={{
        headerTitle: 'マイページ',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerRight: () => (
          <Ionicons name="settings-outline" size={24} onPress={() => {console.log("設定ボタンだよ")}} />// 設定ボタン押したらモーダル開かせる
        ),
      }}
    />
  </Stack.Navigator>
)





// 親タブ
const ParentTab = createBottomTabNavigator()
const UserTab = createMaterialTopTabNavigator();
const ChatTab = createMaterialTopTabNavigator();

const UserTabs = () => {
  return (
    <UserTab.Navigator
      initialRouteName="bestUser"
      screenOptions={({ route }) => ({
        "tabBarStyle": [
          {
            "display": "flex"
          },
          null
        ]
      })}
    >
      <UserTab.Screen name="bestUser" options={{ tabBarLabel: 'おすすめ' }} component={HomeStackNavigator} />
      <UserTab.Screen name="fromPartner" options={{ tabBarLabel: '相手から' }} component={FromPartnerStackNavigator} />
    </UserTab.Navigator>
  );
}

const ChatTabs = () => {
  return (
    <ChatTab.Navigator
      initialRouteName="chatRooms"
      screenOptions={({ route }) => ({
        "tabBarStyle": [
          {
            "display": "flex"
          },
          null
        ]
      })}
    >
      <ChatTab.Screen name="matchUser" options={{ tabBarLabel: 'マッチした人' }} component={MatchUserStackNavigator} />
      <ChatTab.Screen name="chatRooms" options={{ tabBarLabel: 'メッセージ' }} component={ChatStackNavigator} />
    </ChatTab.Navigator>
  );
}

const userInfo = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ログイン情報の取得
  useEffect(() => {
    // ログイン状況の監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      }else{
        setUser(null)
      }
      setLoading(false)
    })
    // 監視の解除
    return () => unsubscribe()
  }, []);
  return [user == null ? false : true, loading]
}

const TabNavigator = () => {

  const [user, loading] = userInfo();
  const [render, setRender] = useState(false);
  let count = false;

  if(loading){
    return <LoadingScreen/>
  }

  if(!user){
    count = true;
    return (
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )
  }

  if(count){
    setRender(reRender => !reRender);
  }

  // 初回登録した人
  if(auth.currentUser.metadata.creationTime == auth.currentUser.metadata.lastSignInTime){
    // プロフィール登録
    console.log(auth.currentUser.metadata.creationTime);
  }

  return (
    <ParentTab.Navigator
      initialRouteName="bestUsersTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          switch(route.name){
            case 'bestUsersTab':
              return <Ionicons name="home" size={24} />
            case 'SearchTab':
              return <Ionicons name="ios-compass-outline" size={24} />
            case 'ChatTab':
              return <Ionicons name="chatbubble-ellipses-outline" size={24} />
            case 'ProfTab':
              return <Ionicons name="person-circle-outline" size={24} />
          }
        },
        "headerShown": false,
        "tabBarShowLabel": false,
        "tabBarStyle": [
          {
            "display": "flex"
          },
          null
        ]
      })}
    >
      <ParentTab.Screen name="bestUsersTab" component={UserTabs} />
      <ParentTab.Screen name="SearchTab" component={SearchStackNavigator} />
      <ParentTab.Screen name="ChatTab" component={ChatTabs} />
      <ParentTab.Screen name="ProfTab" component={ProfileNavigator} />
    </ParentTab.Navigator>
  )
}

export { TabNavigator }
