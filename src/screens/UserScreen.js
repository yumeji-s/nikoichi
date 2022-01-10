import { React } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, NativeBaseProvider } from 'native-base'; 
import { useNavigation } from '@react-navigation/native';

const UserScreen = () => {

  const navigation = useNavigation();

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
        <Text style={styles.message}>UserScreen</Text>
      </View>
      <Button onPress={() => navigation.navigate('Sub2')}>sub2へ</Button>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  message: {
    textAlign: 'center',
  },
  button: {
    
  },
})

export default UserScreen
