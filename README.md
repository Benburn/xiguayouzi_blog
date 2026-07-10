# 西瓜柚子 · 个人博客

超声科医生 × 医疗器械工程师的个人博客，记录医疗器械、医学影像与个人成长。

## 技术栈

- React 19 + Vite 8
- React Router
- Markdown 文章渲染
- 原生 CSS 响应式设计

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

生产构建与预览：

```bash
npm run build
npm run preview
```

构建产物位于 `dist` 目录。

## 内容维护

目前站点资料、分类与文章统一维护在 `src/data/profile.js`：

- `brand`：品牌名称和简介
- `owner`、`experience`：主理人与工作经历
- `contact`：联系方式
- `blogCategories`：三个博客分类
- `blogPosts`：文章元数据与 Markdown 正文

新增文章时，在 `blogPosts` 数组中增加一项即可。图片建议放在 `public/images`，正文中使用 `/images/文件名.jpg` 引用。

## 通过 GitHub Desktop 发布

1. 在 GitHub Desktop 中打开本项目目录 `E:\Web\xiguayouzi_blog`。
2. 确认变更列表里没有 `node_modules`、`dist`、预览截图等本地文件。
3. 填写提交说明，例如 `Prepare blog for deployment`，点击 **Commit to main**。
4. 点击 **Push origin**，将代码推送到 GitHub。

仓库地址：<https://github.com/Benburn/xiguayouzi_blog>

## 部署到 Cloudflare

在 Cloudflare 控制台中导入 GitHub 仓库，使用以下设置：

| 设置项 | 值 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/`（留空即可） |
| Node.js version | `20` 或更高 |

`public/_redirects` 已包含 React Router 的回退规则，部署后直接访问或刷新文章详情页不会返回 404。

每次使用 GitHub Desktop 推送到 `main` 后，Cloudflare 会自动重新构建并发布。
