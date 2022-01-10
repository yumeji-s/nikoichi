import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen'
import UserScreen from '../screens/UserScreen'
import AppScreen from '../screens/SubScreen'
import SwipeScreen from '../screens/SwipeScreen'

const Stack = createStackNavigator()

const AppFirstStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      component={SwipeScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
)

const HomeStackNavigator = () => (
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
    <Stack.Screen
      name="Sub"
      component={UserScreen}
      options={{
        headerTitle: 'サブ',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
    />
    <Stack.Screen
      name="Sub2"
      component={AppScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
)

const UserStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      component={HomeScreen}
      options={{
        headerTitle: 'ホーム',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
    />
    <Stack.Screen
      name="Sub"
      component={UserScreen}
      options={{
        headerTitle: 'ユーザー',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
    />
    <Stack.Screen
      name="Sub2"
      component={AppScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
)

const Tab = createBottomTabNavigator()

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="HomeTab"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        if (route.name === 'HomeTab') {
          return <MaterialCommunityIcons name="home" size={24} />
        }
        else if (route.name === 'UserTab') {
          return <MaterialCommunityIcons name="account" size={24} />
        }
        else if (route.name === 'AppTab') {
          return <MaterialCommunityIcons name="fridge-top" size={24} />
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
    <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
    <Tab.Screen name="UserTab" component={UserStackNavigator} />
    <Tab.Screen name="AppTab" component={AppFirstStackNavigator} />
  </Tab.Navigator>
)

export default TabNavigator
