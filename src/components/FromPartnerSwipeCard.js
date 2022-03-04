import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { Text, Card, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, collection, updateDoc } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const Deck = ({ data }) => {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  
    const position = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (event, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            forceSwipe('right');
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            forceSwipe('left');
          } else {
            resetPosition();
          }
        },
      })
    ).current;
  
    const forceSwipe = (direction) => {
      const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
      Animated.timing(position, {
        toValue: { x, y: 0 },
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: false,
      }).start(() => onSwipeComplete(direction));
    };
    
    const [index, setIndex] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState('');
    
    useEffect(() => {
      const partner = data[index - 1];
      if(swipeDirection === 'right'){
        onSwipeRight(partner);
      }else if(swipeDirection === 'left'){
        onSwipeLeft(partner);
      }
    },[index]);
  
    const onSwipeComplete = (direction) => {
      position.setValue({ x: 0, y: 0 });
      setSwipeDirection(direction);
      setIndex(prevIndex => prevIndex + 1);
    };
  
    const resetPosition = () => {
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    };
  
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });
  
  
    const onSwipeRight = async (partner) => {

      // マッチング済みに追加
      const matchingRef = collection(firestore, `matching/${auth.currentUser.uid}/${auth.currentUser.uid}`);
      await setDoc(doc(matchingRef, partner.uid), {
        chatName : auth.currentUser.uid + partner.uid,
      },{ capital: true },{ merge: true });
      const partnerRef = collection(firestore, `matching/${partner.uid}/${partner.uid}`);
      await setDoc(doc(partnerRef, auth.currentUser.uid), {
        chatName : auth.currentUser.uid + partner.uid,
      },{ capital: true },{ merge: true });
  
      // リクエストをfalseに
      const requestRef = doc(firestore, `request/${auth.currentUser.uid}/${auth.currentUser.uid}/${partner.uid}`);
      await updateDoc(requestRef, {
        request : false,
      },{ capital: true });
    };
  
    const onSwipeLeft = async (partner) => {
      
      // 嫌いの時、表示されないようにする
      const requestRef = doc(firestore, `request/${auth.currentUser.uid}/${auth.currentUser.uid}/${partner.uid}`);
      await updateDoc(requestRef, {
        request : false,
      },{ capital: true });
      
    };
  
    return (
      <>
        {index >= data.length && <RenderNoMoreCards />}
        {data.map((item, i) => {
            if (i < index) {
              return null;
            }
  
            if (i === index) {
              return (
                <Animated.View
                  key={item.uid}
                  style={[
                    {
                      ...position.getLayout(),
                      transform: [{ rotate }],
                      zIndex: 1,
                      elevation: (Platform.OS === 'android') ? 50 : 0
                    },
                    styles.cardStyle,
                  ]}
                  {...panResponder.panHandlers}
                >
                  <RenderCards item={item} />
                </Animated.View>
              );
            }
  
            return (
              <Animated.View
                key={item.uid}
                style={[styles.cardStyle, { top: 0 }]}
              >
                <RenderCards item={item} />
              </Animated.View>
            );
          })
          .reverse()}
      </>
    );
  };
  
  const RenderCards = ({ item }) => {
    const navigation = useNavigation();
    return (
      <Card style={styles.cardStyle} key={item.uid}>
        <Card.Title style={styles.titleStyle}>{item.name}</Card.Title>
        <Card.Divider />
          {
            item.uri ? 
              <Card.Image source={{ uri: item.uri }} style={styles.imageStyle} resizeMode='cover'/> :
              <Card.Image source={require('../../assets/defaultUserIcon.png')} style={styles.imageStyle} resizeMode='cover'/>
          }
        <Card.Divider />
        <Text numberOfLines={1} style={styles.textStyle}>{item.introduction ? item.introduction : '自己紹介が設定されていません'}</Text>
        <Button buttonStyle={styles.buttonStyle} title="プロフィールを見る" onPress={() => {navigation.navigate('Confirm', { item: item })}} />
      </Card>
    );
  };
  
  const RenderNoMoreCards = () => {
    return (
      <Card style={styles.cardStyle}>
        <Card.Title style={styles.titleStyle}>おわり</Card.Title>
        <Card.Divider />
        <Text style={styles.textStyle}>あなたに興味があるユーザがいないようです！</Text>
        <Text style={styles.textStyle}>あなたからも積極的にいいねをすればマッチング率アップ！</Text>
      </Card>
    );
  };
  

  const styles = StyleSheet.create({
    cardStyle: {
      position: 'absolute',
      width: '100%',
      height: '95%',
      borderRadius: 50,
    },
    imageStyle: {
      width: '100%',
      height: SCREEN_HEIGHT - 350
    },
    titleStyle: {
      fontSize: 18
    },
    textStyle: {
      marginBottom: 10,
      fontSize: 16,
      lineHeight: 20,
      textAlign: 'center',
    },
    buttonStyle: {
      borderRadius: 50,
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
    },
});


export { Deck };