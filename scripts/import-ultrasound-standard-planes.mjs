import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const sourceRoot = "E:/Book2Know/Us-rumen/超声标准切面图解_OCR";
const sourceHtmlPath = path.join(sourceRoot, "超声标准切面图解.html");
const outputRoot = path.join(repoRoot, "public", "ultrasound-standard-planes");
const assetRoot = path.join(scriptDir, "assets");

if (!outputRoot.startsWith(path.join(repoRoot, "public") + path.sep)) {
  throw new Error(`拒绝写入 public 目录之外的路径：${outputRoot}`);
}

function stripTags(value) {
  return value
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanChapterTitle(value) {
  return stripTags(value).replace("乳 腺", "乳腺");
}

function chapterName(value) {
  return cleanChapterTitle(value).replace(/^第\s*\d+\s*章\s*/, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ensureUniqueHeadingIds(content) {
  const seen = new Map();
  return content.replace(/<h([1-4]) class="([^"]*(?:chapter|section|major|sub)[^"]*)" id="([^"]+)"([^>]*)>([\s\S]*?)<\/h\1>/g, (full, tag, classes, id, rest, inner) => {
    const count = seen.get(id) || 0;
    seen.set(id, count + 1);
    const uniqueId = count ? `${id}-${count + 1}` : id;
    return `<h${tag} class="${classes}" id="${uniqueId}"${rest}>${inner}</h${tag}>`;
  });
}

function extractHeadings(content, fallbackTitle) {
  const headings = [];
  const pattern = /<h([1-4]) class="([^"]*(?:chapter|section|major|sub)[^"]*)" id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  for (const match of content.matchAll(pattern)) {
    const classes = match[2];
    const level = classes.includes("chapter") ? 1 : classes.includes("sub") ? 3 : 2;
    headings.push({ id: match[3], text: stripTags(match[4]), level });
  }
  if (!headings.length) headings.push({ id: "chapter-start", text: fallbackTitle, level: 1 });
  return headings;
}

async function copyInBatches(items, handler, size = 32) {
  for (let index = 0; index < items.length; index += size) {
    await Promise.all(items.slice(index, index + size).map(handler));
  }
}

let sourceHtml = await fs.readFile(sourceHtmlPath, "utf8");
sourceHtml = sourceHtml
  .replaceAll("第5章 乳 腺", "第5章 乳腺")
  .replace(
    '<p class="">四、前囟区经侧脑室体部冠状横切面前区经侧脑室体部冠状横切面见图2-4。</p>',
    '<h3 class="major" id="四-前囟区经侧脑室体部冠状横切面">四、 前囟区经侧脑室体部冠状横切面</h3>\n<p class="">前囟区经侧脑室体部冠状横切面见图2-4。</p>',
  )
  .replace('<p class="">五、哺乳期妇女乳腺正常彩色多普勒血流图</p>', '<h3 class="major" id="五-哺乳期妇女乳腺正常彩色多普勒血流图">五、 哺乳期妇女乳腺正常彩色多普勒血流图</h3>')
  .replace('<p class="">六、哺乳期妇女正常乳腺多普勒频谱</p>', '<h3 class="major" id="六-哺乳期妇女正常乳腺多普勒频谱">六、 哺乳期妇女正常乳腺多普勒频谱</h3>')
  .replace('<p class="">一、下腔静脉</p>', '<h3 class="major" id="一-下腔静脉">一、 下腔静脉</h3>')
  .replace('<p class="">一、经腹扫查子宫</p>', '<h3 class="major" id="一-经腹扫查子宫">一、 经腹扫查子宫</h3>');

const pageBlocks = [...sourceHtml.matchAll(/<section class="page"[^>]*data-source-page="\d+"[^>]*>[\s\S]*?<\/section>/g)].map((match) => match[0]);
const chapters = [];
let current = null;

for (const block of pageBlocks) {
  const chapterMatch = block.match(/<h1 class="chapter"[^>]*>([\s\S]*?)<\/h1>/);
  if (chapterMatch) {
    current = {
      number: chapters.length + 1,
      fullTitle: cleanChapterTitle(chapterMatch[1]),
      title: chapterName(chapterMatch[1]),
      slug: `chapter-${String(chapters.length + 1).padStart(2, "0")}`,
      blocks: [],
    };
    chapters.push(current);
  }
  if (!current) throw new Error("在第一个章节标题之前发现正文页，无法安全分章。");
  current.blocks.push(block);
}

if (chapters.length !== 14 || pageBlocks.length !== 476) {
  throw new Error(`章节解析结果异常：${chapters.length} 章，${pageBlocks.length} 页。`);
}

for (const chapter of chapters) {
  let content = chapter.blocks.join("\n");
  content = content.replace(/<h1 class="chapter"[^>]*>[\s\S]*?<\/h1>/, "");
  content = ensureUniqueHeadingIds(content).replaceAll('src="images/', 'src="../images/');
  const pages = [...content.matchAll(/data-source-page="(\d+)"/g)].map((match) => Number(match[1]));
  const imageNames = [...new Set([...content.matchAll(/src="\.\.\/images\/([^"]+)"/g)].map((match) => match[1]))];
  chapter.content = content;
  chapter.startPage = Math.min(...pages);
  chapter.endPage = Math.max(...pages);
  chapter.pageCount = pages.length;
  chapter.imageNames = imageNames;
  chapter.headings = extractHeadings(content, chapter.fullTitle);
}

const allImageNames = [...new Set(chapters.flatMap((chapter) => chapter.imageNames))];
await fs.rm(outputRoot, { recursive: true, force: true });
await fs.mkdir(path.join(outputRoot, "assets"), { recursive: true });
await fs.mkdir(path.join(outputRoot, "images"), { recursive: true });
await fs.copyFile(path.join(assetRoot, "ultrasound-standard-planes.css"), path.join(outputRoot, "assets", "reader.css"));
await fs.copyFile(path.join(assetRoot, "ultrasound-standard-planes.js"), path.join(outputRoot, "assets", "reader.js"));

await copyInBatches(allImageNames, async (imageName) => {
  const sourceImage = path.join(sourceRoot, "images", imageName);
  await fs.access(sourceImage);
  await fs.copyFile(sourceImage, path.join(outputRoot, "images", imageName));
});

const chapterOptions = chapters.map((chapter) => `<option value="../${chapter.slug}/index.html">${escapeHtml(chapter.fullTitle)}</option>`).join("");

for (const chapter of chapters) {
  const toc = [
    `<a class="toc-link level-1" href="#chapter-start">${escapeHtml(chapter.fullTitle)}</a>`,
    ...chapter.headings.filter((heading) => heading.level > 1).map((heading) => `<a class="toc-link level-${heading.level}" href="#${escapeHtml(heading.id)}">${escapeHtml(heading.text)}</a>`),
  ].join("\n");
  const options = chapterOptions.replace(`value="../${chapter.slug}/index.html"`, `value="../${chapter.slug}/index.html" selected`);
  const previous = chapters[chapter.number - 2];
  const next = chapters[chapter.number];
  const pager = [
    previous ? `<a href="../${previous.slug}/index.html"><small>← 上一章</small><strong>${escapeHtml(previous.fullTitle)}</strong></a>` : `<a href="../index.html"><small>← 返回</small><strong>全书章节目录</strong></a>`,
    next ? `<a href="../${next.slug}/index.html"><small>下一章 →</small><strong>${escapeHtml(next.fullTitle)}</strong></a>` : `<a href="../index.html"><small>完成阅读</small><strong>返回全书章节目录 →</strong></a>`,
  ].join("");
  const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="description" content="《超声标准切面图解》${escapeHtml(chapter.fullTitle)}在线分章阅读，正文与原书图片按页准确对应。"><title>${escapeHtml(chapter.fullTitle)}｜超声标准切面图解</title><link rel="stylesheet" href="../assets/reader.css"></head>
<body class="reader-page">
<aside class="reader-sidebar"><div class="sidebar-head"><a href="../index.html"><div class="sidebar-kicker">STANDARD ULTRASOUND PLANES</div><div class="sidebar-title">${escapeHtml(chapter.fullTitle)}</div></a><div class="sidebar-meta">原书页 ${chapter.startPage}–${chapter.endPage} · ${chapter.pageCount} 页 · ${chapter.imageNames.length} 张图</div><input id="toc-search" class="toc-search" type="search" placeholder="搜索本章目录" aria-label="搜索本章目录"></div><nav class="reader-toc" aria-label="本章目录">${toc}</nav></aside>
<div id="sidebar-scrim" class="sidebar-scrim"></div>
<header class="reader-topbar"><button id="reader-menu" class="reader-menu" type="button" aria-label="打开章节目录" aria-expanded="false">目录</button><a class="reader-back" href="../index.html">← 全书目录</a><select id="chapter-select" class="chapter-select" aria-label="切换章节">${options}</select><button class="reader-tool" data-font="down" type="button" aria-label="减小正文字号">A−</button><span id="font-value" class="font-value"></span><button class="reader-tool" data-font="up" type="button" aria-label="增大正文字号">A＋</button><div class="reading-progress" aria-hidden="true"><span></span></div></header>
<main class="reader-main"><article class="reader-article"><header id="chapter-start" class="chapter-hero"><div class="eyebrow">CHAPTER ${String(chapter.number).padStart(2, "0")} · ILLUSTRATED ATLAS</div><h1>${escapeHtml(chapter.fullTitle)}</h1><p>原书页 ${chapter.startPage}–${chapter.endPage} · ${chapter.pageCount} 个页面区块 · ${chapter.imageNames.length} 张配图。正文、图注与图片保持原书顺序。</p></header>${chapter.content}</article><nav class="chapter-pager" aria-label="章节翻页">${pager}</nav><div class="reader-note">内容用于医学教育与个人学习，不构成诊断或操作建议。原始资料可能存在少量文字识别偏差，涉及临床判断时请结合原书及权威指南核对。</div></main>
<button id="back-to-top" class="back-to-top" type="button" aria-label="返回顶部">↑</button><div id="lightbox" class="lightbox" aria-hidden="true"><img alt=""></div><script src="../assets/reader.js"></script></body></html>`;
  const chapterDir = path.join(outputRoot, chapter.slug);
  await fs.mkdir(chapterDir, { recursive: true });
  await fs.writeFile(path.join(chapterDir, "index.html"), html, "utf8");
}

const cards = chapters.map((chapter) => {
  const sectionHeadings = chapter.headings.filter((heading) => heading.level > 1);
  const searchText = [chapter.fullTitle, ...sectionHeadings.map((heading) => heading.text)].join(" ");
  const links = sectionHeadings.map((heading) => `<a class="level-${heading.level}" href="${chapter.slug}/index.html#${escapeHtml(heading.id)}">${escapeHtml(heading.text)}</a>`).join("");
  return `<article class="chapter-card" data-search="${escapeHtml(searchText)}"><a class="chapter-main" href="${chapter.slug}/index.html"><div class="chapter-label">CHAPTER ${String(chapter.number).padStart(2, "0")}</div><h2>${escapeHtml(chapter.title)}</h2><div class="chapter-meta">原书页 ${chapter.startPage}–${chapter.endPage} · ${chapter.pageCount} 页 · ${sectionHeadings.length} 个索引项 · ${chapter.imageNames.length} 张图</div><div class="chapter-open">进入本章阅读 →</div></a><details class="chapter-sections"><summary>展开本章索引</summary><div class="section-links">${links}</div></details></article>`;
}).join("\n");

const indexHtml = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="description" content="《超声标准切面图解》14章分章在线阅读，提供准确章节索引、目录搜索、原图放大及移动端适配。"><title>超声标准切面图解｜西瓜柚子</title><link rel="stylesheet" href="assets/reader.css"></head>
<body class="collection-page"><header class="site-header"><a class="brand" href="/"><span class="brand-dot"></span><span>XIGUA · YUZI</span></a><a class="back-link" href="/blog/imaging">医学影像栏目</a></header><main class="collection-shell"><section class="collection-hero"><div class="eyebrow">STANDARD ULTRASOUND PLANES · ILLUSTRATED ATLAS</div><h1>超声标准切面图解</h1><p>按原书14章拆分的图文学习入口。每章独立加载，正文、图注和配图按原书页面顺序对应；可通过全书章节、章内目录与关键词三种方式快速定位。</p><div class="collection-stats"><span><strong>${chapters.length}</strong> 章</span><span><strong>${pageBlocks.length}</strong> 个原书页区块</span><span><strong>${chapters.reduce((sum, chapter) => sum + chapter.headings.filter((heading) => heading.level > 1).length, 0)}</strong> 个章内索引</span><span><strong>${allImageNames.length}</strong> 张配图</span></div></section><section class="index-tools" aria-label="章节检索"><input id="chapter-search" class="index-search" type="search" placeholder="搜索章节或标准切面，例如：心脏、甲状腺、经腹扫查" aria-label="搜索全书章节"><span id="search-count" class="search-count"></span></section><section class="chapter-grid" aria-label="全书14章">${cards}</section><div class="collection-note">本项目用于医学教育与个人学习，不构成诊断或操作建议。涉及临床判断时，请结合原书、现行指南与实际临床情况核对。</div></main><script src="assets/reader.js"></script></body></html>`;

await fs.writeFile(path.join(outputRoot, "index.html"), indexHtml, "utf8");
await fs.writeFile(path.join(outputRoot, "manifest.json"), JSON.stringify({ title: "超声标准切面图解", chapters: chapters.map(({ number, slug, fullTitle, title, startPage, endPage, pageCount, imageNames, headings }) => ({ number, slug, fullTitle, title, startPage, endPage, pageCount, imageCount: imageNames.length, headings })) }, null, 2), "utf8");

console.log(`已生成：${outputRoot}`);
console.log(`${chapters.length} 章，${pageBlocks.length} 页，${allImageNames.length} 张图，${chapters.reduce((sum, chapter) => sum + chapter.headings.filter((heading) => heading.level > 1).length, 0)} 个章内索引。`);
