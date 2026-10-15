/* ============================================
   MIX CLUB · Music Page
   音乐播放器 + 歌单 + 可视化
   ============================================ */

const MusicPage = {
  curIdx: 0,
  playing: false,
  timer: null,
  progress: 0,

  destroy() {
    this.stopProgress();
    this.playing = false;
  },

  render() {
    const cur = APP_DATA.playlist[this.curIdx];

    return `
      <!-- 顶部返回栏 -->
      <div class="music-top">
        <button class="icon-btn" id="musicBackBtn" aria-label="返回">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="music-top-title">${t('myPlaylist')}</span>
        <span class="music-top-meta">${APP_DATA.playlist.length} ${t('songsUnit')}</span>
      </div>

      <!-- Now Playing -->
      <div class="music-hero">
        <div class="music-cover ${this.playing ? 'playing' : ''}" id="musicCover" style="background-image:url('${esc(cur.img)}')"></div>
        <div class="music-now">
          <div class="label">NOW PLAYING</div>
          <h3>${esc(cur.title)}</h3>
          <p>${esc(cur.artist)}</p>
          <div style="display:inline-flex;align-items:center;gap:4px;margin-top:2px;font-size:10px;color:var(--text-3);background:var(--bg-3);padding:3px 8px;border-radius:10px;">${t('liveAudio')}</div>
          <div class="music-progress">
            <div class="p" id="musicProgress" style="width:${this.progress}%"></div>
          </div>
          <div class="music-controls">
            <button id="prevSong">
              <svg viewBox="0 0 24 24" width="22" height="22"><path d="M19 5v14L8 12zM6 5h2v14H6z" fill="currentColor"/></svg>
            </button>
            <button class="play" id="playBtn">
              ${this.playing
                ? '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/></svg>'
                : '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>'}
            </button>
            <button id="nextSong">
              <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 5v14l11-7zM16 5h2v14h-2z" fill="currentColor"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Playlist -->
      <div class="playlist">
        <h4>
          <span>${t('housePlaylist')}</span>
          <small>${APP_DATA.playlist.length} ${t('songsUnit')} · LIVE SET</small>
        </h4>
        ${APP_DATA.playlist.map((s, i) => `
          <div class="song ${i === this.curIdx ? 'active' : ''}" data-idx="${esc(i)}">
            <span class="song-no">${i === this.curIdx
              ? '<span class="eq '+(this.playing?'':'paused')+'"><span></span><span></span><span></span></span>'
              : pad(i+1)}</span>
            <div class="song-img" style="background-image:url('${esc(s.img)}')"></div>
            <div class="song-info">
              <b>${esc(s.title)}</b>
              <small>${esc(s.artist)}</small>
            </div>
            <span class="song-dur">${esc(s.dur)}</span>
            <span class="song-play">
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
            </span>
          </div>
        `).join('')}
      </div>

      <div class="page-footer">
        © 2026 MIX CLUB · MUSIC NEVER STOPS
      </div>
    `;
  },

  mount(root) {
    root.innerHTML = this.render();
    this.bindEvents(root);
  },

  bindEvents(root) {
    // 返回
    const backBtn = root.querySelector('#musicBackBtn');
    if (backBtn) {
      backBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.stopProgress();
        MIX_APP.go('home');
      };
    }

    root.querySelector('#playBtn').addEventListener('click', () => this.togglePlay(root));
    root.querySelector('#prevSong').addEventListener('click', () => this.prev(root));
    root.querySelector('#nextSong').addEventListener('click', () => this.next(root));
    root.querySelectorAll('.song').forEach(s => {
      s.addEventListener('click', () => {
        this.curIdx = parseInt(s.getAttribute('data-idx'));
        this.progress = 0;
        this.playing = true;
        this.startProgress();
        this.mount(root);
      });
    });
  },

  togglePlay(root) {
    this.playing = !this.playing;
    if (this.playing) this.startProgress();
    else this.stopProgress();
    this.mount(root);
  },

  next(root) {
    this.curIdx = (this.curIdx + 1) % APP_DATA.playlist.length;
    this.progress = 0;
    this.mount(root);
    // 保持播放态：切歌后继续推进进度
    if (this.playing) this.startProgress();
  },

  prev(root) {
    this.curIdx = (this.curIdx - 1 + APP_DATA.playlist.length) % APP_DATA.playlist.length;
    this.progress = 0;
    this.mount(root);
    if (this.playing) this.startProgress();
  },

  startProgress() {
    this.stopProgress();
    this.timer = setInterval(() => {
      this.progress += 0.5;
      if (this.progress >= 100) {
        this.stopProgress();
        // 自动切歌：取当前 root 重新渲染
        const root = document.querySelector('[data-page="music"]');
        if (root) this.next(root);
        return;
      }
      const p = document.getElementById('musicProgress');
      if (p) p.style.width = this.progress + '%';
    }, 200);
  },

  stopProgress() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
};
