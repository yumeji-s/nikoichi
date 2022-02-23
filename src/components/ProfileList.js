import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Box, VStack, HStack, Text, Icon  } from 'native-base'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as mySelect from '../components/ProfileSelect';

// itemをまとめておく
const Section = ( {title, children} ) => {
  return (
    <VStack space={4} paddingY={4}>   
      {title && (
        <HStack paddingX={4} alignSelf="center">
          <Text fontSize="md" bold color="gray.500">
            {title}
          </Text>
        </HStack>
      )}
      
      <VStack borderRadius={10} backgroundColor="white">
        {children}
      </VStack>
    </VStack>
  );
 };

// 一つ一つの項目
const Item = ( {title, right, arrow = true, user} ) => {
  return (
    <Box >
      <HStack
        paddingLeft={4}
        paddingRight={0}
        paddingY={5}
        alignItems="center"
        justifyContent="space-between">
        
        <VStack>
          {title && (
            <Text fontSize="md" bold color="black">
              {title}
            </Text>
          )}
        </VStack>
        
        <HStack space={0} paddingLeft={0} paddingRight={4}>
          
          {right}

          {arrow && (
            <Icon
              alignSelf="center"
              size="md"
              as={<Ionicons name="chevron-forward" />}
              textAlign="right"
            />
          )}
        </HStack>        
      </HStack>
      {right}
    </Box>
  );
};


// 引数のuserにプロフィール情報をすべて入れておく、なかったら "タップして設定" を入れる




const ProfileList = ( {user} ) => {
  const items = [
    // {
    //   title: "年齢",
    //   right: user.age,
    //   arrow: false,
    //   func: mySelect.noTouch,
    // },
    {
      title: "居住地",
      right: mySelect.addressSelect,
      arrow: true,
    },
    // {
    //   title: "勤務地",
    //   right: user.workplace,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "出身地",
    //   right: user.birthplace,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "血液型",
    //   right: user.bloodtype,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "身長",
    //   right: user.height,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "体型",
    //   right: user.body,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "学歴",
    //   right: user.background,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "年収",
    //   right: user.income,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "仕事",
    //   right: user.job,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "休日",
    //   right: user.holiday,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "結婚歴",
    //   right: user.marriagehistory,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "子供の有無",
    //   right: user.children,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "煙草",
    //   right: user.cigarette,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "お酒",
    //   right: user.alcohol,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "一緒に住んでいる人",
    //   right: user.housemate,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "出会うまでの希望",
    //   right: user.meet,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "初回デート費用",
    //   right: user.datecost,
    //   arrow: true,
    //   func: noTouch,
    // },
    // {
    //   title: "結婚に対する意思",
    //   right: user.marriage,
    //   arrow: true,
    //   func: noTouch,
    // },
  ];
  const children = items.map((item, index) => (
    <Item key={index} title={item.title} right={item.right(user)} arrow={item.arrow} />
  ));
  return (
    <Box>
      <Section title="プロフィール" children={children} />
    </Box>
  );
}

export { ProfileList };