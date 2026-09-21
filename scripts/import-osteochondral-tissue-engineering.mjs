// 把《骨软骨组织工程：软骨再生的材料、技术与临床转化》发布到博客的医疗器械栏目。
//
//   node scripts/import-osteochondral-tissue-engineering.mjs
//
// 源目录里有两个 HTML：
//   _work/pre-embed.html            网页版（图片是 assets/chXX/xxx.jpg 文件引用，正文与交付版逐字节一致）
//   骨软骨组织工程….html            交付版单文件（236 张图内嵌为 WebP data URI，29.7 MB）
//
// 交付版单文件超过 Cloudflare Pages 的单文件 25 MiB 上限，无法直接托管；
// 而网页版与交付版去掉 <img> 标签后完全一致（正文、章节、目录、脚本、参考文献全同），
// 所以这里用网页版 + assets 文件夹发布，脚本开头会先校验两者内容一致。
//
// 输出：
//   public/osteochondral-tissue-engineering/index.html
//   public/osteochondral-tissue-engineering/assets/ch01…ch29/*.jpg
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const sourceRoot = "E:/Book2Know/Osteochondral Tissue Engineering/完整书籍 西瓜柚子公众号";
const deliveredHtmlPath = path.join(
  sourceRoot,
  "骨软骨组织工程：软骨再生的材料、技术与临床转化.html",
);
const webHtmlPath = path.join(sourceRoot, "_work", "pre-embed.html");
const sourceAssets = path.join(sourceRoot, "assets");
const outputRoot = path.join(repoRoot, "public", "osteochondral-tissue-engineering");
const postRoute = "/blog/device/osteochondral-tissue-engineering";

const IMG_TAG = /<img\b(?:"[^"]*"|[^>"])*>/g;
const ASSET_REF = /\bsrc="(assets\/[^"]+)"/g;

// 仅追加，不改动书的正文/目录/脚本；与仓库中其他在线书籍的返回入口保持一致
const backLinkStyle = `<style id="xigua-book-back-style">
  .xigua-book-back { position: fixed; z-index: 20; left: max(16px, env(safe-area-inset-left)); bottom: max(16px, env(safe-area-inset-bottom)); display: inline-flex; align-items: center; min-height: 42px; padding: 0 15px; border-radius: 999px; background: #4d6bfe; color: #fff !important; box-shadow: 0 10px 24px rgba(77, 107, 254, .28); text-decoration: none !important; font: 700 13px/1 -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
  .xigua-book-back:hover { background: #3352d6; transform: translateY(-2px); }
  @media (max-width: 1080px) { .xigua-book-back { left: 12px; bottom: max(12px, env(safe-area-inset-bottom)); min-height: 44px; padding: 0 13px; } }
  @media (prefers-reduced-motion: reduce) { .xigua-book-back { transition: none; } }
</style>`;
const backLink = `<a class="xigua-book-back" href="${postRoute}">← 返回医疗器械文章</a>`;

const stripImages = (html) => html.replace(IMG_TAG, "<img>");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const [deliveredHtml, webHtml] = await Promise.all([
    readFile(deliveredHtmlPath, "utf8"),
    readFile(webHtmlPath, "utf8"),
  ]);

  // 1) 内容守卫：网页版与交付版只允许在 <img> 标签上不同
  assert(
    stripImages(deliveredHtml) === stripImages(webHtml),
    "网页版 _work/pre-embed.html 与交付版正文不一致，请先确认源文件版本",
  );

  // 2) 清空输出目录，复制图片资源，再按字节复制 index.html（保证编码不变）
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  await cp(sourceAssets, path.join(outputRoot, "assets"), { recursive: true });
  await cp(webHtmlPath, path.join(outputRoot, "index.html"));

  // 3) 注入返回博客入口（只追加样式与一个链接，不动正文）
  const indexHtmlPath = path.join(outputRoot, "index.html");
  const finalHtml = webHtml
    .replace(/<\/head>/i, `${backLinkStyle}</head>`)
    .replace(/<\/body>/i, `${backLink}</body>`);
  await writeFile(indexHtmlPath, finalHtml, "utf8");

  // 4) 校验产物
  const written = await readFile(indexHtmlPath, "utf8");
  assert(written === finalHtml, "index.html 写回后内容发生变化（编码或换行被改动）");
  assert(!written.includes("\uFFFD"), "index.html 出现替换字符 U+FFFD，编码可能损坏");
  assert(/<meta charset="UTF-8">/i.test(written), "index.html 缺少 UTF-8 声明");
  assert(
    stripImages(written.replace(backLinkStyle, "").replace(backLink, "")) === stripImages(webHtml),
    "注入后正文相对网页版发生变化",
  );

  const refs = [...new Set([...written.matchAll(ASSET_REF)].map((m) => m[1]))];
  const figures = (written.match(/class="fig-img"/g) || []).length;
  const refItems = (written.match(/class="ref"/g) || []).length;
  const navChapters = (written.match(/class="nav-ch/g) || []).length;

  for (const rel of refs) {
    const full = path.join(outputRoot, rel);
    assert(statSync(full).size > 0, `图片缺失或为空：${rel}`);
  }
  assert(figures === 236, `图表数量异常：${figures}（预期 236）`);
  assert(refItems === 3019, `参考文献条数异常：${refItems}（预期 3019）`);
  assert(navChapters === 31, `目录条目异常：${navChapters}（预期 31）`);

  const copied = walk(path.join(outputRoot, "assets"));
  const sourceFiles = walk(sourceAssets);
  const sum = (files) => files.reduce((total, file) => total + statSync(file).size, 0);
  assert(copied.length === sourceFiles.length, `图片数量不一致：${copied.length} / ${sourceFiles.length}`);
  assert(sum(copied) === sum(sourceFiles), "图片总体积不一致，复制可能不完整");

  // 5) 报告
  const mb = (bytes) => (bytes / 1048576).toFixed(2);
  console.log("已发布《骨软骨组织工程：软骨再生的材料、技术与临床转化》");
  console.log(`  页面      ${path.relative(repoRoot, indexHtmlPath)}  ${mb(statSync(indexHtmlPath).size)} MB`);
  console.log(`  图片      ${copied.length} 个文件  ${mb(sum(copied))} MB（${refs.length} 处引用）`);
  console.log(`  结构      ${navChapters} 个目录条目 · ${figures} 幅图表 · ${refItems} 条参考文献`);
  console.log(`  入口      ${postRoute}`);
}

await main();
