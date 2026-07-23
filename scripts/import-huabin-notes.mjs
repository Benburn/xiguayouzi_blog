import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceRoot = "E:\\Book2Know\\Huabin";
const publicRoot = "E:\\Web\\xiguayouzi_blog\\public\\huabin-ultrasound-notes";

const volumes = [
  { number: 1, pages: 215, images: 391, chapters: 9, sections: 68, firstPage: 17, lastPage: 243 },
  { number: 2, pages: 385, images: 644, chapters: 4, sections: 25, firstPage: 15, lastPage: 402, cutoffPage: 403 },
  { number: 3, pages: 250, images: 361, chapters: 6, sections: 92, firstPage: 19, lastPage: 276 },
  { number: 4, pages: 265, images: 519, chapters: 3, sections: 94, firstPage: 18, lastPage: 284 },
  { number: 5, pages: 222, images: 471, chapters: 5, sections: 123, firstPage: 19, lastPage: 245, cutoffPage: 246 },
  { number: 6, pages: 211, images: 442, chapters: 2, sections: 104, firstPage: 17, lastPage: 228, cutoffPage: 230 },
];

const sharedCss = `
  /* 西瓜柚子博客统一阅读样式 */
  :root { --fg:#183b62; --fg-mute:#647b98; --bg:#fff; --bg-page:#f4f8fd;
    --rule:#dce8f5; --accent:#247bd6; --accent-d:#0b2a55;
    --accent-bg:#eef6ff; --accent-bg2:#dceeff; --link:#176cbe;
    --shadow:rgba(22,67,115,.10); }
  html { scroll-padding-top:20px; }
  body { background:radial-gradient(circle at 92% 8%,rgba(38,168,210,.12),transparent 28rem),#f4f8fd; }
  .toc-side { width:286px; background:linear-gradient(180deg,#0b2a55,#123f71); border:0;
    box-shadow:12px 0 42px rgba(11,42,85,.12); }
  .toc-side .brand { border-bottom-color:#4da8ec; }
  .toc-side .brand .t { color:#fff; }.toc-side .brand .s { color:#bbd5ef; }
  .toc-side nav a { color:#dcecff; }.toc-side nav a.lvl-chapter { color:#8fd9f0; border-top-color:rgba(255,255,255,.12); }
  .toc-side nav a.lvl-section { color:#c4d8eb; }.toc-side nav a:hover,.toc-side nav a.is-current { background:rgba(255,255,255,.12); color:#fff; }
  .toc-toggle,.toc-mobile-head,.toc-search,.toc-backdrop { display:none; }
  .main-inner { max-width:1040px; padding-top:28px; }
  .series-toolbar { display:flex; align-items:center; gap:10px; margin:0 0 36px; padding:10px 0 18px;
    border-bottom:1px solid var(--rule); font:700 12px/1.4 Inter,"PingFang SC","Microsoft YaHei",sans-serif; letter-spacing:.08em; }
  .series-toolbar a { padding:8px 12px; border-radius:999px; background:#eaf4ff; text-decoration:none; letter-spacing:0; }
  .series-toolbar span { margin-left:auto; color:#7890ac; }
  .meta-top { color:#247bd6; }.book-title { color:#0b2a55; font-family:Inter,"PingFang SC","Microsoft YaHei",sans-serif;
    font-weight:800; letter-spacing:-.04em; }.book-sub { color:#647b98; }
  .volume-strip { display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin:0 0 14px; }
  .volume-strip a,.volume-strip span { padding:8px 12px; border:1px solid var(--rule); border-radius:999px;
    background:#fff; color:#647b98; font:650 12px/1.4 Inter,"PingFang SC","Microsoft YaHei",sans-serif; text-decoration:none; }
  .volume-strip .active { border-color:#9bc8f1; background:#eaf4ff; color:#176cbe; }
  .content-scope { margin:0 0 34px!important; padding:13px 16px; border-left:3px solid #247bd6;
    border-radius:0 10px 10px 0; background:#eef6ff; color:#55708f; font-size:14px; text-indent:0!important; }
  .page { margin:0 0 20px; padding:30px 34px; border:1px solid var(--rule); border-radius:18px;
    background:#fff; box-shadow:0 14px 38px rgba(22,67,115,.07); }
  .page:last-child { border-bottom:1px solid var(--rule); }.page .pageno { color:#7d93ad; }
  .page h1,.page h2 { color:#0b2a55; font-family:Inter,"PingFang SC","Microsoft YaHei",sans-serif; }
  .page h3 { color:#244b75; }.page div[style*="text-align: center"] img { border-radius:10px; box-shadow:0 10px 28px rgba(14,48,86,.14); }
  .page sup,.page sub { font-size:.72em; line-height:0; }
  .chapter-title-page { margin:38px 0 20px; padding:56px 20px 34px; border:1px solid var(--rule); border-radius:18px;
    background:linear-gradient(135deg,#edf6ff,#fff); }.chapter-title-page .ctp-no { color:#247bd6; }
  .chapter-title-page .ctp-name { color:#0b2a55; font-family:Inter,"PingFang SC","Microsoft YaHei",sans-serif; }
  .ch-anchor { scroll-margin-top:18px; }.ch-anchor-section { background:#eaf4ff; border-left-color:#247bd6; }
  .ch-anchor-section .ch-no,.ch-anchor-section .ch-name { color:#164f88; }
  @media (max-width:900px) {
    html,body { max-width:100%; overflow-x:hidden; }
    body.toc-open { overflow:hidden; }
    .toc-side { position:sticky; inset:auto; top:0; z-index:70; display:flex; align-items:center; justify-content:space-between; gap:10px;
      width:100%; max-width:100vw; height:62px; padding:9px 12px 9px 14px; overflow:visible; border-bottom:1px solid rgba(255,255,255,.14); }
    .toc-side .brand { flex:0 1 auto; min-width:0; margin:0; padding:0 12px 0 0; border:0; }
    .toc-side .brand .t { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:14px; }
    .toc-side .brand .s { display:none; }
    .toc-toggle { display:flex; flex:0 0 auto; align-items:center; gap:9px; min-height:44px; max-width:62vw; padding:7px 11px;
      border:1px solid rgba(255,255,255,.28); border-radius:12px; background:rgba(255,255,255,.12); color:#fff;
      font:750 14px/1.15 Inter,"PingFang SC","Microsoft YaHei",sans-serif; cursor:pointer; }
    .toc-toggle::before { content:"☰"; font-size:17px; }
    .toc-toggle small { max-width:34vw; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#bcd8ee; font-size:11px; font-weight:600; }
    .toc-side nav { position:fixed; inset:0 0 0 auto; z-index:90; width:min(90vw,420px); height:100dvh; padding:0 14px 30px;
      overflow-y:auto; overscroll-behavior:contain; background:#f8fbff; box-shadow:-18px 0 55px rgba(7,35,67,.25);
      transform:translateX(105%); visibility:hidden; transition:transform .24s ease,visibility .24s; }
    body.toc-open .toc-side nav { transform:translateX(0); visibility:visible; }
    .toc-mobile-head { position:sticky; top:0; z-index:2; display:flex; align-items:center; justify-content:space-between; min-height:62px;
      margin:0 -14px 10px; padding:9px 14px; border-bottom:1px solid #dce8f5; background:rgba(248,251,255,.96); backdrop-filter:blur(14px); color:#0b2a55; }
    .toc-mobile-head strong { font-size:17px; }.toc-close { min-width:54px; min-height:40px; padding:0 12px; border:0; border-radius:10px;
      background:#e7f2ff; color:#176cbe; font-weight:750; cursor:pointer; }
    .toc-search { display:block; margin:0 0 12px; }.toc-search input { width:100%; min-height:46px; padding:0 14px; border:1px solid #cfe0f2;
      border-radius:12px; outline:none; background:#fff; color:#183b62; font-size:16px; }
    .toc-search input:focus { border-color:#247bd6; box-shadow:0 0 0 3px rgba(36,123,214,.12); }
    .toc-side nav ol { display:block; margin:0; padding:0; }.toc-side nav li { display:block; }
    .toc-side nav a,.toc-side nav a.lvl-chapter,.toc-side nav a.lvl-section { display:block; margin:0; border:0; border-radius:10px; color:#44617f; white-space:normal; }
    .toc-side nav a.lvl-chapter { margin-top:8px; padding:12px 11px; background:#eaf4ff; color:#0d5599; font-weight:800; }
    .toc-side nav a.lvl-section { padding:10px 11px 10px 22px; color:#526e8b; line-height:1.5; }
    .toc-side nav a:hover,.toc-side nav a.is-current { background:#d9edff; color:#0b4f8d; }
    .toc-side nav li[hidden] { display:none; }
    .toc-backdrop { position:fixed; inset:0; z-index:80; display:block; border:0; background:rgba(6,28,52,.42); opacity:0; visibility:hidden;
      transition:opacity .24s ease,visibility .24s; }
    body.toc-open .toc-backdrop { opacity:1; visibility:visible; }
    .main-inner { padding:20px 14px 60px; }.series-toolbar { margin-bottom:24px; }.series-toolbar span { display:none; }
    .page { padding:23px 20px; border-radius:15px; }.chapter-title-page { padding:42px 16px 28px; }
    .ch-anchor { scroll-margin-top:76px; }
  }
  @media (max-width:560px) {
    html,body { font-size:16px; line-height:1.82; }.main-inner { padding:16px 8px 48px; }
    .toc-side { height:58px; }.toc-toggle { min-height:40px; max-width:64vw; }.toc-toggle small { max-width:31vw; }
    .series-toolbar { padding:6px 7px 14px; }.series-toolbar a { padding:7px 9px; font-size:11px; }
    h1.book-title { font-size:2.05em; }.book-sub { margin-bottom:24px; }
    .volume-strip { justify-content:flex-start; padding:0 7px; }.content-scope { margin-left:7px!important; margin-right:7px!important; }
    .page { padding:20px 15px; }.page p { text-align:left; text-indent:0; }.page h1 { font-size:1.45em; }
    .page h2 { font-size:1.22em; }.chapter-title-page .ctp-name { font-size:1.65em; }
  }
`;

const navigationScript = `
<script>
(() => {
  const toc = document.querySelector('.toc-side');
  const nav = toc && toc.querySelector('nav');
  const toggle = toc && toc.querySelector('.toc-toggle');
  const close = toc && toc.querySelector('.toc-close');
  const backdrop = document.querySelector('.toc-backdrop');
  const search = toc && toc.querySelector('.toc-search input');
  const status = toggle && toggle.querySelector('small');
  if (!toc || !nav || !toggle) return;

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const targets = links.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  const setOpen = open => {
    document.body.classList.toggle('toc-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) setTimeout(() => search && search.focus(), 80);
  };

  toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('toc-open')));
  close && close.addEventListener('click', () => setOpen(false));
  backdrop && backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  links.forEach(link => link.addEventListener('click', () => setOpen(false)));

  search && search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase('zh-CN');
    links.forEach(link => { link.closest('li').hidden = query && !link.textContent.toLocaleLowerCase('zh-CN').includes(query); });
  });

  let ticking = false;
  const updateCurrent = () => {
    ticking = false;
    let current = 0;
    for (let i = 0; i < targets.length; i += 1) {
      if (targets[i] && targets[i].getBoundingClientRect().top <= 130) current = i;
      else if (targets[i]) break;
    }
    links.forEach((link, index) => link.classList.toggle('is-current', index === current));
    if (status && links[current]) status.textContent = links[current].textContent.trim();
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateCurrent); }
  }, { passive:true });
  updateCurrent();
})();
</script>`;

const volumeLinks = active => volumes.map(volume => {
  if (volume.number === active) return `<span class="active">第${volume.number}辑</span>`;
  return `<a href="../volume-${volume.number}/index.html">第${volume.number}辑</a>`;
}).join("\n    ");

for (const volume of volumes) {
  const sourceDir = path.join(sourceRoot, `华斌笔记第${volume.number}辑_OCR`);
  const sourceHtml = path.join(sourceDir, `华斌的超声笔记_第${volume.number}辑.html`);
  const outputDir = path.join(publicRoot, `volume-${volume.number}`);
  const outputImages = path.join(outputDir, "images");

  if (!path.resolve(outputDir).startsWith(path.resolve(publicRoot) + path.sep)) {
    throw new Error(`拒绝写入合集目录之外的路径：${outputDir}`);
  }

  let html = await readFile(sourceHtml, "utf8");
  const firstChapterAt = html.indexOf('<div class="chapter-title-page" id="ch1">');
  const bookSubAt = html.indexOf('<div class="book-sub">');
  const bookSubEnd = html.indexOf("</div>", bookSubAt) + "</div>".length;
  if (firstChapterAt < 0 || bookSubAt < 0 || bookSubEnd < 0) throw new Error(`第${volume.number}辑正文边界定位失败`);

  const notice = `
  <div class="volume-strip" aria-label="六辑入口">
    ${volumeLinks(volume.number)}
  </div>
  <p class="content-scope">第${volume.number}辑正文范围：P${volume.firstPage}–P${volume.lastPage}。章节、文字与图片按原书顺序对应展示。</p>

`;
  html = html.slice(0, bookSubEnd) + notice + html.slice(firstChapterAt);

  if (volume.cutoffPage) {
    const markerAt = html.indexOf(`— P${volume.cutoffPage} —`);
    const pageAt = html.lastIndexOf('<div class="page">', markerAt);
    const footerAt = html.indexOf('<div class="footer-note">', pageAt);
    if (markerAt < 0 || pageAt < 0 || footerAt < 0) throw new Error(`第${volume.number}辑尾页边界定位失败`);
    html = html.slice(0, pageAt) + html.slice(footerAt);
  }

  html = html.replace(/<div class="footer-note">[\s\S]*?<\/div>/, "");
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>华斌笔记 · 第${volume.number}辑</title>`)
    .replace(/<div class="t">[\s\S]*?<\/div>/, '<div class="t">华斌笔记</div>')
    .replace(/<div class="s">[\s\S]*?<\/div>/, `<div class="s">第${volume.number}辑 · 正文版</div>`)
    .replace(/<div class="meta-top">[\s\S]*?<\/div>/, '<div class="meta-top">医学影像 · 华斌笔记系列</div>')
    .replace(/<h1 class="book-title">[\s\S]*?<\/h1>/, '<h1 class="book-title">华斌笔记</h1>')
    .replace(/<div class="book-sub">[\s\S]*?<\/div>/, `<div class="book-sub">第${volume.number}辑 · 超声临床笔记正文</div>`)
    .replace('<nav><ol>', `<button class="toc-toggle" type="button" aria-controls="tocNav" aria-expanded="false"><span>目录</span><small>选择章节</small></button>
  <nav id="tocNav" aria-label="第${volume.number}辑内容目录"><div class="toc-mobile-head"><strong>第${volume.number}辑目录</strong><button class="toc-close" type="button">关闭</button></div><label class="toc-search"><span hidden>搜索目录</span><input type="search" placeholder="搜索章节或小节" autocomplete="off"></label><ol>`)
    .replace('</aside>\n<main class="main">', '</aside>\n<button class="toc-backdrop" type="button" aria-label="关闭目录"></button>\n<main class="main">')
    .replace('<div class="main-inner">', `<div class="main-inner">
  <nav class="series-toolbar"><a href="../index.html">← 系列目录</a><a href="/blog/imaging">医学影像栏目</a><span>XIGUA · YUZI</span></nav>`)
    .replace(/([≤≥])q(?=\d)/g, "$1")
    .replace(/dB=10 × B_\{el\}=10 × L_\{g\} \\frac\{P_\{2\}\}\{P_\{1\}\} \\text\{\(P=输出信号功率，P_\{1\}=输入信号功率\)\}。/g,
      'dB = 10 × lg(P<sub>2</sub>/P<sub>1</sub>)（P<sub>2</sub>为输出信号功率，P<sub>1</sub>为输入信号功率）。')
    .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
    .replace(/([A-Za-z])_\{([^}]+)\}/g, '$1<sub>$2</sub>')
    .replace(/\\([.,;:!?])/g, '$1')
    .replaceAll('<img ', '<img loading="lazy" decoding="async" ')
    .replace('</style>', `${sharedCss}\n</style>`)
    .replace('</body>', `${navigationScript}\n</body>`);
  html = html.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "");

  const imageNames = [...new Set([...html.matchAll(/src="images\/([^"]+)"/g)].map(match => match[1]))];
  const actual = {
    pages: (html.match(/class="page"/g) || []).length,
    images: imageNames.length,
    chapters: (html.match(/class="chapter-title-page"/g) || []).length,
    sections: (html.match(/class="ch-anchor ch-anchor-section"/g) || []).length,
  };
  for (const key of ["pages", "images", "chapters", "sections"]) {
    if (actual[key] !== volume[key]) throw new Error(`第${volume.number}辑 ${key}：预期 ${volume[key]}，实际 ${actual[key]}`);
  }

  const forbiddenPatterns = [
    [/\bOCR\b/i, "生成方式词"], [/Paddle/i, "工具名称"], [/\[Unlabel/i, "未标注占位符"],
    [/[锟鈥�]/, "乱码"], [/[≤≥]q\d/, "比较符号残留"], [/[\uAC00-\uD7AF]/u, "异常韩文"],
    [/[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]{8,}/u, "重复罗马数字"], [/\d{10,}>/, "异常数字串"],
    [/\\(?:frac|text)\b|\^\{|_\{/i, "未转换公式"], [/<div class="footer-note">/, "尾部说明"],
  ];
  const found = forbiddenPatterns.filter(([pattern]) => pattern.test(html)).map(([, label]) => label);
  if (found.length) throw new Error(`第${volume.number}辑仍含异常内容：${found.join("、")}`);
  if (!html.includes(`— P${volume.firstPage} —`) || !html.includes(`— P${volume.lastPage} —`)) {
    throw new Error(`第${volume.number}辑首尾页校验失败`);
  }

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputImages, { recursive: true });
  const missing = [];
  for (const imageName of imageNames) {
    if (imageName.includes("..") || path.isAbsolute(imageName)) throw new Error(`非法图片路径：${imageName}`);
    try { await copyFile(path.join(sourceDir, "images", imageName), path.join(outputImages, imageName)); }
    catch { missing.push(imageName); }
  }
  if (missing.length) throw new Error(`第${volume.number}辑缺少 ${missing.length} 张图片：${missing.slice(0, 5).join("、")}`);
  await writeFile(path.join(outputDir, "index.html"), html, "utf8");
  console.log(`第${volume.number}辑完成：${actual.pages}页 / ${actual.chapters}章 / ${actual.sections}节 / ${actual.images}图`);
}
