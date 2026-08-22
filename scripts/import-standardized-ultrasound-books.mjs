import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");

const books = [
  {
    slug: "practical-ultrasound-standardized-examination",
    sourceRoot: "E:/Book2Know/Us-xiti-wangyou/qifenzu/ocr_workspace/standard_full",
    sourceFile: "实用超声规范化检查与操作.html",
    title: "实用超声规范化检查与操作",
    summary: "六大系统检查路径、标准切面与操作要点",
    expected: { chapters: 6, pages: 264, images: 750 },
  },
  {
    slug: "echocardiography-notes-vol-1",
    sourceRoot: "E:/Book2Know/Us-xiti-wangyou/qifenzu/ocr_workspace/echo_full",
    sourceFile: "心超笔记_第1辑.html",
    title: "心超笔记·第1辑",
    summary: "基础、心功能、切面、血流动力学等八个专题",
    expected: { chapters: 8, pages: 205, images: 560 },
    promoteFirstSection: true,
  },
];

function learningStyles() {
  return `
<style id="xigua-standardized-reader-enhancements">
  :root {
    --nav: 316px;
    --canvas: #f4f8fc;
    --paper: #ffffff;
    --ink: #132e52;
    --muted: #607694;
    --line: #d8e5f1;
    --soft: #f6faff;
    --brand: #1769b0;
    --brand-soft: #eaf4ff;
    --size: 18px;
  }
  body {
    background: radial-gradient(circle at 100% 0, rgba(139, 207, 240, .2), transparent 30rem), var(--canvas);
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  }
  .sidebar { background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%); border-right-color: var(--line); scrollbar-color: #bad0e5 transparent; }
  .nav-head { padding: 20px 18px 15px; border-bottom-color: var(--line); }
  .kicker, .nav-title { color: var(--ink); }
  .nav-meta { color: var(--muted); line-height: 1.65; }
  .nav-tree { padding: 9px 12px 34px; }
  .nav-tree a { color: #405b7d; }
  .nav-tree a:hover, .nav-tree a.active { color: var(--brand); background: var(--brand-soft); }
  .nav-tree .l1 { color: var(--ink); border-top-color: var(--line); }
  .topbar { height: 64px; padding: 0 24px; background: rgba(255, 255, 255, .9); border-bottom-color: var(--line); box-shadow: 0 5px 24px rgba(28, 74, 116, .05); }
  .book-name { color: var(--ink); }
  .tool, .content-search { min-height: 38px; border-color: var(--line); border-radius: 10px; color: var(--ink); background: #fff; }
  .tool:hover { background: var(--brand-soft); border-color: #bad5ed; }
  .content-search:focus { outline: 3px solid rgba(23, 105, 176, .16); border-color: var(--brand); }
  .reader { padding: 88px 30px 92px; }
  .book { width: min(100%, 980px); border-color: var(--line); border-radius: 18px; box-shadow: 0 18px 55px rgba(26, 74, 119, .1); padding: 38px 78px 88px; }
  .title-page { padding: 14px 0 25px; margin-bottom: 20px; border-bottom: 3px solid var(--brand); }
  .title-page .eyebrow { color: var(--brand); }
  .title-page h1 { margin: 7px 0; color: var(--ink); font-size: clamp(28px, 4vw, 38px); }
  .title-page p { margin: 0; color: var(--muted); font-size: 14px; }
  .page, .page + .page { margin-top: 13px; padding-top: 0; border-top: 0; }
  h1, h2, h3, h4, h5, h6 { color: var(--ink); }
  h1.chapter { margin: 30px 0 22px; border-top-color: var(--brand); border-bottom-color: #b9d6ec; background: linear-gradient(90deg, #eaf4ff, #ffffff); color: var(--ink); }
  h2.section { margin: 24px 0 13px; border-bottom-color: var(--brand); color: var(--ink); }
  h3.major { margin: 18px 0 9px; color: #24527d; }
  h4.sub { margin: 15px 0 7px; color: #3f6388; }
  p { margin: .46em 0; color: #263f5c; line-height: 1.95; }
  .source-page { margin-bottom: 6px; color: #547291; background: #f0f7fd; }
  .image-block { margin: 13px auto; }
  .image-block img { border-color: #e0ebf4; box-shadow: 0 4px 15px rgba(25, 71, 112, .11); }
  .image-block figcaption, .caption { color: #5c7692; }
  .table-wrap { margin: 14px 0; border-color: #cddfed; }
  tr:first-child td, tr:first-child th { background: #eaf4ff; }
  .formula { border-left-color: var(--brand); background: #f6faff; }
  .notice { margin-top: 30px; background: #f2f8ff; border-left-color: var(--brand); color: #526b88; }
  .reader-back { display: inline-flex; align-items: center; min-height: 30px; margin: 0 0 10px; color: var(--brand); font-size: 12px; font-weight: 750; text-decoration: none; }
  .reader-back:hover { color: #0b4f8e; text-decoration: underline; text-underline-offset: 3px; }
  .topbar .reader-back { margin: 0 0 0 2px; padding: 0 11px; border: 1px solid var(--line); border-radius: 999px; background: #fff; white-space: nowrap; }
  .topbar .reader-back:hover { background: var(--brand-soft); text-decoration: none; }
  @media (max-width: 1050px) {
    .topbar { padding: 0 20px; }
    .menu { display: block; min-width: 54px; color: var(--brand); font-weight: 750; }
    .reader { padding: 82px 28px 80px; }
    .book { padding: 34px 56px 76px; }
  }
  @media (max-width: 780px) {
    :root { --size: 18px; }
    html { scroll-padding-top: 76px; }
    .sidebar { width: min(88vw, 360px); }
    .nav-head { padding: 19px 16px 13px; }
    .nav-tree { padding: 8px 10px 28px; }
    .nav-tree a { display: flex; align-items: center; min-height: 42px; padding-top: 8px; padding-bottom: 8px; }
    .nav-tree .l2 { padding-left: 19px; }
    .nav-tree .l3 { padding-left: 31px; }
    .topbar { height: 62px; padding: 0 14px; gap: 8px; }
    .book-name { font-size: 14px; }
    #font-down, #font-up, #font-value { display: none; }
    .content-search { width: min(36vw, 154px); min-width: 0; }
    .search-count, .search-step { display: none; }
    .reader { padding: 76px 0 66px; }
    .book { border: 0; border-radius: 0; box-shadow: none; padding: 26px 20px 70px; }
    .title-page { padding: 8px 0 20px; margin-bottom: 13px; }
    .title-page h1 { font-size: 28px; }
    h1.chapter { margin: 26px 0 19px; padding: 15px 16px; font-size: clamp(26px, 7vw, 32px); }
    h2.section { margin: 21px 0 12px; font-size: clamp(21px, 5.8vw, 26px); }
    h3.major { font-size: clamp(19px, 5vw, 22px); }
    h4.sub { font-size: 18px; }
    p { font-size: 17px; line-height: 1.9; text-align: left; }
    .source-page { float: none; display: inline-block; margin: 0 0 6px; }
    .image-block { margin: 12px auto; }
    .image-block figcaption, .caption { font-size: 13px; line-height: 1.6; }
    .table-wrap { margin-left: -4px; margin-right: -4px; border-radius: 8px; }
    .back { right: 16px; bottom: 16px; width: 46px; height: 46px; background: var(--brand); box-shadow: 0 10px 24px rgba(23, 105, 176, .28); }
  }
  @media (max-width: 430px) { .topbar .reader-back { display: none; } }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; } }
</style>`;
}

function normalizeBookHtml(source, book) {
  const sidebarBack = '<a class="reader-back" href="/blog/imaging">← 返回医学影像</a>';
  const topbarBack = '<a class="reader-back" href="/blog/imaging">返回栏目</a>';
  const titlePage = `<div class="title-page"><div class="eyebrow">医学影像 · 在线学习版</div><h1>${book.title}</h1><p>${book.summary} · 章节导航 · 图文对应 · 图片可放大</p></div>`;
  let html = source
    .replace(/<meta[^>]+name="generator"[^>]*>/i, '<meta name="generator" content="Xigua Yuzi learning edition">')
    .replace(/<meta[^>]+name="viewport"[^>]*>/i, '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">')
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${book.title} | 西瓜柚子</title>`)
    .replace(/<div class="nav-head">/i, `<div class="nav-head">${sidebarBack}`)
    .replace(/<div class="kicker">扫描版整理<\/div>/i, '<div class="kicker">医学影像 · 在线学习</div>')
    .replace(/<div class="nav-meta">[\s\S]*?<\/div>/i, '<div class="nav-meta">章节导航 · 正文可检索 · 图片可放大</div>')
    .replace(/<div class="title-page">[\s\S]*?<\/div>(?=<section class="page")/i, titlePage)
    .replace(/<div class="notice">[\s\S]*?<\/div>/i, '<div class="notice">本在线版用于医学教育与个人学习，章节、正文与图片按原书页面顺序保留。涉及临床判断时，请结合原书、现行指南与实际临床情况核对。</div>')
    .replaceAll('Book2Know PaddleOCR-VL pipeline', 'Xigua Yuzi learning edition')
    .replaceAll('ocr-font', 'reader-font')
    .replace(/<\/head>/i, `${learningStyles()}</head>`);

  html = html.replace(
    `<div class="book-name">${book.title.replace('·', ' ')}</div>`,
    `<div class="book-name">${book.title}</div>${topbarBack}`,
  );

  if (book.promoteFirstSection) {
    html = html.replace(
      '<h2 class="section" data-nav="2" id="基础篇">基础篇</h2>',
      '<h1 class="chapter" data-nav="1" id="基础篇">基础篇</h1>',
    );
  }

  if (/\bOCR\b/i.test(html)) throw new Error(`${book.title} 仍包含不应展示的处理标记`);
  return html;
}

async function auditBook(html, book) {
  const pages = [...html.matchAll(/<section[^>]*class="page"[^>]*data-source-page="(\d+)"/g)].map((match) => Number(match[1]));
  const chapters = [...html.matchAll(/<h1[^>]*class="[^"]*chapter[^"]*"[^>]*>(.*?)<\/h1>/g)];
  const imageRefs = [...html.matchAll(/(?:src|href)="images\/([^"]+)"/g)].map((match) => match[1]);
  const imageRoot = path.join(book.sourceRoot, 'images');

  if (pages.length !== book.expected.pages) throw new Error(`${book.title} 内容页数异常：${pages.length}`);
  if (chapters.length !== book.expected.chapters) throw new Error(`${book.title} 章节数异常：${chapters.length}`);
  if (imageRefs.length !== book.expected.images || new Set(imageRefs).size !== book.expected.images) throw new Error(`${book.title} 图片引用数异常：${imageRefs.length}`);
  if (pages.some((page, index) => index > 0 && page < pages[index - 1])) throw new Error(`${book.title} 内容页顺序存在倒退`);

  const imagePages = imageRefs.map((image) => Number(/^p(\d+)_/.exec(image)?.[1] ?? 0));
  if (imagePages.some((page, index) => index > 0 && page < imagePages[index - 1])) throw new Error(`${book.title} 图片顺序存在倒退`);
  for (const imageRef of imageRefs) await access(path.join(imageRoot, imageRef));

  return {
    chapters: chapters.map((match) => match[1].replace(/<[^>]+>/g, '').trim()),
    contentPages: pages.length,
    firstSourcePage: pages[0],
    lastSourcePage: pages.at(-1),
    images: imageRefs.length,
    imageRefs,
  };
}

async function importBook(book) {
  const sourceHtml = await readFile(path.join(book.sourceRoot, book.sourceFile), 'utf8');
  const html = normalizeBookHtml(sourceHtml, book);
  const audit = await auditBook(html, book);
  const { imageRefs, ...auditManifest } = audit;
  const outputRoot = path.join(repoRoot, 'public', book.slug);
  const outputImages = path.join(outputRoot, 'images');

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputImages, { recursive: true });
  for (const imageRef of imageRefs) {
    const destination = path.join(outputImages, imageRef);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(path.join(book.sourceRoot, 'images', imageRef), destination);
  }
  await writeFile(path.join(outputRoot, 'index.html'), html, 'utf8');
  await writeFile(path.join(outputRoot, 'manifest.json'), `${JSON.stringify({ title: book.title, category: '医学影像', audit: auditManifest }, null, 2)}\n`, 'utf8');
  console.log(`${book.title}：${audit.chapters.length} 个章节、${audit.contentPages} 个内容页、${audit.images} 张图片，原书页 ${audit.firstSourcePage}-${audit.lastSourcePage}。`);
}

for (const book of books) await importBook(book);
