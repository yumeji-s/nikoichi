import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { NativeBaseProvider, Text, Icon, View } from 'native-base'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

import { auth, firestore } from '../../firebase';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sex, setSex] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const navigation = useNavigation();

  const [birth, setBirth] = useState(new Date());
  const [text, setText] = useState('誕生日を設定してください');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || birth;
    setShow(Platform.OS === 'ios');
    setBirth(currentDate);
    setText(`${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handleRegister = async () => {

    if(password !== checkPassword){
      alert("同じパスワードを入力してください");
      return;
    }

    const age = getUserAge(birth);
    if(age < 18){
      alert("18歳未満の方はご利用いただけません。");
      return;
    }

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      // 自分がおすすめユーザに表示されないように
      const requestRef = doc(firestore, `request/${auth.currentUser.uid}/${auth.currentUser.uid}/${auth.currentUser.uid}`);
      await setDoc(requestRef, {
        request : false,
      });

      // プロフィールを登録
      const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
      await setDoc(userRef, {
        name : name,
        birth : birth,
        age : age,
        imgURL : "",
        uid : auth.currentUser.uid,
        introduction : "",
        sex: sex == '男性' ? 'man':'woman',
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <NativeBaseProvider>
      <View flex={1}>
      <ScrollView flex={1} justifyContent='center'>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <View style={{ marginBottom: 20 }}>
            <Text>ニックネーム</Text>
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

          <View style={{ marginBottom: 20, width: 250 }}>
            <View>
              <Text>誕生日</Text>
              <Text onPress={showDatepicker} style={{backgroundColor: '#dcdcdc', borderColor: '#808080'}}>{text}</Text>
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={birth}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          <View style={{ marginBottom: 20, width: 250 }}>
            <Text alignSelf="flex-start" bgColor="amber.100">性別</Text>
            <RNPickerSelect
              onValueChange={(value) => { setSex(value); }}
              placeholder={{
                label: sex != '' ? sex : "タップして設定",
                value: sex != '' ? sex : null,
                color: 'black'
              }}
              style={{
                inputIOS: {
                  fontSize: 20,
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: '#000',
                  paddingRight: 30,
                  marginLeft: 30,
                  textAlign: 'left',
                },
                inputAndroid: {
                  fontSize: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderWidth: 0.5,
                  borderColor: '#000',
                  paddingRight: 50,
                  textAlign: 'left',
                },
                iconContainer: {
                  top: 8,
                  right: 10,
                },
                placeholder: {
                  color: 'black',
                  fontSize: 20,
                },
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => {
                return (
                  <Icon
                    size="md"
                    as={<Ionicons name="chevron-forward" />}
                  />
                );
              }}
              items={[
                {label: '男性', value: '男性'},
                {label: '女性', value: '女性'}
              ]}
            />
          </View>
          
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

          <View style={{ marginBottom: 20 }}>
            <Text>パスワードの確認</Text>
            <TextInput
              style={{
                width: 250,
                borderWidth: 1,
                padding: 5,
                borderColor: 'gray',
              }}
              onChangeText={setCheckPassword}
              value={checkPassword}
              placeholder="再度パスワードを入力してください"
              secureTextEntry={true}
              autoCapitalize="none"
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={{color: 'red'}}>※全ての項目を設定しないと登録出来ません。</Text>
          </View>

          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: '#88cb7f',
              borderRadius: 10,
            }}
            onPress={handleRegister}
            disabled={!email || !password || !name || !checkPassword || !sex}
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
      </ScrollView>
      </View>
    </NativeBaseProvider>
  );
};


  const getUserAge = (birth) => {
    //今日の日付を取得する
    const todayDate = new Date();
  
    //誕生日を計算する
    let userAge = todayDate.getFullYear() - birth.getFullYear();
  
    //誕生日が当年込みの計算のため、もし今年の誕生日を迎えていない場合は1歳年齢を減らす
    const currentYearDate = new Date(todayDate.getFullYear(), birth.getMonth(), birth.getDate());
    if(currentYearDate > todayDate) {
      userAge = (userAge - 1);
    }
    return userAge;
  }
  
  export { RegisterScreen };