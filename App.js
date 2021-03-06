import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { TabNavigator } from './src/navigators/TabNavigator'
import { createStackNavigator } from '@react-navigation/stack'
import { SSRProvider } from '@react-aria/ssr';

const Stack = createStackNavigator()

// 必要ない警告を無視
LogBox.ignoreLogs([
  '[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!',     // ライブラリのどっかに書いてあって非表示にするしかないよ
  'Setting a timer',              // expo と firebase 使ってると絶対出るよ、今のところ非表示にしとくしかないよ
  'AsyncStorage has been',        // AsyncStorageそのうち置き換わるよ
  'expo-permissions is now deprecated',        // 代替メソッドがあるからあとで置き換える
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
