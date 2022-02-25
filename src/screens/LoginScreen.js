import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { auth } from '../../firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 20 }}>ログイン画面</Text>
      <View style={{ marginBottom: 20 }}>
        <Text>メール</Text>
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
        <Text>パスワード</Text>
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
        onPress={handleLogin}
        // disabled={!email || !password}
      >
        <Text style={{ color: 'white' }}>ログイン</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{ marginTop: 10 }}
       onPress={() => navigation.navigate('Register')}
      >
      <Text>ユーザ登録はこちら</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export { LoginScreen };