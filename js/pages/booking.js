/* ============================================
   MIX CLUB · Booking Page
   包厢预订 · 现代高奢卡片风
   ============================================ */

const BookingPage = {
  selectedDate: null,
  selectedRoom: null,
  people: 4,

  // ---------- 渲染 ----------
  render() {
    const stats = this.computeStats();
    return `
      <!-- 沉浸式 Hero -->
      <div class="bk-hero">
        <div class="bk-hero-bg"></div>
        <div class="bk-hero-content">
          <div class="bk-hero-eyebrow">
            <span class="bk-hero-dot"></span>
            <span>MIX CLUB · 包厢预订</span>
          </div>
          <h2 class="bk-hero-title">专属你的<br>派对之夜</h2>
          <p class="bk-hero-sub">提前预订享 8 折 · 生日派对可享专属布置</p>
          <div class="bk-hero-stats">
            <div class="bk-hero-stat">
              <b>${APP_DATA.rooms.length}</b><small>包厢可选</small>
            </div>
            <div class="bk-hero-stat">
              <b>${stats.available}</b><small>可预订</small>
            </div>
            <div class="bk-hero-stat">
              <b>${stats.sold}</b><small>已售出</small>
            </div>
          </div>
        </div>
      </div>

      <!-- 日期 -->
      <div class="bk-section">
        <div class="bk-section-head">
          <h3 class="section-title">选择日期<small>${this.calendarMonthLabel()}</small></h3>
        </div>
        <div class="bk-calendar">
          <div class="bk-cal-weekdays">
            ${['日','一','二','三','四','五','六'].map(d => `<span>${esc(d)}</span>`).join('')}
          </div>
          <div class="bk-cal-grid" id="bkCalGrid">
            ${this.renderCalendar()}
          </div>
          <div class="bk-cal-legend">
            <span><i class="dot-free"></i>可预订</span>
            <span><i class="dot-hot"></i>热门</span>
            <span><i class="dot-full"></i>已满</span>
          </div>
        </div>
      </div>


      <!-- 推荐包厢 -->
      <div class="bk-section">
        <div class="bk-section-head">
          <h3 class="section-title">推荐包厢<small>${APP_DATA.rooms.length} 款可选</small></h3>
        </div>
        <div class="bk-rooms">
          ${this.renderRooms()}
        </div>
      </div>

      <!-- 预订须知 -->
      <div class="bk-section">
        <div class="bk-notice">
          <div class="bk-notice-icon">💡</div>
          <div class="bk-notice-body">
            <h4>预订须知</h4>
            <ul>
              <li>预订需提前 <b>2 小时</b>，到店即安排入场</li>
              <li>预订成功后将发送短信确认，VIP 会员享 <b>8 折</b></li>
              <li>取消请提前 1 小时，逾期扣除定金 ¥200</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底部固定预订栏 -->
      ${this.renderBookingBar()}

      <div class="page-footer">
        © 2026 MIX CLUB · 包厢在线预订
      </div>
    `;
  },

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
    for (let i = 0; i < firstDay; i++) html += '<div class="bk-cal-cell empty"></div>';

    for (let d = 1; d <= lastDate; d++) {
      const dt = new Date(y, m, d);
      const dateStr = `${y}-${pad(m + 1)}-${pad(d)}`;
      const dow = dt.getDay();
      const isToday = dt.toDateString() === today.toDateString();
      const isSel = this.selectedDate === dateStr;
      // 模拟：周六满、周五热门
      const isFull = dow === 6 && d % 3 === 0;
      const isHot = (dow === 5 || dow === 6) && !isFull && d % 5 === 0;
      const isPast = dt < today && !isToday;

      let cls = 'bk-cal-cell';
      if (isPast) cls += ' past';
      if (isToday) cls += ' today';
      if (isHot) cls += ' hot';
      if (isFull) cls += ' full';
      if (isSel) cls += ' selected';

      html += `<div class="${cls}" ${isPast || isFull ? '' : `data-date="${dateStr}"`}>
        <span class="bk-cal-num">${d}</span>
        ${isHot ? '<i class="bk-cal-mark"></i>' : ''}
      </div>`;
    }
    return html;
  },


  renderRooms() {
    return APP_DATA.rooms.map(r => {
      const sel = this.selectedRoom === r.id;
      return `
        <div class="bk-room-card ${sel ? 'selected' : ''}" data-room="${esc(r.id)}">
          <div class="bk-room-img" style="background-image:url('${esc(r.img)}')">
            <div class="bk-room-img-overlay"></div>
            <div class="bk-room-badge">${esc(r.tags[0] || '推荐')}</div>
            ${sel ? '<div class="bk-room-check"><span>✓</span></div>' : ''}
          </div>
          <div class="bk-room-body">
            <div class="bk-room-head">
              <h4>${esc(r.name)}</h4>
              <span class="bk-room-cap">${esc(r.capacity)}</span>
            </div>
            <p class="bk-room-desc">${esc(r.desc)}</p>
            <div class="bk-room-tags">
              ${r.tags.slice(1).map(t => `<span class="bk-tag">${esc(t)}</span>`).join('')}
            </div>
            <div class="bk-room-foot">
              <div class="bk-room-price">
                <span class="sym">¥</span><b>${r.price}</b><span class="unit">/晚</span>
              </div>
              <button class="btn ${sel ? 'btn-primary' : 'btn-ghost'} bk-room-btn" data-select-room="${esc(r.id)}">
                ${sel ? '✓ 已选' : '选择'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // 更新底部预订栏
  updateBookingBar() {
    const barEl = document.querySelector('.bk-bar');
    if (barEl) {
      barEl.outerHTML = this.renderBookingBar();
    }
  },

  computeStats() {
    // 模拟：已售包厢数（按本月天数+房间数造势）
    return { available: APP_DATA.rooms.length * 6, sold: APP_DATA.rooms.length * 9 + 8 };
  },

  renderBookingBar() {
    const steps = [
      { k: 'date', label: '日期', done: !!this.selectedDate },
      { k: 'room', label: '包厢', done: !!this.selectedRoom }
    ];

    const hasAll = this.selectedDate && this.selectedRoom;

    let infoContent = '';
    if (this.selectedRoom) {
      const room = APP_DATA.rooms.find(r => r.id === this.selectedRoom);
      infoContent = `<strong>${room.name}</strong><small>${this.selectedDate || ''} · ${this.people}人</small>`;
    } else {
      infoContent = `<strong>请选择包厢</strong><small>选择下方包厢完成预订</small>`;
    }

    return `
      <div class="bk-bar">
        <div class="bk-bar-steps">
          ${steps.map((s, i) => `
            <div class="bk-bar-step ${s.done ? 'done' : ''}">
              <span class="bk-bar-dot">${s.done ? '✓' : (i + 1)}</span>
              <small>${s.label}</small>
              ${i < steps.length - 1 ? '<span class="bk-bar-line"></span>' : ''}
            </div>
          `).join('')}
        </div>
        <div class="bk-bar-foot">
          <div class="bk-bar-info">
            ${infoContent}
          </div>
          <button class="btn btn-primary bk-bar-btn" id="confirmBooking" ${hasAll ? '' : 'disabled'}>
            ${hasAll ? '确认预订' : '去选择'}
          </button>
        </div>
      </div>
    `;
  },

  // ---------- 挂载 & 事件 ----------
  mount(root) {
    root.innerHTML = this.render();
    this.bindEvents(root);
  },

  bindEvents(root) {
    // 日期
    root.querySelectorAll('[data-date]').forEach(el => {
      el.addEventListener('click', () => {
        this.selectedDate = el.getAttribute('data-date');
        this.mount(root);
      });
    });

    // 包厢卡片点击（选中态）
    root.querySelectorAll('[data-room]').forEach(el => {
      el.addEventListener('click', () => {
        this.selectedRoom = el.getAttribute('data-room');
        this.mount(root);
        toast('已选择包厢');
      });
    });

    // 选择按钮（阻止冒泡）
    root.querySelectorAll('[data-select-room]').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        this.selectedRoom = b.getAttribute('data-select-room');
        this.mount(root);
        toast('已选择包厢');
      });
    });

    // 确认预订
    const confirm = root.querySelector('#confirmBooking');
    if (confirm && !confirm.disabled) {
      confirm.addEventListener('click', () => this.confirm());
    }
  },

  // ---------- 提交 ----------
  confirm() {
    let roomBookings = [];
    
    // 处理包厢预订
    if (this.selectedRoom) {
      const room = APP_DATA.rooms.find(r => r.id === this.selectedRoom);
      roomBookings = [{
        id: 'BK' + Date.now(),
        room: room.name,
        date: this.selectedDate,
        price: room.price,
        type: 'room',
        created: Date.now()
      }];
    }
    
    const allBookings = LS.get(LS_KEYS.BOOKINGS, []);
    const newBookings = [...roomBookings];
    allBookings.unshift(...newBookings);
    LS.set(LS_KEYS.BOOKINGS, allBookings);

    // 弹出成功提示
    let detailHtml = '';
    if (roomBookings.length > 0) {
      detailHtml += `<div><span style="color:var(--text-3);">包厢</span> <strong>${esc(roomBookings[0].room)}</strong></div>`;
      detailHtml += `<div><span style="color:var(--text-3);">日期</span> <strong>${esc(this.selectedDate)}</strong></div>`;
      detailHtml += `<div><span style="color:var(--text-3);">金额</span> <strong style="color:var(--gold-2);">¥${roomBookings[0].price}</strong></div>`;
    }

    openModal(`
      <div style="text-align:center;">
        <div style="font-size:50px;margin-bottom:10px;">🎉</div>
        <h3 style="margin:0 0 6px;">预订成功</h3>
        <p style="margin:0 0 18px;color:var(--text-3);font-size:12px;">订单号 ${esc(newBookings[0].id)}</p>
        <div style="background:var(--bg-3);padding:14px;border-radius:12px;text-align:left;font-size:13px;line-height:1.9;">
          ${detailHtml}
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:18px;" onclick="closeModal()">查看我的预订</button>
      </div>
    `);

    // 重置
    this.selectedDate = null;
    this.selectedRoom = null;
  }
};
