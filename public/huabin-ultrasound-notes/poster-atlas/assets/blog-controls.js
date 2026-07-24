(function () {
  "use strict";
  var deck = document.querySelector(".deck");
  var slides = Array.from(document.querySelectorAll(".slide"));
  if (!deck || !slides.length) return;

  var controls = document.createElement("nav");
  controls.className = "atlas-blog-controls";
  controls.setAttribute("aria-label", "海报阅读控制");
  controls.setAttribute("data-html2canvas-ignore", "true");
  controls.innerHTML =
    '<a href="../index.html" aria-label="返回华斌笔记合集">返回合集</a>' +
    '<button type="button" data-atlas="prev" aria-label="上一张海报">‹</button>' +
    '<button type="button" data-atlas="toc">目录</button>' +
    '<button type="button" data-atlas="next" aria-label="下一张海报">›</button>' +
    '<span class="atlas-page" aria-live="polite">1/' + slides.length + '</span>';
  document.body.appendChild(controls);

  var prev = controls.querySelector('[data-atlas="prev"]');
  var next = controls.querySelector('[data-atlas="next"]');
  var page = controls.querySelector(".atlas-page");

  function currentIndex() {
    var index = slides.findIndex(function (slide) { return slide.classList.contains("is-active"); });
    if (index >= 0) return index;
    var match = new RegExp("^#/(\\d+)").exec(location.hash || "");
    return match ? Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1)) : 0;
  }
  function update() {
    var index = currentIndex();
    page.textContent = (index + 1) + "/" + slides.length;
    prev.disabled = index <= 0;
    next.disabled = index >= slides.length - 1;
  }
  function go(index) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    location.hash = "#/" + (index + 1);
  }

  controls.addEventListener("click", function (event) {
    var action = event.target.getAttribute("data-atlas");
    if (action === "prev") go(currentIndex() - 1);
    if (action === "next") go(currentIndex() + 1);
    if (action === "toc") go(0);
  });

  var observer = new MutationObserver(update);
  slides.forEach(function (slide) { observer.observe(slide, { attributes:true, attributeFilter:["class"] }); });
  window.addEventListener("hashchange", update);

  var startX = 0;
  var startY = 0;
  document.addEventListener("touchstart", function (event) {
    if (event.target.closest(".zoom-frame,.atlas-blog-controls,.export-tools,select,input")) return;
    var touch = event.changedTouches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  }, { passive:true });
  document.addEventListener("touchend", function (event) {
    if (!startX && !startY) return;
    var touch = event.changedTouches[0];
    var dx = touch.clientX - startX;
    var dy = touch.clientY - startY;
    startX = startY = 0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.25) go(currentIndex() + (dx < 0 ? 1 : -1));
  }, { passive:true });

  function fitDeck() {
    var mobile = innerWidth <= 640;
    var availableWidth = Math.max(280, innerWidth - 12);
    var availableHeight = Math.max(360, innerHeight - (mobile ? 88 : 16));
    var scale = Math.min(1, availableWidth / 810, availableHeight / 1080);
    deck.style.transform = "scale(" + scale + ")";
    deck.style.transformOrigin = "center center";
  }
  window.addEventListener("resize", fitDeck, { passive:true });
  fitDeck();
  update();
})();
