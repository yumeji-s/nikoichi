import React, { useCallback, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import { Overlay } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import 'dayjs/locale/ja';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { addDoc, doc, setDoc, getDoc, getDocs, updateDoc, collection, query, where, limit, onSnapshot, orderBy, startAfter } from 'firebase/firestore';

import { renderInputToolbar, renderActions, renderComposer, renderSend } from '../components/InputToolbar';
import { auth, firestore } from '../../firebase';
// import { useInfiniteSnapshotListener } from '../components/ChatListener';



// やること
// 別のファイルに分ける


const ChatRoomScreen = ({ route, navigation }) => {
    
  // const [messages, setMessages] = useState([]);                           // 全メッセージ
  const [currentUser, setCurrentUser] = useState([]);                     // ログインしているユーザ
  const [sentinel, setSentinel] = useState();                             // 最後のメッセージのid
  const { chatRoom } = route.params;                                      // チャットルーム名
  const messageRef = collection(firestore, `chat/${chatRoom}/messages`);  // メッセージ登録用
  const { messages, readMore, initRead } = useInfiniteSnapshotListener(chatRoom);
  
  useEffect(async () => {
    // 最初のレンダリング時に自分の情報を取得
    const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
    const snapShot = await getDoc(userRef);
    if(snapShot.exists()){
      setCurrentUser({
        ...snapShot.data()
      });
    }

    // 最後のメッセージを取得
    const q = query(messageRef, orderBy('createdAt','asc'), limit(1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setSentinel(doc);
    });

    // onSnapshot(query(messageRef, orderBy("createdAt","asc")), (snapshot) => {dispMsgSnap(snapshot)});
  },[]);

  // 初回読み込み
  useEffect(()=>{
    initRead();
  },[initRead]);

  // メッセージは残っているか
  const hasMore = sentinel ? !Boolean(messages.find(m => m.id === sentinel.id)) : false;  

  // 送信時の処理
  const onSend = async (messages = []) => {
    // メッセージをfirestoreに登録
    const messageSnap = await addDoc(messageRef, ...messages);
  };

  return (
      <View style={styles.container}>
          <Header navigation={navigation}></Header>
      
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
              containerStyle={styles.sendArea}
              textInputStyle={styles.sendInput}
              alignTop={true}
              alwaysShowSend={true}
              infiniteScroll={true}
              // loadEarlier={isLoadingEarlier}
              isLoadingEarlier={hasMore}
              listViewProps={{
                  onEndReached: readMore(),
                  onEndReachedThreshold: 0.4,
              }}
              renderInputToolbar={renderInputToolbar}
              renderActions={renderActions}
              renderComposer={renderComposer}
              renderSend={renderSend}
              messagesContainerStyle={{ backgroundColor: '#eee8aa' }}
              parsePatterns={(linkStyle) => [
                {
                pattern: /#(\w+)/,
                style: linkStyle,
                onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
                },
              ]}
          />
      </View>
  );
}

const now = Date.now();
const useInfiniteSnapshotListener = (chatRoom) => {

  const unsubscribes = useRef([]);
  const [messages, setMessages] = useState([]);
  const messageRef = collection(firestore, `chat/${chatRoom}/messages`);  // メッセージ登録用

  // 未来（最新メッセージ）の購読リスナー
  const registLatestMessageListener = useCallback(() => {
      return onSnapshot(query(messageRef, orderBy("createdAt","asc"), startAfter(now)), (snapshot) => {dispMsgSnap(snapshot)});
  },[]);

  //過去メッセージの購読リスナー
  const registPastMessageListener = useCallback((time) => {
      return onSnapshot(query(messageRef, orderBy("createdAt","desc"), startAfter(time), limit(5)), (snapshot) => {dispMsgSnap(snapshot)});
  },[]);

  // 初回ロード
  const initRead = useCallback(() => {
    // 未来のメッセージを購読する
    unsubscribes.current.push(registLatestMessageListener());
    // 現時刻よりも古いデータを一定数、購読する
    unsubscribes.current.push(registPastMessageListener(now));
  },[registPastMessageListener]);

  // スクロール時、追加購読するためのリスナー
  const lastMessageDate = messages.length > 0 ? messages[messages.length - 1].createdAt : now;
  
  const readMore = useCallback(() => {
    unsubscribes.current.push(registPastMessageListener(lastMessageDate));
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
    snapshot.docChanges().forEach((change) => {
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



const Header = ({ navigation }) => {
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
              <Ionicons name="arrow-back" />
            </TouchableOpacity>
  
            <Text style={{ fontWeight: "normal", marginLeft: 20 }} h4>
              Messaging
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
    },
    sendArea: {
        backgroundColor: '#bdb76b',
    },
    sendInput: {
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 15,
        marginRight: 10,
        padding: 10,
        backgroundColor: '#FFF',
    },
    sendButton: {
        backgroundColor: '#F08300',
        color: '#000',
        padding: 10,
        borderRadius: 10,
        margin: 5,
        marginLeft: 0,
        height: 34,
    },
    headerWrapper: {
        shadowColor: '#171717',
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
        paddingTop: StatusBar.currentHeight,
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