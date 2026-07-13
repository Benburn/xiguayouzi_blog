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
    slug: "ha-bone-repair-granules",
    category: "device",
    title: "纳米晶羟基磷灰石骨修复颗粒研发笔记",
    excerpt:
      "从仿生沉淀工艺到中试放大，记录一类骨修复材料从实验室到三类医疗器械的完整路径。",
    date: "2024-11-12",
    readTime: "12 分钟",
    cover: null,
    tags: ["三类医疗器械", "骨修复", "工艺"],
    body: `# 纳米晶羟基磷灰石骨修复颗粒研发笔记

## 起点：为什么选择这条路

2018 年在北京顶级三甲医院做基础研究时，我第一次完整跑通"锶掺杂羟基磷灰石"的体内外评价。临床医生反复追问的问题是——*这东西到底能不能上车？* 当时我答不上来。

2022 年带着这个问题进入工业界，开始把实验室的"工艺可行"翻译成注册路径上的"工艺可控"。

## 工艺：从烧杯到反应釜

- 仿生沉淀法：钙磷比、温度、pH 三条曲线同时锁死
- 粒径分布：把 CV 从 18% 压到 5% 以内
- 清洗工艺：硫化物、氯离子、内毒素的逐级控制

> 工艺稳定的本质不是参数越多越好，而是把关键参数变得不可调错。

## 注册：三类器械的隐性成本

注册检验、生物学评价、临床前研究——每一步都有可量化的"钱"和不可量化的"等"。

国械注准 202631700** 是这场马拉松的终点线，但它真正的起点是工艺定型那天。
`,
  },
  {
    slug: "calcium-phosphate-microspheres",
    category: "device",
    title: "医美注射用磷酸钙微球：粒径与可注射性",
    excerpt:
      "面向医美填充与再生场景的磷酸钙微球体系，重点拆解粒径调控与可注射性测试。",
    date: "2024-08-03",
    readTime: "9 分钟",
    cover: null,
    tags: ["医美", "微球", "可注射性"],
    body: `# 医美注射用磷酸钙微球

## 粒径为什么这么重要

粒径直接决定了：
- 推注力（临床手感）
- 体内分布（成簇 vs 弥散）
- 降解周期（与比表面积挂钩）

我们把目标 CV 压在 5% 以内，配套动态光散射 + 激光衍射双方法互相验证。

## 可注射性测试的几个误区

1. 只看 27G 针管，忽略 30G
2. 推注力只看峰值，不看曲线
3. 没有对比空白基质

## 中试放大踩过的坑

- 反应釜放大 50 倍时，搅拌雷诺数下降导致局部过饱和
- 通过引入轴向流叶片 + 循环回路解决
`,
  },
  {
    slug: "class-iii-registration",
    category: "device",
    title: "三类医疗器械注册全流程复盘",
    excerpt:
      "从立项到拿证，一份完整的注册路径地图与时间表。",
    date: "2024-05-20",
    readTime: "15 分钟",
    cover: null,
    tags: ["注册", "三类", "路径"],
    body: `# 三类医疗器械注册全流程复盘

## 总览

- 立项 → 工艺定型：6-9 个月
- 型检 → 生物学评价：9-12 个月
- 临床前研究：3-6 个月
- 申报 → 审评 → 拿证：12-18 个月

## 一些不写在 SOP 里的经验

- 注册专员要尽早介入工艺定型
- 生物学评价的"等报告"阶段最磨人
- 审评发补是常态，第一轮能过的才是少数
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
