import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { auth, firestore } from '../../firebase';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
          const user = await createUserWithEmailAndPassword(auth, email, password);
          // 自分がおすすめユーザに表示されないように
          const requestRef = doc(firestore, `request/${auth.currentUser.uid}/${auth.currentUser.uid}/${auth.currentUser.uid}`);
          await setDoc(requestRef, {
            request : false,
          });

          const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
          await setDoc(userRef, {
            name : name,
            birth : new Date(),
            imgURL : "",
            uid : auth.currentUser.uid,
            introduction : "",
          });
          console.log("アカウント作成");
        } catch (error) {
          console.log(error.message);
        }
    };
  
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 20 }}>ユーザ登録画面</Text>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            style={{
              width: 250,
              borderWidth: 1,
              padding: 5,
              borderColor: 'gray',
            }}
            onChangeText={setName}
            value={name}
            placeholder="ユーザ名を入力してください"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            style={{
              width: 250,
              borderWidth: 1,
              padding: 5,
              borderColor: 'gray',
            }}
            onChangeText={setEmail}
            value={email}
            placeholder="メールアドレスを入力してください"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            style={{
              width: 250,
              borderWidth: 1,
              padding: 5,
              borderColor: 'gray',
            }}
            onChangeText={setPassword}
            value={password}
            placeholder="パスワードを入力してください"
            secureTextEntry={true}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: '#88cb7f',
            borderRadius: 10,
          }}
          onPress={handleRegister}
          disabled={!email || !password || !name}
        >
          <Text style={{ color: 'white' }}>登録する</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => navigation.navigate('Login')}
        >
        <Text>ログインはこちら</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  };
  
  export { RegisterScreen };