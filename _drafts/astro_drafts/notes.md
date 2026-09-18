---
# the default layout is 'page'
icon: fas fa-info-circle
order: 7
---

import Layout from '../layouts/Layout.astro';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const notesFilePath = path.join(process.cwd(), 'src', 'content', 'notes', 'notes.md');
let notesRaw = '';
let noteCreatedAt = '';

try {
  notesRaw = await fs.readFile(notesFilePath, 'utf-8');
  const fileStats = await fs.stat(notesFilePath);
  noteCreatedAt = fileStats.birthtime.toISOString();
} catch {
  notesRaw = '';
  noteCreatedAt = '';
}

type NoteBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const colorClasses = [
  'note-card-yellow',
  'note-card-lavender',
  'note-card-mint',
  'note-card-peach',
  'note-card-blue',
];

function parseNoteBody(rawBody: string): NoteBlock[] {
  return rawBody
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const isList = lines.every((line) => /^([-*+]|\d+\.)\s+/.test(line));

      if (isList) {
        return {
          type: 'list',
          items: lines.map((line) => line.replace(/^([-*+]|\d+\.)\s+/, '').trim()),
        };
      }

      return {
        type: 'paragraph',
        text: block.replace(/\r?\n/g, ' '),
      };
    });
}

function formatNoteDate(value: string | undefined) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function parseStickyNotes(content: string, createdAt: string) {
  const text = content || '';
  const headingMatches = [...text.matchAll(/^#{1,6}\s+(.+)$/gm)];
  if (!headingMatches.length) {
    const bodyBlocks = parseNoteBody(text);
    return bodyBlocks.length
      ? [{ title: 'Notes', bodyBlocks, createdAt: formatNoteDate(createdAt) }]
      : [];
  }

  return headingMatches.map((match, index) => {
    const title = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = headingMatches[index + 1]?.index ?? text.length;
    const rawBody = text.slice(start, end).trim();
    return {
      title,
      id: `note-${slugify(title)}`,
      colorClass: colorClasses[index % colorClasses.length],
      bodyBlocks: parseNoteBody(rawBody),
      createdAt: formatNoteDate(createdAt),
    };
  });
}

const notes = parseStickyNotes(notesRaw, noteCreatedAt);
---
<Layout title="Notes">
  <!-- Page header -->
  <section class="bg-canvas border-b border-hairline py-16 md:py-20" aria-label="Notes header">
    <div class="container-page max-w-5xl">
      <span class="section-eyebrow block mb-3">Notes</span>
      <h1 class="text-4xl md:text-5xl font-semibold tracking-[-0.05em] text-ink leading-tight mb-4">
        Sticky Notes.
      </h1>
      <p class="text-lg text-body leading-7">Fleeting thoughts, quick references, and ideas captured as they come.</p>
    </div>
  </section>

  <!-- Notes section -->
  <section class="section bg-canvas-soft" id="notes" aria-label="Notes">
    <div class="container-page max-w-5xl">

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {notes.length ? notes.map((note) => (
          <article class={`note-card ${note.colorClass}`} id={note.id}>
            <div class="note-card-header">
              <div class="note-card-heading">
                <h3 class="note-card-title">{note.title}</h3>
                {note.createdAt ? <p class="note-card-date">{note.createdAt}</p> : null}
              </div>
            </div>
            <div class="note-card-body">
              {note.bodyBlocks.length ? note.bodyBlocks.map((block) => (
                block.type === 'list'
                  ? <ul class="note-card-list">{block.items.map((item) => <li>{item}</li>)}</ul>
                  : <p>{block.text}</p>
              )) : <p class="note-card-empty">Add content under this heading in <code>src/content/notes/notes.md</code>.</p>}
            </div>
            <div class="note-card-share-actions">
              <button type="button" class="note-share-action note-share-copy" aria-label={`Copy share link for ${note.title}`}>
                <i class="fas fa-link"></i>
              </button>
              <a class="note-share-action note-share-x" href={`https://x.com/intent/tweet?url=${encodeURIComponent(`/notes/#${note.id}`)}&text=${encodeURIComponent(`Open this note: ${note.title}`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${note.title} on X`}>
                <i class="fab fa-x-twitter"></i>
              </a>
              <a class="note-share-action note-share-linkedin" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/notes/#${note.id}`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${note.title} on LinkedIn`}>
                <i class="fab fa-linkedin-in"></i>
              </a>
              <a class="note-share-action note-share-email" href={`mailto:?subject=${encodeURIComponent(note.title)}&body=${encodeURIComponent(`Open this note: ${note.title}\n\nhttps://yourdomain.com/notes/#${note.id}`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${note.title} via Email`}>
                <i class="fas fa-envelope"></i>
              </a>
            </div>
          </article>
        )) : (
          <div class="col-span-full text-center py-16">
            <p class="text-body text-sm">No notes found yet. Add markdown headings to <code class="font-mono text-xs bg-canvas-soft-2 px-1 rounded">src/content/notes/notes.md</code> to create sticky note cards.</p>
          </div>
        )}
      </div>

    </div>
  </section>

  <script is:inline>
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.note-card').forEach((noteCard) => {
        const noteId = noteCard.id || '';
        const shareUrl = `${window.location.origin}${window.location.pathname}#${noteId}`;

        const copyButton = noteCard.querySelector('.note-share-copy');
        const xLink = noteCard.querySelector('.note-share-x');
        const linkedinLink = noteCard.querySelector('.note-share-linkedin');
        const emailLink = noteCard.querySelector('.note-share-email');

        if (copyButton) {
          copyButton.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(shareUrl);
              const original = copyButton.innerHTML;
              copyButton.innerHTML = '<i class="fas fa-check"></i>';
              copyButton.classList.add('note-share-success');
              setTimeout(() => {
                copyButton.innerHTML = original;
                copyButton.classList.remove('note-share-success');
              }, 2000);
            } catch {
              alert('Unable to copy note link.');
            }
          });
        }

        const title = noteCard.querySelector('.note-card-title')?.textContent?.trim() || 'Note';

        if (xLink) {
          xLink.setAttribute('href', `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Open this note: ${title}`)}`);
        }

        if (linkedinLink) {
          linkedinLink.setAttribute('href', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        }

        if (emailLink) {
          const emailSubject = encodeURIComponent(title);
          const emailBody = encodeURIComponent(`Open this note: ${shareUrl}`);
          emailLink.setAttribute('href', `mailto:?subject=${emailSubject}&body=${emailBody}`);
        }
      });
    });
  </script>
</Layout>
