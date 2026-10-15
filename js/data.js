/* ============================================
   MIX CLUB · Mock Data
   ============================================ */

const APP_DATA = {
  banners: [
    { img: 'images/banner1.jpg',  title: '霓虹夜未眠',       sub: 'DJ KUMA 驻场 · 每周五六晚 22:00' },
    { img: 'images/banner2.jpg',  title: '钻石会员日',       sub: '包厢8折 · 限定鸡尾酒买一送一' },
    { img: 'images/banner3.jpg',  title: '「极光」系列',     sub: '调酒师 Allan 主理 · 限时供应' },
    { img: 'images/banner4.jpg',  title: '周末电音之夜',     sub: '百大 DJ 阵容 · 三屏 VJ 视觉' },
    { img: 'images/banner5.jpg',  title: '招牌鸡尾酒买二送一', sub: '工作日 20:00–22:00 专享' },
    { img: 'images/banner6.jpg',  title: 'MIX CLUB 第二季',   sub: '全新主题包厢 · 8 月璀璨启幕' },
    { img: 'images/banner7.jpg',  title: '生日月专属特调',    sub: '凭身份证到店即享免费一杯' },
    { img: 'images/banner8.jpg',  title: 'KUMA 现场点播',     sub: '每周更新 · 嗨到天亮' },
    { img: 'images/banner9.jpg',  title: '在线排队免等候',    sub: '实时叫号 · 一键取号' },
    { img: 'images/banner10.jpg', title: '调酒师限定特调',    sub: '「东京夜樱」· 微醺浪漫' }
  ],

  quickActions: [
    { id: 'queue',   icon: '🎫', label: '排队取号', sub: '实时叫号 · 在线排队',  cls: 'q9', link: 'queue' },
    { id: 'reserve', icon: '🛋️', label: '包厢预订', sub: '豪华大包 / 露台 / 派对', cls: 'q1', link: 'booking' },
    { id: 'table',   icon: '🍸', label: '在线点单', sub: '鸡尾酒 / 酒水 / 小食',  cls: 'q2', link: 'menu' },
    { id: 'event',   icon: '🎉', label: '派对活动', sub: '每周精彩不断',         cls: 'q3', link: 'events' },
    { id: 'vip',     icon: '👑', label: 'VIP 会员',  sub: '钻石卡专属权益',       cls: 'q4', link: 'vip' },
    { id: 'music',   icon: '🎵', label: '驻场歌单',  sub: 'DJ 现场 · 嗨到天亮',   cls: 'q5', link: 'music' }
  ],

  featured: [
    { id: 'f1', name: '霓虹极光', price: 88, tag: '招牌', img: 'images/霓虹极光.jpg' },
    { id: 'f2', name: '东京夜樱', price: 108, tag: '新品', img: 'images/东京夜樱.jpg' },
    { id: 'f3', name: '曼哈顿日落', price: 128, tag: '热销', img: 'images/曼哈顿日落.jpg' },
    { id: 'f4', name: '蓝色夏威夷', price: 138, tag: '经典', img: 'images/蓝色夏威夷.jpg' },
    { id: 'f5', name: '威士忌酸', price: 148, tag: '推荐', img: 'images/威士忌酸.jpg' }
  ],

  menuCategories: [
    { id: 'all', name: '全部' },
    { id: 'cocktail', name: '招牌鸡尾酒' },
    { id: 'whisky', name: '威士忌' },
    { id: 'wine', name: '葡萄酒' },
    { id: 'beer', name: '精酿啤酒' },
    { id: 'snack', name: '佐酒小食' },
    { id: 'soft', name: '无酒精' }
  ],

  // 18 images => products
  // 定价规则：价格区间 88~588，且全部以 8 结尾（高档酒吧定价惯例）
  products: [
    { id: 'p01', cat: 'cocktail', name: '霓虹极光',   desc: 'GIN / 蓝柑橘 / 柠檬 / 蝶豆花 · 渐变梦幻口感', tags: ['招牌','热销'], price: 88,  original: 128, sales: 1280, img: 'images/霓虹极光.jpg',  hot: true, tastes: ['清爽','果味','微醺'] },
    { id: 'p02', cat: 'cocktail', name: '东京夜樱',   desc: '清酒 / 樱花糖浆 / 樱花汽水 · 微醺浪漫',         tags: ['新品','限定'], price: 108, original: 148, sales: 956,  img: 'images/东京夜樱.jpg',  hot: true, tastes: ['果味','甜','微醺'] },
    { id: 'p03', cat: 'cocktail', name: '曼哈顿日落', desc: '波本威士忌 / 甜苦艾 / 樱桃 · 经典美式',       tags: ['经典'],       price: 128, original: 168, sales: 2105, img: 'images/曼哈顿日落.jpg', tastes: ['浓郁','甜','烈'] },
    { id: 'p04', cat: 'cocktail', name: '蓝色夏威夷', desc: '白朗姆 / 蓝柑橘 / 菠萝汁 · 海岛风情',         tags: ['人气'],       price: 138, original: 188, sales: 1890, img: 'images/蓝色夏威夷.jpg', tastes: ['果味','甜','清爽'] },
    { id: 'p05', cat: 'cocktail', name: '威士忌酸',   desc: '波本 / 柠檬汁 / 糖浆 / 蛋清 · 丝滑醇厚',       tags: ['推荐'],       price: 148, original: 198, sales: 762,  img: 'images/威士忌酸.jpg',   tastes: ['酸','浓郁'] },
    { id: 'p06', cat: 'whisky',   name: 'Macallan 12', desc: '苏格兰单一麦芽 · 雪莉桶 · 12年陈酿',         tags: ['高端','限定'], price: 488, original: 588, sales: 215, img: 'images/Macallan 12.jpg', tastes: ['浓郁','烈'] },
    { id: 'p07', cat: 'whisky',   name: 'Yamazaki 山崎', desc: '日本威士忌 · 三得利旗舰款 · 入口柔顺',     tags: ['日威'],       price: 588, original: 688, sales: 138, img: 'images/Yamazaki 山崎.jpg', tastes: ['浓郁','微醺'] },
    { id: 'p08', cat: 'wine',     name: 'Château 红酒', desc: '法国波尔多 · 2015年 · 浓郁黑果香',           tags: ['红酒'],       price: 288, original: 388, sales: 326, img: 'images/Chateau红酒.jpg', tastes: ['浓郁','酸'] },
    { id: 'p09', cat: 'wine',     name: 'Moet 香槟',    desc: '酩悦 · 法国 · 庆典首选 · 果香清新',          tags: ['香槟'],       price: 328, original: 428, sales: 412, img: 'images/Moet香槟.jpg',    tastes: ['气泡','清爽','甜'] },
    { id: 'p10', cat: 'beer',     name: 'Asahi 生啤',   desc: '朝日生啤 · 日本原装 · 500ml 扎啤',           tags: ['生啤'],       price: 88,  original: 108, sales: 1567, img: 'images/Asahi生啤.jpg', tastes: ['清爽','气泡'] },
    { id: 'p11', cat: 'beer',     name: '1664 白啤',    desc: '法国1664 · 柑橘香 · 330ml · 顺滑口感',       tags: ['精酿'],       price: 88,  original: 108, sales: 2103, img: 'images/1664白啤.jpg',  tastes: ['清爽','气泡','果味'] },

    { id: 'p12', cat: 'snack',    name: '美式炸鸡拼盘', desc: '原味鸡块 / 鸡翅 / 薯条 · 6件套',            tags: ['人气','炸物'], price: 98,  original: 138, sales: 1452, img: 'images/美式炸鸡拼盘.jpg' },
    { id: 'p13', cat: 'snack',    name: '芝士焗薯条',   desc: '车达芝士 / 培根碎 / 香葱 · 现烤现做',        tags: ['热销'],       price: 118, original: 158, sales: 1289, img: 'images/芝士焗薯条.jpg?v=2' },
    { id: 'p14', cat: 'snack',    name: '豪华果盘',     desc: '时令水果 · 草莓 / 哈密瓜 / 蓝莓 · 大份',     tags: ['拼盘'],       price: 138, original: 188, sales: 826,  img: 'images/豪华果盘.jpg?v=2' },
    { id: 'p15', cat: 'snack',    name: '和牛粒炒饭',   desc: 'A5和牛 / 鸡蛋 / 葱花 · 主厨推荐',            tags: ['主厨'],       price: 188, original: 248, sales: 538,  img: 'images/和牛粒炒饭.jpg' },
    { id: 'p16', cat: 'soft',     name: '莫吉托无酒精', desc: '薄荷 / 青柠 / 苏打 · 0酒精放心喝',           tags: ['无酒精'],     price: 128, original: 168, sales: 692,  img: 'images/莫吉托无酒精.jpg', tastes: ['清爽','无酒精'] },
    { id: 'p17', cat: 'soft',     name: '鲜榨果汁',     desc: '当季鲜果现榨 · 橙汁 / 西瓜 / 苹果',          tags: ['健康'],       price: 108, original: 148, sales: 1124, img: 'images/鲜榨果汁.jpg', tastes: ['果味','无酒精','清爽'] },
    { id: 'p18', cat: 'soft',     name: '精品气泡水',   desc: '巴黎水 / 圣培露 · 750ml · 佐酒必备',         tags: ['气泡'],       price: 98,  original: 138, sales: 988,  img: 'images/巴黎气泡水.jpg', tastes: ['气泡','无酒精','清爽'] }
  ],

  eventTypes: [
    { id: 'all', name: '全部活动' },
    { id: 'weekend', name: '周末派对' },
    { id: 'theme', name: '主题之夜' },
    { id: 'dj', name: 'DJ专场' },
    { id: 'private', name: '私人定制' }
  ],

  events: [
    {
      id: 'e1', cat: 'dj',
      title: 'EDM 狂潮之夜',
      img: 'images/EDM狂潮之夜.jpg',
      date: '07/19', weekday: '周六',
      time: '22:00 - 02:00',
      place: 'MIX 主厅',
      desc: '亚洲百大DJ KUMA 亲临现场，三屏联动VJ视觉，带你穿越音浪的极限。',
      tags: ['DJ专场','电子'],
      price: 188, original: 268,
      countdown: true,
      booked: 156, capacity: 300
    },
    {
      id: 'e2', cat: 'theme',
      title: '霓虹复古 80s',
      img: 'images/霓虹复古80s.jpg',
      date: '07/25', weekday: '周五',
      time: '21:00 - 01:00',
      place: 'MIX 全场',
      desc: '穿越回80年代！复古Disco装扮可享鸡尾酒8折，DJ精选Disco金曲。',
      tags: ['主题','复古'],
      price: 128, original: 168,
      countdown: true,
      booked: 89, capacity: 200
    },
    {
      id: 'e3', cat: 'weekend',
      title: '嘻哈之夜',
      img: 'images/嘻哈之夜.jpg',
      date: '07/26', weekday: '周六',
      time: '22:30 - 03:00',
      place: 'MIX 主厅',
      desc: '国内顶尖Hip-hop DJ阵容，freestyle battle现场开战，嘻哈迷不可错过。',
      tags: ['嘻哈','潮流'],
      price: 158, original: 198,
      countdown: true,
      booked: 234, capacity: 350
    },
    {
      id: 'e4', cat: 'private',
      title: '私人包场派对',
      img: 'images/私人包场派对.jpg',
      date: '定制', weekday: '预约',
      time: '自定义',
      place: 'VIP 包厢',
      desc: '20人起订，专属定制派对流程，明星同款DJ、生日/求婚/团建首选。',
      tags: ['定制','高端'],
      price: 5888, original: 8888,
      countdown: false,
      booked: 12, capacity: 50
    },
    {
      id: 'e5', cat: 'theme',
      title: '七夕情人节专场',
      img: 'images/七夕情人节专场.jpg',
      date: '08/10', weekday: '周日',
      time: '20:00 - 24:00',
      place: 'MIX 露台',
      desc: '星空露台+双人套餐+情侣鸡尾酒，浪漫之夜从MIX开始。',
      tags: ['情人节','浪漫'],
      price: 588, original: 888,
      countdown: true,
      booked: 67, capacity: 100
    }
  ],

  rooms: [
    { id: 'r1', name: '豪华大包厢', img: 'images/豪华大包厢.jpg', desc: 'KTV · 独立卫生间 · 30m²', price: 1980, capacity: '8-12人', tags: ['KTV','豪华'] },
    { id: 'r2', name: '星空露台包', img: 'images/星空露台包厢.jpg', desc: '户外露台 · 夜景一流 · 25m²', price: 1680, capacity: '6-10人', tags: ['露台','夜景'] },
    { id: 'r3', name: '小型派对房', img: 'images/MINI派对包厢.jpg', desc: '音响环绕 · 适合聚会 · 20m²', price: 1280, capacity: '4-8人', tags: ['聚会'] },
    { id: 'r4', name: 'VIP钻石包', img: 'images/VIP钻石包厢.jpg', desc: '顶级音响 · 独立DJ台 · 40m²', price: 2880, capacity: '10-15人', tags: ['VIP','顶级'] }
  ],

  vipLevels: [
    { lvl: 1, name: '青铜会员', min: 0, max: 999, color: '#cd7f32' },
    { lvl: 2, name: '白银会员', min: 1000, max: 4999, color: '#c0c0c0' },
    { lvl: 3, name: '黄金会员', min: 5000, max: 19999, color: '#d4af37' },
    { lvl: 4, name: '钻石会员', min: 20000, max: 99999, color: '#b9f2ff' },
    { lvl: 5, name: '黑金至尊', min: 100000, max: Infinity, color: '#1a1a1a' }
  ],

  vipBenefits: [
    { icon: '🎁', name: '生日礼遇', desc: '生日月免费鸡尾酒一杯', unlocked: true },
    { icon: '💎', name: '积分双倍', desc: '消费积分 ×2', unlocked: true },
    { icon: '🍾', name: '免费存酒', desc: '专属酒柜寄存服务', unlocked: true },
    { icon: '🎟️', name: '包厢折扣', desc: '包厢预订8折', unlocked: true },
    { icon: '👑', name: '专属管家', desc: '一对一专属服务', unlocked: false, need: '钻石会员' },
    { icon: '🌟', name: '私享派对', desc: '年度私享派对入场券', unlocked: false, need: '钻石会员' }
  ],

  vipCards: [
    { type: '钻石卡', num: '8888 6666 2222 ****', icon: '💎', desc: '主卡 · 2027.06 到期' },
    { type: '预付卡', num: '6200 1188 0055 ****', icon: '💳', desc: '余额 ¥2,388.00' },
    { type: '积分卡', num: 'V-MIX-2024-251071', icon: '⭐', desc: '可用积分 12,860' }
  ],

  playlist: [
    { id: 's1', title: 'Neon Lights', artist: 'KUMA', dur: '3:42', img: 'images/霓虹极光.jpg' },
    { id: 's2', title: 'Midnight City', artist: 'M83', dur: '4:03', img: 'images/东京夜樱.jpg' },
    { id: 's3', title: 'Tokyo Drift', artist: 'Teriyaki Boyz', dur: '4:14', img: 'images/曼哈顿日落.jpg' },
    { id: 's4', title: 'Faded', artist: 'Alan Walker', dur: '3:32', img: 'images/蓝色夏威夷.jpg' },
    { id: 's5', title: 'Levitating', artist: 'Dua Lipa', dur: '3:24', img: 'images/威士忌酸.jpg' },
    { id: 's6', title: 'Blinding Lights', artist: 'The Weeknd', dur: '3:20', img: 'images/Macallan 12.jpg' },
    { id: 's7', title: 'Closer', artist: 'The Chainsmokers', dur: '4:05', img: 'images/Yamazaki 山崎.jpg' },
    { id: 's8', title: 'Stay', artist: 'Kygo', dur: '3:58', img: 'images/Chateau红酒.jpg' }
  ],

  notices: [
    '🎉 7月19日 EDM 狂潮之夜 · 早鸟票限时7折',
    '🍸 招牌鸡尾酒买二送一 · 仅限工作日 20:00-22:00',
    '👑 新用户首单立减 ¥50 · 钻石会员专属',
    '🎂 本月生日会员到店即享生日特调一杯'
  ],

  // 排队取号页配置
  queueConfig: {
    // 平均每位客人就坐耗时（分钟），用于估算等待时长
    avgSeatMin: 12,
    // 当前模拟队列中的人数（不包含本人）
    baseWaiting: 18,
    // 实时进度条用：每 5 秒推进 1 位
    tickSec: 5,
    // 排队规则（说明区文案）
    rules: [
      '请如实填写人数与联系方式，方便我们为您安排合适的座位',
      '叫号后请在 5 分钟内到店核销，过号将顺延 3 位',
      'VIP 排队通道优先安排散座与卡座，无需等待包厢排队',
      '取号后可在「我的取号」中查看实时进度并主动取消',
      '每日 21:00-23:00 为高峰时段，建议提前 30 分钟取号'
    ]
  }
};

// ============================================
// 桌台目录（唯一数据源）
// 扫码点单绑定 / 订台页座位图 共用同一套真实桌台号（S01-S12 · K01-K06）
// ============================================
const APP_TABLES = [
  // 卡座 K（6 个，含 2 个 VIP）
  { id: 'K01', type: 'ka', name: 'K01', cap: 4, price: 600, vip: true },
  { id: 'K02', type: 'ka', name: 'K02', cap: 4, price: 600, vip: true },
  { id: 'K03', type: 'ka', name: 'K03', cap: 4, price: 500, vip: false },
  { id: 'K04', type: 'ka', name: 'K04', cap: 4, price: 500, vip: false },
  { id: 'K05', type: 'ka', name: 'K05', cap: 4, price: 500, vip: false },
  { id: 'K06', type: 'ka', name: 'K06', cap: 4, price: 500, vip: false },
  // 散台 S（12 个）
  { id: 'S01', type: 'san', name: 'S01', cap: 2, price: 200, vip: false },
  { id: 'S02', type: 'san', name: 'S02', cap: 2, price: 200, vip: false },
  { id: 'S03', type: 'san', name: 'S03', cap: 2, price: 200, vip: false },
  { id: 'S04', type: 'san', name: 'S04', cap: 2, price: 200, vip: false },
  { id: 'S05', type: 'san', name: 'S05', cap: 2, price: 200, vip: false },
  { id: 'S06', type: 'san', name: 'S06', cap: 2, price: 200, vip: false },
  { id: 'S07', type: 'san', name: 'S07', cap: 2, price: 180, vip: false },
  { id: 'S08', type: 'san', name: 'S08', cap: 2, price: 180, vip: false },
  { id: 'S09', type: 'san', name: 'S09', cap: 2, price: 180, vip: false },
  { id: 'S10', type: 'san', name: 'S10', cap: 2, price: 180, vip: false },
  { id: 'S11', type: 'san', name: 'S11', cap: 2, price: 180, vip: false },
  { id: 'S12', type: 'san', name: 'S12', cap: 2, price: 180, vip: false }
];

// 本地存储 key
const LS_KEYS = {
  CART: 'mix_club_cart_v1',
  USER: 'mix_club_user_v1',
  BOOKINGS: 'mix_club_bookings_v1',
  FAV: 'mix_club_fav_v1',
  QUEUE: 'mix_club_queue_v1',
  ORDERS: 'mix_club_orders_v1',
  TABLE: 'mix_club_table_v1',
  SIGN: 'mix_club_sign_v1',
  INVITE: 'mix_club_invite_v1',
  AI_PREFS: 'mix_club_ai_prefs_v1',
  MALL: 'mix_club_mall_v1'
};

// ============================================
// 活动日期动态化
// 将写死的活动日期改为"以今天为基准的未来周末"，
// 避免过期活动与星期错位；同时为倒计时生成准确时间戳 e.ts。
// 定制活动（weekday === '预约'）保持"定制"状态。
// 基准时间锚定到 2026-11-01，使所有派对均落在 11 月。
// ============================================
(function () {
  var now = new Date(2026, 10, 1); // 2026 年 11 月 1 日（周日）
  var WEEK_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var WEEK_NO = { '周日': 0, '周一': 1, '周二': 2, '周三': 3, '周四': 4, '周五': 5, '周六': 6 };
  var counter = {};

  // 计算从今天起第 nth 个"严格晚于今天"的指定星期几
  function nextWeekday(dayOfWeek, nth) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var diff = (dayOfWeek - d.getDay() + 7) % 7;
    if (diff === 0) diff = 7; // 今天不计入，取下一周
    d.setDate(d.getDate() + diff + (nth - 1) * 7);
    return d;
  }

  function p2(n) { return n < 10 ? '0' + n : '' + n; }

  APP_DATA.events.forEach(function (e) {
    if (e.weekday === '预约') return; // 私人定制活动不参与动态化
    var wd = WEEK_NO[e.weekday];
    if (wd === undefined) return;
    counter[wd] = (counter[wd] || 0) + 1;
    var d = nextWeekday(wd, counter[wd]);
    e.date = p2(d.getMonth() + 1) + '/' + p2(d.getDate());
    e.weekday = WEEK_CN[d.getDay()];
    e.ts = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 22, 0, 0).getTime();
  });
})();
