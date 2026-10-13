/* ============================================
   MIX CLUB · 自研微型 QR 编码器（minimal QR encoder）
   - 版本 1-2，Byte 模式，纠错级别 L
   - GF(256) 纠错码（RS）运行时生成；格式信息 BCH(15,5) 运行时计算
   - 演示用途：订单核销码 / 桌台码等短文本生成可扫描二维码
   ============================================ */
(function () {
  'use strict';

  // ---- GF(256)，本原多项式 0x11D ----
  var EXP = new Array(512);
  var LOG = new Array(256);
  (function buildTables() {
    var v = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = v;
      LOG[v] = i;
      v <<= 1;
      if (v >= 0x100) v ^= 0x11d;
    }
    // 加倍表以支持 0..510 的查表（GF 加法需 mod 255，展开避免取模）
    for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return EXP[LOG[a] + LOG[b]];
  }

  // ---- 版本能力表（v1/v2，纠错级 L）----
  var VERSIONS = [
    null,
    { size: 21, dataWords: 19, ecLen: 7,  remainderBits: 0, align: [],                 maxBytes: 17 },
    { size: 25, dataWords: 34, ecLen: 10, remainderBits: 7, align: [[18, 18]],         maxBytes: 32 }
  ];

  // ---- RS 生成多项式 g(x) = Π(x - α^i)，i=0..ecLen-1 ----
  function rsGenerator(ecLen) {
    var g = [1];
    for (var i = 0; i < ecLen; i++) {
      var next = new Array(g.length + 1).fill(0);
      for (var j = 0; j < g.length; j++) {
        next[j] ^= g[j];                  // 乘 x
        next[j + 1] ^= gfMul(g[j], EXP[i]); // 乘 α^i（GF(2) 中减=加）
      }
      g = next;
    }
    return g;
  }

  // 多项式除法求余 → 得到 ecLen 个纠错码字
  function rsEncode(data, ecLen) {
    var gen = rsGenerator(ecLen);
    var res = data.concat(new Array(ecLen).fill(0));
    for (var i = 0; i < data.length; i++) {
      var coef = res[i];
      if (coef !== 0) {
        for (var j = 0; j < gen.length; j++) {
          res[i + j] ^= gfMul(gen[j], coef);
        }
      }
    }
    return res.slice(data.length);
  }

  // ---- 格式信息：BCH(15,5)，EC L=01，掩码 0 ----
  function bchFormat(mask) {
    var data = (0x1 << 3) | mask; // EC L 的 2 位为 01
    var d = data << 10;
    var g = 0x537; // BCH 生成多项式 10100110111
    for (var i = 14; i >= 10; i--) {
      if (d & (1 << i)) d ^= g << (i - 10);
    }
    return ((data << 10) | (d & 0x3ff)) ^ 0x5412;
  }

  // ---- UTF-8 编码（Byte 模式计数字节数）----
  function toBytes(str) {
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 0x80) {
        out.push(c);
      } else if (c < 0x800) {
        out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      } else {
        out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
      }
    }
    return out;
  }

  // ---- 数据比特流：模式 + 计数 + 字节 + 终止符 + 填充 ----
  function buildDataBits(ver, bytes) {
    var info = VERSIONS[ver];
    var capBits = info.dataWords * 8;
    var bits = [];

    function push(v, n) {
      for (var i = n - 1; i >= 0; i--) bits.push((v >> i) & 1);
    }

    push(0x4, 4);                      // Byte 模式 0100
    push(bytes.length, 8);             // 字符计数（v1-9 为 8 位）
    for (var j = 0; j < bytes.length; j++) push(bytes[j], 8);

    var left = capBits - bits.length;
    push(0, Math.min(4, left));        // 终止符
    while (bits.length % 8 !== 0) push(0, 1); // 补齐字节边界
    var pad = [0xec, 0x11];
    var idx = 0;
    while (bits.length < capBits) { push(pad[idx % 2], 8); idx++; }

    var words = [];
    for (var k = 0; k < bits.length; k += 8) {
      var b = 0;
      for (var m = 0; m < 8; m++) b = (b << 1) | bits[k + m];
      words.push(b);
    }
    return words;
  }

  // ---- 矩阵构建 ----
  function buildMatrix(ver, allWords) {
    var info = VERSIONS[ver];
    var size = info.size;
    var mod = [], func = [];
    for (var y = 0; y < size; y++) { mod.push(new Array(size).fill(false)); func.push(new Array(size).fill(false)); }

    // 三个定位图案（7×7）+ 分隔区（8×8 浅色）
    function drawFinder(r0, c0) {
      for (var y = 0; y < 7; y++) {
        for (var x = 0; x < 7; x++) {
          var border = y === 0 || y === 6 || x === 0 || x === 6;
          var inner = y >= 2 && y <= 4 && x >= 2 && x <= 4;
          mod[r0 + y][c0 + x] = border || inner;
          func[r0 + y][c0 + x] = true;
        }
      }
    }
    function markCorner(r0, c0) { // 8×8 分隔区（含定位图案内部），浅色置 false
      for (var y = 0; y < 8; y++) for (var x = 0; x < 8; x++) { func[r0 + y][c0 + x] = true; }
    }
    markCorner(0, 0); drawFinder(0, 0);
    markCorner(0, size - 8); drawFinder(0, size - 7);
    markCorner(size - 8, 0); drawFinder(size - 7, 0);

    // 时钟线：行/列 6，范围 8..size-9，交替黑白（起点深色）
    for (var x = 8; x <= size - 9; x++) { mod[6][x] = (x % 2 === 0); func[6][x] = true; }
    for (var yy = 8; yy <= size - 9; yy++) { mod[yy][6] = (yy % 2 === 0); func[yy][6] = true; }

    // 校正图案（v2 仅一个，中心 (18,18)）
    for (var a = 0; a < info.align.length; a++) {
      var cy = info.align[a][0], cx = info.align[a][1];
      for (var y = cy - 2; y <= cy + 2; y++) {
        for (var x = cx - 2; x <= cx + 2; x++) {
          var border = y === cy - 2 || y === cy + 2 || x === cx - 2 || x === cx + 2;
          var center = y === cy && x === cx;
          mod[y][x] = border || center;
          func[y][x] = true;
        }
      }
    }

    // 格式信息（EC L，掩码 0），按规范两处放置
    var fmt = bchFormat(0);
    for (var i = 0; i < 15; i++) {
      var bit = ((fmt >> i) & 1) === 1;
      var r, c;
      if (i < 6) { r = i; c = 8; }
      else if (i < 8) { r = i + 1; c = 8; }
      else { r = size - 15 + i; c = 8; }
      mod[r][c] = bit; func[r][c] = true;
    }
    for (i = 0; i < 15; i++) {
      bit = ((fmt >> i) & 1) === 1;
      if (i < 8) { r = 8; c = size - 1 - i; }
      else if (i < 9) { r = 8; c = 15 - i - 1 + 1; }
      else { r = 8; c = 15 - i - 1; }
      mod[r][c] = bit; func[r][c] = true;
    }
    // 固定深色模块
    mod[size - 8][8] = true; func[size - 8][8] = true;

    // 数据放置：自右下向左上的双列 Z 形（跳过功能图案）
    var bits = [];
    for (var w = 0; w < allWords.length; w++) {
      for (var b = 7; b >= 0; b--) bits.push((allWords[w] >> b) & 1);
    }
    var bi = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5; // 跳过时钟列
      var upward = ((right + 1) & 2) === 0;
      for (var vert = 0; vert < size; vert++) {
        var row = upward ? size - 1 - vert : vert;
        for (var j = 0; j < 2; j++) {
          var col = right - j;
          if (!func[row][col] && bi < bits.length) {
            mod[row][col] = bits[bi] === 1;
            bi++;
          }
        }
      }
    }

    // 掩码 0：(行 + 列) % 2 === 0 取反（仅数据区）
    for (var y2 = 0; y2 < size; y2++) {
      for (var x2 = 0; x2 < size; x2++) {
        if (!func[y2][x2] && ((y2 + x2) % 2 === 0)) mod[y2][x2] = !mod[y2][x2];
      }
    }

    return { size: size, modules: mod, version: ver };
  }

  // ---- 对外：编码为 SVG ----
  function encode(text) {
    var bytes = toBytes(String(text));
    var ver = bytes.length <= VERSIONS[1].maxBytes ? 1 : (bytes.length <= VERSIONS[2].maxBytes ? 2 : -1);
    if (ver === -1) return null;
    var dataWords = buildDataBits(ver, bytes);
    var info = VERSIONS[ver];
    var ec = rsEncode(dataWords, info.ecLen);
    var all = dataWords.concat(ec);
    return buildMatrix(ver, all);
  }

  function toSVG(text, pixelSize) {
    var qr = encode(text);
    if (!qr) return '';
    var n = qr.size;
    var quiet = 4;
    var total = n + quiet * 2;
    var cell = (pixelSize || 200) / total;
    var rects = [];
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        if (qr.modules[y][x]) {
          rects.push('<rect x="' + (x + quiet) * cell + '" y="' + (y + quiet) * cell +
            '" width="' + Math.ceil(cell * 100) / 100 + '" height="' + Math.ceil(cell * 100) / 100 + '"/>');
        }
      }
    }
    return '<svg class="qr-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' ' + total +
      '" width="' + (pixelSize || 200) + '" height="' + (pixelSize || 200) + '" shape-rendering="crispEdges">' +
      '<rect width="100%" height="100%" fill="#ffffff"/>' + rects.join('') + '</svg>';
  }

  // 暴露到全局（供 utils / 页面使用）
  var QR = { encode: encode, toSVG: toSVG };
  if (typeof window !== 'undefined') window.QRCode = QR;
  if (typeof module !== 'undefined') module.exports = QR;
})();
