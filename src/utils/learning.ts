import { getCollection, type CollectionEntry } from 'astro:content';

export type Problem = CollectionEntry<'leetcode'>;
export type Course = CollectionEntry<'courses'>;
export type JournalEntry = CollectionEntry<'journal'>;

export const slugOf = (entry: { id: string }) => entry.id.replace(/\.mdx?$/, '');

export const problemUrl = (p: Problem) => `/leetcode/${slugOf(p)}/`;
export const courseUrl = (c: Course) => `/courses/${slugOf(c)}/`;
export const journalUrl = (j: JournalEntry) => `/journal/${slugOf(j)}/`;

// Frontmatter dates parse as UTC midnight, so format and bucket in UTC to avoid off-by-one days.
export const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export function formatDate(d: Date | null | undefined, style: 'short' | 'long' = 'short') {
  if (!d) return '';
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
  });
}

const byDateDesc = (a: Date | null | undefined, b: Date | null | undefined) =>
  (b?.getTime() ?? 0) - (a?.getTime() ?? 0);

export async function getProblems() {
  return (await getCollection('leetcode')).sort((a, b) => byDateDesc(a.data.date, b.data.date));
}

export async function getJournal() {
  return (await getCollection('journal')).sort((a, b) => byDateDesc(a.data.date, b.data.date));
}

export const courseStatuses = [
  { value: 'in-progress', label: 'In progress', icon: 'fas fa-person-running' },
  { value: 'planned', label: 'Planned', icon: 'far fa-calendar' },
  { value: 'completed', label: 'Completed', icon: 'fas fa-circle-check' },
  { value: 'dropped', label: 'Dropped', icon: 'fas fa-ban' },
] as const;

export async function getCourses() {
  return (await getCollection('courses')).sort(
    (a, b) => byDateDesc(a.data.completed ?? a.data.started, b.data.completed ?? b.data.started),
  );
}

export const difficulties = ['Easy', 'Medium', 'Hard'] as const;

// Plain-text preview of a markdown body.
export function excerpt(body: string | undefined, max = 180) {
  const text = (body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_~`>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text;
}

export interface Activity {
  date: Date;
  type: 'leetcode' | 'course' | 'journal';
  title: string;
  url: string;
  detail: string;
}

export async function getActivity(): Promise<Activity[]> {
  const [problems, courses, journal] = await Promise.all([getProblems(), getCourses(), getJournal()]);
  const items: Activity[] = [
    ...problems.map((p) => ({
      date: p.data.date,
      type: 'leetcode' as const,
      title: p.data.number ? `${p.data.number}. ${p.data.title}` : p.data.title,
      url: problemUrl(p),
      detail: `${p.data.status === 'solved' ? 'Solved' : p.data.status === 'revisit' ? 'Marked to revisit' : 'Attempted'} · ${p.data.difficulty}`,
    })),
    ...courses.flatMap((c) => [
      ...(c.data.started ? [{ date: c.data.started, type: 'course' as const, title: c.data.title, url: courseUrl(c), detail: 'Started course' }] : []),
      ...(c.data.completed ? [{ date: c.data.completed, type: 'course' as const, title: c.data.title, url: courseUrl(c), detail: 'Completed course' }] : []),
    ]),
    ...journal.map((j) => ({
      date: j.data.date,
      type: 'journal' as const,
      title: j.data.title,
      url: journalUrl(j),
      detail: j.data.hours ? `Journal · ${j.data.hours}h` : 'Journal',
    })),
  ];
  return items.sort((a, b) => byDateDesc(a.date, b.date));
}
