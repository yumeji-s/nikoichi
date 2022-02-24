import React from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Icon } from 'native-base'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, firestore } from '../../firebase';


export const updateProfile = (key, data) => {
  if(!key || !data){
      console.log("update出来ませんでした。");
      return;
  }
  const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
  updateDoc(userRef, {
    [key]: data,
  }, { capital: true });
}

const getPlaceholder = (item) => {
  return {
    label: item != undefined ? item.toString() : "タップして設定",
    value: item != undefined ? item.toString() : null,
    color: 'black',
  };
}

const getPrefectureItem = () => {
    const prefectures = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                        '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                        '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
    return makeItem(prefectures);
}

const getBloodtypeItem = () => {
    const bloodtypes = ['A','B','O','AB','不明'];
    return makeItem(bloodtypes);
}

const getHeightItem = () => {
    let heights = ['130cm以下'];
    for(let i = 131; i < 215; i++){
        heights.push(`${i}cm`);
    }
    heights.push('215cm以上');
    return makeItem(heights);
}

const getBodyItem = () => {
    const bodys = ['細め','スレンダー','普通','グラマー','ぽっちゃり','がっしり','マッチョ','太め'];
    return makeItem(bodys);
}

const getBackgroundItem = () => {
    const backgrounds = ['高校卒','短大／専門学校卒','大学卒','大学院卒','その他'];
    return makeItem(backgrounds);
}

const getIncomeItem = () => {
    const incomes = ['300万円未満','300万円～500万円','500万円～700万円','700万円～900万円','900万円～1200万円','1200万円以上','その他'];
    return makeItem(incomes);
}

const getJobItem = () => {
    const jobs = ['大学生','大学院卒','専門学生・短大生・高専生','流通','食品・飲料','製薬','医療','福祉・介護','医師','看護師','薬剤師','通信',
                'WEB関連','IT企業','エンジニア','クリエイター','建築・インテリア','金融','保険','コンサル','マスコミ','広告','出版','教育・交通',
                'エンターテイメント','旅行関係','不動産','商社','メーカー','研究職','上場企業','経営者・役員','法務関係','弁護士','公認会計士','税理士',
                '自由業','公務員','消防士','警察官','スポーツ選手','パイロット','投資家','キャビンアテンダント','アパレル・ショップ','美容・コスメ',
                'ブライダル','調理師・栄養士','保育士','接客業','秘書','アナウンサー','受付','エステティシャン','芸能・モデル','インフルエンサー','Youtuber',
                'コスプレイヤー','プロゲーマー','会社員','事務','その他'];
    return makeItem(jobs);
}

const getHolidayItem = () => {
    const holidays = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                        '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                        '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
    return makeItem(holidays);
}

const getMarriagehistoryItem = () => {
    const marriagehistorys = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                        '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                        '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
    return makeItem(marriagehistorys);
}

const getChildrenItem = () => {
    const children = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                        '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                        '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
    return makeItem(children);
}

const getCigaretteItem = () => {
    const cigarettes = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                        '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                        '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
    return makeItem(cigarettes);
}

const getAlcoholItem = () => {
    const alcohols = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                        '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                        '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
    return makeItem(alcohols);
}

const getHousemateItem = () => {
    const housemates = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                        '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                        '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
    return makeItem(housemates);
}

const getMeetItem = () => {
    const meets = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                        '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                        '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
    return makeItem(meets);
}

const getDatecostItem = () => {
    const datecosts = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                        '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                        '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
    return makeItem(datecosts);
}

const getMarriageItem = () => {
    const marriages = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                        '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                        '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
    return makeItem(marriages);
}

const makeItem = (items) => {
    return items.map((item) => {
        return {label: item, value: item};
    });
}

const getItems = (key) => {
    let items;
    switch(key){
        case 'address': case 'workplace': case 'birthplace':
            items = getPrefectureItem();
            break;
        case 'bloodtype':
            items = getBloodtypeItem();
            break;
        case 'height':
            items = getHeightItem();
            break;
        case 'body':
            items = getBodyItem();
            break;
        case 'background':
            items = getBackgroundItem();
            break;
        case 'income':
            items = getIncomeItem();
            break;
        case 'job':
            items = getJobItem();
            break;
        case 'holiday':
            items = getHolidayItem();
            break;
        case 'marriagehistory':
            items = getMarriagehistoryItem();
            break;
        case 'children':
            items = getChildrenItem();
            break;
        case 'cigarette':
            items = getCigaretteItem();
            break;
        case 'alcohol':
            items = getAlcoholItem();
            break;
        case 'housemate':
            items = getHousemateItem();
            break;
        case 'meet':
            items = getMeetItem();
            break;
        case 'datecost':
            items = getDatecostItem();
            break;
        case 'marriage':
            items = getMarriageItem();
            break;
        default:
            items = getMarriageItem();
    }
    return items;
}

export const getSelect = (key, val) => {
    return (
        <RNPickerSelect
            onValueChange={(value) => {
                updateProfile(key, value);
            }}
            placeholder={getPlaceholder(val)}
            style={{...pickerSelectStyles}}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
                return key != 'age' ? (
                  <Icon
                    size="md"
                    as={<Ionicons name="chevron-forward" />}
                  />
                ) : null;
            }}
            items={getItems(key)}
            disabled={key == 'age'}
        />
    );
};



const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 20,
      paddingVertical: 12,
      paddingHorizontal: 10,
      // borderWidth: 1,
      // borderColor: '#789',
      // borderRadius: 4,
      color: 'black',
      paddingRight: 30,
      // minWidth: '100%',
      // maxWidth: '100%',
      marginLeft: 30,
      textAlign: 'right',
    },
    inputAndroid: {
      fontSize: 20,
      paddingHorizontal: 10,
      paddingVertical: 8,
      // borderWidth: 0.5,
      // borderColor: '#000',
      // borderRadius: 8,
      color: 'black',
      paddingRight: 50,
    //   backgroundColor:'#aaa',
      textAlign: 'right',
    },
    iconContainer: {
      top: 8,
      right: 10,
    },
    placeholder: {
      color: 'black',
      fontSize: 20,
    },
  });