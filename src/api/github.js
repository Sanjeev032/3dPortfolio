/* ═══════════════════════════════════════════════
   GitHub API — Fetch public repos for Sanjeev032
═══════════════════════════════════════════════ */
import { GITHUB_USERNAME, fallbackProjects } from '../data.js';

/* Language colour map */
const LANG_COLORS = {
  JavaScript:  '#f1e05a',
  TypeScript:  '#3178c6',
  Python:      '#3572A5',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  Java:        '#b07219',
  Go:          '#00ADD8',
  Rust:        '#dea584',
  'C++':       '#f34b7d',
  'C#':        '#178600',
  Shell:       '#89e051',
  Kotlin:      '#A97BFF',
  Swift:       '#F05138',
  _default:    '#8b5cf6',
};

export function getLangColor(lang) {
  return LANG_COLORS[lang] || LANG_COLORS._default;
}

/* Categorise a repo into experience level */
function categorise(topics = [], stars = 0, name = '') {
  const n = name.toLowerCase();

  // Explicit mappings based on user request
  if (n.includes('mindly') || n.includes('llm-output-verification') || n.includes('llm output verification') || n.includes('pahunn')) {
    return 'production';
  }
  if (n.includes('peace') || n.includes('sanctuary')) {
    return 'advanced';
  }
  if (n.includes('gips') || n.includes('route-planner') || n.includes('route planner') || n.includes('m-travel') || n.includes('m travel') || n.includes('one-cosmetics') || n.includes('one cosmetics') || n.includes('cosmetics')) {
    return 'intermediate';
  }

  // Default heuristic triggers
  const t = [...topics, name].join(' ').toLowerCase();

  if (
    t.includes('production') || t.includes('enterprise') ||
    t.includes('ai') || t.includes('llm') || t.includes('rag') ||
    t.includes('openai') || t.includes('langchain') || stars >= 12
  ) return 'production';

  if (
    t.includes('advanced') || t.includes('fullstack') ||
    t.includes('full-stack') || t.includes('websocket') ||
    t.includes('docker') || t.includes('microservice') || stars >= 6
  ) return 'advanced';

  if (
    t.includes('intermediate') || t.includes('api') ||
    t.includes('react') || t.includes('nextjs') ||
    t.includes('express') || stars >= 3
  ) return 'intermediate';

  return 'beginner';
}

/* Format ISO date → "Nov 2024" */
function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/* Main fetch */
export async function fetchGitHubProjects() {
  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=public`;
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github.mercy-preview+json' }, // enables topics
    });

    if (!res.ok) throw new Error(`GitHub ${res.status}`);

    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) throw new Error('empty');

    const mapped = repos
      .filter(r => !r.fork && r.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
      .map(r => ({
        id:          r.id,
        name:        r.name,
        description: r.description || 'A project by Sanjeev Kumar.',
        language:    r.language  || 'JavaScript',
        stars:       r.stargazers_count ?? 0,
        updated:     fmt(r.updated_at),
        topics:      Array.isArray(r.topics) ? r.topics : [],
        level:       categorise(r.topics, r.stargazers_count, r.name),
        html_url:    r.html_url,
        homepage:    r.homepage || null,
      }))
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 18);

    return mapped.length > 0 ? mapped : fallbackProjects;
  } catch (err) {
    console.warn('[GitHub API] Using fallback data —', err.message);
    return fallbackProjects;
  }
}
