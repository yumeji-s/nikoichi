import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import { Overlay } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import 'dayjs/locale/ja';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { addDoc, doc, setDoc, getDoc, getDocs, updateDoc, collection, query, where, limit, onSnapshot } from 'firebase/firestore';

import { renderInputToolbar, renderActions, renderComposer, renderSend } from '../components/InputToolbar';
import { auth, firestore, storage } from '../../firebase';

const ChatRoomScreen = ({ route, navigation }) => {
    
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    let id = 1;
    const { uid } = route.params;
    const { name } = route.params;
    const { imgURL } = route.params;
    const { chatRoom } = route.params;

    useEffect(async () => {
      // 最初のレンダリング時に自分の情報を取得
      const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
      const snapShot = await getDoc(userRef);
      if(snapShot.exists()){
        setCurrentUser({
          ...snapShot.data()
        });
      }
    },[]);

    onSend = useCallback( async (messages = []) => {
      // メッセージをfirestoreに登録
      const messageRef = collection(firestore, `chat/${chatRoom}/messages`);
      const messageSnap = await addDoc(messageRef, {
        ...messages,
      });
    },[]);

    onSnapshot(doc(firestore, `chat/${chatRoom}`), (doc) => {
      if(doc.exists()){
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [
          {
            _id: id,
            text: doc.data().text,
            createdAt: doc.data().sendAt,
            user: {
              _id: doc.data().messanger,
              name: doc.data().uid == auth.currentUser.uid ? currentUser.name : name,
              avatar: doc.data().uid == auth.currentUser.uid ? currentUser.imgURL : imgURL,
            },
          },
        ]));
        id++;console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
      }else{
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      }
    });

    return (
        <View style={styles.container}>
            <Header navigation={navigation}></Header>
        
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: auth.currentUser.uid,
                    name: currentUser.name,
                    avater: currentUser.imgURL
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
                isLoadingEarlier={true}
                listViewProps={{
                    // onEndReached: this.onEndReached,
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

const Header = ({ navigation }) => {
    const [visible, setVisible] = useState(false)
  
    const toggleOverlay = () => {
      setVisible(!visible)
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