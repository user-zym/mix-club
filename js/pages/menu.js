/* ============================================
   MIX CLUB · Menu Page
   18 点餐配图 + 分类 + 购物车
   ============================================ */

const MenuPage = {
  curCat: 'all',
  keyword: '',

  render() {
    const tabs = APP_DATA.menuCategories.map(c =>
      `<button class="menu-tab ${c.id === this.curCat ? 'active' : ''}" data-cat="${esc(c.id)}">${esc(c.id === 'all' ? (LangService.isEn() ? 'All' : c.name) : c.name)}</button>`
    ).join('');

    const list = this.filterList();

    const items = list.map(p => `
      <div class="menu-item" data-id="${esc(p.id)}">
        <div class="menu-img" style="background-image:url('${esc(p.img)}')">
          ${p.hot ? '<span class="badge-hot">HOT</span>' : ''}
        </div>
        <div class="menu-content">
          <div>
            <h3 class="menu-name">${esc(p.name)}</h3>
            <p class="menu-desc">${esc(p.desc)}</p>
            <div class="menu-tags">
              ${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}
            </div>
          </div>
          <div class="menu-row">
            <div>
              <div class="menu-price"><span class="sym">¥</span>${p.price}${p.original ? `<span class="line">¥${p.original}</span>` : ''}</div>
              <div class="menu-sales">${t('soldText')} ${fmtNum(p.sales)}</div>
            </div>
            <button class="add-btn" data-add="${esc(p.id)}">+</button>
          </div>
        </div>
      </div>
    `).join('');

    const tb = TableService.current();
    return `
      ${tb ? `
      <div class="menu-table-bar">
        <span class="mtb-info">🪑 ${t('curTableTxt')}<b>${esc(tb.no)}</b> · ${tb.type === 'ka' ? t('seatKa') : t('seatSan')}</span>
        <button class="mtb-switch" id="menuTableSwitch">${t('switchBtn')}</button>
      </div>` : ''}

      <!-- Search -->
      <div class="menu-search">
        <div class="box">
          <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="7" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="rgba(255,255,255,.4)" stroke-width="2" stroke-linecap="round"/></svg>
          <input type="text" placeholder="${t('searchPlaceholder')}" id="menuSearch" value="${esc(this.keyword)}" />
        </div>
      </div>

      <!-- AI 调酒师 · 沉浸式入口 -->
      <div class="ai-hero" id="aiBtn">
        <div class="ai-hero-bg"></div>
        <div class="ai-hero-content">
          <div class="ai-hero-top">
            <div class="ai-hero-ico">
              <span class="ai-orb"></span>
              <span class="ai-orb-dot"></span>
            </div>
            <div class="ai-hero-text">
              <strong>${t('aiTitle')} <i>Allan</i></strong>
              <small>${t('aiSub')}</small>
            </div>
            <span class="ai-hero-go">${t('aiGo')}</span>
          </div>
          <div class="ai-presets" id="aiPresets">
            ${AiService.PRESETS.map(p => `
              <button class="ai-preset" data-preset="${esc(p.id)}">
                <span class="ai-preset-em">${esc(p.emoji)}</span>
                <span class="ai-preset-name">${esc(p.name)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="menu-tabs-wrap">
        <div class="menu-tabs">
          ${tabs}
        </div>
      </div>

      <!-- List -->
      <div class="menu-list">
        ${items || `<div class="empty-state" style="padding:44px 32px;">
          <div class="es-ico">🍸</div>
          <h3>${t('menuEmpty')}</h3>
          <p>${t('menuEmptyDesc')}</p>
        </div>`}
      </div>

      <div class="page-footer">
        © 2026 MIX CLUB · ${t('footerMenu')}
        <div class="legal-line">${t('legalDrink')}</div>
      </div>
    `;
  },

  filterList() {
    return APP_DATA.products.filter(p => {
      const catOk = this.curCat === 'all' || p.cat === this.curCat;
      const kwOk = !this.keyword ||
        p.name.includes(this.keyword) ||
        p.desc.includes(this.keyword);
      return catOk && kwOk;
    });
  },

  mount(root, opts) {
    // 深链定位：从首页招牌特调点击进入时，自动切到对应分类并高亮商品
    this.focusId = null;
    if (opts && opts.product) {
      const p = APP_DATA.products.find(x => x.id === opts.product);
      if (p) {
        this.curCat = p.cat;
        this.focusId = p.id;
      }
    }
    root.innerHTML = this.render();
    this.bindEvents(root);
    if (this.focusId) {
      this.highlightFocus(root);
      this.focusId = null;
    }
  },

  highlightFocus(root) {
    const el = root.querySelector('[data-id="' + this.focusId + '"]');
    if (!el) return;
    // 等 app.js 完成页面滚动复位后再定位
    setTimeout(() => {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      el.classList.add('flash-focus');
    }, 80);
    setTimeout(() => el.classList.remove('flash-focus'), 2200);
  },

  // 更换桌台（与首页扫码点单共用 TableService，桌台号 K01-K06 / S01-S12）
  switchTable(root) {
    const tb = TableService.current();
    openModal(`
      <h3 style="margin:0 0 6px;font-size:17px;">🪑 ${t('changeTable')}</h3>
      <p style="margin:0 0 12px;color:var(--text-3);font-size:11px;">选择桌台号（K01-K06 · S01-S12）· 扫码绑定桌台</p>
      <input id="menuTableNo" type="text" placeholder="${tb ? t('curTableTxt') + esc(tb.no) : t('tablePlaceholder')}" autocomplete="off"
        style="width:100%;background:var(--bg-3);border:1px solid var(--line);border-radius:8px;color:var(--text-1);padding:11px 12px;font-size:14px;outline:none;box-sizing:border-box;">
      <div class="ai-chips" style="margin:10px 0;">
        ${APP_TABLES.map(t => `<button class="ai-chip" data-mtb="${t.id}">${t.id}</button>`).join('')}
      </div>
      <button class="btn btn-primary btn-block" id="menuBindTable">绑定桌台</button>
      ${tb ? `<button class="btn btn-ghost btn-block" id="menuClearTable" style="margin-top:8px;">${t('unbindTable')}</button>` : ''}
    `);
    document.querySelectorAll('[data-mtb]').forEach(c => {
      c.addEventListener('click', () => {
        const inp = document.getElementById('menuTableNo');
        if (inp) inp.value = c.getAttribute('data-mtb');
      });
    });
    const bind = document.getElementById('menuBindTable');
    if (bind) bind.addEventListener('click', () => {
      const inp = document.getElementById('menuTableNo');
      const no = inp ? inp.value.trim() : '';
      if (!no) { toast('请输入桌台号'); return; }
      const res = TableService.bind(no);
      if (!res.ok) { toast(res.msg, 'error'); return; }
      closeModal();
      toast('已绑定桌台 ' + res.t.no + ' · 下单自动关联');
      this.mount(root);
    });
    const clear = document.getElementById('menuClearTable');
    if (clear) clear.addEventListener('click', () => {
      TableService.clear();
      closeModal();
      toast('已解绑桌台');
      this.mount(root);
    });
  },

  bindEvents(root) {
    // 桌台 badge：更换桌台
    const mts = root.querySelector('#menuTableSwitch');
    if (mts) mts.addEventListener('click', () => this.switchTable(root));

    // Tabs
    root.querySelectorAll('[data-cat]').forEach(t => {
      t.addEventListener('click', () => {
        this.curCat = t.getAttribute('data-cat');
        this.mount(root);
      });
    });

    // Add to cart
    root.querySelectorAll('[data-add]').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        const id = b.getAttribute('data-add');
        const p = APP_DATA.products.find(x => x.id === id);
        if (p) {
          Cart.add(p);
          // 微动画
          b.style.transform = 'scale(1.4) rotate(90deg)';
          setTimeout(() => { b.style.transform = ''; }, 300);
        }
      });
    });

    // Search (debounced)
    const search = root.querySelector('#menuSearch');
    if (search) {
      const handler = debounce(() => {
        this.keyword = search.value.trim();
        this.mount(root);
      }, 250);
      search.addEventListener('input', handler);
    }

    // AI 调酒师 · 入口卡片
    const aiBtn = root.querySelector('#aiBtn');
    if (aiBtn) aiBtn.addEventListener('click', () => this.showAiPrefs());

    // AI 调酒师 · 一键预设（点击预设不打开 step，而是直接出结果）
    root.querySelectorAll('#aiPresets .ai-preset').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        this.applyPreset(b.getAttribute('data-preset'));
      });
    });

    // Tap to view detail
    root.querySelectorAll('[data-id]').forEach(it => {
      it.addEventListener('click', () => {
        const id = it.getAttribute('data-id');
        const p = APP_DATA.products.find(x => x.id === id);
        if (p) this.showDetail(p);
      });
    });
  },

  // ---------- AI 调酒师 ----------
  // 入口：顶部 AI 卡片被点击时打开模态
  showAiPrefs() {
    const prev = AiService.prefs() || {};
    this._aiState = {
      step: 1, // 1 口味 / 2 场景+强度 / 3 时段+价格
      tastes: prev.tastes || ['果味'],
      sceneId: prev.sceneId || 'date',
      strengthId: prev.strengthId || 'mid',
      priceId: prev.priceId || 'p2',
      hourId: prev.hourId || AiService.currentHour()
    };
    openModal(this._renderAiStep(), { wide: true });
    this._bindAiStep();
  },

  // 一键预设
  applyPreset(presetId) {
    const preset = AiService.PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    this._aiState = {
      step: 3,
      tastes: preset.tastes.slice(),
      sceneId: preset.scene,
      strengthId: preset.strength,
      priceId: 'p2',
      hourId: AiService.currentHour()
    };
    const res = AiService.recommend({
      tastes: this._aiState.tastes,
      sceneId: this._aiState.sceneId,
      strengthId: this._aiState.strengthId,
      priceId: this._aiState.priceId,
      hourId: this._aiState.hourId
    });
    AiService.savePrefs(this._aiState);
    openModal(this._renderAiResult(res, preset), { wide: true });
    this._bindAiResult();
  },

  _renderAiStep() {
    const s = this._aiState;
    const liveCount = AiService.recommend(s).total;

    const stepHead = `
      <div class="ai-steps">
        ${['口味', '场景', '时段'].map((label, i) => `
          <div class="ai-step ${s.step === i + 1 ? 'on' : ''} ${s.step > i + 1 ? 'done' : ''}">
            <span class="ai-step-dot">${s.step > i + 1 ? '✓' : i + 1}</span>
            <small>${esc(label)}</small>
          </div>
        `).join('<span class="ai-step-line"></span>')}
      </div>
    `;

    let body = '';
    if (s.step === 1) {
      body = `
        <div class="ai-step-title">选 1-3 个口味偏好 <span class="ai-step-hint">已选 ${s.tastes.length} / 3</span></div>
        <div class="ai-chips" id="aiTastes">
          ${AiService.TASTES.map(t => `
            <button class="ai-chip ${s.tastes.indexOf(t) >= 0 ? 'on' : ''}" data-taste="${esc(t)}">${esc(t)}</button>
          `).join('')}
        </div>
      `;
    } else if (s.step === 2) {
      body = `
        <div class="ai-step-title">今晚的场景</div>
        <div class="ai-chips" id="aiScene">
          ${AiService.SCENES.map(sc => `
            <button class="ai-chip ${s.sceneId === sc.id ? 'on' : ''}" data-scene="${esc(sc.id)}">${esc(sc.emoji)} ${esc(sc.name)}</button>
          `).join('')}
        </div>
        <div class="ai-step-title" style="margin-top:18px;">酒精度偏好</div>
        <div class="ai-chips" id="aiStrength">
          ${AiService.STRENGTHS.map(st => `
            <button class="ai-chip ${s.strengthId === st.id ? 'on' : ''}" data-strength="${esc(st.id)}">${esc(st.emoji)} ${esc(st.name)}<small>${esc(st.desc)}</small></button>
          `).join('')}
        </div>
      `;
    } else {
      body = `
        <div class="ai-step-title">价格区间</div>
        <div class="ai-chips" id="aiPrice">
          ${AiService.PRICES.map(p => `
            <button class="ai-chip ${s.priceId === p.id ? 'on' : ''}" data-price="${esc(p.id)}">${esc(p.name)}</button>
          `).join('')}
        </div>
        <div class="ai-step-title" style="margin-top:18px;">现在的时段 <span class="ai-step-hint">智能默认 · 可手动调整</span></div>
        <div class="ai-chips" id="aiHour">
          ${AiService.HOURS.map(h => `
            <button class="ai-chip ${s.hourId === h.id ? 'on' : ''}" data-hour="${esc(h.id)}">${esc(h.name)}</button>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="ai-modal">
        <div class="ai-modal-head">
          <div class="ai-modal-ico">🤖</div>
          <div>
            <h3>AI 调酒师 <i>Allan</i></h3>
            <small>当前已匹配 <b>${liveCount}</b> 款酒</small>
          </div>
          <button class="ai-modal-close" onclick="closeModal()">×</button>
        </div>
        ${stepHead}
        <div class="ai-step-body">${body}</div>
        <div class="ai-modal-foot">
          ${s.step > 1 ? '<button class="btn btn-ghost" id="aiBack">← 上一步</button>' : '<span></span>'}
          ${s.step < 3
            ? '<button class="btn btn-primary" id="aiNext">下一步 →</button>'
            : '<button class="btn btn-primary" id="aiGo"><span>看看推荐</span> ✨</button>'}
        </div>
      </div>
    `;
  },

  _bindAiStep() {
    const s = this._aiState;

    // 口味
    document.querySelectorAll('#aiTastes .ai-chip').forEach(c => {
      c.addEventListener('click', () => {
        const t = c.getAttribute('data-taste');
        const i = s.tastes.indexOf(t);
        if (i >= 0) { s.tastes.splice(i, 1); c.classList.remove('on'); }
        else if (s.tastes.length < 3) { s.tastes.push(t); c.classList.add('on'); }
        else { toast('最多 3 个口味'); return; }
        // 实时刷新底部匹配数
        const n = AiService.recommend(s).total;
        const hint = document.querySelector('.ai-modal-head small b');
        if (hint) hint.textContent = n;
      });
    });

    // 场景
    document.querySelectorAll('#aiScene .ai-chip').forEach(c => {
      c.addEventListener('click', () => {
        s.sceneId = c.getAttribute('data-scene');
        document.querySelectorAll('#aiScene .ai-chip').forEach(x => x.classList.remove('on'));
        c.classList.add('on');
      });
    });

    // 强度
    document.querySelectorAll('#aiStrength .ai-chip').forEach(c => {
      c.addEventListener('click', () => {
        s.strengthId = c.getAttribute('data-strength');
        document.querySelectorAll('#aiStrength .ai-chip').forEach(x => x.classList.remove('on'));
        c.classList.add('on');
      });
    });

    // 价格
    document.querySelectorAll('#aiPrice .ai-chip').forEach(c => {
      c.addEventListener('click', () => {
        s.priceId = c.getAttribute('data-price');
        document.querySelectorAll('#aiPrice .ai-chip').forEach(x => x.classList.remove('on'));
        c.classList.add('on');
      });
    });

    // 时段
    document.querySelectorAll('#aiHour .ai-chip').forEach(c => {
      c.addEventListener('click', () => {
        s.hourId = c.getAttribute('data-hour');
        document.querySelectorAll('#aiHour .ai-chip').forEach(x => x.classList.remove('on'));
        c.classList.add('on');
      });
    });

    // 下一步 / 提交
    const next = document.getElementById('aiNext');
    if (next) next.addEventListener('click', () => {
      if (s.step === 1 && !s.tastes.length) { toast('请至少选 1 个口味'); return; }
      s.step++;
      openModal(this._renderAiStep(), { wide: true });
      this._bindAiStep();
    });
    const back = document.getElementById('aiBack');
    if (back) back.addEventListener('click', () => {
      s.step--;
      openModal(this._renderAiStep(), { wide: true });
      this._bindAiStep();
    });
    const go = document.getElementById('aiGo');
    if (go) go.addEventListener('click', () => {
      const res = AiService.recommend({
        tastes: s.tastes,
        sceneId: s.sceneId,
        strengthId: s.strengthId,
        priceId: s.priceId,
        hourId: s.hourId
      });
      AiService.savePrefs(s);
      openModal(this._renderAiResult(res), { wide: true });
      this._bindAiResult();
    });
  },

  _renderAiResult(res, preset) {
    const cards = res.results.map((r, i) => {
      const reasonChips = r.reasons.slice(0, 4).map(rc =>
        `<span class="ai-r-chip ${esc(rc.kind)}">${esc(rc.label)}<b>+${rc.weight}</b></span>`
      ).join('');
      return `
        <div class="ai-r-card" data-id="${esc(r.product.id)}">
          <div class="ai-r-rank">${i + 1}</div>
          <div class="ai-r-img" style="background-image:url('${esc(r.product.img)}')"></div>
          <div class="ai-r-body">
            <div class="ai-r-head">
              <h4>${esc(r.product.name)}</h4>
              <span class="ai-r-score">${r.score}<small>分</small></span>
            </div>
            <p class="ai-r-desc">${esc(r.product.desc)}</p>
            <div class="ai-r-reasons">${reasonChips}</div>
            <div class="ai-r-foot">
              <div class="ai-r-price">
                <span class="sym">¥</span><b>${r.product.price}</b>
                ${r.product.original ? `<span class="ai-r-orig">¥${r.product.original}</span>` : ''}
              </div>
              <div class="ai-r-btns">
                <button class="ai-r-detail" data-detail="${esc(r.product.id)}">详情</button>
                <button class="btn btn-primary ai-r-add" data-add="${esc(r.product.id)}">+ 加购</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const filterParts = [];
    if (res.scene)   filterParts.push(res.scene.name);
    if (res.strength) filterParts.push(res.strength.name);
    if (res.price)    filterParts.push(res.price.name);
    const filterText = filterParts.length ? filterParts.join(' · ') : '不限';

    return `
      <div class="ai-modal">
        <div class="ai-modal-head">
          <div class="ai-modal-ico">✨</div>
          <div>
            <h3>${preset ? esc(preset.emoji) + ' ' + esc(preset.name) + ' · 推荐' : '为你精选 ' + res.results.length + ' 款'}</h3>
            <small>口味「${esc(res.tastes.join('·'))}」 · ${esc(filterText)}</small>
          </div>
          <button class="ai-modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="ai-r-summary">
          <div><b>${res.total}</b><small>共匹配</small></div>
          <div><b>${res.results.length}</b><small>为你呈现</small></div>
          <div><b>${res.tastes.length}</b><small>口味维度</small></div>
          <div><b>${res.scene ? esc(res.scene.name) : '—'}</b><small>主场景</small></div>
        </div>
        <div class="ai-r-list">
          ${cards || '<div class="ai-r-empty">没有匹配的酒，试试放宽偏好条件</div>'}
        </div>
        <div class="ai-modal-foot">
          <button class="btn btn-ghost" id="aiAgain">重新筛选</button>
          <button class="btn btn-primary" id="aiAddAll">一键加购 ${res.results.length} 款</button>
        </div>
      </div>
    `;
  },

  _bindAiResult() {
    // 加购单条
    document.querySelectorAll('.ai-r-add').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        const id = b.getAttribute('data-add');
        const p = APP_DATA.products.find(x => x.id === id);
        if (!p) return;
        Cart.add(p, 1);
        b.innerHTML = '✓ 已加';
        b.style.background = 'rgba(16,185,129,.25)';
        b.style.color = 'var(--green)';
        setTimeout(() => {
          b.innerHTML = '+ 加购';
          b.style.background = '';
          b.style.color = '';
        }, 1400);
        toast('已加购 · ' + p.name);
      });
    });

    // 详情
    document.querySelectorAll('.ai-r-detail').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        const id = b.getAttribute('data-detail');
        const p = APP_DATA.products.find(x => x.id === id);
        if (p) { closeModal(); setTimeout(() => this.showDetail(p), 80); }
      });
    });

    // 整张卡片查看详情
    document.querySelectorAll('.ai-r-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const p = APP_DATA.products.find(x => x.id === id);
        if (p) { closeModal(); setTimeout(() => this.showDetail(p), 80); }
      });
    });

    // 重新筛选
    const again = document.getElementById('aiAgain');
    if (again) again.addEventListener('click', () => {
      this._aiState.step = 1;
      openModal(this._renderAiStep(), { wide: true });
      this._bindAiStep();
    });

    // 一键加购全部
    const all = document.getElementById('aiAddAll');
    if (all) all.addEventListener('click', () => {
      const ids = Array.from(document.querySelectorAll('.ai-r-add')).map(b => b.getAttribute('data-add'));
      let n = 0;
      ids.forEach(id => {
        const p = APP_DATA.products.find(x => x.id === id);
        if (p) { Cart.add(p, 1); n++; }
      });
      toast(`已加入 ${n} 款到购物车`);
      closeModal();
    });
  },

  showDetail(p) {
    openModal(`
      <div style="position:relative;margin:-22px -22px 14px;height:200px;background-image:url('${esc(p.img)}');background-size:cover;background-position:center;">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.2),rgba(10,10,10,.95));"></div>
        <button onclick="closeModal()" style="position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;font-size:18px;">×</button>
        <div style="position:absolute;left:16px;bottom:14px;color:#fff;">
          <h2 style="margin:0 0 4px;font-size:22px;">${esc(p.name)}</h2>
          <div style="display:flex;gap:6px;">
            ${p.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}
          </div>
        </div>
      </div>
      <div style="color:var(--text-2);font-size:13px;line-height:1.7;margin-bottom:14px;">
        ${esc(p.desc)}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
        <div>
          <div style="color:var(--gold-2);font-size:24px;font-weight:800;">¥${p.price}</div>
          ${p.original ? `<small style="color:var(--text-3);text-decoration:line-through;">原价 ¥${p.original}</small>` : ''}
        </div>
        <div style="font-size:11px;color:var(--text-3);">${t('soldText')} ${fmtNum(p.sales)}${LangService.isEn() ? ' cups' : ' 杯'}</div>
      </div>
      <button class="btn btn-primary btn-block btn-lg" id="modalAdd">加入购物车 · ¥${p.price}</button>
    `);
    document.getElementById('modalAdd').addEventListener('click', () => {
      Cart.add(p, 1);
      closeModal();
    });
  }
};
