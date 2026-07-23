// 西瓜柚子团队 - 数据源
// 单一数据源：所有页面从这里读取

export const brand = {
  name: "西瓜柚子",
  nameEn: "XIGUA · YUZI",
  slogan: "从临床到工程，搭建生物材料与医学影像的桥",
  description:
    "这里记录一名超声科医生与医疗器械工程师的双重视角：从临床问题出发，回到影像、材料与工程实践，也分享职业转型和持续成长。",
};

export const owner = {
  name: "西瓜柚子团队",
  role: "超声科医生 · 医疗器械工程师",
  bio: "临床医学出身，横跨超声诊疗与医疗器械研发两个领域。主导过口腔骨修复材料、医美磷酸钙微球等三类医疗器械从 0 到 1 的产品化进程；现在以超声为眼，以工程为手，尝试把临床直觉翻译成可落地的器械语言。",
  tagline: "把临床直觉，翻译成器械语言",
};

export const experience = [
  {
    period: "2025.08 — 至今",
    role: "超声科医生 · 自媒体博主",
    company: "现职医院 · 公众号「西瓜柚子」",
    points: [
      "从事超声诊断与介入相关的临床工作",
      "运营「西瓜柚子」「浅雾栖云」公众号，分享生物材料与医学影像内容",
      "小红书账号「论打工人牛马生活」，记录双身份切换的日常",
    ],
    accent: "blue",
  },
  {
    period: "2022.01 — 2025.08",
    role: "研发负责人",
    company: "医疗器械公司",
    points: [
      "主导口腔骨修复材料、医美磷酸钙微球两类产品研发",
      "完成三类医疗器械注册（国械注准 202631700**）",
      "建立 microCT — 硬组织切片 — 生物信息学闭环评价体系",
    ],
    accent: "cyan",
  },
  {
    period: "2018.09 — 2021.12",
    role: "基础医学研究助理",
    company: "北京顶级三甲医院",
    points: [
      "参与国家自然科学基金面上项目 2 项",
      "在 Front. Oncol. / Bioeng. Biotechnol. 等期刊发表论文 4 篇",
      "建立锶掺杂磷酸钙陶瓷骨诱导评价平台",
    ],
    accent: "indigo",
  },
  {
    period: "2017.02 — 2018.05",
    role: "肿瘤科实习医师",
    company: "南大二附院",
    points: [
      "肿瘤科轮转 · 参与病例讨论与基础研究协作",
    ],
    accent: "teal",
  },
];

export const contact = {
  email: "1432804667@qq.com",
  wechat: "xuanfumax",
  wechatOA: ["西瓜柚子", "浅雾栖云"],
  xiaohongshu: "论打工人牛马生活",
};

export const highlights = [
  { label: "三类医疗器械", value: "1", suffix: "项主导注册" },
  { label: "主理人身份", value: "2", suffix: "重 · 临床 × 工程" },
  { label: "公众号矩阵", value: "2", suffix: "个在运营" },
  { label: "内容方向", value: "3", suffix: "条主线" },
];

export const researchDirections = [
  {
    code: "01",
    title: "基于人工智能的医学影像分析",
    titleEn: "AI · MEDICAL IMAGING",
  },
  {
    code: "02",
    title: "骨与软骨组织再生",
    titleEn: "BONE · CARTILAGE REGENERATION",
  },
  {
    code: "03",
    title: "AI 浪潮下的淘金者",
    titleEn: "BUILDING IN THE AI ERA",
  },
];

// =========================================================
// 博客分类与文章
// =========================================================
export const blogCategories = [
  {
    id: "device",
    code: "01",
    title: "医疗器械",
    subtitle: "Medical Device",
    description:
      "三类医疗器械的研发笔记、注册路径、配方工艺与产业化思考。",
    color: "blue",
  },
  {
    id: "imaging",
    code: "02",
    title: "医学影像",
    subtitle: "Medical Imaging",
    description:
      "超声临床要点、知识卡片与病例学习工具，帮助把零散经验整理成可随时复习的知识体系。",
    color: "cyan",
  },
  {
    id: "growth",
    code: "03",
    title: "个人成长",
    subtitle: "Personal Growth",
    description:
      "从临床到工程的双线转型、自媒体运营、规培/职场心得与阅读复盘。",
    color: "indigo",
  },
];

// 示例文章数据
// 实际使用时可替换为 MD 文件 + 解析器
export const blogPosts = [
  {
    slug: "calcium-hydroxylapatite-soft-tissue-fillers-2e",
    category: "device",
    title: "羟基磷灰石钙软组织填充剂：专家治疗技术（第2版）",
    excerpt:
      "从CaHA材料基础到区域治疗、超声评估与并发症管理的系统中文学习版。内容仅供医学教育与专业交流，不构成诊疗或注射操作建议。",
    date: "2026-07-20",
    readTime: "45 章 · 238 页",
    cover: null,
    tags: ["CaHA", "软组织填充剂", "医疗器械", "并发症管理"],
    body: `# 羟基磷灰石钙软组织填充剂：专家治疗技术（第2版）

## 为什么值得系统阅读

羟基磷灰石钙（CaHA）兼具即时支撑与生物刺激特性，是理解再生型软组织填充材料的重要切入点。本书把材料基础、解剖与麻醉、不同部位的治疗技术、超声评估以及并发症管理纳入同一知识框架，有助于医疗器械研发人员、医师和相关专业学习者建立从材料到临床风险控制的完整认识。

在线版按原书物理页连续编排，共收录 **45 个正文章节、238 个原书物理页和 519 幅对应图片**。各章、各节文字与图片保持原有对应关系，目录可直接进入相应章节，适合电脑、平板和手机查阅。

<aside class="medical-disclaimer"><strong>重要声明：</strong>本在线中文内容仅供医学教育、专业交流和资料索引使用，由原文辅助翻译整理，不能替代原版书籍、产品说明书、监管批准信息、规范化培训或执业医师的独立判断。内容不构成诊断、治疗、处方、注射操作或个体化医疗建议；涉及适应证、禁忌证、操作技术和并发症处理时，请以当地现行法规、经批准的产品标签及权威临床指南为准。非专业人员请勿据此自行操作。</aside>

<p><a class="knowledge-card-launch" href="/caha-soft-tissue-fillers-2e/index.html">打开《羟基磷灰石钙软组织填充剂：专家治疗技术（第2版）》 <span>→</span></a></p>
`,
  },
  // —— 医疗器械 ——
  {
    slug: "cytrans-carbonate-apatite",
    category: "device",
    title: "Cytrans®：碳酸盐磷灰石的优势",
    excerpt:
      "从理化性质、降解行为和组织学表现出发，对比碳酸盐磷灰石、羟基磷灰石与 β-TCP，并讨论 Cytrans® 的优势与局限。",
    date: "2026-03-30",
    readTime: "7 分钟",
    cover: "/images/device/cytrans-cover.webp",
    tags: ["碳酸盐磷灰石", "骨修复", "Cytrans"],
    body: `# Cytrans®：碳酸盐磷灰石的优势

![Cytrans 碳酸盐磷灰石](/images/device/cytrans-cover.webp)

我们之前报道过碳酸化羟基磷灰石，并留下了很深的印象。用于口腔的骨增量材料需要具备良好的空间维持能力，不能在成骨早期失去“支架”作用——这或许也是一些煅烧牛骨类产品一直受到追捧的原因。

“可吸收”只是骨修复材料需要具备的特性之一。材料更重要的课题，是如何在稳定支撑与适时降解之间取得平衡。

## CO₃Ap：Cytrans® Granule

Cytrans® 是日本 GC 公司研发生产的一款以碳酸盐磷灰石（CO₃Ap）为核心成分的可吸收骨替代材料。它是全球首款以碳酸盐磷灰石为主成分、日本首款获批临床植入的颗粒状骨补填材料，主要用于口腔及骨科骨缺损修复。

![Cytrans 产品外观](/images/device/cytrans-product.webp)

![不同规格颗粒的扫描电镜图](/images/device/cytrans-granules.webp)

![颗粒表面扫描电镜图](/images/device/cytrans-sem.webp)

![植入兔股骨外侧的 X 线图像](/images/device/cytrans-xray.webp)

## CO₃Ap、HAp 与 β-TCP 的理化对比

![CO₃Ap、HAp 与 β-TCP 对比](/images/device/cytrans-comparison.webp)

### 1. CO₃Ap

- 结晶尺寸小、比表面积高、体积密度高，材料致密且无内部孔隙；
- 碳酸根是其重要组成；
- 在酸性环境——模拟破骨细胞吸收腔——中溶解最快，在中性生理环境中溶解较温和；
- 兼顾生物稳定性与骨吸收适配性。

### 2. β-TCP

- 结晶尺寸与 HAp 接近，比表面积最小；
- 在中性环境中溶解最快；
- 孔隙率低于 HAp，但仍属于多孔结构；
- 需要通过较低的比表面积调控溶解速度，使其与新骨形成相匹配。

### 3. HAp

- 孔隙率高，比表面积中等，体积密度较低；
- 结晶度高、化学稳定性强；
- 在酸性和中性环境中的溶解速度均最慢；
- 较难被骨组织完全替代，主要发挥骨引导支架作用。

## 成骨效果对比

植入 12 周后，可通过组织学观察比较羟基磷灰石（Neobone®）、碳酸盐磷灰石（Cytrans®）及 β-磷酸三钙（Cerasorb®）修复犬下颌骨缺损的表现。维兰纽瓦・戈德纳染色中，绿色区域代表骨组织，红色区域代表类骨质。

## 仍需关注的局限

1. 颗粒为致密材料，内部缺少孔隙；
2. 属于骨引导性材料，缺乏主动的骨诱导功能；
3. 颗粒状材料容易散落和发生微移动，增量体积与空间维持能力仍有改进空间。

国内厂商也在尝试通过双相成分、镁元素引入等技术路线，改善材料在降解与成骨之间的动态适配。

## 参考文献

Ishikawa K, Miyamoto Y, Tsuchiya A, et al. Physical and histological comparison of hydroxyapatite, carbonate apatite, and β-tricalcium phosphate bone substitutes. *Materials*. 2018;11(10):1993.

> 本文整理自微信公众号“西瓜柚子”。[阅读公众号原文](https://mp.weixin.qq.com/s?src=11&timestamp=1783945109&ver=6840&signature=oSX5LCK0xsqSHkVx2XaPhWcRkesFb61QcLFTa27EGf-N26-rpN56Gyv7i3r9deoaLkZtA8*MZrtHiSHpaUOT3rM17dsL9VaBm2k4Eblut3ytvZt68Qmb8tvw2FJzhgFT&new=1)
`,
  },
  {
    slug: "oss-name-and-bone-grafts",
    category: "device",
    title: "是不是英文商品中有叫“Oss”的都是动物骨修复材料？",
    excerpt:
      "“Oss”是与骨相关的拉丁词根，并不等同于动物骨。辨别材料来源，应查看 Xenograft、Alloplast、Allograft 等专业术语。",
    date: "2026-02-05",
    readTime: "5 分钟",
    cover: "/images/device/oss-cover.webp",
    tags: ["骨修复材料", "Oss", "材料分类"],
    body: `# 是不是英文商品中有叫“Oss”的都是动物骨修复材料？

![Oss 与骨修复材料](/images/device/oss-cover.webp)

答案是：**并不是。**

英文商品名中带有 “Oss”，并不代表它一定是动物来源的骨修复材料。大家形成这种印象，很可能是因为牙科和骨科领域非常知名的 Bio-Oss（盖氏骨粉）——它是市场上常见的牛骨来源修复材料。

实际上，“Oss”这个词根的含义更广泛，虽然大多与骨骼相关，但不能直接用来判断材料来源。

## 词源：Oss = 骨

“Oss”或“Os”源自拉丁语，意思是“骨头”。常见词汇包括：

1. **Ossify**：骨化；
2. **Osseous**：骨的、骨质的；
3. **Ossuary**：纳骨塔、人骨盒。

在医学领域，另一个更常见的骨相关词根是 **Osteo-**，例如 Osteoporosis（骨质疏松症）、Osteoarthritis（骨关节炎）和 Osteogenesis（骨生成）。

因此，医疗厂商常用这些词根为骨科、牙科或骨骼健康相关产品命名，并不只用于动物骨粉。

## 名称带“Oss”，但不是动物骨的例子

- **Össur（奥索）**：冰岛假肢与支具厂商，产品以碳纤维、硅胶及机械结构为主，并非动物骨修复材料；
- **Osstem（奥齿泰）**：韩国种植牙品牌，核心产品包括钛合金种植体；该企业也提供骨修复类产品，但不能仅凭品牌名称判断材料来源；
- **合成骨粉**：许多以磷酸钙、羟基磷灰石为主要成分的人工合成骨修复材料，也会使用带有“Oss”的商品名。

## 如何判断材料是不是动物骨？

查看牙科或骨科材料时，不要只看商品名，而应重点寻找包装、说明书或注册资料中的专业术语：

- **Xenograft（异种骨）**：动物来源，常见来源包括牛骨（Bovine）和猪骨（Porcine）；
- **Alloplast（合成骨）**：人工化学合成，不含动物来源成分；
- **Allograft（同种异体骨）**：经过处理的人体捐赠骨；
- **Autograft（自体骨）**：取自患者自身的骨组织。

> 判断骨修复材料来源，专业分类和注册信息比商品名称更可靠。

> 本文整理自微信公众号“西瓜柚子”。[阅读公众号原文](https://mp.weixin.qq.com/s?src=11&timestamp=1783944995&ver=6840&signature=oSX5LCK0xsqSHkVx2XaPhWcRkesFb61QcLFTa27EGf8iQ*ucpmZU6-qUw2y46-TGsR3exDjWnJ5VoyEebEBxp*IjzMrmqW17So9BftIkwakdMNef1292rxxharTao2J7&new=1)
`,
  },
  {
    slug: "calcium-phosphate-bone-implants",
    category: "device",
    title: "什么！大部分骨植入材料都是磷酸钙类材料？",
    excerpt:
      "梳理 51 例 NMPA 批准的国产非承重骨修复产品后发现，96% 的产品含有磷酸钙材料。为什么市场会形成这种格局？",
    date: "2024-05-20",
    readTime: "5 分钟",
    cover: "/images/device/calcium-phosphate-cover.webp",
    tags: ["磷酸钙", "骨植入材料", "NMPA"],
    body: `# 什么！大部分骨植入材料都是磷酸钙类材料？

![磷酸钙类骨植入材料](/images/device/calcium-phosphate-cover.webp)

## 现象：96% 的产品含有磷酸钙材料

我们整理了 **51 例 NMPA 批准的国产非承重骨修复产品**，并按照组成成分进行分析。其中只有 2 例以生物活性玻璃为主要材料，其余产品均含有羟基磷灰石、β-磷酸三钙、动物来源磷酸钙或磷酸氢钙等磷酸钙材料，占比约 **96%**。

如果按元素组成计算，纳入统计的产品中 **100% 含有钙和（或）磷元素**。

![骨移植材料产品梳理](/images/device/calcium-phosphate-products.webp)

## 为什么是磷酸钙材料？

我们认为主要有以下几个原因：

1. **与人体无机成分相似**：钙、磷参与人体细胞的重要生理代谢；
2. **研究历史悠久**：早在 17 世纪，就有动物来源异种骨用于骨移植的记录；
3. **临床使用量大**：材料的基本性质与主要使用风险已经较为清楚；
4. **性能稳定、便于复配**：磷酸钙材料能够与其他材料复合，也可以通过离子掺杂等方式改性，整体生物相容性良好；
5. **来源广泛且可控**：既可以从生物组织提取，也可以通过钙磷反应人工合成，并能形成多种材料形态。

![磷酸钙材料的研究与应用](/images/device/calcium-phosphate-history.webp)

## 未来仍会由磷酸钙材料占据主要市场吗？

答案仍然是肯定的。

未来的骨科植入材料会向精准化、定制化与智能化发展。例如在增材制造领域，以磷酸钙材料制备可打印墨水，已经成为重要技术路线之一。

但磷酸钙材料本身制造门槛与成本相对有限。未来更值得关注的方向，是将其与其他材料复配、进行结构与成分改性，在保留生物相容性的同时扩展应用边界和产品价值。

## 参考文献

1. Pawelec K, Planell JA, eds. *Bone Repair Biomaterials: Regeneration and Clinical Applications*. 2018.
2. Ong JL, Guda T, eds. *Translating Biomaterials for Bone Graft: Bench-top to Clinical Applications*. CRC Press; 2017.

> 本文整理自微信公众号“西瓜柚子”。[阅读公众号原文](https://mp.weixin.qq.com/s?src=11&timestamp=1783944995&ver=6840&signature=oSX5LCK0xsqSHkVx2XaPhWcRkesFb61QcLFTa27EGf-PCUbBQ*wqMsMonCvStSxK5qhWwjZL0qXtvYWaTuHBrK93ALYxHpi9HQheo6-d73UYGvMDPcpWkWq5bfo*gAN9&new=1)
`,
  },

  // —— 医学影像 ——
  {
    slug: "huabin-ultrasound-notes",
    category: "imaging",
    title: "华斌笔记",
    excerpt:
      "华斌超声笔记全六辑在线合集，共29章506节、2828张正文图片，覆盖肌骨、神经、浅表、腹部、血管及超声基础等主题。",
    date: "2026-07-23",
    readTime: "全6辑",
    cover: null,
    tags: ["华斌笔记", "超声学习", "医学影像"],
    body: `# 华斌笔记

这是一个面向超声学习者的系列化在线笔记入口。**全6辑现已上线**，每一辑均保留原书的章节顺序，并将文字、图注与图片放在对应位置。

## 全集内容

- **第1辑：**肌骨、外周神经、风湿、痛风及自我测试等，共9章68节；
- **第2辑：**腹部、介入、胸腔与肺部、血管超声，共4章25节；
- **第3辑：**甲状腺、乳腺、淋巴结、阴囊及趣味超声，共6章92节；
- **第4辑：**甲状腺与颈部浅表、乳腺、睾丸、肌骨与神经，共3章94节；
- **第5辑：**肌骨与神经、甲状腺、乳腺、浅表组织及超声基础，共5章123节；
- **第6辑：**血管与腹部超声，共2章104节。

全集共 **29章506节、1548个正文页面块和2828张正文图片**。已剔除前言、生成说明、封底识别噪声等非正文内容，并修正可确认的异常符号和上下标显示。

## 阅读方式

桌面端使用左侧完整目录；手机和平板端点击顶部“目录”按钮，可搜索全部章节和小节、查看当前位置并直接跳转。

<p><a class="knowledge-card-launch" href="/huabin-ultrasound-notes/index.html">打开“华斌笔记”系列 <span>→</span></a></p>

> 本项目用于个人学习与教学交流。文字整理内容可能仍存在少量识别偏差，涉及临床判断时请结合原始资料和权威指南核对。
`,
  },
  {
    slug: "pocus-appendicitis-cn",
    category: "imaging",
    title: "急性阑尾炎床旁超声（POCUS）中文图解教程",
    excerpt:
      "通过 16 幅连续超声动图和 4 幅教学示意图，系统学习探头选择、分级加压、正常阑尾识别、急性阑尾炎征象与系统扫查路径。",
    date: "2026-07-19",
    readTime: "12 分钟",
    cover: null,
    tags: ["阑尾炎", "床旁超声", "POCUS"],
    body: `# 急性阑尾炎床旁超声（POCUS）中文图解教程

这是一份面向急诊、全科、超声及床旁医学学习者的中文图解教程。项目使用 **16 幅连续超声动图** 和 **4 幅教学示意图**，帮助你从解剖定位开始，逐步建立急性阑尾炎的系统扫查思路。

## 主要内容

- 高频线阵与低频探头的选择；
- 分级加压与右下腹解剖标志定位；
- 正常阑尾的盲端、可压缩和横纵切表现；
- 急性阑尾炎的管径增大、不可压缩及靶样改变；
- 阑尾石、周围游离液和“火环征”等继发征象；
- 找不到阑尾时的系统化搜索路径；
- 报告记录与临床沟通要点。

所有 GIF 均保持动态图形式，可直接在电脑或手机浏览器中连续查看。

<p><a class="knowledge-card-launch" href="/pocus-appendicitis-cn/index.html">打开阑尾炎 POCUS 中文图解教程 <span>→</span></a></p>

> 本项目仅用于医学学习与教学交流，不能替代临床诊断、正式影像报告或个体化诊疗建议。原始图片与资料版权归原作者及来源网站所有，完整来源和版权说明已集中标注在教程文末。
`,
  },
  {
    slug: "ultrasound-medicine-second-edition",
    category: "imaging",
    title: "《超声医学（第2版）》在线学习版",
    excerpt:
      "全书整理为 21 章、112 节的网页阅读器，包含 1303 张原书图片，支持多级目录、全文搜索、字号调整和个人标注。",
    date: "2026-07-16",
    readTime: "2 分钟",
    cover: null,
    tags: ["超声医学", "在线教材", "学习工具"],
    body: `# 《超声医学（第2版）》在线学习版

这是一套面向超声医学系统学习与临床查阅的在线阅读工具。内容覆盖超声成像基础、心脏、胸腹部、泌尿系统、妇产、外周血管、浅表器官、肌肉骨骼和介入超声等主题。

## 内容与功能

- **21 章、112 节**，通过章、节、小节和子目四级目录快速定位；
- 包含 **1303 张原书图片**，图片随正文加载，点击目录即可跳转到对应内容；
- 支持目录关键词搜索和正文全文搜索；
- 支持字号增减，方便电脑和手机阅读；
- 支持个人高亮与标注，内容保存在当前浏览器中；
- 响应式阅读界面，手机端可通过“目录”按钮展开章节导航。

<p><a class="knowledge-card-launch" href="/ultrasound-medicine-2e/index.html">打开《超声医学（第2版）》在线学习版 <span>→</span></a></p>

> 本项目仅用于个人学习、知识整理与教学参考。相关文字与图片版权归原作者及出版机构所有，请勿用于商业传播；具体诊断和临床决策请以现行指南及实际临床情况为准。
`,
  },
  {
    slug: "chronic-pancreatitis-ultrasound",
    category: "imaging",
    title: "胰腺里出现“亮点＋黑影”，意味着什么？一图读懂慢性胰腺炎超声",
    excerpt:
      "从胰腺钙化、主胰管异常、实质改变和并发症四个方面，梳理慢性胰腺炎的常见超声表现，并说明为什么不能只凭单一征象下结论。",
    date: "2026-07-15",
    readTime: "5 分钟",
    cover: "/images/imaging/chronic-pancreatitis/normal-vs-chronic-pancreatitis.png",
    tags: ["慢性胰腺炎", "超声医学", "影像科普"],
    body: `# 胰腺里出现“亮点＋黑影”，意味着什么？一图读懂慢性胰腺炎超声

> 超声看到胰腺钙化、主胰管改变或实质萎缩，就等于确诊慢性胰腺炎吗？答案是：不能只看单一征象，但有些组合非常值得警惕。

![正常胰腺与慢性胰腺炎超声对照标注图](/images/imaging/chronic-pancreatitis/normal-vs-chronic-pancreatitis.png)

## 先看结论：超声最该抓住的 4 个信号

1. **胰腺钙化**：表现为实质内或胰管内强回声灶；足够大的钙化常伴后方声影。胰管内钙化在合适的临床背景下高度提示慢性胰腺炎。
2. **主胰管改变**：可见扩张、管径不均、走行迂曲或不规则，也可伴狭窄与结石。
3. **实质改变**：胰腺回声可增粗、不均，晚期可出现体积缩小、实质萎缩；但单纯回声改变特异性有限。
4. **并发症线索**：假性囊肿、胆管扩张、脾静脉血栓等也可能被超声发现。

## 正常与异常，怎么对照？

| 观察点 | 正常胰腺 | 慢性胰腺炎常见表现 |
|---|---|---|
| 实质 | 回声较均匀，轮廓与大小大致正常 | 回声增粗或不均；晚期可萎缩 |
| 钙化 | 通常无 | 强回声灶，部分伴后方声影 |
| 主胰管 | 不扩张，走行较规则 | 扩张、迂曲、狭窄或管径不均 |
| 显示条件 | 可能受肠气影响 | 同样可能因肠气、体型而显示不全 |

### 需要修正的“概念”

- **“钙化常伴彗尾伪影”不宜作为核心知识点。** 慢性胰腺炎钙化更经典的描述是强回声灶及后方声影；小钙化可不伴声影，也可能出现彩色多普勒闪烁伪影。彗尾伪影不是该病的常规关键诊断征象。
- **“主胰管直径通常超过 3 mm”过于绝对。** 管径受测量部位、年龄及检查条件影响；不能把单一阈值当作确诊标准。更稳妥的表述是“主胰管扩张、走行不规则或管径变化”，并结合其他影像征象。
- **“胰腺显示不清＝萎缩”不成立。** 显示不清常由胃肠气体、体型或声窗欠佳导致；萎缩需要在充分显示后结合体积、轮廓及其他影像检查判断。
- **“小钙化逐渐融合”可作为病程现象理解，但不能据单次超声宣称动态进展。** 需要同一患者的连续影像对照。
- **需与其他原因鉴别。** 胰管结石可属于慢性胰腺炎表现的一部分；同时应注意肿瘤性梗阻、年龄相关改变等。局灶性肿块、突然出现的胰管截断或上游萎缩尤其需要排除胰腺肿瘤。

## 为什么不能只靠一次超声下结论？

经腹超声无创、便捷，适合发现明显钙化、胰管改变及部分并发症，但胰腺容易被肠气遮挡，而且早期慢性胰腺炎可能没有典型形态改变。疑似病例通常需要结合症状、危险因素、胰腺功能，以及胰腺协议 CT、MRI/MRCP 或 EUS 综合判断。

## 何时应尽快就医？

反复或持续上腹痛、疼痛向背部放射、原因不明的体重下降、油脂样大便、反复胰腺炎，或影像提示胰腺钙化/胰管异常时，应至消化内科或胰腺专科进一步评估。

> **医学声明：** 本文用于健康科普与影像学习，不能替代医生面诊、正式超声报告或个体化诊疗建议。

## 参考依据

1. Conwell DL, et al. American Pancreatic Association Practice Guidelines in Chronic Pancreatitis: Evidence-Based Report on Diagnostic Guidelines. *Pancreas*. 2014. [查看全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC5434978/)
2. Löhr JM, et al. United European Gastroenterology evidence-based guidelines for the diagnosis and therapy of chronic pancreatitis (HaPanEU). *United European Gastroenterology Journal*. 2017. [查看全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC5349368/)
3. Gardner TB, et al. ACG Clinical Guideline: Chronic Pancreatitis. *American Journal of Gastroenterology*. 2020. [查看摘要](https://pubmed.ncbi.nlm.nih.gov/32022720/)
4. Ito T, et al. Evidence-based clinical practice guidelines for chronic pancreatitis 2021. *Journal of Gastroenterology*. 2022. [查看全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC9522716/)
`,
  },
  {
    slug: "female-reproductive-system-ultrasound-cards",
    category: "imaging",
    title: "女性生殖系统超声知识卡片",
    excerpt:
      "面向中国超声学习者的中英双语图文版，包含 31 个专题、章节摘要、1,990 条中文辅助译文、324 幅原书图片及 PDF 逐页索引。",
    date: "2026-07-14",
    readTime: "2 分钟",
    cover: null,
    tags: ["妇科超声", "生殖医学", "知识卡片"],
    body: `# 女性生殖系统超声知识卡片

这套学习工具以 *Ultrasonography of the Female Reproductive System* 为内容基础，按原书小节边界重新核对正文、图片和图注，整理为 **31 个专题**。每章增加中英文摘要，正文提供中文辅助译文和英文原文切换，方便中国超声学习者对照阅读。

## 内容覆盖

- 女性生殖系统解剖与生理；
- 超声物理、探头选择、二维及三维超声成像；
- 经阴道超声标准化检查；
- 卵泡监测、取卵与胚胎移植超声引导；
- 输卵管通畅性、子宫内膜容受性与常见妇科疾病；
- 正常早孕、异位妊娠及妊娠并发症。

## 使用方式

每个专题均可独立打开，并按原书页面顺序展示连续正文。可使用“全文语言”统一切换，也可在每个原书页面的小标题旁单独选择“中文 / EN”。页面共收录 **324 幅原书图片**；图片只放在其所在原书页，并保留相邻图号和图注。点击图片可放大查看，点击页码可直接打开随附 PDF 的对应页。电脑、平板和手机浏览器均可使用。

<p><a class="knowledge-card-launch" href="/female-reproductive-ultrasound-cards/index.html">打开女性生殖系统超声知识卡片 <span>→</span></a></p>

> 中文内容由本地 Gemma 模型辅助翻译并进行了重点术语校正，仅供学习理解；专业表述、具体诊断与临床决策请同时核对英文原文、原著、现行指南及实际临床情况。
`,
  },
  {
    slug: "ultrasound-imaging-flashcards",
    category: "imaging",
    title: "医学超声影像学知识卡片",
    excerpt:
      "前言与12章内容整理为1457张可翻面卡片，支持关键词搜索、题型筛选、批量翻面和复习进度记录。",
    date: "2026-07-13",
    readTime: "1 分钟",
    cover: null,
    tags: ["超声", "知识卡片", "学习工具"],
    body: `# 医学超声影像学知识卡片

这是一套可以直接在浏览器中使用的医学超声复习工具。内容覆盖超声基础、心脏及大血管、胸腔与肺、消化系统、泌尿系统、妇产、周围血管、浅表器官、肌骨神经以及介入超声等主题。

## 这套卡片包含什么？

- **1457 张卡片**，覆盖前言与 12 个章节；
- 名词解释、填空题、选择题和简答题分类复习；
- 点击卡片翻面查看答案，也可一键批量翻面；
- 支持关键词搜索和题型筛选；
- 自动记录学习时长、打开次数和复习等级；
- 电脑与手机浏览器均可使用。

<p><a class="knowledge-card-launch" href="/knowledge-cards/index.html">打开医学超声影像学知识卡片 <span>→</span></a></p>

> 学习记录保存在当前浏览器中，不会上传个人数据。卡片仅用于知识复习与交流，不能替代教材原文、规范化培训或临床诊疗依据。
`,
  },
  {
    slug: "clinical-ultrasound-reference-cards",
    category: "imaging",
    title: "超声正常值老记不住？这套「临床超声正常值知识卡片」帮你搞定",
    excerpt:
      "全书 6 章 32 节、206 张知识卡片，其中 170 张配有原书真图；支持问答翻面、列表速查、章节导航与离线使用。",
    date: "2026-07-13",
    readTime: "2 分钟",
    cover: null,
    tags: ["超声正常值", "知识卡片", "学习工具"],
    body: `# 超声正常值老记不住？

## 这套「临床超声正常值知识卡片」帮你搞定

全书共整理为 **6 章、32 节、206 张知识卡片**，其中 **170 张卡片配有原书真图**，帮助你把分散、难记的超声测量正常值变成可以随时复习和查询的知识库。

## 两种学习方式

- **问答翻面模式**：像 Anki 一样刷卡，先回忆答案，再翻面核对。
- **列表速查模式**：需要某项正常值时，可以直接打开列表快速查询。

## 使用体验

- 左侧章节导航，一点即可直达对应章节
- 6 套主题自由选择，并自动记住选择
- 页面内置实时时钟
- 170 张带图卡片，图片支持点击放大
- 问答模式可逐张学习，列表模式适合快速查阅
- 支持键盘方向键、空格键快速切换和翻面

无需安装软件，打开网页即可使用，适合在通勤、值班间隙等碎片时间高效复习。

> 收藏它，让超声测量正常值真正长在脑子里。

<p><a class="knowledge-card-launch" href="/clinical-ultrasound-cards/index.html">打开「临床超声正常值知识卡片」全书合集 <span>→</span></a></p>

## 内容范围

- 第 1 章：腹部脏器
- 第 2 章：泌尿生殖
- 第 3 章：妇产科
- 第 4 章：心脏
- 第 5 章：血管及浅表器官
- 第 6 章：肌肉骨骼

> 本项目仅供个人医学学习与交流，不替代原书、规范化培训或临床诊疗依据。
`,
  },
  {
    slug: "cardiac-ultrasound-five-windows",
    category: "imaging",
    title: "心脏超声5个窗口扫查大全！",
    excerpt:
      "从胸骨旁长轴、短轴、心尖、剑突下到下腔静脉视图，系统掌握床旁心脏超声的5个核心扫查窗口。",
    date: "2026-05-19",
    readTime: "15 分钟",
    cover: "/images/imaging/heart-ultrasound/05.webp",
    tags: ["心脏超声", "床旁超声", "扫查窗口"],
    body: `# 心脏超声5个窗口扫查大全！

![心脏解剖结构示意图](/images/imaging/heart-ultrasound/05.webp)

文章较长，可以先收藏。但建议优先掌握前三个窗口——胸骨旁长轴、胸骨旁短轴和心尖视图，因为大部分常见心脏急症的快速评估都离不开它们。

床旁心脏超声又称超声心动图（Echo），并不是影像科医生的专属技能。急诊、ICU、麻醉科和心内科等临床场景，都可以借助它快速了解患者的循环状态。

## 什么是心脏超声？为什么要学？

心脏超声利用超声波实时观察心脏结构和运动。它最大的优势是快速、无创、可在床旁完成并立即获得结果。

面对胸痛伴低血压的患者，心脏超声可以快速回答：

- 左心室收缩功能是否明显下降；
- 是否存在心包积液及心脏压塞；
- 是否出现肺栓塞相关的右心负荷征象。

常见检查方式包括：

- **经胸壁超声（TTE）**：探头置于胸壁，无创且最常用；
- **经食管超声（TEE）**：探头经食管进入，通常需要镇静和更专业的操作。

本文重点介绍 TTE。

## 扫查前准备

### 患者体位

标准体位为仰卧位。如果心脏显示不清，可以让患者取左侧卧位，使心脏向左侧移动、更加靠近胸壁，从而改善声窗。

![患者左侧卧位](/images/imaging/heart-ultrasound/02.webp)

### 机器与探头

- 使用相控阵探头，也称心脏探头；
- 选择 Cardiac（心脏）预设；
- 心脏预设下的屏幕方向标记可能与其他超声预设不同，操作前务必确认；
- 机器通常放在患者右侧，右手扫查，左手调节机器。

![心脏模式屏幕方向标记](/images/imaging/heart-ultrasound/03.webp)

### 先理解心脏位置

心脏包含左、右心房与左、右心室，以及三尖瓣、肺动脉瓣、二尖瓣和主动脉瓣。需要特别注意：心脏比许多初学者想象的更靠近胸骨，探头放得过于外侧往往难以获得标准切面。

![心脏在胸腔内的位置](/images/imaging/heart-ultrasound/04.webp)

## 窗口一：胸骨旁长轴（PLAX）

这是最先需要掌握的窗口，可用于快速观察整体心脏结构、左右心室大小、左心室收缩及心包情况。

### 操作方法

1. 探头标记点指向患者右肩；
2. 探头置于胸骨旁第 3～4 肋间；
3. 通过小范围滑动、倾斜和旋转获得标准长轴切面。

![胸骨旁长轴探头位置](/images/imaging/heart-ultrasound/06.webp)

标准切面应尽量显示右心室、左心室、左心房、主动脉瓣、二尖瓣、主动脉根部、降主动脉和心包。

![胸骨旁长轴结构示意图](/images/imaging/heart-ultrasound/07.webp)

![胸骨旁长轴动态超声图](/images/imaging/heart-ultrasound/08.webp)

## 窗口二：胸骨旁短轴（PSAX）

在胸骨旁长轴位置将探头顺时针旋转约 90°，使标记点指向患者左肩，即可进入短轴扫查。通过探头倾斜，可以依次观察三个常用平面。

### 1. 乳头肌水平

可用于粗略评估整体射血分数、右心室功能及左心室壁运动。

![乳头肌水平示意图](/images/imaging/heart-ultrasound/09.webp)

![乳头肌水平探头方向](/images/imaging/heart-ultrasound/10.webp)

### 2. 二尖瓣水平

将声束向心底方向倾斜，可看到二尖瓣前后叶开放，形成类似“鱼口”的图像。

![向二尖瓣水平移动探头](/images/imaging/heart-ultrasound/11.webp)

![二尖瓣鱼口征示意图](/images/imaging/heart-ultrasound/12.webp)

### 3. 主动脉瓣水平

继续向心底倾斜，可观察主动脉瓣短轴。三个瓣叶开放时形似奔驰标志，因此也称“奔驰标志视图”。该平面还能观察三尖瓣、肺动脉瓣和右室流出道。

![向主动脉瓣水平倾斜探头](/images/imaging/heart-ultrasound/13.webp)

![主动脉瓣奔驰标志视图](/images/imaging/heart-ultrasound/14.webp)

## 窗口三：心尖视图

心尖视图是血流动力学评估的核心窗口。其中，心尖四腔心（A4C）是最重要的标准切面之一。

### 操作方法

1. 从短轴位置将探头向患者左下方滑向心尖；
2. 当左心室逐渐变长并呈尖形时，说明接近心尖；
3. 适当调整探头尾部，使声束指向心底。

![心尖四腔心探头位置](/images/imaging/heart-ultrasound/15.webp)

标准 A4C 应显示左心室、右心室、左心房、右心房、二尖瓣和三尖瓣。

![心尖四腔心结构示意图](/images/imaging/heart-ultrasound/16.webp)

![心尖四腔心动态超声图](/images/imaging/heart-ultrasound/17.webp)

如果切面难以获得，可让患者取左侧卧位，以减少肺气遮挡并使心脏靠近探头。

### 心尖五腔心（A5C）

在 A4C 基础上轻微向前倾斜声束，可使主动脉瓣和左室流出道进入视野，形成心尖五腔心。

![心尖五腔心示意图](/images/imaging/heart-ultrasound/18.webp)

![心尖五腔心动态超声图](/images/imaging/heart-ultrasound/19.webp)

### 冠状静脉窦切面

探头角度过大时，可能显示冠状静脉窦（CS），其外观容易被误认为房间隔缺损。轻微调整探头角度即可恢复标准四腔心切面。

![冠状静脉窦超声图](/images/imaging/heart-ultrasound/20.webp)

## 窗口四：剑突下视图

剑突下视图以肝脏作为声窗，较少受到肺气影响。对于 COPD 患者或其他胸壁声窗欠佳的情况尤其有用。

### 操作方法

1. 患者仰卧并适当屈膝；
2. 探头放在剑突下方，标记点指向患者左侧；
3. 采用覆盖式握持，使探头尽量贴近腹壁并指向左肩。

![剑突下视图探头位置](/images/imaging/heart-ultrasound/21.webp)

![剑突下四腔心示意图](/images/imaging/heart-ultrasound/22.webp)

![剑突下四腔心动态超声图](/images/imaging/heart-ultrasound/23.webp)

## 窗口五：下腔静脉（IVC）视图

IVC 视图是辅助评估容量状态和右心房压力的常用窗口。

### 操作方法

1. 从剑突下视图出发，保持右心房在视野内；
2. 在肝脏内寻找汇入右心房的下腔静脉；
3. 旋转探头获得 IVC 长轴切面。

![下腔静脉探头位置](/images/imaging/heart-ultrasound/24.webp)

![下腔静脉结构示意图](/images/imaging/heart-ultrasound/25.webp)

![下腔静脉动态扫查](/images/imaging/heart-ultrasound/26.webp)

## IVC 塌陷性与容量状态

自主呼吸患者吸气时胸腔负压增加，IVC 通常变窄；机械通气患者受正压影响，变化方向可能相反。必须结合呼吸方式、右心功能、机械通气参数和临床背景综合判断，不能仅凭单次 IVC 测量决定补液。

![下腔静脉超声图](/images/imaging/heart-ultrasound/27.webp)

![下腔静脉呼吸变化动态图](/images/imaging/heart-ultrasound/28.webp)

## 五个需要掌握的病理评估

### 1. 中心静脉压（CVP）估算

IVC 直径及其随呼吸变化的幅度，可以辅助估算右心房压力。但该方法存在明显局限，应与其他超声征象和临床指标结合。

### 2. 左心室射血分数（EF）

床旁超声可以通过左心室壁增厚、心腔面积变化及二尖瓣前叶活动，对收缩功能进行快速定性判断。

| 分级 | EF 值 |
| --- | --- |
| 高动力状态 | > 70% |
| 正常 | 55%～69% |
| 轻度降低 | 45%～54% |
| 中度降低 | 30%～44% |
| 重度降低 | < 30% |

![左心室收缩功能动态图](/images/imaging/heart-ultrasound/29.webp)

### 3. 肺栓塞：D 征与 McConnell 征

心脏超声通常不能直接显示肺动脉内血栓，而是通过右心室对压力负荷的反应寻找间接证据。

- **D 征**：右心室压力升高使室间隔向左偏移，左心室短轴呈 D 形；
- **McConnell 征**：右心室游离壁运动减弱，而心尖运动相对保留。

McConnell 征特异性相对较高，但敏感性有限，未发现该征象不能排除肺栓塞。

![D 征动态超声图](/images/imaging/heart-ultrasound/30.webp)

![McConnell 征动态超声图](/images/imaging/heart-ultrasound/31.webp)

### 4. 心包积液

胸骨旁长轴切面中，可利用液体与降主动脉的相对位置辅助鉴别：心包积液通常位于降主动脉前方，而胸腔积液多位于其后方。

心包脂肪垫也可能表现为低回声区，但通常回声不均匀，并随心脏运动。诊断不确定时应请上级医师复核或结合其他影像学检查。

![心包积液动态超声图](/images/imaging/heart-ultrasound/32.webp)

![心包积液与胸腔积液鉴别](/images/imaging/heart-ultrasound/33.webp)

### 5. 心脏压塞

当心包内压力影响心脏充盈时，可形成心脏压塞并导致梗阻性休克。超声需要重点观察右心房收缩期塌陷、右心室舒张期塌陷，以及扩张且呼吸变异减弱的 IVC。

![心脏压塞动态图](/images/imaging/heart-ultrasound/34.webp)

## 五大窗口速查

| 窗口 | 常用位置 | 核心价值 |
| --- | --- | --- |
| 胸骨旁长轴 PLAX | 胸骨旁第 3～4 肋间 | 整体结构、左室收缩、心包 |
| 胸骨旁短轴 PSAX | PLAX 旋转约 90° | 乳头肌、二尖瓣及主动脉瓣平面 |
| 心尖 A4C/A5C | 心尖搏动附近 | 四腔结构、血流动力学评估 |
| 剑突下 | 剑突下方，以肝脏为声窗 | 胸壁声窗差、创伤及心包评估 |
| 下腔静脉 IVC | 剑突下向右心房追踪 | 容量状态与右房压力辅助判断 |

> 本文仅供医学学习与交流，不能替代规范化超声培训、完整临床评估或正式诊断。

本文内容翻译整理自 POCUS 101：[Cardiac Ultrasound Made Easy](https://www.pocus101.com/cardiac-ultrasound-echocardiography-made-easy-step-by-step-guide/)。

> 本文同步整理自微信公众号文章。[阅读公众号原文](https://mp.weixin.qq.com/s/YNgnji6ya5go-naLV_3yew)
`,
  },
  // —— 个人成长 ——
  {
    slug: "from-clinic-to-rd",
    category: "growth",
    title: "从临床到工程：我为什么离开，又为什么回来",
    excerpt:
      "在临床和工程之间反复横跳的这些年，整理成 5 个判断维度。",
    date: "2025-08-30",
    readTime: "11 分钟",
    cover: null,
    tags: ["转型", "复盘"],
    body: `# 从临床到工程

## 离开临床的原因

- 想看到问题被解决的过程
- 研发反馈周期短，结果可量化

## 回到临床的原因

- 失去病人让我开始怀疑价值
- 临床是问题的真正源头

## 给同样在犹豫的你

1. 实习/规培 ≠ 一定要干一辈子
2. 跳出去的成本远低于你想象的
3. 但记得给自己留回得去的路
`,
  },
  {
    slug: "wechat-media-1year",
    category: "growth",
    title: "公众号运营 1 年复盘",
    excerpt:
      "从 0 到 1 万粉丝的实操记录，踩过的坑、有效的动作、性价比最高的事。",
    date: "2025-12-10",
    readTime: "9 分钟",
    cover: null,
    tags: ["自媒体", "公众号"],
    body: `# 公众号运营 1 年复盘

## 数据

- 起始 0，到 1 万粉丝用了 11 个月
- 头条平均阅读 3000
- 最高一篇 8w+

## 有效动作

- 持续输出"工程化"视角的临床内容
- 把每篇文章做成可被转发的"卡片"
- 标题：从"医生说…"改成"我是怎么…"

## 性价比最高的事

- 写系列文章（系列流量比单篇高 3 倍）
`,
  },
  {
    slug: "rotation-diary",
    category: "growth",
    title: "超声规培日记：第一个夜班",
    excerpt:
      "记录规培第一个独立值夜班的全过程，从紧张到处理完成的复盘。",
    date: "2025-09-01",
    readTime: "6 分钟",
    cover: null,
    tags: ["规培", "夜班"],
    body: `# 第一个夜班

凌晨 3 点 17 分，床旁超声，急性胆囊炎。

记一下当时的思考链：
1. 先评估生命体征
2. 看主诉对应器官
3. 不能解释症状时，加做相邻区域
`,
  },
];

// 工具函数
export function getPostsByCategory(categoryId) {
  return blogPosts.filter((p) => p.category === categoryId);
}

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getCategoryById(id) {
  return blogCategories.find((c) => c.id === id);
}

// 导航
export const navItems = [
  { id: "hero", label: "首页" },
  { id: "about", label: "研究" },
  { id: "blog", label: "开源项目" },
  { id: "contact", label: "联系" },
];
