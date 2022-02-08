import React, { useCallback, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, StatusBar, Image } from 'react-native';
import { Overlay } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import 'dayjs/locale/ja';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { renderInputToolbar, renderActions, renderComposer, renderSend } from '../components/InputToolbar';

const ChatRoomScreen = () => {
    const navigation = useNavigation();
    
    const [messages, setMessages] = useState([]);
    let id = 1;

    onSend = useCallback((messages = []) => {
        setMessages((previousMessages) => GiftedChat.append(GiftedChat.append(previousMessages, messages),[
            {
              _id: id,
              text: 'すぐ会いたいです!',
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'React Native',
                avatar: "",
              },
            },
          ]));
        id++
    },[])

    return (
        <View style={styles.container}>
            <Header navigation={navigation}></Header>
        
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: id,
                    name: 'you',
                    avater: 'https://placeimg.com/140/140/any'
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