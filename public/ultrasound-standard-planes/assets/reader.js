(function () {
  "use strict";

  function normalize(value) {
    return String(value || "").toLocaleLowerCase("zh-CN").replace(/\s+/g, "");
  }

  function initCollection() {
    var input = document.getElementById("chapter-search");
    if (!input) return;
    var cards = Array.from(document.querySelectorAll(".chapter-card"));
    var count = document.getElementById("search-count");

    function filterCards() {
      var query = normalize(input.value);
      var visible = 0;
      cards.forEach(function (card) {
        var matched = !query || normalize(card.getAttribute("data-search")).includes(query);
        card.hidden = !matched;
        if (matched) visible += 1;
      });
      if (count) count.textContent = "显示 " + visible + " / " + cards.length + " 章";
    }

    input.addEventListener("input", filterCards);
    filterCards();
  }

  function initReader() {
    var body = document.body;
    var menu = document.getElementById("reader-menu");
    var scrim = document.getElementById("sidebar-scrim");
    var tocSearch = document.getElementById("toc-search");
    var tocLinks = Array.from(document.querySelectorAll(".toc-link"));
    var chapterSelect = document.getElementById("chapter-select");
    var fontValue = document.getElementById("font-value");
    var root = document.documentElement;
    var backToTop = document.getElementById("back-to-top");
    var progress = document.querySelector(".reading-progress span");
    var lightbox = document.getElementById("lightbox");
    var lightboxImage = lightbox && lightbox.querySelector("img");
    var fontSize = 18;

    try {
      fontSize = Math.min(22, Math.max(15, Number(localStorage.getItem("ultrasound-plane-font")) || 18));
    } catch {}

    function setFont(value) {
      fontSize = Math.min(22, Math.max(15, value));
      root.style.setProperty("--reader-size", fontSize + "px");
      if (fontValue) fontValue.textContent = fontSize + "px";
      try { localStorage.setItem("ultrasound-plane-font", String(fontSize)); } catch {}
    }

    function closeMenu() {
      body.classList.remove("nav-open");
      if (menu) menu.setAttribute("aria-expanded", "false");
    }

    if (menu) {
      menu.addEventListener("click", function () {
        var open = !body.classList.contains("nav-open");
        body.classList.toggle("nav-open", open);
        menu.setAttribute("aria-expanded", String(open));
      });
    }
    if (scrim) scrim.addEventListener("click", closeMenu);

    if (tocSearch) {
      tocSearch.addEventListener("input", function () {
        var query = normalize(tocSearch.value);
        tocLinks.forEach(function (link) {
          link.hidden = Boolean(query) && !normalize(link.textContent).includes(query);
        });
      });
    }

    tocLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    if (chapterSelect) {
      chapterSelect.addEventListener("change", function () {
        if (chapterSelect.value) location.href = chapterSelect.value;
      });
    }

    document.querySelectorAll("[data-font]").forEach(function (button) {
      button.addEventListener("click", function () {
        setFont(fontSize + (button.getAttribute("data-font") === "up" ? 1 : -1));
      });
    });
    setFont(fontSize);

    var headingById = new Map(tocLinks.map(function (link) {
      var id = decodeURIComponent((link.getAttribute("href") || "").slice(1));
      return [id, link];
    }));
    var headings = Array.from(document.querySelectorAll(".reader-article h2[id], .reader-article h3[id], .reader-article h4[id]"));
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (entry) { return entry.isIntersecting; }).sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
        if (!visible.length) return;
        tocLinks.forEach(function (link) { link.classList.remove("active"); });
        var active = headingById.get(visible[0].target.id);
        if (active) active.classList.add("active");
      }, { rootMargin: "-80px 0px -72% 0px", threshold: [0, 1] });
      headings.forEach(function (heading) { observer.observe(heading); });
    }

    function updateScroll() {
      var top = window.scrollY || document.documentElement.scrollTop;
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress) progress.style.width = Math.min(100, top / max * 100) + "%";
      if (backToTop) backToTop.classList.toggle("show", top > 620);
    }
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    if (backToTop) backToTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

    document.querySelectorAll(".image-block img").forEach(function (image) {
      image.addEventListener("click", function () {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || "放大查看原图";
        lightbox.classList.add("show");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });
    if (lightbox) {
      lightbox.addEventListener("click", function () {
        lightbox.classList.remove("show");
        lightbox.setAttribute("aria-hidden", "true");
        if (lightboxImage) lightboxImage.removeAttribute("src");
      });
    }
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
        if (lightbox) lightbox.click();
      }
    });
  }

  initCollection();
  initReader();
})();
