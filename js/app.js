/* ============================================
   MIX CLUB · Main App Router
   ============================================ */

(function () {
  'use strict';

  const PAGES = ['home', 'menu', 'tablebooking', 'booking', 'events', 'queue', 'vip', 'music', 'cart', 'profile', 'login', 'register', 'merchant'];
  const TABS = ['home', 'menu', 'tablebooking', 'events', 'queue', 'profile'];
  const TITLES = {
    home: 'MIX CLUB',
    menu: '在线点单',
    booking: '包厢预订',
    tablebooking: '订台选座',
    events: '派对活动',
    queue: '排队取号',
    vip: 'VIP会员',
    music: '驻场歌单',
    cart: '购物车',
    profile: '个人中心',
    login: '登录',
    register: '注册',
    merchant: '门店管理'
  };

  const PAGE_RENDERERS = {
    home: HomePage,
    menu: MenuPage,
    booking: BookingPage,
    tablebooking: TableBookingPage,
    events: EventsPage,
    queue: QueuePage,
    vip: VipPage,
    music: MusicPage,
    cart: CartPage,
    profile: ProfilePage,
    login: LoginPage,
    register: RegisterPage,
    merchant: MerchantPage
  };

  let currentPage = null;
  let history = ['home'];
  const MAX_HISTORY = 30;

  function setTitle(page) {
    const topTitle = document.getElementById('topBarTitle');
    const topBar = document.getElementById('topBar');
    if (topTitle) topTitle.textContent = TITLES[page] || 'MIX CLUB';
    // login/register/music/cart/vip 这些非 tab 页隐藏 top-bar 返回
    const isFull = ['login', 'register', 'music'].includes(page);
    if (topBar) topBar.style.display = isFull ? 'none' : '';
    if (topBar) topBar.classList.toggle('has-back', !TABS.includes(page) && history.length > 1);
  }

  function setActiveTab(page) {
    document.querySelectorAll('.tab-item').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === page);
    });
    // 隐藏tabbar在 cart/vip/music 页面
    const tabBar = document.getElementById('tabBar');
    if (tabBar) tabBar.style.display = TABS.includes(page) ? '' : 'none';
    const fab = document.getElementById('fabCart');
    if (fab) fab.style.display = TABS.includes(page) ? '' : 'none';
  }

  function go(page, opts = {}) {
    if (!PAGES.includes(page)) return;
    if (page === currentPage) {
      // 首次进入该页面时也会早退。允许 opts.force 强制渲染，用于外部 reset/refresh。
      if (!opts.force) return;
    }

    // 离开上一页：清理页面级资源（轮播/计时器/音乐进度等）
    const prevRenderer = PAGE_RENDERERS[currentPage];
    if (prevRenderer && typeof prevRenderer.destroy === 'function') {
      try { prevRenderer.destroy(); } catch (e) { /* ignore */ }
    }

    const prevPage = currentPage;
    currentPage = page;
    // history 去重：连续相同页面不重复入栈
    if (history[history.length - 1] !== page) history.push(page);
    if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);

    const root = document.querySelector('[data-page="' + page + '"]');
    const prevRoot = document.querySelector('[data-page="' + prevPage + '"]');

    if (root) {
      // 渲染页面
      const renderer = PAGE_RENDERERS[page];
      if (renderer && renderer.mount) {
        renderer.mount(root, opts);
      }

      // 切换显示
      if (prevRoot) prevRoot.classList.remove('active');
      // 立即激活并淡入
      root.style.transform = 'translateX(20px)';
      root.style.opacity = '0';
      root.classList.add('active');

      // 强制 reflow
      void root.offsetWidth;
      requestAnimationFrame(() => {
        root.style.transform = '';
        root.style.opacity = '';
      });

      // 滚动顶部
      root.scrollTop = 0;
    }

    setTitle(page);
    setActiveTab(page);
  }

  function back() {
    if (history.length <= 1) {
      navigate('home');
      return;
    }
    goBackSmart();
  }

  // 智能返回：有上一页就返回，否则回首页
  function goBackSmart() {
    if (history.length <= 1) {
      navigate('home');
      return;
    }
    history.pop(); // 移除当前页
    const prev = history[history.length - 1];
    if (!prev || prev === currentPage) {
      // 容错：跳 home
      history = ['home'];
      navigate('home');
      return;
    }

    const fromRoot = document.querySelector('[data-page="' + currentPage + '"]');
    const root = document.querySelector('[data-page="' + prev + '"]');

    // 清理当前页资源
    const curRenderer = PAGE_RENDERERS[currentPage];
    if (curRenderer && typeof curRenderer.destroy === 'function') {
      try { curRenderer.destroy(); } catch (e) { /* ignore */ }
    }

    // 强制滚动并显示上一页
    if (fromRoot) {
      fromRoot.classList.remove('active');
      fromRoot.style.transform = '';
      fromRoot.style.opacity = '';
    }
    if (root) {
      const renderer = PAGE_RENDERERS[prev];
      if (renderer && renderer.mount) renderer.mount(root);
      root.classList.add('active');
      root.style.transform = '';
      root.style.opacity = '';
      root.scrollTop = 0;
    }
    currentPage = prev;
    setTitle(prev);
    setActiveTab(prev);
  }

  function init() {
    // Bind tab bar
    document.querySelectorAll('.tab-item').forEach(t => {
      t.addEventListener('click', e => {
        e.preventDefault();
        const tab = t.getAttribute('data-tab');
        if (tab) go(tab);
      });
    });

    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.addEventListener('click', () => back());

    // Search btn
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.addEventListener('click', () => {
      if (currentPage === 'menu') return;
      go('menu');
    });

    // Notification btn
    const notifBtn = document.getElementById('notifBtn');
    if (notifBtn) notifBtn.addEventListener('click', () => {
      openModal(`
        <h3 style="margin:0 0 14px;">消息中心</h3>
        ${[
          { ic: '🎉', t: '派对通知', d: 'EDM 狂潮之夜即将开始', time: '5分钟前' },
          { ic: '🍸', t: '订单完成', d: '您的鸡尾酒已调制完成', time: '30分钟前' },
          { ic: '👑', t: 'VIP升级', d: '恭喜您即将升级为钻石会员', time: '2小时前' },
          { ic: '🎁', t: '优惠券到账', d: '生日特惠券已发放到您的账户', time: '1天前' }
        ].map(n => `
          <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);">
            <div style="font-size:24px;">${esc(n.ic)}</div>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <strong style="font-size:13px;">${esc(n.t)}</strong>
                <small style="color:var(--text-4);">${esc(n.time)}</small>
              </div>
              <small style="color:var(--text-3);font-size:12px;">${esc(n.d)}</small>
            </div>
          </div>
        `).join('')}
      `);
    });

    // FAB Cart
    const fab = document.getElementById('fabCart');
    if (fab) fab.addEventListener('click', () => go('cart'));

    // 初始badge
    Cart.updateBadge();

    // 默认页 hash
    const hash = (location.hash || '').replace('#', '');
    if (hash && PAGES.includes(hash)) {
      go(hash);
    } else {
      go('home');
    }

    // 监听 hashchange
    window.addEventListener('hashchange', () => {
      const h = (location.hash || '').replace('#', '');
      if (h && PAGES.includes(h) && h !== currentPage) go(h);
    });

    // 订台 tab "新功能" 角标
    initTableBookingBadge();

    // 启动页加载流程
    runSplash();
  }

  // 订台 tab 角标：首次进入显示"新"，进入后消失
  function initTableBookingBadge() {
    const badge = document.getElementById('tabTbBadge');
    if (!badge) return;
    const seen = LS.get('TB_TAB_SEEN', false);
    if (!seen) {
      badge.textContent = '新';
      badge.classList.add('show');
    }
    // 点击订台 tab 后清除角标
    const tab = document.querySelector('.tab-item[data-tab="tablebooking"]');
    if (tab) {
      tab.addEventListener('click', () => {
        if (!LS.get('TB_TAB_SEEN', false)) {
          LS.set('TB_TAB_SEEN', true);
          badge.classList.remove('show');
        }
      }, { once: true });
    }
  }

  // 启动页控制
  function runSplash() {
    const splash = document.getElementById('splash');
    const bar = document.getElementById('splashBar');
    const tip = document.getElementById('splashTip');
    const app = document.getElementById('app');
    if (!splash) return;

    const tips = [
      '正在加载精彩内容...',
      '正在调配招牌鸡尾酒...',
      'DJ 已就位 · 灯光就绪...',
      '派对即将开始...'
    ];

    let progress = 0;
    let tipIdx = 0;
    let tick = null;
    let removed = false;

    function cleanupSplash() {
      if (tick) { clearInterval(tick); tick = null; }
      if (!removed && splash.parentNode) {
        removed = true;
        splash.parentNode.removeChild(splash);
      }
    }

    // 进度条动画 - 总耗时约 2.5s
    tick = setInterval(() => {
      progress += Math.random() * 12 + 4;
      if (progress >= 100) {
        progress = 100;
        if (tick) { clearInterval(tick); tick = null; }
        // 加载完毕，切换文案并淡出
        if (tip) tip.textContent = '准备就绪 · 进入派对';
        setTimeout(finishSplash, 350);
      } else if (progress > (tipIdx + 1) * 25 && tipIdx < tips.length - 1) {
        tipIdx++;
        if (tip) tip.textContent = tips[tipIdx];
      }
      if (bar) bar.style.width = progress + '%';
    }, 120);

    function finishSplash() {
      if (splash) splash.classList.add('hide');
      if (app) app.style.opacity = '1';
      // 启动页结束：渲染首页内容
      // 注：init() 末尾的 go('home') 会触发渲染，这里再加一层保险（页面如果仍为空，强制挂载）
      setTimeout(() => {
        const homeRoot = document.querySelector('[data-page="home"]');
        if (homeRoot && homeRoot.children.length === 0 && typeof HomePage !== 'undefined' && HomePage.mount) {
          HomePage.mount(homeRoot);
          if (currentPage !== 'home') currentPage = 'home';
        }
      }, 50);
      // 移除 DOM（动画结束后）
      setTimeout(cleanupSplash, 900);
    }
  }

  // 暴露给全局
  window.MIX_APP = { go, back, goBackSmart, navigate: (p) => go(p) };

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
