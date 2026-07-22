import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceDir = "E:\\Book2Know\\Huabin\\华斌笔记第3辑_OCR";
const sourceHtml = path.join(sourceDir, "华斌的超声笔记_第3辑.html");
const outputDir = "E:\\Web\\xiguayouzi_blog\\public\\huabin-ultrasound-notes\\volume-3";
const outputImages = path.join(outputDir, "images");

await mkdir(outputImages, { recursive: true });

let html = await readFile(sourceHtml, "utf8");

const firstChapter = '<div class="chapter-title-page" id="ch1">';
const firstChapterAt = html.indexOf(firstChapter);
const bookSubAt = html.indexOf('<div class="book-sub">');
const bookSubEnd = html.indexOf("</div>", bookSubAt) + "</div>".length;

if (firstChapterAt < 0 || bookSubAt < 0 || bookSubEnd < 0) {
  throw new Error("无法定位第3辑标题与第一章边界");
}

const seriesNotice = `
  <div class="volume-strip" aria-label="系列进度">
    <a href="../index.html">华斌笔记系列</a>
    <a href="../volume-2/index.html">第2辑 · 已上线</a>
    <span class="active">第3辑 · 已上线</span>
    <span>其余4辑 · 待更新</span>
  </div>
  <p class="content-scope">本页保留第3辑正文内容（P19–P276），OCR生成说明不展示。</p>

`;

html = html.slice(0, bookSubEnd) + seriesNotice + html.slice(firstChapterAt);

const footerAt = html.indexOf('<div class="footer-note">');
const footerEnd = footerAt < 0 ? -1 : html.indexOf("</div>", footerAt) + "</div>".length;

if (footerAt < 0 || footerEnd < 0) {
  throw new Error("无法定位第3辑 OCR 生成说明");
}

html = html.slice(0, footerAt) + html.slice(footerEnd);

html = html
  .replaceAll("华斌的超声笔记 · 第3辑", "华斌笔记 · 第3辑")
  .replace('<div class="t">华斌的超声笔记</div>', '<div class="t">华斌笔记</div>')
  .replace('<div class="s">第 3 辑 · 彩图版</div>', '<div class="s">第3辑 · 正文版</div>')
  .replace('<div class="meta-top">超声医学 · 临床笔记</div>', '<div class="meta-top">医学影像 · 华斌笔记系列</div>')
  .replace('<h1 class="book-title">华斌的超声笔记</h1>', '<h1 class="book-title">华斌笔记</h1>')
  .replace('<div class="book-sub">第 3 辑 · 彩图版</div>', '<div class="book-sub">第3辑 · 超声临床笔记正文</div>')
  .replace('<div class="main-inner">', `<div class="main-inner">
  <nav class="series-toolbar"><a href="../index.html">← 系列目录</a><a href="/blog/imaging">医学影像栏目</a><span>XIGUA · YUZI</span></nav>`)
  .replace(/([≤≥])q(?=\d)/g, "$1")
  .replaceAll("<img ", '<img loading="lazy" decoding="async" ');

const volume2Importer = await readFile(
  "E:\\Web\\xiguayouzi_blog\\scripts\\import-huabin-notes-volume2.mjs",
  "utf8",
);
const overrideCss = volume2Importer.match(/const overrideCss = `([\s\S]*?)`;\s*\n\s*html = html\.replace/);

if (!overrideCss) {
  throw new Error("无法读取第2辑的统一阅读样式");
}

html = html.replace("</style>", `${overrideCss[1]}\n</style>`);

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

const expected = { pages: 250, images: 361, chapters: 6, sections: 92 };
const actual = {
  pages: (html.match(/class="page"/g) || []).length,
  images: imageNames.length,
  chapters: (html.match(/class="chapter-title-page"/g) || []).length,
  sections: (html.match(/class="ch-anchor ch-anchor-section"/g) || []).length,
};

for (const key of Object.keys(expected)) {
  if (actual[key] !== expected[key]) {
    throw new Error(`${key} 数量异常：预期 ${expected[key]}，实际 ${actual[key]}`);
  }
}

const forbidden = ["�", "[Unlabel", "锟", "鈥", "ï", "â", "PaddleOCR", "≤q", "≥q", '<div class="footer-note">'];
const foundForbidden = forbidden.filter((token) => html.includes(token));
if (foundForbidden.length) {
  throw new Error(`仍含异常或不展示内容：${foundForbidden.join(", ")}`);
}

if (!html.includes("— P19 —") || !html.includes("— P276 —")) {
  throw new Error("第3辑正文首尾页校验失败");
}

await writeFile(path.join(outputDir, "index.html"), html, "utf8");

console.table({ output: path.join(outputDir, "index.html"), ...actual });
