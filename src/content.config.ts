import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Accept `tags: [a, b]` or `tags: a, b` in frontmatter.
const list = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .nullable()
  .transform((val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  });

const leetcode = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/leetcode' }),
  schema: z.object({
    title: z.string(),
    number: z.number().int().optional().nullable(),
    url: z.string().url().optional().nullable(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    topics: list,
    date: z.coerce.date(),
    status: z.enum(['solved', 'attempted', 'revisit']).default('solved'),
    language: z.string().optional().nullable(),
    time: z.string().optional().nullable(),
    space: z.string().optional().nullable(),
    minutes: z.number().optional().nullable(),
  }),
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    provider: z.string().optional().nullable(),
    instructor: z.string().optional().nullable(),
    url: z.string().url().optional().nullable(),
    status: z.enum(['planned', 'in-progress', 'completed', 'dropped']).default('planned'),
    started: z.coerce.date().optional().nullable(),
    completed: z.coerce.date().optional().nullable(),
    progress: z.number().min(0).max(100).default(0),
    certificate: z.string().url().optional().nullable(),
    description: z.string().optional().nullable(),
    tags: list,
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: list,
    hours: z.number().optional().nullable(),
  }),
});

export const collections = { leetcode, courses, journal };
