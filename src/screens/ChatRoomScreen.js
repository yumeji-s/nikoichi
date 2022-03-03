import React, { useCallback, useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { Overlay } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, Text, NativeBaseProvider, Modal } from 'native-base'; 
import 'dayjs/locale/ja';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { addDoc, doc, setDoc, getDoc, getDocs, updateDoc, collection, query, where, limit, onSnapshot, orderBy, startAfter } from 'firebase/firestore';

import { renderInputToolbar, renderActions, renderComposer, renderSend } from '../components/InputToolbar';
import { auth, firestore } from '../../firebase';
// import { useInfiniteSnapshotListener } from '../components/ChatListener';




const ChatRoomScreen = ({ route, navigation, user }) => {
    
  // const [messages, setMessages] = useState([]);                          // 全メッセージ
  const [currentUser, setCurrentUser] = useState(user);                     // ログインしているユーザ
  const [sentinel, setSentinel] = useState();                               // 最後のメッセージのid
  const { chatRoom, name } = route.params;                                  // チャットルーム名、チャット相手の名前
  const messageRef = collection(firestore, `chat/${chatRoom}/messages`);    // メッセージ登録用
  const { messages, readMore, initRead } = useInfiniteSnapshotListener(chatRoom);

  const [showModal, setShowModal] = useState(true);

  const close = () => {
    setShowModal(false);
    navigation.goBack();
  }
  
  useEffect(async () => {

    // 最後の（一番日付の早い）メッセージを取得
    const q = query(messageRef, orderBy('createdAt','asc'), limit(1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setSentinel(doc);
    });

  },[]);

  // 初回読み込み
  useEffect(()=>{
    initRead();
  },[initRead]);

  // メッセージは残っているか
  const hasMore = sentinel ? !Boolean(messages.find(m => m.id === sentinel.id)) : false;  
  console.log('hasMore = '+hasMore + 'sentinel = ' + sentinel);

  // 送信時の処理
  const onSend = async (messages = []) => {
    // メッセージをfirestoreに登録
    console.log(messages);
    const messageSnap = await addDoc(messageRef, ...messages);
  };

  return (
    <NativeBaseProvider>
      <Modal isOpen={showModal} onClose={() => close()}>
        <View style={styles.container}>
            <Header navigation={navigation} partner={name}></Header>
        
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: currentUser.uid,
                    name: currentUser.name,
                    avatar: currentUser.imgURL
                }}
                locale='ja'
                placeholder='メッセージを入力'
                keyboardShouldPersistTaps='never'
                timeFormat='H:mm'
                onPressAvatar={console.log}
                textInputStyle={styles.sendInput}
                alignTop={true}
                alwaysShowSend={true}
                infiniteScroll={true}
                isLoadingEarlier={true}
                // loadEarlier={hasMore}
                listViewProps={{
                    onEndReached: readMore(),
                    onEndReachedThreshold: 0.4,
                }}
                renderInputToolbar={renderInputToolbar}
                renderActions={renderActions}
                renderComposer={renderComposer}
                renderSend={renderSend}
                messagesContainerStyle={{ backgroundColor: 'aliceblue' }}
                parsePatterns={(linkStyle) => [
                  {
                  pattern: /#(\w+)/,
                  style: linkStyle,
                  onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
                  },
                ]}
            />
        </View>
      </Modal>
    </NativeBaseProvider>
  );
}

const now = new Date();
console.log(now);
const useInfiniteSnapshotListener = (chatRoom) => {

  const unsubscribes = useRef([]);
  const [messages, setMessages] = useState([]);
  const messageRef = collection(firestore, `chat/${chatRoom}/messages`);  // メッセージ登録用
  

  // 未来（最新メッセージ）の購読リスナー
  // const registLatestMessageListener = useCallback(() => {
  //   return onSnapshot(query(messageRef, orderBy("createdAt","asc"), startAfter(now)), (snapshot) => {dispMsgSnap(snapshot)});
  // },[]);

  //過去メッセージの購読リスナー
  const registPastMessageListener = useCallback((time) => {
    console.log(time);
    return onSnapshot(query(messageRef, orderBy("createdAt","desc"), startAfter(time), limit(10)), (snapshot) => {dispMsgSnap(snapshot)});
  },[]);

  // 初回ロード
  const initRead = useCallback(() => {
    console.log("init");
    // 未来のメッセージを購読する
    // unsubscribes.current.push(registLatestMessageListener());
    // 現時刻よりも古いデータを一定数、購読する
    unsubscribes.current.push(registPastMessageListener(now));
  },[registPastMessageListener]);

  // スクロール時、追加購読するためのリスナー
  const lastMessageDate = messages.length > 0 ? messages[messages.length - 1].createdAt : now;
  
  const readMore = useCallback(() => {
    console.log("readMore"+lastMessageDate);
    // unsubscribes.current.push(registPastMessageListener(lastMessageDate));
  },[registPastMessageListener,lastMessageDate]);

  // 登録解除(Unmount時に解除）
  const clear = useCallback(() => {
    for(const unsubscribe of unsubscribes.current){
      unsubscribe();
    }
  },[]);

  useEffect(() => { return () => { clear(); }; }, [clear]);


  const dispMsgSnap = (snapshot) => {
    // 取得したメッセージを表示できるように加工
    console.log("disp");
    snapshot.docChanges().forEach((change) => {
      // console.log(change.doc.data());
      const id = change.doc.id;
      const chat = change.doc.data();
      const newMessage = {
        _id: id,
        text: chat.text,
        createdAt: chat.createdAt.toDate(),
        user: {
          _id: chat.user._id,
          name: chat.user.name,
          avatar: chat.user.avatar
        }
      };
      switch(change.type){
      case 'added':
        msgAppend(newMessage);
        break;
      case 'modified':
        break;
      case 'removed':
        break;
      default: 
        break;
      }
    });
  };
  
  const msgAppend = (newMessage = []) => {
    // メッセージを連結
    setMessages((previousMessages) => GiftedChat.append(previousMessages,newMessage));
  };
  return { initRead, readMore, messages };
};



const Header = ({ navigation, partner }) => {
    const [visible, setVisible] = useState(false);
  
    const toggleOverlay = () => {
      setVisible(!visible);
    }
  
    return (
      <View style={styles.headerWrapper} >
        <View
          style={[
            styles.childContainer,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
          
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
  
            <Text textAlign='center' paddingLeft={4} fontSize={20} h4>
              {partner}
            </Text>
          </View>
        </View>
  
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <View
            style={[styles.flexify, { marginHorizontal: 5, marginTop: 10 }]}
          >
          </View>
        </Overlay>
      </View>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  sendInput: {
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 15,
    marginRight: 10,
    padding: 10,
    backgroundColor: 'snow',
  },
  headerWrapper: {
    shadowColor: '#888',
    shadowOffset:{
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  childContainer: {
    // paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
    width: '90%',
    marginVertical: 0,
    marginHorizontal: 'auto',
  },
  flexify: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export {ChatRoomScreen};