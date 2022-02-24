import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  Dimensions,
  PanResponder,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { Card, Button } from 'react-native-elements';
import { doc, setDoc } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
const IMAGE_HEIGHT = SCREEN_HEIGHT / 2;

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
  
  
    const onSwipeRight = (partner) => {
      const requestRef = doc(firestore, `request/${partner.uid}/${partner.uid}/${auth.currentUser.uid}`);
      setDoc(requestRef, {
        request : true,
      },{ capital: true }, { merge: true });
      const requestPartnerRef = doc(firestore, `request/${auth.currentUser.uid}/${auth.currentUser.uid}/${partner.uid}`);
      setDoc(requestPartnerRef, {
        request : false,
      },{ capital: true }, { merge: true });
    };
  
    const onSwipeLeft = (partner) => {
      console.log("dislike " + partner.uid);
      // 嫌いの時
    };
  
    return (
      <>
        {index >= data.length && <RenderNoMoreCards />}
        {data
          .map((item, i) => {
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
    return (
      <Card key={item.uid}>
        <Card.Title style={styles.titleStyle}>{item.name}</Card.Title>
        <Card.Divider />
          {
            item.uri ? 
              <Card.Image source={{ uri: item.uri }} style={styles.imageStyle} resizeMode='contain'/> :
              <Card.Image source={require('../../assets/defaultUserIcon.png')} style={styles.imageStyle} resizeMode='stretch'/>
          }
        <Card.Divider />
        <Text style={styles.textStyle}>{item.introduction}</Text>
        <Button buttonStyle={styles.buttonStyle} title="プロフィールはこちら" onPress={() => {console.info(`name: ${item.name}`)}} />
      </Card>
    );
  };
  
  const RenderNoMoreCards = () => {
    return (
      <Card style={styles.cardStyle}>
        <Card.Title style={styles.titleStyle}>終了</Card.Title>
        <Card.Divider />
        <Text style={styles.textStyle}>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
        <Button buttonStyle={styles.buttonStyle} title="もう一度" onPress={() => {}}/>
      </Card>
    );
  };
  

  const styles = StyleSheet.create({
    cardStyle: {
      marginTop: "10%",
      position: 'absolute',
      width: SCREEN_WIDTH,
      borderRadius: 50,
    },
    imageStyle: {
      height: IMAGE_HEIGHT,
      width: SCREEN_WIDTH,
    },
    titleStyle: {
      fontSize: 18
    },
    textStyle: {
      marginBottom: 10,
      fontSize: 16,
      height: 20
    },
    buttonStyle: {
      borderRadius: 50,
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
    },
});


export { Deck };