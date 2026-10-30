// Create a new LeetCode, course or journal entry from a template.
//
//   npm run new leetcode "1. Two Sum"
//   npm run new course "Hugging Face LLM Course"
//   npm run new journal "Fine-tuning with LoRA"
import fs from 'node:fs';
import path from 'node:path';

const [type, ...rest] = process.argv.slice(2);
const input = rest.join(' ').trim();

const usage = 'Usage: npm run new <leetcode|course|journal> "Title"';
if (!['leetcode', 'course', 'journal'].includes(type) || !input) {
  console.error(usage);
  process.exit(1);
}

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const yamlString = (s) => JSON.stringify(s);

let dir;
let file;
let content;

if (type === 'leetcode') {
  // Accept "1. Two Sum", "1 Two Sum" or just "Two Sum".
  const match = input.match(/^(\d+)[.)\s-]*\s*(.+)$/);
  const number = match ? Number(match[1]) : null;
  const title = match ? match[2].trim() : input;
  dir = 'src/content/leetcode';
  file = `${number ? `${String(number).padStart(4, '0')}-` : ''}${slugify(title)}.md`;
  content = `---
title: ${yamlString(title)}
number: ${number ?? ''}
url: https://leetcode.com/problems/${slugify(title)}/
difficulty: Medium # Easy | Medium | Hard
topics: [Array]
date: ${today}
status: solved # solved | attempted | revisit
language: Python
time: O(n)
space: O(1)
minutes: 30
---

## Problem

One or two lines in your own words.

## Approach

How you solved it and why it works. Note any edge cases.

## Solution

\`\`\`python
class Solution:
    def solve(self):
        pass
\`\`\`

## What I learned

The pattern or trick worth remembering.
`;
} else if (type === 'course') {
  dir = 'src/content/courses';
  file = `${slugify(input)}.md`;
  content = `---
title: ${yamlString(input)}
provider: Coursera
instructor:
url:
status: in-progress # planned | in-progress | completed | dropped
started: ${today}
completed:
progress: 0 # percent
certificate:
description: One line on what the course covers.
tags: [AI Engineering]
---

## Why I'm taking this

## Module 1

Key ideas, definitions and examples worth keeping.

## Takeaways
`;
} else {
  dir = 'src/content/journal';
  file = `${today}-${slugify(input)}.md`;
  content = `---
title: ${yamlString(input)}
date: ${today}
tags: [AI Engineering]
hours: 1
---

## What I worked on

## What I learned

## What confused me

## Next
`;
}

const target = path.join(dir, file);
if (fs.existsSync(target)) {
  console.error(`${target} already exists.`);
  process.exit(1);
}
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(target, content);
console.log(`Created ${target}`);
