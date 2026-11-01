/* =====================================================
   SITE SCRIPTS (dependency-free)
   - Theme toggle (persisted in localStorage as "darkMode")
   - Header scroll state + mobile navigation
   - Active nav link
   - Scroll reveal (IntersectionObserver)
   - Project card hover glow position
   - Code block copy buttons
   - Table of contents active state
   ===================================================== */
(function () {
  'use strict';

  var doc = document.documentElement;

  /* ---------- Theme ---------- */
  function isDark() {
    return doc.classList.contains('dark');
  }

  function applyTheme(dark) {
    doc.classList.toggle('dark', dark);
    doc.classList.toggle('light', !dark);
    doc.style.colorScheme = dark ? 'dark' : 'light';
    doc.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (document.body) {
      document.body.classList.toggle('dark', dark);
      document.body.classList.toggle('light', !dark);
    }
    if (!doc.hasAttribute('data-theme-override')) {
      try { localStorage.setItem('darkMode', String(dark)); } catch (e) {}
    }
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    window.dispatchEvent(new CustomEvent('themechange', { detail: { dark: dark } }));
  }

  function initTheme() {
    // Head script already set html.dark/light; sync body and the button label.
    applyTheme(isDark());
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        applyTheme(!isDark());
      });
    }
  }

  /* ---------- Header ---------- */
  function initHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });

    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');
    if (toggle && links) {
      var setOpen = function (open) {
        header.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        var use = toggle.querySelector('use');
        if (use) use.setAttribute('href', open ? '#i-close' : '#i-menu');
      };
      toggle.addEventListener('click', function () {
        setOpen(!header.classList.contains('is-open'));
      });
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 760) setOpen(false);
      });
    }

    // Active link
    var path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    document.querySelectorAll('.nav-link').forEach(function (a) {
      var target = new URL(a.href, window.location.origin).pathname.replace(/\.html$/, '');
      var active = target === '/' ? path === '/' : path === target || path.indexOf(target + '/') === 0;
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    items.forEach(function (el, i) {
      // Small stagger for siblings that are already in view on load
      el.style.transitionDelay = Math.min(i % 6, 5) * 45 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- Card hover glow ---------- */
  function initCardGlow() {
    var cards = document.querySelectorAll('.project-card');
    if (!cards.length || !window.matchMedia('(hover: hover)').matches) return;
    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Code blocks: copy button ---------- */
  var ICON_COPY = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  var ICON_DONE = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  function initCodeBlocks() {
    var containers = document.querySelectorAll('div.highlighter-rouge, pre.shiki, figure.highlight');
    containers.forEach(function (container) {
      if (container.closest('.code-block-wrapper')) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      var btn = document.createElement('button');
      btn.className = 'copy-button';
      btn.type = 'button';
      btn.title = 'Copy code';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.innerHTML = ICON_COPY;

      btn.addEventListener('click', function () {
        var codeEl = container.querySelector('td.rouge-code') || container.querySelector('code') || container.querySelector('pre') || container;
        var text = codeEl.textContent.split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('\n').trim();
        navigator.clipboard.writeText(text).then(function () {
          btn.innerHTML = ICON_DONE;
          btn.classList.add('copied');
          setTimeout(function () { btn.innerHTML = ICON_COPY; btn.classList.remove('copied'); }, 2000);
        }).catch(function () {});
      });

      container.parentNode.insertBefore(wrapper, container);
      wrapper.appendChild(btn);
      wrapper.appendChild(container);
    });
  }

  /* ---------- Table of contents ---------- */
  function initToc() {
    var tocNav = document.querySelector('.toc-nav');
    if (!tocNav) return;
    var links = Array.prototype.slice.call(tocNav.querySelectorAll('a[href^="#"]'));
    var headings = links.map(function (link) {
      var el = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
      return el ? { el: el, link: link } : null;
    }).filter(Boolean);
    if (!headings.length) return;

    var navH = parseInt(getComputedStyle(doc).getPropertyValue('--nav-h')) || 64;

    function update() {
      var y = window.scrollY + navH + 40;
      var current = headings[0];
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].el.offsetTop <= y) current = headings[i];
      }
      links.forEach(function (l) { l.classList.remove('active'); });
      current.link.classList.add('active');
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () { update(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---------- Init ---------- */
  function init() {
    initTheme();
    initHeader();
    initReveal();
    initCardGlow();
    initCodeBlocks();
    initToc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Run again after load in case late scripts (e.g. MathJax) altered the DOM.
  window.addEventListener('load', function () {
    setTimeout(initCodeBlocks, 100);
  });

  // Expose for debugging/compat
  window.applyDarkMode = function () { applyTheme(true); };
  window.applyLightMode = function () { applyTheme(false); };
  window.toggleDarkMode = function () { applyTheme(!isDark()); };
})();
