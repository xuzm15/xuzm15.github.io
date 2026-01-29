import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory (zh/ and en/ subdirs).
	loader: glob({
		base: './src/content/blog',
		pattern: '**/*.{md,mdx}',
		// Use file path as id so zh and en versions (same slug) don't overwrite each other.
		generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/i, '').replace(/\\/g, '/'),
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string()).optional(),
			/** Language: zh | en. Used for i18n routing. */
			lang: z.enum(['zh', 'en']),
			/** Translation key. Same value for both zh and en versions of the same article. Used in URL. */
			slug: z.string(),
		}),
});

export const collections = { blog };
