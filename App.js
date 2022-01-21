import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { TabNavigator } from './src/navigators/TabNavigator'
import { createStackNavigator } from '@react-navigation/stack'
import { onAuthStateChanged } from 'firebase/auth'

import { LoginScreen } from './src/screens/LoginScreen'
import { RegisterScreen } from './src/screens/RegisterScreen'
import { auth } from './firebase'

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

const App = () => {
  return [
    <NavigationContainer key={"Register"}>
      { userInfo() ? ( 
        <TabNavigator/>
        ) : ( 
        <>
          <Stack.Navigator  initialRouteName="Main">
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
        </>
        )
      }
    </NavigationContainer>
  ]
}

export default App
