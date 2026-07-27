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
| M29 | Cross-Scene API | ✅ Complete | B | [m29-cross-scene-api.md](m29-cross-scene-api.md) |
| M30 | Cross-Scene UI | ✅ Complete | B | [m30-cross-scene-ui.md](m30-cross-scene-ui.md) |
| M31 | Dataset Pages | ✅ Complete | C | [m31-dataset-pages.md](m31-dataset-pages.md) |
| M32 | New Homepage | ✅ Complete | C | [m32-new-homepage.md](m32-new-homepage.md) |
| M33 | Social Sharing & Dynamic OG | ✅ Complete | B | [m33-social-sharing.md](m33-social-sharing.md) |
| M34 | Migration Infrastructure & Testing | ⏸ Paused (Phases 1–2 landed) | D | [m34-migration-infrastructure.md](m34-migration-infrastructure.md) |
| M35 | Research Tooling for Atomic Architecture | 🔲 Future | D | [m35-research-tooling.md](m35-research-tooling.md) |
| M36 | Atomic Architecture - Persons Only | 🔲 Future | D | [m36-atomic-persons.md](m36-atomic-persons.md) |
| M37 | Full POLE Atomization | 🔲 Future | D | [m37-full-pole-atomization.md](m37-full-pole-atomization.md) |
| M38 | Inter-Dataset Research Capabilities | 🔲 Future | D | [m38-inter-dataset-research.md](m38-inter-dataset-research.md) |

> **Note**: M12 and M17 were originally reserved for features that have been renumbered to M24 and M21 respectively.

---

## Tracks

| Track | Description | Milestones |
|-------|-------------|------------|
| **A: Independent Features** | No dependencies, can be done in any order | M21 ✅, M23 ✅ |
| **B: Infrastructure & Backend** | Sequential dependencies starting from M24 | M24 ✅ → M25 ✅ → M27, M24 ✅ → M26, M24 ✅ → M29 ✅ → M30, M24 ✅ → M33 ✅ |
| **C: Information Architecture** | App navigation restructuring | M31 ✅ → M32 ✅ |
| **D: Atomic Architecture** | Data architecture transformation for efficient cross-dataset features | M34 → M35, M34 → M36 → M37 → M38 |

---

## Dependency Diagram

```
M1-M20 (Core Application Complete) ✅
    │
    ├───────────────────────────────────────────┬──────────────────────────┬──────────────────────────┐
    │                                           │                          │                          │
    │  TRACK A: Independent Features            │  TRACK B: Infrastructure │  TRACK C: Info Arch      │  TRACK D: Atomic Architecture
    │  (Complete)                               │  (Sequential)            │  (Complete)              │  (Sequential)
    │                                           │                          │                          │
    ├──────────────┬────────────────┐           │                          │                          │
    ▼              ▼                │           ▼                          ▼                          ▼
   M21            M23               │          M24                        M31 ✅                    M34
   (Dataset      (Wikimedia        │         (Vercel) ✅                    │                   (Migration
   Search) ✅    Sourcing) ✅      │            │                          ▼                  Infrastructure)
                                   │            ├────────┬────────┬────────M32 ✅                    │
                                   │            ▼        ▼        ▼        ▼                    ├────────┐
                                   │           M25      M26      M29      M33 ✅                ▼        ▼
                                   │        (Feedback)(Domain)(Cross- (Social                  M35      M36
                                   │            ✅              Scene  Sharing)              (Research  (Atomic
                                   │            │               API)                         Tooling)  Persons)
                                   │            ▼                │                                      │
                                   │           M27               ▼                                      ▼
                                   │        (Spam)              M30                                    M37
                                   │                         (Cross-                                  (Full POLE
                                   │                         Scene UI)                               Atomization)
                                   │                                                                     │
                                   │                                                                     ▼
                                   │                                                                    M38
                                   │                                                               (Inter-Dataset
                                   │                                                                 Research)
```

---

## Next Steps

**Active direction (2026-07-27)**: **Thread 2A — pipeline scripting** (see
`thread2-pipeline-optimization.md`). Format-agnostic scripts that speed up the
"idea → dataset" pipeline on the *current* data format, no migration required.
Shipped so far: `enrich` (Wikidata/Wikipedia field lookup) and `sync-manifest`
(manifest count reconciliation + CI `--check`).

**Ready to implement** (dependencies satisfied):
- **Thread 2A remainder**: `new-dataset`, `check-evidence`, `fetch-banner`, `suggest`
- **M26: Custom Domain** - Depends on M24 ✅ (quick, unblocked)
- **M27: Spam Protection** - Depends on M25 ✅

**Paused**:
- **M34: Migration Infrastructure** - Phases 1–2 landed (PR #36); Phases 3–5 +
  blockers B1–B4 consciously deferred behind Thread 2A. Resume deliberately later.

**Track B progress**: M30 (Cross-Scene UI) complete. Full cross-scene discovery experience deployed with visual indicators, progressive disclosure, and seamless navigation across datasets.

**Track C complete**: M32 (New Homepage) completes the information architecture track.

**Track D (Atomic Architecture)**: New track for data architecture transformation. Enables efficient cross-dataset features, token-efficient research workflow, and atomic entity management. Start with M34 to build migration infrastructure and testing framework.
