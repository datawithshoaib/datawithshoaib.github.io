import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const imageSchema = z.union([
  z.string(),
  z.object({
    path: z.string().optional().nullable(),
    lqip: z.string().optional().nullable(),
    alt: z.string().optional().nullable(),
    no_bg: z.boolean().optional().nullable(),
  }),
]);

const basePostSchema = z.object({
  title: z.string(),
  date: z.coerce.date().optional().nullable(),
  last_modified_at: z.coerce.date().optional().nullable(),
  permalink: z.string().optional().nullable(),
  tags: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean);
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }),
  categories: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean);
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }),
  image: imageSchema.optional().nullable(),
  toc: z.boolean().optional().nullable(),
  pin: z.boolean().optional().nullable(),
  description: z.string().optional().nullable(),
  layout: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  authors: z.array(z.string()).optional().nullable(),
  published: z.boolean().optional().nullable(),
  comments: z.boolean().optional().nullable(),
  media_subpath: z.string().optional().nullable(),
  math: z.boolean().optional().nullable(),
  mermaid: z.boolean().optional().nullable(),
  excerpt_separator: z.string().optional().nullable(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: basePostSchema,
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/portfolio' }),
  schema: basePostSchema,
});

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experiments' }),
  schema: basePostSchema,
});

export const collections = {
  posts,
  portfolio,
  experiments,
};
