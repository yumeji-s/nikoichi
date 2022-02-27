import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native';
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
import { ProfileSettings } from '../components/ProfileSettings'

const Stack = createStackNavigator()

const HomeStackNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={SwipeScreen}
      options={{
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
        headerBackTitleVisible: false,
        headerShown: false,
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
        headerBackTitleVisible: false,
        headerShown: false,
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
        headerTitleAlign: 'center',
        headerTitle: '',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerStyle: {
          height: 30,
        },
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
        headerStyle: {
          height: 70,
        },
        headerRight: () => (
          <ProfileSettings />
        ),
        headerRightContainerStyle: {
          alignItems: 'flex-end',
          paddingTop: 10,
          paddingRight: 10,
        }
        
      }}
    />
  </Stack.Navigator>
)





// 親タブ
const ParentTab = createBottomTabNavigator();
const ChildTab = createMaterialTopTabNavigator();

const UserTabs = () => {
  return (
    <ChildTab.Navigator
      initialRouteName="bestUser"
      screenOptions={({ route }) => ({
        "tabBarStyle": [
          {
            "display": "flex",
          },
          null
        ]
      })}
    >
      <ChildTab.Screen name="bestUser" options={{ tabBarLabel: 'おすすめ' }} component={HomeStackNavigator} />
      <ChildTab.Screen name="fromPartner" options={{ tabBarLabel: '相手から' }} component={FromPartnerStackNavigator} />
    </ChildTab.Navigator>
  );
}

const UserStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      component={UserTabs}
      options={
        {
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTitle: '',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            height: 30,
          },
        }
        
      }
    />
  </Stack.Navigator>
)

const ChatTabs = () => {
  return (
    <ChildTab.Navigator
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
      <ChildTab.Screen name="matchUser" options={{ tabBarLabel: 'マッチした人' }} component={MatchUserStackNavigator} />
      <ChildTab.Screen name="chatRooms" options={{ tabBarLabel: 'メッセージ' }} component={ChatStackNavigator} />
    </ChildTab.Navigator>
  );
}

const ChatNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      component={ChatTabs}
      options={{
        headerTitle: 'やりとり',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          height: 70,
        },
      }}
    />
  </Stack.Navigator>
)

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
              return focused ? <Ionicons name="home" size={24} /> : <Ionicons name="home-outline" size={24} />;
            case 'SearchTab':
              return focused ? <Ionicons name="compass" size={24} /> : <Ionicons name="compass-outline" size={24} />;
            case 'ChatTab':
              return focused ? <Ionicons name="chatbubble-ellipses" size={24} /> : <Ionicons name="chatbubble-ellipses-outline" size={24} />;
            case 'ProfTab':
              return focused ? <Ionicons name="person-circle" size={24} /> : <Ionicons name="person-circle-outline" size={24} />;
          }
        },
        "headerShown": false,
        "tabBarShowLabel": false,
        "tabBarStyle": [
          {
            "display": "flex",
          },
          null
        ]
      })}
    >
      <ParentTab.Screen name="bestUsersTab" component={UserStackNavigator} />
      <ParentTab.Screen name="SearchTab" component={SearchStackNavigator} />
      <ParentTab.Screen name="ChatTab" component={ChatNavigator} />
      <ParentTab.Screen name="ProfTab" component={ProfileNavigator} />
    </ParentTab.Navigator>
  )
}


export { TabNavigator }
