import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import fs from 'node:fs';
import path from 'node:path';

// Helper: recursively copy a directory
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Astro integration: serve src/content/images at /images/ (dev + build)
function contentImages() {
  return {
    name: 'content-images',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const src = new URL('../src/content/images/', dir).pathname.replace(/^\/([A-Z]:)/, '$1');
        const dest = new URL('images/', dir).pathname.replace(/^\/([A-Z]:)/, '$1');
        const srcFixed = path.resolve('src/content/images');
        const destFixed = path.resolve(dir.pathname.replace(/^\/([A-Z]:)/, '$1'), 'images');
        if (fs.existsSync(srcFixed)) {
          copyDirSync(srcFixed, destFixed);
        }
      },
      'astro:server:setup': ({ server }) => {
        server.middlewares.use('/images', (req, res, next) => {
          const filePath = path.resolve('src/content/images', decodeURIComponent(req.url.slice(1)));
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
              '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
              '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://datawithshoaib.github.io',
  output: 'static',
  integrations: [sitemap(), mdx(), contentImages()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeRaw, { passThrough: ['element'] }],
      rehypeKatex,
    ],
  },
});
