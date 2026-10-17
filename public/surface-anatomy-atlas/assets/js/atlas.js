/* ==========================================================================
   《体表解剖图谱》彩图版 — 阅读层交互
   功能：目录抽屉 / 滚动联动 / 全文搜索（高亮·上一条·下一条）/ 图片灯箱
        （滚轮缩放·拖拽平移）/ 暗色模式 / 阅读进度
   无依赖，纯原生，可 file:// 离线打开。
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var THEME_KEY = 'sat-theme';
  var OPEN_KEY  = 'sat-open-chapters';

  /* ------------------------------------------------------------ theme */
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!saved) {
      saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark' : 'light';
    }
    setTheme(saved);

    $$('[data-action="theme"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      });
    });
  }

  function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
    $$('[data-action="theme"]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
      btn.title = mode === 'dark' ? '切换到浅色' : '切换到深色';
    });
    var m = $('meta[name="theme-color"]');
    if (m) m.setAttribute('content', mode === 'dark' ? '#10151a' : '#faf8f3');
  }

  /* ------------------------------------------------------------ sidebar drawer */
  function initDrawer() {
    var sidebar = $('.sidebar');
    var scrim = $('.scrim');
    if (!sidebar) return;

    function open(v) {
      sidebar.classList.toggle('is-open', v);
      if (scrim) scrim.classList.toggle('is-open', v);
      $$('[data-action="menu"]').forEach(function (b) { b.setAttribute('aria-expanded', v ? 'true' : 'false'); });
    }
    $$('[data-action="menu"]').forEach(function (b) {
      b.addEventListener('click', function () { open(!sidebar.classList.contains('is-open')); });
    });
    if (scrim) scrim.addEventListener('click', function () { open(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.innerWidth <= 1080) open(false);
    });
  }

  /* ------------------------------------------------------------ chapter folding */
  function initFolding() {
    var openSet = {};
    try { openSet = JSON.parse(localStorage.getItem(OPEN_KEY) || '{}') || {}; } catch (e) {}

    $$('.nav__chapter').forEach(function (li) {
      var id = li.getAttribute('data-chapter');
      var row = $(':scope > .nav__row', li);
      if (!row) return;
      if (openSet[id]) li.classList.add('is-open');
      row.addEventListener('click', function (e) {
        // 首次点击章标题：既展开也跳转；已展开时再点折叠
        if (e.target.closest('a')) return;
        li.classList.toggle('is-open');
        openSet[id] = li.classList.contains('is-open');
        try { localStorage.setItem(OPEN_KEY, JSON.stringify(openSet)); } catch (err) {}
      });
    });

    $$('.nav__section').forEach(function (li) {
      var row = $(':scope > .nav__row', li);
      if (!row) return;
      li.classList.add('is-open');
      row.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        li.classList.toggle('is-open');
      });
    });
  }

  /* ------------------------------------------------------------ scrollspy */
  function initSpy() {
    var targets = $$('#content [data-nav-id]');
    if (!targets.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    targets.forEach(function (el) { byId[el.id] = el; });

    var visible = {};
    var current = null;
    var navRows = {};
    $$('.nav__row').forEach(function (r) {
      // the row itself is a container; the anchor carrying the fragment is
      // inside it (the row also holds the number and the caret)
      var a = r.querySelector('a[href^="#"]');
      var href = a ? a.getAttribute('href') : r.getAttribute('href');
      if (href && href.charAt(0) === '#') navRows[href.slice(1)] = r;
    });

    function activate(id) {
      if (id === current) return;
      current = id;
      $$('.nav__row.is-active').forEach(function (r) { r.classList.remove('is-active'); });
      var row = navRows[id];
      if (!row) return;
      row.classList.add('is-active');

      // 展开祖先章/节，并让活动项进入视野
      var li = row.closest('.nav__chapter');
      if (li && !li.classList.contains('is-open')) li.classList.add('is-open');
      var sec = row.closest('.nav__section');
      if (sec && !sec.classList.contains('is-open')) sec.classList.add('is-open');

      var box = $('.sidebar');
      if (box && window.innerWidth > 1080) {
        var rb = row.getBoundingClientRect(), bb = box.getBoundingClientRect();
        if (rb.top < bb.top + 8 || rb.bottom > bb.bottom - 8) {
          box.scrollTop += rb.top - bb.top - box.clientHeight * 0.35;
        }
      }
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting ? en.boundingClientRect.top : null; });
      var best = null;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] === null) return;
        if (best === null || visible[id] < visible[best]) best = id;
      });
      if (best) activate(best);
    }, { rootMargin: '-72px 0px -68% 0px', threshold: [0, 1] });

    targets.forEach(function (t) { io.observe(t); });

    // 兜底：滚动结束时按最近的上方标题校正
    var t = null;
    window.addEventListener('scroll', function () {
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        var y = 84, pick = null;
        for (var i = 0; i < targets.length; i++) {
          var top = targets[i].getBoundingClientRect().top;
          if (top <= y) pick = targets[i].id; else break;
        }
        if (pick) activate(pick);
      }, 120);
    }, { passive: true });
  }

  /* ------------------------------------------------------------ search */
  function initSearch() {
    var input = $('.search__input');
    var countEl = $('.search__count');
    var prevBtn = $('[data-search="prev"]');
    var nextBtn = $('[data-search="next"]');
    var root = $('#content');
    if (!input || !root) return;

    var hits = [];
    var idx = -1;
    var lastQuery = '';

    function unwrap() {
      $$('mark.hit', root).forEach(function (m) {
        var parent = m.parentNode;
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
      });
      hits = []; idx = -1;
    }

    function textNodes() {
      var out = [];
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          var p = n.parentNode;
          if (!p) return NodeFilter.FILTER_REJECT;
          var tag = p.nodeName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
          if (p.closest && p.closest('.page-marker, .chapter__ghost, .lightbox')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var n;
      while ((n = walker.nextNode())) out.push(n);
      return out;
    }

    function run(q) {
      unwrap();
      countEl.textContent = '';
      if (!q) { lastQuery = ''; return; }

      var needle = q.toLowerCase();
      var nodes = textNodes();
      var collected = [];

      nodes.forEach(function (node) {
        var hay = node.nodeValue.toLowerCase();
        var from = 0, at;
        var pieces = [];
        var local = [];
        while ((at = hay.indexOf(needle, from)) !== -1) {
          pieces.push(node.nodeValue.slice(from, at));
          local.push({ at: at, text: node.nodeValue.substr(at, q.length) });
          from = at + q.length;
        }
        if (!local.length) return;
        pieces.push(node.nodeValue.slice(from));

        var frag = document.createDocumentFragment();
        pieces.forEach(function (txt, i) {
          if (txt) frag.appendChild(document.createTextNode(txt));
          if (i < local.length) {
            var m = document.createElement('mark');
            m.className = 'hit';
            m.textContent = local[i].text;
            frag.appendChild(m);
            collected.push(m);
          }
        });
        node.parentNode.replaceChild(frag, node);
      });

      hits = collected;
      countEl.textContent = hits.length ? ('1 / ' + hits.length) : '无结果';
      if (!hits.length) { idx = -1; return; }
      idx = 0;
      focusHit(true);
    }

    function focusHit(scroll) {
      hits.forEach(function (h, i) { h.classList.toggle('is-current', i === idx); });
      if (idx < 0 || !hits[idx]) return;
      countEl.textContent = (idx + 1) + ' / ' + hits.length;
      if (scroll !== false) {
        var r = hits[idx].getBoundingClientRect();
        if (r.top < 76 || r.bottom > window.innerHeight - 40) {
          window.scrollBy({ top: r.top - window.innerHeight * 0.32, behavior: 'smooth' });
        }
      }
    }

    function step(d) {
      if (!hits.length) return;
      idx = (idx + d + hits.length) % hits.length;
      focusHit(true);
    }

    var deb = null;
    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (deb) clearTimeout(deb);
      deb = setTimeout(function () { lastQuery = q; run(q); }, 220);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
      if (e.key === 'Escape') { input.value = ''; run(''); input.blur(); }
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

    // Ctrl/Cmd+F 聚焦本站搜索
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault(); input.focus(); input.select();
      }
    });
  }

  /* ------------------------------------------------------------ lightbox */
  function initLightbox() {
    var box = $('.lightbox');
    if (!box) return;
    var stage = $('.lightbox__stage', box);
    var img = $('.lightbox__img', box);
    var cap = $('.lightbox__caption', box);
    var zoomEl = $('.lightbox__zoom', box);
    var prevBtn = $('[data-lb="prev"]', box);
    var nextBtn = $('[data-lb="next"]', box);
    var zin = $('[data-lb="in"]', box);
    var zout = $('[data-lb="out"]', box);
    var fit = $('[data-lb="fit"]', box);
    var closeBtn = $('.lightbox__close', box);

    var items = $$('#content figure.image-block > img');
    var i = -1, scale = 1, tx = 0, ty = 0, baseW = 0, baseH = 0, natW = 0, natH = 0;
    var dragging = false, moved = false, sx = 0, sy = 0, stx = 0, sty = 0;

    // Keep the photo inside the stage: once it is larger than the viewport it may
    // pan but must stay covering it (no empty gaps); while it is smaller it stays
    // wholly visible. Without this a long drag throws the image off screen and
    // the reader has no way back except Esc.
    function clampAxis(t, size, view) {
      if (size <= view) return Math.max(0, Math.min(view - size, t));
      return Math.min(0, Math.max(view - size, t));
    }

    function apply() {
      if (baseW && baseH) {
        tx = clampAxis(tx, baseW * scale, stage.clientWidth);
        ty = clampAxis(ty, baseH * scale, stage.clientHeight);
      }
      img.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0) scale(' + scale + ')';
      zoomEl.textContent = Math.round(scale * 100) + '%';
    }

    function fitToView() {
      var pad = 34;
      var vw = stage.clientWidth - pad * 2;
      var vh = stage.clientHeight - pad * 2;
      var k = Math.min(vw / natW, vh / natH, 1);
      if (k <= 0 || !isFinite(k)) k = 1;
      baseW = natW * k; baseH = natH * k;
      img.style.width = baseW + 'px';
      img.style.height = 'auto';
      scale = 1;
      tx = (stage.clientWidth - baseW) / 2;
      ty = (stage.clientHeight - baseH) / 2;
      apply();
    }

    function zoomAt(cx, cy, factor) {
      var ns = Math.max(0.4, Math.min(8, scale * factor));
      if (ns === scale) return;
      var k = ns / scale;
      tx = cx - (cx - tx) * k;
      ty = cy - (cy - ty) * k;
      scale = ns;
      apply();
    }

    function show(n) {
      if (!items.length) return;
      i = (n + items.length) % items.length;
      var src = items[i];
      img.src = src.currentSrc || src.src;
      img.alt = src.alt || '';

      var fig = src.closest('figure');
      var fc = fig ? $('figcaption', fig) : null;
      var tag = fig ? fig.getAttribute('data-figtag') : '';
      // the letter chip lives inside the figcaption, so read the caption without
      // it -- otherwise the panel letter is printed twice in the lightbox
      var text = '';
      if (fc) {
        var clone = fc.cloneNode(true);
        var chip = clone.querySelector('.figtag');
        if (chip) chip.remove();
        text = clone.textContent.trim();
      }
      // A whole-plate panel usually has no caption of its own: the name lives on
      // the plate group ("喙肱肌"). Fall back to it rather than echoing the
      // placeholder alt text, which printed "图版" under the counter.
      if (!text && fig) {
        var grp = fig.closest('.plate');
        var gc = grp ? $('.plate__caption', grp) : null;
        if (gc) text = gc.textContent.replace(/\s+/g, ' ').trim();
      }
      if (!text && src.alt && !/^图版(\s*[A-H])?$/.test(src.alt.trim())) text = src.alt.trim();
      cap.innerHTML = '';
      if (tag || text) {
        var b = document.createElement('b');
        b.textContent = (tag ? tag + '　' : '') + '图版 ' + (i + 1) + ' / ' + items.length;
        cap.appendChild(b);
        cap.appendChild(document.createTextNode(text));
      }

      function ready() {
        natW = img.naturalWidth || src.naturalWidth || baseW || 800;
        natH = img.naturalHeight || src.naturalHeight || baseH || 600;
        fitToView();
      }
      if (img.complete && img.naturalWidth) ready();
      else img.onload = ready;

      if (prevBtn) prevBtn.disabled = items.length < 2;
      if (nextBtn) nextBtn.disabled = items.length < 2;
    }

    function open(src) {
      var n = items.indexOf(src);
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      show(n < 0 ? 0 : n);
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      if (i >= 0 && items[i]) items[i].focus();
    }

    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.nodeName === 'IMG' && t.closest && t.closest('#content figure.image-block')) {
        e.preventDefault();
        open(t);
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    // Clicking the backdrop closes, but a pan must never close: the stage covers
    // the whole screen, so releasing a drag used to land on it as a click and
    // shut the viewer the moment the reader finished moving the photo.
    box.addEventListener('click', function (e) {
      if (moved) { moved = false; return; }
      if (e.target === stage || e.target === box) close();
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { show(i - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(i + 1); });
    if (zin) zin.addEventListener('click', function () { zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, 1.3); });
    if (zout) zout.addEventListener('click', function () { zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, 1 / 1.3); });
    if (fit) fit.addEventListener('click', fitToView);

    stage.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });

    stage.addEventListener('pointerdown', function (e) {
      dragging = true; moved = false;
      sx = e.clientX; sy = e.clientY; stx = tx; sty = ty;
      stage.classList.add('is-dragging');
      if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 4) moved = true;
      tx = stx + (e.clientX - sx);
      ty = sty + (e.clientY - sy);
      apply();
    });
    function endDrag() { dragging = false; stage.classList.remove('is-dragging'); }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', endDrag);

    stage.addEventListener('dblclick', function (e) {
      var r = stage.getBoundingClientRect();
      if (scale > 1.05) fitToView();
      else zoomAt(e.clientX - r.left, e.clientY - r.top, 2.2);
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(i + 1);
      else if (e.key === 'ArrowLeft') show(i - 1);
      else if (e.key === '+' || e.key === '=') zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, 1.25);
      else if (e.key === '-') zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, 1 / 1.25);
      else if (e.key === '0') fitToView();
    });

    window.addEventListener('resize', function () {
      if (box.classList.contains('is-open')) fitToView();
    });
  }

  /* ------------------------------------------------------------ progress + totop */
  function initScrollUI() {
    var bar = $('.progress');
    var top = $('.totop');
    function onScroll() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) : 0;
      if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
      if (top) top.classList.toggle('is-shown', window.scrollY > 700);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ------------------------------------------------------------ placeholder */
  /* The full hint ("检索解剖名称、体表定位…") cannot fit a 320px phone: the field
     is ~96px wide and the text was cut to "检索解剖名". Swap in a short hint. */
  function initPlaceholder() {
    var input = $('.search__input');
    if (!input || !window.matchMedia) return;
    var full = input.getAttribute('placeholder') || '';
    var mq = window.matchMedia('(max-width: 420px)');
    function apply() { input.setAttribute('placeholder', mq.matches ? '检索…' : full); }
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else if (mq.addListener) mq.addListener(apply);
  }

  /* ------------------------------------------------------------ boot */
  function boot() {
    initTheme();
    initDrawer();
    initFolding();
    initSpy();
    initSearch();
    initLightbox();
    initScrollUI();
    initPlaceholder();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
