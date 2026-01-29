# xuzm15's Blog

个人博客，基于 [Astro](https://astro.build) 构建，部署在 GitHub Pages。

- 站点：<https://xuzm15.github.io>

## 技术栈

- **Astro 5**：静态站点
- **Tailwind CSS**：样式与排版（含 `@tailwindcss/typography`）
- **MDX**：博客内容支持 Markdown + JSX
- **部署**：GitHub Actions → GitHub Pages

## 功能

- 首页（最新文章列表）
- 博客列表与文章详情（按 `src/content/blog/` 下的 MD/MDX 生成）
- 归档页（按时间）
- 标签页（按 tag）
- 关于页
- RSS（`/rss.xml`）
- Sitemap（`sitemap-index.xml`）

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 <http://localhost:4321>。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建生产版本到 `dist/` |
| `npm run preview` | 本地预览构建结果 |

## 项目结构（简要）

```
src/
├── components/     # 公共组件（Header、Footer、BaseHead 等）
├── content/blog/   # 博客文章（按年份分目录的 .md / .mdx）
├── layouts/       # 页面布局（BaseLayout、BlogPost）
├── pages/         # 路由（首页、博客、归档、标签、关于、RSS）
├── styles/        # 全局样式
└── consts.ts      # 站点标题、描述等常量
```

新文章放在 `src/content/blog/` 下，frontmatter 需包含 `title`、`description`、`pubDate` 等（参见 [content.config.ts](src/content.config.ts) 中的 schema）。

## 部署

推送至 `master` 分支会触发 GitHub Actions 工作流，自动构建并部署到 GitHub Pages。需在仓库 **Settings → Pages** 中将 Build and deployment 的 Source 设为 **GitHub Actions**。
