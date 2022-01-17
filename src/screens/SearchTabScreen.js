import { React } from 'react';
import { StyleSheet,Dimensions } from 'react-native';
import { View, Input, NativeBaseProvider, Icon } from 'native-base'; 
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons  } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SearchTabScreen = () => {

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
        <Input 
          LeftElement={
            <Icon as ={
              <MaterialIcons name='search'/>
            }/>
          }
          variant="filled"
          placeholder='Search' 
          style={styles.inputStyle}
          size='xl'>
        </Input>
      </View>
    </NativeBaseProvider>
  )
}

const INPUT_WIDTH = SCREEN_WIDTH / 30;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
  },
  inputStyle: {
    marginTop: 80,
    marginLeft: INPUT_WIDTH,
    marginRight: INPUT_WIDTH,

  },
})

export {SearchTabScreen}
