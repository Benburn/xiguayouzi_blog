/*! 放射学-核医学诊断影像（中译阅读版）· 纯离线阅读器交互脚本
 *  原生 JS、零依赖、file:// 下直接可用（搜索直接扫 DOM，不发任何请求）。
 *  模块：暗色主题 / 目录抽屉与折叠 / 滚动高亮 / 全书搜索 / 阅读进度 /
 *        Lightbox / 章节导航 / 返回顶部 / 标题锚点 / 全局快捷键
 *  兼容说明：#lightbox/#lb-img/#lb-close、#back-top、#theme-btn、nav.ch-nav
 *  若由 assemble.py 预先输出则直接复用，缺失时由本脚本兜底创建。 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  }

  var mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function scrollBehavior() { return mqReduced.matches ? 'auto' : 'smooth'; }

  /* =====================================================================
   * 1) 暗色主题：html[data-theme] + localStorage 记忆 + 跟随系统
   * =================================================================== */
  var THEME_KEY = 'rnmdi-theme';
  var themeBtn = $('#theme-btn');

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.textContent = theme === 'dark' ? '☀' : '🌙';
      themeBtn.title = theme === 'dark' ? '切换为浅色模式' : '切换为深色模式';
    }
    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* file:// 隐私模式等 */ }
    }
  }

  (function initTheme() {
    if (!themeBtn) {
      themeBtn = doc.createElement('button');
      themeBtn.id = 'theme-btn';
      themeBtn.className = 'icon-btn';
      themeBtn.type = 'button';
      var pill0 = $('#progress-pill');
      if (pill0 && pill0.parentNode) pill0.parentNode.insertBefore(themeBtn, pill0);
      else body.appendChild(themeBtn);
    }
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
    var sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (sysDark ? 'dark' : 'light'), false);
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  })();

  /* =====================================================================
   * 2) 侧边栏目录：移动端抽屉（#menu-btn + 遮罩）、章节折叠
   * =================================================================== */
  var toc = $('#toc');
  var menuBtn = $('#menu-btn');

  var mask = doc.createElement('div');
  mask.id = 'sb-mask';
  body.appendChild(mask);

  function isMobile() { return window.innerWidth <= 900; }
  function closeDrawer() { body.classList.remove('sb-open'); }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () { body.classList.toggle('sb-open'); });
  }
  mask.addEventListener('click', closeDrawer);

  function setOpen(tpch, open, exclusive) {
    if (!tpch) return;
    if (exclusive) {
      $all('.tp-ch.open', toc).forEach(function (el) {
        if (el !== tpch) el.classList.remove('open');
      });
    }
    tpch.classList.toggle('open', !!open);
  }

  if (toc) {
    toc.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      var tpch = a.closest('.tp-ch');
      if (tpch && a.classList.contains('tp')) setOpen(tpch, true, false); // 点章名：展开 + 跳转
      if (isMobile()) closeDrawer();
    });
  }

  /* =====================================================================
   * 3) 章节导航 nav.ch-nav：上一章 / 下一章（已存在则增强替换）
   * =================================================================== */
  var chapters = $all('#main section.chapter');

  function pad2(n) { n = String(n); return n.length < 2 ? '0' + n : n; }
  function chapterTitle(ch) {
    var h1 = $('.ch-head h1', ch);
    return h1 ? h1.textContent.trim() : (ch.id || '章节');
  }
  function chapterNum(ch) {
    var dc = ch.getAttribute('data-ch');
    if (dc) return pad2(dc);
    var ne = $('.ch-num', ch);
    return ne ? ne.textContent.trim() : '';
  }
  function chnLink(dir, label, href, num, title) {
    var a = doc.createElement('a');
    a.className = 'chn ' + dir;
    a.href = href;
    a.innerHTML =
      '<span class="chn-dir">' + (dir === 'prev' ? '← ' : '') + label + (dir === 'next' ? ' →' : '') + '</span>' +
      '<span class="chn-title"><b>' + num + '</b>' + escapeHtml(title) + '</span>';
    return a;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  (function buildChNav() {
    chapters.forEach(function (ch, i) {
      var nav = doc.createElement('nav');
      nav.className = 'ch-nav';
      nav.setAttribute('aria-label', '章节导航');

      var prev;
      if (i > 0) {
        prev = chnLink('prev', '上一章', '#' + chapters[i - 1].id,
          chapterNum(chapters[i - 1]), chapterTitle(chapters[i - 1]));
      } else {
        prev = chnLink('prev', '上一章', '#front', '序', '前言与目录');
      }
      var next;
      if (i < chapters.length - 1) {
        next = chnLink('next', '下一章', '#' + chapters[i + 1].id,
          chapterNum(chapters[i + 1]), chapterTitle(chapters[i + 1]));
      } else {
        next = doc.createElement('span');
        next.className = 'chn next empty';
        next.setAttribute('aria-hidden', 'true');
      }
      nav.appendChild(prev);
      nav.appendChild(next);

      var existing = $('nav.ch-nav', ch); // assemble 已输出的简版导航 → 替换为增强版
      if (existing) ch.replaceChild(nav, existing);
      else ch.appendChild(nav);
    });
  })();

  /* =====================================================================
   * 4) 滚动监听：当前章节 / 小节高亮（IntersectionObserver）
   * =================================================================== */
  var chLinkById = new Map();   // chapter id -> a.tp
  var subLinkById = new Map();  // 节标题 id -> .sub a
  var frontLink = null;

  if (toc) {
    $all('a.tp', toc).forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;
      if (a.closest('.tp-ch')) chLinkById.set(href.slice(1), a);
      else if (href === '#front') frontLink = a;
    });
    $all('.sub a', toc).forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#') subLinkById.set(href.slice(1), a);
    });
  }

  var curChLink = null;
  var curSubLink = null;

  function setActive(chLink, subLink, tpch) {
    if (chLink !== curChLink) {
      if (curChLink) curChLink.classList.remove('active');
      if (chLink) chLink.classList.add('active');
      curChLink = chLink;
      if (tpch) setOpen(tpch, true, true); // 滚动驱动：手风琴式保持当前章展开
    }
    if (subLink !== curSubLink) {
      if (curSubLink) curSubLink.classList.remove('active');
      if (subLink) subLink.classList.add('active');
      curSubLink = subLink;
    }
  }

  /* 滚动位置 → 当前章节/小节：缓存各锚点文档偏移 + 二分查找。
     懒加载图片会改变后续布局，故在 img load / resize / window load 时重测量。 */
  var spyPoints = [];   // { el, chId, subId, top }
  var spySorted = [];
  var measureTimer = 0;

  (function buildSpyPoints() {
    chapters.forEach(function (ch) {
      var h = $('.ch-head', ch);
      if (h) spyPoints.push({ el: h, chId: ch.id, subId: null, top: 0 });
    });
    subLinkById.forEach(function (a, id) {
      var t = doc.getElementById(id);
      if (t) {
        var chEl = t.closest('.chapter');
        spyPoints.push({ el: t, chId: chEl ? chEl.id : null, subId: id, top: 0 });
      }
    });
    var front = $('#front');
    if (front) spyPoints.push({ el: front, chId: 'front', subId: null, top: 0 });
  })();

  function measureSpy() {
    var y = window.pageYOffset || 0;
    spyPoints.forEach(function (p) {
      p.top = p.el.getBoundingClientRect().top + y;
    });
    spySorted = spyPoints.slice().sort(function (a, b) { return a.top - b.top; });
  }
  function scheduleMeasure() {
    clearTimeout(measureTimer);
    measureTimer = setTimeout(measureSpy, 150);
  }

  function updateSpy() {
    if (!spySorted.length) return;
    var line = (window.pageYOffset || 0) + 96; // topbar 高度 + 呼吸空间
    var lo = 0, hi = spySorted.length - 1, ans = -1;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (spySorted[mid].top <= line) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    if (ans < 0) { setActive(null, null, null); return; }
    var p = spySorted[ans];
    var subLink = p.subId ? (subLinkById.get(p.subId) || null) : null;
    var chLink = p.chId === 'front' ? frontLink : (p.chId ? (chLinkById.get(p.chId) || null) : null);
    var tpch = chLink ? chLink.closest('.tp-ch') : null;
    setActive(chLink, subLink, tpch);
  }

  window.addEventListener('resize', scheduleMeasure);
  doc.addEventListener('load', scheduleMeasure, true); // 懒加载图片改变布局
  window.addEventListener('load', function () { setTimeout(function () { measureSpy(); updateSpy(); }, 200); });
  setTimeout(function () { measureSpy(); updateSpy(); }, 300);
  setTimeout(function () { measureSpy(); updateSpy(); }, 1200);
  if (location.hash.length > 1) {
    setTimeout(function () { measureSpy(); updateSpy(); }, 120);
  }

  /* =====================================================================
   * 5) 全书搜索：加载后分块建索引（按章节 Map 分组），≥2 字符即时搜索
   *    索引对象：.p / .box / h2-h5 / figcaption / .ref
   * =================================================================== */
  var searchInput = $('#search-input');
  var searchCount = $('#search-count');
  var searchBox = $('#searchbox');
  var btnPrev = $('#search-prev');
  var btnNext = $('#search-next');
  var btnClose = $('#search-close');

  var INDEX_SEL = '#main p, #main .box, #main h2, #main h3, #main h4, #main h5, #main figcaption';
  var groups = [];            // [{ id, entries: [{ el, text }] }] 按章节分组
  var indexReady = false;
  var pendingQuery = null;

  var hits = [];
  var hitPos = -1;
  var curMarks = [];
  var flashTimer = 0;

  (function buildIndex() {
    if (!searchInput) return;
    var nodes = $all(INDEX_SEL).filter(function (el) {
      if (el.closest('.cover')) return false;    // 封面装饰文本不入索引
      if (el.closest('.ch-nav')) return false;   // JS 生成的导航不入索引
      if (el.classList.contains('page-tag')) return false;
      // .box 整体入索引，其内部 p 去重，避免同一处命中两次
      if (el.tagName === 'P' && el.closest('.box') && el.closest('.box') !== el) return false;
      return (el.textContent || '').trim().length > 1;
    });
    var map = new Map();
    var i = 0;

    function step() {
      var t0 = performance.now();
      while (i < nodes.length && performance.now() - t0 < 12) { // 每片 ≤12ms，不卡交互
        var el = nodes[i++];
        var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!text) continue;
        var chEl = el.closest('.chapter');
        var gid = chEl ? chEl.id : (el.closest('#front') ? 'front' : 'book');
        var g = map.get(gid);
        if (!g) { g = { id: gid, entries: [] }; map.set(gid, g); }
        g.entries.push({ el: el, text: text.toLowerCase() });
      }
      if (i < nodes.length) {
        setTimeout(step, 0);
      } else {
        map.forEach(function (g) { groups.push(g); });
        indexReady = true;
        if (pendingQuery !== null) {
          var q = pendingQuery;
          pendingQuery = null;
          runSearch(q);
        }
      }
    }
    var kick = function () { setTimeout(step, 150); };
    if ('requestIdleCallback' in window) window.requestIdleCallback(kick, { timeout: 1000 });
    else setTimeout(kick, 250);
  })();

  function clearMarks() {
    curMarks.forEach(function (m) {
      var p = m.parentNode;
      if (!p) return;
      p.replaceChild(doc.createTextNode(m.textContent), m);
      p.normalize();
    });
    curMarks = [];
  }

  function resetResults() {
    hits = [];
    hitPos = -1;
    clearMarks();
    if (searchCount) searchCount.textContent = '';
    if (searchBox) searchBox.classList.remove('has-q');
  }

  function runSearch(raw) {
    if (!searchInput) return;
    var q = (raw || '').trim();
    if (q.length < 2) { resetResults(); return; }
    if (!indexReady) {
      pendingQuery = q;
      if (searchCount) searchCount.textContent = '索引中…';
      return;
    }
    var lq = q.toLowerCase();
    var res = [];
    for (var gi = 0; gi < groups.length; gi++) {
      var es = groups[gi].entries;
      for (var ei = 0; ei < es.length; ei++) {
        if (es[ei].text.indexOf(lq) !== -1) res.push(es[ei]);
      }
    }
    clearMarks();
    hits = res;
    hitPos = -1;
    if (searchBox) searchBox.classList.add('has-q');
    if (!res.length) {
      if (searchCount) searchCount.textContent = '无结果';
      return;
    }
    if (searchCount) searchCount.textContent = res.length + ' 处';
  }

  /* 在命中元素内包裹 mark.hl-current（每元素上限 60 处，防极端长段落卡顿） */
  function highlightIn(el, q) {
    var lq = q.toLowerCase();
    var walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || n.nodeValue.toLowerCase().indexOf(lq) === -1) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var targets = [];
    while (walker.nextNode()) targets.push(walker.currentNode);
    var made = [];
    for (var ti = 0; ti < targets.length && made.length < 60; ti++) {
      var node = targets[ti];
      var text = node.nodeValue;
      var tl = text.toLowerCase();
      var frag = doc.createDocumentFragment();
      var last = 0;
      var idx = tl.indexOf(lq);
      while (idx !== -1 && made.length < 60) {
        if (idx > last) frag.appendChild(doc.createTextNode(text.slice(last, idx)));
        var mk = doc.createElement('mark');
        mk.className = 'hl-current';
        mk.textContent = text.slice(idx, idx + q.length);
        frag.appendChild(mk);
        made.push(mk);
        last = idx + q.length;
        idx = tl.indexOf(lq, last);
      }
      if (idx === -1 && last < text.length) frag.appendChild(doc.createTextNode(text.slice(last)));
      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    }
    return made;
  }

  function gotoHit(pos) {
    if (!hits.length || !searchInput) return;
    if (pos < 0) pos = hits.length - 1;
    if (pos >= hits.length) pos = 0;
    hitPos = pos;
    clearMarks();
    var entry = hits[hitPos];
    curMarks = highlightIn(entry.el, searchInput.value.trim());
    if (searchCount) searchCount.textContent = (hitPos + 1) + ' / ' + hits.length;

    var page = entry.el.closest('.page') || entry.el;
    page.classList.remove('hit-flash');
    void page.offsetWidth; // 重触发动画
    page.classList.add('hit-flash');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { page.classList.remove('hit-flash'); }, 1800);

    entry.el.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
  }

  function stepHit(dir) { if (hits.length) gotoHit(hitPos + dir); }

  function closeSearch() {
    if (!searchInput) return;
    searchInput.value = '';
    pendingQuery = null;
    resetResults();
  }

  if (searchInput) {
    var debounce = 0;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () { runSearch(searchInput.value); }, 160);
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        stepHit(e.shiftKey ? -1 : 1);
      } else if (e.key === 'Escape') {
        closeSearch();
        searchInput.blur();
      }
    });
  }
  if (btnNext) btnNext.addEventListener('click', function () { stepHit(1); });
  if (btnPrev) btnPrev.addEventListener('click', function () { stepHit(-1); });
  if (btnClose) btnClose.addEventListener('click', closeSearch);

  /* =====================================================================
   * 6) Lightbox：.fig / .tblfig / .fx 图片放大（滚轮缩放 + 拖动平移）
   *    复用 assemble 输出的 #lightbox / #lb-img / #lb-close，缺失则自建
   * =================================================================== */
  var lb = $('#lightbox');
  var lbImg = $('#lb-img');
  var lbCloseBtn = $('#lb-close');
  var lbCap = null;

  if (!lb) {
    lb = doc.createElement('div');
    lb.id = 'lightbox';
    lbImg = doc.createElement('img');
    lbImg.id = 'lb-img';
    lbImg.alt = '';
    lbCloseBtn = doc.createElement('button');
    lbCloseBtn.id = 'lb-close';
    lbCloseBtn.type = 'button';
    lbCloseBtn.textContent = '✕';
    lb.appendChild(lbImg);
    lb.appendChild(lbCloseBtn);
    body.appendChild(lb);
  } else if (!lbImg) {
    lbImg = doc.createElement('img');
    lbImg.id = 'lb-img';
    lbImg.alt = '';
    lb.insertBefore(lbImg, lb.firstChild);
  }
  if (!lbCloseBtn) {
    lbCloseBtn = doc.createElement('button');
    lbCloseBtn.id = 'lb-close';
    lbCloseBtn.type = 'button';
    lbCloseBtn.textContent = '✕';
    lb.appendChild(lbCloseBtn);
  }

  lbCap = doc.createElement('div');
  lbCap.className = 'lb-cap';
  var lbHint = doc.createElement('div');
  lbHint.className = 'lb-hint';
  lbHint.textContent = '滚轮缩放 · 拖动平移 · 双击复位 · Esc / 点击空白关闭';
  lb.appendChild(lbCap);
  lb.appendChild(lbHint);
  lbCloseBtn.type = 'button';
  lbCloseBtn.title = '关闭（Esc）';

  var lbScale = 1, lbTx = 0, lbTy = 0;
  function lbApply() {
    lbImg.style.transform = 'translate(' + lbTx + 'px,' + lbTy + 'px) scale(' + lbScale + ')';
  }
  function openLightbox(img) {
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    var fig = img.closest('figure');
    var cap = fig ? fig.querySelector('figcaption') : null;
    var txt = cap ? cap.textContent.replace(/\s+/g, ' ').trim() : '';
    lbCap.textContent = txt;
    lbCap.style.display = txt ? '' : 'none';
    lbScale = 1; lbTx = 0; lbTy = 0;
    lbApply();
    lb.classList.add('open');
    root.classList.add('lb-lock');
  }
  function closeLightbox() {
    lb.classList.remove('open');
    root.classList.remove('lb-lock');
    setTimeout(function () { lbImg.removeAttribute('src'); }, 220); // 淡出后再卸载
  }

  var lbLastDrag = 0; // 拖动距离累计，用于区分「拖动松手」与「点击空白」

  doc.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var img = e.target.closest('.fig img, .tblfig img, .fx img');
    if (img) { openLightbox(img); return; }
    if (e.target.closest('#lb-close')) { closeLightbox(); return; }
    if (lb.classList.contains('open') && e.target === lb && lbLastDrag < 8) closeLightbox();
  });

  lb.addEventListener('wheel', function (e) {
    e.preventDefault();
    var f = e.deltaY < 0 ? 1.18 : 1 / 1.18;
    lbScale = Math.min(8, Math.max(0.4, lbScale * f));
    lbApply();
  }, { passive: false });

  (function lbDrag() {
    var dragging = false, sx = 0, sy = 0, bx = 0, by = 0;
    lb.addEventListener('pointerdown', function (e) {
      lbLastDrag = 0; // 无论起点在哪都先清零，保证后续点击空白可正常关闭
      if (e.target !== lbImg) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      bx = lbTx; by = lbTy;
      lb.classList.add('grabbing');
      if (lb.setPointerCapture) {
        try { lb.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
      e.preventDefault();
    });
    lb.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      lbLastDrag = Math.max(lbLastDrag, Math.abs(dx) + Math.abs(dy));
      lbTx = bx + dx;
      lbTy = by + dy;
      lbApply();
    });
    function endDrag() {
      dragging = false;
      lb.classList.remove('grabbing');
    }
    lb.addEventListener('pointerup', endDrag);
    lb.addEventListener('pointercancel', endDrag);
    lb.addEventListener('dblclick', function (e) {
      if (e.target !== lbImg) return;
      if (lbScale > 1.3) { lbScale = 1; lbTx = 0; lbTy = 0; }
      else { lbScale = 2.5; }
      lbApply();
    });
  })();

  /* =====================================================================
   * 7) 阅读进度 #progress-pill + 返回顶部 #back-top
   * =================================================================== */
  var pill = $('#progress-pill');
  var backtop = $('#back-top');
  if (!backtop) {
    backtop = doc.createElement('button');
    backtop.id = 'back-top';
    backtop.type = 'button';
    body.appendChild(backtop);
  }
  backtop.title = '返回顶部';
  backtop.setAttribute('aria-label', '返回顶部');
  backtop.textContent = '↑';

  function updateProgress() {
    var max = root.scrollHeight - window.innerHeight;
    var y = window.pageYOffset || root.scrollTop || 0;
    var pct = max > 2 ? Math.min(100, Math.max(0, Math.round(y / max * 100))) : 0;
    if (pill) pill.textContent = pct + '%';
    backtop.classList.toggle('show', y > 600);
  }
  var rafTick = false;
  window.addEventListener('scroll', function () {
    if (rafTick) return;
    rafTick = true;
    window.requestAnimationFrame(function () {
      rafTick = false;
      updateProgress();
      updateSpy();
    });
  }, { passive: true });
  window.addEventListener('resize', function () {
    updateProgress();
    if (!isMobile()) closeDrawer();
  });
  function toTop() { window.scrollTo({ top: 0, behavior: scrollBehavior() }); }
  if (pill) {
    pill.title = '阅读进度（点击回顶部）';
    pill.addEventListener('click', toTop);
  }
  backtop.addEventListener('click', toTop);
  updateProgress();

  /* =====================================================================
   * 8) 标题锚点：hover 显示 #（有 id 的 h2-h5）
   * =================================================================== */
  $all('#main .page h2[id], #main .page h3[id], #main .page h4[id], #main .page h5[id], #main .chapter h2[id], #main .chapter h3[id], #main .chapter h4[id], #main .chapter h5[id]')
    .forEach(function (h) {
      var a = doc.createElement('a');
      a.className = 'h-anchor';
      a.href = '#' + h.id;
      a.textContent = '#';
      a.title = '本文锚点';
      h.appendChild(a);
    });

  /* =====================================================================
   * 9) 全局快捷键：Esc 逐层关闭（Lightbox→搜索→抽屉），/ 聚焦搜索
   * =================================================================== */
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lb.classList.contains('open')) closeLightbox();
      else if (searchInput && searchInput.value) closeSearch();
      else if (body.classList.contains('sb-open')) closeDrawer();
    } else if (e.key === '/') {
      var t = e.target;
      var typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (!typing && searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    }
  });
})();


/* —— 站点部署补丁：懒加载图片按宽高属性预留纵横比，消除长页跳转布局漂移 —— */
(function () {
  var imgs = document.querySelectorAll('img[width][height]');
  for (var i = 0; i < imgs.length; i++) {
    var el = imgs[i];
    var w = parseInt(el.getAttribute('width'), 10);
    var h = parseInt(el.getAttribute('height'), 10);
    if (w > 0 && h > 0 && !el.style.aspectRatio) {
      el.style.aspectRatio = w + ' / ' + h;
    }
  }
  /* 公式图（.fx，渲染宽恒为 min(560px,100%) 上限或自然宽）：内联钉住属性宽，
   * 未加载时即得与最终渲染一致的占位框（max-width 仍兜底响应式） */
  var fxImgs = document.querySelectorAll('figure.fx img[width]');
  for (var j = 0; j < fxImgs.length; j++) {
    var fxi = fxImgs[j];
    var fw = parseInt(fxi.getAttribute('width'), 10);
    if (fw > 0 && !fxi.style.width) {
      fxi.style.width = fw + 'px';
    }
  }
})();

/* —— 站点部署补丁：目录/文内锚点瞬时定位 + 有界校正。
 * 数十万像素的长页平滑滚动耗时数秒，途中懒加载图片涨高会使落点偏离目标；
 * 改为瞬时跳转到 scroll-padding-top 位，并在图片陆续加载时自动微调，
 * 用户一旦滚轮/触摸/按键即停止校正。 —— */
(function () {
  function topOffset() {
    var v = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    return isNaN(v) ? 72 : v;
  }
  function locate(el) {
    var root = document.documentElement;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    var y = el.getBoundingClientRect().top + window.pageYOffset - topOffset();
    var max = root.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.max(0, Math.min(y, max)));
    root.style.scrollBehavior = prev;
  }
  function jumpTo(el) {
    var stopped = false, tries = 0;
    function stop() { stopped = true; }
    ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
      addEventListener(ev, stop, { passive: true, once: true });
    });
    locate(el);
    (function step() {
      if (stopped || tries >= 10) return;
      tries++;
      if (Math.abs(el.getBoundingClientRect().top - topOffset()) > 2) locate(el);
      setTimeout(step, tries < 4 ? 120 : 300);
    })();
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    jumpTo(el);
    if (history.pushState) history.pushState(null, '', '#' + id);
  });
})();

