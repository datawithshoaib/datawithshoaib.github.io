import type { APIRoute } from 'astro';
import { getAllSortedPosts, getAllSortedPortfolio, getAllSortedExperiments, getAllSortedSnippets, getPostUrl, getPortfolioUrl, getExperimentUrl, getSnippetUrl, getSnippetTitle, getSnippetExcerpt } from '../utils/content';

export const GET: APIRoute = async () => {
  const posts = await getAllSortedPosts();
  const portfolio = await getAllSortedPortfolio();
  const experiments = await getAllSortedExperiments();
  const snippets = await getAllSortedSnippets();

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
    ...snippets.map((s) => ({
      title: getSnippetTitle(s),
      url: getSnippetUrl(s),
      excerpt: getSnippetExcerpt(s),
      date: '',
      tags: [],
      categories: [],
      type: 'snippet',
    })),
  ];

  return new Response(JSON.stringify(searchData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
