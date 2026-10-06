// 把《超声科规培结业考评分标准 2022版 · 蓝本原文版》发布到博客的医学影像栏目。
//
//   node scripts/import-ultrasound-residency-exam-standards.mjs
//
// 源目录：
//   E:/Book2Know/超声培训细则/超声科规培结业考评分标准-蓝本原文版.html   外链版（引用 work/svg/*.svg）
//   E:/Book2Know/超声培训细则/work/svg/p01.svg … p71.svg              71 页矢量页面（每页自包含，图片为内嵌 data URI）
//
// 发布时把 SVG 放到站点目录下的 svg/，并把 HTML 中的 work/svg/ 改为 svg/。
//
// 输出：
//   public/ultrasound-residency-exam-standards/index.html
//   public/ultrasound-residency-exam-standards/svg/p01.svg … p71.svg
//
// 移动端修复（原页面按 A4 原版式整页缩放，手机上正文只有约 9px）：
//   1) 目录项点击后自动收起抽屉（原来跳转后抽屉仍盖住页面）
//   2) 新增移动端页面缩放控件（A4 / 适应宽度 / 放大），并记忆选择
//   3) 移动端提供横屏提示，方便阅读宽表格
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const sourceRoot = "E:/Book2Know/超声培训细则";
const sourceHtmlPath = path.join(sourceRoot, "超声科规培结业考评分标准-蓝本原文版.html");
const sourceSvgDir = path.join(sourceRoot, "work", "svg");
const outputRoot = path.join(repoRoot, "public", "ultrasound-residency-exam-standards");
const postRoute = "/blog/imaging/ultrasound-residency-exam-standards";

const EXPECTED_PAGES = 71;

// 源 HTML 的换行符（CRLF）；补丁锚点按 LF 书写，应用前适配
const fit = (text, newline) => text.replace(/\n/g, newline);
const newlineOf = (html) => (html.includes("\r\n") ? "\r\n" : "\n");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// —— 移动端修复补丁 ——
const PATCHES = [
  {
    // 1) 目录项点击后收起抽屉：原 onclick="return nav(N)" 只跳转，抽屉仍打开盖住内容
    name: "目录项点击后自动收起抽屉",
    from: `function nav(n) {
  n = Math.min(total, Math.max(1, n|0));
  cur = n;
  var el = document.getElementById('pg' + n);
  if (el) el.scrollIntoView({behavior: 'auto', block: 'start'});
  document.getElementById('pageno').value = n;
  return false;
}`,
    to: `function nav(n) {
  n = Math.min(total, Math.max(1, n|0));
  cur = n;
  var el = document.getElementById('pg' + n);
  if (el) el.scrollIntoView({behavior: 'auto', block: 'start'});
  document.getElementById('pageno').value = n;
  // 从目录跳转后收起抽屉，否则手机上抽屉会一直盖住正文
  toggleToc(false);
  return false;
}`,
  },
  {
    // 2) 移动端页面缩放控件样式（A4 整页缩放到手机上正文仅约 9px，需要放大能力）
    name: "缩放控件样式",
    from: `@media print{`,
    to: `/* 移动端缩放：默认适应宽度；可切到 A4 原比例或放大阅读 */
  .zoomwrap{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;
       background:#fff;box-shadow:0 1px 5px rgba(20,60,100,.14)}
  .zoomwrap.lock{background:transparent;box-shadow:none}
  .zoominner{transform-origin:top left}
  .zoominner img{display:block;width:100%;height:auto}
  #zoomBar{display:none}
  @media (max-width:760px){
    #zoomBar{display:flex;align-items:center;gap:6px;margin-left:auto}
    #zoomBar button{padding:3px 8px;font-size:12px}
    #zoomBar button.on{background:var(--blue);color:#fff;border-color:var(--blue)}
    .zoomwrap.free{width:100%}
    .pgwrap .lbl{font-size:10.5px}
  }
  #rotHint{display:none;background:#fff8e6;border-bottom:1px solid #f0dcae;color:#8a6516;
       font-size:12px;padding:6px 12px;text-align:center}
  @media (max-width:760px) and (orientation:portrait){
    #rotHint{display:block}
  }
  @media print{`,
  },
  {
    // 3) 缩放控件 DOM + 横屏提示
    name: "缩放控件 DOM",
    from: `  <span class="ttl">蓝本原文版 · PDF 原版式<small>页面与 PDF 逐页一致（矢量排版，可无损缩放）</small></span>
</div>`,
    to: `  <span id="zoomBar">
    <button type="button" onclick="setZoom('fit')" data-zoom="fit">适应</button>
    <button type="button" onclick="setZoom('a4')" data-zoom="a4">A4</button>
    <button type="button" onclick="setZoom('big')" data-zoom="big">放大</button>
  </span>
  <span class="ttl">蓝本原文版 · PDF 原版式<small>页面与 PDF 逐页一致（矢量排版，可无损缩放）</small></span>
</div>
<div id="rotHint">横屏阅读宽表格更清晰（旋转设备即可自动适配）</div>`,
  },
  {
    // 4) 缩放逻辑
    name: "缩放逻辑",
    from: `var cur = 1, total = 71;`,
    to: `var cur = 1, total = 71;
// 移动端阅读比例：fit=适应宽度（默认），a4=A4 整页原比例可横向滚动，big=放大 1.6 倍
var ZOOM_KEY = 'us-exam-zoom', zoomMode = 'fit';
function applyZoom(mode){
  zoomMode = mode;
  try{ localStorage.setItem(ZOOM_KEY, mode); }catch(e){}
  var wraps = document.querySelectorAll('.zoomwrap');
  var base = (mode === 'fit') ? 0 : (mode === 'a4' ? 595 : 952);
  Array.prototype.forEach.call(wraps, function(w){
    var inner = w.querySelector('.zoominner');
    var img = inner && inner.querySelector('img');
    if (!img) return;
    w.classList.toggle('free', base > 0);
    w.classList.toggle('lock', base === 0);
    if (base > 0){ img.style.width = base + 'px'; img.style.height = 'auto'; }
    else { img.style.width = '100%'; img.style.height = 'auto'; }
  });
  var bar = document.getElementById('zoomBar');
  if (bar) Array.prototype.forEach.call(bar.querySelectorAll('button'), function(b){
    b.classList.toggle('on', b.getAttribute('data-zoom') === mode);
  });
}
function setZoom(mode){ applyZoom(mode); }
try{ var saved = localStorage.getItem(ZOOM_KEY); if (saved) zoomMode = saved; }catch(e){}
applyZoom(zoomMode);`,
  },
];

function applyPatches(html) {
  const newline = newlineOf(html);
  let out = html;
  for (const patch of PATCHES) {
    assert(out.includes(fit(patch.from, newline)), `修复锚点未命中：${patch.name}`);
    out = out.replace(fit(patch.from, newline), fit(patch.to, newline));
  }
  return out;
}

function revertPatches(html) {
  const newline = newlineOf(html);
  let out = html;
  for (const patch of PATCHES) out = out.replace(fit(patch.to, newline), fit(patch.from, newline));
  return out;
}

// 把 SVG 页面统一包进缩放容器；同时补齐 img 宽高，避免长页加载时布局跳动
function wrapSheets(html) {
  const SHEET_RE = /<div class="sheet"><img src="(svg\/p\d+\.svg)" alt="([^"]*)" style="display:block;width:100%;height:auto"><\/div>/g;
  let count = 0;
  const out = html.replace(SHEET_RE, (_m, src, alt) => {
    count += 1;
    return `<div class="sheet zoomwrap"><div class="zoominner"><img src="${src}" alt="${alt}" width="595" height="842"></div></div>`;
  });
  return { html: out, count };
}

async function main() {
  const sourceHtml = await readFile(sourceHtmlPath, "utf8");

  // 1) 内容守卫：源文件应为外链 SVG 版，且页数与预期一致
  const svgRefs = [...sourceHtml.matchAll(/src="work\/svg\/(p\d+\.svg)"/g)].map((m) => m[1]);
  assert(svgRefs.length === EXPECTED_PAGES, `源 HTML 引用页数异常：${svgRefs.length}（预期 ${EXPECTED_PAGES}）`);

  const svgFiles = readdirSync(sourceSvgDir).filter((f) => f.endsWith(".svg")).sort();
  assert(svgFiles.length === EXPECTED_PAGES, `SVG 文件数异常：${svgFiles.length}（预期 ${EXPECTED_PAGES}）`);

  // 2) 清空输出目录并复制资源
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(path.join(outputRoot, "svg"), { recursive: true });
  for (const file of svgFiles) {
    await cp(path.join(sourceSvgDir, file), path.join(outputRoot, "svg", file));
  }

  // 3) 改资源路径 → 包裹缩放层 → 应用移动端修复
  const pathFixed = sourceHtml.replace(/src="work\/svg\//g, 'src="svg/');
  const { html: wrapped, count: wrappedCount } = wrapSheets(pathFixed);
  assert(wrappedCount === EXPECTED_PAGES, `缩放容器包裹数异常：${wrappedCount}（预期 ${EXPECTED_PAGES}）`);
  const finalHtml = applyPatches(wrapped);

  const indexHtmlPath = path.join(outputRoot, "index.html");
  await writeFile(indexHtmlPath, finalHtml, "utf8");

  // 4) 校验产物
  const written = await readFile(indexHtmlPath, "utf8");
  assert(written === finalHtml, "index.html 写回后内容发生变化");
  assert(!written.includes("\uFFFD"), "index.html 出现替换字符 U+FFFD，编码可能损坏");
  assert(!written.includes("work/svg/"), "仍有 work/svg/ 资源路径未替换");
  assert(/<meta charset="utf-8">/i.test(written), "index.html 缺少 charset 声明");

  for (const patch of PATCHES) {
    assert(written.includes(fit(patch.to, newlineOf(written))), `移动端修复未生效：${patch.name}`);
  }

  // 正文与源文件一致性：撤掉补丁并还原包裹层后应逐字相同
  const unwrapped = revertPatches(written)
    .replace(/<div class="sheet zoomwrap"><div class="zoominner"><img src="(svg\/p\d+\.svg)" alt="([^"]*)" width="595" height="842"><\/div><\/div>/g,
      '<div class="sheet"><img src="$1" alt="$2" style="display:block;width:100%;height:auto"></div>')
    .replace(/src="svg\//g, 'src="work/svg/');
  assert(unwrapped === sourceHtml, "注入后正文相对源文件发生变化");

  const svgCopied = readdirSync(path.join(outputRoot, "svg"));
  assert(svgCopied.length === EXPECTED_PAGES, `SVG 复制数量异常：${svgCopied.length}`);
  const sum = (dir, files) => files.reduce((total, f) => total + statSync(path.join(dir, f)).size, 0);
  assert(sum(path.join(outputRoot, "svg"), svgCopied) === sum(sourceSvgDir, svgFiles), "SVG 总体积不一致，复制可能不完整");

  // 5) 报告
  const mb = (bytes) => (bytes / 1048576).toFixed(2);
  const totalSvg = sum(path.join(outputRoot, "svg"), svgCopied);
  console.log("已发布《超声科规培结业考评分标准 2022版 · 蓝本原文版》");
  console.log(`  页面      ${path.relative(repoRoot, indexHtmlPath)}  ${(statSync(indexHtmlPath).size / 1024).toFixed(0)} KB`);
  console.log(`  资源      ${svgCopied.length} 个矢量页  ${mb(totalSvg)} MB`);
  console.log(`  移动端    ${PATCHES.length} 项修复 · 目录跳转自动收起 · 三档缩放（适应/A4/放大）`);
  console.log(`  入口      ${postRoute}`);
}

await main();
