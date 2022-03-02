import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore';

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
import { ConfirmProfileScreen } from '../screens/ConfirmProfileScreen'
import { auth, firestore } from '../../firebase'
import { ProfileSettings } from '../components/ProfileSettings'

const Stack = createStackNavigator()

const HomeStackNavigator = ({ user }) => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    >
      {(props) => <SwipeScreen {...props} user={user} />}
    </Stack.Screen>
    <Stack.Screen
      name="Confirm"
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    >
      {(props) => <ConfirmProfileScreen {...props} user={user} />}
    </Stack.Screen>
  </Stack.Navigator>
)

const FromPartnerStackNavigator = ({ user }) => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    >
      {(props) => <FromPartnerScreen {...props} user={user} />}
    </Stack.Screen>
    <Stack.Screen
      name="Confirm"
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    >
      {(props) => <ConfirmProfileScreen {...props} user={user} />}
    </Stack.Screen>
  </Stack.Navigator>
)

const MatchUserStackNavigator = ({ user }) => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    >
      {(props) => <MatchUserTabScreen {...props} user={user} />}
    </Stack.Screen>
    <Stack.Screen
      name="Confirm"
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    >
      {(props) => <ConfirmProfileScreen {...props} user={user} />}
    </Stack.Screen>
  </Stack.Navigator>
)

const ChatStackNavigator = ({ user }) => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    >
      {(props) => <ChatTabScreen {...props} user={user} />}
    </Stack.Screen>
    <Stack.Screen
      name="Chatroom"
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    >
      {(props) => <ChatRoomScreen {...props} user={user} />}
    </Stack.Screen>
  </Stack.Navigator>
)

const SearchStackNavigator = ({ user }) => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
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
    >
    {(props) => <SearchTabScreen {...props} user={user} />}
    </Stack.Screen>
  </Stack.Navigator>
)

const ProfileNavigator = ({ user }) => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
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
    >
      {(props) => <ProfileScreen {...props} user={user} />}
    </Stack.Screen>
  </Stack.Navigator>
)


// 親タブ
const ParentTab = createBottomTabNavigator();
const ChildTab = createMaterialTopTabNavigator();

const UserTabs = ({ user }) => {
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
      <ChildTab.Screen name="bestUser" options={{ tabBarLabel: 'おすすめ' }}>
        {(props) => <HomeStackNavigator {...props} user={user} />}
      </ChildTab.Screen> 
      <ChildTab.Screen name="fromPartner" options={{ tabBarLabel: '相手から' }}>
        {(props) => <FromPartnerStackNavigator {...props} user={user} />}
      </ChildTab.Screen> 
    </ChildTab.Navigator>
  );
}

const UserStackNavigator = ({ user }) => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
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
    >
      {(props) => <UserTabs {...props} user={user} />}
    </Stack.Screen>
  </Stack.Navigator>
)

const ChatTabs = ({ user }) => {
  return (
    <ChildTab.Navigator
      initialRouteName="chatRooms"
      screenOptions={({ route }) => ({
        'tabBarStyle': [
          {
            'display': 'flex',
          },
          null
        ]
      })}
    >
      <ChildTab.Screen name="matchUser" options={{ tabBarLabel: 'マッチング' }}>
        {(props) => <MatchUserStackNavigator {...props} user={user} />}
      </ChildTab.Screen> 
      <ChildTab.Screen name="chatRooms" options={{ tabBarLabel: 'メッセージ' }}>
        {(props) => <ChatStackNavigator {...props} user={user} />}
      </ChildTab.Screen>
    </ChildTab.Navigator>
  );
}

const ChatNavigator = ({ user }) => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen
      name="Main"
      options={{
        headerTitle: 'やりとり',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        
        headerStyle: {
          height: 70,
        },
      }}
    >
      {(props) => <ChatTabs {...props} user={user} />}
    </Stack.Screen>
  </Stack.Navigator>
)

const userInfo = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ログイン情報の取得
  useEffect(() => {
    // ログイン状況の監視
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userInfo = await getCurrentUser(user)
        setUser(userInfo)
      }else{
        setUser(null)
      }
      setLoading(false)
    })
    // 監視の解除
    return () => unsubscribe()
  }, []);
  return [user, loading]
}

const getCurrentUser = async (user) => {

  // 最初のレンダリング時にアイコンなどを取得
  const userRef = doc(firestore, `users/${user.uid}`);
  const snapShot = await getDoc(userRef);
  return {
    ...snapShot.data()
  }
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
              headerTitle: 'ログイン',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen 
            name="Register"
            component={RegisterScreen}
            options={{
              headerTitle: 'ユーザー登録',
              headerTitleAlign: 'center',
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
      screenOptions={({ navigation, route }) => ({
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
      <ParentTab.Screen name="bestUsersTab">{(props) => <UserStackNavigator {...props} user={user} />}</ParentTab.Screen> 
      <ParentTab.Screen name="SearchTab">{(props) => <SearchStackNavigator {...props} user={user} />}</ParentTab.Screen> 
      <ParentTab.Screen name="ChatTab">{(props) => <ChatNavigator {...props} user={user} />}</ParentTab.Screen> 
      <ParentTab.Screen name="ProfTab">{(props) => <ProfileNavigator {...props} user={user} />}</ParentTab.Screen> 
    </ParentTab.Navigator>
  )
}


export { TabNavigator }
