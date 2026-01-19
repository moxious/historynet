# Milestones

This directory contains one file per milestone, replacing the monolithic `PROGRESS.md` and `HISTORY.md` files.

**To implement a milestone**: Read only the specific milestone file (e.g., `m32-new-homepage.md`).

---

## Milestone Status

| # | Milestone | Status | Track | File |
|---|-----------|--------|-------|------|
| M1 | Project Bootstrap | ✅ Complete | - | [m01-project-bootstrap.md](m01-project-bootstrap.md) |
| M2 | Core Data Layer | ✅ Complete | - | [m02-core-data-layer.md](m02-core-data-layer.md) |
| M3 | Graph Visualization | ✅ Complete | - | [m03-graph-visualization.md](m03-graph-visualization.md) |
| M4 | Infobox Panel | ✅ Complete | - | [m04-infobox-panel.md](m04-infobox-panel.md) |
| M5 | Filtering System | ✅ Complete | - | [m05-filtering-system.md](m05-filtering-system.md) |
| M6 | Search & Polish | ✅ Complete | - | [m06-search-polish.md](m06-search-polish.md) |
| M7 | Deployment | ✅ Complete | - | [m07-deployment.md](m07-deployment.md) |
| M8 | Timeline View | ✅ Complete | - | [m08-timeline-view.md](m08-timeline-view.md) |
| M9 | Application Verification | ✅ Complete | - | [m09-app-verification.md](m09-app-verification.md) |
| M10 | UX Improvements | ✅ Complete | - | [m10-ux-improvements.md](m10-ux-improvements.md) |
| M11 | Graph Interaction Polish | ✅ Complete | - | [m11-graph-polish.md](m11-graph-polish.md) |
| M13 | Scenius Rebrand | ✅ Complete | - | [m13-scenius-rebrand.md](m13-scenius-rebrand.md) |
| M14 | Timeline Improvements | ✅ Complete | - | [m14-timeline-improvements.md](m14-timeline-improvements.md) |
| M15 | Stable Resource URLs | ✅ Complete | - | [m15-stable-urls.md](m15-stable-urls.md) |
| M16 | Network Verification | ✅ Complete | - | [m16-network-verification.md](m16-network-verification.md) |
| M18 | Mobile Adaptation | ✅ Complete | - | [m18-mobile-adaptation.md](m18-mobile-adaptation.md) |
| M19 | Radial View | ✅ Complete | - | [m19-radial-view.md](m19-radial-view.md) |
| M20 | SEO Improvements | ✅ Complete | A | [m20-seo-improvements.md](m20-seo-improvements.md) |
| M21 | Dataset Search | ✅ Complete | A | [m21-dataset-search.md](m21-dataset-search.md) |
| M23 | Wikimedia Sourcing | ✅ Complete | A | [m23-wikimedia-sourcing.md](m23-wikimedia-sourcing.md) |
| M24 | Vercel Migration | ✅ Complete | B | [m24-vercel-migration.md](m24-vercel-migration.md) |
| M25 | User Feedback | ✅ Complete | B | [m25-user-feedback.md](m25-user-feedback.md) |
| M26 | Custom Domain | 🔲 Future | B | [m26-custom-domain.md](m26-custom-domain.md) |
| M27 | Spam Protection | 🔲 Future | B | [m27-spam-protection.md](m27-spam-protection.md) |
| M29 | Cross-Scene API | 🔲 Future | B | [m29-cross-scene-api.md](m29-cross-scene-api.md) |
| M30 | Cross-Scene UI | 🔲 Future | B | [m30-cross-scene-ui.md](m30-cross-scene-ui.md) |
| M31 | Dataset Pages | ✅ Complete | C | [m31-dataset-pages.md](m31-dataset-pages.md) |
| M32 | New Homepage | ✅ Complete | C | [m32-new-homepage.md](m32-new-homepage.md) |
| M33 | Social Sharing & Dynamic OG | 🔲 Not Started | B | [m33-social-sharing.md](m33-social-sharing.md) |

> **Note**: M12 and M17 were originally reserved for features that have been renumbered to M24 and M21 respectively.

---

## Tracks

| Track | Description | Milestones |
|-------|-------------|------------|
| **A: Independent Features** | No dependencies, can be done in any order | M21 ✅, M23 ✅ |
| **B: Infrastructure & Backend** | Sequential dependencies starting from M24 | M24 ✅ → M25 ✅ → M27, M24 → M26, M24 → M29 → M30, M24 → M33 |
| **C: Information Architecture** | App navigation restructuring | M31 ✅ → M32 ✅ |

---

## Dependency Diagram

```
M1-M20 (Core Application Complete) ✅
    │
    ├───────────────────────────────────────────┬──────────────────────────┐
    │                                           │                          │
    │  TRACK A: Independent Features            │  TRACK B: Infrastructure │  TRACK C: Info Architecture
    │  (Complete)                               │  (Sequential)            │  (Complete)
    │                                           │                          │
    ├──────────────┬────────────────┐           │                          │
    ▼              ▼                │           ▼                          ▼
   M21            M23               │          M24                        M31 ✅
   (Dataset      (Wikimedia        │         (Vercel) ✅                    │
   Search) ✅    Sourcing) ✅      │            │                          ▼
                                   │            ├────────┬────────┬────────M32 ✅
                                   │            ▼        ▼        ▼        ▼
                                   │           M25      M26      M29      M33
                                   │        (Feedback)(Domain)(Cross- (Social
                                   │            ✅              Scene  Sharing)
                                   │            │               API)
                                   │            ▼                │
                                   │           M27               ▼
                                   │        (Spam)              M30
                                   │                         (Cross-
                                   │                         Scene UI)
```

---

## Next Steps

**Ready to implement** (dependencies satisfied):
- **M33: Social Sharing & Dynamic OG** - Depends on M24 ✅ ← **Recommended next**
- **M26: Custom Domain** - Depends on M24 ✅
- **M27: Spam Protection** - Depends on M25 ✅
- **M29: Cross-Scene API** - Depends on M24 ✅

**Track C complete**: M32 (New Homepage) completes the information architecture track.

**Note**: M33 removes GitHub Pages deployment and migrates to BrowserRouter. This should be done before M26 (Custom Domain) to ensure the domain points to the correct URL structure.
