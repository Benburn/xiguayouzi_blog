import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const sourceRoot = "E:/Book2Know/US-linchuang/临床超声医学实践-html";
const outputRoot = path.join(repoRoot, "public", "clinical-ultrasound-practice");

const enhancement = `
<style id="xigua-book-enhancements">
  .xigua-book-back { position: fixed; z-index: 20; right: max(16px, env(safe-area-inset-right)); bottom: max(16px, env(safe-area-inset-bottom)); display:inline-flex; align-items:center; min-height:42px; padding:0 15px; border-radius:999px; background:#0d5d57; color:#fff !important; box-shadow:0 10px 24px rgba(13,93,87,.24); text-decoration:none !important; font:700 13px/1 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif; }
  .xigua-book-back:hover { background:#147d72; transform:translateY(-2px); }
  @media (max-width:720px) { .xigua-book-back { right:12px; bottom:max(12px, env(safe-area-inset-bottom)); min-height:44px; padding:0 13px; } }
  @media (prefers-reduced-motion: reduce) { .xigua-book-back { transition:none; } }
</style>`;
const backLink = `<a class="xigua-book-back" href="/blog/imaging/clinical-ultrasound-practice">返回医学影像文章</a>`;
const tocTools = `<div class="toc-tools"><label class="toc-search" for="toc-search"><span>搜索目录</span><input id="toc-search" type="search" placeholder="输入章节、器官或疾病名称" autocomplete="off"></label><div class="toc-actions"><button id="toc-expand" type="button">展开全部</button><button id="toc-collapse" type="button">收起全部</button></div><p id="toc-result" aria-live="polite">按原书章节浏览</p></div>`;
const tocRuntime = `<script id="xigua-toc-runtime">
(() => {
  const source = document.querySelector('.toc-list');
  if (!source) return;

  const browser = document.createElement('div');
  browser.className = 'toc-browser';
  let group = null;
  let sectionItems = null;
  let chapterIndex = 0;

  const createGroup = (title, href = '') => {
    const details = document.createElement('details');
    details.className = 'toc-chapter';
    details.open = chapterIndex < 2;
    const summary = document.createElement('summary');
    const label = href ? document.createElement('a') : document.createElement('span');
    if (href) label.href = href;
    label.textContent = title;
    summary.append(label);
    const body = document.createElement('div');
    body.className = 'toc-chapter__body';
    details.append(summary, body);
    browser.append(details);
    chapterIndex += 1;
    return body;
  };

  [...source.children].forEach((item) => {
    const original = item.querySelector(':scope > a');
    if (!original) return;
    const text = original.textContent.trim();
    const href = original.getAttribute('href') || '';

    if (/^第[一二三四五六七八九十百\\d]+章/.test(text)) {
      group = createGroup(text, href);
      sectionItems = null;
      return;
    }

    if (!group) group = createGroup('书前信息');

    if (/^第\\d+节/.test(text)) {
      const section = document.createElement('section');
      section.className = 'toc-section';
      const title = original.cloneNode(true);
      title.className = 'toc-section__title';
      sectionItems = document.createElement('div');
      sectionItems.className = 'toc-section__items';
      section.append(title, sectionItems);
      group.append(section);
      return;
    }

    const link = original.cloneNode(true);
    link.className = 'toc-subitem';
    (sectionItems || group).append(link);
  });

  source.replaceWith(browser);

  const input = document.getElementById('toc-search');
  const result = document.getElementById('toc-result');
  const groups = [...browser.querySelectorAll('.toc-chapter')];

  const filter = () => {
    const query = input.value.trim().toLocaleLowerCase('zh-CN');
    let matches = 0;

    groups.forEach((details) => {
      const chapterLabel = details.querySelector('summary').textContent.trim().toLocaleLowerCase('zh-CN');
      const chapterMatch = Boolean(query && chapterLabel.includes(query));
      const standalone = [...details.querySelectorAll(':scope > .toc-chapter__body > .toc-subitem')];

      standalone.forEach((link) => {
        const match = !query || chapterMatch || link.textContent.toLocaleLowerCase('zh-CN').includes(query);
        link.hidden = !match;
        if (query && link.textContent.toLocaleLowerCase('zh-CN').includes(query)) matches += 1;
      });

      let visibleSections = 0;
      details.querySelectorAll('.toc-section').forEach((section) => {
        const title = section.querySelector('.toc-section__title');
        const titleMatch = Boolean(query && title.textContent.toLocaleLowerCase('zh-CN').includes(query));
        let childMatches = 0;
        section.querySelectorAll('.toc-subitem').forEach((link) => {
          const directMatch = Boolean(query && link.textContent.toLocaleLowerCase('zh-CN').includes(query));
          const show = !query || chapterMatch || titleMatch || directMatch;
          link.hidden = !show;
          if (directMatch) childMatches += 1;
        });
        section.hidden = Boolean(query && !chapterMatch && !titleMatch && childMatches === 0);
        if (!section.hidden) visibleSections += 1;
        if (titleMatch) matches += 1;
        matches += childMatches;
      });

      const hasStandalone = standalone.some((link) => !link.hidden);
      details.hidden = Boolean(query && !chapterMatch && !hasStandalone && visibleSections === 0);
      if (query && !details.hidden) details.open = true;
      if (chapterMatch) matches += 1;
    });

    result.textContent = query ? '找到 ' + matches + ' 个匹配目录' : '按原书章节浏览';
  };

  input.addEventListener('input', filter);
  document.getElementById('toc-expand').addEventListener('click', () => groups.forEach((item) => { item.open = true; }));
  document.getElementById('toc-collapse').addEventListener('click', () => groups.forEach((item) => { item.open = false; }));
})();
</script>`;

async function main() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  for (const dir of ["assets", "css"]) {
    await cp(path.join(sourceRoot, dir), path.join(outputRoot, dir), { recursive: true });
  }
  await mkdir(path.join(outputRoot, "chapters"), { recursive: true });
  for (const name of ["text00000.html", "text00001.html", "text00002.html"]) {
    await cp(path.join(sourceRoot, "chapters", name), path.join(outputRoot, "chapters", name));
  }

  let indexHtml = await readFile(path.join(sourceRoot, "index.html"), "utf8");
  indexHtml = indexHtml
    .replace(/\s*<aside class="note-panel">[\s\S]*?<\/aside>/i, "")
    .replace(/<ol class="toc-list">/i, `${tocTools}<ol class="toc-list">`)
    .replace(/<\/head>/i, `${enhancement}</head>`)
    .replace(/<\/body>/i, `${tocRuntime}${backLink}</body>`);
  await writeFile(path.join(outputRoot, "index.html"), indexHtml, "utf8");

  for (const name of ["text00000.html", "text00001.html", "text00002.html"]) {
    const file = path.join(outputRoot, "chapters", name);
    let html = await readFile(file, "utf8");
    const prev = name === "text00000.html" ? "" : `<a class="book-nav__prev" href="${name === "text00001.html" ? "text00000.html" : "text00001.html"}">上一章</a>`;
    const next = name === "text00002.html" ? "" : `<a class="book-nav__next" href="${name === "text00000.html" ? "text00001.html" : "text00002.html"}">下一章</a>`;
    html = html
      .replace(/<\/nav>/i, `${prev}<a class="book-nav__toc" href="../index.html">目录</a>${next}</nav>`)
      .replace(/<\/head>/i, `${enhancement}</head>`)
      .replace(/<\/body>/i, `${backLink}</body>`);
    await writeFile(file, html, "utf8");
  }
  const cssFile = path.join(outputRoot, "css", "book.css");
  let css = await readFile(cssFile, "utf8");
  css += `\n/* 西瓜柚子：目录与移动端图文阅读优化 */
.book-image { max-width:100%; height:auto; }
.index-hero { min-height:min(520px,62vh); padding-top:44px; padding-bottom:34px; }
.index-main { display:block; max-width:1200px; }
.toc-panel { max-width:1040px; }
.toc-tools { position:sticky; top:0; z-index:8; display:grid; grid-template-columns:minmax(280px,1fr) auto; gap:10px 18px; align-items:end; margin:0 0 22px; padding:14px 0; background:rgba(247,250,249,.94); backdrop-filter:blur(14px); border-bottom:1px solid var(--line); }
.toc-search { display:grid; gap:7px; color:var(--accent-dark); font-size:.82rem; font-weight:700; }
.toc-search input { width:100%; min-height:48px; padding:0 16px; border:1px solid var(--line); border-radius:12px; background:#fff; color:var(--ink); font:inherit; outline:none; }
.toc-search input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(20,125,114,.12); }
.toc-actions { display:flex; gap:8px; }
.toc-actions button { min-height:44px; padding:0 14px; border:1px solid var(--line); border-radius:12px; background:#fff; color:var(--accent-dark); font:700 .84rem/1 inherit; cursor:pointer; }
.toc-actions button:hover { border-color:var(--accent); color:var(--accent); }
.toc-actions button:active { transform:translateY(1px); }
#toc-result { grid-column:1 / -1; margin:0; color:var(--muted); font-size:.8rem; }
.toc-browser { border-top:2px solid var(--accent-dark); }
.toc-chapter { border-bottom:1px solid var(--line); }
.toc-chapter[hidden], .toc-section[hidden], .toc-subitem[hidden] { display:none !important; }
.toc-chapter > summary { position:relative; display:flex; align-items:center; min-height:70px; padding:14px 48px 14px 0; cursor:pointer; list-style:none; }
.toc-chapter > summary::-webkit-details-marker { display:none; }
.toc-chapter > summary::after { content:'＋'; position:absolute; right:4px; color:var(--accent); font-size:1.4rem; font-weight:400; }
.toc-chapter[open] > summary::after { content:'−'; }
.toc-chapter > summary a, .toc-chapter > summary span { color:var(--ink); font-size:clamp(1.18rem,2vw,1.55rem); font-weight:800; text-decoration:none; }
.toc-chapter__body { padding:0 0 22px 22px; }
.toc-section { display:grid; grid-template-columns:minmax(220px,.8fr) minmax(0,1.7fr); gap:20px; padding:18px 0; border-top:1px solid rgba(16,80,74,.11); }
.toc-section__title { color:var(--accent-dark); font-weight:750; line-height:1.55; text-decoration:none; }
.toc-section__items { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px 18px; }
.toc-subitem { display:block; padding:5px 0; color:var(--muted); font-size:.92rem; line-height:1.55; text-decoration:none; overflow-wrap:anywhere; }
.toc-section__title:hover, .toc-subitem:hover { color:var(--accent); }
.toc-chapter__body > .toc-subitem { max-width:560px; }
.book-nav__toc { font-weight:700; text-decoration:none; }
.book-nav__prev { text-decoration:none; font-size:.88rem; }
@media (max-width:720px) {
  body { font-size:15px; line-height:1.82; }
  .index-hero__inner, .index-main, .book-page { width:min(100% - 24px,960px); }
  .index-hero { min-height:auto; padding-top:34px; }
  .index-main { padding-top:24px; }
  .section-heading { padding-bottom:16px; }
  .toc-tools { grid-template-columns:1fr; top:0; padding:10px 0 12px; }
  .toc-actions { grid-row:2; }
  .toc-actions button { flex:1; }
  #toc-result { grid-row:3; }
  .toc-chapter > summary { min-height:62px; padding-right:40px; }
  .toc-chapter__body { padding-left:0; }
  .toc-section { grid-template-columns:1fr; gap:8px; padding:16px 0; }
  .toc-section__items { grid-template-columns:1fr; padding-left:16px; border-left:2px solid rgba(20,125,114,.14); }
  .toc-subitem { min-height:42px; display:flex; align-items:center; padding:7px 0; }
  .book-nav { flex-wrap:wrap; }
  .book-nav__next { margin-left:auto; }
}
@media (prefers-reduced-motion:reduce) { .toc-actions button { transition:none; } }
`;
  await writeFile(cssFile, css, "utf8");
  console.log("已导入临床超声医学实践，已排除第11节美化版。");
}

await main();
