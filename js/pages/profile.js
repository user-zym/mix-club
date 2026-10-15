/* ============================================
   MIX CLUB · Profile Page
   个人中心 + 我的订单 + 设置
   ============================================ */

const ProfilePage = {
  render() {
    if (!Auth.isLogin) {
      return `
        <div class="auth-gate">
          <div class="auth-gate-illu">🎤</div>
          <h2>${t('notSignedIn')}</h2>
          <p>${t('loginSub')}</p>
          <button class="btn btn-primary btn-block" id="gateLogin">${t('signInNow')}</button>
          <button class="btn btn-ghost btn-block" id="gateRegister" style="margin-top:10px;">${t('registerNow')}</button>
          <div class="auth-gate-demo" id="gateDemo">${t('useGuest')} →</div>
        </div>
      `;
    }

    const u = User.data;
    const bookings = LS.get(LS_KEYS.BOOKINGS, []);
    const orders = OrderService.list();

    const lv = APP_DATA.vipLevels.find(l => l.lvl === u.level);

    return `
      <!-- Header -->
      <div class="profile-header">
        <div class="profile-top">
          <div class="profile-avatar">${esc(u.avatar)}</div>
          <div class="profile-info">
            <h2 class="profile-name">${esc(u.name) || t('guestName')}</h2>
            <p>${esc(lv.name)} · ID ${esc(u.id) || '-'}</p>
          </div>
        </div>
        <div class="profile-stats">
          <div class="stat"><b>${u.points}</b><small>${t('points')}</small></div>
          <div class="stat"><b>${u.coupons}</b><small>${t('coupons')}</small></div>
          <div class="stat"><b>${bookings.length}</b><small>${t('reservations')}</small></div>
          <div class="stat"><b>${u.balance}</b><small>${t('balance')}</small></div>
        </div>
      </div>

      <!-- My Bookings -->
      ${bookings.length > 0 ? `
        <div class="section">
          <div class="section-head">
            <h3 class="section-title">${t('myBookings')}<small>${bookings.length} ${LangService.isEn() ? 'items' : '条'}</small></h3>
            <a class="section-more" data-go="booking">${t('newBooking')}</a>
          </div>
          ${bookings.slice(0, 3).map(b => `
            <div class="event-card" style="margin-bottom:8px;">
              <div class="event-thumb" style="background:linear-gradient(135deg,#d4af37,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:24px;">📅</div>
              <div class="event-info">
                <h4>${esc(b.room || b.table)}</h4>
                <p>${esc(b.date)}${b.time ? ' ' + esc(b.time) : ''} · ${b.type === 'table' ? t('table') : t('roomWord')}</p>
                <div class="row">
                  ${b.status === 'cancelled'
                    ? '<span class="chip" style="background:rgba(120,120,120,.15);color:#999;">' + t('cancelled') + '</span>'
                    : '<span class="chip green">' + t('confirmed') + '</span>'}
                  <span style="color:var(--gold-2);font-weight:700;">¥${b.price}</span>
                </div>
                ${b.status !== 'cancelled' ? `
                <div style="margin-top:8px;display:flex;gap:8px;">
                  <button class="btn btn-ghost" style="padding:5px 12px;font-size:11px;" data-cancel-bk="${esc(b.id)}">${t('cancelBk')}</button>
                  <span style="font-size:10px;color:var(--text-4);align-self:center;">${b.type === 'table' ? (LangService.isEn() ? 'Table released on cancel' : '取消后该桌台即时释放') : (LangService.isEn() ? 'Room released on cancel' : '取消后包厢即时释放')}</span>
                </div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- My Orders -->
      ${orders.length > 0 ? `
        <div class="section">
          <div class="section-head">
            <h3 class="section-title">${t('myOrders')}<small>${orders.length} ${LangService.isEn() ? 'orders' : '单'}</small></h3>
            <a class="section-more" data-go="cart">${LangService.isEn() ? 'Order →' : '去下单 →'}</a>
          </div>
          ${orders.slice(0, 3).map(o => this.orderCard(o)).join('')}
        </div>
      ` : ''}

      <!-- Settings List -->
      <div class="menu-list-card">
        <div class="menu-list-item" id="goOrders">
          <div class="ico" style="background:rgba(7,193,96,.15);">🧾</div>
          <span class="text">${t('myOrders')}</span>
          <span class="extra">${orders.length}${LangService.isEn() ? ' orders' : '单'}</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goSign">
          <div class="ico" style="background:rgba(250,204,21,.15);">📅</div>
          <span class="text">${t('dailyCheckin')}</span>
          <span class="extra">+10积分/天</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goMall">
          <div class="ico" style="background:rgba(16,185,129,.15);">🎁</div>
          <span class="text">${t('pointsMall')}</span>
          <span class="extra">${this.mallItems().length} 件好礼</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goInvite">
          <div class="ico" style="background:rgba(99,102,241,.15);">📣</div>
          <span class="text">${t('inviteFriends')}</span>
          <span class="extra">享 200 积分</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goCoupons">
          <div class="ico" style="background:rgba(212,175,55,.15);">🎟️</div>
          <span class="text">${t('myCoupons')}</span>
          <span class="extra">${u.coupons}张可用</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goPoints">
          <div class="ico" style="background:rgba(124,58,237,.15);">⭐</div>
          <span class="text">${t('pointsHistory')}</span>
          <span class="extra">${fmtNum(u.points)}</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goWallet">
          <div class="ico" style="background:rgba(34,211,238,.15);">💳</div>
          <span class="text">${t('myWallet')}</span>
          <span class="extra">¥${u.balance}</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goAddress">
          <div class="ico" style="background:rgba(16,185,129,.15);">📍</div>
          <span class="text">${t('myAddress')}</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goHelp">
          <div class="ico" style="background:rgba(255,45,111,.15);">💬</div>
          <span class="text">${t('support')}</span>
          <span class="extra">7×24h</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goMerchant">
          <div class="ico" style="background:rgba(212,175,55,.15);">📊</div>
          <span class="text">${t('storeAdmin')}</span>
          <span class="extra">${t('merchantDashboard')} · ${t('verifyNow')}</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goAbout">
          <div class="ico" style="background:rgba(245,158,11,.15);">ℹ️</div>
          <span class="text">${t('about')}</span>
          <span class="extra">v${APP_VERSION}</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-list-item" id="goPrivacy">
          <div class="ico" style="background:rgba(16,185,129,.15);">🔐</div>
          <span class="text">${t('privacy')}</span>
          <span class="arrow">›</span>
        </div>
      </div>

      <div class="menu-list-card">
        <div class="menu-list-item" id="goSettings" style="justify-content:center;color:var(--text-2);">
          <span class="text">${t('settings')}</span>
        </div>
        <div class="menu-list-item" id="logoutBtn" style="justify-content:center;color:var(--pink);">
          <span class="text">${t('logout')}</span>
        </div>
      </div>

      <div class="page-footer">
        © 2026 MIX CLUB · ${t('footerProfile')}
      </div>
    `;
  },

  mount(root) {
    root.innerHTML = this.render();
    this.bindEvents(root);
  },

  bindEvents(root) {
    // 未登录分支
    const gateLogin = document.getElementById('gateLogin');
    const gateRegister = document.getElementById('gateRegister');
    const gateDemo = document.getElementById('gateDemo');
    if (gateLogin) {
      gateLogin.onclick = () => navigate('login');
      if (gateRegister) gateRegister.onclick = () => navigate('register');
      if (gateDemo) gateDemo.onclick = () => {
        Auth.reset();
        toast('已登录体验账号');
        setTimeout(() => navigate('profile'), 400);
      };
      return;
    }

    // nav
    root.querySelectorAll('[data-go]').forEach(el => {
      el.addEventListener('click', () => navigate(el.getAttribute('data-go')));
    });

    const map = {
      'goOrders': () => this.showOrders(),
      'goSign': () => this.showSign(),
      'goMall': () => this.showMall(),
      'goInvite': () => this.showInvite(),
      'goMerchant': () => navigate('merchant'),
      'goCoupons': () => toast(`你有 ${User.data.coupons} 张优惠券待使用`),
      'goPoints': () => this.showPoints(),
      'goWallet': () => this.showWallet(),
      'goAddress': () => this.showAddress(),
      'goHelp': () => this.showHelp(),
      'goAbout': () => this.showAbout(),
      'goPrivacy': () => this.showPrivacy(),
      'goSettings': () => this.showSettings(),
      'logoutBtn': () => this.logout()
    };

    Object.keys(map).forEach(id => {
      const el = root.querySelector('#' + id);
      if (el) el.addEventListener('click', map[id]);
    });


    // 订单卡片 → 详情
    root.querySelectorAll('[data-order]').forEach(el => {
      el.addEventListener('click', () => this.showOrderDetail(el.getAttribute('data-order')));
    });

    // 取消预订 → 释放桌台/包厢占用
    root.querySelectorAll('[data-cancel-bk]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const id = el.getAttribute('data-cancel-bk');
        this.confirmCancelBooking(id);
      });
    });
  },

  confirmCancelBooking(id) {
    const bookings = LS.get(LS_KEYS.BOOKINGS, []);
    const b = bookings.find(x => x.id === id);
    if (!b) { toast('预订不存在'); return; }
    openModal(`
      <div style="text-align:center;padding:4px 2px;">
        <div style="font-size:42px;margin-bottom:10px;">🗓️</div>
        <h3 style="margin:0 0 6px;font-size:17px;">确认取消预订？</h3>
        <p style="margin:0 0 4px;color:var(--text-3);font-size:12px;">${esc(b.room || b.table)} · ${esc(b.date)}${b.time ? ' ' + esc(b.time) : ''}</p>
        <p style="margin:0 0 18px;color:var(--text-3);font-size:11px;">${b.type === 'table' ? '取消后该桌台将被释放，可被其他顾客预订' : '取消后该包厢将被释放，可被其他顾客预订'}</p>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-ghost btn-block" style="flex:1;" onclick="closeModal()">保留预订</button>
          <button class="btn btn-primary btn-block" style="flex:1;" id="okCancelBk">确认取消</button>
        </div>
      </div>
    `);
    const ok = document.getElementById('okCancelBk');
    if (ok) ok.onclick = () => {
      b.status = 'cancelled';
      LS.set(LS_KEYS.BOOKINGS, bookings);
      closeModal();
      toast('预订已取消 · 座位已释放');
      this.refresh();
    };
  },

  // ---------- 订单中心 ----------
  orderStatusLabel(o) {
    return { pending: t('orderPending'), paid: t('orderStatusPaid'), completed: t('completed'), cancelled: t('cancelled') }[o.status] || t('orderProcessing');
  },
  orderChip(o) {
    const label = this.orderStatusLabel(o);
    if (o.status === 'paid') return `<span class="chip green">${esc(label)}</span>`;
    if (o.status === 'pending') return `<span class="chip" style="background:rgba(250,204,21,.15);color:#facc15;">${esc(label)}</span>`;
    if (o.status === 'completed') return `<span class="chip" style="background:rgba(34,211,238,.15);color:#22d3ee;">${esc(label)}</span>`;
    if (o.status === 'cancelled') return `<span class="chip" style="background:rgba(120,120,120,.15);color:#999;">${esc(label)}</span>`;
    return `<span class="chip">${esc(label)}</span>`;
  },
  orderCard(o) {
    return `
      <div class="event-card" style="margin-bottom:8px;cursor:pointer;" data-order="${esc(o.id)}">
        <div class="event-thumb" style="background:linear-gradient(135deg,#07c160,#22d3ee);display:flex;align-items:center;justify-content:center;font-size:24px;">🧾</div>
        <div class="event-info">
          <h4>${esc(o.id)}</h4>
          <p>${o.items.reduce((s, i) => s + (i.qty || 1), 0)} ${t('items')} · ${this.fmtDateTime(o.created)}</p>
          <div class="row">
            ${this.orderChip(o)}
            <span style="color:var(--gold-2);font-weight:700;">¥${o.total}</span>
          </div>
        </div>
      </div>`;
  },
  fmtDateTime(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  },
  showOrders() {
    const orders = OrderService.list();
    if (!orders.length) { toast(t('noOrders')); return; }
    openModal(`
      <h3 style="margin:0 0 14px;">${t('myOrders')} <small style="color:var(--text-3);font-weight:400;">${orders.length} ${LangService.isEn() ? 'orders' : '单'}</small></h3>
      <div style="max-height:60vh;overflow-y:auto;margin:0 -8px;padding:0 8px;">
        ${orders.map(o => this.orderCard(o)).join('')}
      </div>
    `);
    document.querySelectorAll('[data-order]').forEach(el => {
      el.addEventListener('click', () => this.showOrderDetail(el.getAttribute('data-order')));
    });
  },
  showOrderDetail(id) {
    const o = OrderService.find(id);
    if (!o) { toast(t('orderNotExist')); return; }
    const methodName = CartPage.payMethods[o.method] ? CartPage.payMethods[o.method].name : t('payOther');
    openModal(`
      <div class="order-detail">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;font-size:17px;">${t('orderDetail')}</h3>
          ${this.orderChip(o)}
        </div>
        <div style="background:var(--bg-3);padding:12px;border-radius:10px;font-size:12px;line-height:2;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">${t('orderNo')}</span><strong>${esc(o.id)}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">${t('payMethod2')}</span><strong>${esc(methodName)}</strong></div>
          ${o.table ? `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">${t('table')}</span><strong>${esc(o.table)}</strong></div>` : ''}
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">${t('orderTime')}</span><strong>${this.fmtDateTime(o.created)}</strong></div>
        </div>
        ${o.items.map(it => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--line);">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:38px;height:38px;border-radius:8px;background:url('${esc(it.img)}') center/cover;"></div>
              <div>
                <b style="font-size:13px;">${esc(it.name)}</b>
                <small style="color:var(--text-3);display:block;">¥${it.price} × ${it.qty}</small>
              </div>
            </div>
            <strong>¥${it.price * it.qty}</strong>
          </div>
        `).join('')}
        <div style="font-size:12px;line-height:1.9;padding:10px 0;">
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">${t('itemsAmount')}</span><span>¥${o.subtotal}</span></div>
          ${o.coupon ? `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">优惠券（${esc(o.coupon.name)}）</span><span style="color:var(--green);">-¥${o.discount}</span></div>` : ''}
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">${t('pointsReward')}</span><span style="color:var(--green);">+${o.points}</span></div>
          <div style="display:flex;justify-content:space-between;border-top:1px solid var(--line);padding-top:8px;"><span>实付</span><strong style="color:var(--gold-2);">¥${o.total}</strong></div>
        </div>
        ${o.status === 'paid' ? `
          <div style="text-align:center;background:var(--bg-3);border-radius:12px;padding:12px;">
            <div style="font-size:11px;color:var(--text-3);margin-bottom:6px;">${t('verifyCode')}</div>
            ${typeof generateQRCodeSVG === 'function' ? generateQRCodeSVG(o.qrSeed || o.id, 150) : ''}
            <div style="font-size:16px;font-weight:800;letter-spacing:2px;margin-top:6px;">${esc(o.id)}</div>
            <div style="font-size:10px;color:var(--text-3);margin-top:4px;">${t('showToStaff')}</div>
            <button class="btn btn-gold btn-block" id="completeOrder" style="margin-top:10px;">${t('completeVerify')}</button>
            <button class="btn btn-ghost btn-block" id="cancelOrder" style="margin-top:6px;">${t('cancelOrder')}</button>
          </div>
        ` : ''}
        <div style="text-align:center;margin-top:12px;"><button class="btn btn-ghost btn-block" onclick="closeModal()">${t('closeBtn')}</button></div>
      </div>
    `);
    const done = document.getElementById('completeOrder');
    if (done) done.onclick = () => {
      OrderService.updateStatus(o.id, 'completed');
      closeModal();
      toast(t('doneToast'));
      this.refresh();
    };
    const cancel = document.getElementById('cancelOrder');
    if (cancel) cancel.onclick = () => {
      OrderService.updateStatus(o.id, 'cancelled');
      closeModal();
      toast(t('cancelToast'));
      this.refresh();
    };
  },
  refresh() {
    const root = document.querySelector('[data-page="profile"]');
    if (root) this.mount(root);
  },

  // ---------- 每日签到 ----------
  showSign() {
    const signed = SignService.lastDate() === SignService.today();
    openModal(`
      <div style="text-align:center;">
        <div style="font-size:46px;margin-bottom:8px;">📅</div>
        <h3 style="margin:0 0 4px;font-size:17px;">每日签到</h3>
        <p style="margin:0 0 16px;color:var(--text-3);font-size:12px;">连续签到得积分 · 兑换好礼</p>
        <div style="background:var(--bg-3);padding:14px;border-radius:12px;margin-bottom:16px;">
          <div style="font-size:28px;font-weight:800;color:var(--gold-2);">+10</div>
          <small style="color:var(--text-3);">积分 / 次</small>
        </div>
        <button class="btn btn-primary btn-block" id="signBtn" ${signed ? 'disabled' : ''} style="${signed ? 'opacity:.5;' : ''}">${signed ? '今日已签到 ✓' : '立即签到 +10积分'}</button>
      </div>
    `);
    const btn = document.getElementById('signBtn');
    if (btn && !signed) btn.addEventListener('click', () => {
      const r = SignService.checkIn();
      if (r.ok) {
        User.data.points += r.points;
        User.save();
        closeModal();
        toast('签到成功 +10 积分');
        this.refresh();
      } else {
        toast(r.msg);
      }
    });
  },

  // ---------- 积分商城 ----------
  mallItems() {
    return [
      { id: 'm1', name: '鸡尾酒兑换券', desc: '兑换任意招牌鸡尾酒一杯', cost: 500, icon: '🍸' },
      { id: 'm2', name: '小食拼盘券', desc: '美式炸鸡拼盘 6 件套', cost: 800, icon: '🍗' },
      { id: 'm3', name: 'VIP 体验券', desc: 'VIP 通道优先入座一次', cost: 1000, icon: '👑' },
      { id: 'm4', name: '包厢抵用券', desc: '任意包厢立减 200 元', cost: 2000, icon: '🛋️' }
    ];
  },
  showMall() {
    const records = LS.get(LS_KEYS.MALL, []);
    const list = this.mallItems().map(it => `
      <div class="menu-item" style="align-items:center;">
        <div class="menu-img" style="background:linear-gradient(135deg,#16a34a,#d4af37);display:flex;align-items:center;justify-content:center;font-size:24px;">${esc(it.icon)}</div>
        <div class="menu-content">
          <h3 class="menu-name">${esc(it.name)}</h3>
          <p class="menu-desc">${esc(it.desc)}</p>
          <div class="menu-row">
            <span class="menu-price">${it.cost}<span style="font-size:10px;color:var(--text-3);"> 积分</span></span>
            <button class="btn btn-primary" style="padding:6px 14px;font-size:12px;" data-mall="${esc(it.id)}">兑换</button>
          </div>
        </div>
      </div>`).join('');
    openModal(`
      <h3 style="margin:0 0 4px;font-size:17px;">积分商城</h3>
      <p style="margin:0 0 12px;color:var(--text-3);font-size:11px;">当前积分 <b style="color:var(--gold-2);">${User.data.points}</b> · 已兑换 ${records.length} 次（兑换后到店领取）</p>
      <div style="max-height:56vh;overflow-y:auto;margin:0 -8px;padding:0 8px;">${list}</div>
    `);
    document.querySelectorAll('[data-mall]').forEach(b => {
      b.addEventListener('click', () => {
        const it = this.mallItems().find(x => x.id === b.getAttribute('data-mall'));
        if (!it) return;
        if (User.data.points < it.cost) { toast('积分不足，还差 ' + (it.cost - User.data.points) + ' 分'); return; }
        openModal(`
          <div style="text-align:center;padding:4px 2px;">
            <div style="font-size:40px;margin-bottom:8px;">${esc(it.icon)}</div>
            <h3 style="margin:0 0 6px;font-size:17px;">确认兑换？</h3>
            <p style="margin:0 0 4px;color:var(--text-3);font-size:12px;">${esc(it.name)} · 消耗 ${it.cost} 积分</p>
            <p style="margin:0 0 18px;color:var(--text-3);font-size:11px;">兑换后请到店出示领取</p>
            <div style="display:flex;gap:10px;">
              <button class="btn btn-ghost btn-block" style="flex:1;" onclick="closeModal()">取消</button>
              <button class="btn btn-primary btn-block" style="flex:1;" id="okRedeem">确认兑换</button>
            </div>
          </div>
        `);
        const ok = document.getElementById('okRedeem');
        if (ok) ok.addEventListener('click', () => {
          User.data.points -= it.cost;
          User.save();
          const rec = LS.get(LS_KEYS.MALL, []);
          rec.unshift({ id: it.id, name: it.name, cost: it.cost, at: Date.now() });
          LS.set(LS_KEYS.MALL, rec);
          closeModal();
          toast('兑换成功 · ' + it.name);
          this.showMall();
        });
      });
    });
  },

  // ---------- 邀请好友 ----------
  showInvite() {
    const link = InviteService.link();
    openModal(`
      <div style="text-align:center;">
        <div style="font-size:46px;margin-bottom:8px;">📣</div>
        <h3 style="margin:0 0 4px;font-size:17px;">邀请好友 · 分享有礼</h3>
        <p style="margin:0 0 14px;color:var(--text-3);font-size:12px;">好友注册成功，您得 200 积分；好友得新人券</p>
        <div style="display:flex;gap:8px;align-items:center;background:var(--bg-3);border:1px dashed var(--gold);border-radius:10px;padding:10px 12px;margin-bottom:14px;">
          <input id="inviteLink" type="text" readonly value="${esc(link)}" style="flex:1;background:transparent;border:none;color:var(--text-2);font-size:12px;outline:none;">
          <button class="btn btn-primary" id="copyLink" style="padding:6px 12px;font-size:12px;">复制</button>
        </div>
        <button class="btn btn-gold btn-block" id="claimInvite">领取分享奖励 +20积分</button>
        <p style="margin:8px 0 0;font-size:10px;color:var(--text-4);">分享奖励每日限 3 次 · 注册后 24h 内有效</p>
      </div>
    `);
    const copy = document.getElementById('copyLink');
    if (copy) copy.addEventListener('click', () => {
      const full = location.href.split('#')[0] + '#' + link;
      const done = () => {
        toast('邀请链接已复制');
        const r = InviteService.claim();
        if (r.ok) {
          User.data.points += r.points;
          User.save();
          setTimeout(() => toast('分享奖励 +' + r.points + ' 积分'), 600);
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(full).then(done).catch(() => this.copyFallback(full, done));
      } else {
        this.copyFallback(full, done);
      }
    });
    const claim = document.getElementById('claimInvite');
    if (claim) claim.addEventListener('click', () => {
      const r = InviteService.claim();
      if (r.ok) {
        User.data.points += r.points;
        User.save();
        toast(r.msg);
      } else {
        toast(r.msg);
      }
    });
  },
  copyFallback(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('复制失败，请手动复制'); }
    document.body.removeChild(ta);
  },

  showPoints() {
    const list = [
      { t: '消费积分', v: '+186', d: '今天 12:30', color: 'var(--green)' },
      { t: '生日奖励', v: '+500', d: '昨天', color: 'var(--gold-2)' },
      { t: '签到', v: '+10', d: '3天前', color: 'var(--green)' },
      { t: '兑换鸡尾酒', v: '-200', d: '5天前', color: 'var(--pink)' }
    ];
    openModal(`
      <h3 style="margin:0 0 14px;">积分明细</h3>
      <div style="max-height:60vh;overflow-y:auto;margin:0 -8px;padding:0 8px;">
        ${list.map(i => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--line);">
            <div>
              <b style="display:block;font-size:13px;">${esc(i.t)}</b>
              <small style="color:var(--text-3);">${esc(i.d)}</small>
            </div>
            <strong style="color:${esc(i.color)};font-size:16px;">${esc(i.v)}</strong>
          </div>
        `).join('')}
      </div>
    `);
  },

  showWallet() {
    openModal(`
      <h3 style="margin:0 0 14px;">我的钱包</h3>
      <div style="background:linear-gradient(135deg,#1a0a2e,#0a0a0a);border:1px solid var(--gold);padding:18px;border-radius:14px;margin-bottom:14px;">
        <small style="color:var(--text-3);">账户余额</small>
        <div style="font-size:30px;font-weight:800;color:var(--gold-2);margin:4px 0;">¥${User.data.balance}.00</div>
        <small style="color:var(--text-3);">累计消费 ¥${(User.data.points * 1.5).toFixed(0)}</small>
      </div>
      <button class="btn btn-gold btn-block btn-lg">立即充值</button>
    `);
  },

  showAddress() {
    openModal(`
      <h3 style="margin:0 0 14px;">收货地址</h3>
      <div style="background:var(--bg-3);padding:14px;border-radius:12px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <strong>家里</strong><span class="chip pink">默认</span>
        </div>
        <p style="margin:0;color:var(--text-3);font-size:12px;"> 138****8888</p>
        <p style="margin:4px 0 0;font-size:13px;">上海市黄浦区南京东路 666 号 MIX CLUB</p>
      </div>
      <button class="btn btn-primary btn-block">+ 新增地址</button>
    `);
  },

  showHelp() {
    openModal(`
      <h3 style="margin:0 0 14px;">在线客服</h3>
      <div style="background:var(--bg-3);padding:16px;border-radius:12px;margin-bottom:14px;text-align:center;">
        <div style="font-size:36px;margin-bottom:8px;">👩‍💼</div>
        <strong style="display:block;">MIX 小助手</strong>
        <small style="color:var(--text-3);">7×24h 在线为您服务</small>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-ghost btn-block">💬 在线咨询</button>
        <button class="btn btn-ghost btn-block">📞 电话客服</button>
      </div>
    `);
  },

  // 隐私说明（合规）
  showPrivacy() {
    openModal(`
      <h3 style="margin:0 0 14px;">🔐 隐私说明</h3>
      <div style="font-size:12px;color:var(--text-3);line-height:1.8;">
        <p style="margin:0 0 8px;">· 本应用仅将您的偏好设置与订单记录保存在本机，用于提供点单、订台、会员等服务。</p>
        <p style="margin:0 0 8px;">· 我们不会将您的个人信息分享给任何第三方。</p>
        <p style="margin:0 0 8px;">· 您可以在「设置」中随时清除本地数据。</p>
        <p style="margin:0;">· 如对隐私保护有任何疑问，欢迎联系门店工作人员。</p>
      </div>
      <button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="closeModal()">知道了</button>
    `);
  },

  showAbout() {
    openModal(`
      <div style="text-align:center;">
        <div style="width:72px;height:72px;border-radius:18px;background:var(--grad-hot);margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;">M</div>
        <h3 style="margin:0 0 4px;">MIX CLUB</h3>
        <p style="margin:0 0 14px;color:var(--text-3);font-size:12px;">城市夜生活新坐标 · v${APP_VERSION}</p>
        <div style="background:var(--bg-3);padding:14px;border-radius:12px;text-align:left;font-size:12px;line-height:1.9;color:var(--text-2);">
          MIX CLUB 创立于2018年，是上海知名的精品酒吧品牌，融合电子音乐、潮流文化与精致调酒，致力于为都市青年打造高品质夜生活体验。<br><br>
          <span style="color:var(--gold-2);">地址：</span>上海市黄浦区南京东路 666 号<br>
          <span style="color:var(--gold-2);">营业：</span>每日 19:00 - 03:00<br>
          <span style="color:var(--gold-2);">电话：</span>400-888-6666
        </div>
      </div>
    `);
  },

  showSettings() {
    const lang = LangService.current;
    openModal(`
      <h3 style="margin:0 0 14px;">${t('settingsTitle')}</h3>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--line);font-size:13px;">
        <span>${t('langLabel')}</span>
        <div style="display:flex;gap:8px;">
          <button class="btn ${lang === 'zh' ? 'btn-primary' : 'btn-ghost'}" style="padding:5px 14px;font-size:12px;" id="langZhBtn">${t('langZh')}</button>
          <button class="btn ${lang === 'en' ? 'btn-primary' : 'btn-ghost'}" style="padding:5px 14px;font-size:12px;" id="langEnBtn">${t('langEn')}</button>
        </div>
      </div>
      ${[
        {n:'消息通知',on:true},
        {n:'个性化推荐',on:true},
        {n:'指纹支付',on:false},
        {n:'深色模式',on:true},
        {n:'清除缓存',on:false,special:true}
      ].map(s => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--line);font-size:13px;">
          <span>${esc(s.n)}</span>
          <div style="width:40px;height:22px;border-radius:11px;background:${s.on?'var(--grad-hot)':'var(--bg-3)'};position:relative;cursor:pointer;">
            <span style="position:absolute;top:2px;${s.on?'right:2px':'left:2px'};width:18px;height:18px;border-radius:50%;background:#fff;transition:.2s;"></span>
          </div>
        </div>
      `).join('')}
    `);

    // 语言切换（弹窗已渲染，此刻绑定才生效）
    const applyLang = (lang) => {
      LangService.set(lang);
      closeModal();
      if (window.MIX_APP && MIX_APP.applyLangUI) MIX_APP.applyLangUI();
      toast(lang === 'en' ? t('langSwitchedEn') : t('langSwitchedZh'));
      const r = document.querySelector('[data-page="profile"]');
      if (r) this.mount(r);
    };
    const langZh = document.getElementById('langZhBtn');
    if (langZh) langZh.addEventListener('click', () => applyLang('zh'));
    const langEn = document.getElementById('langEnBtn');
    if (langEn) langEn.addEventListener('click', () => applyLang('en'));
  },

  logout() {
    openModal(`
      <div style="text-align:center;padding:6px 4px;">
        <div style="width:60px;height:60px;margin:0 auto 14px;border-radius:50%;background:rgba(255,45,111,.12);display:flex;align-items:center;justify-content:center;font-size:28px;">👋</div>
        <h3 style="margin:0 0 8px;font-size:17px;">确认退出登录?</h3>
        <p style="margin:0 0 22px;color:var(--text-3);font-size:12px;line-height:1.6;">退出后部分功能将不可用<br>如会员积分、订单记录等</p>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-ghost btn-block" id="cancelLogoutBtn" style="flex:1;">取消</button>
          <button class="btn btn-primary btn-block" id="confirmLogoutBtn" style="flex:1;">确认退出</button>
        </div>
      </div>
    `);

    // 关闭弹窗
    const cancel = document.getElementById('cancelLogoutBtn');
    if (cancel) cancel.onclick = closeModal;

    // 真正退出
    const ok = document.getElementById('confirmLogoutBtn');
    if (ok) {
      ok.onclick = () => {
        closeModal();
        Auth.logout();
      };
    }
  }
};
