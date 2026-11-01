# navidsharifi.github.io

Source of [navidsharifi.github.io](https://navidsharifi.github.io), the personal website and research blog of Navid Sharifi. The site is built with [Jekyll](https://jekyllrb.com) and served by GitHub Pages from the `master` branch.

## Running locally

```bash
bundle install
bundle exec jekyll serve --livereload
```

The site is then available at `http://localhost:4000`.

## Project structure

```
.
├── _config.yml                 Site settings, home-page content and build options
├── index.md                    Home page (uses the homepage layout)
│
├── _pages/                     Standalone pages: blog, projects, publications, skills, Optora
├── _blog_posts/                Blog posts, one Markdown file per post (YYYY-MM-DD-slug.md)
├── _data/                      Structured content edited as YAML
│   ├── navigation.yml          Header and footer menu
│   ├── education.yml
│   ├── experience.yml
│   ├── projects.yml            Projects shown on the home page
│   ├── projects-page.yml       Projects shown on the projects page
│   ├── publication.yml
│   ├── skills.yml
│   └── blog_posts.yml          Posts published on external platforms
│
├── _layouts/                   Page templates (default, homepage, page, post, tags, categories)
├── _includes/                  Template partials, grouped by role
│   ├── site/                   Head, colour palette, navbar, footer, icon sprite
│   ├── home/                   Home-page sections: hero, about, education, experience, projects
│   ├── components/             Reusable blocks: card, timeline entry, table of contents
│   └── analytics/              Google Analytics and Tag Manager snippets
│
├── _sass/                      Stylesheet partials, imported by assets/css/main.scss
│   ├── base/                   Design tokens and base typography
│   ├── layout/                 Navbar and footer
│   ├── components/             Cards, code blocks, interactive figures
│   └── pages/                  Home page, article body, academic figures and tables
│
└── assets/
    ├── css/main.scss           Stylesheet entry point
    ├── js/                     Site behaviour, citations, figure numbering, interactive figures
    ├── data/blog/<post-slug>/  Data files that drive a post's interactive figures
    ├── images/
    │   ├── profile/            Profile photo
    │   ├── projects/           Project thumbnails and logos
    │   └── blog/<post-slug>/   Figures for one blog post
    └── favicon.ico
```

## Adding content

**A blog post.** Create `_blog_posts/YYYY-MM-DD-slug.md` with this front matter:

```yaml
---
layout: post
title: "Post title"
author: Navid Sharifi
date: YYYY-MM-DD
image: assets/images/blog/slug/cover.svg
featured: false
hidden: false
comments: true
categories: Topic-One Topic-Two
excerpt: "One or two sentences shown on the blog page."
---
```

Put the post's figures in `assets/images/blog/slug/`. If the post has interactive figures, add `anim: true` to the front matter and put their data in `assets/data/blog/slug/`.

**Figures, tables, equations and citations.** Posts support automatic numbering and cross-references:

```html
<figure class="academic-figure" id="fig-example">
  <img src="{{ '/assets/images/blog/slug/example.svg' | relative_url }}" alt="Description">
  <figcaption data-caption="Caption text."></figcaption>
</figure>

As <a href="#fig-example" class="ref"></a> shows ...   <!-- renders as "Figure 1" -->
```

Citations use `<cite data-key="key"></cite>` in the text and a hidden BibTeX block at the end of the post inside `<div class="bibliography-data" style="display:none;">`. The reference list is generated automatically.

**A project.** Add an entry to `_data/projects-page.yml` and its thumbnail to `assets/images/projects/`.

## Styling

Colours, fonts and spacing are defined as CSS custom properties in `_sass/base/_tokens.scss`. The dark-mode background and accent colour are set under `palette` in `_config.yml`. New partials go in the matching folder under `_sass/` and are added to the import list in `assets/css/main.scss`.

## License

Released under the MIT License. See [LICENSE](LICENSE).
