/* ============================================
   MIX CLUB · Table Booking Page
   散台/卡座选座订台 · 座位图式
   ============================================ */

// 座位图扩展信息（桌台 id → 默认状态 / 推荐语 / 座位图坐标）
// 桌台本体数据见 data.js APP_TABLES，与扫码点单绑定同一套真实桌台号
const TB_TABLE_EXT = {
  K01: { status: 'available', desc: '靠舞台·最佳视角',   x: 18, y: 20 },
  K02: { status: 'booked',    desc: '靠舞台·最佳视角',   x: 82, y: 20 },
  K03: { status: 'available', desc: '舞池侧·氛围佳',     x: 18, y: 47 },
  K04: { status: 'available', desc: '舞池侧·氛围佳',     x: 82, y: 47 },
  K05: { status: 'sold',      desc: '靠吧台·调酒师推荐', x: 18, y: 62 },
  K06: { status: 'available', desc: '靠吧台·调酒师推荐', x: 82, y: 62 },
  S01: { status: 'available', desc: '舞池上方·视野好',   x: 20, y: 32 },
  S02: { status: 'booked',    desc: '舞池上方·视野好',   x: 32, y: 32 },
  S03: { status: 'available', desc: '舞池上方·视野好',   x: 44, y: 32 },
  S04: { status: 'available', desc: '舞池上方·视野好',   x: 56, y: 32 },
  S05: { status: 'sold',      desc: '舞池上方·视野好',   x: 68, y: 32 },
  S06: { status: 'available', desc: '舞池上方·视野好',   x: 80, y: 32 },
  S07: { status: 'available', desc: '舞池下方·安静',     x: 20, y: 77 },
  S08: { status: 'booked',    desc: '舞池下方·安静',     x: 32, y: 77 },
  S09: { status: 'available', desc: '舞池下方·安静',     x: 44, y: 77 },
  S10: { status: 'available', desc: '舞池下方·安静',     x: 56, y: 77 },
  S11: { status: 'sold',      desc: '舞池下方·安静',     x: 68, y: 77 },
  S12: { status: 'available', desc: '舞池下方·安静',     x: 80, y: 77 }
};

const TableBookingPage = {
  selectedDate: null,
  people: 2,
  selectedTable: null, // {id, name, type, price, cap}
  activeZone: 'all',   // 区域筛选：all / san / ka
  seatStatuses: null,      // 按所选日期随机生成的座位状态 {id: status}
  seatStatusesDate: null,  // 生成状态对应的日期

  // 桌台数据：本体（id/类型/容量/价格/VIP）取自 data.js APP_TABLES，与扫码点单同步；
  // 座位图专用字段（默认状态/推荐语/坐标）由 TB_TABLE_EXT 扩展
  tables: APP_TABLES.map(base => Object.assign({}, base, {
    status: TB_TABLE_EXT[base.id].status,
    desc:   TB_TABLE_EXT[base.id].desc,
    x:      TB_TABLE_EXT[base.id].x,
    y:      TB_TABLE_EXT[base.id].y
  })),

  // ---------- 渲染 ----------
  render() {
    const stats = this.computeStats();
    return `
      <!-- 沉浸式 Hero -->
      <div class="tb-hero">
        <div class="tb-hero-bg"></div>
        <div class="tb-hero-content">
          <div class="tb-hero-eyebrow">
            <span class="tb-hero-dot"></span>
            <span>MIX CLUB · 在线订台</span>
          </div>
          <h2 class="tb-hero-title">挑一张<br>属于你的台</h2>
          <p class="tb-hero-sub">散台 S · 卡座 K · 即点即订 · 锁定最佳视角</p>
          <div class="tb-hero-stats">
            <div class="tb-hero-stat"><b>${stats.total}</b><small>总桌台</small></div>
            <div class="tb-hero-stat"><b>${stats.free}</b><small>可选</small></div>
            <div class="tb-hero-stat"><b>${stats.sold}</b><small>已订/售</small></div>
          </div>
        </div>
      </div>

      <!-- 日期选择 -->
      <div class="tb-section">
        <div class="tb-section-head">
          <h3 class="section-title">选择日期<small>${this.calendarMonthLabel()} · 先选日期再选座</small></h3>
        </div>
        <div class="tb-calendar">
          <div class="tb-cal-weekdays">
            ${['日','一','二','三','四','五','六'].map(d => `<span>${esc(d)}</span>`).join('')}
          </div>
          <div class="tb-cal-grid" id="tbCalGrid">${this.renderCalendar()}</div>
        </div>
      </div>

      <!-- 区域筛选 -->
      <div class="tb-section">
        <div class="tb-section-head">
          <h3 class="section-title">筛选桌台<small>点击切换类型</small></h3>
        </div>
        <div class="tb-zone-filter">
          <button class="tb-zone-btn ${this.activeZone === 'all' ? 'active' : ''}" data-zone="all">
            <span class="zone-ico">🗺️</span><b>全部</b><small>${this.countByZone('all')}</small>
          </button>
          <button class="tb-zone-btn ${this.activeZone === 'ka' ? 'active' : ''}" data-zone="ka">
            <span class="zone-ico">🛋️</span><b>卡座 K</b><small>${this.countByZone('ka')}</small>
          </button>
          <button class="tb-zone-btn ${this.activeZone === 'san' ? 'active' : ''}" data-zone="san">
            <span class="zone-ico">🪑</span><b>散台 S</b><small>${this.countByZone('san')}</small>
          </button>
        </div>
      </div>

      <!-- 座位图 -->
      <div class="tb-section">
        <div class="tb-section-head">
          <h3 class="section-title">座位图<small>点击任意座位完成选座</small></h3>
        </div>
        <div class="tb-map">
          <div class="tb-map-zone tb-map-stage">舞台</div>
          <div class="tb-map-zone tb-map-dance">舞池</div>
          <div class="tb-map-zone tb-map-bar">吧台</div>
          ${this.renderMapSeats()}
        </div>
        <div class="tb-map-legend">
          <span class="tb-map-legend-item"><i class="tb-map-dot dot-free"></i>可选</span>
          <span class="tb-map-legend-item"><i class="tb-map-dot dot-sel"></i>已选</span>
          <span class="tb-map-legend-item"><i class="tb-map-dot dot-booked"></i>已订</span>
          <span class="tb-map-legend-item"><i class="tb-map-dot dot-sold"></i>已售</span>
          <span class="tb-map-legend-item"><i class="tb-map-dot dot-vip"></i>VIP 卡座</span>
        </div>
      </div>

      <!-- 人数 -->
      <div class="tb-section">
        <div class="tb-section-head">
          <h3 class="section-title">人数<small>适配所选桌台</small></h3>
        </div>
        <div class="tb-people-row" id="tbPeopleRow">
          ${[1, 2, 3, 4, 5, 6, 8, 10].map(n => `
            <button class="tb-people-btn ${this.people === n ? 'active' : ''}" data-people="${n}">${n}人</button>
          `).join('')}
        </div>
      </div>

      <!-- 预订须知 -->
      <div class="tb-section">
        <div class="tb-notice">
          <div class="tb-notice-icon">💡</div>
          <div class="tb-notice-body">
            <h4>订台须知</h4>
            <ul>
              <li>预订需提前 <b>2 小时</b>，订单保留至当晚营业结束</li>
              <li>预订后到吧台/前台出示手机号或订单号核销</li>
              <li>卡座含开台套餐（人均低消），散台免低消</li>
              <li>取消请提前 1 小时，逾期扣除定金 ¥100</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底部固定预订栏 -->
      ${this.renderBookingBar()}

      <div class="page-footer">© 2026 MIX CLUB · 散台 / 卡座在线订台</div>
    `;
  },

  // ---------- 座位图渲染 ----------
  renderMapSeats() {
    return this.tables.map(t => {
      const isSel = this.selectedTable && this.selectedTable.id === t.id;
      const dim = this.activeZone !== 'all' && t.type !== this.activeZone;
      const st = this.getStatus(t);
      const statusText = isSel ? '已选'
                       : st === 'sold' ? '已售'
                       : st === 'booked' ? '已订'
                       : '可选';

      let cls = 'tb-seat ' + (t.type === 'ka' ? 'ka' : 'san');
      cls += st === 'available' ? ' free' : (st === 'booked' ? ' booked' : ' sold');
      if (isSel) cls += ' selected';
      if (t.vip) cls += ' vip';
      if (dim) cls += ' dim';

      return `
        <div class="${cls}" data-table-id="${esc(t.id)}" role="button"
             style="left:${t.x}%;top:${t.y}%;"
             aria-label="${esc(t.name)}·${statusText}">
          <span class="tb-seat-name">${esc(t.name)}</span>
        </div>
      `;
    }).join('');
  },

  // ---------- 工具方法 ----------
  countByZone(zone) {
    if (zone === 'all') return this.tables.length;
    return this.tables.filter(t => t.type === zone).length;
  },

  findTable(id) {
    return this.tables.find(t => t.id === id);
  },

  // 座位状态：未选日期用默认状态；选中日期后按该日期随机生成
  getStatus(t) {
    if (this.seatStatuses && this.seatStatuses[t.id]) return this.seatStatuses[t.id];
    return t.status;
  },

  // 按日期随机生成座位状态（保证可选 ≥ 一半，确保有座可订）
  generateStatuses(date) {
    const map = {};
    this.tables.forEach(t => {
      const r = Math.random();
      let st = 'available';
      if (r < 0.16) st = 'sold';
      else if (r < 0.46) st = 'booked';
      map[t.id] = st;
    });
    const avail = this.tables.filter(t => map[t.id] === 'available').length;
    if (avail < Math.ceil(this.tables.length / 2)) {
      const need = Math.ceil(this.tables.length / 2) - avail;
      this.tables
        .filter(t => map[t.id] !== 'available')
        .sort(() => Math.random() - 0.5)
        .slice(0, need)
        .forEach(t => { map[t.id] = 'available'; });
    }
    return map;
  },

  computeStats() {
    const total = this.tables.length;
    const free = this.tables.filter(t => this.getStatus(t) === 'available').length;
    return { total, free, sold: total - free };
  },

  // ---------- 日期 ----------
  calendarMonthLabel() {
    const d = new Date();
    return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
  },

  renderCalendar() {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const lastDate = new Date(y, m + 1, 0).getDate();

    let html = '';
    for (let i = 0; i < firstDay; i++) html += '<div class="tb-cal-cell empty"></div>';

    for (let d = 1; d <= lastDate; d++) {
      const dt = new Date(y, m, d);
      const dateStr = `${y}-${pad(m + 1)}-${pad(d)}`;
      const dow = dt.getDay();
      const isToday = dt.toDateString() === today.toDateString();
      const isSel = this.selectedDate === dateStr;
      const isPast = dt < today && !isToday;
      const isFull = dow === 6;

      let cls = 'tb-cal-cell';
      if (isPast) cls += ' past';
      if (isToday) cls += ' today';
      if (isFull) cls += ' full';
      if (isSel) cls += ' selected';

      html += `<div class="${cls}" ${isPast || isFull ? '' : `data-date="${dateStr}"`}>
        <span class="tb-cal-num">${d}</span>
      </div>`;
    }
    return html;
  },

  // ---------- 底部栏 ----------
  renderBookingBar() {
    const steps = [
      { k: 'table', label: '桌台', done: !!this.selectedTable },
      { k: 'date',  label: '日期', done: !!this.selectedDate }
    ];
    const hasAll = this.selectedTable && this.selectedDate;

    let info = '';
    if (hasAll) {
      info = `<strong>${esc(this.selectedTable.name)}</strong><small>${esc(this.selectedDate)} · ${this.people}人 · ¥${this.selectedTable.price}</small>`;
    } else if (this.selectedTable) {
      info = `<strong>${esc(this.selectedTable.name)}</strong><small>请选择日期</small>`;
    } else {
      info = `<strong>请选择桌台</strong><small>点击座位图完成选座</small>`;
    }

    return `
      <div class="tb-bar">
        <div class="tb-bar-steps">
          ${steps.map((s, i) => `
            <div class="tb-bar-step ${s.done ? 'done' : ''}">
              <span class="tb-bar-dot">${s.done ? '✓' : (i + 1)}</span>
              <small>${s.label}</small>
              ${i < steps.length - 1 ? '<span class="tb-bar-line"></span>' : ''}
            </div>
          `).join('')}
        </div>
        <div class="tb-bar-foot">
          <div class="tb-bar-info">${info}</div>
          <button class="btn btn-primary tb-bar-btn" id="confirmTableBooking" ${hasAll ? '' : 'disabled'}>
            ${hasAll ? '确认订台' : '去选择'}
          </button>
        </div>
      </div>
    `;
  },

  // ---------- 交互 ----------
  handleTableClick(tableId) {
    const t = this.findTable(tableId);
    if (!t) return;

    const st = this.getStatus(t);
    if (st === 'sold') {
      toast('该桌台已售，无法预订', 'error');
      return;
    }
    if (st === 'booked') {
      toast('该桌台已被预订', 'warn');
      return;
    }

    // 选中 / 取消
    if (this.selectedTable && this.selectedTable.id === t.id) {
      this.selectedTable = null;
    } else {
      this.selectedTable = {
        id: t.id, name: t.name, type: t.type,
        price: t.price, cap: t.cap, status: st, vip: !!t.vip
      };
    }

    // 推荐人数
    if (this.selectedTable && this.people > this.selectedTable.cap) {
      this.people = this.selectedTable.cap;
    }

    this.updateMap();
    this.updateBar();
  },

  updateMap() {
    document.querySelectorAll('.tb-seat').forEach(el => {
      const id = el.dataset.tableId;
      const t = this.findTable(id);
      if (!t) return;
      const isSel = this.selectedTable && this.selectedTable.id === id;
      const dim = this.activeZone !== 'all' && t.type !== this.activeZone;
      const st = this.getStatus(t);

      el.classList.remove('free', 'booked', 'sold', 'selected', 'dim');
      if (st === 'available') el.classList.add('free');
      else if (st === 'booked') el.classList.add('booked');
      else el.classList.add('sold');
      if (isSel) el.classList.add('selected');
      if (dim) el.classList.add('dim');
    });
  },

  updateBar() {
    const oldBar = document.querySelector('.tb-bar');
    if (oldBar) oldBar.outerHTML = this.renderBookingBar();
    this.bindBarEvents();
  },

  // ---------- 挂载 ----------
  mount(root) {
    root.innerHTML = this.render();
    this.bindEvents(root);
  },

  bindEvents(root) {
    // 区域筛选
    root.querySelectorAll('[data-zone]').forEach(b => {
      b.addEventListener('click', () => {
        this.activeZone = b.getAttribute('data-zone');
        this.selectedTable = null;
        this.mount(root);
      });
    });

    // 座位图：点击任意座位完成选座（事件委托）
    const map = root.querySelector('.tb-map');
    if (map) {
      map.addEventListener('click', e => {
        const seat = e.target && e.target.closest ? e.target.closest('.tb-seat') : null;
        if (seat) this.handleTableClick(seat.dataset.tableId);
      });
    }

    // 日期：先选日期，再为该日期随机生成座位状态
    root.querySelectorAll('[data-date]').forEach(el => {
      el.addEventListener('click', () => {
        const d = el.getAttribute('data-date');
        this.selectedDate = d;
        this.selectedTable = null; // 换日期后需重新选座
        if (this.seatStatusesDate !== d) {
          this.seatStatuses = this.generateStatuses(d);
          this.seatStatusesDate = d;
        }
        this.mount(root);
      });
    });

    // 人数
    root.querySelectorAll('[data-people]').forEach(b => {
      b.addEventListener('click', () => {
        this.people = parseInt(b.getAttribute('data-people'), 10);
        this.mount(root);
      });
    });

    this.bindBarEvents();
  },

  bindBarEvents() {
    const btn = document.getElementById('confirmTableBooking');
    if (btn && !btn.disabled) {
      btn.addEventListener('click', () => this.confirm());
    }
  },

  // ---------- 提交 ----------
  confirm() {
    if (!this.selectedTable || !this.selectedDate) return;

    const bookings = LS.get(LS_KEYS.BOOKINGS, []);
    const id = 'TB' + Date.now();
    const newBk = {
      id,
      type: 'table',
      table: this.selectedTable.name,
      tableId: this.selectedTable.id,
      tableType: this.selectedTable.type,
      tableVip: !!this.selectedTable.vip,
      cap: this.selectedTable.cap,
      price: this.selectedTable.price,
      date: this.selectedDate,
      people: this.people,
      created: Date.now()
    };
    bookings.unshift(newBk);
    LS.set(LS_KEYS.BOOKINGS, bookings);

    const t = this.selectedTable;
    const tagText = t.type === 'ka' ? (t.vip ? 'VIP 卡座' : '卡座') : '散台';
    openModal(`
      <div style="text-align:center;">
        <div style="font-size:50px;margin-bottom:10px;">🎉</div>
        <h3 style="margin:0 0 6px;">订台成功</h3>
        <p style="margin:0 0 18px;color:var(--text-3);font-size:12px;">订单号 ${esc(id)}</p>
        <div style="background:var(--bg-3);padding:14px;border-radius:12px;text-align:left;font-size:13px;line-height:1.9;">
          <div><span style="color:var(--text-3);">桌台</span> <strong>${esc(t.name)}</strong> <span style="font-size:11px;color:var(--gold-2);">(${tagText})</span></div>
          <div><span style="color:var(--text-3);">日期</span> <strong>${esc(this.selectedDate)}</strong></div>
          <div><span style="color:var(--text-3);">人数</span> <strong>${this.people} 人</strong></div>
          <div><span style="color:var(--text-3);">金额</span> <strong style="color:var(--gold-2);">¥${t.price}</strong></div>
        </div>
        <p style="margin:14px 0 0;color:var(--text-3);font-size:11px;line-height:1.5;">到店后请到吧台或前台出示订单号 <b style="color:var(--gold-2);">${esc(id)}</b> 核销</p>
        <button class="btn btn-primary btn-block" style="margin-top:18px;" onclick="closeModal();navigate('profile');">查看我的预订</button>
      </div>
    `);

    // 重置
    this.selectedTable = null;
    this.selectedDate = null;
    this.seatStatuses = null;
    this.seatStatusesDate = null;
  },

  destroy() {
    // 页面级资源清理（暂无定时器，保留接口）
  }
};
