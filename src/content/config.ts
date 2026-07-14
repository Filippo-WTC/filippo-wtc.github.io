import { defineCollection, z } from 'astro:content';

const vault = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    sector: z.string(),
    tag: z.string(),
    summary: z.string(),
    costAvoided: z.string(),
    costLabel: z.string(),
    date: z.string(),
    duration: z.string(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { vault };
