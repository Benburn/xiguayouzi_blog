import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const sourceRoot = "E:/Book2Know/US-taier/胎儿超声扫查技巧图解";
const sourceHtmlPath = path.join(sourceRoot, "胎儿超声扫查技巧图解.html");
const sourceImages = path.join(sourceRoot, "images");
const outputRoot = path.join(repoRoot, "public", "fetal-ultrasound-scanning-guide");

const enhancements = `
<style id="xigua-fetal-ultrasound-enhancements">
  :root {
    --nav: 316px;
    --canvas: #f4f8fc;
    --paper: #ffffff;
    --ink: #132e52;
    --muted: #607694;
    --line: #d8e5f1;
    --brand: #1769b0;
    --brand-soft: #eaf4ff;
    --size: 18px;
  }
  body {
    background:
      radial-gradient(circle at 100% 0, rgba(139, 207, 240, .2), transparent 30rem),
      var(--canvas);
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  }
  .sidebar {
    background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
    scrollbar-color: #bad0e5 transparent;
  }
  .nav-head { padding: 22px 18px 16px; }
  .nav-title { color: var(--ink); line-height: 1.35; }
  .nav-meta { color: var(--muted); line-height: 1.65; }
  .nav-search {
    min-height: 42px;
    border-color: var(--line);
    border-radius: 11px;
    color: var(--ink);
    background: #ffffff;
  }
  .nav-search:focus { outline: 3px solid rgba(23, 105, 176, .16); border-color: var(--brand); }
  .nav-tree { padding: 10px 12px 38px; }
  .nav-tree a { color: #405b7d; }
  .nav-tree a:hover, .nav-tree a.active { color: var(--brand); background: var(--brand-soft); }
  .nav-tree a.l1 { color: var(--ink); border-top-color: var(--line); }
  .nav-tree a.l2, .nav-tree a.l3, .nav-tree a.l4 { border-left-color: #c9def1; }
  .topbar {
    height: 64px;
    padding: 0 24px;
    background: rgba(255, 255, 255, .9);
    border-bottom-color: var(--line);
    box-shadow: 0 5px 24px rgba(28, 74, 116, .05);
  }
  .book-name { color: var(--ink); font-size: 15px; }
  .reader { padding: 100px 30px 112px; }
  .book {
    width: min(100%, 980px);
    border-color: var(--line);
    border-radius: 18px;
    box-shadow: 0 18px 55px rgba(26, 74, 119, .1);
    padding: 62px 78px 116px;
  }
  .page h1, .page h2, .page h3, .page h4, .page h5 { color: var(--ink); }
  .page h1.chapter {
    border-top-color: var(--brand);
    border-bottom-color: #b9d6ec;
    background: linear-gradient(90deg, #eaf4ff, #ffffff);
  }
  .page h2.section { border-left-color: var(--brand) !important; background: linear-gradient(90deg, #eef7ff, transparent) !important; }
  .page h3.major { border-left-color: #75abd6 !important; }
  .page h4.sub { color: #24527d; border-left-color: #b3d1ea !important; }
  .page h5.detail { color: #24527d; border-left-color: #c8deef; }
  .page p { color: #263f5c; line-height: 2; }
  .source-page { color: #547291; background: #f0f7fd; }
  .table-wrap { border-color: #cddfed; }
  .table-wrap tr:first-child td, .table-wrap tr:first-child th { background: #eaf4ff; }
  .formula { border-left-color: var(--brand); background: #f6faff; }
  .footnote { border-color: #cfe1ef; background: #f7fbff; color: #506985; }
  .notice { background: #f2f8ff; color: #526b88; border-left: 3px solid var(--brand); }
  .back { background: var(--brand); box-shadow: 0 10px 24px rgba(23, 105, 176, .28); }
  .reader-back {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    margin: 0 0 13px;
    color: var(--brand);
    font-size: 12px;
    font-weight: 750;
    letter-spacing: .02em;
    text-decoration: none;
  }
  .reader-back:hover { color: #0b4f8e; text-decoration: underline; text-underline-offset: 3px; }
  .topbar .reader-back { margin: 0 0 0 auto; padding: 0 12px; border: 1px solid var(--line); border-radius: 999px; background: #fff; }
  .topbar .reader-back:hover { background: var(--brand-soft); text-decoration: none; }
  .menu {
    display: none;
    min-height: 40px;
    padding: 0 12px;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--brand);
    background: #fff;
    font-size: 13px;
    font-weight: 750;
  }
  .menu:focus-visible, .topbar .reader-back:focus-visible, .reader-back:focus-visible { outline: 3px solid rgba(23, 105, 176, .2); outline-offset: 2px; }
  @media (max-width: 1050px) {
    .topbar { padding: 0 20px; }
    .menu { display: inline-flex; align-items: center; justify-content: center; }
    .reader { padding: 88px 28px 88px; }
    .book { padding: 54px 58px 96px; }
  }
  @media (max-width: 780px) {
    :root { --size: 18px; }
    html { scroll-padding-top: 76px; }
    .sidebar { width: min(88vw, 360px); }
    .nav-head { padding: 20px 16px 14px; }
    .nav-title { font-size: 19px; }
    .nav-tree { padding: 8px 10px 30px; }
    .nav-tree a { min-height: 42px; display: flex; align-items: center; padding-top: 8px; padding-bottom: 8px; }
    .nav-tree a.l2 { padding-left: 19px; }
    .nav-tree a.l3 { padding-left: 31px; }
    .nav-tree a.l4 { padding-left: 42px; }
    .topbar { height: 62px; padding: 0 14px; gap: 9px; }
    .book-name { font-size: 14px; }
    .topbar .reader-back { min-height: 36px; padding: 0 10px; font-size: 11px; }
    .reader { padding: 78px 0 70px; }
    .book { border: 0; border-radius: 0; box-shadow: none; padding: 32px 20px 78px; }
    .page h1.chapter { margin: 28px 0 23px; padding: 16px 16px; font-size: clamp(27px, 7vw, 33px); }
    .page h2.section { margin-top: 28px !important; font-size: clamp(22px, 5.7vw, 27px); }
    .page h3.major { font-size: clamp(19px, 5vw, 22px); }
    .page h4.sub { font-size: 18px; }
    .page p { font-size: 17px; line-height: 1.95; text-align: left; }
    .image-block { margin: 17px auto; }
    .image-block figcaption { font-size: 13px; line-height: 1.65; }
    .source-page { float: none; display: inline-block; margin: 0 0 8px; }
    .table-wrap { margin-left: -4px; margin-right: -4px; border-radius: 8px; }
    .back { width: 46px; height: 46px; right: 16px; bottom: 16px; }
  }
  @media (max-width: 390px) {
    .topbar .reader-back { display: none; }
    .book { padding-left: 16px; padding-right: 16px; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
  }
</style>`;

function normalizeBookHtml(source) {
  const sidebarBack = '<a class="reader-back" href="/blog/imaging">← 返回医学影像</a>';
  const topbarBack = '<a class="reader-back" href="/blog/imaging">返回栏目</a>';

  return source
    .replace(/<meta name="generator"[^>]*>/i, '<meta name="generator" content="Xigua Yuzi learning edition">')
    .replace(/<meta name="viewport"[^>]*>/i, '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">')
    .replace(/<title>[\s\S]*?<\/title>/i, '<title>胎儿超声扫查技巧图解 | 西瓜柚子</title>')
    .replace(/\s+data-ocr-image="[^"]*"/gi, '')
    .replace('<div class="nav-meta">章节导航 · 按标题层级整理 · 原页可回查</div>', '<div class="nav-meta">15 章完整内容 · 按标题层级整理</div>')
    .replace('<input class="nav-search"', `${sidebarBack}<input class="nav-search"`)
    .replace('<header class="topbar"><button class="menu" aria-label="打开目录">目录</button><span class="book-name">胎儿超声扫查技巧图解</span></header>', `<header class="topbar"><button class="menu" aria-label="打开目录">目录</button><span class="book-name">胎儿超声扫查技巧图解</span>${topbarBack}</header>`)
    .replace(/<div class="notice">[\s\S]*?<\/div>/i, '<div class="notice">本在线版用于医学教育与个人学习，保留章节、正文与图片的原始对应顺序。涉及临床判断时，请结合原书、现行指南与实际临床情况核对。</div>')
    .replace(/<\/head>/i, `${enhancements}</head>`);
}

async function assertImportIntegrity(html) {
  const pages = [...html.matchAll(/<section class="page"[^>]*data-source-page="(\d+)"/g)].map((match) => Number(match[1]));
  const chapters = [...html.matchAll(/<h1 class="chapter"[^>]*>(.*?)<\/h1>/g)];
  const imageRefs = [...html.matchAll(/src="images\/([^"]+)"/g)].map((match) => match[1]);

  if (chapters.length !== 15) throw new Error(`章节数异常：预期 15，实际 ${chapters.length}`);
  if (pages.length !== 463) throw new Error(`内容页数异常：预期 463，实际 ${pages.length}`);
  if (imageRefs.length !== 596 || new Set(imageRefs).size !== 596) throw new Error(`图片引用数异常：预期 596，实际 ${imageRefs.length}`);
  if (pages.some((page, index) => index > 0 && page < pages[index - 1])) throw new Error('内容页顺序存在倒退');

  for (const imageRef of imageRefs) {
    await access(path.join(sourceImages, imageRef));
  }

  return {
    chapters: chapters.map((match) => match[1].replace(/<[^>]+>/g, '').trim()),
    contentPages: pages.length,
    firstSourcePage: pages[0],
    lastSourcePage: pages.at(-1),
    images: imageRefs.length,
    imageRefs,
  };
}

async function main() {
  const source = await readFile(sourceHtmlPath, 'utf8');
  const html = normalizeBookHtml(source);
  const audit = await assertImportIntegrity(html);
  const { imageRefs, ...auditManifest } = audit;

  await rm(outputRoot, { recursive: true, force: true });
  const outputImages = path.join(outputRoot, 'images');
  await mkdir(outputImages, { recursive: true });
  for (const imageRef of imageRefs) {
    const destination = path.join(outputImages, imageRef);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(path.join(sourceImages, imageRef), destination);
  }
  await writeFile(path.join(outputRoot, 'index.html'), html, 'utf8');
  await writeFile(path.join(outputRoot, 'manifest.json'), `${JSON.stringify({
    title: '胎儿超声扫查技巧图解',
    category: '医学影像',
    audit: auditManifest,
  }, null, 2)}\n`, 'utf8');

  console.log(`已生成 ${outputRoot}`);
  console.log(`完整性核对通过：${audit.chapters.length} 章、${audit.contentPages} 个内容页、${audit.images} 张图片，原书页 ${audit.firstSourcePage}-${audit.lastSourcePage}。`);
}

await main();
