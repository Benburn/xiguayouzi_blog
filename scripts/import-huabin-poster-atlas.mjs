import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceDir = "E:\\Book2Know\\Huabin\\华斌超声知识海报全集";
const outputRoot = "E:\\Web\\xiguayouzi_blog\\public\\huabin-ultrasound-notes";
const outputDir = path.join(outputRoot, "poster-atlas");

if (!path.resolve(outputDir).startsWith(path.resolve(outputRoot) + path.sep)) {
  throw new Error(`拒绝写入华斌笔记目录之外的路径：${outputDir}`);
}

let html = await readFile(path.join(sourceDir, "index.html"), "utf8");
html = html
  .replace("<title>华斌六辑超声知识海报全集</title>", "<title>华斌超声知识海报全集 · 西瓜柚子</title>")
  .replace('<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="华斌超声知识海报全集：24个部位主题、96张可交互知识海报。">')
  .replace('<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="atlas.css">',
    '<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="atlas.css"><link rel="stylesheet" href="assets/blog-controls.css">')
  .replace("</body>", '<script src="assets/blog-controls.js"></script>\n</body>')
  .replace(/\r\n?/g, "\n")
  .replace(/[ \t]+$/gm, "");

const controlsCss = `
.tpl-thyroid{height:100vh;min-height:100vh!important;overflow:hidden}
.tpl-thyroid .deck{flex:0 0 810px}
.atlas-blog-controls{position:fixed;right:12px;top:12px;z-index:120;display:flex;align-items:center;gap:6px;padding:7px;border:1px solid rgba(255,255,255,.7);border-radius:14px;background:rgba(30,26,23,.9);box-shadow:0 8px 28px rgba(0,0,0,.22);backdrop-filter:blur(10px);font-family:"Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif}
.atlas-blog-controls a,.atlas-blog-controls button{display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:36px;padding:0 11px;border:0;border-radius:9px;background:rgba(255,255,255,.12);color:#fff;text-decoration:none;font:800 12px/1 inherit;cursor:pointer;white-space:nowrap}
.atlas-blog-controls a{background:#247bd6}.atlas-blog-controls button:hover,.atlas-blog-controls a:hover{background:#398de3}.atlas-blog-controls button:disabled{opacity:.35;cursor:default}
.atlas-blog-controls .atlas-page{min-width:56px;color:rgba(255,255,255,.76);font-size:11px;text-align:center;font-variant-numeric:tabular-nums}
.render-mode .atlas-blog-controls{display:none!important}
@media(max-width:640px){
  .atlas-blog-controls{left:50%;right:auto;top:auto;bottom:max(10px,env(safe-area-inset-bottom));transform:translateX(-50%);width:max-content;max-width:calc(100vw - 14px);padding:6px;gap:4px}
  .atlas-blog-controls a,.atlas-blog-controls button{min-width:39px;height:40px;padding:0 9px;font-size:12px}
  .atlas-blog-controls a{font-size:0}.atlas-blog-controls a::before{content:"返回";font-size:12px}
  .atlas-blog-controls .atlas-page{min-width:48px}
  .tpl-thyroid .export-tools{transform:scale(.76);transform-origin:top left}
}
`;

const controlsJs = `
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
    var match = new RegExp("^#/(\\\\d+)").exec(location.hash || "");
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
`;

const slideCount = (html.match(/<section class="slide/g) || []).length;
const topicCount = (html.match(/class="toc-card"/g) || []).length;
const imageNames = [...new Set([...html.matchAll(/src="images\/([^"]+)"/g)].map(match => match[1]))];
const forbidden = [/\bOCR\b/i, /Paddle/i, /\[Unlabel/i, /[锟鈥�]/, /(?:qa_profile|zoom_preview_profile|toc_preview_profile|image_candidates)/i];
if (slideCount !== 97 || topicCount !== 24 || imageNames.length !== 72) {
  throw new Error(`内容数量异常：${slideCount}页 / ${topicCount}主题 / ${imageNames.length}图`);
}
if (forbidden.some(pattern => pattern.test(html))) throw new Error("海报HTML仍含不应发布的内容");

await rm(outputDir, { recursive:true, force:true });
await mkdir(path.join(outputDir, "images"), { recursive:true });
await cp(path.join(sourceDir, "assets"), path.join(outputDir, "assets"), { recursive:true });
await copyFile(path.join(sourceDir, "style.css"), path.join(outputDir, "style.css"));
await copyFile(path.join(sourceDir, "atlas.css"), path.join(outputDir, "atlas.css"));
for (const imageName of imageNames) {
  await copyFile(path.join(sourceDir, "images", imageName), path.join(outputDir, "images", imageName));
}
await writeFile(path.join(outputDir, "assets", "blog-controls.css"), controlsCss.trim() + "\n", "utf8");
await writeFile(path.join(outputDir, "assets", "blog-controls.js"), controlsJs.trim() + "\n", "utf8");
await writeFile(path.join(outputDir, "index.html"), html, "utf8");

console.log(`海报特殊合集完成：${topicCount}个主题 / ${slideCount - 1}张海报 / ${imageNames.length}张原始超声图`);
