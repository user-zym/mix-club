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
          <span class="auth-top-title">注册 MIX CLUB</span>
          <span style="width:36px;"></span>
        </div>

        <!-- Logo + 标题 -->
        <div class="auth-brand">
          <div class="auth-logo">
            <span>M</span>
          </div>
          <h1>创建账号</h1>
          <p>注册即送 100 积分 + 1 张新人大礼包</p>
        </div>

        <!-- 表单 -->
        <div class="auth-form">
          <div class="auth-field">
            <label>手机号</label>
            <div class="auth-input-wrap">
              <span class="auth-prefix">+86</span>
              <input type="tel" inputmode="numeric" maxlength="11" id="regPhone" placeholder="请输入手机号" autocomplete="tel">
            </div>
          </div>

          <div class="auth-field">
            <label>验证码</label>
            <div class="auth-input-wrap auth-code-wrap">
              <input type="tel" inputmode="numeric" maxlength="6" id="regCode" placeholder="6 位短信验证码">
              <button class="auth-code-btn" id="sendCodeBtn">获取验证码</button>
            </div>
          </div>

          <div class="auth-field">
            <label>设置密码</label>
            <div class="auth-input-wrap">
              <input type="password" id="regPwd" placeholder="6-16 位字母/数字" maxlength="16" autocomplete="new-password">
              <button class="auth-eye" id="regEye" type="button" aria-label="显示密码">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="auth-field">
            <label>昵称（可选）</label>
            <div class="auth-input-wrap">
              <input type="text" id="regName" placeholder="请输入昵称" maxlength="12">
            </div>
          </div>

          <!-- 密码强度 -->
          <div class="auth-strength" id="pwdStrength">
            <span class="auth-strength-bar" data-lv="1"></span>
            <span class="auth-strength-bar" data-lv="2"></span>
            <span class="auth-strength-bar" data-lv="3"></span>
            <span class="auth-strength-label" id="strengthLabel">请输入密码</span>
          </div>

          <!-- 协议 -->
          <label class="auth-check" style="margin:18px 0 22px;">
            <input type="checkbox" id="agreeTerms" checked>
            <span>我已阅读并同意 <a class="auth-link">《用户协议》</a> 与 <a class="auth-link">《隐私政策》</a></span>
          </label>

          <button class="btn btn-primary btn-block auth-submit" id="regSubmit">注 册</button>
        </div>

        <!-- 底部 -->
        <div class="auth-foot">
          <span>已有账号?</span>
          <a id="gotoLogin">立即登录</a>
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
    label.textContent = text[lv] || '请输入密码';
    label.style.color = color[lv] || '';
  },

  sendCode() {
    const phone = (document.getElementById('regPhone').value || '').trim();
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast('请先输入正确的手机号');
      return;
    }
    if (Auth.accounts[phone]) {
      toast('该手机号已注册，请直接登录');
      return;
    }
    const btn = document.getElementById('sendCodeBtn');
    let n = 60;
    btn.disabled = true;
    btn.textContent = `${n}s 后重发`;
    // 自动填充 6 位验证码
    document.getElementById('regCode').value = '888888';
    toast('验证码已发送（888888）');
    const t = setInterval(() => {
      n--;
      btn.textContent = `${n}s 后重发`;
      if (n <= 0) {
        clearInterval(t);
        btn.disabled = false;
        btn.textContent = '获取验证码';
      }
    }, 1000);
  },

  doRegister() {
    const phone = (document.getElementById('regPhone').value || '').trim();
    const code = (document.getElementById('regCode').value || '').trim();
    const pwd = (document.getElementById('regPwd').value || '').trim();
    const name = (document.getElementById('regName').value || '').trim();

    if (code !== '888888') {
      toast('验证码错误（请填 888888）');
      return;
    }

    if (!document.getElementById('agreeTerms').checked) {
      toast('请先同意用户协议');
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