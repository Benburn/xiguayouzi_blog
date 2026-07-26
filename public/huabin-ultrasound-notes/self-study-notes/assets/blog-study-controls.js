(function () {
  "use strict";

  function sendKey(key) {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: key, bubbles: true }));
  }

  function initStudyControls() {
    var slides = Array.from(document.querySelectorAll(".deck > .slide"));
    if (!slides.length || document.querySelector(".study-toolbar")) return;

    var toolbar = document.createElement("nav");
    toolbar.className = "study-toolbar";
    toolbar.setAttribute("aria-label", "自学笔记工具栏");
    toolbar.innerHTML =
      '<a href="../index.html" aria-label="返回华斌笔记合集">← 合集</a>' +
      '<div class="study-toolbar-title"><strong>自学笔记</strong><span>肺部超声 · 诊断要求与特殊征象</span></div>' +
      '<button type="button" data-study-key="o" aria-label="打开全部页面目录">目录</button>' +
      '<button type="button" class="study-action-theme" data-study-key="t" aria-label="切换页面主题">主题</button>' +
      '<button type="button" class="study-action-fullscreen" data-study-key="f" aria-label="进入或退出全屏">全屏</button>';

    var mobileNav = document.createElement("nav");
    mobileNav.className = "study-mobile-nav";
    mobileNav.setAttribute("aria-label", "自学笔记翻页");
    mobileNav.innerHTML =
      '<button type="button" data-study-key="ArrowLeft" aria-label="上一页">←</button>' +
      '<span class="study-page-status" aria-live="polite"><strong>1</strong> / ' + slides.length + "</span>" +
      '<button type="button" data-study-key="ArrowRight" aria-label="下一页">→</button>';

    document.body.appendChild(toolbar);
    document.body.appendChild(mobileNav);

    document.querySelectorAll("[data-study-key]").forEach(function (button) {
      button.addEventListener("click", function () {
        sendKey(button.getAttribute("data-study-key"));
        requestAnimationFrame(updateStatus);
      });
    });

    var statusCurrent = mobileNav.querySelector(".study-page-status strong");
    var prev = mobileNav.querySelector('[data-study-key="ArrowLeft"]');
    var next = mobileNav.querySelector('[data-study-key="ArrowRight"]');

    function currentIndex() {
      var match = /^#\/(\d+)/.exec(location.hash || "");
      if (match) return Math.min(slides.length - 1, Math.max(0, Number(match[1]) - 1));
      var active = slides.findIndex(function (slide) { return slide.classList.contains("active"); });
      return active < 0 ? 0 : active;
    }

    function updateStatus() {
      var index = currentIndex();
      statusCurrent.textContent = String(index + 1);
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    }

    window.addEventListener("hashchange", updateStatus);
    var slideObserver = new MutationObserver(function () {
      requestAnimationFrame(updateStatus);
    });
    slides.forEach(function (slide) {
      slideObserver.observe(slide, { attributes: true, attributeFilter: ["class"] });
    });
    updateStatus();

    var touchStart = null;
    var deck = document.querySelector(".deck");
    deck.addEventListener("touchstart", function (event) {
      if (event.touches.length !== 1) return;
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });
    deck.addEventListener("touchend", function (event) {
      if (!touchStart || event.changedTouches.length !== 1) return;
      var dx = event.changedTouches[0].clientX - touchStart.x;
      var dy = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) < 54 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
      sendKey(dx < 0 ? "ArrowRight" : "ArrowLeft");
      requestAnimationFrame(updateStatus);
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStudyControls);
  } else {
    initStudyControls();
  }
})();
