import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { i18n } from '../../i18n';

export async function GET(context) {
	const posts = (await getCollection('blog'))
		.filter((p) => p.data.lang === 'en')
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	const t = i18n.en;
	return rss({
		title: t.siteTitle,
		description: t.siteDescription,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/en/blog/${post.data.slug}/`,
		})),
	});
}
