import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const sourceRoot = "E:/work/New CaP guideline";
const outputRoot = path.join(repoRoot, "public", "calcium-phosphate-silicon-guideline");

const animationEnhancement = `
<style id="xigua-ppt-enhancements">
  /* 西瓜柚子：轻量页面入场动画，与原有 PPT 翻页运行时叠加。 */
  @keyframes xigua-slide-enter {
    from { opacity: .18; filter: blur(2px); }
    to { opacity: 1; filter: blur(0); }
  }
  #deck > .slide.active {
    animation: xigua-slide-enter .46s cubic-bezier(.22,.61,.36,1) both;
  }
  .xigua-ppt-back {
    position: fixed;
    z-index: 4000;
    right: max(16px, env(safe-area-inset-right));
    bottom: max(16px, env(safe-area-inset-bottom));
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 14px;
    border: 1px solid rgba(255,255,255,.52);
    border-radius: 999px;
    background: rgba(8,38,81,.92);
    box-shadow: 0 12px 28px rgba(8,38,81,.25);
    color: #fff !important;
    font: 700 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif !important;
    text-decoration: none !important;
    backdrop-filter: blur(12px);
    transition: transform .18s ease, background .18s ease;
  }
  .xigua-ppt-back:hover { transform: translateY(-2px); background: #176cbe; }
  .xigua-ppt-back::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: #4ee7ae; box-shadow: 0 0 0 4px rgba(78,231,174,.12); }
  .xigua-ppt-back { font-size: 0 !important; }
  .xigua-ppt-back::after { content: "返回医疗器械文章"; font-size: 13px; }
  @media (max-width: 720px) {
    .xigua-ppt-back { right: 12px; bottom: max(12px, env(safe-area-inset-bottom)); min-height: 44px; padding: 0 13px; }
  }
  @media (prefers-reduced-motion: reduce) {
    #deck > .slide.active { animation: none; }
    .xigua-ppt-back { transition: none; }
  }
</style>
`;

const navigation = `<a class="xigua-ppt-back" href="/calcium-phosphate-silicon-guideline/article.html">返回医疗器械文章</a>`;

async function main() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  await cp(path.join(sourceRoot, "assets"), path.join(outputRoot, "assets"), { recursive: true });
  const sourceHtml = await readFile(path.join(sourceRoot, "New.html"), "utf8");
  const enhancedHtml = sourceHtml
    .replace(/<\/head>/i, `${animationEnhancement}</head>`)
    .replace(/<\/body>/i, `${navigation}</body>`);
  await writeFile(path.join(outputRoot, "index.html"), enhancedHtml, "utf8");
  await writeFile(path.join(outputRoot, "article.html"), `<!doctype html><meta http-equiv="refresh" content="0; url=/blog/device/calcium-phosphate-silicon-guideline">`, "utf8");
  console.log("已生成钙磷/硅类骨填充材料 PPT，并加入轻量入场动画。");
}

await main();
