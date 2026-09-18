# Shoaib Akthar - Portfolio & Blog

[![Build and Deploy](https://github.com/datawithshoaib/datawithshoaib.github.io/actions/workflows/pages-deploy.yml/badge.svg)](https://github.com/datawithshoaib/datawithshoaib.github.io/actions/workflows/pages-deploy.yml)

> Personal portfolio, learning blog, project showcase, and resource library of Shoaib Akthar (AI Engineer & Data Scientist). Built with **Astro 5**.

## 🚀 Tech Stack

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation - SSG)
- **Styling**: Bootstrap 5 + Standalone Chirpy Theme Styles + Custom CSS
- **Syntax Highlighting**: Shiki (with dual light/dark GitHub themes)
- **Math / LaTeX**: Remark-Math & Rehype-KaTeX
- **Search**: Built-in client-side instant search (`Ctrl+K`)
- **Typography & Icons**: Google Fonts (Lato, Source Sans Pro) & FontAwesome 6
- **Deployment**: GitHub Pages via GitHub Actions (fast Node.js build)

## 📁 Project Structure

```text
├── public/
│   └── assets/
│       ├── css/          # Standalone theme stylesheets
│       ├── docs/         # Visual slide decks & PDF guides
│       └── img/          # Images (profile, posts, portfolio, certificates)
├── src/
│   ├── components/       # UI components (Sidebar, Topbar, PostCard, TOC, Search, etc.)
│   ├── content/
│   │   ├── experiments/  # AI experiments & concept explorations (.md)
│   │   ├── portfolio/    # Project case studies & portfolio (.md)
│   │   └── posts/        # Learning blog posts (.md)
│   ├── data/
│   │   ├── certificates.json  # Verified credentials & badges
│   │   ├── resources.json     # Slide decks & educational materials
│   │   └── site.ts            # Site metadata, navigation, & social links
│   ├── layouts/          # BaseLayout, PostLayout, PageLayout
│   ├── pages/            # File-based routing & dynamic collections
│   └── utils/            # Content helpers, URL mapping, & tag utilities
├── astro.config.mjs      # Astro configuration
└── package.json          # Node dependencies & scripts
```

## 🛠️ Development

### Prerequisites

- **Node.js**: v18 or higher (v20+ recommended)
- **npm**: v9 or higher

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/datawithshoaib/datawithshoaib.github.io.git
   cd datawithshoaib.github.io
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Static files will be generated in the `dist/` directory.

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📝 Writing Content

### Adding a Blog Post
Create a new `.md` file in `src/content/posts/`:
```markdown
---
title: Your Post Title
date: 2026-09-18
permalink: /posts/2026/09/your-post-title/
categories: ["Machine Learning"]
tags: ["Python", "Scikit-Learn"]
image: /assets/img/posts/your-image.png
description: A short excerpt of the post.
toc: true
---

Post content in standard Markdown...
```

### Adding a Portfolio Project
Create a new `.md` file in `src/content/portfolio/` under the appropriate subcategory folder.

### Adding an Experiment
Create a new `.md` file in `src/content/experiments/`.

## 🚢 Deployment

The site is automatically built and deployed to GitHub Pages whenever changes are pushed to `main` via the GitHub Actions workflow in `.github/workflows/pages-deploy.yml`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
