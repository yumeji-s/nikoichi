import React, { useCallback, useState, useEffect, useRef } from 'react';
import { collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore';

import { firestore } from '../../firebase';

const now = Date.now();
const useInfiniteSnapshotListener = (chatRoom) => {

    const unsubscribes = useRef([]);
    const [messages, setMessages] = useState([]);
    const messageRef = collection(firestore, `chat/${chatRoom}/messages`);  // メッセージ登録用

    // 未来（最新メッセージ）の購読リスナー
    const registLatestMessageListener = useCallback(() => {
        return onSnapshot(query(messageRef, startAfter(now), orderBy("createdAt","asc"), limit(limit)), (snapshot) => {dispMsgSnap(snapshot)});
    },[]);

    //過去メッセージの購読リスナー
    const registPastMessageListener = useCallback((startAfter) => {
        return onSnapshot(query(messageRef, startAfter(startAfter), orderBy("createdAt","desc"), limit(limit)), (snapshot) => {dispMsgSnap(snapshot)});
    },[]);

    // 初回ロード
    const initRead = useCallback(() => {
        // 未来のメッセージを購読する
        unsubscribes.current.push(registLatestMessageListener());
        // 現時刻よりも古いデータを一定数、購読する
        unsubscribes.current.push(registPastMessageListener(now));
    },[registPastMessageListener]);

    // スクロール時、追加購読するためのリスナー
    const lastMessageDate = messages[messages.length - 1].createdAt;
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
                avatar: chat.avatar
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



export { useInfiniteSnapshotListener };