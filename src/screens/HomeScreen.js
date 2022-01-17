import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, NativeBaseProvider } from 'native-base'; 
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  
  const navigation = useNavigation();
  const [text, setText] = useState('');

  const onTweet = useCallback((text) => {
    console.info(`tweet: ${text}`)
  }, []);

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
        <View style={styles.actionBar}>
          <Button style={styles.button} onPress={() => navigation.navigate('Sub')}>sub画面へ</Button>
        </View>
        <TextInput style={styles.input} multiline={true} onChangeText={value => setText(value)}/> 
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    alignContent: 'center',
  },
  actionBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    padding: 12,
    borderRadius: 50,
    backgroundColor: 'rgb(29, 161, 242)',
  },
  tweetButtonText: {
    color: '#ffffff',
  },
  input: {
    height: 400,
    backgroundColor: '#f8f8f8',
    padding: 12,
  },
})

export {HomeScreen};
