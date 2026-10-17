/*
 * 导入《体表解剖图谱》（彩图版）在线图谱。
 *
 * 源：E:/Book2Know/体表解剖图谱/site
 *   - index.html（全文 + 目录 + 12 章正文，自包含）
 *   - assets/css/atlas.css、assets/js/atlas.js（无外部依赖，可 file:// 打开）
 *   - assets/pages/*.jpg（38 幅原书整页扫描）、assets/plates/*.jpg（479 幅裁切彩图）
 *   - data/atlas.json（元数据与目录，供校对用）
 *
 * 目标：public/surface-anatomy-atlas/（与源目录结构一致）
 *
 * 守卫：全部 521 个文件逐字节一致；index.html / atlas.css / atlas.js / atlas.json
 *       以严格 UTF-8 解码无异常、无替换字符；中文关键词、章节名、条目数与图数命中；
 *       index.html 引用的相对资源全部存在；不残留绝对路径、外链、内部交付文件。
 * 幂等：可重复运行；每次先清空目标目录再重建。
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..");

const SOURCE_ROOT = "E:/Book2Know/体表解剖图谱/site";
const OUTPUT_ROOT = path.join(REPO_ROOT, "public", "surface-anatomy-atlas");

const EXPECT = {
  chapters: 12,
  entries: 366,
  sections: 40,
  figures: 517,
  pages: 38,
  plates: 479,
};

const CHAPTER_TITLES = [
  "头颈部",
  "躯干和骶骨",
  "肩部",
  "臂部",
  "肘部",
  "前臂",
  "腕和手",
  "髋（臀）部",
  "股部",
  "膝部",
  "小腿",
  "踝和足",
];

const CJK_KEYWORDS = ["体表解剖图谱", "枕外隆凸", "【体表定位】", "【要点提示】", "骨性标志"];

const UTF8_FILES = ["index.html", "assets/css/atlas.css", "assets/js/atlas.js", "data/atlas.json"];

const JUNK = ["manifest.json", "qa_report.json", "交付说明.md", "work", "README.md", ".zcodeignore"];

function assert(cond, msg) {
  if (!cond) {
    console.error(`✗ ${msg}`);
    process.exit(1);
  }
  console.log(`✓ ${msg}`);
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function walk(dir, base = dir) {
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out.push(...walk(p, base));
    else out.push(path.relative(base, p));
  }
  return out;
}

/* ---------- 1) 复制 ---------- */
assert(fs.existsSync(SOURCE_ROOT), `源目录存在：${SOURCE_ROOT}`);
assert(fs.existsSync(path.join(SOURCE_ROOT, "index.html")), "源 index.html 存在");

fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_ROOT, { recursive: true });

const sourceFiles = walk(SOURCE_ROOT);
for (const rel of sourceFiles) {
  const dest = path.join(OUTPUT_ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(SOURCE_ROOT, rel), dest);
}
const outputFiles = walk(OUTPUT_ROOT);

assert(
  sourceFiles.length === outputFiles.length,
  `文件数一致：${outputFiles.length} 个（源 ${sourceFiles.length} 个）`,
);
assert(
  outputFiles.every((rel) => sourceFiles.includes(rel)),
  "目标文件清单与源完全一致（无增无减）",
);

/* ---------- 2) 逐字节一致 ---------- */
const mismatched = [];
for (const rel of sourceFiles) {
  const a = fs.readFileSync(path.join(SOURCE_ROOT, rel));
  const b = fs.readFileSync(path.join(OUTPUT_ROOT, rel));
  if (sha256(a) !== sha256(b)) mismatched.push(rel);
}
assert(mismatched.length === 0, `全部 ${sourceFiles.length} 个文件与源逐字节一致${mismatched.length ? `（不一致：${mismatched.slice(0, 5).join(", ")}）` : ""}`);

/* ---------- 3) 严格 UTF-8 解码（防乱码） ---------- */
const decoder = new TextDecoder("utf-8", { fatal: true });
const texts = {};
for (const rel of UTF8_FILES) {
  const buf = fs.readFileSync(path.join(OUTPUT_ROOT, rel));
  let text;
  try {
    text = decoder.decode(buf);
  } catch (err) {
    assert(false, `${rel} 非法 UTF-8 序列：${err.message}`);
  }
  assert(!text.includes("\uFFFD"), `${rel} 无替换字符 U+FFFD（${(buf.length / 1024).toFixed(0)} KB）`);
  assert(
    Buffer.from(text, "utf8").equals(buf),
    `${rel} UTF-8 往返一致（无 BOM、无编码偏移）`,
  );
  texts[rel] = text;
}

const html = texts["index.html"];
const css = texts["assets/css/atlas.css"];
const js = texts["assets/js/atlas.js"];

assert(html.includes('<meta charset="utf-8">'), "index.html 声明 charset=utf-8");
assert(css.includes("体表解剖图谱"), "atlas.css 中文注释完整");
assert(js.includes("全文搜索"), "atlas.js 中文注释完整");
for (const kw of CJK_KEYWORDS) {
  assert(html.includes(kw), `index.html 中文命中「${kw}」`);
}

/* ---------- 4) 内容规模与源一致 ---------- */
const count = (re) => (html.match(re) || []).length;
assert(count(/<section class="chapter[" ]/g) >= EXPECT.chapters, `章节数 ≥ ${EXPECT.chapters}`);
for (const t of CHAPTER_TITLES) {
  assert(html.includes(t), `章节标题命中「${t}」`);
}
assert(count(/id="ent[\d-]+"/g) === EXPECT.entries, `体表标志条目 ${EXPECT.entries} 条`);
assert(count(/id="sec[\d-]+"/g) === EXPECT.sections, `小节 ${EXPECT.sections} 个`);
assert(count(/<figure/g) === EXPECT.figures, `图片 ${EXPECT.figures} 幅（38 整页 + 479 彩图）`);

const pages = fs.readdirSync(path.join(OUTPUT_ROOT, "assets", "pages")).length;
const plates = fs.readdirSync(path.join(OUTPUT_ROOT, "assets", "plates")).length;
assert(pages === EXPECT.pages, `assets/pages ${EXPECT.pages} 幅整页扫描`);
assert(plates === EXPECT.plates, `assets/plates ${EXPECT.plates} 幅裁切彩图`);

/* ---------- 5) 引用资源全部存在 ---------- */
const refs = [...html.matchAll(/(?:src|href)="((?:assets|data)\/[^"#?]+)"/g)].map((m) => m[1]);
const uniqueRefs = [...new Set(refs)];
const missing = uniqueRefs.filter((rel) => !fs.existsSync(path.join(OUTPUT_ROOT, rel)));
assert(missing.length === 0, `${uniqueRefs.length} 个站内引用资源全部存在${missing.length ? `（缺失：${missing.slice(0, 5).join(", ")}）` : ""}`);

/* ---------- 6) 无绝对路径 / 外链 / 内部文件 ---------- */
assert(!/(?:src|href)="\/[^/]/.test(html), "index.html 无根路径引用（可直接挂在子目录）");
assert(!/(?:src|href)="(?:https?:)?\/\//.test(html), "index.html 无外部 CDN / 协议相对外链");
assert(!/<base\s/i.test(html), "index.html 无 <base> 标签");
for (const junk of JUNK) {
  assert(!fs.existsSync(path.join(OUTPUT_ROOT, junk)), `未携带内部交付文件 ${junk}`);
}

/* ---------- 7) 汇总 ---------- */
let bytes = 0;
for (const rel of outputFiles) bytes += fs.statSync(path.join(OUTPUT_ROOT, rel)).size;
const top = fs.readdirSync(OUTPUT_ROOT).sort();
console.log(
  `\n完成：public/surface-anatomy-atlas/ · ${outputFiles.length} 个文件 · ${(bytes / 1024 / 1024).toFixed(1)} MB · 顶层 [${top.join(", ")}]`,
);
