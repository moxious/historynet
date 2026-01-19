# M18: Mobile Adaptation

**Status**: ✅ Complete (2026-01-19)
**Track**: Post-MVP Polish
**Depends on**: M16 (Network Verification)

## Goal

Make Scenius fully usable on mobile devices (iPad and iPhone). Transform the desktop-first layout into a responsive, touch-friendly experience using mobile-native patterns like hamburger menus, bottom sheets, and drawers.

## Tasks

### 1. Responsive Header with Hamburger Menu

- [x] **MB1** - Create `MobileMenu` component (slide-in drawer from right)
- [x] **MB2** - Create `HamburgerButton` component (44×44px touch target)
- [x] **MB3** - Create `useMediaQuery` hook or CSS-based responsive logic
- [x] **MB4** - Update `Header.tsx` to conditionally render mobile vs desktop layout
- [x] **MB5** - Make search collapsible on mobile
- [x] **MB6** - Style mobile menu with theme support (light/dark)
- [x] **MB7** - Add slide-in animation for menu (transform + opacity)
- [x] **MB8** - Ensure menu is keyboard accessible (focus trap when open, Escape to close)
- [x] **MB9** - Test header at 375px, 390px, 430px widths

### 2. Safe Area Insets for iPhone

- [x] **MB10** - Add `viewport-fit=cover` to viewport meta tag in `index.html`
- [x] **MB11** - Define CSS custom properties for safe area insets in `index.css`
- [x] **MB12** - Apply safe area padding to Header component on mobile
- [x] **MB13** - Apply safe area padding to bottom sheet / action bar
- [x] **MB14** - Apply safe area padding to MobileMenu component
- [x] **MB15** - Test in iPhone simulator with notch and Dynamic Island
- [x] **MB16** - Test in landscape orientation for left/right safe areas

### 3. Touch-Friendly Target Sizes

- [x] **MB17-MB27** - Audit and update all interactive elements to 44px minimum

### 4. Bottom Sheet InfoboxPanel

- [x] **MB28** - Create `BottomSheet` component (reusable base component)
- [x] **MB29** - Implement snap point logic (hidden → peek → expanded)
- [x] **MB30** - Implement drag gesture recognition
- [x] **MB31** - Add smooth animation between snap points
- [x] **MB32** - Create `MobileInfoboxPanel` wrapper that uses BottomSheet
- [x] **MB33** - Integrate with selection state from `useGraph`
- [x] **MB34** - Add close button in sheet header
- [x] **MB35** - Update `MainLayout.tsx` to use `MobileInfoboxPanel` on mobile
- [x] **MB36** - Handle scroll within expanded sheet content
- [x] **MB37-MB38** - Test sheet behavior with various node types and edges

### 5. Filter Drawer Pattern

- [x] **MB39** - Create `Drawer` component (slide from left variant)
- [x] **MB40** - Update `FilterPanel` to support drawer mode on mobile
- [x] **MB41** - Add filter toggle button with badge indicator
- [x] **MB42** - Implement swipe-to-close gesture for drawer
- [x] **MB43** - Add prominent "Clear Filters" button in drawer footer
- [x] **MB44** - Show active filter count in toggle button badge
- [x] **MB45-MB47** - Test filter drawer behavior

### 6. Additional Mobile Optimizations

- [x] **MB48** - Update `#root` to use `100dvh` for iOS Safari
- [x] **MB49** - Add `-webkit-tap-highlight-color: transparent`
- [x] **MB50** - Add `touch-action: manipulation` to prevent double-tap zoom
- [x] **MB51** - Review and adjust font sizes for mobile readability

### 7. Testing & Verification

- [x] **MB52-MB61** - Test on various iPhone and iPad sizes
- [x] **MB62** - Build passes with no errors
- [x] **MB63** - No linter warnings in new/modified files
- [x] **MB64** - Update CHANGELOG.md with M18 completion notes

## New Components Created

- `useMediaQuery` hook - Reactive media query matching
- `MobileMenu` component - Slide-in drawer for mobile navigation
- `HamburgerButton` component - Animated hamburger/close icon
- `BottomSheet` component - Draggable bottom sheet with snap points
- `Drawer` component - Generic slide-in drawer (left/right)
- `MobileInfoboxPanel` component - Mobile-optimized info display

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Breakpoint | 640px | Standard mobile/tablet boundary |
| Menu direction | Right slide-in | Natural for right-handed users |
| Bottom sheet snap points | 100px peek, 60% expanded | Balanced content visibility |
| Touch targets | 44×44px minimum | Apple HIG compliance |
