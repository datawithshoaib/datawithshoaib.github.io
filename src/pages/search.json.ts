import type { APIRoute } from 'astro';
import { getAllSortedPosts, getAllSortedPortfolio, getAllSortedExperiments, getPostUrl, getPortfolioUrl, getExperimentUrl } from '../utils/content';

export const GET: APIRoute = async () => {
  const posts = await getAllSortedPosts();
  const portfolio = await getAllSortedPortfolio();
  const experiments = await getAllSortedExperiments();

  const searchData = [
    ...posts.map((p) => ({
      title: p.data.title,
      url: getPostUrl(p),
      excerpt: p.data.description || '',
      date: p.data.date ? new Date(p.data.date).toISOString() : '',
      tags: p.data.tags || [],
      categories: p.data.categories || [],
      type: 'post',
    })),
    ...portfolio.map((p) => ({
      title: p.data.title,
      url: getPortfolioUrl(p),
      excerpt: p.data.description || p.data.excerpt || '',
      date: p.data.date ? new Date(p.data.date).toISOString() : '',
      tags: p.data.tags || [],
      categories: p.data.categories || [],
      type: 'project',
    })),
    ...experiments.map((e) => ({
      title: e.data.title,
      url: getExperimentUrl(e),
      excerpt: e.data.description || e.data.excerpt || '',
      date: e.data.date ? new Date(e.data.date).toISOString() : '',
      tags: e.data.tags || [],
      categories: e.data.categories || [],
      type: 'experiment',
    })),
  ];

  return new Response(JSON.stringify(searchData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
