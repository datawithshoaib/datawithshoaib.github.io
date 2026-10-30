# Shoaib Akthar - Learning AI Engineering in Public

[![Build and Deploy](https://github.com/datawithshoaib/datawithshoaib.github.io/actions/workflows/pages-deploy.yml/badge.svg)](https://github.com/datawithshoaib/datawithshoaib.github.io/actions/workflows/pages-deploy.yml)

> A public learning log: LeetCode problems, courses with notes, and a journal. Built with **Astro** and deployed to GitHub Pages.

| Page | Route | Content folder |
|---|---|---|
| Dashboard (stats, activity heatmap, streak, recent activity) | `/` | — |
| LeetCode log (filter by difficulty, topic, status) | `/leetcode/` | `src/content/leetcode/` |
| Courses (progress and notes) | `/courses/` | `src/content/courses/` |
| Journal (timeline, tag filter) | `/journal/` | `src/content/journal/` |

## ✍️ Adding entries

Every entry is a Markdown file. The `new` script creates one from a template with today's date filled in:

```bash
npm run new leetcode "1. Two Sum"         # -> src/content/leetcode/0001-two-sum.md
npm run new course "Hugging Face LLM Course"
npm run new journal "Fine-tuning with LoRA"  # -> src/content/journal/2026-10-30-fine-tuning-with-lora.md
```

Fill in the frontmatter and write your notes, then commit and push. GitHub Actions rebuilds the site. To update a course's progress, edit `progress`, `status` and `completed` in its file.

### Frontmatter

**LeetCode**: `title`, `number`, `url`, `difficulty` (Easy | Medium | Hard), `topics`, `date`, `status` (solved | attempted | revisit), `language`, `time`, `space`, `minutes`

**Courses**: `title`, `provider`, `instructor`, `url`, `status` (planned | in-progress | completed | dropped), `started`, `completed`, `progress` (0–100), `certificate`, `description`, `tags`

**Journal**: `title`, `date`, `tags`, `hours`

The schema is in `src/content.config.ts`, and a build fails with a clear error if a field is invalid. Each `## Heading` in a course's notes becomes an entry in that page's table of contents.

Everything in this repo is public, including the content files.

## 🧰 Reusable tools

`tools/` holds browser-only AI Engineering and Data Science tools, packaged for another Astro site. They aren't part of this site's build. See [tools/README.md](tools/README.md).

## 🛠️ Development

```bash
npm ci
npm run dev     # http://localhost:4321
npm run build   # static output in dist/
```
