export type ToolCategory = 'AI Engineering' | 'Data Science';

export interface Tool {
  title: string;
  slug: string;
  url: string;
  icon: string;
  category: ToolCategory;
  description: string;
  tags: string[];
}

export const categories: { name: ToolCategory; icon: string; blurb: string }[] = [
  { name: 'AI Engineering', icon: 'fas fa-robot', blurb: 'Build and ship LLM apps: prompts, tokens, retrieval and datasets.' },
  { name: 'Data Science', icon: 'fas fa-chart-line', blurb: 'Evaluate models and experiments with the right statistics.' },
];

export const tools: Tool[] = [
  {
    title: 'Token & Cost Calculator',
    slug: 'token-cost-calculator',
    url: '/tools/token-cost-calculator/',
    icon: 'fas fa-coins',
    category: 'AI Engineering',
    description: 'Paste a prompt, estimate its tokens and see what a request (or a million of them) costs across Claude models.',
    tags: ['LLM', 'pricing', 'tokens'],
  },
  {
    title: 'RAG Chunking Visualizer',
    slug: 'rag-chunking-visualizer',
    url: '/tools/rag-chunking-visualizer/',
    icon: 'fas fa-layer-group',
    category: 'AI Engineering',
    description: 'See how fixed, sentence and recursive chunking split your document, with overlap highlighted.',
    tags: ['RAG', 'chunking', 'embeddings'],
  },
  {
    title: 'Prompt Diff',
    slug: 'prompt-diff',
    url: '/tools/prompt-diff/',
    icon: 'fas fa-code-compare',
    category: 'AI Engineering',
    description: 'Compare two versions of a prompt word by word to see exactly what changed.',
    tags: ['prompts', 'diff', 'prompt engineering'],
  },
  {
    title: 'JSONL Validator & Converter',
    slug: 'jsonl-converter',
    url: '/tools/jsonl-converter/',
    icon: 'fas fa-file-code',
    category: 'AI Engineering',
    description: 'Validate fine-tuning and eval datasets line by line and convert between JSON, JSONL and CSV.',
    tags: ['JSONL', 'datasets', 'fine-tuning', 'CSV'],
  },
  {
    title: 'Classification Metrics',
    slug: 'classification-metrics',
    url: '/tools/classification-metrics/',
    icon: 'fas fa-table-cells',
    category: 'Data Science',
    description: 'Enter a confusion matrix and get accuracy, precision, recall, F1, specificity and MCC, each with a plain explanation.',
    tags: ['machine learning', 'confusion matrix', 'evaluation', 'F1'],
  },
  {
    title: 'A/B Test Significance',
    slug: 'ab-test-significance',
    url: '/tools/ab-test-significance/',
    icon: 'fas fa-flask',
    category: 'Data Science',
    description: 'Check whether a difference in conversion rates is statistically significant, with lift, confidence interval and p-value.',
    tags: ['statistics', 'experimentation', 'hypothesis testing'],
  },
];
