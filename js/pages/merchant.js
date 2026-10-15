/* ============================================
   MIX CLUB · Merchant Page（门店管理）
   数据看板 / 核销台 / 桌台码生成
   说明：纯前端环境，数据来自本地订单库
   ============================================ */

const MerchantPage = {
  stats() {
    const orders = OrderService.list();
    const todayStr = fmtDate(Date.now());
    const today = orders.filter(o => fmtDate(o.created) === todayStr);
    const todaySales = today.reduce((s, o) => s + o.total, 0);
    const paid = orders.filter(o => o.status === 'paid').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const verifyRate = orders.length ? Math.round(completed / orders.length * 100) : 0;
    // 商品销量 Top5
    const prod = {};
    orders.forEach(o => o.items.forEach(it => { prod[it.name] = (prod[it.name] || 0) + it.qty; }));
    const top = Object.keys(prod).map(n => ({ name: n, qty: prod[n] })).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const maxQty = top.length ? top[0].qty : 1;
    return { orders, today, todaySales, paid, completed, cancelled, verifyRate, top, maxQty };
  },

  render() {
    const s = this.stats();
    const tb = TableService.current();

    const statCard = (label, val, color) => `
      <div class="merchant-stat">
        <div class="v" style="color:${esc(color)};">${esc(val)}</div>
        <div class="l">${esc(label)}</div>
      </div>`;

    const topList = s.top.length ? s.top.map(t => `
      <div class="merchant-top-item">
        <span class="n">${esc(t.name)}</span>
        <span class="bar"><i style="width:${Math.max(12, Math.round(t.qty / s.maxQty * 100))}%"></i></span>
        <span class="q">×${t.qty}</span>
      </div>`).join('') : '<p style="color:var(--text-3);font-size:12px;text-align:center;padding:10px 0;">暂无销售数据</p>';

    const flow = s.orders.length ? s.orders.slice(0, 8).map(o => `
      <div class="merchant-flow-item" data-mf="${esc(o.id)}">
        <div>
          <b style="font-size:12px;">${esc(o.id)}</b>
          <small style="color:var(--text-3);display:block;">${esc(this.payName(o.method))} · ${o.items.length}件 · ${fmtDate(o.created)}</small>
        </div>
        <div style="text-align:right;">
          <strong style="color:var(--gold-2);">¥${o.total}</strong>
          <span class="merchant-status st-${esc(o.status)}">${esc(ProfilePage.orderStatusLabel(o))}</span>
        </div>
      </div>`).join('') : '<p style="color:var(--text-3);font-size:12px;text-align:center;padding:10px 0;">暂无订单流水</p>';

    return `
      <!-- 数据看板 -->
      <div class="merchant-head">
        <div class="merchant-title">门店经营看板 <small>实时数据</small></div>
        <div class="merchant-sub">MIX CLUB · 经营数据实时看板</div>
      </div>

      <div class="merchant-stats">
        ${statCard('今日订单', s.today.length + ' 单', 'var(--gold)')}
        ${statCard('今日销售', '¥' + s.todaySales, 'var(--green)')}
        ${statCard('待核销', s.paid + ' 单', '#22d3ee')}
        ${statCard('核销率', s.verifyRate + '%', 'var(--pink)')}
      </div>

      <!-- 核销台 -->
      <div class="merchant-card">
        <h3 class="merchant-card-title">核销台 <small>输入顾客订单号 · 扫码核销</small></h3>
        <div class="merchant-verify">
          <input id="verifyInput" type="text" placeholder="输入订单号，如 MX2026092901" autocomplete="off"
            style="flex:1;background:var(--bg-3);border:1px solid var(--line);border-radius:8px;color:var(--text-1);padding:10px 12px;font-size:13px;outline:none;">
          <button class="btn btn-primary" id="verifyBtn">核销</button>
        </div>
        <p style="margin:8px 0 0;font-size:10px;color:var(--text-3);">订单核销码由顾客端「我的订单」生成，本台输入订单号即可完成核销。</p>
      </div>

      <!-- 桌台码 -->
      <div class="merchant-card">
        <h3 class="merchant-card-title">桌台点单码 <small>顾客扫码 → 自动绑定桌台</small></h3>
        <div class="merchant-table">
          <div class="merchant-table-list" id="tableList">
            ${APP_TABLES.map(t => `
              <button class="table-chip" data-table="${t.id}">${t.id}</button>`).join('')}
          </div>
          <div class="merchant-table-qr" id="tableQrBox">
            <div style="color:var(--text-3);font-size:12px;padding:20px 0;">选择桌号生成点单码</div>
          </div>
        </div>
        <p style="margin:8px 0 0;font-size:10px;color:var(--text-3);">顾客端在首页「扫码点单」输入桌号即可自动绑定桌台。</p>
      </div>

      <!-- 销量 Top -->
      <div class="merchant-card">
        <h3 class="merchant-card-title">热销商品 Top5</h3>
        ${topList}
      </div>

      <!-- 订单流水 -->
      <div class="merchant-card">
        <h3 class="merchant-card-title">订单流水 <small>共 ${s.orders.length} 单</small></h3>
        ${flow}
      </div>

      ${tb ? `<div class="merchant-tb-badge">顾客端当前绑定桌台：<b>${esc(tb.no)}</b></div>` : ''}
    `;
  },

  payName(m) {
    const n = { wechat: '微信支付', alipay: '支付宝', unionpay: '银联支付' }[m];
    return n || '其他';
  },

  mount(root) {
    root.innerHTML = this.render();
    this.bindEvents(root);
  },

  bindEvents(root) {
    // 核销
    const btn = root.querySelector('#verifyBtn');
    const input = root.querySelector('#verifyInput');
    if (btn) btn.addEventListener('click', () => this.verify(input ? input.value.trim() : '', root));
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') this.verify(input.value.trim(), root); });

    // 桌台码生成
    root.querySelectorAll('[data-table]').forEach(chip => {
      chip.addEventListener('click', () => {
        root.querySelectorAll('[data-table]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const no = chip.getAttribute('data-table');
        const box = root.querySelector('#tableQrBox');
        if (!box) return;
        const payload = 'MIXCLUB://TABLE?no=' + no;
        box.innerHTML = `
          <div class="table-qr-wrap">
            ${generateQRCodeSVG(payload, 150)}
            <div style="font-weight:800;letter-spacing:1px;margin-top:6px;">桌台 ${esc(no)}</div>
            <div style="font-size:10px;color:var(--text-3);">扫码内容：${esc(payload)}</div>
          </div>`;
      });
    });

    // 订单流水 → 点击查看订单
    root.querySelectorAll('[data-mf]').forEach(el => {
      el.addEventListener('click', () => {
        if (window.ProfilePage && ProfilePage.showOrderDetail) {
          ProfilePage.showOrderDetail(el.getAttribute('data-mf'));
        }
      });
    });
  },

  verify(no, root) {
    if (!no) { toast('请输入订单号'); return; }
    const o = OrderService.find(no);
    if (!o) { toast('未找到该订单'); return; }
    if (o.status !== 'paid') {
      toast('该订单当前状态：' + (ProfilePage.orderStatusLabel(o)));
      return;
    }
    openModal(`
      <div style="text-align:center;padding:4px 2px;">
        <div style="font-size:42px;margin-bottom:10px;">📋</div>
        <h3 style="margin:0 0 6px;font-size:17px;">确认核销订单？</h3>
        <p style="margin:0 0 4px;color:var(--text-3);font-size:12px;">订单号 ${esc(o.id)} · 实付 ¥${o.total}</p>
        <p style="margin:0 0 18px;color:var(--text-3);font-size:12px;">${o.items.map(it => `${esc(it.name)}×${it.qty}`).join('、')}</p>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-ghost btn-block" style="flex:1;" onclick="closeModal()">取消</button>
          <button class="btn btn-primary btn-block" style="flex:1;" id="okVerify">确认核销</button>
        </div>
      </div>
    `);
    const ok = document.getElementById('okVerify');
    if (ok) ok.onclick = () => {
      OrderService.updateStatus(o.id, 'completed');
      closeModal();
      toast('核销成功 · 订单已完成');
      this.mount(root);
    };
  }
};
