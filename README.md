# MIX CLUB · 城市夜生活新坐标

酒吧一站式移动端应用（H5 / PWA），涵盖在线点单、包厢预订、排队取号、派对活动、VIP 会员、驻场歌单、AI 调酒师推荐、商家管理后台等完整闭环。

---

## 🎯 功能概览

| 模块 | 说明 |
|---|---|
| **首页 Banner** | 自动轮播 + 快捷入口 + 人气榜单 |
| **在线点单** | 分类筛选 / 搜索 / AI 调酒师智能推荐 / 购物车 |
| **包厢预订** | 4 种包厢类型 / 日期时间人数 / 订单确认 |
| **排队取号** | 实时叫号进度条 / 历史取号记录 |
| **派对活动** | 活动列表 / 倒计时 / 报名购票 |
| **VIP 会员** | 5 级会员体系 / 积分 / 优惠券 / 储值卡 |
| **驻场歌单** | 歌单列表 / 播放控制 |
| **AI 调酒师** | 口味 × 场景 × 强度 × 时段 四维推荐引擎（规则可解释） |
| **购物车** | 增删改 / 优惠券 / 支付流程 / 订单生成 |
| **商家端** | 经营看板 / 核销台 / 桌台二维码生成 |

---

## 🛠️ 技术栈

| 层级 | 技术选型 |
|---|---|
| 前端框架 | 原生 JavaScript（ES5，无构建工具，零依赖运行） |
| 样式 | CSS3（CSS Variables / Flexbox / Grid / 动画） |
| PWA | Service Worker + Web App Manifest（离线可用） |
| 状态持久化 | localStorage |
| 二维码 | qrcode.js（内嵌，无 CDN） |
| 图片资源 | 36 张 JPG（已压缩，单张 ≤ 120 KB） |

> **无需 Node.js / npm**，直接用浏览器打开 `index.html` 即可运行。

---

## 🚀 快速启动

### 方式一：本地浏览器直接打开
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 方式二：本地 HTTP 服务器（推荐，PWA 功能需 HTTPS 或 localhost）

```bash
# Python 3
python -m http.server 8080

# Node.js（无需 npm install，内置 http-server 或任何静态服务器）
npx http-server . -p 8080
```

然后访问 `http://localhost:8080`

### 方式三：部署到 GitHub Pages / Vercel / Netlify
直接把 `源代码/` 目录上传或连接 GitHub 仓库即可免费托管（已包含 `manifest.json` 和 `sw.js`，开箱即 PWA）。

---

## 📂 项目结构

```
源代码/
├── index.html           # 入口 HTML（PWA shell + 路由框架）
├── manifest.json         # PWA 应用清单
├── sw.js                # Service Worker（离线缓存策略）
├── .gitignore           # Git 忽略配置
├── README.md            # 本文档
├── setup-git.bat        # Windows 一键 Git 初始化脚本
│
├── css/
│   ├── main.css         # 通用样式：变量 / 重置 / 组件 / 启动页 / AI 弹窗 / 商家端
│   └── pages.css        # 各页面专属样式
│
├── js/
│   ├── app.js           # 主入口 / SPA 路由 / 启动页控制
│   ├── data.js          # 静态示例数据（商品 / 活动 / 会员 / 歌单）
│   ├── utils.js         # 工具函数：购物车 / 认证 / 订单 / 优惠券 / AI / Toast
│   ├── qrcode.js        # 二维码生成库（内嵌）
│   └── pages/           # 页面模块（每个页面一个文件）
│       ├── home.js      # 首页
│       ├── menu.js      # 在线点单
│       ├── booking.js   # 包厢预订
│       ├── events.js    # 派对活动
│       ├── queue.js     # 排队取号
│       ├── vip.js       # VIP 会员
│       ├── music.js     # 驻场歌单
│       ├── cart.js      # 购物车
│       ├── profile.js   # 个人中心
│       ├── merchant.js  # 商家管理
│       ├── login.js     # 登录
│       └── register.js  # 注册
│
├── images/              # 图片资源（已压缩）
│   ├── banner1-10.jpg   # 首页 Banner（10 张）
│   ├── *.jpg            # 商品图（18 张）/ 活动图（5 张）/ 包厢图（4 张）
│   └── （共 36 张 JPG）
│
├── icon-192.png         # PWA 图标（192×192）
└── icon-512.png         # PWA 图标（512×512）
```

---

## 🔑 体验账号

| 用途 | 账号 | 密码 |
|---|---|---|
| 注册体验 | 任意未注册手机号 | 任意 6 位 |
| 短信验证码 | 任意 | `888888` |

> 退出登录 → 个人中心 → 右上角「退出」按钮。

---

## 📱 设计规范

| 项目 | 值 |
|---|---|
| 设计基准 | 375 × 812 px（iPhone X/11/12/13） |
| 设计风格 | 暗色系 / 霓虹金 + 粉紫渐变 / iOS 毛玻璃 |
| 主色调 | `#d4af37`（金）/ `#ff2d6f`（粉）/ `#7c3aed`（紫） |
| 背景色 | `#050505` |
| 字体 | `-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei"` |
| 移动端适配 | `max-width: 375px` 居中，桌面端手机壳预览 |

---

## ⚠️ 注意事项

- 本项目为**纯前端项目**，所有数据存储在浏览器 localStorage，无真实后端。
- 订单、支付、核销等为完整交互流程，数据存储于浏览器本地。
- PWA 离线功能仅在 HTTPS 或 localhost 环境下生效。
- 部分浏览器需要手动"添加到主屏幕"才能获得完整 PWA 体验。
- 部署新版本时，记得把 `sw.js` 第 6 行的 `CACHE_NAME` 版本号 +1（例如 `mix-club-v3` → `mix-club-v4`），否则浏览器会继续返回旧缓存。
- 所有用户输入的展示位置均通过 `esc()` 函数转义，防御 XSS。

---

## 📄 许可证

MIT License · 2024 MIX CLUB
