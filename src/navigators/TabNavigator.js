import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { HomeScreen } from '../screens/HomeScreen'
import { SearchScreen } from '../screens/SearchScreen'
import { SwipeScreen } from '../screens/SwipeScreen'

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

const SearchStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      component={SearchScreen}
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
    <ParentTab.Screen name="HomeTab" component={HomeStackNavigator} />
    <ParentTab.Screen name="UserTab" component={SearchStackNavigator} />
    <ParentTab.Screen name="AppTab" component={AppFirstStackNavigator} />
  </ParentTab.Navigator>
)

export default TabNavigator
