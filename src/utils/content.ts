import { getCollection, type CollectionEntry } from 'astro:content';

export function getPostUrl(post: CollectionEntry<'posts'>): string {
  if (post.data.permalink) {
    return post.data.permalink.endsWith('/') ? post.data.permalink : `${post.data.permalink}/`;
  }
  return `/blog/${post.id}/`;
}

export function getPortfolioUrl(item: CollectionEntry<'projects'>): string {
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
  const projects = await getCollection('projects');
  return projects.sort((a, b) => {
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

function snippetBody(entry: CollectionEntry<'snippets'>): string {
  return (entry as unknown as { body?: string }).body ?? '';
}

export function getSnippetUrl(entry: CollectionEntry<'snippets'>): string {
  return `/snippets/${entry.id}/`;
}

export function getSnippetTitle(entry: CollectionEntry<'snippets'>): string {
  if (entry.data.title) return entry.data.title;
  const heading = snippetBody(entry).match(/^#\s+(.+)$/m);
  if (heading) return heading[1].trim();
  const name = entry.id.replace(/\.mdx?$/, '').split('/').pop() || entry.id;
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getSnippetExcerpt(entry: CollectionEntry<'snippets'>, limit = 180): string {
  if (entry.data.description) return entry.data.description;
  const text = snippetBody(entry)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ');
  const paragraphs = text.split(/\n\s*\n/);
  for (const block of paragraphs) {
    const line = block.trim();
    if (!line) continue;
    if (/^(#{1,6}\s|>|[-*+]\s|\d+\.\s|\||!\[|<)/.test(line)) continue;
    const clean = line.replace(/\s+/g, ' ');
    return clean.length > limit ? `${clean.slice(0, limit).trimEnd()}…` : clean;
  }
  return '';
}

export async function getAllSortedSnippets() {
  const snippets = await getCollection('snippets');
  return snippets.sort((a, b) =>
    getSnippetTitle(a).localeCompare(getSnippetTitle(b), undefined, { sensitivity: 'base' })
  );
}

export async function getTrendingTags(limit = 10) {
  const posts = await getCollection('posts');
  const projects = await getCollection('projects');
  const tagCounts: Record<string, number> = {};

  for (const p of [...posts, ...projects]) {
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
