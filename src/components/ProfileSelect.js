import React from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';


const updateProfile = (key, data) => {
  const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
  updateDoc(userRef, {
    [key]: data,
  }, { capital: true });
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#789',
    borderRadius: 4,
    color: '#789',
    paddingRight: 30,
    width: "50%",
    marginLeft: 30
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#000',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    width: "50%",
    backgroundColor:'#aaa'
  },
  iconContainer: {
    display: "none",
  },
});

export const birthSelect = () => {

}

const getPlaceholder = (item) => {
  return {
    label: item != undefined ? item : "タップして設定",
    value: item != undefined ? item : "タップして設定",
  };
}

export const addressSelect = (user) => {
  console.log(user.address);
    return (
        <RNPickerSelect
            onValueChange={(value) => {
              updateProfile('address', value);
            }}
            placeholder={getPlaceholder(user.address)}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            items={[
                { label: '北海道', value: '北海道' },
                { label: '青森県', value: '青森県' },
                { label: '岩手県', value: '岩手県' },
            ]}
        />
    );
};

export const workplaceSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const birthplaceSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const bloodtypeSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const heightSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const bodySelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const backgroundSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const incomeSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const jobSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const holidaySelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const marriagehistorySelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const childrenSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const cigaretteSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const alcoholSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const housemateSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const meetSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const datecostSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};

export const marriageSelect = () => {
  return (
      <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
              { label: 'Football', value: 'football' },
              { label: 'Baseball', value: 'baseball' },
              { label: 'Hockey', value: 'hockey' },
          ]}
      />
  );
};
