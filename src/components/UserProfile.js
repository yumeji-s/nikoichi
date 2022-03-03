import React from 'react';
import { Avatar, Box, VStack, HStack, Text, View } from 'native-base';

import { getProfileItems } from '../text/ProfileText';

const ProfileImages = ({ item }) => {
  return (
    <View alignSelf="center">
      {item.imgURL != '' && <Avatar size="xl" source={{uri: item.imgURL}} activeOpacity={0.7} key={item.imgURL} />}
      {item.imgURL == '' && <Avatar size='xl' icon={{name: 'user', color: 'white', type: 'font-awesome'}}
          containerStyle={{backgroundColor: "gray"}} activeOpacity={0.7} key={item.imgURL} />}
    </View>
  );
}

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
const Item = ( {title, val} ) => {
  return (
    <HStack
      paddingLeft={4}
      paddingRight={4}
      paddingY={5}
      alignItems="center"
      justifyContent='space-between'>

      <Text fontSize='sm' bold color='#999' noOfLines={2}>
        {title}
      </Text>
      <Text fontSize='sm' bold color='#999' noOfLines={2}>
        {val}
      </Text>

    </HStack>
  );
};

// 自己紹介文
const Introduction = ( {introduction} ) => {

  return (
    <VStack space={4} paddingY={4}>   

      <HStack paddingX={4}>
        <Text fontSize="2xl" bold color="gray.500">
          自己紹介
        </Text>
      </HStack>

      <HStack>
        <Text fontSize="lg" bold color="gray.500" w="100%" lineHeight="25" bg="white" paddingLeft={5} borderRadius={5}>
          {introduction != '' ? introduction : '自己紹介文が設定されていません'}
        </Text>
      </HStack>

      
    </VStack>
  );
}

const ProfileList = ( {user} ) => {
  
  const items = getProfileItems(user);
  const children = items.map((item, index) => {
    if(item.val){
      return (<Item key={index} title={item.title} val={item.val} />);
    }
  });
  return (
    <Box>
      <Section title="プロフィール" children={children} />
    </Box>
  );
}

export { Introduction, ProfileList, ProfileImages };