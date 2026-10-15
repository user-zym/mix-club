/* ============================================
   MIX CLUB · Utility Functions
   ============================================ */

// Toast
let toastTimer = null;
function toast(msg, duration = 2000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}

// LocalStorage helpers
const LS = {
  get(k, def = null) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : def;
    } catch (e) { return def; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); }
    catch (e) { console.warn('[LS.set] failed for', k, e); }
  },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

// Format
function fmtPrice(n) { return '¥' + Number(n).toLocaleString('zh-CN'); }
function fmtNum(n) {
  if (n > 10000) return (n / 10000).toFixed(1) + 'w';
  if (n > 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}
function pad(n) { return n < 10 ? '0' + n : '' + n; }

// Format date
function fmtDate(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

// 时间状态栏更新
function updateStatusTime() {
  const el = document.getElementById('statusTime');
  if (!el) return;
  const now = new Date();
  el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

// 购物车管理 (单例)
const Cart = {
  items: LS.get(LS_KEYS.CART, []),

  add(product, qty = 1) {
    const ex = this.items.find(i => i.id === product.id);
    if (ex) {
      ex.qty += qty;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        qty
      });
    }
    this.save();
    this.updateBadge();
    toast(`已加入购物车 · ${product.name}`);
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    this.updateBadge();
  },

  update(id, qty) {
    const it = this.items.find(i => i.id === id);
    if (!it) return;
    if (qty <= 0) {
      this.remove(id);
      return;
    }
    it.qty = qty;
    this.save();
    this.updateBadge();
  },

  total() {
    return this.items.reduce((s, i) => s + i.price * i.qty, 0);
  },

  count() {
    return this.items.reduce((s, i) => s + i.qty, 0);
  },

  clear() {
    this.items = [];
    this.save();
    this.updateBadge();
  },

  save() { LS.set(LS_KEYS.CART, this.items); },

  updateBadge() {
    const el = document.getElementById('fabCartCount');
    if (!el) return;
    const c = this.count();
    el.textContent = c;
    el.classList.toggle('hide', c === 0);
  }
};

// 用户信息
const User = {
  data: LS.get(LS_KEYS.USER, {
    name: '',
    id: '',
    avatar: 'M',
    level: 3,
    points: 12860,
    balance: 2388,
    coupons: 5,
    expiring: 60
  }),
  save() { LS.set(LS_KEYS.USER, this.data); }
};

// 应用版本号（全局唯一，避免散落多处）
const APP_VERSION = '2.8.0';

// ============================================
// 订单服务：订单持久化与状态流转
// 将"下单-落库-查询-核销"收敛为统一数据层，页面只负责展示
// ============================================
const OrderService = {
  list() {
    return LS.get(LS_KEYS.ORDERS, []);
  },
  find(id) {
    return this.list().find(o => o.id === id) || null;
  },
  create(order) {
    const orders = this.list();
    orders.unshift(order);
    LS.set(LS_KEYS.ORDERS, orders);
    return order;
  },
  updateStatus(id, status) {
    const orders = this.list();
    const o = orders.find(x => x.id === id);
    if (!o) return null;
    o.status = status;
    o.updatedAt = Date.now();
    LS.set(LS_KEYS.ORDERS, orders);
    return o;
  }
};

// ============================================
// 优惠券服务：门槛校验 + 满减/折扣计算
// 规则集中在服务层，页面按展示需要调用
// ============================================
const CouponService = {
  // 是否满足使用门槛
  eligible(coupon, subtotal) {
    return !!(coupon && subtotal >= (coupon.threshold || 0));
  },
  // 计算优惠金额（reduce=满减固定金额；discount=折扣，value 如 0.9）
  discount(coupon, subtotal) {
    if (!this.eligible(coupon, subtotal)) return 0;
    if (coupon.type === 'discount') {
      return Math.round(subtotal * (1 - coupon.value));
    }
    return Math.min(coupon.value, subtotal);
  },
  // 展示用文案：-¥50 / 9折
  label(coupon) {
    if (!coupon) return '';
    return coupon.type === 'discount'
      ? (coupon.value * 10) + '折'
      : '-¥' + coupon.value;
  }
};

// ============================================
// AI 调酒师：基于口味标签 + 场景 + 强度 + 时段的推荐引擎（规则可解释）
// 计分维度：
//   - 口味直接命中 +3 / 项
//   - 场景加成（场景偏好口味，含用户已选） +2 / 项
//   - 强度匹配 +2（软饮/标准/烈酒三档）
//   - 时段匹配 +1（晚场/凌晨/通宵）
//   - 价格区间命中 +1
//   - 招牌/热销 +1
//   - 销量微调（防止同分随机感）
// 返回结构化 reason 数组，前端可直接渲染为 chip
const AiService = {
  // 9 种口味
  TASTES: ['清爽', '果味', '浓郁', '甜', '酸', '气泡', '微醺', '无酒精', '烈'],

  // 4 个场景
  SCENES: [
    { id: 'date',   name: '约会', emoji: '💕', boosts: ['甜', '果味', '微醺', '气泡'] },
    { id: 'party',  name: '派对', emoji: '🎉', boosts: ['气泡', '清爽', '果味', '甜'] },
    { id: 'solo',   name: '独酌', emoji: '🌙', boosts: ['浓郁', '烈', '微醺'] },
    { id: 'dinner', name: '佐餐', emoji: '🍽️', boosts: ['酸', '浓郁', '清爽'] }
  ],

  // 3 档强度（产品 tags / 分类推断）
  STRENGTHS: [
    { id: 'soft',  name: '轻柔',  desc: '0酒精 / 微醺', emoji: '🫧', match: ['无酒精', '微醺', '果味', '甜'] },
    { id: 'mid',   name: '标准',  desc: '鸡尾酒 / 啤酒', emoji: '🍸', match: ['清爽', '果味', '甜', '酸', '气泡', '浓郁'] },
    { id: 'hard',  name: '烈酒',  desc: '威士忌 / 高酒精度', emoji: '🥃', match: ['烈', '浓郁', '微醺'] }
  ],

  // 3 档价格区间（基于原价 price）
  PRICES: [
    { id: 'p1', name: '百元内', min: 0,   max: 100 },
    { id: 'p2', name: '百元档', min: 100, max: 300 },
    { id: 'p3', name: '高端',   min: 300, max: 9999 }
  ],

  // 时段映射
  HOURS: [
    { id: 'evening', name: '晚场 19-23', range: [19, 23] },
    { id: 'late',    name: '凌晨 23-02', range: [23, 2]  },
    { id: 'allnight',name: '通宵 02 后', range: [2, 6]   }
  ],

  // 一键预设（首页快捷）
  PRESETS: [
    { id: 'sweetgirl', name: '甜妹首选', emoji: '🍑', tastes: ['甜', '果味'], scene: 'date',  strength: 'soft' },
    { id: 'partyhot',  name: '派对热场', emoji: '🎉', tastes: ['气泡', '清爽'], scene: 'party', strength: 'mid'  },
    { id: 'solo',      name: '独酌深夜', emoji: '🌙', tastes: ['浓郁', '烈'], scene: 'solo',  strength: 'hard' },
    { id: 'noface',    name: '不喝酒星', emoji: '🫧', tastes: ['无酒精', '果味'], scene: 'date', strength: 'soft' }
  ],

  // 推断产品强度（无显式字段，按 tags + cat 推断）
  _strengthOf(p) {
    if (p.tastes && p.tastes.indexOf('无酒精') >= 0) return 'soft';
    if (p.tastes && p.tastes.indexOf('烈') >= 0) return 'hard';
    if (p.cat === 'whisky' || p.cat === 'wine') return 'hard';
    return 'mid';
  },

  // 推断产品适用时段
  _hourOf(p) {
    if (!p.tastes) return null;
    if (p.tastes.indexOf('烈') >= 0 || p.tastes.indexOf('浓郁') >= 0) return 'late';
    if (p.tastes.indexOf('气泡') >= 0 || p.tastes.indexOf('清爽') >= 0) return 'evening';
    return 'evening';
  },

  // 推荐主入口
  // opts: { tastes: string[], sceneId: string, strengthId: string, priceId: string, hourId: string }
  recommend(opts) {
    const tastes = (opts.tastes || []).slice();
    const scene = this.SCENES.find(s => s.id === opts.sceneId) || null;
    const strength = this.STRENGTHS.find(s => s.id === opts.strengthId) || null;
    const price = this.PRICES.find(p => p.id === opts.priceId) || null;
    const hour = this.HOURS.find(h => h.id === opts.hourId) || null;

    const boosts = scene ? scene.boosts : [];
    const strengthMatch = strength ? strength.match : [];

    const ranked = [];
    APP_DATA.products.forEach(p => {
      if (!p.tastes) return; // 小食不参与口味推荐

      let score = 0;
      const reasons = [];

      // 口味直接命中
      const tasteHits = [];
      p.tastes.forEach(t => {
        if (tastes.indexOf(t) >= 0) {
          score += 3;
          tasteHits.push(t);
          reasons.push({ kind: 'taste', label: t, weight: 3 });
        }
      });

      // 场景加成（且未被用户直接选过）
      const sceneHits = [];
      boosts.forEach(t => {
        if (p.tastes.indexOf(t) >= 0 && tastes.indexOf(t) < 0) {
          score += 2;
          sceneHits.push(t);
          reasons.push({ kind: 'scene', label: t, weight: 2 });
        }
      });

      // 强度匹配
      const pStrength = this._strengthOf(p);
      if (strength && strength.id === pStrength) {
        score += 2;
        reasons.push({ kind: 'strength', label: strength.name, weight: 2 });
      }

      // 价格区间匹配
      if (price && p.price >= price.min && p.price < price.max) {
        score += 1;
        reasons.push({ kind: 'price', label: price.name, weight: 1 });
      }

      // 时段匹配
      const pHour = this._hourOf(p);
      if (hour && pHour === hour.id) {
        score += 1;
        reasons.push({ kind: 'hour', label: hour.name, weight: 1 });
      }

      // 招牌/热销
      if (p.hot) {
        score += 1;
        reasons.push({ kind: 'tag', label: '招牌', weight: 1 });
      }

      // 销量微调
      score += Math.min(0.5, p.sales / 10000);

      if (score > 0) {
        ranked.push({
          product: p,
          score: Math.round(score * 10) / 10,
          reasons,
          summary: tasteHits.length || sceneHits.length
            ? '匹配「' + tasteHits.concat(sceneHits).slice(0, 3).join('·') + '」'
            : '综合人气推荐'
        });
      }
    });

    ranked.sort((a, b) => b.score - a.score);
    const top = ranked.slice(0, 6);

    return {
      tastes,
      scene,
      strength,
      price,
      hour,
      total: ranked.length,
      results: top
    };
  },

  // 应用预设（一键调用）
  applyPreset(presetId) {
    const p = this.PRESETS.find(x => x.id === presetId);
    if (!p) return null;
    return this.recommend({
      tastes: p.tastes,
      sceneId: p.scene,
      strengthId: p.strength
    });
  },

  // 当前时间推断默认 hour
  currentHour() {
    const h = new Date().getHours();
    if (h >= 19 && h < 23) return 'evening';
    if (h >= 23 || h < 2) return 'late';
    if (h >= 2 && h < 6) return 'allnight';
    return 'evening';
  },

  savePrefs(opts) { LS.set(LS_KEYS.AI_PREFS, Object.assign({ at: Date.now() }, opts)); },
  prefs() { return LS.get(LS_KEYS.AI_PREFS, null); }
};

// ============================================
// 桌台服务：扫码点单绑定当前桌号
// ============================================
const TableService = {
  current() { return LS.get(LS_KEYS.TABLE, null); },
  // 仅允许绑定真实桌台号（K01-K06 / S01-S12，与订台页共用 APP_TABLES 数据源）
  bind(no) {
    const id = String(no).trim().toUpperCase();
    const t = APP_TABLES.find(x => x.id === id);
    if (!t) return { ok: false, msg: '桌台号不存在，仅支持 K01-K06 / S01-S12' };
    const rec = { no: t.id, type: t.type, cap: t.cap, price: t.price, vip: !!t.vip, boundAt: Date.now() };
    LS.set(LS_KEYS.TABLE, rec);
    return { ok: true, t: rec };
  },
  clear() { LS.del(LS_KEYS.TABLE); }
};

// ============================================
// 签到服务：每日签到
// ============================================
const SignService = {
  lastDate() { return LS.get(LS_KEYS.SIGN, ''); },
  today() {
    const d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  },
  // 返回 {ok, points, msg}
  checkIn() {
    const t = this.today();
    if (this.lastDate() === t) return { ok: false, points: 0, msg: '今日已签到，明天再来吧' };
    LS.set(LS_KEYS.SIGN, t);
    return { ok: true, points: 10, msg: '签到成功 +10 积分' };
  }
};

// ============================================
// 邀请服务：分享有礼（演示）
// ============================================
const InviteService = {
  // 生成邀请链接（演示：基于当前账号）
  link() {
    const phone = User.data.phone || '13800000000';
    const code = 'MIX' + phone.slice(-6);
    return '#register?ref=' + code;
  },
  // 领取演示奖励（每日限 3 次）
  claim() {
    const rec = LS.get(LS_KEYS.INVITE, { date: '', count: 0 });
    const d = new Date();
    const today = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    if (rec.date !== today) { rec.date = today; rec.count = 0; }
    if (rec.count >= 3) return { ok: false, msg: '今日分享奖励已领完（演示每日 3 次）' };
    rec.count += 1;
    LS.set(LS_KEYS.INVITE, rec);
    return { ok: true, points: 20, msg: '分享成功 +20 积分（演示）' };
  }
};

// 演示级密码摘要（FNV 双种子摘要，避免明文落盘；非加密级，仅作演示用途）
function hashPwd(pwd) {
  const s = String(pwd);
  let h1 = 0x811c9dc5, h2 = 0x01000193;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ c, 0x01000193);
    h1 = (h1 ^ h2) | 0;
  }
  return ((h1 >>> 0).toString(16) + (h2 >>> 0).toString(16)).slice(0, 16);
}

// 登录认证模块
const Auth = {
  // 是否登录
  isLogin: LS.get(LS_KEYS.USER + '_login', false),
  // 已注册账号列表（手机号 -> {pwd, name, avatar}）
  accounts: LS.get(LS_KEYS.USER + '_accounts', {}),

  // 登录
  login(phone, pwd) {
    const acc = this.accounts[phone];
    if (!acc) return { ok: false, msg: '该手机号尚未注册' };
    const hashed = hashPwd(pwd);
    if (acc.pwd !== hashed) {
      // 兼容旧版明文存储：老账号首次登录时自动迁移为摘要存储
      if (acc.pwd !== pwd) return { ok: false, msg: '密码错误，请重试' };
      acc.pwd = hashed;
      this.accounts[phone] = acc;
      LS.set(LS_KEYS.USER + '_accounts', this.accounts);
    }
    // 登录成功 - 载入用户数据
    User.data = Object.assign(User.data, acc.profile || {}, {
      phone,
      name: acc.name,
      avatar: acc.name.slice(-2).toUpperCase(),
      id: phone.slice(-8),
      level: acc.profile?.level || 1,
      points: acc.profile?.points || 100,
      balance: acc.profile?.balance || 0,
      coupons: acc.profile?.coupons || 1,
      expiring: acc.profile?.expiring || 0
    });
    User.save();
    this.isLogin = true;
    LS.set(LS_KEYS.USER + '_login', true);
    return { ok: true };
  },

  // 注册
  register(phone, pwd, name) {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { ok: false, msg: '请输入正确的手机号' };
    }
    if (!pwd || pwd.length < 6) {
      return { ok: false, msg: '密码至少 6 位' };
    }
    if (this.accounts[phone]) {
      return { ok: false, msg: '该手机号已注册，请直接登录' };
    }
    this.accounts[phone] = {
      pwd: hashPwd(pwd),
      name: name || ('用户' + phone.slice(-4)),
      avatar: (name || phone).slice(-2).toUpperCase(),
      profile: {
        level: 1,
        points: 100,          // 注册赠送积分
        balance: 0,
        coupons: 1,            // 注册送券
        expiring: 7
      },
      createdAt: Date.now()
    };
    LS.set(LS_KEYS.USER + '_accounts', this.accounts);
    // 自动登录
    return this.login(phone, pwd);
  },

  // 退出登录
  logout() {
    this.isLogin = false;
    LS.set(LS_KEYS.USER + '_login', false);
    // 清除购物车/收藏/订单之外的用户态
    toast('已退出登录');
    setTimeout(() => navigate('login'), 350);
  },

  // 重置为默认演示账号
  reset() {
    User.data = {
      name: 'KUMA',
      id: 'V-MIX-8888',
      avatar: 'M',
      level: 3,
      points: 12860,
      balance: 2388,
      coupons: 5,
      expiring: 60
    };
    User.save();
    this.isLogin = true;
    LS.set(LS_KEYS.USER + '_login', true);
  }
};

// 页面切换
function navigate(pageName, opts = {}) {
  if (!pageName) return;
  const app = window.MIX_APP;
  if (app && app.go) app.go(pageName, opts);
}

// 防抖
function debounce(fn, delay = 200) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

// HTML escape (简单)
function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

// Modal helper
function openModal(html, opts) {
  let mask = document.getElementById('modalMask');
  // modal 不在 app-container 内，而是 fixed 浮在 viewport 上，避免被 app overflow:hidden 裁剪
  if (!mask || mask.parentElement !== document.body) {
    if (mask) mask.remove();
    mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.id = 'modalMask';
    document.body.appendChild(mask);
  }
  // remove existing modal
  const old = mask.querySelector('.modal');
  if (old) old.remove();

  const m = document.createElement('div');
  m.className = 'modal' + (opts && opts.wide ? ' modal-wide' : '');
  m.innerHTML = html;
  mask.appendChild(m);
  requestAnimationFrame(() => {
    mask.classList.add('show');
    m.classList.add('show');
  });
}
function closeModal() {
  let mask = document.getElementById('modalMask');
  if (!mask) mask = document.querySelector('.modal-mask');
  if (!mask) return;
  const m = mask.querySelector('.modal');
  if (m) m.classList.remove('show');
  mask.classList.remove('show');
  setTimeout(() => {
    // 只移除本次关闭的 modal；若期间已打开新弹窗（旧 modal 已被 openModal 移除），则不动
    if (m && m.parentElement === mask) m.remove();
  }, 300);
}

// 二维码 SVG 生成：优先自研真 QR（可扫描），超长/不可用时降级为哈希图案
function generateQRCodeSVG(seed, size = 180) {
  const text = String(seed);
  if (typeof QRCode !== 'undefined' && QRCode.encode && QRCode.encode(text)) {
    return QRCode.toSVG(text, size);
  }
  // 降级：哈希伪网格（仅视觉，非可扫描）
  const N = 25;
  const cells = [];
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  // 加时间戳微扰，保证每次生成不同但同 seed 稳定
  let r = Math.abs(h);
  const next = () => {
    r = (r * 1103515245 + 12345) & 0x7fffffff;
    return r / 0x7fffffff;
  };
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const inFinder = (
        (x < 7 && y < 7) ||
        (x >= N - 7 && y < 7) ||
        (x < 7 && y >= N - 7)
      );
      let isBlack;
      if (inFinder) {
        // 三个角的定位标记
        const lx = x >= N - 7 ? x - (N - 7) : x;
        const ly = y >= N - 7 ? y - (N - 7) : y;
        const onEdge = lx === 0 || lx === 6 || ly === 0 || ly === 6;
        const inner = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
        isBlack = onEdge || inner;
      } else {
        isBlack = next() > 0.52;
      }
      if (isBlack) cells.push([x, y]);
    }
  }
  const cellSize = size / N;
  let rects = '';
  for (const [x, y] of cells) {
    rects += `<rect x="${(x * cellSize).toFixed(2)}" y="${(y * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" />`;
  }
  // 中心 logo 占位
  const logoSize = cellSize * 5;
  const logoX = (size - logoSize) / 2;
  const logoY = (size - logoSize) / 2;
  const logo = `
    <rect x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" rx="${cellSize}" fill="#fff"/>
    <rect x="${logoX + cellSize * 0.5}" y="${logoY + cellSize * 0.5}" width="${logoSize - cellSize}" height="${logoSize - cellSize}" rx="${cellSize * 0.6}" fill="#000"/>
    <text x="${size / 2}" y="${logoY + logoSize / 2 + cellSize * 0.9}" text-anchor="middle" fill="#fff" font-size="${cellSize * 1.6}" font-weight="800" font-family="-apple-system,sans-serif">¥</text>
  `;
  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" class="qr-svg" aria-label="支付二维码">
    <rect width="${size}" height="${size}" fill="#fff"/>
    <g fill="#000">${rects}</g>
    ${logo}
  </svg>`;
}

// 全局点击 modal 外部关闭
document.addEventListener('click', e => {
  if (e.target.id === 'modalMask') closeModal();
});

// 启动状态栏时钟
setInterval(updateStatusTime, 30000);
updateStatusTime();
