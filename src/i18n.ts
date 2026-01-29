/** Supported locales. Must match astro.config.mjs i18n.locales */
export const LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const i18n: Record<
	Locale,
	{
		siteTitle: string;
		siteDescription: string;
		nav: {
			home: string;
			archives: string;
			tags: string;
			about: string;
		};
		pages: {
			archives: string;
			tags: string;
			about: string;
			aboutTitle: string;
			latestPosts: string;
			tagLabel: string;
			lastUpdatedOn: string;
			langSwitch: string; // "中文 | English"
		};
		footer: {
			copyright: string;
			github: string;
			rss: string;
		};
	}
> = {
	zh: {
		siteTitle: "xuzm15's blog",
		siteDescription: '欢迎来到我的博客',
		nav: {
			home: '首页',
			archives: '归档',
			tags: '标签',
			about: '关于',
		},
		pages: {
			archives: '归档',
			tags: '标签',
			about: '关于',
			aboutTitle: '关于我',
			latestPosts: '最新文章',
			tagLabel: '标签',
			lastUpdatedOn: '更新于',
			langSwitch: '中文 | English',
		},
		footer: {
			copyright: '版权所有',
			github: 'GitHub',
			rss: 'RSS',
		},
	},
	en: {
		siteTitle: "xuzm15's blog",
		siteDescription: 'Welcome to my blog',
		nav: {
			home: 'Home',
			archives: 'Archives',
			tags: 'Tags',
			about: 'About',
		},
		pages: {
			archives: 'Archives',
			tags: 'Tags',
			about: 'About',
			aboutTitle: 'About Me',
			latestPosts: 'Latest Posts',
			tagLabel: 'Tag',
			lastUpdatedOn: 'Last updated on',
			langSwitch: '中文 | English',
		},
		footer: {
			copyright: 'All rights reserved',
			github: 'GitHub',
			rss: 'RSS',
		},
	},
};

export function getLocaleFromUrl(pathname: string): Locale {
	const segment = pathname.split('/')[1];
	return segment === 'en' ? 'en' : 'zh';
}
