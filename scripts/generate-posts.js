#!/usr/bin/env node
/**
 * Static blog-post generator.
 *
 * Reads data/blogs.json and writes one fully server-rendered HTML file per post
 * at the repo root (<slug>.html). Each file ships real <title>, meta description,
 * canonical, Open Graph, Twitter, and BlogPosting + BreadcrumbList JSON-LD, with
 * the article body baked into the HTML so search engines and social/AI crawlers
 * see the content without executing JavaScript.
 *
 * Run from the repo root:  node scripts/generate-posts.js
 * Re-run whenever data/blogs.json changes.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://cococorp.tech';
const OG_IMAGE = `${BASE}/assets/images/og-image.jpg`;

const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'blogs.json'), 'utf8'));

// --- helpers -------------------------------------------------------------
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Repair the systematic " ,word" corruption (em-dashes lost in a past export).
// Only touches a space+comma immediately followed by a non-space, which never
// occurs in correctly punctuated prose, so real commas are left untouched.
const fixPunct = (s) => String(s == null ? '' : s).replace(/ ,(\S)/g, ', $1');

const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-ZA',
  { year: 'numeric', month: 'long', day: 'numeric' });

// Contextual mid-article CTA, keyed by post tag (ported from post.html).
const ctaMap = {
  'AI Tools':  { title: 'Want AI set up for your business?', desc: 'We run hands-on AI implementation sessions tailored to your workflow. Book a free 15-minute call.', href: 'ai.html', btn: 'Explore AI Services' },
  'Websites':  { title: 'Ready for a professional website?', desc: 'We build your site for free first. If you love it, take it live. No obligation.', href: 'https://wa.me/27847314960?text=Hi%20COCOCORP!%20I%20read%20your%20blog%20and%20want%20a%20free%20website%20demo.', btn: 'Get Your Free Demo', ext: true },
  'Growth':    { title: 'Need help converting more leads?', desc: 'We build websites designed to generate and capture leads. Let us show you how.', href: 'services.html', btn: 'See Our Services' },
  'Strategy':  { title: 'Want a tech strategy for your business?', desc: 'We help small businesses implement the right tools. Book a free consultation.', href: 'https://wa.me/27847314960?text=Hi%20COCOCORP!%20I%20read%20your%20blog%20and%20want%20to%20discuss%20a%20tech%20strategy.', btn: 'Chat With Us', ext: true }
};

function renderBody(post) {
  let body = fixPunct(post.body);

  // Mid-article CTA after the 3rd closing </p>/<ul> (matches post.html: insert on the 4th).
  const cta = ctaMap[post.tag] || ctaMap['Websites'];
  const target = cta.ext ? ' target="_blank" rel="noopener"' : '';
  const ctaBlock = `<div class="blog-cta"><div class="blog-cta-title">${cta.title}</div>` +
    `<div class="blog-cta-desc">${cta.desc}</div>` +
    `<a href="${cta.href}"${target} class="blog-cta-btn">${cta.btn} <i class="fas fa-arrow-right" style="font-size:0.7rem;"></i></a></div>`;
  let n = 0;
  body = body.replace(/<\/(p|ul)>/gi, (m) => (++n === 4 ? m + ctaBlock : m));

  // End-of-article CTA.
  body += '<div class="blog-cta" style="margin-top:2.5rem;background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid rgba(255,255,255,0.1);">' +
    '<div class="blog-cta-title" style="color:#fff;">Like what you just read?</div>' +
    '<div class="blog-cta-desc" style="color:rgba(255,255,255,0.6);">Get a professional website for your business. We build it free first, you only pay if you love it.</div>' +
    '<a href="https://wa.me/27847314960?text=Hi%20COCOCORP!%20I%20read%20your%20blog%20and%20want%20to%20chat." target="_blank" rel="noopener" class="blog-cta-btn" style="background:#25D366;"><i class="fab fa-whatsapp" style="margin-right:0.3rem;"></i>Chat With Us on WhatsApp</a></div>';
  return body;
}

function renderMorePosts(post) {
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  return others.map((p, i) =>
    `<a href="${p.slug}.html" class="blog-card scroll-para visible" style="--si:${i};text-decoration:none;color:inherit;display:block;">` +
      `<div class="blog-card-body">` +
        `<span class="blog-card-tag" style="background:${p.tagColor}15;color:${p.tagColor};">${esc(p.tag)}</span>` +
        `<h3 style="font-size:1.1rem;font-weight:800;color:#0f172a;margin-bottom:0.5rem;">${esc(p.title)}</h3>` +
        `<p style="font-size:0.85rem;color:#6b7280;line-height:1.6;">${esc(fixPunct(p.excerpt).substring(0, 120))}...</p>` +
      `</div></a>`
  ).join('\n');
}

function schema(post, url) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        url,
        datePublished: post.date,
        dateModified: post.date,
        author: { '@type': 'Organization', name: 'CocoCorp', url: BASE },
        publisher: { '@type': 'Organization', name: 'CocoCorp', url: BASE, logo: { '@type': 'ImageObject', url: `${BASE}/assets/logo.png` } },
        image: OG_IMAGE,
        keywords: post.keywords,
        articleSection: post.tag,
        inLanguage: 'en-ZA'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog.html` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url }
        ]
      }
    ]
  }, null, 2);
}

function renderPage(post) {
  const url = `${BASE}/${post.slug}.html`;
  const fullTitle = `${post.title} | CocoCorp Blog`;
  return `<!DOCTYPE html>
<html lang="en-ZA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${esc(post.description)}">
<meta name="keywords" content="${esc(post.keywords)}">
<meta name="author" content="COCOCORP">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(post.title)}">
<meta property="og:description" content="${esc(post.description)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="article:published_time" content="${post.date}">
<meta property="article:author" content="CocoCorp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(post.title)}">
<meta name="twitter:description" content="${esc(post.description)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="icon" type="image/png" sizes="192x192" href="assets/logo.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/logo.png">
<title>${esc(fullTitle)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="css/cococorp.css">
<script type="application/ld+json">
${schema(post, url)}
</script>
</head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-G3QEERCYFN"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-G3QEERCYFN');</script>
<body>
<nav id="site-nav" class="site-nav"></nav>

<header class="hero-mini" id="postHeader">
    <div class="hero-gradient"></div>
    <div class="hero-content" style="text-align:left;max-width:720px;">
        <a href="blog.html" style="display:inline-flex;align-items:center;color:rgba(255,255,255,0.6);font-size:0.85rem;font-weight:600;margin-bottom:1.5rem;transition:color 0.3s;">
            <i class="fas fa-arrow-left" style="margin-right:0.5rem;"></i> Back to Blog
        </a>
        <div style="display:inline-block;padding:0.3rem 0.8rem;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border-radius:100px;margin-bottom:1rem;background:${post.tagColor};color:#fff;">${esc(post.tag)}</div>
        <h1 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#fff;line-height:1.2;margin-bottom:1rem;">${esc(post.title)} — ${esc(post.subtitle)}</h1>
        <div style="display:flex;gap:1.5rem;font-size:0.85rem;color:rgba(255,255,255,0.5);">
            <span><i class="far fa-calendar" style="margin-right:0.4rem;"></i>${fmtDate(post.date)}</span>
            <span><i class="far fa-clock" style="margin-right:0.4rem;"></i>${esc(post.readTime)}</span>
            <span><i class="far fa-user" style="margin-right:0.4rem;"></i>${esc(post.author)}</span>
        </div>
    </div>
</header>

<section class="section section-light">
    <div class="section-inner">
        <div class="article-body" id="postBody">
${renderBody(post)}
        </div>
    </div>
</section>

<section class="section section-dark">
    <div class="section-dark-bg"></div>
    <div class="section-inner text-center relative">
        <h2 class="heading-lg color-white scroll-words">Ready to Grow Your Business?</h2>
        <p class="scroll-para text-muted" style="font-size:1.1rem;max-width:600px;margin:0 auto 2rem;">Whether you need a website, SEO, or AI training, we're here to help. Chat to us today.</p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;" class="scroll-para">
            <a href="services.html" class="btn-primary">See Our Services</a>
            <a href="ai.html" class="btn-outline">AI for Business</a>
        </div>
    </div>
</section>

<section class="section section-gray">
    <div class="section-inner">
        <h2 class="heading-lg color-dark text-center scroll-words">More Articles</h2>
        <div id="morePosts" class="grid-3 scroll-stagger" style="margin-top:2rem;">
${renderMorePosts(post)}
        </div>
    </div>
</section>

<footer id="site-footer" class="site-footer"></footer>
<script src="js/components.js"></script>
</body>
</html>
`;
}

// --- write files ---------------------------------------------------------
let count = 0;
for (const post of posts) {
  const file = path.join(ROOT, `${post.slug}.html`);
  fs.writeFileSync(file, renderPage(post), 'utf8');
  console.log(`  wrote ${post.slug}.html`);
  count++;
}
console.log(`\nGenerated ${count} static blog post(s).`);
