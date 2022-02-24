import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { TabNavigator } from './src/navigators/TabNavigator'
import { createStackNavigator } from '@react-navigation/stack'
import ignoreWarnings from 'react-native-ignore-warnings';
import { SSRProvider } from '@react-aria/ssr';

const Stack = createStackNavigator()
// ignoreWarnings('Setting a timer');    // 必要のない警告を無視
LogBox.ignoreLogs([
  '[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!',     // ライブラリのどっかに書いてあって非表示にするしかないよ
  'Setting a timer',              // expo と firebase 使ってると絶対出るよ、今のところ非表示にしとくしかないよ
  'AsyncStorage has been',        // AsyncStorageそのうち置き換わるよ
]);

const App = () => {

  

  return [
    <SSRProvider key='provider'>
      <NavigationContainer key='Register'>
        <TabNavigator/>
      </NavigationContainer>
    </SSRProvider>
  ]
}

export default App
