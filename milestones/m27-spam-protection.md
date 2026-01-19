# M27: Feedback Spam Protection

**Status**: 🔲 Future
**Track**: B (Infrastructure & Backend)
**Depends on**: M25 (User Feedback Feature)

## Goal

Add lightweight spam protection to the feedback form.

## Tasks

### Arithmetic Challenge

- [ ] **SP1** - Design challenge UI (e.g., "What is 3 + 5?")
- [ ] **SP2** - Generate random arithmetic challenges on form load
- [ ] **SP3** - Validate challenge answer in serverless function
- [ ] **SP4** - Ensure challenge is accessible (screen reader compatible, no CAPTCHA images)
- [ ] **SP5** - Add challenge bypass for automated testing (dev mode only)
- [ ] **SP6** - Update rate limits if spam is reduced
- [ ] **SP7** - Update CHANGELOG.md when complete

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Challenge type | Simple arithmetic | Accessible, no third-party dependencies |
| Difficulty | Addition/subtraction of single digits | Easy for humans, deters simple bots |
| Bypass | Dev mode only | Enable testing without solving challenges |
