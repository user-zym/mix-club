/* ============================================
   MIX CLUB · Cart Page
   购物车 + 结算（订单落库 / 优惠券门槛校验 / 支付流程）
   ============================================ */

const CartPage = {
  // 当前选中的优惠券（对象），null 表示未使用
  coupon: null,
  couponList: [
    { id: 'c1', name: '新用户立减', desc: '满200可用', icon: '🎟️', type: 'reduce',   value: 50,   threshold: 200 },
    { id: 'c2', name: 'VIP折扣券', desc: '全场9折',   icon: '👑',  type: 'discount', value: 0.9, threshold: 0 },
    { id: 'c3', name: '生日特惠',   desc: '满288可用', icon: '🎂',  type: 'reduce',   value: 88,   threshold: 288 }
  ],

  render() {
    const items = Cart.items;
    if (items.length === 0) {
      return `
        <div class="empty-state">
          <div class="es-ico">🛒</div>
          <h3>购物车空空如也</h3>
          <p>去菜单挑几款心仪的特调吧</p>
          <button class="btn btn-primary" data-go="menu">去点单</button>
        </div>
        <div class="page-footer">
          © 2026 MIX CLUB · YOUR CART
        </div>
      `;
    }

    const subtotal = Cart.total();
    // 商品数量变化导致已选券不再满足门槛时自动作废
    if (this.coupon && !CouponService.eligible(this.coupon, subtotal)) {
      this.coupon = null;
    }
    const discount = CouponService.discount(this.coupon, subtotal);
    const final = Math.max(0, subtotal - discount);

    return `
      <div class="cart-list">
        ${items.map(it => `
          <div class="cart-item" data-id="${esc(it.id)}">
            <div class="cart-img" style="background-image:url('${esc(it.img)}')"></div>
            <div class="cart-info">
              <div class="cart-item-head">
                <h4>${esc(it.name)}</h4>
                <button class="cart-del" data-del="${esc(it.id)}" aria-label="删除商品">✕</button>
              </div>
              <div class="row">
                <div class="cart-price">${fmtPrice(it.price)}</div>
                <div class="qty-ctrl">
                  <button data-dec="${esc(it.id)}">−</button>
                  <span class="num">${it.qty}</span>
                  <button data-inc="${esc(it.id)}">+</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Coupon -->
      <div class="coupon-bar" id="couponBtn">
        <div class="l">
          <span style="font-size:16px;">🎟️</span>
          <span>${this.coupon ? `已选：${esc(this.coupon.name)}（${CouponService.label(this.coupon)}）` : '选择优惠券'}</span>
        </div>
        <span class="r">${this.coupon ? '点击更换 →' : `${this.couponList.length}张可用 →`}</span>
      </div>

      <!-- Summary -->
      <div class="cart-summary">
        <div class="total">
          <small>合计 ${Cart.count()} 件商品${this.coupon ? ` · 已优惠 ${CouponService.label(this.coupon)}` : ''}</small>
          <b>${fmtPrice(final)}</b>
        </div>
        <button class="btn btn-primary btn-lg" id="checkoutBtn">去结算</button>
      </div>

      <div class="page-footer">
        © 2026 MIX CLUB · 享受微醺
      </div>
    `;
  },

  mount(root) {
    root.innerHTML = this.render();
    this.bindEvents(root);
  },

  bindEvents(root) {
    // go to menu when empty
    root.querySelectorAll('[data-go]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        navigate(el.getAttribute('data-go'));
      });
    });

    // inc/dec
    root.querySelectorAll('[data-inc]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-inc');
        const it = Cart.items.find(i => i.id === id);
        if (it) Cart.update(id, it.qty + 1);
        this.mount(root);
      });
    });
    root.querySelectorAll('[data-dec]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-dec');
        const it = Cart.items.find(i => i.id === id);
        if (it) Cart.update(id, it.qty - 1);
        this.mount(root);
      });
    });

    // 删除按钮 → 自定义确认弹窗
    root.querySelectorAll('[data-del]').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        const id = b.getAttribute('data-del');
        const it = Cart.items.find(i => i.id === id);
        if (it) this.confirmRemove(id, it.name, root);
      });
    });

    // 长按删除（移动端习惯，确认改为应用内弹窗）
    let pressTimer;
    root.querySelectorAll('.cart-item').forEach(item => {
      const start = (e) => {
        pressTimer = setTimeout(() => {
          const id = item.getAttribute('data-id');
          const it = Cart.items.find(i => i.id === id);
          if (it) this.confirmRemove(id, it.name, root);
        }, 800);
      };
      item.addEventListener('touchstart', start, { passive: true });
      item.addEventListener('mousedown', start);
      const cancel = () => clearTimeout(pressTimer);
      item.addEventListener('touchend', cancel);
      item.addEventListener('touchmove', cancel);
      item.addEventListener('mouseup', cancel);
      item.addEventListener('mouseleave', cancel);
    });

    // Coupon
    const cp = root.querySelector('#couponBtn');
    if (cp) cp.addEventListener('click', () => this.showCoupons());

    // Checkout
    const ck = root.querySelector('#checkoutBtn');
    if (ck) ck.addEventListener('click', () => this.checkout());
  },

  confirmRemove(id, name, root) {
    openModal(`
      <div style="text-align:center;padding:4px 2px;">
        <div style="font-size:42px;margin-bottom:10px;">🗑️</div>
        <h3 style="margin:0 0 8px;font-size:17px;">确认移除？</h3>
        <p style="margin:0 0 20px;color:var(--text-3);font-size:13px;">将从购物车移除「${esc(name)}」</p>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-ghost btn-block" style="flex:1;" onclick="closeModal()">取消</button>
          <button class="btn btn-primary btn-block" style="flex:1;" id="okRemove">移除</button>
        </div>
      </div>
    `);
    const ok = document.getElementById('okRemove');
    if (ok) ok.onclick = () => {
      Cart.remove(id);
      closeModal();
      this.mount(root);
      toast('已从购物车移除');
    };
  },

  showCoupons() {
    const subtotal = Cart.total();
    const opts = this.couponList.map(c => {
      const ok = CouponService.eligible(c, subtotal);
      const gap = ok ? 0 : Math.ceil(c.threshold - subtotal);
      return `
        <div class="menu-item ${ok ? '' : 'disabled-coupon'}" data-pick="${ok ? esc(c.id) : ''}" style="cursor:${ok ? 'pointer' : 'default'};">
          <div class="menu-img" style="background:linear-gradient(135deg,#f0c75e,#d4af37);display:flex;align-items:center;justify-content:center;font-size:22px;color:#1a1100;font-weight:800;">${esc(c.icon)}</div>
          <div class="menu-content">
            <h3 class="menu-name">${esc(c.name)}</h3>
            <p class="menu-desc">${esc(c.desc)}${ok ? '' : ` · 还差 ¥${gap}`}</p>
            <div class="menu-row">
              <span class="menu-price">${CouponService.label(c)}</span>
              <button class="btn btn-primary" style="padding:6px 14px;font-size:12px;" ${ok ? '' : 'disabled'}>${ok ? '选择' : '未满足'}</button>
            </div>
          </div>
        </div>`;
    }).join('');

    openModal(`
      <h3 style="margin:0 0 14px;font-size:17px;">选择优惠券</h3>
      <div style="max-height:60vh;overflow-y:auto;margin:0 -8px;padding:0 8px;">
        ${opts}
        ${this.coupon ? `<button class="btn btn-ghost btn-block" id="noCoupon" style="margin-top:8px;">不使用优惠券</button>` : ''}
      </div>
    `);

    document.querySelectorAll('[data-pick]').forEach(p => {
      p.addEventListener('click', () => {
        const id = p.getAttribute('data-pick');
        if (!id) return;
        const c = this.couponList.find(x => x.id === id);
        if (!c) return;
        this.coupon = { id: c.id, name: c.name, desc: c.desc, icon: c.icon, type: c.type, value: c.value, threshold: c.threshold };
        closeModal();
        const root = document.querySelector('[data-page="cart"]');
        if (root) this.mount(root);
        toast(`已使用 · ${c.name}`);
      });
    });

    const no = document.getElementById('noCoupon');
    if (no) no.addEventListener('click', () => {
      this.coupon = null;
      closeModal();
      const root = document.querySelector('[data-page="cart"]');
      if (root) this.mount(root);
    });
  },

  checkout() {
    const subtotal = Cart.total();
    const discount = CouponService.discount(this.coupon, subtotal);
    const orderTotal = Math.max(0, subtotal - discount);
    const orderId = 'MX' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const finalRoot = document.querySelector('[data-page="cart"]');
    const points = Math.floor(orderTotal);
    const tb = TableService.current();

    // 弹出支付方式选择 modal
    openModal(`
      <div class="pay-method-modal">
        <div style="background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.35);color:var(--gold-2);font-size:11px;padding:8px 10px;border-radius:8px;margin-bottom:12px;text-align:center;">🔒 安全支付 · 交易成功后凭订单号到店核销<br><span style="color:var(--text-4);font-weight:400;">🍸 理性饮酒 · 请勿酒后驾车</span></div>
        <div style="text-align:center;margin-bottom:14px;">
          <div style="font-size:42px;margin-bottom:6px;">💳</div>
          <h3 style="margin:0 0 4px;font-size:17px;">选择支付方式</h3>
          <p style="margin:0 0 6px;color:var(--text-3);font-size:12px;">订单号 ${orderId}</p>
          <div style="background:var(--bg-3);padding:10px;border-radius:10px;text-align:left;font-size:12px;line-height:1.9;margin-top:8px;">
            <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">商品数量</span><strong>${Cart.count()} 件</strong></div>
            <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">商品金额</span><strong>¥${subtotal}</strong></div>
            ${tb ? `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">桌台</span><strong>${esc(tb.no)}</strong></div>` : ''}
            ${this.coupon ? `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-3);">优惠券（${esc(this.coupon.name)}）</span><strong style="color:var(--green);">${CouponService.label(this.coupon)}</strong></div>` : ''}
            <div style="display:flex;justify-content:space-between;border-top:1px solid var(--line);margin-top:4px;padding-top:4px;"><span style="color:var(--text-3);">实付</span><strong style="color:var(--gold-2);font-size:16px;">¥${orderTotal}</strong></div>
          </div>
        </div>

        <div class="pay-method-list">
          <div class="pay-method-item" data-method="wechat">
            <div class="pay-method-icon" style="background:#07c160;">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff"><path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.85 1 3.5 2.6 4.6L4 17l3-1.5c.6.15 1.25.25 1.95.27A6.7 6.7 0 0 1 8.5 13c0-3.59 3.36-6.5 7.5-6.5h.5C15.7 5.05 12.85 4 9.5 4zm-2.7 4.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm5.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM16 9c-3.31 0-6 2.24-6 5s2.69 5 6 5c.55 0 1.08-.07 1.58-.2L20 20l-.7-2.05C20.6 16.95 22 15.62 22 14c0-2.76-2.69-5-6-5zm-1.9 3.6a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm3.8 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/></svg>
            </div>
            <div class="pay-method-info">
              <b>微信支付</b>
              <small>使用微信扫一扫付款</small>
            </div>
            <span class="pay-method-radio"></span>
          </div>

          <div class="pay-method-item" data-method="alipay">
            <div class="pay-method-icon" style="background:#1677ff;">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff"><path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-9.5 3.5h6v.8c0 1.2-.4 2.2-1.1 2.9.7.4 1.3 1.1 1.6 2.1l1 2.6h-1.7l-.9-2.3c-.4-1-1-1.5-1.9-1.5h-.5v3.8H9.5V8.5zm1.5 1.2v2.7h2.5c1.1 0 1.6-.5 1.6-1.4 0-.8-.5-1.3-1.6-1.3H11z"/></svg>
            </div>
            <div class="pay-method-info">
              <b>支付宝</b>
              <small>使用支付宝扫一扫付款</small>
            </div>
            <span class="pay-method-radio"></span>
          </div>

          <div class="pay-method-item" data-method="unionpay">
            <div class="pay-method-icon" style="background:linear-gradient(135deg,#e21836,#003a8c 60%,#00a651);">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M2 8h7v8H2zM15 8h7v8h-7zM11 8h2v8h-2z"/></svg>
            </div>
            <div class="pay-method-info">
              <b>银联支付</b>
              <small>银联云闪付 · 银行卡 / 云闪付 APP</small>
            </div>
            <span class="pay-method-radio"></span>
          </div>
        </div>

        <div style="display:flex;gap:8px;margin-top:14px;">
          <button class="btn btn-ghost btn-block" id="cancelCheckout">取消</button>
          <button class="btn btn-primary btn-block" id="confirmMethod" disabled style="opacity:.5;">确认支付</button>
        </div>
      </div>
    `);

    let selectedMethod = null;

    // 选择支付方式
    document.querySelectorAll('.pay-method-item').forEach(el => {
      el.onclick = () => {
        document.querySelectorAll('.pay-method-item').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
        selectedMethod = el.getAttribute('data-method');
        const btn = document.getElementById('confirmMethod');
        if (btn) {
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      };
    });

    document.getElementById('cancelCheckout').onclick = () => closeModal();

    document.getElementById('confirmMethod').onclick = () => {
      if (!selectedMethod) return;
      // 落库订单（待支付 pending，在清空购物车前保留商品快照）
      const order = OrderService.create({
        id: orderId,
        items: Cart.items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, img: i.img })),
        subtotal,
        coupon: this.coupon ? { id: this.coupon.id, name: this.coupon.name, type: this.coupon.type, value: this.coupon.value, threshold: this.coupon.threshold } : null,
        discount,
        total: orderTotal,
        method: selectedMethod,
        status: ORDER_STATUS.PENDING,
        points,
        table: tb ? tb.no : null,
        qrSeed: orderId + '_' + selectedMethod,
        created: Date.now(),
        updatedAt: Date.now()
      });
      const ctx = { orderTotal, orderId, points, finalRoot, method: selectedMethod, order };
      closeModal();
      // 清空购物车并刷新
      Cart.clear();
      this.coupon = null;
      if (finalRoot) this.mount(finalRoot);
      // 进入扫码支付：确认到账后状态流转为已支付
      this.showPayQR(ctx);
    };
  },

  // 支付方式配置
  payMethods: {
    wechat:   { name: '微信支付', color: '#07c160', tip: '请使用 微信 扫一扫', success: '微信支付成功' },
    alipay:   { name: '支付宝',   color: '#1677ff', tip: '请使用 支付宝 扫一扫', success: '支付宝支付成功' },
    unionpay: { name: '银联支付', color: '#e21836', tip: '请使用 银联云闪付 扫一扫', success: '银联支付成功' }
  },

  // 显示二维码支付 modal
  showPayQR(ctx) {
    const method = this.payMethods[ctx.method] || this.payMethods.wechat;
    // 二维码 seed 用订单号 + 支付方式，保证不同方式的二维码形状不同
    const qrSeed = ctx.orderId + '_' + ctx.method;
    const qrSvg = typeof generateQRCodeSVG === 'function'
      ? generateQRCodeSVG(qrSeed, 200)
      : '<div style="width:200px;height:200px;background:#000;"></div>';
    const remainSec = 15;
    openModal(`
      <div class="pay-modal">
        <div class="pay-head">
          <div class="pay-method-icon" style="background:${method.color};width:42px;height:42px;margin:0 auto 6px;border-radius:10px;display:flex;align-items:center;justify-content:center;">
            ${ctx.method === 'wechat' ? '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.85 1 3.5 2.6 4.6L4 17l3-1.5c.6.15 1.25.25 1.95.27A6.7 6.7 0 0 1 8.5 13c0-3.59 3.36-6.5 7.5-6.5h.5C15.7 5.05 12.85 4 9.5 4zm-2.7 4.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm5.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM16 9c-3.31 0-6 2.24-6 5s2.69 5 6 5c.55 0 1.08-.07 1.58-.2L20 20l-.7-2.05C20.6 16.95 22 15.62 22 14c0-2.76-2.69-5-6-5zm-1.9 3.6a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm3.8 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/></svg>' :
              ctx.method === 'alipay' ? '<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-9.5 3.5h6v.8c0 1.2-.4 2.2-1.1 2.9.7.4 1.3 1.1 1.6 2.1l1 2.6h-1.7l-.9-2.3c-.4-1-1-1.5-1.9-1.5h-.5v3.8H9.5V8.5zm1.5 1.2v2.7h2.5c1.1 0 1.6-.5 1.6-1.4 0-.8-.5-1.3-1.6-1.3H11z"/></svg>' :
              '<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M2 8h7v8H2zM15 8h7v8h-7zM11 8h2v8h-2z"/></svg>'}
          </div>
          <h3 style="margin:0 0 4px;font-size:17px;">${esc(method.name)}</h3>
          <p style="margin:0;color:var(--text-3);font-size:12px;">订单号 ${esc(ctx.orderId)}</p>
        </div>

        <div class="pay-amount">
          <small style="color:var(--text-3);font-size:11px;">应付金额</small>
          <div style="font-size:30px;font-weight:800;color:${esc(method.color)};letter-spacing:1px;">¥${ctx.orderTotal}</div>
        </div>

        <div class="qr-box" id="payQrBox" style="border-color:${esc(method.color)};">
          ${qrSvg}
          <div class="qr-scan-line" id="qrScanLine" style="background:linear-gradient(90deg,transparent,${esc(method.color)},transparent);box-shadow:0 0 8px ${esc(method.color)};"></div>
        </div>

        <div style="font-size:10px;color:var(--text-3);margin-top:6px;">支付二维码 · 请使用对应 App 扫码</div>

        <div class="pay-tips">
          <span class="pay-status-dot" style="background:${esc(method.color)};box-shadow:0 0 6px ${esc(method.color)};"></span>
          <span id="payStatusText">${esc(method.tip)}</span>
        </div>

        <div class="pay-timer" id="payTimer">${remainSec}s 后自动确认到账</div>

        <div style="display:flex;gap:8px;margin-top:14px;">
          <button class="btn btn-ghost btn-block" id="cancelPay">取消支付</button>
          <button class="btn btn-primary btn-block" id="confirmPaid" style="background:${esc(method.color)};border-color:${esc(method.color)};">我已支付</button>
        </div>
      </div>
    `);

    let scanTimer = null;
    let autoTimer = null;
    let countdown = remainSec;
    let cancelled = false;
    let paid = false;

    const finish = (success) => {
      if (cancelled || paid) return;
      paid = true;
      if (scanTimer) clearTimeout(scanTimer);
      if (autoTimer) clearInterval(autoTimer);
      closeModal();
      if (success) {
        // 状态机：待支付 → 已支付（待核销）
        if (ctx.order) OrderService.updateStatus(ctx.order.id, ORDER_STATUS.PAID);
        this.showPaySuccess(ctx);
      }
    };

    document.getElementById('cancelPay').onclick = () => {
      cancelled = true;
      if (scanTimer) clearTimeout(scanTimer);
      if (autoTimer) clearInterval(autoTimer);
      closeModal();
      // 状态机：待支付 → 已取消
      if (ctx.order) OrderService.updateStatus(ctx.order.id, ORDER_STATUS.CANCELLED);
      toast(`已取消${method.name}`);
    };

    document.getElementById('confirmPaid').onclick = () => {
      const statusEl = document.getElementById('payStatusText');
      if (statusEl) statusEl.textContent = '正在确认到账...';
      if (autoTimer) clearInterval(autoTimer);
      setTimeout(() => finish(true), 600);
    };

    scanTimer = setTimeout(() => {
      if (cancelled || paid) return;
      const statusEl = document.getElementById('payStatusText');
      const dot = document.querySelector('.pay-status-dot');
      if (statusEl) statusEl.textContent = `已检测到${method.name}扫码 · 确认中...`;
      if (dot) dot.classList.add('scanned');
    }, 1200);

    const timerEl = document.getElementById('payTimer');
    autoTimer = setInterval(() => {
      countdown -= 1;
      if (timerEl) timerEl.textContent = `${countdown}s 后自动确认到账`;
      if (countdown <= 0) finish(true);
    }, 1000);
  },

  // 显示支付成功 modal
  showPaySuccess(ctx) {
    const method = this.payMethods[ctx.method] || this.payMethods.wechat;
    const iconSvg = ctx.method === 'wechat'
      ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.85 1 3.5 2.6 4.6L4 17l3-1.5c.6.15 1.25.25 1.95.27A6.7 6.7 0 0 1 8.5 13c0-3.59 3.36-6.5 7.5-6.5h.5C15.7 5.05 12.85 4 9.5 4zm-2.7 4.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm5.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM16 9c-3.31 0-6 2.24-6 5s2.69 5 6 5c.55 0 1.08-.07 1.58-.2L20 20l-.7-2.05C20.6 16.95 22 15.62 22 14c0-2.76-2.69-5-6-5zm-1.9 3.6a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm3.8 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/></svg>'
      : ctx.method === 'alipay'
      ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-9.5 3.5h6v.8c0 1.2-.4 2.2-1.1 2.9.7.4 1.3 1.1 1.6 2.1l1 2.6h-1.7l-.9-2.3c-.4-1-1-1.5-1.9-1.5h-.5v3.8H9.5V8.5zm1.5 1.2v2.7h2.5c1.1 0 1.6-.5 1.6-1.4 0-.8-.5-1.3-1.6-1.3H11z"/></svg>'
      : '<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M2 8h7v8H2zM15 8h7v8h-7zM11 8h2v8h-2z"/></svg>';
    openModal(`
      <div class="pay-success-modal">
        <div class="ps-ico">
          <svg viewBox="0 0 52 52" aria-hidden="true">
            <circle class="ok-circle" cx="26" cy="26" r="24"></circle>
            <path class="ok-check" d="M15 27l8 8 14-15"></path>
          </svg>
        </div>
        <h3 class="ps-title">${esc(method.success)}</h3>
        <p class="ps-sub">已支付 ¥${ctx.orderTotal} · 凭订单号 ${esc(ctx.orderId)} 到店核销<br><span style="font-size:10px;">（已支付 · 凭订单号到店核销）</span></p>
        <div style="display:inline-flex;align-items:center;gap:6px;background:${esc(method.color)};color:#fff;padding:5px 12px;border-radius:16px;margin-bottom:10px;font-size:12px;">
          ${iconSvg}
          <span>${esc(method.name)}</span>
        </div>
        <div class="ps-points">
          <small>本次消费获得</small>
          <b>+ ${ctx.points} 积分</b>
        </div>
        <button class="btn btn-primary btn-block" id="goProfileAfterPay">查看我的订单</button>
        <p style="margin:10px 0 0;font-size:10px;color:var(--text-4);">订单状态：已支付 · 待核销 · 凭订单号到店核销</p>
      </div>
    `);
    // 加积分
    User.data.points += ctx.points;
    User.save();
    const btn = document.getElementById('goProfileAfterPay');
    if (btn) btn.onclick = () => { closeModal(); navigate('profile'); };
  }
};
