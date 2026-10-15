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
    const paid = OrderService.countByStatus(ORDER_STATUS.PAID);
    const completed = OrderService.countByStatus(ORDER_STATUS.COMPLETED);
    const cancelled = OrderService.countByStatus(ORDER_STATUS.CANCELLED);
    const pending = OrderService.countByStatus(ORDER_STATUS.PENDING);
    const verifyRate = orders.length ? Math.round(completed / orders.length * 100) : 0;
    // 商品销量 Top5
    const prod = {};
    orders.forEach(o => o.items.forEach(it => { prod[it.name] = (prod[it.name] || 0) + it.qty; }));
    const top = Object.keys(prod).map(n => ({ name: n, qty: prod[n] })).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const maxQty = top.length ? top[0].qty : 1;
    // 图表数据（近7日营收 / 时段客流 / 桌台翻台率）
    const revenue = OrderService.revenueByDay(7);
    const hourFlow = OrderService.ordersByHour();
    const turnover = OrderService.tableTurnover();
    return { orders, today, todaySales, paid, completed, cancelled, pending, verifyRate, top, maxQty, revenue, hourFlow, turnover };
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
        <div class="merchant-title">${t('merchantDashboard')} <small>${t('merchantRealtime')}</small></div>
        <div class="merchant-sub">${t('merchantSub')}</div>
      </div>

      <div class="merchant-stats">
        ${statCard(t('todayOrders'), s.today.length + ' ' + t('unitOrders'), 'var(--gold)')}
        ${statCard(t('todaySales'), '¥' + s.todaySales, 'var(--green)')}
        ${statCard(t('pendingVerify'), s.paid + ' ' + t('unitOrders'), '#22d3ee')}
        ${statCard(t('verifyRate'), s.verifyRate + '%', 'var(--pink)')}
      </div>

      <!-- 核销台 -->
      <div class="merchant-card">
        <h3 class="merchant-card-title">${t('verifyDesk')} <small>${t('verifyDeskSub')}</small></h3>
        <div class="merchant-verify">
          <input id="verifyInput" type="text" placeholder="输入订单号，如 MX2026092901" autocomplete="off"
            style="flex:1;background:var(--bg-3);border:1px solid var(--line);border-radius:8px;color:var(--text-1);padding:10px 12px;font-size:13px;outline:none;">
          <button class="btn btn-primary" id="verifyBtn">${t('verifyNow')}</button>
        </div>
        <p style="margin:8px 0 0;font-size:10px;color:var(--text-3);">${t('verifyHintLine')}</p>
      </div>

      <!-- 桌台码 -->
      <div class="merchant-card">
        <h3 class="merchant-card-title">${t('tableQr')} <small>${t('tableQrSub')}</small></h3>
        <div class="merchant-table">
          <div class="merchant-table-list" id="tableList">
            ${APP_TABLES.map(t => `
              <button class="table-chip" data-table="${t.id}">${t.id}</button>`).join('')}
          </div>
          <div class="merchant-table-qr" id="tableQrBox">
            <div style="color:var(--text-3);font-size:12px;padding:20px 0;">选择桌号生成点单码</div>
          </div>
        </div>
        <p style="margin:8px 0 0;font-size:10px;color:var(--text-3);">顾客使用微信/相机扫描桌台码，自动绑定桌台并进入点餐；也可在首页「扫码点单」手动输入桌号。</p>
      </div>

      <!-- 销量 Top -->
      <div class="merchant-card">
        <h3 class="merchant-card-title">热销商品 Top5</h3>
        ${topList}
      </div>

      <!-- 订单状态概览 -->
      <div class="merchant-flow-stats">
        <span>待支付 <b style="color:#facc15;">${s.pending}</b></span>
        <span>${t('pendingVerify')} <b style="color:#22d3ee;">${s.paid}</b></span>
        <span>已完成 <b style="color:#4ade80;">${s.completed}</b></span>
        <span>已取消 <b style="color:#9ca3af;">${s.cancelled}</b></span>
      </div>

      <!-- 经营图表 -->
      <div class="merchant-card">
        <h3 class="merchant-card-title">近 7 日营收趋势 <small>按订单实付汇总</small></h3>
        <div id="chartRevenue" style="height:200px;width:100%;"></div>
      </div>
      <div class="merchant-card">
        <h3 class="merchant-card-title">时段客流分布 <small>营业时段 19:00–03:00</small></h3>
        <div id="chartHour" style="height:200px;width:100%;"></div>
      </div>
      <div class="merchant-card">
        <h3 class="merchant-card-title">${t('turnoverTitle')} <small>${t('turnoverSub')}</small></h3>
        <div id="chartTurnover" style="height:170px;width:100%;"></div>
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
    // 等页面激活与 reflow 完成后初始化 ECharts（隐藏容器拿不到尺寸）
    this._charts = this._charts || [];
    setTimeout(() => this.initCharts(root), 160);
  },

  // 经营图表（ECharts 本地构建，离线可用；库缺失时降级为文字数据）
  initCharts(root) {
    const s = this.stats();
    const hasData = s.orders.length > 0;
    const fallback = (el) => {
      if (!el) return;
      el.innerHTML = '<p style="color:var(--text-3);font-size:12px;text-align:center;padding:64px 0;">暂无数据 · 完成第一笔订单后自动生成</p>';
    };
    if (typeof echarts === 'undefined') {
      ['chartRevenue', 'chartHour', 'chartTurnover'].forEach(id => fallback(root.querySelector('#' + id)));
      return;
    }

    // 1) 近 7 日营收趋势
    const revEl = root.querySelector('#chartRevenue');
    if (revEl) {
      if (!hasData) fallback(revEl);
      else {
        const c = echarts.init(revEl);
        this._charts.push(c);
        c.setOption({
          backgroundColor: 'transparent',
          grid: { left: 44, right: 10, top: 28, bottom: 22 },
          tooltip: { trigger: 'axis', backgroundColor: '#1a1426', borderColor: '#3a3550', textStyle: { color: '#f2ede3', fontSize: 11 } },
          xAxis: { type: 'category', data: s.revenue.map(r => r.date.slice(5)), axisLine: { lineStyle: { color: '#3a3550' } }, axisLabel: { color: '#9a94a8', fontSize: 10 } },
          yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,.06)' } }, axisLabel: { color: '#9a94a8', fontSize: 10 } },
          series: [{
            name: '营收', type: 'line', smooth: true, symbolSize: 6,
            data: s.revenue.map(r => r.total),
            lineStyle: { color: '#d4af37', width: 2 },
            itemStyle: { color: '#d4af37' },
            areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(212,175,55,.35)' }, { offset: 1, color: 'rgba(212,175,55,0)' }] } }
          }]
        });
      }
    }

    // 2) 时段客流分布
    const hourEl = root.querySelector('#chartHour');
    if (hourEl) {
      if (!hasData) fallback(hourEl);
      else {
        const c = echarts.init(hourEl);
        this._charts.push(c);
        c.setOption({
          backgroundColor: 'transparent',
          grid: { left: 38, right: 10, top: 28, bottom: 22 },
          tooltip: { trigger: 'axis', backgroundColor: '#1a1426', borderColor: '#3a3550', textStyle: { color: '#f2ede3', fontSize: 11 } },
          xAxis: { type: 'category', data: s.hourFlow.map(h => h.label), axisLine: { lineStyle: { color: '#3a3550' } }, axisLabel: { color: '#9a94a8', fontSize: 10 } },
          yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,.06)' } }, axisLabel: { color: '#9a94a8', fontSize: 10 } },
          series: [{
            name: '订单量', type: 'bar', barWidth: '55%',
            data: s.hourFlow.map(h => h.count),
            itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#d4af37' }, { offset: 1, color: '#7c3aed' }] }, borderRadius: [6, 6, 0, 0] }
          }]
        });
      }
    }

    // 3) 桌台翻台率（仪表盘）
    const ttEl = root.querySelector('#chartTurnover');
    if (ttEl) {
      const c = echarts.init(ttEl);
      this._charts.push(c);
      c.setOption({
        backgroundColor: 'transparent',
        series: [{
          name: '翻台率', type: 'gauge',
          startAngle: 210, endAngle: -30, min: 0, max: 200,
          progress: { show: true, width: 14, itemStyle: { color: '#d4af37' } },
          axisLine: { lineStyle: { width: 14, color: [[1, 'rgba(255,255,255,.1)']] } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          anchor: { show: false },
          title: { offsetCenter: [0, '38%'], color: '#9a94a8', fontSize: 11 },
          detail: { valueAnimation: true, offsetCenter: [0, '0%'], formatter: '{value}%', color: '#d4af37', fontSize: 26, fontWeight: 800 },
          data: [{ value: s.turnover, name: '桌台翻台率' }]
        }]
      });
    }

    // 视口变化时自适应
    if (!this._resizeBound) {
      this._resizeBound = true;
      window.addEventListener('resize', () => {
        this._charts.forEach(x => { try { x.resize(); } catch (e) {} });
      });
    }
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
        // 可扫描直达：顾客扫码打开 URL → 自动绑定桌台并进入点餐
        const payload = location.href.split('#')[0].split('?')[0] + '?table=' + no;
        box.innerHTML = `
          <div class="table-qr-wrap">
            ${generateQRCodeSVG(payload, 150)}
            <div style="font-weight:800;letter-spacing:1px;margin-top:6px;">桌台 ${esc(no)}</div>
            <div style="font-size:10px;color:var(--text-3);">扫码即自动绑定桌台并进入点餐</div>
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
        <h3 style="margin:0 0 6px;font-size:17px;">${t('verifyConfirmTitle')}</h3>
        <p style="margin:0 0 4px;color:var(--text-3);font-size:12px;">订单号 ${esc(o.id)} · 实付 ¥${o.total}</p>
        <p style="margin:0 0 18px;color:var(--text-3);font-size:12px;">${o.items.map(it => `${esc(it.name)}×${it.qty}`).join('、')}</p>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-ghost btn-block" style="flex:1;" onclick="closeModal()">取消</button>
          <button class="btn btn-primary btn-block" style="flex:1;" id="okVerify">${t('verifyConfirmBtn')}</button>
        </div>
      </div>
    `);
    const ok = document.getElementById('okVerify');
    if (ok) ok.onclick = () => {
      OrderService.updateStatus(o.id, 'completed');
      closeModal();
      toast(t('verifySuccess'));
      this.mount(root);
    };
  }
};
