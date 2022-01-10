//import Deck from '../components/SwipeCard';
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { Card, Button } from 'react-native-elements';
import Images from '../../assets/index';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;


const Deck = ({ data }) => {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
  LayoutAnimation.spring();

  const [index, setIndex] = useState(0);

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

  const onSwipeComplete = (direction) => {
    const item = data[index];

    direction === 'right' ? onSwipeRight() : onSwipeLeft();
    position.setValue({ x: 0, y: 0 });
    setIndex((prevIndex) => prevIndex + 1);
  };

  const onSwipeRight = () => {};
  const onSwipeLeft = () => {};

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

  return (
    <>
      {index >= data.length && <RenderNoMoreCards />}
      {data
        .map((item, i) => {
          if (i < index) {
            return null;
          }

          console.info(`id: ${item.id}`)

          if (i === index) {
            return (
              <Animated.View
                key={item.id}
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
              key={item.id}
              style={[styles.cardStyle, { top: 10 * (i - index) }]}
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
    <Card key={item.id}>
      <Card.Title style={styles.titleStyle}>{item.name}</Card.Title>
      <Card.Divider />
      <Card.Image source={item.uri} />
      <Card.Divider />
      <Text style={styles.textStyle}>目標：{item.goal}</Text>
      <Button buttonStyle={styles.buttonStyle} title="プロフィールはこちら" onPress={() => {console.info(`name: ${item.name}`)}} />
    </Card>
  );
};

const RenderNoMoreCards = () => {
  return (
    <Card>
      <Card.Title style={styles.titleStyle}>終了</Card.Title>
      <Card.Divider />
      <Text style={styles.textStyle}>検索にかかった女優は以上です</Text>
      <Button buttonStyle={styles.buttonStyle} title="もっと女優を探す" />
    </Card>
  );
};

const SwipeScreen = () => {

    const DATA = [
        {
            id: 1,
            name: '浜辺　美波',
            uri: Images.minami,
            goal: '若手No.1女優',
        },
        {
            id: 2,
            name: '新垣　結衣',
            uri: Images.yui,
            goal: '若手No.2女優',
        },
        {
            id: 3,
            name: '広瀬　すず',
            uri: Images.suzu,
            goal: '若手No.3女優',
        },
        {
            id: 4,
            name: '永野　芽郁',
            uri: Images.mei,
            goal: '若手No.4女優',
        },
        {
            id: 5,
            name: '今田　美桜',
            uri: Images.mio,
            goal: '若手No.5女優',
        },
      ];

    return (
    <View style={styles.container}>
      <Deck data={DATA} />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
    },
    titleStyle: { fontSize: 18 },
    textStyle: { marginBottom: 10, fontSize: 16 },
    buttonStyle: {
        borderRadius: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
    },
});


export default SwipeScreen;