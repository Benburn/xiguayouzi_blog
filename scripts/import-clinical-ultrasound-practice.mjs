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
    .replace(/<\/head>/i, `${enhancement}</head>`)
    .replace(/<\/body>/i, `${backLink}</body>`);
  await writeFile(path.join(outputRoot, "index.html"), indexHtml, "utf8");

  for (const name of ["text00000.html", "text00001.html", "text00002.html"]) {
    const file = path.join(outputRoot, "chapters", name);
    let html = await readFile(file, "utf8");
    html = html.replace(/<\/head>/i, `${enhancement}</head>`).replace(/<\/body>/i, `${backLink}</body>`);
    await writeFile(file, html, "utf8");
  }
  const cssFile = path.join(outputRoot, "css", "book.css");
  let css = await readFile(cssFile, "utf8");
  css += `\n/* 西瓜柚子：移动端图文阅读优化 */\n.book-image { max-width:100%; height:auto; }\n@media (max-width:720px) { body { font-size:15px; line-height:1.82; } .index-hero__inner, .index-main, .book-page { width:min(100% - 24px, 960px); } .toc-list { padding-left:1.2rem; } .toc-list a { overflow-wrap:anywhere; } }\n`;
  await writeFile(cssFile, css, "utf8");
  console.log("已导入临床超声医学实践，已排除第11节美化版。");
}

await main();
