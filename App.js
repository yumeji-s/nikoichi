import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { TabNavigator } from './src/navigators/TabNavigator'
import { createStackNavigator } from '@react-navigation/stack'
import ignoreWarnings from 'react-native-ignore-warnings';

const Stack = createStackNavigator()
ignoreWarnings('Setting a timer');    // 必要のない警告を無視

const App = () => {
  return [
    <NavigationContainer key={"Register"}>
      <TabNavigator/>
    </NavigationContainer>
  ]
}

export default App