import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile, copyFile, stat } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const outputRoot = path.join(repoRoot, "public", "ultrasound-residency-training-kit");
const source2016 = "E:/Book2Know/Us-xiti-wangyou/住院医培训超声科示范案例_OCR/住院医师规范化培训超声医学科示范案例2016版.html";
const source2024 = "E:/Book2Know/Us-xiti-wangyou/超声医学住院医师规范化培训实践考核案例集_OCR/住院医师规范化培训超声医学科示范案例2024版.html";

const imagePattern = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
const concurrency = 8;

function imageSources(html) {
  return [...html.matchAll(imagePattern)].map((match) => match[1]);
}

function safeExtension(url, fallback = ".jpg") {
  try {
    const extension = path.extname(new URL(url).pathname).toLowerCase();
    return /^\.(?:jpg|jpeg|png|webp|gif|svg)$/.test(extension) ? extension : fallback;
  } catch {
    return path.extname(url.split(/[?#]/)[0]).toLowerCase() || fallback;
  }
}

function suiteEnhancement() {
  return `
<style id="training-suite-nav-style">
.training-suite-nav{position:fixed;z-index:3001;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));display:inline-flex;align-items:center;gap:8px;min-height:42px;padding:0 14px;border:1px solid rgba(255,255,255,.56);border-radius:999px;background:rgba(8,38,81,.94);box-shadow:0 12px 28px rgba(8,38,81,.28);color:#fff!important;font:700 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif!important;letter-spacing:.01em;text-decoration:none!important;backdrop-filter:blur(12px)}
.training-suite-nav:hover{background:#176cbe;color:#fff!important;transform:translateY(-1px)}
.training-suite-nav span{display:inline-block;width:7px;height:7px;border-radius:50%;background:#4ee7ae;box-shadow:0 0 0 4px rgba(78,231,174,.12)}
@media(max-width:720px){.training-suite-nav{right:12px;bottom:max(12px,env(safe-area-inset-bottom));min-height:44px;padding:0 13px;font-size:13px}.training-suite-nav strong{display:none}}
</style>
`;
}

function enhanceReader(html, label) {
  const nav = `<a class="training-suite-nav" href="../index.html" aria-label="返回超声医学规培三件套"><span></span><strong>超声医学规培三件套</strong>${label}</a>`;
  return html
    .replace(/<\/head>/i, `${suiteEnhancement()}</head>`)
    .replace(/<\/body>/i, `${nav}</body>`);
}

async function pool(items, task) {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      await task(item);
    }
  });
  await Promise.all(workers);
}

async function download2016Assets(html, destination) {
  const urls = [...new Set(imageSources(html))];
  const targetDir = path.join(destination, "images");
  await mkdir(targetDir, { recursive: true });
  const replacements = new Map();

  await pool(urls, async (url) => {
    const ordinal = urls.indexOf(url) + 1;
    const fileName = `${String(ordinal).padStart(4, "0")}${safeExtension(url)}`;
    const relativePath = `images/${fileName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`2016 图片下载失败 (${response.status}): ${url}`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 100) {
      throw new Error(`2016 图片内容异常: ${url}`);
    }
    await writeFile(path.join(destination, relativePath), bytes);
    replacements.set(url, relativePath);
  });

  let localized = html;
  for (const [url, relativePath] of replacements) {
    localized = localized.split(url).join(relativePath);
  }
  return { html: localized, imageCount: urls.length };
}

async function copy2024Assets(html, sourceRoot, destination) {
  const sources = [...new Set(imageSources(html))];
  await pool(sources, async (relativePath) => {
    const decoded = decodeURIComponent(relativePath);
    const from = path.resolve(sourceRoot, decoded);
    const to = path.resolve(destination, decoded);
    if (!to.startsWith(`${destination}${path.sep}`)) {
      throw new Error(`不安全的图片路径: ${relativePath}`);
    }
    await stat(from);
    await mkdir(path.dirname(to), { recursive: true });
    await copyFile(from, to);
  });
  return sources.length;
}

function makeHub() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="超声医学规培三件套：教材在线学习版，以及 2016、2024 两套住院医师规范化培训超声医学科示范案例。">
<title>超声医学规培三件套｜西瓜柚子</title>
<style>
:root{--navy:#082651;--blue:#176cbe;--cyan:#1aa8c9;--ink:#173552;--muted:#66809c;--line:#d9e7f4;--paper:#fff;font-family:Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:var(--ink);background:#f4f8fc}*{box-sizing:border-box}body{margin:0;min-width:320px;background:radial-gradient(circle at 92% 4%,rgba(26,168,201,.17),transparent 28rem),#f4f8fc}.header{height:68px;padding:0 max(18px,calc((100vw - 1220px)/2));display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(217,231,244,.9);background:rgba(255,255,255,.86);backdrop-filter:blur(16px)}.brand{display:inline-flex;align-items:center;gap:11px;color:var(--navy);font:800 12px/1 ui-monospace,Consolas,monospace;letter-spacing:.16em;text-decoration:none}.dot{width:31px;height:31px;border-radius:50%;background:linear-gradient(145deg,#247bd6,#1aa8c9);box-shadow:0 8px 20px rgba(36,123,214,.24);position:relative}.dot:after{content:"";position:absolute;width:5px;height:5px;inset:0;margin:auto;border-radius:50%;background:#fff}.back{padding:9px 14px;border-radius:999px;background:#eaf4ff;color:var(--blue);font-size:13px;font-weight:750;text-decoration:none}.shell{width:min(1180px,calc(100% - 36px));margin:0 auto;padding:76px 0 88px}.eyebrow{color:var(--blue);font:800 12px/1.45 ui-monospace,Consolas,monospace;letter-spacing:.15em}.hero{max-width:870px}.hero h1{margin:16px 0 18px;color:var(--navy);font-size:clamp(44px,7vw,80px);line-height:1;letter-spacing:-.065em}.hero p{margin:0;max-width:760px;color:#59738f;font-size:17px;line-height:1.85}.summary{display:flex;flex-wrap:wrap;gap:10px;margin:27px 0 48px}.summary span{padding:9px 13px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.82);color:var(--muted);font-size:13px}.summary strong{color:var(--navy)}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.card{min-width:0;min-height:360px;padding:29px;display:flex;flex-direction:column;border:1px solid #cee1f1;border-radius:22px;background:rgba(255,255,255,.92);box-shadow:0 18px 48px rgba(18,62,106,.09)}.card:nth-child(2){background:linear-gradient(150deg,#fff,#f1faff)}.card:nth-child(3){background:linear-gradient(150deg,#fff,#eef9f7)}.number{color:var(--blue);font:800 12px/1 ui-monospace,Consolas,monospace;letter-spacing:.14em}.card h2{margin:17px 0 12px;color:var(--navy);font-size:29px;letter-spacing:-.04em;line-height:1.2}.edition{margin:0 0 16px;color:#37678d;font-size:14px;font-weight:750}.card p{margin:0;color:#607a95;font-size:14px;line-height:1.75}.facts{display:flex;flex-wrap:wrap;gap:7px;margin-top:20px}.facts span{padding:6px 9px;border-radius:8px;background:#edf6ff;color:#417091;font-size:12px}.open{margin-top:auto;padding-top:27px;color:var(--blue);font-size:15px;font-weight:800;text-decoration:none}.note{margin-top:24px;padding:17px 20px;border-left:4px solid var(--blue);background:#eaf4ff;color:#5b7591;font-size:13px;line-height:1.75}@media(max-width:850px){.grid{grid-template-columns:1fr}.card{min-height:0}.shell{padding-top:50px}}@media(max-width:520px){.header{height:60px;padding:0 14px}.brand{font-size:10px}.dot{width:29px;height:29px}.back{padding:8px 11px;font-size:12px}.shell{width:min(100% - 28px,1180px);padding-bottom:62px}.hero h1{font-size:45px;letter-spacing:-.06em;overflow-wrap:anywhere}.hero p{font-size:15px}.summary{margin-bottom:32px}.card{padding:23px 21px;border-radius:18px}.card h2{font-size:27px}}
</style>
</head>
<body>
<header class="header"><a class="brand" href="/"><span class="dot"></span>XIGUA · YUZI</a><a class="back" href="/ultrasound-medicine-second-edition">返回文章</a></header>
<main class="shell"><section class="hero"><div class="eyebrow">ULTRASOUND · RESIDENCY TRAINING</div><h1>超声医学规培三件套</h1><p>将系统教材、示范案例与实践考核案例并列为三个独立阅读入口。每套内容保留原有章节与图片结构，适合按教材打基础、按案例自测、按考核场景复盘。</p></section>
<div class="summary"><span><strong>3</strong> 个独立在线入口</span><span><strong>127</strong> 个 2016 示例案例</span><span><strong>264</strong> 个 2024 实践案例</span><span>图片可放大阅读</span></div>
<section class="grid" aria-label="规培三件套入口"><article class="card"><div class="number">01 · TEXTBOOK</div><h2>超声医学（第2版）</h2><p class="edition">在线学习版</p><p>系统教材阅读入口，提供原书章节导航、全文搜索、图片浏览与字号调整，适合建立完整知识框架。</p><div class="facts"><span>章节导航</span><span>全文搜索</span><span>原书插图</span></div><a class="open" href="../ultrasound-medicine-2e/index.html">进入教材学习 →</a></article><article class="card"><div class="number">02 · CASES 2016</div><h2>住院医师规范化培训超声医学科示范案例2016版</h2><p class="edition">2016版 · 自测学习</p><p>按检查部位组织的示范案例。点击答案区即可自测，支持案例目录、全文检索与图像放大。</p><div class="facts"><span>127 个案例</span><span>468 幅图像</span><span>自测模式</span></div><a class="open" href="cases-2016/index.html">进入 2016 版案例 →</a></article><article class="card"><div class="number">03 · CASES 2024</div><h2>住院医师规范化培训超声医学科示范案例2024版</h2><p class="edition">2024版 · 规范化培训</p><p>面向实践考核的案例集合，保留分类导航、题干与图像对应关系，便于专题练习与复盘。</p><div class="facts"><span>264 个案例</span><span>1,224 幅图像</span><span>分类检索</span></div><a class="open" href="cases-2024/index.html">进入 2024 版案例 →</a></article></section><aside class="note">内容用于医学教育与个人学习，不构成诊断、治疗或操作建议。涉及临床判断时，请结合权威教材、指南及上级医师意见核对。</aside></main>
</body></html>`;
}

async function main() {
  const [html2016, html2024] = await Promise.all([
    readFile(source2016, "utf8"),
    readFile(source2024, "utf8"),
  ]);
  const source2024Root = path.dirname(source2024);
  const destination2016 = path.join(outputRoot, "cases-2016");
  const destination2024 = path.join(outputRoot, "cases-2024");

  await rm(outputRoot, { recursive: true, force: true });
  await Promise.all([mkdir(destination2016, { recursive: true }), mkdir(destination2024, { recursive: true })]);

  const localized2016 = await download2016Assets(html2016, destination2016);
  const imageCount2024 = await copy2024Assets(html2024, source2024Root, destination2024);

  await Promise.all([
    writeFile(path.join(outputRoot, "index.html"), makeHub(), "utf8"),
    writeFile(path.join(destination2016, "index.html"), enhanceReader(localized2016.html, "2016 案例"), "utf8"),
    writeFile(path.join(destination2024, "index.html"), enhanceReader(html2024, "2024 案例"), "utf8"),
  ]);

  const report = {
    title: "超声医学规培三件套",
    textbook: { href: "../ultrasound-medicine-2e/index.html" },
    cases2016: { cases: 127, images: localized2016.imageCount },
    cases2024: { cases: 264, images: imageCount2024 },
  };
  await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  const digest = createHash("sha256").update(JSON.stringify(report)).digest("hex").slice(0, 12);
  console.log(`已生成超声医学规培三件套：2016 版 ${localized2016.imageCount} 图，2024 版 ${imageCount2024} 图，校验标识 ${digest}。`);
}

await main();
