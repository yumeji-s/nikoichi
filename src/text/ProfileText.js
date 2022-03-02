
const keys = ['age', 'address', 'workplace', 'birthplace', 'bloodtype', 'height', 'body', 'background', 'income', 'job', 'holiday',
            'marriagehistory', 'children', 'cigarette', 'alcohol', 'housemate', 'meet', 'datecost', 'marriage'];
const titles = ['年齢', '居住地', '勤務地', '出身地', '血液型', '身長', '体型', '学歴', '年収', '仕事', '休日',
            '結婚歴', '子供の有無', '煙草', 'お酒', '一緒に住んでいる人', '出会うまでの希望', '初回デート費用', '結婚に対する意思'];

const getProfileItems = (user) => {

    return keys.map((key, index) => {
        return {
            key: key,
            title: titles[index],
            val: user[key],
        };
    });
}


  
let heights = ['130cm以下'];
for(let i = 131; i < 215; i++){
    heights.push(`${i}cm`);
}
heights.push('215cm以上');

const prefectures = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山',
                          '石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根',
                          '岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','大分','宮崎','長崎','熊本','鹿児島','沖縄','その他'];
const bloodtypes = ['A','B','O','AB','不明'];
const bodys = ['細め','スレンダー','普通','グラマー','ぽっちゃり','がっしり','マッチョ','太め'];
const backgrounds = ['高校卒','短大／専門学校卒','大学卒','大学院卒','その他'];
const incomes = ['300万円未満','300万円～500万円','500万円～700万円','700万円～900万円','900万円～1200万円','1200万円以上','その他'];
const jobs = ['大学生','大学院卒','専門学生・短大生・高専生','流通','食品・飲料','製薬','医療','福祉・介護','医師','看護師','薬剤師','通信',
            'WEB関連','IT企業','エンジニア','クリエイター','建築・インテリア','金融','保険','コンサル','マスコミ','広告','出版','教育・交通',
            'エンターテイメント','旅行関係','不動産','商社','メーカー','研究職','上場企業','経営者・役員','法務関係','弁護士','公認会計士','税理士',
            '自由業','公務員','消防士','警察官','スポーツ選手','パイロット','投資家','キャビンアテンダント','アパレル・ショップ','美容・コスメ',
            'ブライダル','調理師・栄養士','保育士','接客業','秘書','アナウンサー','受付','エステティシャン','芸能・モデル','インフルエンサー','Youtuber',
            'コスプレイヤー','プロゲーマー','会社員','事務','その他'];
const holidays = ['土日','平日','不定期','その他'];
const marriagehistorys = ['独身(未婚)','独人(離別)','独身(死別)'];
const children = ['いない','いる(同居)','いる(別居)'];
const cigarettes = ['吸わない','吸う','吸う(電子タバコ)','ときどき吸う','非喫煙者の前では吸わない','相手が嫌ならやめる'];
const alcohols = ['よく飲む','時々飲む','あまり飲まない','全く飲まない'];
const housemates = ['一人暮らし','実家暮らし','兄弟姉妹','友達','ペット','その他'];
const meets = ['きちんとメッセージ交換を重ねてから','オンラインデートしてから','まずは会って話したい','気が合えば会いたい'];
const datecosts = ['男性がすべて払う','男性が多めに払う','女性がすべて払う','女性が多めに払う','割り勘','持っている方が払う','相手と相談して決める'];
const marriages = ['すぐにでもしたい','2～3年のうちに','良い人がいれば','わからない'];

const makeItem = (items) => {
    return items.map((item) => {
        return {label: item, value: item};
    });
}

const profileItem = {
    'age': prefectures,
    'address': prefectures,
    'workplace': prefectures,
    'birthplace': prefectures,
    'bloodtype': bloodtypes,
    'height': heights,
    'body': bodys,
    'background': backgrounds,
    'income': incomes,
    'job': jobs,
    'holiday': holidays,
    'marriagehistory': marriagehistorys,
    'children': children,
    'cigarette': cigarettes,
    'alcohol': alcohols,
    'housemate': housemates,
    'meet': meets,
    'datecost': datecosts,
    'marriage': marriages,
};
  
const getItems = (key) => {
    return makeItem(profileItem[key]);
}


const getPlaceholder = (item) => {
    return {
      label: item != undefined ? item.toString() : "タップして設定",
      value: item != undefined ? item.toString() : null,
      color: 'black',
    };
}


export { getProfileItems, getItems, getPlaceholder };