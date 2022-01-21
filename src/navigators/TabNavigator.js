import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { onAuthStateChanged } from 'firebase/auth'

import { ChatRoomScreen } from '../screens/ChatRoomScreen'
import { ChatTabScreen } from '../screens/ChatTabScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { SearchTabScreen } from '../screens/SearchTabScreen'
import { SwipeScreen } from '../screens/SwipeScreen'
import { auth } from '../../firebase'

const Stack = createStackNavigator()
const userInfo = () => {
  const [user, setUser] = useState('')
  const [loading, setLoading] = useState(true)

  // ログイン情報の取得
  useEffect(() => {
    // ログイン状況の監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      }else{
        setUser('')
      }
      setLoading(false)
    })
    // 監視の解除
    return () => unsubscribe()
  }, []);
  return user == '' ? false : true
}



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
        headerTitle: 'メイン',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
    />
  </Stack.Navigator>
)







// 親タブ
const ParentTab = createBottomTabNavigator()

const TabNavigator = () => (
  <ParentTab.Navigator
    initialRouteName="HomeTab"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        if (route.name === 'HomeTab') {
          return <Ionicons name="home" size={24} />
        }
        else if (route.name === 'SearchTab') {
          return <Ionicons name="ios-compass-outline" size={24} />
        }
        else if (route.name === 'ChatTab') {
          return <Ionicons name="chatbubble-ellipses-outline" size={24} />
        }
        else if (route.name === 'ProfTab') {
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
    <ParentTab.Screen name="HomeTab" component={HomeStackNavigator} />
    <ParentTab.Screen name="SearchTab" component={SearchStackNavigator} />
    <ParentTab.Screen name="ChatTab" component={ChatStackNavigator} />
    <ParentTab.Screen name="ProfTab" component={ProfileNavigator} />
  </ParentTab.Navigator>
)

export { TabNavigator }
