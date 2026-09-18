import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { siteConfig } from '../data/site';
import { getAllSortedPosts, getPostUrl } from '../utils/content';

export const GET: APIRoute = async (context) => {
  const posts = await getAllSortedPosts();
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site || siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date ? new Date(post.data.date) : new Date(),
      description: post.data.description || '',
      link: getPostUrl(post),
    })),
  });
};
