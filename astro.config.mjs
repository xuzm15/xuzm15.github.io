// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkMath from 'remark-math';

/** Map MLIR code blocks to LLVM highlighting (Shiki has llvm, not mlir). */
function rehypeMlirToLlvm() {
	function visit(node) {
		if (node.type === 'element') {
			if (node.tagName === 'code' && node.properties?.className) {
				const classes = node.properties.className;
				if (Array.isArray(classes) && classes.some((c) => String(c) === 'language-mlir')) {
					node.properties.className = classes.map((c) =>
						String(c) === 'language-mlir' ? 'language-llvm' : c
					);
				}
			}
			if (node.children) for (const child of node.children) visit(child);
		}
	}
	return (tree) => {
		if (tree.children) for (const child of tree.children) visit(child);
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://xuzm15.github.io',
	integrations: [
		mdx({
			syntaxHighlight: false,
			remarkPlugins: [remarkMath],
			rehypePlugins: [
				rehypeMlirToLlvm,
				[rehypeKatex, { throwOnError: false }],
				[
					rehypePrettyCode,
					{
						theme: 'github-dark-dimmed',
						keepBackground: true,
						defaultLang: { block: 'text', inline: 'text' },
					},
				],
			],
		}),
		sitemap(),
		tailwind(),
	],
	markdown: {
		syntaxHighlight: false,
		remarkPlugins: [remarkMath],
		rehypePlugins: [
			rehypeMlirToLlvm,
			[rehypeKatex, { throwOnError: false }],
			[
				rehypePrettyCode,
				{
					theme: 'github-dark-dimmed',
					keepBackground: true,
					defaultLang: { block: 'text', inline: 'text' },
				},
			],
		],
	},
	i18n: {
		defaultLocale: 'zh',
		locales: ['zh', 'en'],
		routing: {
			prefixDefaultLocale: true,
		},
	},
});
