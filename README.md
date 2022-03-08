# nikoichi

学生が勉強用に作った簡単なマッチングアプリです。

動かし方
「git」コマンドを使えるようにする
「npm」コマンドを使えるようにする
「yarn」コマンドを使えるようにする
「expo」コマンドを使えるようにする

ここまで出来たら


1．コマンドプロンプト上で任意のフォルダに移動
コマンド	cd ????

2．リポジトリをコピー
コマンド	git clone https://github.com/yumeji-s/nikoichi.git

3．firebase を始めて App.js とかと同じ階層に firebase.js という名前のファイルを作り、以下を貼り付け、自分の firebase プロジェクトの config情報 を貼り付ける

/*-------------------------------------------------------------*/
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // ここにプロジェクトIDなどを貼り付ける
  // ここにプロジェクトIDなどを貼り付ける
  // ここにプロジェクトIDなどを貼り付ける
  // ここにプロジェクトIDなどを貼り付ける
  // ここにプロジェクトIDなどを貼り付ける
  // ここにプロジェクトIDなどを貼り付ける
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
/*-------------------------------------------------------------*/



4．必要なライブラリをインストール（yarn.lockに書いてあるから以下のコマンドだけでインストールできる）
コマンド	yarn

5．実行
コマンド　yarn start

6．QRコードを読み取ると動く！はず！
expo のアプリが必要なので googleplay,appstore などからインストールしてから読み取る
