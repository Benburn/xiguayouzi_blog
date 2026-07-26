import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const sourceRoot = "E:/Book2Know/Huabin/华斌笔记第2辑_OCR";
const sourceDeck = path.join(sourceRoot, "HTML2PPT");
const outputRoot = path.join(repoRoot, "public", "huabin-ultrasound-notes");
const outputDir = path.join(outputRoot, "self-study-notes");
const assetSourceDir = path.join(scriptDir, "assets");

if (!outputDir.startsWith(outputRoot + path.sep)) {
  throw new Error(`拒绝写入华斌笔记目录之外的路径：${outputDir}`);
}

await fs.access(path.join(sourceDeck, "index.html"));
await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });
await fs.cp(path.join(sourceDeck, "assets"), path.join(outputDir, "assets"), { recursive: true });

const sourceHtml = await fs.readFile(path.join(sourceDeck, "index.html"), "utf8");
const imageRefs = [...sourceHtml.matchAll(/<img[^>]+src="\.\.\/images\/([^"]+)"/g)].map((match) => match[1]);
const uniqueImages = [...new Set(imageRefs)];
await fs.mkdir(path.join(outputDir, "images"), { recursive: true });

for (const imageName of uniqueImages) {
  const sourceImage = path.join(sourceRoot, "images", imageName);
  await fs.access(sourceImage);
  await fs.copyFile(sourceImage, path.join(outputDir, "images", imageName));
}

await fs.copyFile(
  path.join(assetSourceDir, "huabin-self-study-controls.css"),
  path.join(outputDir, "assets", "blog-study-controls.css"),
);
await fs.copyFile(
  path.join(assetSourceDir, "huabin-self-study-controls.js"),
  path.join(outputDir, "assets", "blog-study-controls.js"),
);

const outputHtml = sourceHtml
  .replace(
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="description" content="华斌笔记自学笔记：肺部超声诊断要求与特殊征象，支持目录、主题切换、全屏与触控翻页。">',
  )
  .replace("<title>肺部超声 — 诊断要求与特殊征象</title>", "<title>自学笔记｜肺部超声诊断要求与特殊征象</title>")
  .replace(
    "</style>\n</head>",
    '</style>\n<link rel="stylesheet" href="assets/blog-study-controls.css">\n</head>',
  )
  .replaceAll('../images/', 'images/')
  .replace(
    '<script src="assets/runtime.js"></script>',
    '<script src="assets/runtime.js"></script>\n<script src="assets/blog-study-controls.js"></script>',
  );

await fs.writeFile(path.join(outputDir, "index.html"), outputHtml, "utf8");
console.log(`自学笔记已生成：${outputDir}`);
console.log(`幻灯片：${(outputHtml.match(/<section class="slide/g) || []).length} 页；图片：${uniqueImages.length} 张`);
