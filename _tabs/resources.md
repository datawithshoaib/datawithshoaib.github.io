---
layout: page
title: Resources
icon: fas fa-layer-group
order: 5
permalink: /resources/
---

<div class="resources-container" markdown="0">
  <!-- Header & Description -->
  <div class="resource-header mb-4">
    <div class="d-flex align-items-center gap-2 mb-2">
      <span class="badge resource-eyebrow">
        <i class="fas fa-layer-group me-1"></i> Learning Materials
      </span>
    </div>

    <p class="lead text-muted mb-3">
      Visual slide decks, educational carousels, and downloadable guides covering Python, Data Analytics, Power BI, SQL, Machine Learning, Deep Learning, and Generative AI.
    </p>

    <!-- Stats Summary Badges -->
    {% assign all_resources = site.data.resources %}
    {% assign total_count = all_resources | size %}
    <div class="d-flex flex-wrap gap-2 mb-4">
      <span class="resource-stat-badge">
        <i class="fas fa-layer-group me-1 text-primary"></i> <strong>{{ total_count }}</strong> Total Decks
      </span>
      <span class="resource-stat-badge">
        <i class="fas fa-brain me-1" style="color: #6366f1;"></i> <strong>37</strong> Machine Learning
      </span>
      <span class="resource-stat-badge">
        <i class="fas fa-chart-pie me-1" style="color: #f59e0b;"></i> <strong>21</strong> Power BI
      </span>
      <span class="resource-stat-badge">
        <i class="fas fa-database me-1" style="color: #0ea5e9;"></i> <strong>14</strong> SQL &amp; Databases
      </span>
      <span class="resource-stat-badge">
        <i class="fas fa-chart-line me-1" style="color: #10b981;"></i> <strong>12</strong> Data Analytics
      </span>
      <span class="resource-stat-badge">
        <i class="fas fa-robot me-1" style="color: #ec4899;"></i> <strong>6</strong> Generative AI
      </span>
      <span class="resource-stat-badge">
        <i class="fas fa-network-wired me-1" style="color: #8b5cf6;"></i> <strong>3</strong> Deep Learning
      </span>
      <span class="resource-stat-badge">
        <i class="fab fa-python me-1" style="color: #3b82f6;"></i> <strong>2</strong> Python
      </span>
    </div>

    <!-- Search & Filter Controls -->
    <div class="resource-controls card p-3 shadow-sm border-0 mb-4">
      <div class="row g-2 align-items-center">
        <!-- Search input -->
        <div class="col-12 col-md-5">
          <div class="input-group">
            <span class="input-group-text bg-transparent border-end-0">
              <i class="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              id="resource-search-input"
              class="form-control border-start-0 ps-0"
              placeholder="Search guides, Python, Power BI, SQL, ML, AI..."
              aria-label="Search resources"
            />
            <button class="btn btn-outline-secondary border-start-0 d-none" type="button" id="resource-search-clear" title="Clear search">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Category filter pills -->
        <div class="col-12 col-md-7">
          <div class="d-flex flex-wrap gap-1 justify-content-md-end" id="resource-category-filters">
            <button type="button" class="btn btn-sm resource-filter-btn active" data-category="All">
              All ({{ total_count }})
            </button>
            <button type="button" class="btn btn-sm resource-filter-btn" data-category="Machine Learning">
              Machine Learning (37)
            </button>
            <button type="button" class="btn btn-sm resource-filter-btn" data-category="Power BI">
              Power BI (21)
            </button>
            <button type="button" class="btn btn-sm resource-filter-btn" data-category="SQL & Databases">
              SQL &amp; Databases (14)
            </button>
            <button type="button" class="btn btn-sm resource-filter-btn" data-category="Data Analytics">
              Data Analytics (12)
            </button>
            <button type="button" class="btn btn-sm resource-filter-btn" data-category="Generative AI">
              Generative AI (6)
            </button>
            <button type="button" class="btn btn-sm resource-filter-btn" data-category="Deep Learning">
              Deep Learning (3)
            </button>
            <button type="button" class="btn btn-sm resource-filter-btn" data-category="Python">
              Python (2)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Resources Grid -->
  <div class="row g-4" id="resources-grid" markdown="0">
    {% for res in site.data.resources %}
      <div class="col-12 col-sm-6 col-lg-4 resource-col" data-slug="{{ res.slug | escape }}" data-category="{{ res.category | escape }}">
        <article class="card h-100 resource-card border shadow-sm">
          <!-- Thumbnail Frame (Aspect 4:5 matching 1080x1350 slides) -->
          <a
            href="{{ '/resources/' | relative_url }}"
            class="resource-thumbnail-wrapper deck-open-link d-block text-decoration-none"
            data-slug="{{ res.slug | escape }}"
            aria-label="View slide carousel for {{ res.title | escape }}"
            title="Click to view full slide deck"
          >
            {% if res.thumbnail %}
              <img
                src="{{ res.thumbnail | relative_url }}"
                alt="{{ res.title | escape }}"
                class="resource-thumb-img no-popup"
                loading="lazy"
              />
            {% else %}
              <div class="resource-thumb-fallback">
                <i class="fas fa-file-pdf text-4xl mb-2 opacity-60"></i>
                <span class="small font-weight-medium">PDF Deck</span>
              </div>
            {% endif %}

            <!-- Overlay Badge: Slide Count (Top-Right) -->
            {% if res.slide_count > 0 %}
              <span class="resource-badge-overlay badge-top-right">
                <i class="fas fa-layer-group me-1"></i>
                <span>{{ res.slide_count }} slides</span>
              </span>
            {% endif %}

            <!-- Overlay Badge: Category (Bottom-Left) -->
            <span class="resource-badge-overlay badge-bottom-left cat-tag-{{ res.category | slugify }}">
              {{ res.category }}
            </span>

            <!-- Quick View Hover Hint -->
            <span class="resource-hover-hint">
              <i class="fas fa-eye me-1"></i> View Slides
            </span>
          </a>

          <!-- Card Details -->
          <div class="card-body d-flex flex-column p-3">
            <h3 class="resource-card-title mb-2">
              <a href="{{ '/resources/' | relative_url }}" class="deck-open-link text-decoration-none" data-slug="{{ res.slug | escape }}">
                {{ res.title }}
              </a>
            </h3>

            {% if res.excerpt %}
              <p class="resource-card-excerpt small text-muted mb-3 flex-grow-1">
                {{ res.excerpt }}
              </p>
            {% endif %}

            <!-- Action Footer -->
            <div class="resource-card-footer pt-3 mt-auto d-flex align-items-center justify-content-between">
              <button
                type="button"
                class="btn btn-sm btn-link text-decoration-none p-0 resource-view-btn text-primary fw-semibold"
                data-slug="{{ res.slug | escape }}"
              >
                <span>View Slides</span>
                <i class="fas fa-arrow-right ms-1 transition-arrow"></i>
              </button>

              {% if res.has_pdf %}
                <a
                  href="{{ res.pdf_path | relative_url }}"
                  download="{{ res.slug | escape }}.pdf"
                  class="btn btn-sm resource-pdf-btn text-decoration-none"
                  title="Download PDF version"
                >
                  <i class="fas fa-download me-1 small"></i>
                  <span>PDF</span>
                </a>
              {% endif %}
            </div>
          </div>
        </article>
      </div>
    {% endfor %}
  </div>

  <!-- Empty / No Results State -->
  <div id="resources-no-results" class="text-center py-5 d-none">
    <div class="card p-5 border shadow-sm empty-card">
      <i class="fas fa-search text-muted mb-3" style="font-size: 2.5rem;"></i>
      <h5 class="text-muted fw-bold">No matching resources found</h5>
      <p class="text-muted small mb-3">Try searching with different keywords or select "All" categories.</p>
      <div>
        <button type="button" id="resource-reset-btn" class="btn btn-sm btn-primary px-3">
          <i class="fas fa-redo me-1"></i> Reset Filters
        </button>
      </div>
    </div>
  </div>

  <!-- Slide Carousel Viewer Lightbox Modal -->
  <div id="deck-modal" class="deck-modal" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="deck-modal-backdrop"></div>
    <div class="deck-modal-dialog">
      <div class="deck-modal-content">
        <!-- Modal Header -->
        <div class="deck-modal-header">
          <div class="deck-modal-title-box">
            <span class="badge deck-modal-category me-2" id="modal-category">Machine Learning</span>
            <h4 class="deck-modal-title mb-0" id="modal-title">Deck Title</h4>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="deck-slide-counter small text-muted" id="modal-counter">Slide 1 / 10</span>
            <button type="button" class="deck-modal-close-btn" id="modal-close-btn" aria-label="Close modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Modal Body (Slide Canvas) -->
        <div class="deck-modal-body">
          <!-- Prev Button -->
          <button type="button" class="deck-nav-btn deck-nav-prev" id="modal-prev-btn" aria-label="Previous slide">
            <i class="fas fa-chevron-left"></i>
          </button>

          <!-- Slide Display Stage (Dynamic IMG injected via JS) -->
          <div class="deck-slide-stage" id="modal-slide-stage">
            <div class="deck-slide-loading d-none" id="modal-loading">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading slide...</span>
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <button type="button" class="deck-nav-btn deck-nav-next" id="modal-next-btn" aria-label="Next slide">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Modal Footer -->
        <div class="deck-modal-footer">
          <!-- Dots / Pill indicators -->
          <div class="deck-dots-container" id="modal-dots"></div>

          <!-- Action Buttons -->
          <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <button type="button" id="modal-share-btn" class="btn btn-sm btn-outline-secondary" title="Copy link to deck">
              <i class="fas fa-share-alt me-1"></i> Share
            </button>
            <a href="#" id="modal-pdf-download" download class="btn btn-sm btn-outline-secondary" title="Download PDF deck" data-proofer-ignore>
              <i class="fas fa-download me-1"></i> Download PDF
            </a>
            <a href="#" id="modal-pdf-view" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary" title="Open PDF in new tab" data-proofer-ignore>
              <i class="fas fa-external-link-alt me-1"></i> View PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="resource-toast" class="resource-toast d-none" role="alert">
    <i class="fas fa-check-circle me-2 text-success"></i>
    <span id="resource-toast-msg">Link copied to clipboard!</span>
  </div>
</div>

<style>
/* Resources Page Styles */
.resource-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.35rem 0.65rem;
  border-radius: 9999px;
  background-color: rgba(99, 102, 241, 0.12);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.25);
}

.resource-stat-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.82rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  background-color: var(--card-bg, #ffffff);
  border: 1px solid var(--card-border-color, #e9ecef);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  color: var(--text-color, #212529);
}

.resource-controls {
  background-color: var(--card-bg, #ffffff);
  border: 1px solid var(--card-border-color, #e9ecef) !important;
  border-radius: 0.75rem;
}

#resource-search-input {
  background-color: transparent !important;
  color: var(--text-color, #212529) !important;
  border-color: var(--card-border-color, #e9ecef);
}

#resource-search-input:focus {
  border-color: var(--link-color, #007bff);
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.15);
}

.resource-controls .input-group-text {
  border-color: var(--card-border-color, #e9ecef);
  color: var(--text-muted-color, #6c757d);
}

#resource-search-clear {
  border-color: var(--card-border-color, #e9ecef);
  color: var(--text-muted-color, #6c757d);
}

#resource-search-clear:hover {
  background-color: var(--btn-border-color, #f1f3f5);
  color: var(--heading-color, #212529);
}

.resource-filter-btn {
  font-size: 0.8rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  background: transparent;
  color: var(--text-muted-color, #6c757d);
  border: 1px solid var(--card-border-color, #e0e0e0);
  transition: all 0.2s ease;
}

.resource-filter-btn:hover {
  background-color: var(--btn-border-color, #f1f3f5);
  color: var(--heading-color, #212529);
}

.resource-filter-btn.active {
  background-color: var(--link-color, #007bff);
  color: #ffffff;
  border-color: var(--link-color, #007bff);
  font-weight: 600;
}

/* Card Styling */
.resource-card {
  background-color: var(--card-bg, #ffffff);
  border-color: var(--card-border-color, #e9ecef) !important;
  border-radius: 0.85rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  border-color: var(--link-color, #007bff) !important;
}

/* Thumbnail Frame (4:5 Aspect Ratio matching 1080x1350) */
.resource-thumbnail-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background-color: var(--card-header-bg, #f8f9fa);
  overflow: hidden;
  cursor: pointer;
  border-bottom: 1px solid var(--card-border-color, #e9ecef);
}

.resource-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.35s ease;
  display: block;
}

.resource-card:hover .resource-thumb-img {
  transform: scale(1.03);
}

.resource-thumb-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted-color, #6c757d);
  padding: 1.5rem;
  text-align: center;
}

/* Overlay Badges */
.resource-badge-overlay {
  position: absolute;
  z-index: 2;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  line-height: 1.2;
}

.badge-top-right {
  top: 0.75rem;
  right: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #1f2937;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.badge-bottom-left {
  bottom: 0.75rem;
  left: 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 700;
}

/* Category Accent Styles */
.cat-tag-machine-learning {
  background-color: rgba(99, 102, 241, 0.92);
  color: #ffffff;
}

.cat-tag-power-bi {
  background-color: rgba(245, 158, 11, 0.95);
  color: #000000;
}

.cat-tag-sql-databases {
  background-color: rgba(14, 165, 233, 0.92);
  color: #ffffff;
}

.cat-tag-data-analytics {
  background-color: rgba(16, 185, 129, 0.92);
  color: #ffffff;
}

.cat-tag-generative-ai {
  background-color: rgba(236, 72, 153, 0.92);
  color: #ffffff;
}

.cat-tag-deep-learning {
  background-color: rgba(139, 92, 246, 0.92);
  color: #ffffff;
}

.cat-tag-python {
  background-color: rgba(59, 130, 246, 0.92);
  color: #ffffff;
}

/* Hover Quick-View Hint */
.resource-hover-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background-color: rgba(0, 0, 0, 0.75);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0;
  transition: all 0.25s ease;
  pointer-events: none;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.resource-thumbnail-wrapper:hover .resource-hover-hint {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

/* Card Body */
.resource-card-title {
  font-size: 1.02rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--heading-color, #212529);
}

.resource-card-title a {
  color: inherit;
  transition: color 0.2s ease;
}

.resource-card-title a:hover {
  color: var(--link-color, #007bff);
}

.resource-card-excerpt {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resource-card-footer {
  border-top: 1px solid var(--card-border-color, #e9ecef);
}

.resource-view-btn {
  font-size: 0.85rem;
}

.resource-view-btn .transition-arrow {
  transition: transform 0.2s ease;
}

.resource-view-btn:hover .transition-arrow {
  transform: translateX(4px);
}

.resource-pdf-btn {
  font-size: 0.78rem;
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
  background-color: transparent;
  color: var(--text-muted-color, #6c757d);
  border: 1px solid var(--card-border-color, #e9ecef);
  transition: all 0.2s ease;
}

.resource-pdf-btn:hover {
  background-color: var(--btn-border-color, #f1f3f5);
  color: var(--heading-color, #212529);
  border-color: var(--text-muted-color, #6c757d);
}

/* Lightbox Modal */
.deck-modal {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.deck-modal.is-open {
  display: flex;
}

.deck-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: -1;
  animation: modalFadeIn 0.2s ease;
}

.deck-modal-dialog {
  width: 100%;
  max-width: 820px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideUp 0.25s ease;
}

.deck-modal-content {
  background-color: var(--card-bg, #ffffff);
  border: 1px solid var(--card-border-color, #e9ecef);
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 92vh;
}

.deck-modal-header {
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--card-border-color, #e9ecef);
}

.deck-modal-title-box {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding-right: 1rem;
}

.deck-modal-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--heading-color, #212529);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deck-modal-category {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.3rem 0.55rem;
  border-radius: 6px;
  white-space: nowrap;
}

.deck-modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: var(--text-muted-color, #6c757d);
  cursor: pointer;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.deck-modal-close-btn:hover {
  background-color: var(--btn-border-color, #f1f3f5);
  color: var(--heading-color, #212529);
}

/* Modal Body */
.deck-modal-body {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--sidebar-bg, #1e1e24);
  padding: 0.75rem;
  min-height: 380px;
  max-height: calc(88vh - 130px);
  user-select: none;
}

.deck-slide-stage {
  position: relative;
  max-height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deck-current-slide {
  max-width: 100%;
  max-height: calc(88vh - 160px);
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: opacity 0.15s ease;
}

.deck-slide-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  z-index: 2;
}

.deck-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.85);
  color: #1f2937;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 5;
}

.deck-nav-btn:hover {
  background-color: #ffffff;
  transform: translateY(-50%) scale(1.08);
}

.deck-nav-prev {
  left: 1rem;
}

.deck-nav-next {
  right: 1rem;
}

/* Modal Footer */
.deck-modal-footer {
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--card-border-color, #e9ecef);
  background-color: var(--card-bg, #ffffff);
  gap: 1rem;
}

.deck-dots-container {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  overflow-x: auto;
  max-width: 320px;
  padding: 0.25rem 0;
}

.deck-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--card-border-color, #ced4da);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.deck-dot:hover {
  background-color: var(--text-muted-color, #6c757d);
}

.deck-dot.active {
  width: 22px;
  border-radius: 9999px;
  background-color: var(--link-color, #007bff);
}

/* Toast */
.resource-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: var(--card-bg, #ffffff);
  color: var(--text-color, #212529);
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--card-border-color, #e9ecef);
  z-index: 1100;
  display: flex;
  align-items: center;
  font-size: 0.88rem;
  animation: toastSlideUp 0.25s ease;
}

/* Dark Mode Overrides */
html[data-mode="dark"] .badge-top-right,
@media (prefers-color-scheme: dark) {
  html:not([data-mode]) .badge-top-right {
    background-color: rgba(30, 30, 36, 0.9);
    color: #f3f4f6;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
}

html[data-mode="dark"] .deck-nav-btn,
@media (prefers-color-scheme: dark) {
  html:not([data-mode]) .deck-nav-btn {
    background-color: rgba(45, 45, 55, 0.9);
    color: #f3f4f6;
  }
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes toastSlideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 576px) {
  .deck-nav-btn {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
  }
  .deck-nav-prev { left: 0.5rem; }
  .deck-nav-next { right: 0.5rem; }
  .deck-dots-container { max-width: 150px; }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Inject resources data from JSON
  const resourcesData = {{ site.data.resources | jsonify }};
  const resourcesBySlug = {};
  resourcesData.forEach(function(item) {
    resourcesBySlug[item.slug] = item;
  });

  // DOM Elements
  const searchInput = document.getElementById('resource-search-input');
  const searchClearBtn = document.getElementById('resource-search-clear');
  const categoryBtns = document.querySelectorAll('.resource-filter-btn');
  const cards = document.querySelectorAll('.resource-col');
  const noResults = document.getElementById('resources-no-results');
  const resetBtn = document.getElementById('resource-reset-btn');

  // Modal Elements
  const modal = document.getElementById('deck-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalCounter = document.getElementById('modal-counter');
  const modalSlideStage = document.getElementById('modal-slide-stage');
  const modalPrevBtn = document.getElementById('modal-prev-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');
  const modalDots = document.getElementById('modal-dots');
  const modalPdfDownload = document.getElementById('modal-pdf-download');
  const modalPdfView = document.getElementById('modal-pdf-view');
  const modalShareBtn = document.getElementById('modal-share-btn');
  const modalLoading = document.getElementById('modal-loading');
  const toast = document.getElementById('resource-toast');
  const toastMsg = document.getElementById('resource-toast-msg');

  // Dynamically create modal slide image element (prevents Chirpy refactor wrapping)
  let modalSlideImg = document.getElementById('modal-slide-img');
  if (!modalSlideImg && modalSlideStage) {
    modalSlideImg = document.createElement('img');
    modalSlideImg.id = 'modal-slide-img';
    modalSlideImg.className = 'deck-current-slide no-popup';
    modalSlideImg.alt = 'Slide preview';
    modalSlideStage.appendChild(modalSlideImg);
  }

  // State
  let activeCategory = 'All';
  let searchQuery = '';
  let currentDeck = null;
  let currentSlideIndex = 0;

  // Filter Logic
  function filterCards() {
    let visibleCount = 0;

    cards.forEach(function(card) {
      const slug = card.getAttribute('data-slug') || '';
      const item = resourcesBySlug[slug];
      if (!item) return;

      const title = (item.title || '').toLowerCase();
      const category = item.category || '';
      const excerpt = (item.excerpt || '').toLowerCase();

      const matchesCategory = (activeCategory === 'All' || category === activeCategory);
      const matchesSearch = !searchQuery || (
        title.indexOf(searchQuery) !== -1 ||
        excerpt.indexOf(searchQuery) !== -1 ||
        category.toLowerCase().indexOf(searchQuery) !== -1 ||
        slug.toLowerCase().indexOf(searchQuery) !== -1
      );

      if (matchesCategory && matchesSearch) {
        card.classList.remove('d-none');
        visibleCount++;
      } else {
        card.classList.add('d-none');
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.remove('d-none');
      } else {
        noResults.classList.add('d-none');
      }
    }
  }

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      searchQuery = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        if (searchQuery.length > 0) {
          searchClearBtn.classList.remove('d-none');
        } else {
          searchClearBtn.classList.add('d-none');
        }
      }
      filterCards();
    });
  }

  // Clear search button
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', function() {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      searchClearBtn.classList.add('d-none');
      filterCards();
      if (searchInput) searchInput.focus();
    });
  }

  // Category filter tabs
  categoryBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      categoryBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category') || 'All';
      filterCards();
    });
  });

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (searchInput) searchInput.value = '';
      if (searchClearBtn) searchClearBtn.classList.add('d-none');
      searchQuery = '';
      activeCategory = 'All';
      categoryBtns.forEach(function(b, idx) {
        if (idx === 0) b.classList.add('active');
        else b.classList.remove('active');
      });
      filterCards();
    });
  }

  // Show Toast
  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.remove('d-none');
    setTimeout(function() {
      toast.classList.add('d-none');
    }, 3000);
  }

  // Slide Deck Lightbox Logic
  function openDeck(slug, initialSlideIndex) {
    const deck = resourcesBySlug[slug];
    if (!deck || !deck.slides || deck.slides.length === 0) return;

    currentDeck = deck;
    currentSlideIndex = typeof initialSlideIndex === 'number' ? initialSlideIndex : 0;

    // Update Header
    if (modalTitle) modalTitle.textContent = deck.title;
    if (modalCategory) {
      modalCategory.textContent = deck.category;
      modalCategory.className = 'badge deck-modal-category me-2 cat-tag-' + (deck.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }

    // Update Footer Links
    const basePath = '{{ "/" | relative_url }}'.replace(/\/$/, '');
    const pdfFull = basePath + '/' + deck.pdf_path.replace(/^\//, '');
    if (modalPdfDownload) {
      modalPdfDownload.href = pdfFull;
      modalPdfDownload.setAttribute('download', deck.slug + '.pdf');
    }
    if (modalPdfView) {
      modalPdfView.href = pdfFull;
    }

    // Build Dots
    if (modalDots) {
      modalDots.innerHTML = '';
      deck.slides.forEach(function(_, idx) {
        const dot = document.createElement('span');
        dot.className = 'deck-dot' + (idx === currentSlideIndex ? ' active' : '');
        dot.title = 'Slide ' + (idx + 1);
        dot.addEventListener('click', function() {
          goToSlide(idx);
        });
        modalDots.appendChild(dot);
      });
    }

    renderCurrentSlide();

    // Show modal
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Update URL hash without jumping
    if (history.pushState) {
      history.pushState(null, '', '#' + deck.slug);
    }
  }

  function closeDeck() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentDeck = null;

    // Remove hash
    if (history.pushState) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }

  function renderCurrentSlide() {
    if (!currentDeck || !currentDeck.slides) return;
    const total = currentDeck.slides.length;
    if (currentSlideIndex < 0) currentSlideIndex = 0;
    if (currentSlideIndex >= total) currentSlideIndex = total - 1;

    if (modalCounter) {
      modalCounter.textContent = 'Slide ' + (currentSlideIndex + 1) + ' / ' + total;
    }

    // Update dots
    if (modalDots) {
      const dots = modalDots.querySelectorAll('.deck-dot');
      dots.forEach(function(d, i) {
        if (i === currentSlideIndex) d.classList.add('active');
        else d.classList.remove('active');
      });
      if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    // Update slide image
    const basePath = '{{ "/" | relative_url }}'.replace(/\/$/, '');
    const slideSrc = basePath + '/' + currentDeck.slides[currentSlideIndex].replace(/^\//, '');

    if (modalSlideImg) {
      if (modalLoading) modalLoading.classList.remove('d-none');
      const tempImg = new Image();
      tempImg.onload = function() {
        modalSlideImg.src = slideSrc;
        if (modalLoading) modalLoading.classList.add('d-none');
      };
      tempImg.onerror = function() {
        modalSlideImg.src = slideSrc;
        if (modalLoading) modalLoading.classList.add('d-none');
      };
      tempImg.src = slideSrc;
    }

    // Toggle prev/next disabled state
    if (modalPrevBtn) modalPrevBtn.style.opacity = currentSlideIndex === 0 ? '0.4' : '1';
    if (modalNextBtn) modalNextBtn.style.opacity = currentSlideIndex === total - 1 ? '0.4' : '1';
  }

  function goToSlide(index) {
    currentSlideIndex = index;
    renderCurrentSlide();
  }

  function prevSlide() {
    if (!currentDeck) return;
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      renderCurrentSlide();
    }
  }

  function nextSlide() {
    if (!currentDeck) return;
    if (currentSlideIndex < currentDeck.slides.length - 1) {
      currentSlideIndex++;
      renderCurrentSlide();
    }
  }

  // Modal navigation click handlers
  if (modalPrevBtn) modalPrevBtn.addEventListener('click', prevSlide);
  if (modalNextBtn) modalNextBtn.addEventListener('click', nextSlide);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDeck);

  // Click outside modal content closes
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target.classList.contains('deck-modal-backdrop')) {
        closeDeck();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!modal || !modal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeDeck();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      prevSlide();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    }
  });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchEndX = 0;
  const slideStage = document.getElementById('modal-slide-stage');
  if (slideStage) {
    slideStage.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideStage.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Share button
  if (modalShareBtn) {
    modalShareBtn.addEventListener('click', function() {
      if (!currentDeck) return;
      const shareUrl = window.location.origin + window.location.pathname + '#' + currentDeck.slug;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(function() {
          showToast('Share link copied to clipboard!');
        }).catch(function() {
          showToast('Link: ' + shareUrl);
        });
      } else {
        showToast('Link: ' + shareUrl);
      }
    });
  }

  // Attach click listeners to cards and buttons
  document.querySelectorAll('.deck-open-link').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      const slug = el.getAttribute('data-slug');
      if (slug) openDeck(slug, 0);
    });
  });

  document.querySelectorAll('.resource-view-btn').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      const slug = el.getAttribute('data-slug');
      if (slug) openDeck(slug, 0);
    });
  });

  // Check URL Hash on Load
  if (window.location.hash) {
    const hashSlug = window.location.hash.replace(/^#/, '');
    if (resourcesBySlug[hashSlug]) {
      setTimeout(function() {
        openDeck(hashSlug, 0);
      }, 100);
    }
  }
});
</script>
