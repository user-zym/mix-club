/* ============================================
   MIX CLUB · Login Page
   登录页
   ============================================ */

const LoginPage = {
  render() {
    return `
      <div class="auth-page">
        <!-- 顶部返回 + Logo -->
        <div class="auth-top">
          <button class="icon-btn" id="goBackFromLogin" aria-label="返回">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="auth-top-title">${t('loginTitle')}</span>
          <span style="width:36px;"></span>
        </div>

        <!-- Logo + 欢迎语 -->
        <div class="auth-brand">
          <div class="auth-logo">
            <span>M</span>
          </div>
          <h1>${t('welcomeBack')}</h1>
          <p>${t('loginSub')}</p>
        </div>

        <!-- 表单 -->
        <div class="auth-form">
          <div class="auth-field">
            <label>${t('phoneLabel')}</label>
            <div class="auth-input-wrap">
              <span class="auth-prefix">+86</span>
              <input type="tel" inputmode="numeric" maxlength="11" id="loginPhone" placeholder="请输入手机号" autocomplete="tel">
            </div>
          </div>

          <div class="auth-field">
            <label>${t('pwdLabel')}</label>
            <div class="auth-input-wrap">
              <input type="password" id="loginPwd" placeholder="请输入密码" autocomplete="current-password">
              <button class="auth-eye" id="loginEye" type="button" aria-label="显示密码">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="auth-row">
            <label class="auth-check">
              <input type="checkbox" id="rememberMe" checked>
              <span>${t('rememberMe')}</span>
            </label>
            <a class="auth-link" id="forgotBtn">${t('forgotPwd')}</a>
          </div>

          <button class="btn btn-primary btn-block auth-submit" id="loginSubmit">${t('loginBtn')}</button>

          <!-- 第三方登录 -->
          <div class="auth-divider"><span>${t('otherLogin')}</span></div>
          <div class="auth-third">
            <div class="auth-third-item" data-third="wechat">
              <div class="auth-third-ic" style="background:#07c160;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M9 4C5 4 2 6.7 2 10c0 1.8.8 3.4 2.2 4.5L3 17l3-1.5c.6.1 1.3.2 2 .2.2 0 .4 0 .6-.1A6 6 0 0 1 8 13c0-3.3 3.4-6 7.5-6h.6C15.4 5.1 12.5 4 9 4zm-2.5 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM16 9c-3.3 0-6 2.2-6 5s2.7 5 6 5c.6 0 1.1-.1 1.7-.2L20 20l-.7-2c1.2-.9 1.7-2.2 1.7-3.5C21 11.5 18.8 9 16 9zm-2 3.5a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zm4 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"/></svg>
              </div>
              <span>${t('wechatName')}</span>
            </div>
            <div class="auth-third-item" data-third="apple">
              <div class="auth-third-ic" style="background:#000;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M17.05 12.04c-.03-2.7 2.2-4 2.3-4.05-1.26-1.83-3.21-2.08-3.9-2.11-1.66-.17-3.24.98-4.08.98-.86 0-2.15-.96-3.55-.93-1.82.03-3.51 1.06-4.45 2.7-1.9 3.3-.49 8.18 1.36 10.86.9 1.32 1.97 2.8 3.36 2.75 1.35-.05 1.86-.87 3.49-.87 1.62 0 2.09.87 3.52.85 1.45-.03 2.37-1.34 3.26-2.66 1.03-1.52 1.45-3 1.47-3.08-.03-.02-2.81-1.08-2.84-4.27zM14.34 4.16c.74-.9 1.24-2.15 1.1-3.4-1.07.04-2.36.71-3.13 1.6-.69.79-1.29 2.07-1.13 3.29 1.19.1 2.42-.6 3.16-1.49z"/></svg>
              </div>
              <span>Apple</span>
            </div>
            <div class="auth-third-item" data-third="qq">
              <div class="auth-third-ic" style="background:#1296db;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M12 2C7.6 2 4 5.5 4 9.9c0 1.9.6 3.6 1.7 5l-.7 3 3-1.5c.9.4 1.9.6 2.9.7L12 22l1.1-4.9c1-.1 2-.3 2.9-.7l3 1.5-.7-3c1.1-1.4 1.7-3.1 1.7-5C20 5.5 16.4 2 12 2z"/></svg>
              </div>
              <span>QQ</span>
            </div>
          </div>
        </div>

        <!-- 底部注册 -->
        <div class="auth-foot">
          <span>${t('noAccount')}</span>
          <a id="gotoRegister">${t('registerNow')}</a>
        </div>

        <!-- 会员账号提示 -->
        <div class="auth-demo">
          <p>📌 ${t('accountHint')}${t('accountFree')}</p>
          <p>${t('useGuest')} <a id="useDemo">${t('useGuestBtn')}</a></p>
        </div>
      </div>
    `;
  },

  mount(root) {
    root.innerHTML = this.render();

    const pwdInput = document.getElementById('loginPwd');

    const backBtn = document.getElementById('goBackFromLogin');
    if (backBtn) {
      backBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try { goBackSmart(); } catch (err) {
          console.error('[Login] back error:', err);
          navigate('home');
        }
      };
    } else {
      console.warn('[Login] goBackFromLogin button not found');
    }

    if (pwdInput) {
      const eye = document.getElementById('loginEye');
      if (eye) {
        eye.onclick = () => {
          pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
        };
      }
      pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') this.doLogin(); });
    }

    const submit = document.getElementById('loginSubmit');
    if (submit) submit.onclick = () => this.doLogin();

    const gotoRegister = document.getElementById('gotoRegister');
    if (gotoRegister) gotoRegister.onclick = () => navigate('register');

    const useDemo = document.getElementById('useDemo');
    if (useDemo) {
      useDemo.onclick = () => {
        const phoneEl = document.getElementById('loginPhone');
        const pwdEl = document.getElementById('loginPwd');
        if (phoneEl) phoneEl.value = '13800000000';
        if (pwdEl) pwdEl.value = '123456';
        this.doLogin();
      };
    }

    const forgotBtn = document.getElementById('forgotBtn');
    if (forgotBtn) {
      forgotBtn.onclick = () => {
        toast('请输入手机号验证后重置密码');
      };
    }

    // 第三方登录
    root.querySelectorAll('[data-third]').forEach(el => {
      el.onclick = () => {
        const which = el.getAttribute('data-third');
        toast(`${which === 'wechat' ? t('wechatName') : which === 'apple' ? 'Apple' : 'QQ'}${LangService.isEn() ? ' login coming soon' : ' 登录开发中'}`);
      };
    });

    setTimeout(() => document.getElementById('loginPhone')?.focus(), 300);
  },

  doLogin() {
    const phone = (document.getElementById('loginPhone').value || '').trim();
    const pwd = (document.getElementById('loginPwd').value || '').trim();

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast('请输入正确的手机号');
      return;
    }
    if (!pwd) {
      toast('请输入密码');
      return;
    }

    // 会员账号直接走预置数据
    if (phone === '13800000000' && pwd === '123456') {
      Auth.reset();
      toast(t('loginOk'));
      setTimeout(() => navigate('profile'), 400);
      return;
    }

    const r = Auth.login(phone, pwd);
    if (r.ok) {
      toast('登录成功');
      setTimeout(() => navigate('profile'), 400);
    } else {
      toast(r.msg);
    }
  }
};