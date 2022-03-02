import React, { useState } from 'react';
import { Box, Button, Input, FormControl, Modal, VStack, HStack, Text, TextArea, ScrollView } from 'native-base';

import { getSelect, updateProfile } from '../components/ProfileSelect';
import { getProfileItems } from '../text/ProfileText';

// itemをまとめておく
const Section = ( {title, children} ) => {
  return (
    <VStack space={4} paddingY={4}>

      <HStack paddingX={4}>
        <Text fontSize="xl" bold color="gray.500">
          {title}
        </Text>
      </HStack>
      
      <VStack borderRadius={10} backgroundColor="white">
        {children}
      </VStack>
    </VStack>
  );
};

// 一つ一つの項目
const Item = ( {title, select} ) => {
  return (
    <HStack
      paddingLeft={4}
      paddingRight={0}
      paddingY={5}
      alignItems="center"
      justifyContent='flex-start'>
      
      <VStack style={{width: '20%'}}>
        <Text fontSize='sm' bold color='#999' noOfLines={2}>
          {title}
        </Text>
      </VStack>
      <Box style={{width: '80%'}}>
        {select}
      </Box>

    </HStack>
  );
};

// 自己紹介文
const Introduction = ( { introduction } ) => {
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState(introduction);
  const [originIntroduction, setOriginIntroduction] = useState(value);

  const handleChange = text => {
    // 1000文字を超えたらアラート
    if(text.length > 1000){
      return;
    }
    setValue(text);
  };
  const cancelText = () => {
    setValue(originIntroduction);
    setShowModal(false);
  };
  const saveText = () => {
    updateProfile('introduction',value);
    setOriginIntroduction(value);
    setShowModal(false);
  };

  return (
    <VStack space={4} paddingY={4}>   

      <HStack paddingX={4}>
        <Text fontSize="2xl" bold color="gray.500">
          自己紹介
        </Text>
      </HStack>

      <HStack>
        <Text fontSize="lg" bold color="gray.500" w="100%" lineHeight="50" bg="white" paddingLeft={5} borderRadius={5} noOfLines={1} onPress={() => setShowModal(!showModal)}>
          {value != '' ? value : '自己紹介文を入力しましょう'}
        </Text>
      </HStack>

      <Modal isOpen={showModal} onClose={() => cancelText()} size="full">
        <Modal.Content size="full">
          <Modal.CloseButton />
          <Modal.Header>自己紹介</Modal.Header>
          <Modal.Body size="full" bgColor="amber.100">
            <ScrollView>
              <TextArea variant='unstyled' size="full" minH="1300" fontSize="xl"
                placeholder={value != '' ? value : '【記載する具体例】\n・趣味や休日にしていることは？\n・仕事の内容は？\n・どんな性格？'}
                value={value} onChangeText={handleChange}
              />
            </ScrollView>
          </Modal.Body>
          <Modal.Footer w="100%">
            <Text lineHeight="35">{value.length}文字／1000文字</Text>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme='blueGray' onPress={() => cancelText()}>
                キャンセル
              </Button>
              <Button onPress={() => saveText()}>
                保存
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </VStack>
  );
}

const ProfileList = ( {user} ) => {
  const items = getProfileItems(user);
  const children = items.map((item, index) => (
    <Item key={index} title={item.title} select={getSelect(item.key, item.val)} />
  ));
  return (
    <Box>
      <Section title="プロフィール" children={children} />
    </Box>
  );
}

export { Introduction, ProfileList };