import { access, cp, copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const publicRoot = path.join(repoRoot, "public");
const outputRoot = path.join(publicRoot, "ultrasound-ppt-notes");

const books = [
  {
    slug: "thyroid-ti-rads",
    sourceDir: "F:/Out/PPT/甲状腺超声检查与TI-RADS分类_v5",
    title: "甲状腺超声检查与 TI-RADS 分类",
    subtitle: "从解剖、生理与规范扫查，到 ACR TI-RADS 评分和病例实战。",
    cover: "cover.png",
    sourceCover: "preview/slide_01.png",
    indexLabel: "01 / THYROID",
  },
  {
    slug: "kidney-ultrasound",
    sourceDir: "F:/Out/PPT/肾脏超声知识精讲",
    title: "肾脏超声知识精讲",
    subtitle: "从检查技术、肾实质疾病到 Doppler、囊性与实性肿块。",
    cover: "cover.png",
    sourceCover: "预览截图/slide_01.png",
    indexLabel: "02 / KIDNEY",
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const lightboxStyle = `
<style id="xigua-ppt-enhancements">
  .xigua-ppt-back {
    position: fixed;
    top: 54px;
    left: 20px;
    z-index: 1000;
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0 12px;
    border: 1px solid rgba(33, 97, 160, .24);
    border-radius: 999px;
    color: #174a82;
    background: rgba(255, 255, 255, .88);
    box-shadow: 0 8px 24px rgba(23, 74, 130, .12);
    text-decoration: none;
    font: 700 12px/1 -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
    backdrop-filter: blur(10px);
  }
  .xigua-ppt-back:hover { background: #fff; }
  .xigua-ppt-zoomable { cursor: zoom-in; pointer-events: auto !important; }
  .deck { touch-action: pan-y; }
  .xigua-ppt-touch-nav {
    position: fixed;
    left: 50%;
    bottom: 14px;
    z-index: 1001;
    display: none;
    align-items: center;
    gap: 8px;
    transform: translateX(-50%);
    padding: 6px;
    border: 1px solid rgba(33, 97, 160, .18);
    border-radius: 999px;
    background: rgba(255, 255, 255, .9);
    box-shadow: 0 8px 24px rgba(23, 74, 130, .14);
    backdrop-filter: blur(12px);
    white-space: nowrap;
  }
  .xigua-ppt-touch-nav button {
    min-width: 64px;
    min-height: 34px;
    padding: 0 12px;
    border: 0;
    border-radius: 999px;
    color: #174a82;
    background: #eaf3fb;
    font: 700 12px/1 -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
    cursor: pointer;
    touch-action: manipulation;
  }
  .xigua-ppt-touch-nav button:active { background: #d6e9f8; }
  .xigua-ppt-touch-nav span { color: #5e7693; font: 600 11px/1 -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
  .xigua-ppt-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 48px 24px 36px;
    background: rgba(7, 18, 33, .92);
  }
  .xigua-ppt-lightbox.is-open { display: flex; }
  .xigua-ppt-lightbox img {
    display: block;
    max-width: min(96vw, 1800px);
    max-height: 88vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 28px 90px rgba(0, 0, 0, .42);
  }
  .xigua-ppt-lightbox button {
    position: absolute;
    top: 14px;
    right: 18px;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: rgba(255, 255, 255, .14);
    font-size: 26px;
    line-height: 1;
    cursor: pointer;
  }
  .xigua-ppt-lightbox button:hover { background: rgba(255, 255, 255, .24); }
  @media (max-width: 640px) {
    .xigua-ppt-back { top: 46px; left: 12px; min-height: 34px; padding: 0 11px; font-size: 11px; }
    .xigua-ppt-lightbox { padding: 44px 10px 24px; }
    .xigua-ppt-lightbox img { max-width: 96vw; max-height: 84vh; border-radius: 5px; }
    .xigua-ppt-touch-nav { bottom: max(12px, env(safe-area-inset-bottom)); gap: 5px; }
    .xigua-ppt-touch-nav button { min-width: 58px; min-height: 36px; padding: 0 10px; }
    .xigua-ppt-touch-nav span { font-size: 10px; }
  }
  @media (max-width: 900px), (hover: none) and (pointer: coarse) { .xigua-ppt-touch-nav { display: flex; } }
  @media (prefers-reduced-motion: reduce) {
    .xigua-ppt-back { transition: none; }
  }
</style>`;

const lightboxScript = `
<script id="xigua-ppt-lightbox-script">
(() => {
  const box = document.getElementById("xigua-ppt-lightbox");
  if (!box) return;
  const image = box.querySelector("img");
  const close = () => {
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    image.removeAttribute("src");
    document.body.classList.remove("xigua-ppt-modal-open");
  };
  document.querySelectorAll("img:not(#xigua-ppt-lightbox img)").forEach((img) => {
    img.classList.add("xigua-ppt-zoomable");
  });
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("img") : null;
    if (!target || target.closest("#xigua-ppt-lightbox")) return;
    image.src = target.currentSrc || target.src;
    image.alt = target.alt || "PPT 图片预览";
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
    document.body.classList.add("xigua-ppt-modal-open");
  });
  box.addEventListener("click", (event) => {
    if (event.target === box || event.target.closest("[data-xigua-close]")) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && box.classList.contains("is-open")) close();
  });
})();
</script>`;

const touchNavMarkup = `<nav class="xigua-ppt-touch-nav" aria-label="PPT 翻页"><button type="button" data-ppt-prev>上一页</button><span>左右滑动翻页</span><button type="button" data-ppt-next>下一页</button></nav>`;

const touchNavScript = `
<script id="xigua-ppt-touch-script">
(() => {
  const sendKey = (key) => document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  document.querySelector("[data-ppt-prev]")?.addEventListener("click", () => sendKey("ArrowLeft"));
  document.querySelector("[data-ppt-next]")?.addEventListener("click", () => sendKey("ArrowRight"));
  let start = null;
  document.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    start = { x: touch.clientX, y: touch.clientY, target: event.target };
  }, { passive: true });
  document.addEventListener("touchmove", (event) => {
    if (!start || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.15) event.preventDefault();
  }, { passive: false });
  document.addEventListener("touchend", (event) => {
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const target = start.target instanceof Element ? start.target : null;
    const inControl = target?.closest("button, a, input, select, textarea, [role=dialog]");
    const modalOpen = document.querySelector(".xigua-ppt-lightbox.is-open, .lightbox.open");
    if (!inControl && !modalOpen && Math.abs(dx) >= 44 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      sendKey(dx < 0 ? "ArrowRight" : "ArrowLeft");
    }
    start = null;
  }, { passive: true });
})();
</script>`;

function normalizeBookHtml(source, book, hasNativeLightbox) {
  const backLink = '<a class="xigua-ppt-back" href="../index.html" aria-label="返回超声PPT笔记目录">返回专栏目录</a>';
  const meta = `<meta name="description" content="${escapeHtml(book.title)}，超声PPT笔记 HTML 学习演示。">`;
  const nativeLightboxStyle = hasNativeLightbox
    ? `<style id="xigua-ppt-native-enhancements">.pic img,.gg .cell img,.fig img,.poster img,.banner img{cursor:zoom-in;pointer-events:auto!important}@media(max-width:640px){.lightbox{padding:44px 10px 24px}.lightbox img{max-width:96vw;max-height:84vh}.lightbox .lbclose{top:10px;right:14px}}</style>`
    : "";
  const overlay = hasNativeLightbox
    ? ""
    : `<div class="xigua-ppt-lightbox" id="xigua-ppt-lightbox" role="dialog" aria-modal="true" aria-label="图片预览" aria-hidden="true"><button type="button" data-xigua-close aria-label="关闭图片预览">×</button><img alt=""></div>${lightboxScript}`;

  return source
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(book.title)} | 超声PPT笔记 | 西瓜柚子</title>`)
    .replace(/<\/head>/i, `${meta}${lightboxStyle}${nativeLightboxStyle}</head>`)
    .replace(/<body([^>]*)>/i, `<body$1>${backLink}`)
    .replace(/<\/body>/i, `${overlay}${touchNavMarkup}${touchNavScript}</body>`);
}

const landingCss = `
:root { --ink:#102d52; --muted:#5e7693; --line:#d8e5f1; --paper:#f7fbff; --blue:#2177cc; --blue-dark:#155ca7; --cyan:#218fa7; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; color: var(--ink); background: var(--paper); font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
a { color: inherit; }
.ppt-page { min-height: 100dvh; background: radial-gradient(circle at 86% 12%, rgba(198, 227, 249, .6), transparent 35%), linear-gradient(180deg, #f9fcff 0%, #edf6fd 100%); }
.ppt-shell { width: min(1180px, calc(100% - 48px)); margin: 0 auto; }
.ppt-header { display:flex; align-items:center; justify-content:space-between; gap: 20px; min-height: 76px; border-bottom: 1px solid rgba(216,229,241,.9); }
.brand { display:inline-flex; align-items:center; gap:10px; color:var(--ink); text-decoration:none; font-size:12px; font-weight:800; letter-spacing:.18em; }
.brand-mark { width:30px; height:30px; display:grid; place-items:center; border-radius:50%; background:linear-gradient(135deg,#258ed7,#135aab); box-shadow:0 8px 18px rgba(33,119,204,.2); }
.brand-mark::after { content:""; width:6px; height:6px; border-radius:50%; background:#fff; }
.back-link { color:var(--blue-dark); text-decoration:none; font-size:13px; font-weight:700; }
.back-link:hover { color:var(--blue); }
.ppt-hero { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr); gap:56px; align-items:end; padding:82px 0 64px; }
.eyebrow { margin:0 0 18px; color:var(--blue); font-size:11px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; }
h1 { max-width:720px; margin:0; font-size:clamp(44px,7vw,82px); line-height:.98; letter-spacing:-.06em; }
.hero-lead { max-width:650px; margin:26px 0 0; color:var(--muted); font-size:clamp(18px,2.2vw,24px); line-height:1.65; }
.hero-note { align-self:stretch; display:flex; flex-direction:column; justify-content:flex-end; padding:26px 0 0 28px; border-left:1px solid var(--line); }
.hero-note strong { display:block; margin-bottom:10px; font-size:22px; line-height:1.35; }
.hero-note p { margin:0; color:var(--muted); line-height:1.8; }
.ppt-list { display:grid; grid-template-columns:1.08fr .92fr; gap:22px; padding:24px 0 78px; }
.ppt-card { display:grid; grid-template-columns:minmax(210px,.9fr) minmax(0,1.1fr); min-height:350px; overflow:hidden; border:1px solid var(--line); border-radius:20px; background:rgba(255,255,255,.9); box-shadow:0 18px 50px rgba(36,93,140,.09); text-decoration:none; transition:transform .25s ease,box-shadow .25s ease; }
.ppt-card:nth-child(2) { grid-template-columns:minmax(0,1fr); min-height:330px; }
.ppt-card:hover { transform:translateY(-4px); box-shadow:0 24px 62px rgba(36,93,140,.15); }
.ppt-visual { min-height:100%; display:flex; align-items:center; justify-content:center; padding:22px; background:linear-gradient(145deg,#e6f3fc,#d8ecfa); }
.ppt-card:nth-child(2) .ppt-visual { min-height:172px; }
.ppt-visual img { display:block; width:100%; max-width:360px; max-height:250px; object-fit:contain; box-shadow:0 14px 28px rgba(36,93,140,.14); }
.ppt-card:nth-child(2) .ppt-visual img { max-width:510px; max-height:210px; }
.ppt-copy { display:flex; flex-direction:column; padding:32px 30px 28px; }
.ppt-index { margin-bottom:22px; color:#c66c58; font:700 12px/1 ui-monospace,SFMono-Regular,Consolas,monospace; letter-spacing:.15em; }
.ppt-card:nth-child(2) .ppt-index { color:var(--cyan); }
.ppt-copy h2 { margin:0; font-size:clamp(25px,3vw,38px); line-height:1.16; letter-spacing:-.04em; }
.ppt-copy p { margin:16px 0 0; color:var(--muted); line-height:1.75; }
.ppt-open { display:inline-flex; align-items:center; gap:8px; margin-top:auto; padding-top:24px; color:var(--blue-dark); font-size:14px; font-weight:800; }
.ppt-open::after { content:"→"; font-size:20px; transition:transform .2s ease; }
.ppt-card:hover .ppt-open::after { transform:translateX(4px); }
.ppt-footer { display:flex; justify-content:space-between; gap:24px; padding:22px 0 34px; border-top:1px solid var(--line); color:var(--muted); font-size:12px; line-height:1.7; }
.ppt-footer p { margin:0; }
@media (max-width:820px) { .ppt-hero { grid-template-columns:1fr; gap:28px; padding:58px 0 42px; } .hero-note { padding:18px 0 0; border-left:0; border-top:1px solid var(--line); } .ppt-list { grid-template-columns:1fr; } .ppt-card:nth-child(2) { grid-template-columns:minmax(210px,.8fr) minmax(0,1.2fr); min-height:280px; } .ppt-card:nth-child(2) .ppt-visual { min-height:100%; } }
@media (max-width:600px) { .ppt-shell { width:min(100% - 28px, 520px); } .ppt-header { min-height:64px; } .brand { font-size:10px; letter-spacing:.12em; } .brand-mark { width:27px; height:27px; } .back-link { font-size:12px; } .ppt-hero { padding:46px 0 32px; } h1 { font-size:clamp(40px,14vw,64px); } .hero-lead { margin-top:20px; font-size:17px; } .ppt-list { gap:16px; padding-bottom:56px; } .ppt-card,.ppt-card:nth-child(2) { grid-template-columns:1fr; min-height:0; border-radius:16px; } .ppt-visual,.ppt-card:nth-child(2) .ppt-visual { min-height:180px; } .ppt-visual img,.ppt-card:nth-child(2) .ppt-visual img { max-height:155px; } .ppt-copy { padding:24px 22px 22px; } .ppt-index { margin-bottom:17px; } .ppt-copy h2 { font-size:27px; } .ppt-open { padding-top:22px; } .ppt-footer { flex-direction:column; gap:8px; padding-bottom:24px; } }
@media (prefers-reduced-motion:reduce) { html { scroll-behavior:auto; } .ppt-card,.ppt-open::after { transition:none; } }
`;

const landingHtml = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="description" content="超声PPT笔记专栏，一个基于HTML的PPT学习入口，计划每个月更新2-4篇。"><title>超声PPT笔记 | 西瓜柚子</title><style>${landingCss}</style></head>
<body class="ppt-page"><div class="ppt-shell"><header class="ppt-header"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true"></span><span>XIGUA · YUZI</span></a><a class="back-link" href="/blog/imaging">返回医学影像</a></header><main><section class="ppt-hero"><div><p class="eyebrow">Ultrasound PPT notes</p><h1>超声PPT<br>笔记</h1><p class="hero-lead">这是一个基于 HTML 的 PPT 学习专栏，计划每个月更新 2-4 篇，持续整理适合电脑、平板和手机阅读的超声知识。</p></div><aside class="hero-note"><strong>两个入口，持续更新</strong><p>保留每一页演示的文字、图片和版式。进入 PPT 后可用键盘或触屏翻页，点击图片可放大查看。</p></aside></section><section class="ppt-list" aria-label="超声PPT笔记书目"><a class="ppt-card" href="thyroid-ti-rads/index.html"><div class="ppt-visual"><img src="thyroid-ti-rads/cover.png" alt="甲状腺超声检查与 TI-RADS 分类封面" loading="eager"></div><div class="ppt-copy"><div class="ppt-index">${books[0].indexLabel}</div><h2>${books[0].title}</h2><p>${books[0].subtitle}</p><span class="ppt-open">打开 HTML PPT</span></div></a><a class="ppt-card" href="kidney-ultrasound/index.html"><div class="ppt-visual"><img src="kidney-ultrasound/cover.png" alt="肾脏超声知识精讲封面" loading="lazy"></div><div class="ppt-copy"><div class="ppt-index">${books[1].indexLabel}</div><h2>${books[1].title}</h2><p>${books[1].subtitle}</p><span class="ppt-open">打开 HTML PPT</span></div></a></section></main><footer class="ppt-footer"><p>西瓜柚子 · 医学影像</p><p>内容用于医学教育与个人学习，请结合原始资料和临床规范核对。</p></footer></div></body></html>`;

async function ensureInsidePublic(target) {
  const relative = path.relative(publicRoot, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`输出路径必须位于 public 内：${target}`);
  }
}

async function main() {
  await ensureInsidePublic(outputRoot);
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  for (const book of books) {
    const sourceDir = path.resolve(book.sourceDir);
    const outputDir = path.join(outputRoot, book.slug);
    await access(path.join(sourceDir, "index.html"));
    await cp(sourceDir, outputDir, { recursive: true });
    await copyFile(path.join(sourceDir, book.sourceCover), path.join(outputDir, book.cover));

    const sourceHtml = await readFile(path.join(sourceDir, "index.html"), "utf8");
    const hasNativeLightbox = /id=["']lightbox["']/i.test(sourceHtml);
    const html = normalizeBookHtml(sourceHtml, book, hasNativeLightbox);
    await writeFile(path.join(outputDir, "index.html"), html, "utf8");

    const imageRefs = [...html.matchAll(/(?:src|href)=["']([^"']+\.(?:png|jpe?g|gif|webp|svg))["']/gi)]
      .map((match) => match[1].split(/[?#]/, 1)[0])
      .filter((ref) => !/^(?:https?:|data:|\/)/i.test(ref));
    const missing = [];
    for (const ref of new Set(imageRefs)) {
      try {
        await access(path.resolve(outputDir, ref));
      } catch {
        missing.push(ref);
      }
    }
    if (missing.length) throw new Error(`${book.title} 存在缺失图片：${missing.slice(0, 5).join(", ")}`);
    console.log(`${book.title}: ${imageRefs.length} 个图片引用，${hasNativeLightbox ? "保留并增强原有" : "加入"}图片放大。`);
  }

  await writeFile(path.join(outputRoot, "index.html"), landingHtml, "utf8");
  await writeFile(path.join(outputRoot, "manifest.json"), JSON.stringify({ title: "超声PPT笔记", books }, null, 2), "utf8");
  console.log(`已生成 ${outputRoot}，包含 ${books.length} 个 HTML PPT 入口。`);
}

await main();
