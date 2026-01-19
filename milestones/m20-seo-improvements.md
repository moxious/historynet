# M20: SEO Improvements

**Status**: ✅ Complete (2026-01-19)
**Track**: A (Independent Features)
**Depends on**: None

## Goal

Systematically improve search engine optimization and AI discoverability across all pages. Add OpenSearch metadata, structured data (JSON-LD), enhanced meta tags, and crawler-friendly resources.

## Tasks

### 1. OpenSearch Integration

- [x] **SEO1** - Create `public/opensearch.xml` descriptor file
- [x] **SEO2** - Add `<link rel="search" type="application/opensearchdescription+xml">` to `index.html`
- [x] **SEO3-5** - Browser integration verified via automated testing

### 2. Structured Data (JSON-LD)

- [x] **SEO6** - Add `WebSite` schema to `index.html`
- [x] **SEO7** - Add `WebApplication` schema to `index.html`
- [x] **SEO8** - Create `src/components/SchemaOrg.tsx` component for dynamic JSON-LD injection
- [x] **SEO9** - Export `SchemaOrg` from `src/components/index.ts`
- [x] **SEO10** - Add `Person` schema to `NodeDetailPage` for person nodes
- [x] **SEO11** - Add `CreativeWork` schema to `NodeDetailPage` for object nodes
- [x] **SEO12** - Add `Place` schema to `NodeDetailPage` for location nodes
- [x] **SEO13** - Add `Organization` schema to `NodeDetailPage` for entity nodes
- [x] **SEO14** - Add `ItemPage` schema wrapper to all detail pages
- [x] **SEO15** - Add `BreadcrumbList` schema to detail pages matching visual breadcrumb
- [x] **SEO16-17** - Structured data verified via automated browser testing

### 3. Enhanced Meta Tags

- [x] **SEO18** - Add `<meta name="robots" content="index, follow">` to `index.html`
- [x] **SEO19** - Add `<meta name="author" content="Scenius Contributors">` to `index.html`
- [x] **SEO20** - Add `<meta name="keywords">` with relevant terms
- [x] **SEO21** - Add `<meta name="application-name" content="Scenius">` to `index.html`
- [x] **SEO22** - Add `<link rel="canonical">` to `index.html` with production URL
- [x] **SEO23** - Add `<meta property="og:url">` to `index.html`
- [x] **SEO24** - Add `<meta property="og:locale" content="en_US">` to `index.html`
- [x] **SEO25** - Update `og:image` to use absolute URL with production domain
- [x] **SEO26** - Update Twitter image to use absolute URL with production domain
- [x] **SEO27** - Review and optimize meta description length
- [x] **SEO28** - Update `ResourceMeta.tsx` to ensure all image URLs are absolute
- [~] **SEO29** - Deferred: Dataset-specific meta tags on main view (future enhancement)

### 4. Crawler Resources

- [x] **SEO30** - Create `public/robots.txt` with appropriate rules
- [x] **SEO31** - Create `public/sitemap.xml` with static routes (all 7 datasets)
- [~] **SEO32-33** - Deferred: Build-time sitemap generation (not practical for SPA)
- [x] **SEO34** - Add sitemap reference to robots.txt

### 5. Page-Specific Optimizations

- [~] **SEO35** - Deferred: Dynamic meta tags on main graph view (future enhancement)
- [x] **SEO36** - **Node Detail Page**: ResourceMeta audited and verified
- [x] **SEO37** - **Edge Detail Page**: ResourceMeta audited and verified
- [x] **SEO38** - **404 Page**: `noindex, nofollow` meta tag added via Helmet
- [x] **SEO39** - Verified all pages have unique, descriptive titles
- [x] **SEO40** - Verified all pages have appropriate canonical URLs

### 6. AI-Friendly Metadata

- [x] **SEO41** - Add `article:author` meta tag to detail pages
- [x] **SEO42** - Add `article:published_time` meta tag to detail pages
- [~] **SEO43-44** - Deferred: Citation/Dublin Core metadata (future enhancement for academic datasets)
- [x] **SEO45** - Create `public/llms.txt` guidance file
- [x] **SEO46** - Ensured all descriptions are informative and self-contained

### 7. Testing & Verification

- [x] **SEO47-55** - All verified via automated browser testing on deployed site
- [x] **SEO56** - SPA-specific limitations documented in code comments
- [x] **SEO57** - Build passes with no errors
- [x] **SEO58** - No linter warnings in new/modified files
- [x] **SEO59** - CHANGELOG.md updated

## Files Created

- `public/opensearch.xml` - Browser search integration
- `public/robots.txt` - Crawler directives with sitemap reference
- `public/sitemap.xml` - Static sitemap with all dataset routes
- `public/llms.txt` - AI/LLM guidance file
- `src/components/SchemaOrg.tsx` - Dynamic JSON-LD schema component

## Files Modified

- `index.html` - Added WebSite and WebApplication JSON-LD schemas, enhanced meta tags
- `src/components/ResourceMeta.tsx` - Updated to use absolute URLs for all images
- `src/components/index.ts` - Added SchemaOrg export
- `src/pages/NodeDetailPage.tsx` - Added SchemaOrg component for dynamic structured data
- `src/pages/EdgeDetailPage.tsx` - Added publishedDate to ResourceMeta
- `src/pages/NotFoundPage.tsx` - Added noindex meta tag via Helmet

## Implementation Notes

- Production base URL: `https://moxious.github.io/historynet`
- Used absolute URLs for all social sharing images (relative URLs don't work for og:image)
- SchemaOrg generates type-specific schemas: Person for person nodes, CreativeWork for objects, Place for locations, Organization for entities
- All detail pages include ItemPage wrapper with BreadcrumbList schema
- Sitemap includes all 7 datasets as hash routes (SPA limitation noted in comments)
