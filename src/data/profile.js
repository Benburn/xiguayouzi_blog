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
      "超声、CT、MRI 临床要点与影像组学入门，结合真实病例拆解读片思路。",
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
    slug: "clinical-ultrasound-reference-cards",
    category: "imaging",
    title: "超声正常值老记不住？这套「临床超声正常值知识卡片」帮你搞定",
    excerpt:
      "全书 6 章 32 节、206 张知识卡片，其中 170 张配有原书真图；支持问答翻面、列表速查、章节导航与离线使用。",
    date: "2026-07-10",
    readTime: "3 分钟",
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
- 5 套主题自由选择
- 页面内置实时时钟
- 单节文件采用图片内嵌方式，双击即可查看
- 文件转发后不会丢失图片
- 想从头通读时，可以打开「全书合集」

无需安装软件，打开网页即可使用；同时支持离线浏览，适合在通勤、值班间隙等碎片时间高效复习。

> 收藏它，让超声测量正常值真正长在脑子里。

## 获取知识卡片

**夸克网盘：** [点击打开「临床超声正常值知识卡片」](https://pan.quark.cn/s/006960e4fc27)

**提取码：E7jG**
`,
  },
  {
    slug: "ultrasound-basics",
    category: "imaging",
    title: "超声基础：从原理到读片",
    excerpt:
      "用工程师的语言讲超声：声阻抗、反射、散射，以及为什么超声图像长这样。",
    date: "2025-09-15",
    readTime: "10 分钟",
    cover: null,
    tags: ["超声", "基础", "原理"],
    body: `# 超声基础：从原理到读片

## 物理基础

- 声阻抗差决定界面反射
- 散射决定内部纹理
- 衰减决定穿透深度

## 为什么超声图像这么"脏"

- 旁瓣效应
- 多次反射
- 声束宽度

理解了噪声来源，你就知道图像上每一道伪影是什么了。
`,
  },
  {
    slug: "elastography-101",
    category: "imaging",
    title: "超声弹性成像：硬不硬，到底谁说了算",
    excerpt:
      "剪切波、应变式、点测量 vs 二维——一次性把弹性成像的常见概念理清。",
    date: "2025-10-02",
    readTime: "8 分钟",
    cover: null,
    tags: ["弹性成像", "剪切波"],
    body: `# 超声弹性成像

## 应变式 vs 剪切波

- 应变式：相对值，受操作者影响大
- 剪切波：绝对值（kPa），可重复性更好

## 临床陷阱

- 甲状腺结节：SWV > 一定阈值要警惕
- 乳腺 BI-RADS 4a：弹性可下调或上调分级
`,
  },
  {
    slug: "radiomics-intro",
    category: "imaging",
    title: "影像组学入门：特征、模型、坑",
    excerpt:
      "影像组学的端到端流程，从 ROI 勾画到模型部署。",
    date: "2025-07-18",
    readTime: "14 分钟",
    cover: null,
    tags: ["影像组学", "AI"],
    body: `# 影像组学入门

## 端到端流程

1. 影像获取（DICOM）
2. ROI 勾画
3. 特征提取（PyRadiomics）
4. 特征选择（LASSO 等）
5. 模型训练与验证

## 三大坑

- 勾画者间一致性
- 特征冗余
- 外部验证集缺失
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
