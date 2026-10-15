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
            <span>MIX CLUB · ${t('titleBooking')}</span>
          </div>
          <h2 class="bk-hero-title">${t('bkHero1')}<br>${t('bkHero2')}</h2>
          <p class="bk-hero-sub">${t('bookingDiscount')}</p>
          <div class="bk-hero-stats">
            <div class="bk-hero-stat">
              <b>${APP_DATA.rooms.length}</b><small>${t('roomsAvailable')}</small>
            </div>
            <div class="bk-hero-stat">
              <b>${stats.available}</b><small>${t('bookable')}</small>
            </div>
            <div class="bk-hero-stat">
              <b>${stats.sold}</b><small>${t('soldOut')}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- 日期 -->
      <div class="bk-section">
        <div class="bk-section-head">
          <h3 class="section-title">${t('selectDate')}<small>${this.calendarMonthLabel()}</small></h3>
        </div>
        <div class="bk-calendar">
          <div class="bk-cal-weekdays">
            ${(LangService.isEn() ? ['Su','Mo','Tu','We','Th','Fr','Sa'] : ['日','一','二','三','四','五','六']).map(d => `<span>${esc(d)}</span>`).join('')}
          </div>
          <div class="bk-cal-grid" id="bkCalGrid">
            ${this.renderCalendar()}
          </div>
          <div class="bk-cal-legend">
            <span><i class="dot-free"></i>${t('bookable')}</span>
            <span><i class="dot-hot"></i>${t('hotTag')}</span>
            <span><i class="dot-full"></i>${t('fullTag')}</span>
          </div>
        </div>
      </div>


      <!-- 推荐包厢 -->
      <div class="bk-section">
        <div class="bk-section-head">
          <h3 class="section-title">${t('featuredRooms')}<small>${APP_DATA.rooms.length} ${t('roomsCountSuffix')}</small></h3>
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
            <h4>${t('bkNoticeTitle')}</h4>
            <ul>
              <li>${t('bkNotice1')}</li>
              <li>${t('bkNotice2')}</li>
              <li>${t('bkNotice3')}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底部固定预订栏 -->
      ${this.renderBookingBar()}

      <div class="page-footer">
        © 2026 MIX CLUB · ${t('footerRoomBooking')}
      </div>
    `;
  },

  calendarMonthLabel() {
    const d = new Date();
    return LangService.isEn() ? `${d.getFullYear()}/${d.getMonth() + 1}` : `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
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
      // 规则：周六满、周五热门
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
            <div class="bk-room-badge">${esc((LangService.isEn() ? (r.tagsEn || r.tags) : r.tags)[0] || (LangService.isEn() ? 'Recommend' : '推荐'))}</div>
            ${sel ? '<div class="bk-room-check"><span>✓</span></div>' : ''}
          </div>
          <div class="bk-room-body">
            <div class="bk-room-head">
              <h4>${esc(L(r.name, r.nameEn))}</h4>
              <span class="bk-room-cap">${esc(L(r.capacity, r.capacityEn))}</span>
            </div>
            <p class="bk-room-desc">${esc(L(r.desc, r.descEn))}</p>
            <div class="bk-room-tags">
              ${(LangService.isEn() ? r.tagsEn : r.tags).slice(1).map(t => `<span class="bk-tag">${esc(t)}</span>`).join('')}
            </div>
            <div class="bk-room-foot">
              <div class="bk-room-price">
                <span class="sym">¥</span><b>${r.price}</b><span class="unit">${t('perNight')}</span>
              </div>
              <button class="btn ${sel ? 'btn-primary' : 'btn-ghost'} bk-room-btn" data-select-room="${esc(r.id)}">
                ${sel ? '✓ ' + t('roomPicked') : t('roomPick')}
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
    // 已售包厢数（按本月天数+房间数）
    return { available: APP_DATA.rooms.length * 6, sold: APP_DATA.rooms.length * 9 + 8 };
  },

  renderBookingBar() {
    const steps = [
      { k: 'date', label: t('dateWord'), done: !!this.selectedDate },
      { k: 'room', label: t('roomWord'), done: !!this.selectedRoom }
    ];

    const hasAll = this.selectedDate && this.selectedRoom;

    let infoContent = '';
    if (this.selectedRoom) {
      const room = APP_DATA.rooms.find(r => r.id === this.selectedRoom);
      infoContent = `<strong>${room.name}</strong><small>${this.selectedDate || ''} · ${this.people}${t('peopleUnit')}</small>`;
    } else {
      infoContent = `<strong>${t('pickRoomFirst')}</strong><small>${t('pickRoomHint')}</small>`;
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
            ${hasAll ? t('confirmBookingRoom') : t('goSelect')}
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
        toast(t('roomSelected'));
      });
    });

    // 选择按钮（阻止冒泡）
    root.querySelectorAll('[data-select-room]').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        this.selectedRoom = b.getAttribute('data-select-room');
        this.mount(root);
        toast(t('roomSelected'));
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
      detailHtml += `<div><span style="color:var(--text-3);">${t('roomWord')}</span> <strong>${esc(roomBookings[0].room)}</strong></div>`;
      detailHtml += `<div><span style="color:var(--text-3);">${t('dateWord')}</span> <strong>${esc(this.selectedDate)}</strong></div>`;
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
        <button class="btn btn-primary btn-block" style="margin-top:18px;" onclick="closeModal();navigate('profile');">查看我的预订</button>
      </div>
    `);

    // 重置
    this.selectedDate = null;
    this.selectedRoom = null;
  }
};
