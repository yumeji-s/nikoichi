import React from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Icon } from 'native-base'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';
import { getItems, getPlaceholder } from '../text/ProfileText';


export const updateProfile = (key, data) => {
    if(auth.currentUser){
        const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
        updateDoc(userRef, {
            [key]: data,
        }, { capital: true });
    }
}

export const getSelect = (key, val) => {
    return (
        <RNPickerSelect
            onValueChange={(value) => {
                updateProfile(key, value);
            }}
            placeholder={getPlaceholder(val)}
            style={{...pickerSelectStyles}}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
                return key != 'age' ? (
                  <Icon
                    size="md"
                    as={<Ionicons name="chevron-forward" />}
                  />
                ) : null;
            }}
            items={getItems(key)}
            disabled={key == 'age'}
        />
    );
};



const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 20,
      paddingVertical: 12,
      paddingHorizontal: 10,
      // borderWidth: 1,
      // borderColor: '#789',
      // borderRadius: 4,
      color: 'black',
      paddingRight: 30,
      // minWidth: '100%',
      // maxWidth: '100%',
      marginLeft: 30,
      textAlign: 'right',
    },
    inputAndroid: {
      fontSize: 20,
      paddingHorizontal: 10,
      paddingVertical: 8,
      // borderWidth: 0.5,
      // borderColor: '#000',
      // borderRadius: 8,
      color: 'black',
      paddingRight: 50,
    //   backgroundColor:'#aaa',
      textAlign: 'right',
    },
    iconContainer: {
      top: 8,
      right: 10,
    },
    placeholder: {
      color: 'black',
      fontSize: 20,
    },
  });