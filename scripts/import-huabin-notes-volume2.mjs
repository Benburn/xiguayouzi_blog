import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceDir = "E:\\Book2Know\\Huabin\\华斌笔记第2辑_OCR";
const sourceHtml = path.join(sourceDir, "华斌的超声笔记_第2辑.html");
const outputDir = "E:\\Web\\xiguayouzi_blog\\public\\huabin-ultrasound-notes\\volume-2";
const outputImages = path.join(outputDir, "images");

await mkdir(outputImages, { recursive: true });

let html = await readFile(sourceHtml, "utf8");

const firstChapter = '<div class="chapter-title-page" id="ch1">';
const firstChapterAt = html.indexOf(firstChapter);
const bookSubAt = html.indexOf('<div class="book-sub">');
const bookSubEnd = html.indexOf("</div>", bookSubAt) + "</div>".length;

if (firstChapterAt < 0 || bookSubAt < 0 || bookSubEnd < 0) {
  throw new Error("无法定位前言与第一章边界");
}

const seriesNotice = `
  <div class="volume-strip" aria-label="系列进度">
    <a href="../index.html">华斌笔记系列</a>
    <span class="active">第2辑 · 已上线</span>
    <span>其余5辑 · 待更新</span>
  </div>
  <p class="content-scope">本页仅保留第2辑正文内容（P15–P402），前言、目录及OCR生成说明均不展示。</p>

`;

html = html.slice(0, bookSubEnd) + seriesNotice + html.slice(firstChapterAt);

const p403MarkerAt = html.indexOf("— P403 —");
const p403PageAt = html.lastIndexOf('<div class="page">', p403MarkerAt);
const tailMatch = html.slice(p403PageAt).match(/\r?\n<\/div>\r?\n<\/main>/);

if (p403MarkerAt < 0 || p403PageAt < 0 || !tailMatch) {
  throw new Error("无法定位 P403 与正文结束边界");
}

html = html.slice(0, p403PageAt) + html.slice(p403PageAt + tailMatch.index);

html = html
  .replaceAll("华斌的超声笔记 · 第2辑", "华斌笔记 · 第2辑")
  .replace('<div class="t">华斌的超声笔记</div>', '<div class="t">华斌笔记</div>')
  .replace('<div class="s">第 2 辑 · 彩图版 · OCR 整理</div>', '<div class="s">第2辑 · 正文版</div>')
  .replace('<div class="meta-top">超声医学 · 临床笔记</div>', '<div class="meta-top">医学影像 · 华斌笔记系列</div>')
  .replace('<h1 class="book-title">华斌的超声笔记</h1>', '<h1 class="book-title">华斌笔记</h1>')
  .replace('<div class="book-sub">第 2 辑 · 彩图版 &nbsp;|&nbsp; PaddleOCR-VL-1.6 识别整理</div>', '<div class="book-sub">第2辑 · 超声临床笔记正文</div>')
  .replace('<div class="main-inner">', `<div class="main-inner">
  <nav class="series-toolbar"><a href="../index.html">← 系列目录</a><a href="/blog/imaging">医学影像栏目</a><span>XIGUA · YUZI</span></nav>`)
  .replaceAll("?", "？")
  .replaceAll("<img ", '<img loading="lazy" decoding="async" ');

const overrideCss = `
  /* 西瓜柚子博客适配 */
  :root { --fg:#183b62; --fg-mute:#647b98; --bg:#fff; --bg-page:#f4f8fd;
    --rule:#dce8f5; --accent:#247bd6; --accent-d:#0b2a55;
    --accent-bg:#eef6ff; --accent-bg2:#dceeff; --link:#176cbe;
    --shadow:rgba(22,67,115,.10); }
  html { scroll-padding-top: 20px; }
  body { background:radial-gradient(circle at 92% 8%,rgba(38,168,210,.12),transparent 28rem),#f4f8fd; }
  .toc-side { width:286px; background:linear-gradient(180deg,#0b2a55,#123f71); border:0;
    box-shadow:12px 0 42px rgba(11,42,85,.12); }
  .toc-side .brand { border-bottom-color:#4da8ec; }
  .toc-side .brand .t { color:#fff; }.toc-side .brand .s { color:#bbd5ef; }
  .toc-side nav a { color:#dcecff; }.toc-side nav a.lvl-chapter { color:#8fd9f0; border-top-color:rgba(255,255,255,.12); }
  .toc-side nav a.lvl-section { color:#c4d8eb; }.toc-side nav a:hover { background:rgba(255,255,255,.11); color:#fff; }
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
  .chapter-title-page { margin:38px 0 20px; padding:56px 20px 34px; border:1px solid var(--rule); border-radius:18px;
    background:linear-gradient(135deg,#edf6ff,#fff); }.chapter-title-page .ctp-no { color:#247bd6; }
  .chapter-title-page .ctp-name { color:#0b2a55; font-family:Inter,"PingFang SC","Microsoft YaHei",sans-serif; }
  .ch-anchor { scroll-margin-top:18px; }.ch-anchor-section { background:#eaf4ff; border-left-color:#247bd6; }
  .ch-anchor-section .ch-no,.ch-anchor-section .ch-name { color:#164f88; }
  @media (max-width:900px) {
    html,body { max-width:100%; overflow-x:hidden; }
    .toc-side { position:sticky; inset:auto; top:0; z-index:50; display:flex; align-items:center; gap:10px;
      width:100%; max-width:100vw; height:auto; padding:10px 14px; overflow-x:auto; scrollbar-width:none;
      border-bottom:1px solid rgba(255,255,255,.12); }
    .toc-side::-webkit-scrollbar { display:none; }
    .toc-side .brand { flex:0 0 auto; margin:0; padding:0 14px 0 0; border:0; border-right:1px solid rgba(255,255,255,.18); }
    .toc-side .brand .s { display:none; }.toc-side nav ol { display:flex; gap:5px; }.toc-side nav li { flex:0 0 auto; }
    .toc-side nav a.lvl-section { display:none; }.toc-side nav a.lvl-chapter { margin:0; padding:8px 11px; border:0; white-space:nowrap; }
    .main-inner { padding:20px 14px 60px; }.series-toolbar { margin-bottom:24px; }.series-toolbar span { display:none; }
    .page { padding:23px 20px; border-radius:15px; }.chapter-title-page { padding:42px 16px 28px; }
  }
  @media (max-width:560px) {
    html,body { font-size:16px; line-height:1.82; }.main-inner { padding:16px 8px 48px; }
    .series-toolbar { padding:6px 7px 14px; }.series-toolbar a { padding:7px 9px; font-size:11px; }
    h1.book-title { font-size:2.05em; }.book-sub { margin-bottom:24px; }
    .volume-strip { justify-content:flex-start; padding:0 7px; }.content-scope { margin-left:7px!important; margin-right:7px!important; }
    .page { padding:20px 15px; }.page p { text-align:left; text-indent:0; }.page h1 { font-size:1.45em; }
    .page h2 { font-size:1.22em; }.chapter-title-page .ctp-name { font-size:1.65em; }
  }
`;

html = html.replace("</style>", `${overrideCss}\n</style>`);

const imageNames = [...new Set([...html.matchAll(/src="images\/([^"]+)"/g)].map((match) => match[1]))];
const missingImages = [];

for (const imageName of imageNames) {
  if (imageName.includes("..") || path.isAbsolute(imageName)) {
    throw new Error(`非法图片路径：${imageName}`);
  }
  try {
    await copyFile(path.join(sourceDir, "images", imageName), path.join(outputImages, imageName));
  } catch {
    missingImages.push(imageName);
  }
}

if (missingImages.length) {
  throw new Error(`缺少 ${missingImages.length} 幅图片：${missingImages.slice(0, 5).join(", ")}`);
}

const forbidden = ["— P9 —", "— P10 —", "— P11 —", "— P12 —", "— P13 —", "— P403 —", "前言 Preface", "PaddleOCR", "[Unlabel", "�"];
const foundForbidden = forbidden.filter((token) => html.includes(token));
if (foundForbidden.length) {
  throw new Error(`仍含不应展示或异常内容：${foundForbidden.join(", ")}`);
}

await writeFile(path.join(outputDir, "index.html"), html, "utf8");

console.table({
  output: path.join(outputDir, "index.html"),
  pages: (html.match(/class="page"/g) || []).length,
  images: imageNames.length,
  chapters: (html.match(/class="chapter-title-page"/g) || []).length,
  sections: (html.match(/class="ch-anchor ch-anchor-section"/g) || []).length,
});
