# Tools

Browser-only AI Engineering and Data Science tools, packaged so you can drop them into another Astro site. Everything runs client-side, with no backend and no npm dependencies.

| Category | Tool | Route |
|---|---|---|
| | Tools index (cards grouped by category) | `/tools/` |
| AI Engineering | Token & Cost Calculator | `/tools/token-cost-calculator/` |
| AI Engineering | RAG Chunking Visualizer | `/tools/rag-chunking-visualizer/` |
| AI Engineering | Prompt Diff | `/tools/prompt-diff/` |
| AI Engineering | JSONL Validator & Converter | `/tools/jsonl-converter/` |
| Data Science | Classification Metrics | `/tools/classification-metrics/` |
| Data Science | A/B Test Significance | `/tools/ab-test-significance/` |

## Layout

`src/` mirrors an Astro project's `src/`, so the relative imports keep working after you copy it:

```text
tools/src/
├── data/
│   ├── tools.ts           # tool registry: title, route, icon, category, tags
│   └── model-pricing.ts   # $/1M token prices for the cost calculator
├── layouts/
│   └── ToolLayout.astro   # tool page header + shared panel/stat/table styles
└── pages/tools/           # one page per tool, plus index.astro
```

## Using it in another site

1. Copy the contents of `tools/src/` into the other site's `src/`:
   ```bash
   cp -r tools/src/* ../other-site/src/
   ```
2. The target site needs:
   - `src/layouts/BaseLayout.astro` that accepts `title` and `description` props. `ToolLayout` wraps it.
   - Bootstrap 5 and Font Awesome 6 loaded globally. The pages use their grid, form and icon classes.
   - Optionally, the Chirpy theme CSS variables (`--card-bg`, `--card-border-color`, `--text-color`, `--heading-color`, `--text-muted-color`, `--link-color`, `--btn-border-color`). Every style has a light-mode fallback, so the pages still render without them.
3. Add the routes to the site's nav, and add `tools` from `data/tools.ts` to its search index if it has one.

## Maintenance

- Update the prices and `pricingUpdated` in `data/model-pricing.ts` when model pricing changes.
- To add a tool, create `pages/tools/<slug>.astro` with `ToolLayout`, then register it in `data/tools.ts` with its category.
