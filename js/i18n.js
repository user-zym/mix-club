/* ============================================
   MIX CLUB · i18n（中英切换）
   框架级双语：导航 / 标题 / 按钮 / 空状态 / 合规
   内容数据（商品、活动等）保持中英混排，符合酒吧业态
   ============================================ */

const I18N_DICT = {
  zh: {
    appName: 'MIX CLUB',
    splashLoading: '正在加载精彩内容...',
    splashReady: '准备就绪 · 进入派对',
    splashLegal: '理性饮酒 · 未成年人禁止饮酒 · 18+',
    tabHome: '首页', tabMenu: '点餐', tabBooking: '订台', tabMe: '我的',
    titleMenu: '在线点单', titleBooking: '包厢预订', titleTableBooking: '订台选座',
    titleEvents: '派对活动', titleQueue: '排队取号', titleVip: 'VIP会员',
    titleMusic: '驻场歌单', titleCart: '购物车', titleProfile: '个人中心',
    titleLogin: '登录', titleRegister: '注册', titleMerchant: '门店管理',
    searchPlaceholder: '搜索鸡尾酒 / 套餐 / 调酒师...',
    quickService: '快捷服务', oneClick: '一键直达',
    scanOrder: '扫码点单', bindTable: '绑定桌台 · 自动关联', currentTable: '当前桌台',
    switchTable: '更换', liveNow: 'LIVE · DJ KUMA', listening: '收听 →',
    featured: '招牌特调', bartenderPick: '调酒师精选', viewMore: '查看更多 →',
    recentEvents: '近期派对', partyCalendar: '派对日历', allEvents: '全部活动 →',
    latestNews: '最新动态', realtime: '实时更新',
    footerHome: '城市夜生活新坐标', footerMenu: '精致夜生活', footerProfile: '个人中心',
    legalDrink: '理性饮酒 · 未成年人请勿饮酒 · 18+',
    cartEmpty: '购物车空空如也', cartEmptyDesc: '去菜单挑几款心仪的特调吧', goOrder: '去点单',
    goCheckout: '去结算', confirmPay: '确认支付', cancel: '取消', confirm: '确认',
    paySuccess: '支付成功', paySuccessSub: '已支付', verifyAtStore: '到店核销',
    viewOrder: '查看我的订单', orderStatusPaid: '待核销',
    menuEmpty: '暂无相关商品', menuEmptyDesc: '换个关键词或分类试试',
    myOrders: '我的订单', myBookings: '我的预订', newBooking: '新增 →',
    privacy: '隐私说明', about: '关于MIX CLUB', settings: '⚙️ 设置', logout: '退出登录',
    seatAvailable: '可选', seatSelected: '已选', seatBooked: '已订', seatSold: '已售',
    stage: '舞台', danceFloor: '舞池', bar: '吧台',
    merchantDashboard: '门店经营看板', todayOrders: '今日订单', todaySales: '今日销售',
    pendingVerify: '待核销', verifyRate: '核销率', verifyNow: '核销', tableCode: '桌台点单码',
    confirmBooking: '确认订台', selectDate: '选择日期', selectSeat: '点击任意座位完成选座',
    langLabel: '语言 / Language', langZh: '中文', langEn: 'English',
    total: '合计', items: '件商品', table: '桌台', price: '金额', payAmount: '实付',
    settingsTitle: '设置', langSwitchedZh: '已切换为中文', langSwitchedEn: '已切换为 English',
    payMethodTitle: '选择支付方式', securityPay: '🔒 安全支付 · 交易成功后凭订单号到店核销',
    drinkDriving: '🍸 理性饮酒 · 请勿酒后驾车'
  },
  en: {
    appName: 'MIX CLUB',
    splashLoading: 'Loading...',
    splashReady: 'Ready · Party On',
    splashLegal: 'Drink Responsibly · 18+ Only',
    tabHome: 'Home', tabMenu: 'Menu', tabBooking: 'Reserve', tabMe: 'Me',
    titleMenu: 'Online Menu', titleBooking: 'VIP Room', titleTableBooking: 'Reserve a Table',
    titleEvents: 'Events', titleQueue: 'Queue', titleVip: 'VIP',
    titleMusic: 'Playlist', titleCart: 'Cart', titleProfile: 'Profile',
    titleLogin: 'Sign In', titleRegister: 'Sign Up', titleMerchant: 'Store Admin',
    searchPlaceholder: 'Search cocktails / sets / bartender...',
    quickService: 'Quick Service', oneClick: 'One-Tap',
    scanOrder: 'Scan to Order', bindTable: 'Bind Table · Auto-Link', currentTable: 'Table',
    switchTable: 'Change', liveNow: 'LIVE · DJ KUMA', listening: 'Listen →',
    featured: 'Signature Cocktails', bartenderPick: "Bartender's Pick", viewMore: 'View More →',
    recentEvents: 'Upcoming Parties', partyCalendar: 'Party Calendar', allEvents: 'All Events →',
    latestNews: 'Latest News', realtime: 'Live Updates',
    footerHome: 'New Home of City Nightlife', footerMenu: 'Refined Nightlife', footerProfile: 'Profile',
    legalDrink: 'Drink Responsibly · No Minors · 18+',
    cartEmpty: 'Your cart is empty', cartEmptyDesc: 'Pick some signature drinks from the menu', goOrder: 'Go to Menu',
    goCheckout: 'Checkout', confirmPay: 'Confirm Payment', cancel: 'Cancel', confirm: 'Confirm',
    paySuccess: 'Payment Successful', paySuccessSub: 'Paid', verifyAtStore: 'verify at store',
    viewOrder: 'View My Orders', orderStatusPaid: 'Pending Verification',
    menuEmpty: 'No items found', menuEmptyDesc: 'Try another keyword or category',
    myOrders: 'My Orders', myBookings: 'My Reservations', newBooking: 'New →',
    privacy: 'Privacy', about: 'About MIX CLUB', settings: '⚙️ Settings', logout: 'Sign Out',
    seatAvailable: 'Available', seatSelected: 'Selected', seatBooked: 'Booked', seatSold: 'Sold',
    stage: 'Stage', danceFloor: 'Dance Floor', bar: 'Bar',
    merchantDashboard: 'Store Dashboard', todayOrders: 'Orders Today', todaySales: 'Sales Today',
    pendingVerify: 'Pending', verifyRate: 'Verify Rate', verifyNow: 'Verify', tableCode: 'Table QR Code',
    confirmBooking: 'Confirm Booking', selectDate: 'Select Date', selectSeat: 'Tap any seat to book',
    langLabel: 'Language', langZh: '中文', langEn: 'English',
    total: 'Total', items: 'items', table: 'Table', price: 'Amount', payAmount: 'Pay',
    settingsTitle: 'Settings', langSwitchedZh: 'Switched to 中文', langSwitchedEn: 'Switched to English',
    payMethodTitle: 'Payment Method', securityPay: '🔒 Secure Payment · verify at store with order ID',
    drinkDriving: '🍸 Drink Responsibly · Do Not Drink & Drive'
  }
};

// 语言服务
const LangService = {
  KEY: 'mix_club_lang_v1',
  current: 'zh',

  get() {
    const saved = LS.get(this.KEY, '');
    return (saved === 'en' || saved === 'zh') ? saved : 'zh';
  },

  set(lang) {
    this.current = lang === 'en' ? 'en' : 'zh';
    LS.set(this.KEY, this.current);
    document.documentElement.lang = this.current === 'en' ? 'en' : 'zh-CN';
    return this.current;
  },

  init() {
    this.current = this.get();
    document.documentElement.lang = this.current === 'en' ? 'en' : 'zh-CN';
    return this.current;
  },

  isEn() {
    return this.current === 'en';
  },

  // 文案取词：key 缺失时回退中文/回退 key 本身
  t(key) {
    const d = I18N_DICT[this.current] || I18N_DICT.zh;
    return d[key] || I18N_DICT.zh[key] || key;
  }
};

// 全局便捷函数：t('key')
function t(key) {
  return LangService.t(key);
}
