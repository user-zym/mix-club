/* ============================================
   MIX CLUB · Events Page
   派对活动列表 + 倒计时 + 购票
   ============================================ */

const EventsPage = {
  curCat: 'all',
  timers: [],

  destroy() {
    this.timers.forEach(t => clearInterval(t));
    this.timers = [];
  },

  render() {
    const tabs = APP_DATA.eventTypes.map(ev =>
      `<button class="event-tab ${ev.id === this.curCat ? 'active' : ''}" data-cat="${esc(ev.id)}">${esc(ev.id === 'all' ? t('allEvents') : L(ev.name, ev.nameEn))}</button>`
    ).join('');

    const list = APP_DATA.events.filter(e => this.curCat === 'all' || e.cat === this.curCat);

    const cards = list.map(e => `
      <div class="event-big fade-in">
        <div class="event-big-img" style="background-image:url('${esc(e.img)}')"></div>
        <div class="event-big-info">
          <h3>${esc(L(e.title, e.titleEn))}</h3>
          <div class="meta">
            <span>📅 ${esc(e.date === '定制' ? L(e.date, 'Custom') : e.date)} ${esc(L(e.weekday, ({周日:'Sun',周一:'Mon',周二:'Tue',周三:'Wed',周四:'Thu',周五:'Fri',周六:'Sat',预约:'Custom'})[e.weekday]))}</span>
            <span>⏰ ${esc(e.time === '自定义' ? L(e.time, 'Custom') : e.time)}</span>
            <span>📍 ${esc(L(e.place, e.placeEn))}</span>
          </div>
          <p>${esc(L(e.desc, e.descEn))}</p>
          ${e.countdown ? this.renderCountdown(e) : '<div style="font-size:11px;color:var(--purple-2);">' + t('customTip') + '</div>'}
          <div style="display:flex;gap:6px;margin-bottom:10px;">
            ${(LangService.isEn() ? e.tagsEn : e.tags).map(tag => `<span class="chip pink">${esc(tag)}</span>`).join('')}
          </div>
          <div class="row">
            <div>
              <div class="price"><span class="sym">¥</span>${e.price}</div>
              ${e.original ? `<small style="text-decoration:line-through;color:var(--text-3);">¥${e.original}</small>` : ''}
              <small style="color:var(--text-3);display:block;font-size:10px;margin-top:2px;">${t('soldText')} ${e.booked} / ${e.capacity}</small>
            </div>
            <button class="btn btn-primary" data-buy="${esc(e.id)}">${t('buyNow')}</button>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <!-- Hero -->
      <div class="events-hero">
        <div class="big-title">PARTY</div>
        <div class="sub">MIX CLUB · ${t('evEyebrow')}</div>
      </div>

      <!-- Tabs -->
      <div class="event-tabs">${tabs}</div>

      <!-- List -->
      <div class="event-list">
        ${cards}
      </div>

      <div class="page-footer">
        © 2026 MIX CLUB · ${LangService.isEn() ? 'Never-Stop Party' : '派对永不眠'}
      </div>
    `;
  },

  renderCountdown(e) {
    // 目标时间由 data.js 动态生成的时间戳提供（e.ts），
    // 不再用字符串拼日期（'07-19T22:00:00' 会被解析为 Invalid Date）
    const target = (e && typeof e.ts === 'number') ? e.ts : (Date.now() + 7 * 86400000);
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `
      <div class="countdown" data-target="${target}" data-eid="${esc(e.id)}">
        <div class="cd"><b>${d}</b><span>${t('cdDay')}</span></div>
        <div class="cd"><b>${h}</b><span>${t('cdHour')}</span></div>
        <div class="cd"><b>${m}</b><span>${t('cdMin')}</span></div>
      </div>
    `;
  },

  mount(root) {
    root.innerHTML = this.render();
    this.bindEvents(root);
    this.startCountdowns();
  },

  bindEvents(root) {
    // Tabs
    root.querySelectorAll('[data-cat]').forEach(t => {
      t.addEventListener('click', () => {
        this.curCat = t.getAttribute('data-cat');
        this.mount(root);
      });
    });

    // Buy
    root.querySelectorAll('[data-buy]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-buy');
        const e = APP_DATA.events.find(x => x.id === id);
        if (e) this.buyTicket(e);
      });
    });
  },

  startCountdowns() {
    // Clear existing
    this.timers.forEach(t => clearInterval(t));
    this.timers = [];
    const t = setInterval(() => {
      document.querySelectorAll('.countdown').forEach(cd => {
        const target = parseInt(cd.getAttribute('data-target'));
        const diff = Math.max(0, target - Date.now());
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const bs = cd.querySelectorAll('b');
        if (bs.length >= 3) {
          bs[0].textContent = d;
          bs[1].textContent = pad(h);
          bs[2].textContent = pad(m);
        }
      });
    }, 1000);
    this.timers.push(t);
  },

  buyTicket(e) {
    openModal(`
      <h3 style="margin:0 0 4px;font-size:18px;">${esc(e.title)}</h3>
      <div style="color:var(--text-3);font-size:12px;margin-bottom:14px;">${esc(e.date)} ${esc(e.weekday)} · ${esc(e.time)}</div>

      <div style="background:var(--bg-3);padding:14px;border-radius:12px;margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
          <span style="color:var(--text-3);">票价</span><strong style="color:var(--gold-2);">¥${e.price}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
          <span style="color:var(--text-3);">VIP会员折扣</span><strong style="color:var(--green);">-¥${(e.price*0.1).toFixed(0)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;">
          <span style="color:var(--text-3);">数量</span>
          <div style="display:flex;align-items:center;gap:10px;">
            <button id="qtM" style="width:24px;height:24px;border-radius:50%;background:var(--bg-1);">-</button>
            <b id="qtNum" style="min-width:24px;text-align:center;">1</b>
            <button id="qtP" style="width:24px;height:24px;border-radius:50%;background:var(--bg-1);">+</button>
          </div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding:0 4px;">
        <span style="color:var(--text-3);font-size:13px;">合计</span>
        <span style="color:var(--gold-2);font-size:22px;font-weight:800;" id="qtTotal">¥${(e.price*0.9).toFixed(0)}</span>
      </div>

      <button class="btn btn-primary btn-block btn-lg" id="qtConfirm">立即支付</button>
    `);

    let qty = 1;
    const total = (e.price * 0.9);
    document.getElementById('qtM').onclick = () => {
      qty = Math.max(1, qty - 1);
      document.getElementById('qtNum').textContent = qty;
      document.getElementById('qtTotal').textContent = '¥' + (qty * total).toFixed(0);
    };
    document.getElementById('qtP').onclick = () => {
      qty = Math.min(8, qty + 1);
      document.getElementById('qtNum').textContent = qty;
      document.getElementById('qtTotal').textContent = '¥' + (qty * total).toFixed(0);
    };
    document.getElementById('qtConfirm').onclick = () => {
      const eventId = (e && e.id) || ('TKT' + Date.now().toString().slice(-8));
      closeModal();
      setTimeout(() => {
        const qrSvg = typeof generateQRCodeSVG === 'function'
          ? generateQRCodeSVG(eventId, 140)
          : '<div style="width:140px;height:140px;background:#000;"></div>';
        openModal(`
          <div style="text-align:center;">
            <div style="font-size:50px;margin-bottom:10px;">✅</div>
            <h3 style="margin:0 0 6px;">购票成功</h3>
            <p style="margin:0 0 14px;color:var(--text-3);font-size:12px;">凭二维码到店核销</p>
            <div style="background:#fff;color:#000;padding:12px;border-radius:12px;display:inline-block;margin-bottom:14px;">
              ${qrSvg}
            </div>
            <p style="margin:0 0 14px;color:var(--text-3);font-size:12px;">票号 ${esc(eventId)}</p>
            <button class="btn btn-primary btn-block" onclick="closeModal()">完成</button>
          </div>
        `);
      }, 200);
    };
  }
};
