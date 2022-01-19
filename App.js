import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import TabNavigator from './src/navigators/TabNavigator'

const App = () => {
  return [
    <NavigationContainer key={"container"}>
      <TabNavigator/>
    </NavigationContainer>
  ]
}

export default App
