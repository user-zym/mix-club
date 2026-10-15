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
    drinkDriving: '🍸 理性饮酒 · 请勿酒后驾车',
    heroSeatDesc: '散台 S · 卡座 K · 即点即订 · 锁定最佳视角', statsBooked: '已订/售',
    seatMapTitle: '座位图', tapSeatHint: '点击任意座位完成选座',
    zoneKa: '卡座 K', zoneSan: '散台 S', vipSeat: 'VIP 卡座', allZone: '全部',
    verifyHint1: '预订后到吧台/前台出示手机号或订单号核销', verifyHint2: '卡座含开台套餐（人均低消），散台免低消',
    footerTableBooking: '散台 / 卡座在线订台', soldToast: '该桌台已售，无法预订', pickDateToast: '请先选择日期',
    goSelect: '去选择', filterTables: '筛选桌台', filterHint: '点击切换类型', totalTables: '总桌台',
    footerRoomBooking: '包厢在线预订', roomsAvailable: '包厢可选', bookable: '可预订', soldOut: '已售出',
    featuredRooms: '推荐包厢', roomsCountSuffix: '款可选', pickRoomHint: '选择下方包厢完成预订',
    confirmBookingRoom: '确认预订', roomWord: '包厢', pickRoomFirst: '请选择包厢', dateWord: '日期',
    roomSelected: '已选择包厢', hotTag: '热门', fullTag: '已满', bookingDiscount: '提前预订享 8 折 · 生日派对可享专属布置',
    points: '积分', coupons: '优惠券', reservations: '预订', balance: '余额', goldMember: '黄金会员',
    dailyCheckin: '每日签到', pointsMall: '积分商城', inviteFriends: '邀请好友', myCoupons: '我的优惠券',
    pointsHistory: '积分明细', myWallet: '我的钱包', myAddress: '收货地址', support: '在线客服', storeAdmin: '门店管理',
    footerProfile: '个人中心', cancelled: '已取消', confirmed: '已确认', completed: '已完成',
    orderDetail: '订单详情', orderNo: '订单号', payMethod2: '支付方式',
    noOrders: '暂无订单，去点一杯吧', orderNotExist: '订单不存在', payOther: '其他', cancelBk: '取消预订',
    payTimerPrefix: '秒后自动确认到账', cancelPay: '取消支付', paidDone: '我已支付',
    qLiveTag: '实时排队', qCurrent: '当前排队', qAhead: '位', qChannel: '排队通道', qPhone: '联系方式',
    qSubmit: '立即取号', qRulesAgree: '提交即视为同意《排队规则》', qRules: '排队规则', qHistory: '历史取号',
    qCancel: '取消取号', qCancelConfirm: '确认取消取号？', qCancelDone: '已取消取号',
    qYourNo: '您的排队序号', qQueueType: '排队类型', qVip: '👑 VIP 通道', qNormal: '🍸 普通排队',
    qRemind: '🔔 到号提醒 · 叫号后请 5 分钟内到店核销，过号顺延 3 位',
    qSoon: '即将叫号', qSoon2: '即将叫号，请保持手机畅通', qHigh: '排队高峰，可先点单节省时间',
    qSuccess: '取号成功', qFreshOk: '已刷新最新排队进度',
    loginTitle: '登录 MIX CLUB', loginSub: '登录以查看会员积分、订单与专属权益',
    phoneLabel: '手机号', pwdLabel: '密码', forgotPwd: '忘记密码?', otherLogin: '其他方式登录',
    registerNow: '立即注册', useGuest: '或点击直接使用会员账号登录', useGuestBtn: '直接使用会员账号登录',
    merchantRealtime: '实时数据', merchantSub: 'MIX CLUB · 经营数据实时看板',
    verifyDesk: '核销台', verifyDeskSub: '输入顾客订单号 · 扫码核销', tableQr: '桌台点单码',
    tableQrSub: '顾客扫码 → 自动绑定桌台', verifyConfirmTitle: '确认核销订单？', verifyConfirmBtn: '确认核销',
    verifySuccess: '核销成功 · 订单已完成', turnoverTitle: '桌台翻台率', turnoverSub: '已核销桌台订单 ÷ 桌台总数',
    verifyHintLine: '订单核销码由顾客端「我的订单」生成，本台输入订单号即可完成核销。', unitOrders: '单',
    vipBenefits: '会员权益', myCards: '我的卡券',
    orderPending: '待支付', orderProcessing: '处理中', notSignedIn: '您还未登录', signInNow: '立即登录', guestName: '用户',
    orderTime: '下单时间', itemsAmount: '商品金额', pointsReward: '积分回馈', verifyCode: '到店核销码',
    showToStaff: '向店员出示本码 · 到店核销', completeVerify: '完成核销 · 订单完成', cancelOrder: '取消订单',
    closeBtn: '关闭', doneToast: '订单已完成核销', cancelToast: '订单已取消',
    qPeople: '选择人数', qName: '姓名', qNotify: '叫号时会通知您', qDescNormal: '散座 / 卡座，按序安排', qDescVip: '优先安排，钻石会员专属',
    estWait: '预计等待', avgPerTable: '分钟/桌', qPhoneLabel: '11 位手机号',
    loginSuccess: '已登录会员账号', accountHint: '会员账号：', accountFree: '13800000000 / 123456'
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
    drinkDriving: '🍸 Drink Responsibly · Do Not Drink & Drive',
    heroSeatDesc: 'Tables S · VIP K · Instant Booking', statsBooked: 'Booked/Sold',
    seatMapTitle: 'Seat Map', tapSeatHint: 'Tap any seat to book',
    zoneKa: 'VIP K', zoneSan: 'Table S', vipSeat: 'VIP Booth', allZone: 'All',
    verifyHint1: 'Show phone or order ID at bar to verify', verifyHint2: 'VIP includes opening package; tables no minimum',
    footerTableBooking: 'Tables & VIP Online Booking', soldToast: 'This seat is sold out', pickDateToast: 'Select a date first',
    goSelect: 'Select', filterTables: 'Filter Tables', filterHint: 'Tap to switch type', totalTables: 'Total',
    footerRoomBooking: 'VIP Room Online Booking', roomsAvailable: 'rooms available', bookable: 'Bookable', soldOut: 'Sold Out',
    featuredRooms: 'Featured Rooms', roomsCountSuffix: 'options', pickRoomHint: 'Pick a room below to book',
    confirmBookingRoom: 'Confirm Booking', roomWord: 'Room', pickRoomFirst: 'Select a room', dateWord: 'Date',
    roomSelected: 'Room selected', hotTag: 'Hot', fullTag: 'Full', bookingDiscount: 'Book early for 20% off · birthday setups on request',
    points: 'Points', coupons: 'Coupons', reservations: 'Reservations', balance: 'Balance', goldMember: 'Gold Member',
    dailyCheckin: 'Daily Check-in', pointsMall: 'Points Mall', inviteFriends: 'Invite Friends', myCoupons: 'My Coupons',
    pointsHistory: 'Points History', myWallet: 'My Wallet', myAddress: 'Address', support: 'Support', storeAdmin: 'Store Admin',
    footerProfile: 'Profile', cancelled: 'Cancelled', confirmed: 'Confirmed', completed: 'Completed',
    orderDetail: 'Order Details', orderNo: 'Order ID', payMethod2: 'Payment Method',
    noOrders: 'No orders yet — grab a drink', orderNotExist: 'Order not found', payOther: 'Other', cancelBk: 'Cancel',
    payTimerPrefix: 's auto-confirm', cancelPay: 'Cancel', paidDone: 'I Have Paid',
    qLiveTag: 'Live Queue', qCurrent: 'In Queue', qAhead: 'ahead', qChannel: 'Queue Channel', qPhone: 'Contact',
    qSubmit: 'Get Ticket Now', qRulesAgree: 'Submit = agree to Queue Rules', qRules: 'Queue Rules', qHistory: 'History',
    qCancel: 'Cancel Ticket', qCancelConfirm: 'Cancel this ticket?', qCancelDone: 'Ticket cancelled',
    qYourNo: 'Your Queue No.', qQueueType: 'Queue Type', qVip: '👑 VIP Lane', qNormal: '🍸 Regular Queue',
    qRemind: '🔔 Arrive within 5 mins of call; 3 places back if missed',
    qSoon: 'Calling Soon', qSoon2: 'Calling soon — keep phone on', qHigh: 'Peak hours — order first to save time',
    qSuccess: 'Ticket issued', qFreshOk: 'Queue updated',
    loginTitle: 'Sign In to MIX CLUB', loginSub: 'Sign in for points, orders & perks',
    phoneLabel: 'Phone', pwdLabel: 'Password', forgotPwd: 'Forgot password?', otherLogin: 'Or sign in with',
    registerNow: 'Sign Up Now', useGuest: 'or sign in with the member account', useGuestBtn: 'Use the member account directly',
    merchantRealtime: 'Realtime', merchantSub: 'MIX CLUB · Live Dashboard',
    verifyDesk: 'Verification Desk', verifyDeskSub: 'Enter order ID or scan', tableQr: 'Table QR',
    tableQrSub: 'Scan → auto-bind table', verifyConfirmTitle: 'Verify this order?', verifyConfirmBtn: 'Confirm',
    verifySuccess: 'Verified · order completed', turnoverTitle: 'Table Turnover', turnoverSub: 'Verified table orders ÷ total tables',
    verifyHintLine: 'Verify codes come from customer Orders page; enter the ID here.', unitOrders: 'orders',
    vipBenefits: 'VIP Benefits', myCards: 'My Cards',
    orderPending: 'Pending Payment', orderProcessing: 'Processing', notSignedIn: 'Not signed in yet', signInNow: 'Sign In Now', guestName: 'Guest',
    orderTime: 'Placed At', itemsAmount: 'Items Total', pointsReward: 'Points Earned', verifyCode: 'Verify Code',
    showToStaff: 'Show this code at the counter', completeVerify: 'Complete Verify', cancelOrder: 'Cancel Order',
    closeBtn: 'Close', doneToast: 'Order verified', cancelToast: 'Order cancelled',
    qPeople: 'Party Size', qName: 'Name', qNotify: 'We will notify you when called', qDescNormal: 'Tables & booths, in order', qDescVip: 'Priority, diamond members only',
    estWait: 'Est. wait', avgPerTable: 'min/table', qPhoneLabel: '11-digit phone',
    loginSuccess: 'Signed in as member', accountHint: 'Member account: ', accountFree: '13800000000 / 123456'
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
