import React, {useState} from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

const ChatRoomScreen = () => {
    
    const [messages, setMessages] = useState([]);
    const [previousState, setPreviousState] = useState({messages : ""});

    componentWillMount = () => {
        setMessages([])
    }

    reply = () => {
        return {
            _id: 1,
            text: 'Hello!',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
            }
        };
    }


    onSend = (messages) => {
        setPreviousState(({messages : GiftedChat.append(GiftedChat.append(previousState.messages, messages), reply())}))
    }

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

export {ChatRoomScreen};