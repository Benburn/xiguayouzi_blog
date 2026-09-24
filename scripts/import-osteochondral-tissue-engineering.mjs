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
import { readdirSync, readFileSync, statSync } from "node:fs";
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

// —— 移动端目录修复 ——
// 原书页面在手机上：抽屉虽能滑出，但 #layout 的 z-index 创建了层叠上下文，
// 使内部 sidebar 更高的 z-index 失效、被根层级的 #overlay 盖住 —— 目录看着能打开却点不动、跳不了；
// 目录条目被 -webkit-line-clamp:2 截断；返回按钮悬浮在抽屉之上遮挡末尾条目；
// 全书单页约 160 万像素高且图片无尺寸，锚点滚动过程中页面持续撑高，落点漂移上万像素。
const MOBILE_PATCHES = [
  {
    name: "解除 #layout 层叠上下文",
    from: "#layout{display:flex;max-width:1500px;margin:0 auto;position:relative;z-index:1}",
    to: "#layout{display:flex;max-width:1500px;margin:0 auto;position:relative;z-index:auto}",
  },
  {
    name: "overlay 层级升至抽屉之下",
    from: "#overlay{display:none;position:fixed;inset:0;background:rgba(10,14,30,.45);z-index:55}",
    to: "#overlay{display:none;position:fixed;inset:0;background:rgba(10,14,30,.45);z-index:70}",
  },
  {
    name: "移动端抽屉：层级/宽度/触摸滚动/底部安全留白",
    from: `  #sidebar{position:fixed;left:0;top:var(--tbh);bottom:0;z-index:58;transform:translateX(-105%);transition:transform .25s ease;box-shadow:var(--shadow);
    padding-left:calc(14px + var(--sai-l))}`,
    to: `  #sidebar{position:fixed;left:0;top:var(--tbh);bottom:0;z-index:80;width:min(86vw,340px);max-width:340px;
    transform:translateX(-105%);transition:transform .25s ease;box-shadow:var(--shadow);
    padding:0 calc(12px + var(--sai-r)) calc(96px + var(--sai-b)) calc(12px + var(--sai-l));
    overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}`,
  },
  {
    name: "目录条目完整显示 + 标题吸顶",
    from: `  .nav-ch{padding:11px 10px;margin:2px 0 2px 6px}`,
    to: `  .nav-ch{padding:11px 10px;margin:3px 0 3px 6px;font-size:13.4px;line-height:1.5}
  #sidebar .nav-ch .nc-t{-webkit-line-clamp:3;overflow:visible;
    display:block;text-overflow:clip;white-space:normal}
  #sidebar .side-title{position:sticky;top:0;margin:0;background:var(--bg);padding:16px 8px 10px;z-index:2}
  #sidebar .part-toc{margin:14px 4px 6px}`,
  },
  {
    name: "抽屉展开时隐藏返回按钮",
    from: `  @media (max-width: 1080px) { .xigua-book-back { left: 12px; bottom: max(12px, env(safe-area-inset-bottom)); min-height: 44px; padding: 0 13px; } }`,
    to: `  @media (max-width: 1080px) { .xigua-book-back { left: 12px; bottom: max(12px, env(safe-area-inset-bottom)); min-height: 44px; padding: 0 13px; } }
  body.nav-open .xigua-book-back { display: none; }`,
  },
  {
    name: "抽屉状态同步 + 锚点瞬时定位",
    from: `  document.getElementById('menuBtn').onclick=function(){side.classList.toggle('open');ov.classList.toggle('show');};
  ov.onclick=function(){side.classList.remove('open');ov.classList.remove('show');};
  side.addEventListener('click',function(e){if(e.target.closest('a')){side.classList.remove('open');ov.classList.remove('show');}});`,
    to: `  function setNav(open){
    side.classList.toggle('open',open);
    ov.classList.toggle('show',open);
    document.body.classList.toggle('nav-open',open);
    document.body.style.overflow=open?'hidden':'';
  }
  document.getElementById('menuBtn').onclick=function(){setNav(!side.classList.contains('open'));};
  ov.onclick=function(){setNav(false);};
  addEventListener('resize',function(){if(innerWidth>1080&&side.classList.contains('open')){setNav(false);}});
  var TOP_OFFSET=70;
  function jumpTo(el){
    /* 全书单页极长（约 160 万 px）：滚动过程中仍有图片/分栏在撑高页面，
       单击定位到目标后继续跟随页面高度校正，用户一旦手动滚动立即停手 */
    var userScrolled=false,tries=0;
    function stop(){userScrolled=true}
    ['wheel','touchstart','keydown'].forEach(function(ev){
      addEventListener(ev,stop,{passive:true,once:true});});
    function step(){
      if(userScrolled||tries>=10) return;
      tries++;
      var root=document.documentElement,prev=root.style.scrollBehavior;
      root.style.scrollBehavior='auto';
      var max=root.scrollHeight-window.innerHeight;
      var y=el.getBoundingClientRect().top+window.pageYOffset-TOP_OFFSET;
      if(y>max) y=max;
      window.scrollTo(0,Math.max(0,y));
      root.style.scrollBehavior=prev;
      setTimeout(step,tries<4?80:220);
    }
    step();
  }
  side.addEventListener('click',function(e){
    var a=e.target.closest('a'); if(!a) return;
    var href=a.getAttribute('href')||'';
    setNav(false);
    if(href.charAt(0)==='#'){
      var el=document.getElementById(href.slice(1));
      if(!el) return;
      e.preventDefault();
      requestAnimationFrame(function(){ jumpTo(el); history.replaceState(null,'',href); });
    }
  });`,
  },
  {
    name: "图片占位色",
    from: ".fig-img img{display:block;width:100%;height:auto;border-radius:6px}",
    to: ".fig-img img{display:block;width:100%;height:auto;border-radius:6px;background:var(--brand-soft)}",
  },
];

// 源文件与产物统一使用 CRLF；补丁锚点按 LF 书写，应用前按实际换行符适配
const fit = (text, newline) => text.replace(/\n/g, newline);
const newlineOf = (html) => (html.includes("\r\n") ? "\r\n" : "\n");

function applyMobilePatches(html) {
  const newline = newlineOf(html);
  let out = html;
  for (const patch of MOBILE_PATCHES) {
    assert(out.includes(fit(patch.from, newline)), `移动端修复锚点未命中：${patch.name}`);
    out = out.replace(fit(patch.from, newline), fit(patch.to, newline));
  }
  return out;
}

function revertMobilePatches(html) {
  const newline = newlineOf(html);
  let out = html;
  for (const patch of MOBILE_PATCHES) out = out.replace(fit(patch.to, newline), fit(patch.from, newline));
  return out;
}

// 从 JPEG 头部读取真实宽高，写入 <img> 属性，避免全书长页滚动时布局抖动导致锚点漂移
function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    if (marker === 0xda) break;
    const length = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + length;
  }
  return null;
}

function addImageDimensions(html, assetsRoot) {
  const cache = new Map();
  let tagged = 0;
  let skipped = 0;
  const withDims = html.replace(IMG_TAG, (tag) => {
    if (/\bwidth="/.test(tag) || /\bheight="/.test(tag)) return tag;
    const src = /\bsrc="(assets\/[^"]+)"/.exec(tag);
    // 灯箱占位图 <img id="lb-img" src=""> 没有静态资源，保持原样
    if (!src) return tag;
    let size = cache.get(src[1]);
    if (size === undefined) {
      try {
        size = jpegSize(readFileSync(path.join(assetsRoot, src[1])));
      } catch {
        size = null;
      }
      cache.set(src[1], size);
    }
    if (!size) {
      skipped += 1;
      return tag;
    }
    tagged += 1;
    return `${tag.slice(0, -1).replace(/\s*\/?$/, "")} width="${size.width}" height="${size.height}">`;
  });
  return { html: withDims, tagged, skipped };
}

const stripImages = (html) => html.replace(IMG_TAG, "<img>");
const stripImgDimensions = (html) => html.replace(/(<img\b[^>]*?)\s+width="\d+"\s+height="\d+"/g, "$1");

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

  // 3) 注入返回博客入口与移动端修复（只追加样式与一个链接，不动正文）
  // 注入片段统一采用源文档换行符，否则后续补丁/还原的字符串匹配会因 CRLF 与 LF 混用而失配
  const indexHtmlPath = path.join(outputRoot, "index.html");
  const nl = newlineOf(webHtml);
  const injectedStyle = fit(backLinkStyle, nl);
  const injectedLink = fit(backLink, nl);
  const patchedHtml = applyMobilePatches(
    webHtml
      .replace(/<\/head>/i, `${injectedStyle}</head>`)
      .replace(/<\/body>/i, `${injectedLink}</body>`),
  );
  const { html: finalHtml, tagged, skipped } = addImageDimensions(patchedHtml, outputRoot);
  assert(skipped === 0, `有 ${skipped} 张图片未能解析宽高，锚点滚动可能仍会漂移`);
  await writeFile(indexHtmlPath, finalHtml, "utf8");

  // 4) 校验产物
  const written = await readFile(indexHtmlPath, "utf8");
  assert(written === finalHtml, "index.html 写回后内容发生变化（编码或换行被改动）");
  assert(!written.includes("\uFFFD"), "index.html 出现替换字符 U+FFFD，编码可能损坏");
  assert(/<meta charset="UTF-8">/i.test(written), "index.html 缺少 UTF-8 声明");
  // 还原顺序：先撤移动端补丁（其中一项位于注入样式内部），再摘掉注入的样式与入口；
  // 最后去掉写入的图片宽高，应与网页版逐字节一致
  assert(
    stripImgDimensions(
      revertMobilePatches(written).replace(injectedStyle, "").replace(injectedLink, ""),
    ) === webHtml,
    "注入后正文相对网页版发生变化",
  );
  for (const patch of MOBILE_PATCHES) {
    assert(written.includes(fit(patch.to, newlineOf(written))), `移动端修复未生效：${patch.name}`);
  }

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
  assert(tagged === 236, `写入宽高的图片数异常：${tagged}（预期 236）`);

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
  console.log(`  移动端    ${MOBILE_PATCHES.length} 项目录修复 · ${tagged} 张图片已写入宽高`);
  console.log(`  入口      ${postRoute}`);
}

await main();
