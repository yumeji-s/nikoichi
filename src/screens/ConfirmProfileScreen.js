import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { View, Text, NativeBaseProvider, ScrollView, Pressable, Menu, Modal, HStack } from 'native-base'; 
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Introduction, ProfileImages, ProfileList } from '../components/UserProfile';

const ConfirmProfileScreen = ({ route, navigation }) => {

  const { item } = route.params;
  const [showModal, setShowModal] = useState(true);

  const close = () => {
    setShowModal(false);
    navigation.goBack();
  }

  return (
    <NativeBaseProvider>
      <Modal isOpen={showModal} onClose={() => close()} w={Dimensions.get('window').width} h={Dimensions.get('window').height}  bgColor="blue.300">
        <View style={styles.root}>
          <ScrollView h="80" _contentContainerStyle={{
            px: "20px",
            mb: "4",
            minW: "72"
          }}>
            <HStack justifyContent='space-between' paddingTop={4}>
              <Pressable onPress={() => close() }>
                <Ionicons name='close' size={30} />
              </Pressable>

              {/* <Menu w="190" trigger={triggerProps => {
                return (
                  <Pressable {...triggerProps} style={{backgroundColor: 'red'}}>
                    <Ionicons name='ellipsis-horizontal' size={24} />
                  </Pressable>
                );}
              }>
                <Menu.Item>問題を報告する</Menu.Item>
              </Menu> */}
            </HStack>

            <View style={styles.userName}>
              <Text fontSize='2xl'>{item.name}</Text>
            </View>

            <ProfileImages item={item}/>
            <Introduction introduction={item.introduction} />
            <ProfileList user={item} />
          </ScrollView>
        </View>
      </Modal>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    alignContent: 'center',
  },
  userName: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
});

export {ConfirmProfileScreen}
