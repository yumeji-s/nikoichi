import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { TabNavigator } from './src/navigators/TabNavigator'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()


const App = () => {
  return [
    <NavigationContainer key={"Register"}>
      <TabNavigator/>
    </NavigationContainer>
  ]
}

export default App
