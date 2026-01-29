# xuzm15's Blog

个人博客，基于 [Astro](https://astro.build) 构建，部署在 GitHub Pages。

- 站点：<https://xuzm15.github.io>

## 技术栈

- **Astro 5**：静态站点
- **Tailwind CSS**：样式与排版（含 `@tailwindcss/typography`）
- **MDX**：博客内容支持 Markdown + JSX
- **部署**：GitHub Actions → GitHub Pages

## 功能

- **中英文双版本**：站点支持 `/zh/`（中文）与 `/en/`（英文），根路径 `/` 重定向到 `/zh/`
- 首页（最新文章列表，按语言过滤）
- 博客列表与文章详情（按 `src/content/blog/` 下的 MD/MDX 生成）
- 归档页、标签页、关于页（均有中英文）
- 文章页内可切换语言（同一篇文章的中/英版本通过相同 `slug` 关联）
- RSS：`/rss.xml`（默认中文）、`/zh/rss.xml`、`/en/rss.xml`
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
├── components/       # 公共组件（Header、Footer、BaseHead 等）
├── content/blog/    # 博客文章
│   ├── zh/          # 中文文章（按年份 2015、2016、2017…）
│   └── en/          # 英文文章（同上，与中文通过 slug 一一对应）
├── i18n.ts          # 中英文文案（导航、页标题等）
├── layouts/         # 页面布局（BaseLayout、BlogPost）
├── pages/           # 路由
│   ├── index.astro  # 根路径，重定向到 /zh/
│   ├── zh/          # 中文路由（首页、博客、归档、标签、关于、RSS）
│   └── en/          # 英文路由（同上）
├── styles/          # 全局样式
└── consts.ts        # 站点标题、描述等常量（部分已迁至 i18n.ts）
```

### 文章 frontmatter 与双版本约定

每篇文章的 frontmatter 需包含（参见 [content.config.ts](src/content.config.ts)）：

- `title`、`description`、`pubDate`、`tags` 等
- **`lang`**：`zh` 或 `en`
- **`slug`**：同一篇文章的中英文版本必须使用**相同的 slug**（用于 URL 与语言切换），例如 `20151107-markdown-guide`

- 中文文章放在 `src/content/blog/zh/年份/` 下
- 英文文章放在 `src/content/blog/en/年份/` 下  
- 同一篇文章的中英文通过相同 `slug` 关联，文章页会显示「中文 | English」切换链接（若存在对应语言版本）

## 部署

推送至 `master` 分支会触发 GitHub Actions 工作流，自动构建并部署到 GitHub Pages。需在仓库 **Settings → Pages** 中将 Build and deployment 的 Source 设为 **GitHub Actions**。
