/* ═══════════════════════════════════════════════════════════════
   main.js — Entry point
   Mountain Journey Portfolio · Sanjeev Kumar
═══════════════════════════════════════════════════════════════ */
import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initScene }            from './scene.js';
import { fetchGitHubProjects, getLangColor } from './api/github.js';
import { milestones, levels, skills, stats, techCloud } from './data.js';

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════
   STATE
════════════════════════════════════════ */
let allProjects = [];
let activeFilter = 'all';
let modalOpen = false;

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
async function init() {
  const progress = document.getElementById('loading-progress');
  setProgress(progress, 10);

  /* 1 — Init Three.js scene */
  initScene(document.getElementById('mountain-canvas'));
  setProgress(progress, 40);

  /* 2 — Fetch GitHub projects */
  allProjects = await fetchGitHubProjects();
  setProgress(progress, 75);

  /* 3 — Populate all sections */
  populateTimeline();
  populateLevels();
  populateProjects(allProjects);
  populateSkills();
  populateStats();
  setProgress(progress, 100);

  /* 4 — Wire interactions */
  setupDroneCursor();
  setupModal();
  setupFilters();
  setupNavDots();
  setupScrollAnimations();
  setupContactForm();

  /* 5 — Hide loading screen & entrance */
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    entranceAnimation();
  }, 700);
}

function setProgress(el, pct) {
  if (el) el.style.width = pct + '%';
}

/* ════════════════════════════════════════
   ENTRANCE ANIMATION
════════════════════════════════════════ */
function entranceAnimation() {
  const items = document.querySelectorAll(
    '#scene-arrival .arrival-badge, #scene-arrival .arrival-title .title-word, ' +
    '#scene-arrival .arrival-subtitle, #scene-arrival .arrival-description, ' +
    '#scene-arrival .arrival-actions, #scene-arrival .scroll-hint'
  );
  gsap.fromTo(items,
    { opacity: 0, y: 48, filter: 'blur(8px)' },
    { opacity: 1, y: 0,  filter: 'blur(0px)',
      duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
  );
}

/* ════════════════════════════════════════
   SCENE 2 — TIMELINE
════════════════════════════════════════ */
function populateTimeline() {
  const el = document.getElementById('timeline-container');
  el.innerHTML = milestones.map((m, i) => /* html */`
    <article class="timeline-item" id="tl-${i}" aria-label="${m.role} at ${m.company}">
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="timeline-year">${m.year}</div>
      <div class="timeline-role">${m.role}</div>
      <div class="timeline-company">${m.company}</div>
      <p class="timeline-desc">${m.description}</p>
    </article>
  `).join('');
}

/* ════════════════════════════════════════
   SCENE 3 — LEVELS
════════════════════════════════════════ */
function populateLevels() {
  const el = document.getElementById('levels-grid');
  el.innerHTML = levels.map(l => {
    const count = allProjects.filter(p => p.level === l.id).length;
    return /* html */`
      <article class="level-card" data-level="${l.id}" aria-label="${l.title}">
        <div class="level-icon" aria-hidden="true">${l.icon}</div>
        <span class="level-badge ${l.badge}">${l.badge}</span>
        <div class="level-title">${l.title}</div>
        <p class="level-desc">${l.description}</p>
        <div class="level-count">
          <span>${count}</span> project${count !== 1 ? 's' : ''} · ${l.elevation} elevation
        </div>
      </article>
    `;
  }).join('');
}

/* ════════════════════════════════════════
   SCENE 4 — PROJECTS
════════════════════════════════════════ */
function projectCard(p) {
  const langColor = getLangColor(p.language);
  const tags = [...(p.topics || []).slice(0, 3), p.language]
    .filter(Boolean)
    .map(t => `<span class="tag-pill">${t}</span>`)
    .join('');

  return /* html */`
    <article class="project-stone" data-id="${p.id}" data-level="${p.level}"
             role="button" tabindex="0" aria-label="Open details for ${p.name}">
      <div class="stone-header">
        <div class="stone-level-dot ${p.level}" title="${p.level}" aria-hidden="true"></div>
        <span class="stone-level-label ${p.level}">${p.level}</span>
      </div>
      <div class="stone-name">${prettify(p.name)}</div>
      <p class="stone-desc">${p.description}</p>
      <div class="stone-tags">${tags}</div>
      <div class="stone-footer">
        <div class="stone-lang">
          <div class="lang-dot" style="background:${langColor}" aria-hidden="true"></div>
          ${p.language || 'Code'}
        </div>
        <span>Updated ${p.updated}</span>
      </div>
      <button class="stone-explore" data-id="${p.id}" aria-label="Explore ${prettify(p.name)}">
        Explore Stone →
      </button>
    </article>
  `;
}

function populateProjects(projects) {
  const grid = document.getElementById('projects-grid');

  if (!projects || projects.length === 0) {
    grid.innerHTML = '<div class="projects-loading"><p>No projects found.</p></div>';
    return;
  }

  grid.innerHTML = projects.map(projectCard).join('');

  /* Click handlers */
  grid.querySelectorAll('.project-stone, .stone-explore').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const id = el.dataset.id ?? el.closest('.project-stone')?.dataset.id;
      const project = allProjects.find(p => String(p.id) === String(id));
      if (project) openModal(project);
    });
    /* Keyboard */
    if (el.classList.contains('project-stone')) {
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    }
  });

  /* Staggered reveal on scroll */
  grid.querySelectorAll('.project-stone').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, delay: (i % 4) * 0.08,
          ease: 'power3.out',
        });
        el.classList.add('visible');
      },
    });
  });
}

/* ════════════════════════════════════════
   SCENE 5 — SKILLS
════════════════════════════════════════ */
function populateSkills() {
  document.getElementById('skills-grid').innerHTML = skills.map(s => /* html */`
    <div class="skill-item">
      <div class="skill-header">
        <span class="skill-name">${s.name}</span>
        <span class="skill-pct">${s.level}%</span>
      </div>
      <div class="skill-bar">
        <div class="skill-fill" data-width="${s.level}" style="width:0%"></div>
      </div>
    </div>
  `).join('');

  document.getElementById('tech-cloud').innerHTML =
    techCloud.map(t => `<span class="tech-pill">${t}</span>`).join('');

  /* Animate bars when summit enters viewport */
  ScrollTrigger.create({
    trigger: '#scene-summit',
    start: 'top 65%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.skill-fill').forEach(fill => {
        gsap.to(fill, { width: fill.dataset.width + '%', duration: 1.6, ease: 'power2.out', delay: 0.2 });
      });
    },
  });
}

/* ════════════════════════════════════════
   SCENE 5 — STATS
════════════════════════════════════════ */
function populateStats() {
  document.getElementById('stats-grid').innerHTML = stats.map(s => /* html */`
    <div class="stat-item">
      <span class="stat-value">${s.value}</span>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

/* ════════════════════════════════════════
   PROJECT MODAL
════════════════════════════════════════ */
function openModal(p) {
  document.getElementById('modal-level-badge').textContent = p.level.toUpperCase();
  document.getElementById('modal-level-badge').className = `modal-level-badge level-badge ${p.level}`;
  document.getElementById('modal-title').textContent      = prettify(p.name);
  document.getElementById('modal-description').textContent= p.description;

  document.getElementById('modal-tech').innerHTML =
    [...(p.topics || []), p.language].filter(Boolean)
      .map(t => `<span class="tag-pill">${t}</span>`).join('');

  document.getElementById('modal-stars').textContent   = '';
  document.getElementById('modal-updated').textContent = p.updated;
  document.getElementById('modal-lang').textContent    = p.language || 'N/A';

  document.getElementById('modal-actions').innerHTML = `
    <a href="${p.html_url}" target="_blank" rel="noopener" class="btn-gh" aria-label="View on GitHub">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      View on GitHub
    </a>
    ${p.homepage ? `<a href="${p.homepage}" target="_blank" rel="noopener" class="btn-demo" aria-label="View live demo">🚀 Live Demo</a>` : ''}
  `;

  const modal = document.getElementById('project-modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalOpen = true;

  /* Focus trap */
  document.getElementById('modal-close').focus();
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalOpen = false;
}

function setupModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOpen) closeModal();
  });
}

/* ════════════════════════════════════════
   FILTERS
════════════════════════════════════════ */
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.filter === activeFilter) return;
      activeFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filtered = activeFilter === 'all'
        ? allProjects
        : allProjects.filter(p => p.level === activeFilter);

      /* Animate out */
      gsap.to('#projects-grid .project-stone', {
        opacity: 0, y: 12, scale: 0.97, duration: 0.2, stagger: 0.02,
        onComplete: () => populateProjects(filtered),
      });
    });
  });
}

/* ════════════════════════════════════════
   NAV DOTS
════════════════════════════════════════ */
const SECTION_IDS = ['scene-arrival','scene-discovery','scene-journey','scene-projects','scene-summit'];

function setupNavDots() {
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      document.getElementById(SECTION_IDS[i])?.scrollIntoView({ behavior: 'smooth' });
    });
  });
  document.getElementById('begin-journey-btn')?.addEventListener('click', () => {
    document.getElementById('scene-discovery')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ════════════════════════════════════════
   SCROLL ANIMATIONS
════════════════════════════════════════ */
function setupScrollAnimations() {
  /* Timeline items */
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 87%', once: true,
      onEnter: () => {
        gsap.to(el, { opacity:1, x:0, duration:0.6, delay: i * 0.12, ease:'power3.out' });
        el.classList.add('visible');
      },
    });
  });

  /* Level cards */
  document.querySelectorAll('.level-card').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to(el, { opacity:1, y:0, duration:0.6, delay: i * 0.14, ease:'power3.out' });
        el.classList.add('visible');
      },
    });
  });

  /* Summit cards */
  document.querySelectorAll('.summit-card').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { opacity:0, y:30 },
          { opacity:1, y:0, duration:0.7, delay: i * 0.15, ease:'power3.out' }
        );
      },
    });
  });

  /* Summit flag */
  ScrollTrigger.create({
    trigger: '#scene-summit', start: 'top 70%', once: true,
    onEnter: () => {
      gsap.fromTo('.summit-flag svg',
        { opacity:0, y:20 },
        { opacity:1, y:0, duration:1, ease:'power3.out' }
      );
    },
  });
}

/* ════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════ */
function setupContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = document.getElementById('contact-submit');

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    btn.querySelector('span').textContent = 'Sending…';
    btn.disabled = true;
    status.textContent = '';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        status.textContent = '✅ Message sent! I\'ll get back to you soon.';
        status.className = 'form-status success';
        form.reset();
      } else {
        throw new Error('server error');
      }
    } catch {
      status.textContent = '❌ Something went wrong. Please email me directly.';
      status.className = 'form-status error';
    } finally {
      btn.querySelector('span').textContent = 'Send Signal 📡';
      btn.disabled = false;
    }
  });
}

/* ════════════════════════════════════════
   DRONE CURSOR
════════════════════════════════════════ */
function setupDroneCursor() {
  const cursor = document.getElementById('drone-cursor');
  if (!cursor || window.matchMedia('(hover:none)').matches) return;

  let mx = 0, my = 0, cx = 0, cy = 0, px = 0, py = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const svg = cursor.querySelector('svg');

  function tick() {
    cx += (mx - cx) * 0.10;
    cy += (my - cy) * 0.10;

    const vx = mx - px;
    const vy = my - py;
    const tiltX = Math.max(-18, Math.min(18,  vy * 2.2));
    const tiltY = Math.max(-18, Math.min(18, -vx * 2.2));

    cursor.style.left = `${cx}px`;
    cursor.style.top  = `${cy}px`;
    svg.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    px = mx; py = my;
    requestAnimationFrame(tick);
  }
  tick();

  /* Scale on interactive elements */
  const interactives = 'a, button, .project-stone, .level-card, .nav-dot, .social-link, .filter-btn';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(svg, { scale:1.45, duration:0.2 }));
    el.addEventListener('mouseleave', () => gsap.to(svg, { scale:1,    duration:0.2 }));
  });
}

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */
function prettify(name = '') {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* ════════════════════════════════════════
   BOOT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', init);
