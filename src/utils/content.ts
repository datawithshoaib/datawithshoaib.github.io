import { getCollection, type CollectionEntry } from 'astro:content';

export function getPostUrl(post: CollectionEntry<'posts'>): string {
  if (post.data.permalink) {
    return post.data.permalink.endsWith('/') ? post.data.permalink : `${post.data.permalink}/`;
  }
  return `/posts/${post.id}/`;
}

export function getPortfolioUrl(item: CollectionEntry<'portfolio'>): string {
  if (item.data.permalink) {
    return item.data.permalink.endsWith('/') ? item.data.permalink : `${item.data.permalink}/`;
  }
  return `/projects/${item.id}/`;
}

export function getExperimentUrl(item: CollectionEntry<'experiments'>): string {
  if (item.data.permalink) {
    return item.data.permalink.endsWith('/') ? item.data.permalink : `${item.data.permalink}/`;
  }
  return `/experiments/${item.id}/`;
}

export async function getAllSortedPosts() {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => {
    const aPin = a.data.pin ? 1 : 0;
    const bPin = b.data.pin ? 1 : 0;
    if (aPin !== bPin) {
      return bPin - aPin;
    }
    const aDate = a.data.date ? new Date(a.data.date).getTime() : 0;
    const bDate = b.data.date ? new Date(b.data.date).getTime() : 0;
    return bDate - aDate;
  });
}

export async function getAllSortedPortfolio() {
  const portfolio = await getCollection('portfolio');
  return portfolio.sort((a, b) => {
    const aDate = a.data.date ? new Date(a.data.date).getTime() : 0;
    const bDate = b.data.date ? new Date(b.data.date).getTime() : 0;
    return bDate - aDate;
  });
}

export async function getAllSortedExperiments() {
  const experiments = await getCollection('experiments');
  return experiments.sort((a, b) => {
    const aDate = a.data.date ? new Date(a.data.date).getTime() : 0;
    const bDate = b.data.date ? new Date(b.data.date).getTime() : 0;
    return bDate - aDate;
  });
}

export async function getTrendingTags(limit = 10) {
  const posts = await getCollection('posts');
  const portfolio = await getCollection('portfolio');
  const tagCounts: Record<string, number> = {};

  for (const p of [...posts, ...portfolio]) {
    for (const tag of p.data.tags || []) {
      const normalized = tag.trim();
      if (normalized) {
        tagCounts[normalized] = (tagCounts[normalized] || 0) + 1;
      }
    }
  }

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getRecentPosts(limit = 5) {
  const posts = await getCollection('posts');
  const sorted = [...posts].sort((a, b) => {
    const aDate = (a.data.last_modified_at || a.data.date) ? new Date(a.data.last_modified_at || a.data.date!).getTime() : 0;
    const bDate = (b.data.last_modified_at || b.data.date) ? new Date(b.data.last_modified_at || b.data.date!).getTime() : 0;
    return bDate - aDate;
  });

  return sorted.slice(0, limit).map((p) => ({
    title: p.data.title,
    url: getPostUrl(p),
  }));
}
