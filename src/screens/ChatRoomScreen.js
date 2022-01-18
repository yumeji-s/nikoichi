import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import 'dayjs/locale/ja';

import Images from '../../assets/index';

const ChatRoomScreen = () => {
    
    const [messages, setMessages] = useState([]);

    onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(GiftedChat.append(previousMessages, messages),[
            {
              _id: 1,
              text: 'すぐ会いたいです!',
              createdAt: new Date(2022,1,18,9,13),
              user: {
                _id: 2,
                name: 'React Native',
                avatar: Images.minami,
              },
            },
          ]));
    },[])

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: 1,
                name: 'you',
                avater: 'https://placeimg.com/140/140/any'
            }}
            locale='ja'
            placeholder='メッセージを入力'
            keyboardShouldPersistTaps='never'
            timeFormat='H:mm'
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
        />
    );
}


const styles = StyleSheet.create({
    sendArea: {
        backgroundColor: 'rgba(240, 131, 0, 0.2)',
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
        color: '#FFF',
        padding: 10,
        borderRadius: 10,
        margin: 5,
        marginLeft: 0,
        height: 34,
    }
});

export {ChatRoomScreen};