import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeBaseProvider, View, Button, Input } from 'native-base'; 
import { useNavigation } from '@react-navigation/native';


const ChatTabScreen = () => {
  const navigation = useNavigation();
  return (
      <NativeBaseProvider>
        <View style={styles.root}>
          <Input style={styles.input} multiline={true} onChangeText={value => setText(value)}/> 
          <Button onPress={() => navigation.navigate('chatroom')}></Button>
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
    input: {
      height: 400,
      backgroundColor: '#f8f8f8',
      padding: 12,
    },
  })
  
  export {ChatTabScreen};
  