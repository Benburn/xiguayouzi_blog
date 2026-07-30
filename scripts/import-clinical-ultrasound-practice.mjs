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
const chapterStrip = `<section class="chapter-strip" aria-label="章节入口"><a href="chapters/text00000.html"><strong>第 1 章</strong><span>前部与心脏超声</span></a><a href="chapters/text00001.html"><strong>第 2 章</strong><span>腹部与妇产超声</span></a><a href="chapters/text00002.html"><strong>第 3 章</strong><span>妇产超声进阶</span></a></section>`;

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
    .replace(/<\/header>/i, `</header>${chapterStrip}`)
    .replace(/<\/head>/i, `${enhancement}</head>`)
    .replace(/<\/body>/i, `${backLink}</body>`);
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
  css += `\n/* 西瓜柚子：目录与移动端图文阅读优化 */\n.book-image { max-width:100%; height:auto; }\n.index-hero { min-height:min(560px,68vh); padding-top:48px; padding-bottom:38px; }\n.chapter-strip { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; width:min(1200px,calc(100% - 36px)); margin:0 auto; padding:0 0 22px; }\n.chapter-strip a { display:flex; flex-direction:column; gap:3px; padding:14px 16px; border:1px solid var(--line); border-radius:var(--radius); background:var(--surface); box-shadow:var(--shadow); text-decoration:none; }\n.chapter-strip strong { color:var(--accent-dark); } .chapter-strip span { color:var(--muted); font-size:.9rem; }\n.book-nav__toc { font-weight:700; text-decoration:none; } .book-nav__prev { text-decoration:none; font-size:.88rem; }\n@media (max-width:720px) { body { font-size:15px; line-height:1.82; } .index-hero__inner, .index-main, .book-page { width:min(100% - 24px, 960px); } .index-hero { min-height:auto; padding-top:34px; } .chapter-strip { grid-template-columns:1fr; width:min(100% - 28px,720px); padding-bottom:10px; } .toc-list { padding-left:1.2rem; } .toc-list a { overflow-wrap:anywhere; } .book-nav { flex-wrap:wrap; } .book-nav__next { margin-left:auto; } }\n`;
  await writeFile(cssFile, css, "utf8");
  console.log("已导入临床超声医学实践，已排除第11节美化版。");
}

await main();
