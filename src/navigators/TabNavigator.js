import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import { HomeScreen } from '../screens/HomeScreen'
import { SearchTabScreen } from '../screens/SearchTabScreen'
import { SwipeScreen } from '../screens/SwipeScreen'
import { ChatRoomScreen } from '../screens/ChatRoomScreen'
import { ChatTabScreen } from '../screens/ChatTabScreen'

const Stack = createStackNavigator()

const HomeStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
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

const AppFirstStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      component={HomeScreen}
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
        else if (route.name === 'UserTab') {
          return <Ionicons name="ios-compass-outline" size={24} />
        }
        else if (route.name === 'AppTab') {
          return <Ionicons name="person-circle-outline" size={24} />
        }
        else if (route.name === 'ChatTab') {
          return <Ionicons name="chatbubble-ellipses-outline" size={24} />
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
    <ParentTab.Screen name="UserTab" component={SearchStackNavigator} />
    <ParentTab.Screen name="ChatTab" component={ChatStackNavigator} />
    <ParentTab.Screen name="AppTab" component={AppFirstStackNavigator} />
  </ParentTab.Navigator>
)

export default TabNavigator
