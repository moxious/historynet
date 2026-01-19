# M26: Custom Domain

**Status**: 🔲 Future
**Track**: B (Infrastructure & Backend)
**Depends on**: M24 (Vercel Migration) ✅

## Goal

Configure a custom domain for the Vercel deployment.

## Tasks

- [ ] **CD1** - Domain registration (if not already owned)
- [ ] **CD2** - DNS configuration for Vercel
- [ ] **CD3** - SSL certificate setup (automatic via Vercel)
- [ ] **CD4** - Update all hardcoded URLs in codebase (meta tags, sitemap, etc.)
- [ ] **CD5** - Redirect configuration from old URLs
- [ ] **CD6** - Update documentation with new URLs
- [ ] **CD7** - Update CHANGELOG.md when complete

## Hardcoded URLs to Update

When implementing, search for and update these patterns:

- `scenius-seven.vercel.app` → new domain
- `moxious.github.io/historynet` → update backup URL documentation
- `index.html` meta tags (`og:url`, canonical)
- `public/sitemap.xml`
- `public/robots.txt`
- `public/opensearch.xml`
- `AGENTS.md` example URLs
- `README.md` deployment section
- `ROADMAP.md` live demo URL
- `CHEATSHEET.md` URLs
