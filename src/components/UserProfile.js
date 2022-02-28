import React from 'react';
import { Avatar, Box, VStack, HStack, Text, View } from 'native-base';

const ProfileImages = ({ item }) => {
  return (
    <View alignSelf="center">
      {item.uri && <Avatar size="xl" source={{uri: item.uri}} activeOpacity={0.7} key={item.uri} />}
      {!item.uri && <Avatar size='xl' icon={{name: 'user', color: 'white', type: 'font-awesome'}}
          containerStyle={{backgroundColor: "gray"}} activeOpacity={0.7} key={item.uri} />}
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
  const items = [
    {
      key: 'age',
      title: '年齢',
      val: user.age,
    },
    {
      key: 'address',
      title: '居住地',
      val: user.address,
    },
    {
      key: 'workplace',
      title: '勤務地',
      val: user.workplace,
    },
    {
      key: 'birthplace',
      title: '出身地',
      val: user.birthplace,
    },
    {
      key: 'bloodtype',
      title: '血液型',
      val: user.bloodtype,
    },
    {
      key: 'height',
      title: '身長',
      val: user.height,
    },
    {
      key: 'body',
      title: '体型',
      val: user.body,
    },
    {
      key: 'background',
      title: '学歴',
      val: user.background,
    },
    {
      key: 'income',
      title: '年収',
      val: user.income,
    },
    {
      key: 'job',
      title: '仕事',
      val: user.job,
    },
    {
      key: 'holiday',
      title: '休日',
      val: user.holiday,
    },
    {
      key: 'marriagehistory',
      title: '結婚歴',
      val: user.marriagehistory,
    },
    {
      key: 'children',
      title: '子供の有無',
      val: user.children,
    },
    {
      key: 'cigarette',
      title: '煙草',
      val: user.cigarette,
    },
    {
      key: 'alcohol',
      title: 'お酒',
      val: user.alcohol,
    },
    {
      key: 'housemate',
      title: '一緒に住んでいる人',
      val: user.housemate,
    },
    {
      key: 'meet',
      title: '出会うまでの希望',
      val: user.meet,
    },
    {
      key: 'datecost',
      title: '初回デート費用',
      val: user.datecost,
    },
    {
      key: 'marriage',
      title: '結婚に対する意思',
      val: user.marriage,
    },
  ];
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