---
# the default layout is 'page'
icon: fas fa-info-circle
order: 7
---


import Layout from '../layouts/Layout.astro';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getResourceCategory, RESOURCE_CATEGORIES } from '../config/resources';

interface ResourceItem {
  title: string;
  slug: string;
  pdfPath: string;
  thumbnail: string;
  slideCount: number;
  category: string;
  excerpt: string;
  hasPdf: boolean;
}

const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');
let resources: ResourceItem[] = [];

// Extract a concise summary from linkedin_post.txt
function extractExcerpt(text: string): string {
  if (!text) return '';
  const lines = text.split(/\r?\n/);
  const cleanSentences: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Skip single title line or headers
    if (trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('- ')) {
      cleanSentences.push(trimmed.replace(/^[-*•]\s*/, ''));
    } else if (cleanSentences.length < 2 && trimmed.length > 30 && !trimmed.endsWith(':')) {
      cleanSentences.push(trimmed);
    }
    if (cleanSentences.length >= 2) break;
  }
  
  return cleanSentences.join(' ');
}

try {
  const entries = await fs.readdir(docsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;
    const folderPath = path.join(docsDir, slug);
    const pdfPath = `/docs/${slug}/carousel.pdf`;
    const localPdfPath = path.join(folderPath, 'carousel.pdf');
    
    let hasPdf = false;
    try {
      await fs.access(localPdfPath);
      hasPdf = true;
    } catch {
      hasPdf = false;
    }

    // Scan slides directory
    const slidesDir = path.join(folderPath, 'slides');
    let slideImages: string[] = [];
    try {
      const slideEntries = await fs.readdir(slidesDir);
      slideImages = slideEntries
        .filter(f => /\.(png|jpe?g|webp|svg)$/i.test(f))
        .sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
          const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
          return numA - numB;
        });
    } catch {
      slideImages = [];
    }

    // Use first slide as thumbnail
    let thumbnail = '';
    if (slideImages.length > 0) {
      thumbnail = `/docs/${slug}/slides/${slideImages[0]}`;
    }

    // Extract excerpt and read post content
    let excerpt = '';
    let postContent = '';
    try {
      const postPath = path.join(folderPath, 'linkedin_post.txt');
      postContent = await fs.readFile(postPath, 'utf-8');
      excerpt = extractExcerpt(postContent);
    } catch {
      excerpt = '';
      postContent = '';
    }

    const title = slug.replace(/_/g, ' ');
    const category = getResourceCategory(slug, title, postContent);

    if (slideImages.length > 0 || hasPdf) {
      resources.push({
        title,
        slug,
        pdfPath,
        thumbnail,
        slideCount: slideImages.length,
        category,
        excerpt,
        hasPdf,
      });
    }
  }

  // Sort resources alphabetically by title
  resources.sort((a, b) => a.title.localeCompare(b.title));
} catch (error) {
  console.error('Error scanning docs folder:', error);
}

const categories = ['All', ...RESOURCE_CATEGORIES];
const safeJson = (value: any) => JSON.stringify(value).replace(/</g, '\\u003c');
const resourceDataScript = `window.RESOURCES_DATA = ${safeJson(resources)};`;
---

<Layout title="Resources">
  <!-- Dynamic Resource Data Script for Client-Side Filtering -->
  <script is:inline set:html={resourceDataScript}></script>

  <!-- Page header -->
  <section class="bg-canvas border-b border-hairline py-16 md:py-20" aria-label="Resources header">
    <div class="container-page max-w-5xl">
      <span class="section-eyebrow block mb-3">Learning Materials</span>
      <h1 class="text-4xl md:text-5xl font-semibold tracking-[-0.05em] text-ink leading-tight mb-4">
        Resources &amp; Carousels.
      </h1>
      <p class="text-lg text-body leading-7 max-w-3xl">
        Visual slide decks, educational carousels, and downloadable guides covering Python, Data Analytics, Power BI, SQL, Machine Learning, Deep Learning, and Generative AI.
      </p>
    </div>
  </section>

  <!-- Resources Section -->
  <section class="section bg-canvas-soft" id="resources-section" aria-label="Resources list">
    <div class="container-page max-w-5xl">
      
      <!-- Search & Filters Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <!-- Search Input -->
        <div class="relative w-full md:max-w-md">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-mute text-sm pointer-events-none"></i>
          <input
            type="text"
            id="resource-search"
            class="form-input form-input-lg form-input-pill pl-10"
            placeholder="Search guides, Python, Power BI, SQL, ML, AI..."
            aria-label="Search resources"
          />
        </div>

        <!-- Category Filter Tabs -->
        <div class="flex flex-wrap items-center gap-2" id="category-filters">
          {categories.map((cat, idx) => (
            <button
              class={`tab-ghost text-xs ${idx === 0 ? 'active' : ''}`}
              data-category={cat}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <!-- Resource Cards Grid -->
      {resources.length > 0 ? (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="resources-grid">
          {resources.map((resource) => (
            <article
              class="resource-card group bg-canvas rounded-xl border border-hairline hover:border-ink/40 transition-all duration-200 overflow-hidden flex flex-col hover:shadow-card-md"
              data-slug={resource.slug}
              data-title={resource.title.toLowerCase()}
              data-category={resource.category}
              data-excerpt={resource.excerpt.toLowerCase()}
            >
              <!-- Thumbnail Frame (Aspect 4:5 matching 1080x1350 slides) -->
              <a
                href={`/carousel/${resource.slug}/`}
                class="block relative aspect-[4/5] overflow-hidden bg-canvas-soft-2 border-b border-hairline"
                aria-label={`View slide carousel for ${resource.title}`}
              >
                {resource.thumbnail ? (
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    class="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div class="w-full h-full flex flex-col items-center justify-center text-mute p-6 text-center">
                    <i class="fas fa-file-pdf text-5xl mb-3 opacity-60"></i>
                    <span class="text-sm font-medium">PDF Deck</span>
                  </div>
                )}
                
                <!-- Slide Count Badge Overlay -->
                {resource.slideCount > 0 && (
                  <div class="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-canvas/90 dark:bg-canvas/90 backdrop-blur-sm text-ink border border-hairline shadow-sm">
                    <i class="fas fa-layer-group text-[10px] text-mute"></i>
                    <span>{resource.slideCount} slides</span>
                  </div>
                )}

                <!-- Category Tag Overlay -->
                <div class="absolute bottom-3 left-3 inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono uppercase tracking-wider bg-canvas/90 dark:bg-canvas/90 backdrop-blur-sm text-body border border-hairline">
                  {resource.category}
                </div>
              </a>

              <!-- Card Details -->
              <div class="p-5 flex-1 flex flex-col">
                <h2 class="text-base md:text-lg font-semibold text-ink leading-snug tracking-tight mb-2 group-hover:text-link transition-colors">
                  <a href={`/carousel/${resource.slug}/`}>
                    {resource.title}
                  </a>
                </h2>

                {resource.excerpt && (
                  <p class="text-sm text-body leading-relaxed line-clamp-2 mb-4 flex-1">
                    {resource.excerpt}
                  </p>
                )}

                <!-- Action Footer -->
                <div class="pt-3 border-t border-hairline flex items-center justify-between gap-2 mt-auto">
                  <a
                    href={`/carousel/${resource.slug}/`}
                    class="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-link transition-colors"
                  >
                    <span>View Slides</span>
                    <i class="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                  </a>

                  {resource.hasPdf && (
                    <a
                      href={resource.pdfPath}
                      download={`${resource.slug}.pdf`}
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-mute hover:text-ink hover:bg-canvas-soft-2 border border-hairline transition-colors"
                      title="Download PDF version"
                    >
                      <i class="fas fa-download text-[10px]"></i>
                      <span>PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div class="text-center py-16 bg-canvas rounded-xl border border-hairline p-8">
          <i class="fas fa-folder-open text-4xl text-mute mb-3 block"></i>
          <p class="text-ink font-medium mb-1">No resources found</p>
          <p class="text-body text-sm">Add slide folders with PDFs to <code class="font-mono text-xs bg-canvas-soft-2 px-1.5 py-0.5 rounded">src/content/docs/</code>.</p>
        </div>
      )}

      <!-- No Results State (Hidden by default, shown when search has no matches) -->
      <div id="no-results" class="hidden text-center py-16 bg-canvas rounded-xl border border-hairline p-8 mt-6">
        <i class="fas fa-search text-3xl text-mute mb-3 block"></i>
        <p class="text-ink font-medium mb-1">No matching resources found</p>
        <p class="text-body text-sm mb-4">Try searching for different keywords or select "All".</p>
        <button id="reset-filters-btn" class="btn btn-sm btn-secondary" type="button">
          Reset Filters
        </button>
      </div>

    </div>
  </section>

  <!-- Client-Side Search & Filter Handler -->
  <script is:inline>
    (function () {
      const searchInput = document.getElementById('resource-search');
      const categoryTabs = document.querySelectorAll('#category-filters button');
      const cards = document.querySelectorAll('.resource-card');
      const noResults = document.getElementById('no-results');
      const resetBtn = document.getElementById('reset-filters-btn');

      let activeCategory = 'All';
      let searchQuery = '';

      function filterCards() {
        let visibleCount = 0;

        cards.forEach((card) => {
          const title = card.getAttribute('data-title') || '';
          const category = card.getAttribute('data-category') || '';
          const excerpt = card.getAttribute('data-excerpt') || '';

          const matchesCategory = (activeCategory === 'All' || category === activeCategory);
          const matchesSearch = !searchQuery || (
            title.includes(searchQuery) ||
            excerpt.includes(searchQuery) ||
            category.toLowerCase().includes(searchQuery)
          );

          if (matchesCategory && matchesSearch) {
            card.style.display = '';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (noResults) {
          if (visibleCount === 0 && cards.length > 0) {
            noResults.classList.remove('hidden');
          } else {
            noResults.classList.add('hidden');
          }
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value.trim().toLowerCase();
          filterCards();
        });
      }

      categoryTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          categoryTabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          activeCategory = tab.getAttribute('data-category') || 'All';
          filterCards();
        });
      });

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          searchQuery = '';
          activeCategory = 'All';
          categoryTabs.forEach((t, i) => {
            if (i === 0) t.classList.add('active');
            else t.classList.remove('active');
          });
          filterCards();
        });
      }
    })();
  </script>
</Layout>
