/* ============================================
   MIX CLUB · Home Page
   Banner Carousel + Quick Actions + Featured
   ============================================ */

const HomePage = {
  mounted: false,
  bannerIdx: 0,
  bannerTimer: null,

  destroy() {
    this.stopCarousel();
    this.mounted = false;
  },

  render() {
    const banners = APP_DATA.banners;
    const tb = TableService.current();
    const slides = banners.map(b => `
      <div class="banner-slide" style="background-image:url('${esc(b.img)}')">
        <div class="banner-content">
          <h1 class="banner-title">${esc(b.title)}</h1>
          <p class="banner-sub">${esc(b.sub)}</p>
        </div>
      </div>
    `).join('');

    const dots = banners.map((_, i) => `<span class="${i === 0 ? 'active' : ''}"></span>`).join('');

    const quickIcons = {
      queue:   '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      reserve: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 10v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6M3 10l2-5h14l2 5M3 10h18M8 18v2M16 18v2M7 14h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      table:   '<svg viewBox="0 0 24 24" fill="none"><path d="M7 3l-2 5h14l-2-5M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M9 13h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      event:   '<svg viewBox="0 0 24 24" fill="none"><path d="M5 9l2-5h10l2 5M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M5 9h14M9 14h6M9 17h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      vip:     '<svg viewBox="0 0 24 24" fill="none"><path d="M3 7l3 12h12l3-12-6 4-3-7-3 7-6-4z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      music:   '<svg viewBox="0 0 24 24" fill="none"><path d="M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      cart:    '<svg viewBox="0 0 24 24" fill="none"><path d="M3 3h2l2.5 13.4a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L21 8H6M9 21a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM18 21a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      coupon:  '<svg viewBox="0 0 24 24" fill="none"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9zM10 7v10M7 7v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      service: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9l-4 4v-4a3 3 0 0 1-1-2V6zM9 8h6M9 11h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
    const quick = APP_DATA.quickActions.map(a => `
      <a class="quick-item" data-go="${esc(a.link)}">
        <span class="quick-icon ${esc(a.cls)}">${quickIcons[a.id] || esc(a.icon)}</span>
        <strong class="quick-label">${esc(a.label)}</strong>
      </a>
    `).join('');

    const featured = APP_DATA.featured.map(f => `
      <div class="cocktail-card" data-product-id="${esc(f.id)}">
        <div class="cocktail-img" style="background-image:url('${esc(f.img)}')">
          <span class="cocktail-name">${esc(f.name)}</span>
        </div>
        <div class="cocktail-info">
          <span class="cocktail-price"><span class="sym">¥</span>${f.price}<span class="unit">/杯</span></span>
          <span class="cocktail-tag">${esc(f.tag)}</span>
        </div>
      </div>
    `).join('');

    const notices = APP_DATA.notices.map(n =>
      `<div class="notice-bar" style="margin-bottom:8px;"><span class="nt-tag">公告</span><span class="scroll">${esc(n)}</span></div>`
    ).join('');

    return `
      <!-- Banner Carousel -->
      <div class="home-banner">
        <div class="banner-track" id="bannerTrack">
          ${slides}
        </div>
        <div class="banner-dots" id="bannerDots">${dots}</div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-section">
        <div class="section-head">
          <h3 class="section-title">${t('quickService')}<small>${t('oneClick')}</small></h3>
        </div>
        <div class="quick-grid">
          ${quick}
        </div>
      </div>

      <!-- 现场服务：扫码点单 + LIVE 热播 -->
      <div class="section" style="padding-top:0;">
        <div class="section-head">
          <h3 class="section-title">${t('scanOrder')}<small>${t('liveNow')}</small></h3>
        </div>
        <div class="svc-grid">
          <div class="svc-card svc-table" id="tableEntry">
            <div class="svc-card-bg"></div>
            <div class="svc-card-ico">🪑</div>
            <div class="svc-card-body">
              <strong id="tableEntryTitle">${t('scanOrder')}</strong>
              <small id="tableEntrySub">${tb ? t('currentTable') + ' ' + esc(tb.no) + (tb.type ? ' · ' + (tb.type === 'ka' ? 'VIP' : 'Table') : '') : t('bindTable')}</small>
            </div>
            <span class="svc-card-go">${tb ? (LangService.isEn() ? 'Change →' : '换桌 →') : (LangService.isEn() ? 'Bind →' : '绑定 →')}</span>
          </div>
          <div class="svc-card svc-live" data-go="music">
            <div class="svc-card-bg"></div>
            <span class="svc-live-pulse"></span>
            <div class="svc-card-ico svc-card-ico-live">🎧</div>
            <div class="svc-card-body">
              <strong>LIVE · DJ KUMA</strong>
              <small>霓虹极光 · 在线 1.2k</small>
            </div>
            <span class="svc-card-go svc-card-go-gold">收听 →</span>
          </div>
        </div>
      </div>

      <!-- Notices -->
      <div class="section" style="padding-top:0;">
        <div class="section-head">
          <h3 class="section-title">最新动态<small>实时更新</small></h3>
        </div>
        ${notices}
      </div>

      <!-- Featured Cocktails -->
      <div class="section">
        <div class="section-head">
          <h3 class="section-title">招牌特调<small>调酒师精选</small></h3>
          <a class="section-more" data-go="menu">查看更多 →</a>
        </div>
        <div class="cocktail-scroll">
          ${featured}
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="section">
        <div class="section-head">
          <h3 class="section-title">近期派对<small>派对日历</small></h3>
          <a class="section-more" data-go="events">全部活动 →</a>
        </div>
        ${APP_DATA.events.slice(0, 3).map(e => `
          <div class="event-card" data-go="events" data-event-id="${esc(e.id)}">
            <div class="event-thumb" style="background-image:url('${esc(e.img)}')">
              <span class="date">${esc(e.date)}</span>
            </div>
            <div class="event-info">
              <h4>${esc(e.title)}</h4>
              <p>${esc(e.desc.slice(0, 36))}...</p>
              <div class="row">
                ${e.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Footer Signature -->
      <div class="page-footer">
        © 2026 MIX CLUB · 城市夜生活新坐标
        <div class="legal-line">理性饮酒 · 未成年人请勿饮酒 · 18+</div>
      </div>
    `;
  },

  mount(root) {
    root.innerHTML = this.render();
    this.bindEvents(root);
    this.startCarousel(root);
    this.mounted = true;
  },

  bindEvents(root) {
    // Quick actions / banner buttons / live 收听按钮
    root.querySelectorAll('[data-go]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const page = el.getAttribute('data-go');
        if (page) navigate(page);
      });
    });

    // 扫码点单 · 桌台绑定
    const te = root.querySelector('#tableEntry');
    if (te) te.addEventListener('click', () => this.showTableModal(root));

    // 招牌特调深链：点击直达菜单对应商品（自动切分类 + 高亮定位）
    root.querySelectorAll('[data-product-id]').forEach(card => {
      card.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const f = APP_DATA.featured.find(x => x.id === card.getAttribute('data-product-id'));
        const p = f && APP_DATA.products.find(p => p.name === f.name);
        navigate('menu', { product: p ? p.id : null });
      });
    });

    // Manual banner switch by dot
    root.querySelectorAll('#bannerDots span').forEach((dot, i) => {
      dot.addEventListener('click', () => this.goBanner(i));
    });

    // Touch swipe
    const track = root.querySelector('#bannerTrack');
    if (track) {
      let startX = 0, dx = 0;
      track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        this.stopCarousel();
      }, { passive: true });
      track.addEventListener('touchmove', e => {
        dx = e.touches[0].clientX - startX;
      }, { passive: true });
      track.addEventListener('touchend', () => {
        if (Math.abs(dx) > 50) {
          if (dx < 0) this.next();
          else this.prev();
        }
        this.startCarousel(root);
      });
    }
  },

  // 扫码点单：桌台绑定（扫码店主端桌台码）
  showTableModal(root) {
    const tb = TableService.current();
    openModal(`
      <h3 style="margin:0 0 6px;font-size:17px;">🪑 扫码点单</h3>
      <p style="margin:0 0 14px;color:var(--text-3);font-size:11px;">选择桌台号（K01-K06 · S01-S12）· 扫码绑定桌台</p>
      <input id="tableNo" type="text" placeholder="${tb ? '当前桌台 ' + esc(tb.no) : '输入桌台号，如 S03'}" autocomplete="off"
        style="width:100%;background:var(--bg-3);border:1px solid var(--line);border-radius:8px;color:var(--text-1);padding:11px 12px;font-size:14px;outline:none;box-sizing:border-box;">
      <div class="ai-chips" style="margin:10px 0;">
        ${APP_TABLES.map(t => `<button class="ai-chip" data-tb="${t.id}">${t.id}</button>`).join('')}
      </div>
      <button class="btn btn-primary btn-block" id="bindTable">绑定桌台</button>
      ${tb ? `<button class="btn btn-ghost btn-block" id="clearTable" style="margin-top:8px;">解绑当前桌台</button>` : ''}
    `);
    document.querySelectorAll('[data-tb]').forEach(c => {
      c.addEventListener('click', () => {
        const inp = document.getElementById('tableNo');
        if (inp) inp.value = c.getAttribute('data-tb');
      });
    });
    const bind = document.getElementById('bindTable');
    if (bind) bind.addEventListener('click', () => {
      const inp = document.getElementById('tableNo');
      const no = inp ? inp.value.trim() : '';
      if (!no) { toast('请输入桌台号'); return; }
      const res = TableService.bind(no);
      if (!res.ok) { toast(res.msg, 'error'); return; }
      closeModal();
      toast('已绑定桌台 ' + res.t.no + (res.t.type === 'ka' ? ' · 卡座' : ' · 散台') + ' · 下单自动关联');
      this.mount(root);
    });
    const clear = document.getElementById('clearTable');
    if (clear) clear.addEventListener('click', () => {
      TableService.clear();
      closeModal();
      toast('已解绑桌台');
      this.mount(root);
    });
  },

  startCarousel(root) {
    this.stopCarousel();
    this.bannerTimer = setInterval(() => this.next(), 3000);
  },

  stopCarousel() {
    if (this.bannerTimer) clearInterval(this.bannerTimer);
    this.bannerTimer = null;
  },

  next() {
    const total = APP_DATA.banners.length;
    this.goBanner((this.bannerIdx + 1) % total);
  },

  prev() {
    const total = APP_DATA.banners.length;
    this.goBanner((this.bannerIdx - 1 + total) % total);
  },

  goBanner(i) {
    this.bannerIdx = i;
    const track = document.getElementById('bannerTrack');
    if (track) track.style.transform = `translateX(-${i * 100}%)`;
    document.querySelectorAll('#bannerDots span').forEach((d, idx) => {
      d.classList.toggle('active', idx === i);
    });
  }
};
