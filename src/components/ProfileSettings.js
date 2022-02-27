import React, { useState } from 'react';
import { Button, Box, HStack, VStack, Modal, Text, ScrollView, NativeBaseProvider } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ProfileSettings = () => {

  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('logout');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <NativeBaseProvider>
      <Box>
        <Ionicons name="settings-outline" size={24} onPress={() => {setShowModal(true)}} />
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="full">
          <Modal.Content size="full">
            <Modal.CloseButton />
            <Modal.Header fontSize="2xl">設定</Modal.Header>
            <Modal.Body size="full" bgColor="gray.300">
              <ScrollView>
                <VStack space={4} paddingY={4}>
                  <HStack paddingX={4} justifyContent="space-between">
                    <Text fontSize="xl" bold color="gray.500">
                      ログアウト
                    </Text>
                    <Ionicons name="chevron-forward" size={24} onPress={() => handleLogout()} />
                  </HStack>
                </VStack>
              </ScrollView>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Box>
    </NativeBaseProvider>
  );
}
  