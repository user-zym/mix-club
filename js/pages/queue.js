/* ============================================
   MIX CLUB · Queue Page
   排队取号：实时进度 + 叫号提醒 + 历史记录 + 等待估算
   ============================================ */

const QueuePage = {
  // 表单状态
  form: {
    people: 2,
    type: 'normal',        // normal / vip
    name: '',
    phone: ''
  },

  // 当前生效的取号记录
  ticket: null,
  // 历史取号记录
  history: [],

  // 叫号定时器
  tickTimer: null,
  // 队列剩余人数（本地动态推进）
  remaining: 0,
  // 自身序号
  myNo: 0,

  destroy() {
    this.stopTicker();
  },

  // ---------- 数据持久化 ----------
  loadHistory() {
    const all = LS.get(LS_KEYS.QUEUE, []);
    this.history = Array.isArray(all) ? all : [];
    this.ticket = this.history.find(t => t.status === 'waiting') || null;
    if (this.ticket) {
      this.myNo = this.ticket.no;
      // 剩余 = 当时存储的 remaining；若没有则重算
      this.remaining = typeof this.ticket.remaining === 'number'
        ? this.ticket.remaining
        : Math.max(0, this.ticket.peopleAhead || 0);
    }
  },

  saveAll() {
    LS.set(LS_KEYS.QUEUE, this.history);
  },

  // ---------- 渲染 ----------
  render() {
    return `
      <div class="queue-page">
        ${this.renderHero()}
        ${this.ticket ? this.renderTicket() : this.renderForm()}
        ${this.renderRules()}
        ${this.renderHistory()}
        <div class="page-footer">
          © 2026 MIX CLUB · ${t('titleQueue')}
        </div>
      </div>
    `;
  },

  renderHero() {
    const cfg = APP_DATA.queueConfig;
    const ahead = this.ticket ? this.remaining : cfg.baseWaiting;
    const waitMin = ahead * cfg.avgSeatMin;
    return `
      <div class="queue-hero">
        <div class="queue-hero-bg"></div>
        <div class="queue-hero-content">
          <span class="queue-hero-tag">${t('qLiveTag')}</span>
          <h3>${t('qCurrent')} · <strong>${ahead}</strong> ${t('qAhead')}</h3>
          <p>${t('estWait')} <strong>${this.fmtWaitTime(waitMin)}</strong> · ${cfg.avgSeatMin} ${t('avgPerTable')}</p>
          <div class="queue-hero-bar">
            <div class="queue-hero-bar-fill" style="width:${this.barPct(ahead)}%"></div>
          </div>
          <small>${this.barLabel(ahead)}</small>
        </div>
      </div>
    `;
  },

  renderForm() {
    // 自动从已登录用户填默认值
    if (!this.form.name && User.data && User.data.name) this.form.name = User.data.name;
    if (!this.form.phone && User.data && User.data.phone) this.form.phone = User.data.phone;

    const types = [
      { id: 'normal', icon: '🍸', name: t('qNormal'), desc: t('qDescNormal') },
      { id: 'vip',    icon: '👑', name: t('qVip'), desc: t('qDescVip') }
    ];

    const peopleBtns = [1, 2, 3, 4, 5, 6, 8].map(n => `
      <div class="q-people ${this.form.people === n ? 'active' : ''}" data-people="${n}">${n}${LangService.isEn() ? '' : '人'}</div>
    `).join('');

    const typeCards = types.map(t => `
      <div class="q-type ${this.form.type === t.id ? 'active' : ''}" data-type="${esc(t.id)}">
        <div class="q-type-icon">${esc(t.icon)}</div>
        <div class="q-type-text">
          <strong>${esc(t.name)}</strong>
          <small>${esc(t.desc)}</small>
        </div>
      </div>
    `).join('');

    return `
      <div class="queue-form">
        <div class="q-section">
          <h4>${t('qPeople')}</h4>
          <div class="q-people-grid">${peopleBtns}</div>
        </div>

        <div class="q-section">
          <h4>${t('qChannel')}</h4>
          <div class="q-type-grid">${typeCards}</div>
        </div>

        <div class="q-section">
          <h4>${t('qPhone')} <small style="font-size:11px;color:var(--text-3);font-weight:400;">${t('qNotify')}</small></h4>
          <div class="q-field">
            <label>${t('qName')}</label>
            <input id="qName" type="text" placeholder="请输入您的姓名" value="${esc(this.form.name)}" maxlength="20" />
          </div>
          <div class="q-field">
            <label>${t('phoneLabel')}</label>
            <input id="qPhone" type="tel" inputmode="numeric" placeholder="11 位手机号" value="${esc(this.form.phone)}" maxlength="11" />
          </div>
        </div>

        <button class="btn btn-primary btn-block" id="qSubmit" style="margin-top:8px;">${t('qSubmit')}</button>
        <small style="display:block;text-align:center;color:var(--text-4);margin-top:8px;font-size:11px;">${t('qRulesAgree')}</small>
      </div>
    `;
  },

  renderTicket() {
    const cfg = APP_DATA.queueConfig;
    const waitMin = this.remaining * cfg.avgSeatMin;
    const pct = this.barPct(this.remaining);
    return `
      <div class="queue-ticket">
        <div class="qt-head">
          <div class="qt-no">
            <span>${t('qYourNo')}</span>
            <strong>A${String(this.myNo).padStart(3, '0')}</strong>
          </div>
          <div class="qt-pulse"><span></span><span></span><span></span></div>
        </div>

        <div class="qt-info">
          <div class="qt-info-item">
            <small>${t('qQueueType')}</small>
            <strong>${this.ticket.type === 'vip' ? t('qVip') : t('qNormal')}</strong>
          </div>
          <div class="qt-info-item">
            <small>${t('qtPeople')}</small>
            <strong>${this.ticket.people}${t('peopleUnit')}</strong>
          </div>
          <div class="qt-info-item">
            <small>${t('qtAhead')}</small>
            <strong class="qt-ahead">${this.remaining}${LangService.isEn() ? '' : ' 位'}</strong>
          </div>
          <div class="qt-info-item">
            <small>${t('qtWait')}</small>
            <strong>${this.fmtWaitTime(waitMin)}</strong>
          </div>
        </div>

        <div class="qt-progress">
          <div class="qt-progress-bar">
            <div class="qt-progress-fill" style="width:${pct}%"></div>
          </div>
          <small>${this.barLabel(this.remaining)}</small>
        </div>

        <div class="qt-contact">
          <span>📞 ${esc(this.ticket.phone)}</span>
          <span>·</span>
          <span>${esc(this.ticket.name)}</span>
        </div>

        <div class="qt-actions">
          <button class="btn btn-ghost" id="qRefresh">${t('qRefresh')}</button>
          <button class="btn btn-primary" id="qCancel">${t('qCancel')}</button>
        </div>

        <div class="qt-tip">
          ${t('qRemind')}
        </div>
      </div>
    `;
  },

  renderRules() {
    const rs = APP_DATA.queueConfig.rulesEn || [];
    const items = APP_DATA.queueConfig.rules.map((r, i) => `
      <li><span class="qt-rule-idx">${i + 1}</span>${esc(LangService.isEn() ? (rs[i] || r) : r)}</li>
    `).join('');
    return `
      <div class="q-section q-rules">
        <h4>${t('qRules')}</h4>
        <ol class="q-rules-list">${items}</ol>
      </div>
    `;
  },

  renderHistory() {
    const past = this.history.filter(t => t.status !== 'waiting').slice(0, 5);
    if (!past.length) {
      return `
        <div class="q-section q-history">
          <h4>${t('qHistory')}</h4>
          <div class="q-empty">${t('qEmpty')}</div>
        </div>
      `;
    }
    const rows = past.map(h => `
      <div class="q-history-item">
        <div>
          <strong>A${String(h.no).padStart(3, '0')}</strong>
          <small>${h.people}${t('peopleUnit')} · ${h.type === 'vip' ? 'VIP' : t('qHistoryNormal')} · ${esc(h.name)}</small>
        </div>
        <div class="q-history-right">
          <span class="q-status ${h.status}">${
            h.status === 'done' ? '已入座' :
            h.status === 'skip' ? '已过号' : '已取消'
          }</span>
          <small>${fmtDate(h.created)}</small>
        </div>
      </div>
    `).join('');
    return `
      <div class="q-section q-history">
        <h4>${t('qHistory')}</h4>
        <div class="q-history-list">${rows}</div>
      </div>
    `;
  },

  // ---------- 工具 ----------
  fmtWaitTime(min) {
    if (min <= 0) return t('qSoon');
    if (min < 60) return `${min}${LangService.isEn() ? ' min' : ' 分钟'}`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return LangService.isEn() ? (m === 0 ? `${h}h` : `${h}h ${m}m`) : (m === 0 ? `${h} 小时` : `${h} 小时 ${m} 分钟`);
  },

  barPct(remaining) {
    // 剩余 0 → 100%, 剩余 60+ → 5%
    const max = 60;
    const r = Math.max(0, Math.min(max, remaining));
    return Math.max(8, Math.round((1 - r / max) * 100));
  },

  barLabel(remaining) {
    if (remaining === 0) return '就绪 · 即将为您安排座位';
    if (remaining <= 5) return t('qSoon2');
    if (remaining <= 15) return '即将到来，建议就近等候';
    return t('qHigh');
  },

  nextNo() {
    // 基于历史最大号 + baseWaiting 生成一个稳定序号
    const max = this.history.reduce((m, t) => Math.max(m, t.no || 0), 0);
    const base = Math.max(101, max + 1);
    // 加上当前时间微扰，避免多人同时取号撞号
    return base + Math.floor(Math.random() * 9);
  },

  // ---------- 挂载 ----------
  mount(root) {
    this.loadHistory();
    root.innerHTML = this.render();
    this.bindEvents(root);
    if (this.ticket) this.startTicker(root);
  },

  bindEvents(root) {
    const self = this;

    // 人数选择
    root.querySelectorAll('[data-people]').forEach(el => {
      el.addEventListener('click', () => {
        self.form.people = parseInt(el.getAttribute('data-people'), 10) || 2;
        root.querySelectorAll('[data-people]').forEach(x => x.classList.toggle('active', x === el));
      });
    });

    // 通道选择
    root.querySelectorAll('[data-type]').forEach(el => {
      el.addEventListener('click', () => {
        self.form.type = el.getAttribute('data-type');
        root.querySelectorAll('[data-type]').forEach(x => x.classList.toggle('active', x === el));
      });
    });

    // 输入框同步到 form
    const nameEl = root.querySelector('#qName');
    const phoneEl = root.querySelector('#qPhone');
    if (nameEl) nameEl.addEventListener('input', e => { self.form.name = e.target.value.trim(); });
    if (phoneEl) phoneEl.addEventListener('input', e => { self.form.phone = e.target.value.replace(/\D/g, ''); });

    // 提交取号
    const submit = root.querySelector('#qSubmit');
    if (submit) submit.addEventListener('click', () => self.submitTicket(root));

    // 取消
    const cancel = root.querySelector('#qCancel');
    if (cancel) cancel.addEventListener('click', () => self.cancelTicket(root));

    // 刷新进度
    const refresh = root.querySelector('#qRefresh');
    if (refresh) refresh.addEventListener('click', () => {
      // 刷新相当于手动触发一次 tick
      self.advanceQueue(root);
      toast(t('qFreshOk'));
    });
  },

  submitTicket(root) {
    const name = this.form.name.trim();
    const phone = this.form.phone.trim();
    if (!name) return toast('请输入您的姓名');
    if (!/^1[3-9]\d{9}$/.test(phone)) return toast('请输入正确的 11 位手机号');

    const no = this.nextNo();
    const cfg = APP_DATA.queueConfig;
    const remaining = cfg.baseWaiting + Math.floor(Math.random() * 6);

    const ticket = {
      id: 'Q' + Date.now(),
      no,
      name,
      phone,
      people: this.form.people,
      type: this.form.type,
      remaining,
      peopleAhead: remaining,
      status: 'waiting',
      created: Date.now()
    };
    this.history.unshift(ticket);
    this.saveAll();
    this.ticket = ticket;
    this.myNo = no;
    this.remaining = remaining;
    this.form = { people: 2, type: 'normal', name: '', phone: '' };

    toast(t('qSuccess') + ' · A' + String(no).padStart(3, '0'));
    root.innerHTML = this.render();
    this.bindEvents(root);
    this.startTicker(root);
  },

  cancelTicket(root) {
    if (!this.ticket) return;
    openModal(`
      <h3 style="margin:0 0 10px;">${t('qCancelConfirm')}</h3>
      <p style="margin:0 0 16px;color:var(--text-3);font-size:13px;">序号 <strong>A${String(this.ticket.no).padStart(3, '0')}</strong> 取消后将无法恢复。</p>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-ghost" style="flex:1;" onclick="closeModal()">再等等</button>
        <button class="btn btn-primary" style="flex:1;" id="qConfirmCancel">确认取消</button>
      </div>
    `);
    const btn = document.getElementById('qConfirmCancel');
    if (btn) btn.addEventListener('click', () => {
      this.ticket.status = 'cancel';
      this.saveAll();
      this.ticket = null;
      this.remaining = 0;
      this.stopTicker();
      closeModal();
      const r = document.querySelector('[data-page="queue"]');
      if (r) { r.innerHTML = this.render(); this.bindEvents(r); }
      toast(t('qCancelDone'));
    });
  },

  // ---------- 叫号推进 ----------
  startTicker(root) {
    this.stopTicker();
    const cfg = APP_DATA.queueConfig;
    this.tickTimer = setInterval(() => {
      // 当剩余 > 0 时，每 tick 推进 1 位
      if (this.remaining > 0) {
        this.remaining -= 1;
        if (this.ticket) {
          this.ticket.remaining = this.remaining;
          this.ticket.peopleAhead = this.remaining;
        }
        // 到号提醒：即将叫号
        this.notifyNear();
        // 重新渲染票面
        const r = document.querySelector('[data-page="queue"]');
        if (r) {
          const ticketEl = r.querySelector('.queue-ticket');
          if (ticketEl) {
            ticketEl.outerHTML = this.renderTicket();
            // 重新绑定按钮（因为 outerHTML 替换会丢失事件）
            this.bindTicketEvents(r);
          }
        }
        if (this.remaining === 0) {
          this.completeTicket();
        }
      }
    }, cfg.tickSec * 1000);
  },

  // 到号提醒
  notifyNear() {
    if (this.remaining === 2) toast('🔔 即将叫到您 · 前面还有 2 位，请留意');
    if (this.remaining === 1) toast('🔔 下一位就是您 · 请到前台附近等候');
  },

  bindTicketEvents(root) {
    const cancel = root.querySelector('#qCancel');
    const refresh = root.querySelector('#qRefresh');
    if (cancel) cancel.addEventListener('click', () => this.cancelTicket(root));
    if (refresh) refresh.addEventListener('click', () => {
      this.advanceQueue(root);
      toast(t('qFreshOk'));
    });
  },

  advanceQueue(root) {
    // 手动刷新：再减少 1 位
    if (this.remaining > 0) {
      this.remaining -= 1;
      if (this.ticket) {
        this.ticket.remaining = this.remaining;
        this.ticket.peopleAhead = this.remaining;
      }
      this.saveAll();
      this.notifyNear();
      const ticketEl = root.querySelector('.queue-ticket');
      if (ticketEl) {
        ticketEl.outerHTML = this.renderTicket();
        this.bindTicketEvents(root);
      }
      if (this.remaining === 0) this.completeTicket();
    }
  },

  completeTicket() {
    this.stopTicker();
    if (this.ticket) {
      this.ticket.status = 'done';
      this.saveAll();
    }
    openModal(`
      <div style="text-align:center;">
        <div style="font-size:50px;margin-bottom:10px;">🎉</div>
        <h3 style="margin:0 0 6px;">到您啦！</h3>
        <p style="margin:0 0 18px;color:var(--text-3);font-size:12px;">${t('qYourNo')} A${String(this.myNo).padStart(3, '0')} · ${t('qArriveNote')}</p>
        <div style="background:var(--bg-3);padding:14px;border-radius:12px;text-align:left;font-size:13px;line-height:1.9;">
          <div><span style="color:var(--text-3);">排队类型</span> <strong>${this.ticket?.type === 'vip' ? 'VIP 通道' : '普通排队'}</strong></div>
          <div><span style="color:var(--text-3);">人数</span> <strong>${this.ticket?.people || 0} 人</strong></div>
          <div><span style="color:var(--text-3);">联系电话</span> <strong>${esc(this.ticket?.phone || '')}</strong></div>
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:18px;" onclick="closeModal()">我知道了</button>
      </div>
    `);
    this.ticket = null;
  },

  stopTicker() {
    if (this.tickTimer) clearInterval(this.tickTimer);
    this.tickTimer = null;
  }
};