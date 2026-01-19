# M13: Scenius Rebrand & Theme System

**Status**: ✅ Complete (2026-01-18)
**Track**: Post-MVP Polish
**Depends on**: M11 (Graph Interaction Polish)

## Goal

Rebrand the application from "HistoryNet" to "Scenius" (Brian Eno's concept of collective creative intelligence) and introduce a light/dark theme system with URL persistence.

**Context**: The scenius concept—that creative breakthroughs emerge from communities rather than lone geniuses—perfectly describes what this application visualizes: networks of influence, collaboration, and creative exchange between historical figures.

## Tasks

### Application Rebrand

- [x] **SC1** - Update `<title>` in `index.html` from "HistoryNet" to "Scenius"
- [x] **SC2** - Update HTML meta tags: description, og:title, og:description
- [x] **SC3** - Update Header component to display "Scenius" branding
- [x] **SC4** - Add tagline/subtitle to Header (e.g., "Mapping collective genius" or "Visualizing creative communities")
- [x] **SC5** - Update README.md: rename application, explain scenius concept
- [x] **SC6** - Update AGENTS.md: replace HistoryNet references with Scenius
- [x] **SC7** - Update PRD.md: reflect new branding
- [x] **SC8** - Update any other documentation files with new name

### Favicon Design & Implementation

- [x] **SC9** - Design favicon concept: interconnected nodes forming brain/lightbulb shape
- [ ] **SC10** - Create favicon in multiple sizes: 16x16, 32x32, 48x48, 192x192, 512x512 (SVG created, PNG variants deferred)
- [ ] **SC11** - Generate favicon.ico (multi-resolution) (deferred)
- [ ] **SC12** - Create apple-touch-icon.png (180x180) (deferred)
- [x] **SC13** - Update `index.html` with favicon link tags
- [x] **SC14** - Consider: separate favicons for light/dark browser themes (optional) - deferred

### Theme System Architecture

- [x] **TH1** - Create `ThemeContext` in `src/contexts/ThemeContext.tsx`
- [x] **TH2** - Define theme types: `'light' | 'dark'` in `src/types/`
- [x] **TH3** - Implement `useTheme` hook for accessing theme state
- [x] **TH4** - Add `theme` parameter to URL scheme (ThemeContext handles URL sync)
- [x] **TH5** - Ensure theme syncs bidirectionally with URL (like dataset, filters, selection)
- [x] **TH6** - Set light mode as default when no theme param in URL
- [x] **TH7** - Persist theme preference in localStorage as fallback/default
- [x] **TH8** - Wrap App component with ThemeProvider

### Theme Switcher UI

- [x] **TH9** - Create `ThemeToggle` component in `src/components/`
- [x] **TH10** - Design toggle with sun/moon icons (or light/dark metaphor)
- [x] **TH11** - Add ThemeToggle to Header, positioned near dataset selector
- [x] **TH12** - Implement keyboard accessibility (Enter/Space to toggle)
- [x] **TH13** - Add ARIA labels for screen readers
- [x] **TH14** - Style toggle to match existing UI aesthetic

### CSS Custom Properties (Theme Variables)

- [x] **TH15** - Define light mode CSS custom properties in `:root` or `[data-theme="light"]`
- [x] **TH16** - Define dark mode CSS custom properties in `[data-theme="dark"]`
- [x] **TH17** - Ensure sufficient contrast ratios (WCAG AA: 4.5:1 for text)

### Component CSS Updates

- [x] **TH18** - Update `App.css` to use theme variables (already uses variables)
- [x] **TH19** - Update `Header.css` to use theme variables (already uses variables)
- [x] **TH20** - Update `FilterPanel.css` to use theme variables (already uses variables)
- [x] **TH21** - Update `InfoboxPanel.css` to use theme variables (already uses variables)
- [x] **TH22** - Update `SearchBox.css` to use theme variables (already uses variables)
- [x] **TH23** - Update `MainLayout.css` to use theme variables
- [x] **TH24** - Update any other component CSS files

### Visualization Theme Support

- [x] **TH25** - Update `ForceGraphLayout.tsx` colors to respect theme (or ensure visibility in both)
- [x] **TH26** - Update `TimelineLayout.tsx` colors to respect theme
- [x] **TH27** - Update `graphColors.ts` to support theme-aware colors (if needed) - node colors stay consistent, CSS handles theme
- [x] **TH28** - Test graph node/edge visibility in both light and dark modes
- [x] **TH29** - Test timeline readability in both modes

### Integration & Testing

- [x] **TH30** - Test URL shareability: `?theme=dark` should load dark mode
- [x] **TH31** - Test combined URL params: `?dataset=disney&theme=dark&selected=...`
- [x] **TH32** - Test theme toggle updates URL without page reload
- [x] **TH33** - Test browser back/forward navigation with theme changes
- [x] **TH34** - Test localStorage fallback when URL has no theme param
- [x] **TH35** - Verify no flash of wrong theme on page load (avoid FOUC)

### Final Verification

- [x] **SC15** - Build passes with no errors
- [x] **SC16** - All linter warnings resolved (pre-existing warnings remain, not introduced by M13)
- [x] **SC17** - Test on production URL after deployment
- [x] **SC18** - Update CHANGELOG.md with M13 completion notes

## Completion Notes

```
[2026-01-18] M13 IMPLEMENTATION COMPLETE:

APPLICATION REBRAND:
- Application renamed from "HistoryNet" to "Scenius"
- New tagline: "Mapping collective genius"
- All documentation updated with new branding
- New SVG favicon with interconnected nodes design

THEME SYSTEM:
- ThemeContext provides light/dark mode state
- URL parameter support: ?theme=dark or ?theme=light
- localStorage persistence as fallback
- All components use CSS custom properties
- WCAG AA contrast ratios maintained

FILES CREATED:
- src/contexts/ThemeContext.tsx - Theme state management
- src/components/ThemeToggle.tsx - Sun/moon toggle component
- src/components/ThemeToggle.css - Toggle styling
- public/favicon.svg - New interconnected nodes favicon

FILES MODIFIED:
- index.html - New title, meta tags, favicon link
- src/App.tsx - ThemeProvider wrapper
- src/App.css - Dark mode CSS variables
- src/components/Header.tsx - New branding, ThemeToggle
- All component CSS files - Theme-aware variables

DEFERRED TASKS:
- PNG favicon variants (SC10-SC12) - SVG sufficient for modern browsers
- Separate light/dark favicons (SC14) - Single SVG works well

✅ MILESTONE 13 COMPLETE - Scenius rebrand and theme system operational
```
