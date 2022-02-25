import React, { useState } from 'react';
import { Box, Button, Input, FormControl, Modal, VStack, HStack, Text, TextArea, ScrollView } from 'native-base';
import { getSelect, updateProfile } from '../components/ProfileSelect';

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
      
      <VStack style={{width: '15%'}}>
        <Text fontSize='lg' bold color='#999' noOfLines={2}>
          {title}
        </Text>
      </VStack>
      <Box style={{width: '85%'}}>
        {select}
      </Box>

    </HStack>
  );
};

// 自己紹介文
export const Introduction = ( {introduction} ) => {
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
          <Modal.Body size="full" bgColor="amber.400">
            <ScrollView>
              <TextArea variant='unstyled' size="full" minH="1300" fontSize="xl" bgColor="amber.100"
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






// 引数のuserにプロフィール情報をすべて入れておく、なかったら "タップして設定" を入れる




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
  const children = items.map((item, index) => (
    <Item key={index} title={item.title} select={getSelect(item.key, item.val)} />
  ));
  return (
    <Box>
      <Section title="プロフィール" children={children} />
    </Box>
  );
}

export { ProfileList };