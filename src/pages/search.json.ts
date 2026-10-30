import type { APIRoute } from 'astro';
import { getProblems, getCourses, getJournal, problemUrl, courseUrl, journalUrl, excerpt } from '../utils/learning';

export const GET: APIRoute = async () => {
  const [problems, courses, journal] = await Promise.all([getProblems(), getCourses(), getJournal()]);

  const searchData = [
    ...problems.map((p) => ({
      title: p.data.number ? `${p.data.number}. ${p.data.title}` : p.data.title,
      url: problemUrl(p),
      excerpt: excerpt(p.body, 120),
      date: p.data.date.toISOString(),
      tags: [p.data.difficulty, ...p.data.topics],
      categories: ['LeetCode'],
    })),
    ...courses.map((c) => ({
      title: c.data.title,
      url: courseUrl(c),
      excerpt: c.data.description || excerpt(c.body, 120),
      date: (c.data.completed ?? c.data.started)?.toISOString() ?? '',
      tags: c.data.tags,
      categories: ['Course'],
    })),
    ...journal.map((j) => ({
      title: j.data.title,
      url: journalUrl(j),
      excerpt: excerpt(j.body, 120),
      date: j.data.date.toISOString(),
      tags: j.data.tags,
      categories: ['Journal'],
    })),
  ];

  return new Response(JSON.stringify(searchData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
