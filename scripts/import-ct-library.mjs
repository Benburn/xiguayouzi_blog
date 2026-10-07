/*
 * 导入《CT 诊断影像书库》：6 册开放获取英文专著的中文阅读版 + 合集入口页。
 *
 * 源：E:/Book2Know/CT upload/CT_book_中文HTML/
 *   - <书名>/output/{index.html, assets/, assets_img/}   ×5（IDKD ×4 + IAEA）
 *   - output/{index.html, assets/, assets_img/}          ×1（放射学-核医学，旧目录）
 *
 * 目标：public/ct-library/<slug>/{index.html, assets/, assets_img/}
 *       public/ct-library/index.html（合集入口，链接改写为站内绝对路径）
 *
 * 守卫：每册 index.html 与源文件逐字节一致；assets_img 数量与源一致；
 *       index.html 引用的相对资源必须存在；合集页链接必须全部落在本站。
 * 幂等：可重复运行；重复运行时先清空目标目录再重建。
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SOURCE_ROOT = "E:/Book2Know/CT upload/CT_book_中文HTML";
const OUTPUT_ROOT = "E:/Web/xiguayouzi_blog/public/ct-library";

const BOOKS = [
  {
    slug: "radiology-nuclear-medicine-2023",
    dir: ".",
    title: "放射学-核医学诊断影像",
    expect: "31 章",
  },
  {
    slug: "idkd-abdomen-pelvis-2023",
    dir: "Diseases of the Abdomen and Pelvis 2023-2026 Diagnostic Imaging",
    title: "腹部与盆腔疾病",
    expect: "21 章",
  },
  {
    slug: "iaea-cardiac-petct-2022",
    dir: "IAEA Atlas of Cardiac PET-CT A Case-Study Approach",
    title: "IAEA 心脏 PET/CT 图谱",
    expect: "原书 213 页",
  },
  {
    slug: "idkd-brain-headneck-spine-2024",
    dir: "Diseases of the Brain, Head and Neck, Spine 2024-2027 Diagnostic Imaging",
    title: "脑、头颈与脊柱疾病",
    expect: "20 章",
  },
  {
    slug: "idkd-chest-heart-vascular-2025",
    dir: "Diseases of the Chest, Heart and Vascular System 2025-2028 Diagnostic Imaging",
    title: "胸部、心脏与血管系统疾病",
    expect: "20 章",
  },
  {
    slug: "idkd-musculoskeletal-2026",
    dir: "Musculoskeletal Diseases 2026-2029 Diagnostic Imaging",
    title: "肌肉骨骼疾病",
    expect: "20 章",
  },
];

function assert(cond, msg) {
  if (!cond) {
    console.error(`✗ ${msg}`);
    process.exit(1);
  }
  console.log(`✓ ${msg}`);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function dirSize(dir) {
  let total = 0;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    total += fs.statSync(p).isDirectory() ? dirSize(p) : fs.statSync(p).size;
  }
  return total;
}

/* 站点部署补丁：为带宽高属性的图片注入 aspect-ratio，未加载时即按最终比例占位。
 * 否则 .fx 公式图（CSS width/height:auto）在远端懒加载状态下塌缩为小占位框，
 * 长距离目录跳转的平滑滚动扫过时图片才加载涨高，落点会比目标差数十至数百像素。 */
const LANDING_PATCH = `
/* —— 站点部署补丁：懒加载图片按宽高属性预留纵横比，消除长页跳转布局漂移 —— */
(function () {
  var imgs = document.querySelectorAll('img[width][height]');
  for (var i = 0; i < imgs.length; i++) {
    var el = imgs[i];
    var w = parseInt(el.getAttribute('width'), 10);
    var h = parseInt(el.getAttribute('height'), 10);
    if (w > 0 && h > 0 && !el.style.aspectRatio) {
      el.style.aspectRatio = w + ' / ' + h;
    }
  }
  /* 公式图（.fx，渲染宽恒为 min(560px,100%) 上限或自然宽）：内联钉住属性宽，
   * 未加载时即得与最终渲染一致的占位框（max-width 仍兜底响应式） */
  var fxImgs = document.querySelectorAll('figure.fx img[width]');
  for (var j = 0; j < fxImgs.length; j++) {
    var fxi = fxImgs[j];
    var fw = parseInt(fxi.getAttribute('width'), 10);
    if (fw > 0 && !fxi.style.width) {
      fxi.style.width = fw + 'px';
    }
  }
})();

/* —— 站点部署补丁：目录/文内锚点瞬时定位 + 有界校正。
 * 数十万像素的长页平滑滚动耗时数秒，途中懒加载图片涨高会使落点偏离目标；
 * 改为瞬时跳转到 scroll-padding-top 位，并在图片陆续加载时自动微调，
 * 用户一旦滚轮/触摸/按键即停止校正。 —— */
(function () {
  function topOffset() {
    var v = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    return isNaN(v) ? 72 : v;
  }
  function locate(el) {
    var root = document.documentElement;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    var y = el.getBoundingClientRect().top + window.pageYOffset - topOffset();
    var max = root.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.max(0, Math.min(y, max)));
    root.style.scrollBehavior = prev;
  }
  function jumpTo(el) {
    var stopped = false, tries = 0;
    function stop() { stopped = true; }
    ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
      addEventListener(ev, stop, { passive: true, once: true });
    });
    locate(el);
    (function step() {
      if (stopped || tries >= 10) return;
      tries++;
      if (Math.abs(el.getBoundingClientRect().top - topOffset()) > 2) locate(el);
      setTimeout(step, tries < 4 ? 120 : 300);
    })();
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    jumpTo(el);
    if (history.pushState) history.pushState(null, '', '#' + id);
  });
})();
`;

/* ---------- 1) 复制 6 册 ---------- */
fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_ROOT, { recursive: true });

for (const book of BOOKS) {
  const src = path.join(SOURCE_ROOT, book.dir, "output");
  const dest = path.join(OUTPUT_ROOT, book.slug);
  assert(fs.existsSync(path.join(src, "index.html")), `源存在：${book.slug}`);

  fs.mkdirSync(dest, { recursive: true });
  fs.copyFileSync(path.join(src, "index.html"), path.join(dest, "index.html"));
  copyDir(path.join(src, "assets"), path.join(dest, "assets"));
  copyDir(path.join(src, "assets_img"), path.join(dest, "assets_img"));

  // 站点部署补丁：懒加载图片按宽高属性预留纵横比（app.js 在 </body> 前同步执行，
  // 首帧布局前生效）。否则 .fx 公式图在未加载时塌缩为小占位框，长距离目录跳转
  // 的平滑滚动途中图片加载涨高，落点会比目标差数十至数百像素。
  const appJsPath = path.join(dest, "assets", "app.js");
  const appJs = fs.readFileSync(appJsPath, "utf8");
  if (!appJs.includes("站点部署补丁")) {
    fs.writeFileSync(appJsPath, appJs + "\n" + LANDING_PATCH + "\n");
  }

  // 守卫：正文逐字节一致
  const written = fs.readFileSync(path.join(dest, "index.html"));
  const sourceHtml = fs.readFileSync(path.join(src, "index.html"));
  assert(
    crypto.createHash("sha256").update(written).digest("hex") ===
      crypto.createHash("sha256").update(sourceHtml).digest("hex"),
    `${book.slug} index.html 与源逐字节一致`,
  );

  // 守卫：标题正确（书与目录不能装反）
  const html = written.toString("utf8");
  assert(html.includes(book.title), `${book.slug} 标题命中「${book.title}」`);
  assert(html.includes(book.expect), `${book.slug} 章节页数命中「${book.expect}」`);

  // 守卫：图片数量与源 assets_img 一致
  const srcImgs = fs.readdirSync(path.join(src, "assets_img")).length;
  const dstImgs = fs.readdirSync(path.join(dest, "assets_img")).length;
  assert(srcImgs === dstImgs, `${book.slug} 图片 ${dstImgs} 个与源一致`);

  // 守卫：index.html 引用的相对资源必须存在
  const refs = [...html.matchAll(/(?:src|href)="(assets\/[^"]+|assets_img\/[^"]+)"/g)].map(
    (m) => m[1],
  );
  const missing = [...new Set(refs)].filter(
    (rel) => !fs.existsSync(path.join(dest, rel)),
  );
  assert(missing.length === 0, `${book.slug} 引用资源 ${new Set(refs).size} 个全部存在`);

  // 守卫：不携带内部交付文件
  for (const junk of ["README.md", "qa_report.json", "demo.html", "preview"]) {
    assert(!fs.existsSync(path.join(dest, junk)), `${book.slug} 未携带 ${junk}`);
  }

  const mb = (dirSize(dest) / 1024 / 1024).toFixed(1);
  console.log(`  → ${book.slug}/ ${mb} MB`);
}

/* ---------- 2) 合集入口页：改写链接 + 清理内部工具名 ---------- */
const hubSrc = path.join(SOURCE_ROOT, "index.html");
let hub = fs.readFileSync(hubSrc, "utf8");

const HREF_MAP = [
  ["Diseases of the Abdomen and Pelvis 2023-2026 Diagnostic Imaging/output/index.html", "idkd-abdomen-pelvis-2023"],
  ["IAEA Atlas of Cardiac PET-CT A Case-Study Approach/output/index.html", "iaea-cardiac-petct-2022"],
  ["Diseases of the Brain, Head and Neck, Spine 2024-2027 Diagnostic Imaging/output/index.html", "idkd-brain-headneck-spine-2024"],
  ["Diseases of the Chest, Heart and Vascular System 2025-2028 Diagnostic Imaging/output/index.html", "idkd-chest-heart-vascular-2025"],
  ["Musculoskeletal Diseases 2026-2029 Diagnostic Imaging/output/index.html", "idkd-musculoskeletal-2026"],
  ["../output/index.html", "radiology-nuclear-medicine-2023"],
];
for (const [from, slug] of HREF_MAP) {
  assert(hub.includes(from), `合集页锚点命中：${slug}`);
  hub = hub.replaceAll(from, `/ct-library/${slug}/index.html`);
}

// 页脚：去掉内部工具链名称，改为面向读者的说明
const FOOTER_FROM =
  "翻译引擎：GLM / MiniMax（Tehui DSH 代理）· 每本均通过机械 QA + 浏览器视觉实测 + 译文体检三轮质检 · 双击各卡片打开离线阅读版";
const FOOTER_TO =
  "开放获取（OA）原文 · 机器翻译中文阅读版 · 每本均通过三轮质检 · 点击卡片进入离线阅读版";
assert(hub.includes(FOOTER_FROM), "合集页页脚锚点命中");
hub = hub.replace(FOOTER_FROM, FOOTER_TO);

fs.writeFileSync(path.join(OUTPUT_ROOT, "index.html"), hub);
assert(!/href="\.\./.test(hub), "合集页无残留相对上级链接");
assert(
  [...hub.matchAll(/href="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((h) => h.startsWith("/ct-library/")).length === 6,
  "合集页 6 张卡片全部指向站内书册",
);
console.log(`✓ 合集入口页已写入（${(Buffer.byteLength(hub) / 1024).toFixed(1)} KB）`);

/* ---------- 3) 总量 ---------- */
let files = 0;
(function count(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) count(p);
    else files++;
  }
})(OUTPUT_ROOT);
console.log(
  `\n完成：6 册 + 合集页，共 ${files} 个文件，${(dirSize(OUTPUT_ROOT) / 1024 / 1024).toFixed(0)} MB`,
);
