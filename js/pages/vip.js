/* ============================================
   MIX CLUB · VIP Page
   会员等级 + 权益 + 积分
   ============================================ */

const VipPage = {
  render() {
    const u = User.data;
    const cur = APP_DATA.vipLevels.find(l => l.lvl === u.level);
    const next = APP_DATA.vipLevels.find(l => l.lvl === u.level + 1);
    const progress = next ? Math.min(100, ((u.points - cur.min) / (next.min - cur.min)) * 100) : 100;
    const toNext = next ? (next.min - u.points) : 0;

    const benefits = APP_DATA.vipBenefits.map(b => `
      <div class="benefit ${b.unlocked ? '' : 'locked'}">
        <div class="benefit-icon">${esc(b.icon)}</div>
        <div>
          <b>${esc(L(b.name, b.nameEn))}</b>
          <small>${esc(L(b.desc, b.descEn))}${!b.unlocked ? ' · '+esc(L(b.need, b.needEn)) : ''}</small>
        </div>
      </div>
    `).join('');

    const cards = APP_DATA.vipCards.map(c => `
      <div class="vip-card">
        <div class="vip-card-icon">${esc(c.icon)}</div>
        <div class="vip-card-info">
          <h4>${esc(L(c.type, c.typeEn))}</h4>
          <p>${esc(L(c.desc, c.descEn))}</p>
          <div class="num">${esc(c.num)}</div>
        </div>
      </div>
    `).join('');

    return `
      <!-- Hero -->
      <div class="vip-hero">
        <div class="lvl">CURRENT LEVEL <b>${esc(L(cur.name, cur.nameEn))}</b></div>
        <h2>${esc(L(cur.name, cur.nameEn))}</h2>
        <div class="points"><b>${fmtNum(u.points)}</b> ${t('vipPts')}</div>
        <div class="vip-progress">
          <div class="bar" style="width:${progress}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);position:relative;">
          <span>${esc(L(cur.name, cur.nameEn))}</span>
          <span>${next ? (LangService.isEn() ? `Only ${fmtNum(toNext)} pts to ${esc(L(next.name, next.nameEn))}` : `距离 ${esc(next.name)} 还差 ${fmtNum(toNext)} 积分`) : t('vipMax')}</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="section" style="margin-bottom:18px;">
        <div class="profile-stats" style="background:var(--bg-2);border:1px solid var(--line);padding:14px;border-radius:var(--radius-l);">
          <div class="stat"><b>${u.points}</b><small>${t('vipAvail')}</small></div>
          <div class="stat"><b>${u.coupons}</b><small>${t('vipCoupons')}</small></div>
          <div class="stat"><b>¥${u.balance}</b><small>${t('vipBalance')}</small></div>
          <div class="stat"><b>${u.expiring}</b><small>${t('vipExpiring')}</small></div>
        </div>
      </div>

      <!-- Benefits -->
      <div class="vip-benefits">
        <div class="section-head">
          <h3 class="section-title">${t('vipBenefits')}</h3>
        </div>
        <div class="benefit-grid">${benefits}</div>
      </div>

      <!-- Cards -->
      <div class="vip-cards">
        <div class="section-head">
          <h3 class="section-title">${t('myCards')}</h3>
        </div>
        ${cards}
      </div>

      <div class="page-footer">
        © 2026 MIX CLUB · VIP LOUNGE
      </div>
    `;
  },

  mount(root) {
    root.innerHTML = this.render();
  }
};
