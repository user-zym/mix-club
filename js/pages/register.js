/* ============================================
   MIX CLUB · Register Page
   注册页
   ============================================ */

const RegisterPage = {
  render() {
    return `
      <div class="auth-page">
        <!-- 顶部 -->
        <div class="auth-top">
          <button class="icon-btn" id="goBackFromRegister" aria-label="返回">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="auth-top-title">${t('regTitle')}</span>
          <span style="width:36px;"></span>
        </div>

        <!-- Logo + 标题 -->
        <div class="auth-brand">
          <div class="auth-logo">
            <span>M</span>
          </div>
          <h1>${t('regSub')}</h1>
          <p>${t('regBonus')}</p>
        </div>

        <!-- 表单 -->
        <div class="auth-form">
          <div class="auth-field">
            <label>${t('phoneLabel')}</label>
            <div class="auth-input-wrap">
              <span class="auth-prefix">+86</span>
              <input type="tel" inputmode="numeric" maxlength="11" id="regPhone" placeholder="${t('phPhone')}" autocomplete="tel">
            </div>
          </div>

          <div class="auth-field">
            <label>${t('codeLabel')}</label>
            <div class="auth-input-wrap auth-code-wrap">
              <input type="tel" inputmode="numeric" maxlength="6" id="regCode" placeholder="${t('phCode')}">
              <button class="auth-code-btn" id="sendCodeBtn">${t('getCode')}</button>
            </div>
          </div>

          <div class="auth-field">
            <label>${t('setPwd')}</label>
            <div class="auth-input-wrap">
              <input type="password" id="regPwd" placeholder="6-16 位字母/数字" maxlength="16" autocomplete="new-password">
              <button class="auth-eye" id="regEye" type="button" aria-label="显示密码">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="auth-field">
            <label>${t('nickLabel')}</label>
            <div class="auth-input-wrap">
              <input type="text" id="regName" placeholder="${t('phNick')}" maxlength="12">
            </div>
          </div>

          <!-- 密码强度 -->
          <div class="auth-strength" id="pwdStrength">
            <span class="auth-strength-bar" data-lv="1"></span>
            <span class="auth-strength-bar" data-lv="2"></span>
            <span class="auth-strength-bar" data-lv="3"></span>
            <span class="auth-strength-label" id="strengthLabel">${t('enterPwd')}</span>
          </div>

          <!-- 协议 -->
          <label class="auth-check" style="margin:18px 0 22px;">
            <input type="checkbox" id="agreeTerms" checked>
            <span>${t('agreeTerms')}</span>
          </label>

          <button class="btn btn-primary btn-block auth-submit" id="regSubmit">${t('regBtn')}</button>
        </div>

        <!-- 底部 -->
        <div class="auth-foot">
          <span>${t('haveAccount')}</span>
          <a id="gotoLogin">${t('signInNow')}</a>
        </div>
      </div>
    `;
  },

  mount(root) {
    root.innerHTML = this.render();

    // 密码输入框可能没渲染（异常情况），但其它元素总是要绑定。
    const pwdInput = document.getElementById('regPwd');

    const backBtn = document.getElementById('goBackFromRegister');
    if (backBtn) {
      backBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try { goBackSmart(); } catch (err) {
          console.error('[Register] back error:', err);
          navigate('home');
        }
      };
    } else {
      console.warn('[Register] goBackFromRegister button not found');
    }

    if (pwdInput) {
      const eye = document.getElementById('regEye');
      if (eye) {
        eye.onclick = () => {
          pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
        };
      }
      pwdInput.addEventListener('input', () => this.updateStrength(pwdInput.value));
      pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') this.doRegister(); });
    }

    const sendCode = document.getElementById('sendCodeBtn');
    if (sendCode) sendCode.onclick = () => this.sendCode();

    const submit = document.getElementById('regSubmit');
    if (submit) submit.onclick = () => this.doRegister();

    const gotoLogin = document.getElementById('gotoLogin');
    if (gotoLogin) gotoLogin.onclick = () => navigate('login');

    setTimeout(() => document.getElementById('regPhone')?.focus(), 300);
  },

  updateStrength(v) {
    const bars = document.querySelectorAll('#pwdStrength .auth-strength-bar');
    const label = document.getElementById('strengthLabel');
    let lv = 0;
    if (v.length >= 6) lv = 1;
    if (v.length >= 8 && /[A-Z]/.test(v)) lv = 2;
    if (v.length >= 10 && /[A-Z]/.test(v) && /\d/.test(v) && /[^\w]/.test(v)) lv = 3;

    bars.forEach((b, i) => b.classList.toggle('on', i < lv));
    const text = ['', '弱', '中', '强'];
    const color = ['', '#ff4d4f', '#faad14', '#52c41a'];
    label.textContent = text[lv] || t('enterPwd');
    label.style.color = color[lv] || '';
  },

  sendCode() {
    const phone = (document.getElementById('regPhone').value || '').trim();
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast(t('tPhoneInvalid'));
      return;
    }
    if (Auth.accounts[phone]) {
      toast(t('tRegExists'));
      return;
    }
    const btn = document.getElementById('sendCodeBtn');
    let n = 60;
    btn.disabled = true;
    btn.textContent = `${n}s 后重发`;
    // 自动填充 6 位验证码
    document.getElementById('regCode').value = '888888';
    toast(t('tCodeSent'));
    const t = setInterval(() => {
      n--;
      btn.textContent = `${n}s 后重发`;
      if (n <= 0) {
        clearInterval(t);
        btn.disabled = false;
        btn.textContent = t('getCode');
      }
    }, 1000);
  },

  doRegister() {
    const phone = (document.getElementById('regPhone').value || '').trim();
    const code = (document.getElementById('regCode').value || '').trim();
    const pwd = (document.getElementById('regPwd').value || '').trim();
    const name = (document.getElementById('regName').value || '').trim();

    if (code !== '888888') {
      toast(t('tCodeWrong'));
      return;
    }

    if (!document.getElementById('agreeTerms').checked) {
      toast(t('tAgreeFirst'));
      return;
    }

    const r = Auth.register(phone, pwd, name);
    if (r.ok) {
      toast('注册成功，已自动登录 🎉');
      setTimeout(() => navigate('profile'), 500);
    } else {
      toast(r.msg);
    }
  }
};