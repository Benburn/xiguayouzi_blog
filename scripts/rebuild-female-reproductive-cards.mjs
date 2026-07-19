import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const sourceRoot = "E:\\Book2Know\\Us-Female Reproductive System";
const ocrRoot = path.join(sourceRoot, "ocr_output");
const outputRoot = path.join(repoRoot, "public", "female-reproductive-ultrasound-cards");
const assetsRoot = path.join(outputRoot, "assets");

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index);

const groups = {
  anatomy: { label: "解剖与生理", color: "#356fda" },
  technique: { label: "超声基础与成像", color: "#168bb8" },
  protocol: { label: "规范化检查", color: "#0f8f86" },
  art: { label: "辅助生殖", color: "#317a61" },
  tube: { label: "输卵管评估", color: "#8a66c2" },
  receptivity: { label: "内膜容受性", color: "#7e6db5" },
  disease: { label: "常见妇科疾病", color: "#b45d7a" },
  pregnancy: { label: "早孕与并发症", color: "#267f9d" },
};

// start/end are literal source headings. Generation fails if either boundary is missing.
// This prevents a title from silently being paired with a guessed page range.
const topics = [
  { file: "解剖与生理总览.html", title: "解剖与生理总览", en: "Anatomy and Physiology Overview", group: "anatomy", pages: range(9, 26), start: "# Anatomy and Physiology of the Female Reproductive System", end: "## References" },
  { file: "外生殖器解剖.html", title: "外生殖器解剖", en: "External Genitalia", group: "anatomy", pages: range(9, 11), start: "#### 1.1.1 External Genitalia", end: "#### 1.1.2 Internal Genitalia" },
  { file: "阴道与子宫结构.html", title: "阴道与子宫结构", en: "Vagina and Uterus", group: "anatomy", pages: range(11, 14), start: "1. Vagina:", end: "3. Fallopian tubes" },
  { file: "输卵管与卵巢.html", title: "输卵管与卵巢", en: "Fallopian Tubes and Ovaries", group: "anatomy", pages: range(14, 17), start: "3. Fallopian tubes", end: "#### 1.1.3 Blood Vessels and Lymphatic Vessels" },
  { file: "卵泡发育与周期.html", title: "卵泡发育与周期", en: "Follicular Development and the Ovarian Cycle", group: "anatomy", pages: range(18, 21), start: "### 1.2 Ovarian Cycle and Ovulation", end: "#### 1.2.3 Ovulation" },
  { file: "排卵与黄体形成.html", title: "排卵与黄体形成", en: "Ovulation and Corpus Luteum Formation", group: "anatomy", pages: range(21, 22), start: "#### 1.2.3 Ovulation", end: "### 1.3 Endometrium and Menstruation" },
  { file: "子宫内膜与月经周期.html", title: "子宫内膜与月经周期", en: "Endometrium and Menstrual Cycle", group: "anatomy", pages: range(22, 26), start: "### 1.3 Endometrium and Menstruation", end: "## References" },

  { file: "超声物理基础.html", title: "超声物理基础", en: "Fundamentals of Ultrasound", group: "technique", pages: range(27, 28), start: "### 2.1 Fundamentals of Ultrasonic Diagnosis", end: "#### 2.1.2 Ultrasonic Probe" },
  { file: "超声探头类型.html", title: "超声探头类型", en: "Ultrasonic Probe Types", group: "technique", pages: range(28, 31), start: "#### 2.1.2 Ultrasonic Probe", end: "#### 2.1.3 Ultrasound System/Equipment" },
  { file: "多普勒超声成像.html", title: "多普勒超声成像", en: "Doppler Ultrasound Imaging", group: "technique", pages: range(33, 37), start: "#### 2.2.2 Principles and Applications of Doppler Ultrasound Imaging", end: "#### 2.2.3 Principles and Applications of 3D Ultrasound Imaging" },
  { file: "三维超声成像技术.html", title: "三维超声成像技术", en: "Principles of 3D Ultrasound Imaging", group: "technique", pages: range(37, 41), start: "#### 2.2.3 Principles and Applications of 3D Ultrasound Imaging", end: "### 2. 3D ultrasound in reproductive medicine" },
  { file: "三维超声子宫畸形.html", title: "三维超声与子宫畸形", en: "3D Ultrasound of Uterine Anomalies", group: "technique", pages: range(41, 42), start: "## (a) 3D ultrasound-assisted diagnosis of uterine anomalies", end: "## (b) 3D ultrasound-assisted diagnosis of polycystic ovaries" },
  { file: "三维超声多囊卵巢.html", title: "三维超声与多囊卵巢", en: "3D Ultrasound of Polycystic Ovaries", group: "technique", pages: range(42, 44), start: "## (b) 3D ultrasound-assisted diagnosis of polycystic ovaries", end: "## (c) Endometrial receptivity" },
  { file: "三维超声内膜容受性.html", title: "三维超声与内膜容受性", en: "3D Ultrasound of Endometrial Receptivity", group: "technique", pages: [44], start: "## (c) Endometrial receptivity", end: "## (d) Application of 3D ultrasound in the diagnosis of other gynecological diseases" },

  { file: "经阴道超声方案.html", title: "经阴道超声标准化方案", en: "Standardized Transvaginal Ultrasound Protocol", group: "protocol", pages: range(51, 64), start: "# Standardized Protocol for Transvaginal Ultrasound of the Uterus and Adnexa", end: "## References" },

  { file: "卵泡监测与取卵.html", title: "卵泡监测与取卵", en: "Follicle Monitoring and Oocyte Retrieval", group: "art", pages: range(81, 96), start: "### 4.2 Monitoring Ovulation in Natural Cycles and Follicular Development in Ovarian Hyperstimulation", end: "#### 4.3.3 Transabdominal Ultrasound-Guided Embryo Transfer" },
  { file: "POI超声评估.html", title: "卵巢早衰（POI/POF）评估", en: "Premature Ovarian Insufficiency / Failure", group: "art", pages: range(73, 75), start: "### 2. Premature Ovarian Insufficiency (POI) and Premature Ovarian Failure (POF)", end: "### 3. Resistant Ovary Syndrome (ROS)" },
  { file: "胚胎移植超声引导.html", title: "胚胎移植超声引导", en: "Ultrasound-Guided Embryo Transfer", group: "art", pages: range(96, 100), start: "#### 4.3.3 Transabdominal Ultrasound-Guided Embryo Transfer", end: "### 4.4 Complications During Assisted Reproductive Treatment" },

  { file: "HyCoSy输卵管造影.html", title: "HyCoSy 输卵管超声造影", en: "4D Hysterosalpingo-Contrast Sonography", group: "tube", pages: range(115, 152), start: "### 5.3 4D HyCoS_{y}", end: "### 5.4 Management of Intracontrast and Postcontrast Adverse Events and Postcontrast Cautions" },
  { file: "SIS超声检查.html", title: "SIS 超声检查", en: "Saline Infusion Sonography", group: "tube", pages: range(118, 128), start: "## Flow 2: Salpingo-Contrast Ultrasound After SIS", end: "#### 5.3.3 Normal Images and Analysis of Ultrasound Images" },

  { file: "内膜形态学评估.html", title: "内膜形态学评估", en: "Morphologic Assessment of Endometrial Receptivity", group: "receptivity", pages: range(157, 163), start: "### 6.2 Markers of Endometrial Morphology for Evaluating Endometrial Receptivity by Ultrasound", end: "### 6.3 Hemodynamic Markers for Evaluating ER by Ultrasound" },
  { file: "内膜血流与蠕动波.html", title: "内膜血流与蠕动波", en: "Endometrial Blood Flow and Peristalsis", group: "receptivity", pages: range(161, 175), start: "#### 6.2.4 Endometrial Peristalsis (EP)", end: "### 6.4 Ovulation Induction, Controlled Ovarian Hyperstimulation, and ER" },

  { file: "子宫肌瘤超声诊断.html", title: "子宫肌瘤超声诊断", en: "Fibroids (Uterine Myomas)", group: "disease", pages: range(217, 228), start: "#### 7.2.2 Fibroids (Uterine Myomas)", end: "#### 7.2.3 Uterine Adenomyosis" },
  { file: "子宫腺肌症超声.html", title: "子宫腺肌症超声", en: "Uterine Adenomyosis", group: "disease", pages: range(228, 232), start: "#### 7.2.3 Uterine Adenomyosis", end: "#### 7.2.4 Cervical Diseases" },
  { file: "内膜息肉与宫腔病变.html", title: "内膜息肉与宫腔病变", en: "Endometrial Diseases and Intrauterine Lesions", group: "disease", pages: range(207, 217), start: "#### 7.2.1 Endometrial Diseases", end: "#### 7.2.2 Fibroids (Uterine Myomas)" },
  { file: "多囊卵巢综合征超声.html", title: "多囊卵巢综合征超声", en: "Polycystic Ovary Syndrome", group: "disease", pages: range(245, 246), start: "#### 7.3.2 Polycystic Ovary Syndrome (PCOS)", end: "#### 7.3.3 Overview of Ovarian Tumors" },
  { file: "卵巢囊肿与肿瘤.html", title: "卵巢囊肿与肿瘤", en: "Ovarian Cysts and Tumors", group: "disease", pages: range(240, 267), start: "### 7.3 Ovary-Related Diseases", end: "### 7.4 Tubal-Related Diseases" },
  { file: "输卵管积水与盆腔炎.html", title: "输卵管积水与盆腔炎", en: "Hydrosalpinx and Tubal Infection", group: "disease", pages: range(267, 277), start: "#### 7.4.1 Infectious Diseases of the Fallopian Tubes", end: "#### 7.4.2 Primary Fallopian Tube Carcinoma (PFTC)" },

  { file: "正常早孕超声.html", title: "正常早孕超声", en: "Ultrasound of Normal Early Pregnancy", group: "pregnancy", pages: range(284, 288), start: "### 8.1 Ultrasound Evaluation of Normal Early Pregnancy", end: "### 8.2 Miscarriage" },
  { file: "异位妊娠超声诊断.html", title: "异位妊娠超声诊断", en: "Ultrasound Diagnosis of Ectopic Pregnancy", group: "pregnancy", pages: range(297, 313), start: "### 8.3 Ectopic Pregnancy", end: "### 8.4 Ultrasound Evaluation of Twin and Multiple Pregnancies" },
  { file: "流产与妊娠并发症.html", title: "流产与妊娠并发症", en: "Miscarriage and Early-Pregnancy Complications", group: "pregnancy", pages: range(288, 297), start: "### 8.2 Miscarriage", end: "### 8.3 Ectopic Pregnancy" },
];

marked.setOptions({ gfm: true, breaks: false });

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function readSourcePage(page) {
  const filename = path.join(ocrRoot, `page_${String(page).padStart(4, "0")}.md`);
  if (!fs.existsSync(filename)) throw new Error(`Missing OCR page: ${filename}`);
  return fs.readFileSync(filename, "utf8").trim();
}

function buildFigureCatalog() {
  const catalog = new Map();
  for (let page = 1; page <= 318; page += 1) {
    const filename = path.join(ocrRoot, `page_${String(page).padStart(4, "0")}.md`);
    if (!fs.existsSync(filename)) continue;
    const lines = fs.readFileSync(filename, "utf8").split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const figureNumbers = [...lines[index].matchAll(/\bFig\.\s*(\d+\.\d+)/gi)].map((match) => match[1]);
      if (!figureNumbers.length) continue;
      let imageLine = "";
      for (let cursor = index - 1; cursor >= Math.max(0, index - 14); cursor -= 1) {
        if (/<img\s/i.test(lines[cursor])) {
          imageLine = lines[cursor].trim();
          break;
        }
        if (/^#{1,4}\s/.test(lines[cursor])) break;
      }
      if (!imageLine) continue;
      const snippet = `${imageLine}\n\n${lines[index].trim()}`;
      for (const figureNumber of figureNumbers) {
        if (!catalog.has(figureNumber)) catalog.set(figureNumber, { page, snippet });
      }
    }
  }
  return catalog;
}

const figureCatalog = buildFigureCatalog();

function extractFigureNumbers(text) {
  const numbers = new Set();
  for (const match of text.matchAll(/\bFigs?\.\s*(\d+\.\d+)(?:\s*(?:,|and|–|—|-)\s*(\d+\.\d+))?/gi)) {
    numbers.add(match[1]);
    if (match[2]) numbers.add(match[2]);
  }
  return numbers;
}

function restoreReferencedFigures(blocks) {
  const text = blocks.map((block) => block.markdown).join("\n");
  const referenced = extractFigureNumbers(text);
  const present = new Set();
  for (const match of text.matchAll(/<div[^>]*>\s*Figs?\.\s*([^<]+)/gi)) {
    for (const number of match[1].match(/\d+\.\d+/g) ?? []) present.add(number);
  }
  for (const figureNumber of referenced) {
    if (present.has(figureNumber)) continue;
    const figure = figureCatalog.get(figureNumber);
    if (!figure) continue;
    let target = blocks.find((block) => block.page === figure.page);
    if (!target) target = blocks.reduce((closest, block) => Math.abs(block.page - figure.page) < Math.abs(closest.page - figure.page) ? block : closest, blocks[0]);
    target.markdown += `\n\n<div class="restored-figure-note">原书正文引用图（原书 PDF 第 ${figure.page + 1} 页）</div>\n\n${figure.snippet}`;
    present.add(figureNumber);
  }
  return blocks;
}

function sliceTopic(topic) {
  const joined = topic.pages.map((page) => `\n<!--SOURCE_PAGE:${page}-->\n${readSourcePage(page)}`).join("\n");
  const startIndex = joined.indexOf(topic.start);
  if (startIndex === -1) throw new Error(`${topic.file}: start boundary not found: ${topic.start}`);
  const endIndex = joined.indexOf(topic.end, startIndex + topic.start.length);
  if (endIndex === -1) throw new Error(`${topic.file}: end boundary not found: ${topic.end}`);
  const content = `<!--SOURCE_PAGE:${topic.pages[0]}-->\n${joined.slice(startIndex, endIndex).trim()}`;
  const blocks = [];
  const marker = /<!--SOURCE_PAGE:(\d+)-->/g;
  const matches = [...content.matchAll(marker)];
  for (let index = 0; index < matches.length; index += 1) {
    const page = Number(matches[index][1]);
    const start = matches[index].index + matches[index][0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : content.length;
    const markdown = content.slice(start, end).trim();
    if (markdown) blocks.push({ page, markdown });
  }
  return blocks;
}

function rewriteAndCopyImages(markdown, topicFile, imageSet) {
  return markdown.replace(/(<img\s+[^>]*src=["'])imgs\/([^"']+)(["'][^>]*>)/gi, (_, before, imageName, after) => {
    const source = path.join(ocrRoot, "imgs", imageName);
    if (!fs.existsSync(source)) throw new Error(`${topicFile}: referenced image missing: ${source}`);
    const target = path.join(assetsRoot, imageName);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (!fs.existsSync(target)) fs.copyFileSync(source, target);
    imageSet.add(imageName);
    return `${before}assets/${imageName}${after}`;
  });
}

function extractOutline(blocks) {
  const outline = [];
  for (const block of blocks) {
    const lines = block.markdown.split(/\r?\n/);
    for (const line of lines) {
      const match = /^(#{1,4})\s+(.+)$/.exec(line.trim());
      if (!match) continue;
      const text = match[2].replace(/<[^>]+>/g, "").trim();
      if (text.toLowerCase() === "references") continue;
      outline.push({ text, page: block.page, level: match[1].length });
    }
  }
  return outline;
}

function pageRange(blocks) {
  const pages = blocks.map((block) => block.page + 1);
  return pages[0] === pages.at(-1) ? `原书 PDF 第 ${pages[0]} 页` : `原书 PDF 第 ${pages[0]}–${pages.at(-1)} 页`;
}

function topicPage(topic, index, blocks, imageCount) {
  const previous = topics[index - 1];
  const next = topics[index + 1];
  const outline = extractOutline(blocks);
  const firstPdfPage = blocks[0].page + 1;
  const content = blocks.map((block) => {
    const pdfPage = block.page + 1;
    const html = marked.parse(block.markdown);
    return `<section class="source-page" id="source-page-${pdfPage}">
      <div class="source-page__bar"><span>原书 PDF 第 ${pdfPage} 页</span><a href="Ultrasonography%20of%20the%20Female%20Reproductive%20System.pdf#page=${pdfPage}" target="_blank" rel="noopener">核对原页 ↗</a></div>
      <div class="source-copy">${html}</div>
    </section>`;
  }).join("\n");
  const toc = outline.length ? `<aside class="page-toc" aria-label="本节原书目录"><strong>本节原书目录</strong>${outline.map((item) => `<a class="toc-level-${Math.min(item.level, 4)}" href="#source-page-${item.page + 1}">${escapeHtml(item.text)}</a>`).join("")}</aside>` : "";
  const tocLine = toc ? `      ${toc}\n` : "";
  const navLink = (target, label, fallback) => target
    ? `<a href="${encodeURI(target.file)}"><span>${label}</span><strong>${escapeHtml(target.title)}</strong></a>`
    : `<a href="index.html"><span>${label}</span><strong>${fallback}</strong></a>`;

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="description" content="${escapeHtml(topic.title)}：按原书小节边界逐页呈现正文、图片与图注。">
  <title>${escapeHtml(topic.title)}｜女性生殖系统超声</title>
  <link rel="stylesheet" href="reader.css">
</head>
<body>
  <header class="topbar"><a class="brand" href="index.html"><span class="brand-dot"></span><span>XIGUA · YUZI</span></a><nav><a href="index.html">全部专题</a><a href="../blog/imaging">医学影像</a><a href="Ultrasonography%20of%20the%20Female%20Reproductive%20System.pdf#page=${firstPdfPage}" target="_blank" rel="noopener">原书 PDF</a></nav></header>
  <main>
    <section class="topic-hero" style="--accent:${groups[topic.group].color}">
      <div class="eyebrow"><span>${String(index + 1).padStart(2, "0")}</span>${groups[topic.group].label}</div>
      <h1>${escapeHtml(topic.title)}</h1>
      <p class="english-title">${escapeHtml(topic.en)}</p>
      <div class="topic-meta"><a href="Ultrasonography%20of%20the%20Female%20Reproductive%20System.pdf#page=${firstPdfPage}" target="_blank" rel="noopener">${pageRange(blocks)} ↗</a><span>${blocks.length} 个原书页面</span><span>${imageCount} 幅对应图片</span></div>
      <p class="source-note">以下内容严格按原书小节边界和页面顺序呈现。正文保留英文原文；图片只放在其所在原书页，并保留相邻原始图号与图注，避免摘要或二次配图造成错配。</p>
    </section>
    <div class="reader-layout">
${tocLine}      <article class="reader-content">${content}</article>
    </div>
    <nav class="topic-pagination">${navLink(previous, "上一专题", "返回目录")}${navLink(next, "下一专题", "返回目录")}</nav>
  </main>
  <footer><span>女性生殖系统超声 · 原书图文核对版</span><a href="index.html">返回专题目录</a></footer>
  <dialog class="image-viewer"><button type="button" aria-label="关闭大图">×</button><img alt="原书图片放大预览"></dialog>
  <script src="reader.js" defer></script>
</body>
</html>`;
}

function indexPage(results) {
  const grouped = Object.entries(groups).map(([key, group]) => {
    const cards = results.filter((result) => result.topic.group === key);
    if (!cards.length) return "";
    return `<section class="index-group" style="--accent:${group.color}"><div class="group-heading"><p>${group.label}</p><span>${cards.length} 个专题</span></div><div class="topic-grid">${cards.map((result) => `<a class="topic-card" href="${encodeURI(result.topic.file)}"><span class="card-index">${String(result.index + 1).padStart(2, "0")}</span><div><h2>${escapeHtml(result.topic.title)}</h2><p>${escapeHtml(result.topic.en)}</p><small>PDF 第 ${result.blocks[0].page + 1}–${result.blocks.at(-1).page + 1} 页 · ${result.imageCount} 幅图</small></div><span class="card-arrow">↗</span></a>`).join("")}</div></section>`;
  }).join("");
  const totalImages = new Set(results.flatMap((result) => result.images)).size;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="description" content="女性生殖系统超声原书图文核对版，共 31 个专题。">
  <title>女性生殖系统超声｜专题目录</title>
  <link rel="stylesheet" href="reader.css">
</head>
<body class="index-page">
  <header class="topbar"><a class="brand" href="index.html"><span class="brand-dot"></span><span>XIGUA · YUZI</span></a><nav><a href="../blog/imaging">医学影像</a><a href="Ultrasonography%20of%20the%20Female%20Reproductive%20System.pdf" target="_blank" rel="noopener">原书 PDF</a></nav></header>
  <main>
    <section class="index-hero"><p class="eyebrow">REFERENCE-ALIGNED EDITION</p><h1>女性生殖系统<br><span>超声专题</span></h1><p class="index-lead">按原书小节重新核对正文、图片与图注。每个专题保留英文原文，并提供可直达的 PDF 页码，方便逐页复核。</p><div class="index-stats"><span><strong>${topics.length}</strong> 个专题</span><span><strong>${totalImages}</strong> 幅原书图片</span><span><strong>318</strong> 页原书索引</span></div><label class="search"><span>搜索专题</span><input type="search" placeholder="输入中文或英文标题" autocomplete="off"></label></section>
    <div class="groups">${grouped}</div>
  </main>
  <footer><span>内容源自 <em>Ultrasonography of the Female Reproductive System</em>（2025）</span><a href="../blog/imaging">返回医学影像</a></footer>
  <script src="reader.js" defer></script>
</body>
</html>`;
}

const css = `:root{--ink:#0b2a55;--muted:#607797;--line:#dfe9f5;--paper:#fff;--wash:#f5f9fe;--blue:#247bd6;font-family:Inter,"PingFang SC","Microsoft YaHei",system-ui,-apple-system,sans-serif;color:var(--ink);background:#f7faff;font-synthesis:none}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:92px}body{margin:0;background:linear-gradient(180deg,#f8fbff 0,#fff 38rem);color:var(--ink)}a{color:inherit;text-decoration:none}.topbar{position:sticky;top:0;z-index:50;height:72px;padding:0 max(24px,calc((100vw - 1280px)/2));display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(218,230,244,.85);background:rgba(250,252,255,.9);backdrop-filter:blur(18px)}.brand{display:flex;align-items:center;gap:11px;font:700 12px/1 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.2em}.brand-dot{width:30px;height:30px;border-radius:50%;background:var(--blue);box-shadow:0 8px 22px rgba(36,123,214,.25);position:relative}.brand-dot:after{content:"";position:absolute;width:5px;height:5px;border-radius:50%;background:#fff;inset:0;margin:auto}.topbar nav{display:flex;gap:8px}.topbar nav a{padding:9px 13px;border-radius:999px;color:#4f6888;font-size:14px;font-weight:650}.topbar nav a:hover{background:#eaf3ff;color:#175fac}main{max-width:1280px;margin:auto;padding:0 24px}.topic-hero{padding:76px 0 52px;border-bottom:1px solid var(--line)}.eyebrow{display:flex;align-items:center;gap:12px;color:var(--accent,var(--blue));font:700 12px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.17em;text-transform:uppercase}.eyebrow span{display:inline-grid;place-items:center;min-width:34px;height:25px;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--accent,var(--blue)) 10%,white)}.topic-hero h1{max-width:900px;margin:22px 0 5px;font-size:clamp(42px,6vw,76px);line-height:1.08;letter-spacing:-.055em}.english-title{margin:0;color:#7790ae;font:600 clamp(16px,2vw,21px)/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.025em}.topic-meta{display:flex;flex-wrap:wrap;gap:10px 22px;margin-top:30px;color:#607797;font-size:13px}.topic-meta a{color:var(--accent);font-weight:700}.source-note{max-width:860px;margin:24px 0 0;padding:16px 18px;border-left:3px solid var(--accent);border-radius:0 12px 12px 0;background:color-mix(in srgb,var(--accent) 5%,white);color:#4e6684;line-height:1.85;font-size:14px}.reader-layout{display:grid;grid-template-columns:250px minmax(0,820px);justify-content:center;gap:46px;padding:48px 0 80px}.page-toc{position:sticky;top:96px;align-self:start;max-height:calc(100vh - 120px);overflow:auto;padding:18px 0;border-top:2px solid var(--ink);border-bottom:1px solid var(--line)}.page-toc strong{display:block;margin-bottom:13px;font-size:13px}.page-toc a{display:block;padding:6px 8px;border-left:2px solid transparent;color:#7187a3;font-size:12px;line-height:1.45}.page-toc a:hover{border-left-color:var(--blue);color:var(--ink);background:#f0f6fd}.page-toc .toc-level-3{font-weight:700;color:#496482}.page-toc .toc-level-4{padding-left:18px}.source-page{margin:0 0 28px;border:1px solid var(--line);border-radius:18px;background:var(--paper);box-shadow:0 18px 50px rgba(35,72,116,.06);overflow:hidden}.source-page__bar{position:sticky;top:72px;z-index:4;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:11px 20px;border-bottom:1px solid var(--line);background:rgba(247,250,254,.94);color:#7187a2;font:650 12px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;backdrop-filter:blur(10px)}.source-page__bar a{color:#2472c7}.source-copy{padding:clamp(22px,4vw,48px);color:#293f5d;font-family:Georgia,"Times New Roman","Noto Serif SC",serif;font-size:17px;line-height:1.78}.source-copy>:first-child{margin-top:0}.source-copy>:last-child{margin-bottom:0}.source-copy h1,.source-copy h2,.source-copy h3,.source-copy h4{font-family:Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:var(--ink);line-height:1.28;letter-spacing:-.025em}.source-copy h1{font-size:32px}.source-copy h2{font-size:27px;margin-top:2em}.source-copy h3{font-size:23px;margin-top:1.8em}.source-copy h4{font-size:19px;margin-top:1.6em}.source-copy p{margin:1em 0}.source-copy li+li{margin-top:.45em}.source-copy img{display:block!important;width:auto!important;max-width:100%!important;height:auto!important;margin:22px auto 10px;border-radius:10px;background:#edf3f9;box-shadow:0 12px 30px rgba(16,48,86,.1);cursor:zoom-in}.source-copy div[style*="text-align: center"]{color:#526982;font-family:Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;font-size:13px;line-height:1.55}.source-copy table{display:block;max-width:100%;overflow:auto;border-collapse:collapse;font-family:Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;font-size:14px}.source-copy th,.source-copy td{padding:9px 11px;border:1px solid #dce7f2;vertical-align:top}.source-copy blockquote{margin:20px 0;padding:12px 18px;border-left:3px solid #5d94d2;background:#f5f9fe;color:#516b8b}.topic-pagination{display:grid;grid-template-columns:1fr 1fr;gap:18px;padding:0 0 72px}.topic-pagination a{display:flex;flex-direction:column;gap:6px;padding:22px 24px;border:1px solid var(--line);border-radius:16px;background:#fff}.topic-pagination a:last-child{text-align:right}.topic-pagination span{color:#7b8fa8;font-size:12px}.topic-pagination strong{font-size:16px}footer{max-width:1280px;margin:auto;padding:26px 24px 34px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:20px;color:#7187a2;font-size:12px}.image-viewer{width:min(96vw,1400px);height:min(92vh,1000px);padding:48px 18px 18px;border:0;border-radius:18px;background:#071424e8}.image-viewer::backdrop{background:#071424b8;backdrop-filter:blur(6px)}.image-viewer img{display:block;max-width:100%;max-height:calc(92vh - 70px);margin:auto;object-fit:contain}.image-viewer button{position:absolute;right:15px;top:10px;width:34px;height:34px;border:0;border-radius:50%;background:#fff;color:#0a294e;font-size:22px;cursor:pointer}.index-hero{padding:86px 0 70px;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:24px 70px;align-items:end}.index-hero>.eyebrow{grid-column:1/-1}.index-hero h1{margin:0;font-size:clamp(52px,8vw,106px);line-height:.95;letter-spacing:-.07em}.index-hero h1 span{color:#2082c7}.index-lead{max-width:610px;margin:0;color:#58708f;font-size:17px;line-height:1.85}.index-stats{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:14px}.index-stats span{padding:11px 16px;border:1px solid var(--line);border-radius:999px;background:#fff;color:#6a7f9b;font-size:13px}.index-stats strong{color:var(--ink);font-size:16px}.search{grid-column:1/-1;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:18px;max-width:720px;padding:12px 16px;border:1px solid #cfdeef;border-radius:14px;background:#fff;color:#5f7692;font-size:13px;box-shadow:0 12px 35px rgba(27,75,126,.07)}.search input{min-width:0;border:0;outline:0;background:transparent;color:var(--ink);font:inherit;font-size:16px}.groups{padding-bottom:80px}.index-group{padding:35px 0;border-top:1px solid var(--line)}.group-heading{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:18px}.group-heading p{margin:0;color:var(--accent);font-size:13px;font-weight:800;letter-spacing:.12em}.group-heading span{color:#879ab1;font-size:12px}.topic-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.topic-card{display:grid;grid-template-columns:42px minmax(0,1fr) 30px;gap:12px;align-items:center;min-height:112px;padding:20px;border:1px solid var(--line);border-radius:15px;background:#fff;transition:.2s ease}.topic-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--accent) 45%,white);box-shadow:0 16px 38px rgba(33,76,122,.09)}.card-index{color:var(--accent);font:800 12px/1 ui-monospace,SFMono-Regular,Consolas,monospace}.topic-card h2{margin:0 0 5px;font-size:19px;letter-spacing:-.025em}.topic-card p{margin:0 0 8px;color:#7890ab;font:500 11px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace}.topic-card small{color:#8094ac}.card-arrow{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#edf5fe;color:var(--accent)}.topic-card[hidden],.index-group[hidden]{display:none}
@media(max-width:900px){.reader-layout{grid-template-columns:1fr;gap:18px}.page-toc{position:static;max-height:none;padding:15px;border:1px solid var(--line);border-radius:14px;background:#fff}.page-toc a{display:none}.page-toc strong:after{content:"（正文按原书页分段）";font-weight:500;color:#8296ad}.index-hero{grid-template-columns:1fr}.topic-grid{grid-template-columns:1fr}}
@media(max-width:640px){.topbar{height:62px;padding:0 16px}.brand{font-size:10px}.brand-dot{width:27px;height:27px}.topbar nav{gap:2px}.topbar nav a{padding:8px;font-size:12px}.topbar nav a:nth-child(2){display:none}main{padding:0 15px}.topic-hero{padding:44px 0 35px}.topic-hero h1{margin-top:17px;font-size:clamp(38px,12vw,54px)}.english-title{font-size:14px}.topic-meta{gap:8px 14px;margin-top:22px}.source-note{font-size:13px;line-height:1.7}.reader-layout{padding:24px 0 48px}.source-page{border-radius:14px}.source-page__bar{top:62px;padding:9px 13px;font-size:10px}.source-copy{padding:22px 18px;font-size:16px;line-height:1.72}.source-copy h1{font-size:27px}.source-copy h2{font-size:24px}.source-copy h3{font-size:21px}.source-copy h4{font-size:18px}.topic-pagination{grid-template-columns:1fr;padding-bottom:48px}.topic-pagination a:last-child{text-align:left}footer{padding:22px 16px;flex-direction:column}.index-hero{padding:52px 0 44px;gap:28px}.index-hero h1{font-size:clamp(50px,17vw,78px)}.index-lead{font-size:15px}.search{grid-template-columns:1fr;gap:6px}.topic-card{grid-template-columns:34px minmax(0,1fr) 28px;min-height:104px;padding:16px 13px}.topic-card h2{font-size:17px}.topic-card p{font-size:10px}.image-viewer{padding-top:52px}}
`;

const supplementalCss = `
.restored-figure-note{margin:28px 0 8px;padding:8px 11px;border-radius:8px;background:#edf5fe;color:#3570ae;font-family:Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;font-size:12px;font-weight:700}
.chapter-summary{max-width:880px;margin:27px 0 0;padding:20px 22px;border:1px solid color-mix(in srgb,var(--accent) 22%,white);border-radius:16px;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 7%,white),#fff);box-shadow:0 14px 38px rgba(31,75,121,.06)}
.chapter-summary p{margin:0}.chapter-summary__label{margin-bottom:10px!important;color:var(--accent);font:800 11px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.14em}.chapter-summary__cn{color:#294666;font-size:16px;line-height:1.8}.chapter-summary__en{margin-top:8px!important;color:#7186a0;font:400 13px/1.65 Georgia,"Times New Roman",serif}
.global-language-switch{display:inline-flex;align-items:center;gap:5px;margin-top:18px;padding:5px;border:1px solid var(--line);border-radius:999px;background:#fff;box-shadow:0 8px 24px rgba(31,75,121,.06)}
.global-language-switch>span{padding:0 8px;color:#7187a2;font-size:12px}.global-language-switch button,.lang-switch button{border:0;border-radius:999px;background:transparent;color:#6f829a;font:700 11px/1 Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;cursor:pointer}
.global-language-switch button{padding:9px 13px}.global-language-switch button.active,.lang-switch button.active{background:var(--accent,#247bd6);color:#fff;box-shadow:0 5px 14px color-mix(in srgb,var(--accent,#247bd6) 24%,transparent)}
.source-page__actions{display:flex;align-items:center;gap:12px}.lang-switch{display:inline-flex;padding:3px;border:1px solid #d9e5f2;border-radius:999px;background:#fff}.lang-switch button{padding:6px 9px}.language-panel[hidden]{display:none!important}
.source-copy.language-zh{color:#243f60;font-family:"Noto Serif SC","Songti SC","SimSun",Georgia,serif;line-height:1.9}.source-copy.language-zh h1,.source-copy.language-zh h2,.source-copy.language-zh h3,.source-copy.language-zh h4{font-family:Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif}.source-copy.language-en{color:#324a67}
@media(max-width:640px){.chapter-summary{padding:17px 16px}.chapter-summary__cn{font-size:15px}.chapter-summary__en{font-size:12px}.global-language-switch{width:100%;justify-content:center}.global-language-switch>span{display:none}.source-page__bar{align-items:flex-start}.source-page__actions{gap:7px}.lang-switch button{padding:6px 8px}.source-page__actions>a{white-space:nowrap}}
`;

const js = `document.addEventListener("DOMContentLoaded",()=>{
  const setPageLanguage=(page,language)=>{
    page.querySelectorAll(".language-panel").forEach((panel)=>{panel.hidden=!panel.classList.contains("language-"+language)});
    page.querySelectorAll(".lang-switch button").forEach((button)=>{
      const active=button.dataset.lang===language;
      button.classList.toggle("active",active);
      button.setAttribute("aria-pressed",String(active));
    });
  };
  document.querySelectorAll(".source-page").forEach((page)=>{
    setPageLanguage(page,"zh");
    page.querySelector(".lang-switch")?.addEventListener("click",(event)=>{
      const button=event.target.closest("button[data-lang]");
      if(button)setPageLanguage(page,button.dataset.lang);
    });
  });
  document.querySelector(".global-language-switch")?.addEventListener("click",(event)=>{
    const button=event.target.closest("button[data-global-lang]");
    if(!button)return;
    const language=button.dataset.globalLang;
    document.querySelectorAll(".source-page").forEach((page)=>setPageLanguage(page,language));
    document.querySelectorAll("[data-global-lang]").forEach((item)=>{
      const active=item.dataset.globalLang===language;
      item.classList.toggle("active",active);
      item.setAttribute("aria-pressed",String(active));
    });
  });
  const dialog=document.querySelector(".image-viewer");
  if(dialog){
    const target=dialog.querySelector("img");
    document.querySelectorAll(".source-copy img").forEach((img)=>img.addEventListener("click",()=>{
      target.src=img.src;
      target.alt=img.alt||"原书图片放大预览";
      dialog.showModal();
    }));
    dialog.querySelector("button").addEventListener("click",()=>dialog.close());
    dialog.addEventListener("click",(event)=>{if(event.target===dialog)dialog.close()});
  }
  const input=document.querySelector(".search input");
  if(input){
    input.addEventListener("input",()=>{
      const query=input.value.trim().toLowerCase();
      document.querySelectorAll(".topic-card").forEach((card)=>{card.hidden=query&&!card.textContent.toLowerCase().includes(query)});
      document.querySelectorAll(".index-group").forEach((group)=>{group.hidden=![...group.querySelectorAll(".topic-card")].some((card)=>!card.hidden)});
    });
  }
});`;

fs.mkdirSync(outputRoot, { recursive: true });
fs.rmSync(assetsRoot, { recursive: true, force: true });
fs.mkdirSync(assetsRoot, { recursive: true });

const results = [];
for (const [index, topic] of topics.entries()) {
  const blocks = restoreReferencedFigures(sliceTopic(topic));
  const images = new Set();
  const prepared = blocks.map((block) => ({ ...block, markdown: rewriteAndCopyImages(block.markdown, topic.file, images) }));
  fs.writeFileSync(path.join(outputRoot, topic.file), topicPage(topic, index, prepared, images.size), "utf8");
  results.push({ topic, index, blocks: prepared, imageCount: images.size, images: [...images] });
}

fs.writeFileSync(path.join(outputRoot, "index.html"), indexPage(results), "utf8");
fs.writeFileSync(path.join(outputRoot, "reader.css"), `${css}\n${supplementalCss.trim()}\n`, "utf8");
fs.writeFileSync(path.join(outputRoot, "reader.js"), js, "utf8");

const pdfSource = path.join(sourceRoot, "cards_output", "Ultrasonography of the Female Reproductive System.pdf");
const pdfTarget = path.join(outputRoot, "Ultrasonography of the Female Reproductive System.pdf");
// Keep the repository's web-optimized PDF when it already exists.
if (!fs.existsSync(pdfTarget)) fs.copyFileSync(pdfSource, pdfTarget);

const uniqueImages = new Set(results.flatMap((result) => result.images));
console.table(results.map((result) => ({ topic: result.topic.title, pages: `${result.blocks[0].page + 1}-${result.blocks.at(-1).page + 1}`, images: result.imageCount })));
console.log(`Generated ${results.length} topics with ${uniqueImages.size} unique source images.`);
