# M25: User Feedback Feature

**Status**: 🔲 Future
**Track**: B (Infrastructure & Backend)
**Depends on**: M24 (Vercel Migration) ✅

## Goal

Allow users to submit feedback about graph data without requiring a GitHub account. Feedback creates GitHub issues for the Phase R research workflow.

**Design**: Prompt users with general questions ("What's missing?", "What's incorrect?") rather than graph-specific terminology. Capture full URL as context. All feedback is public (users are informed).

**Integration**: Feedback ties to Phase R in `research/RESEARCHING_NETWORKS.md`—submitted issues become input for agents doing network research/amendments.

## Tasks

### GitHub Setup

- [ ] **FB1** - Create GitHub PAT (Personal Access Token) with `repo` scope for issue creation
- [ ] **FB2** - Add `GITHUB_PAT` environment variable in Vercel dashboard
- [ ] **FB3** - Create GitHub issue template in `.github/ISSUE_TEMPLATE/feedback.md`

**Issue Template**:
```markdown
---
name: User Feedback
about: Feedback submitted via the application
labels: feedback
---

## Dataset

{dataset_name}

## Feedback

{user_feedback}

## Evidence Provided

{evidence_urls_and_citations}

## Additional Info

{additional_context}

---
*Submitted via Scenius feedback form*
*Context URL: {full_url}*
```

### Feedback Form (Frontend)

- [ ] **FB4** - Create `FeedbackSubmission` TypeScript interface in `src/types/`
  ```typescript
  interface FeedbackSubmission {
    dataset: string;
    feedback: string;        // Main feedback text
    evidence?: string;       // URLs, citations, narrative
    additionalInfo?: string; // Extra context
    email?: string;          // Optional contact (kept private)
    contextUrl: string;      // Full URL when form was opened
  }
  ```
- [ ] **FB5** - Create `FeedbackForm` component (modal) with fields:
  - Dataset name (auto-populated, read-only display)
  - "What's missing, incorrect, or should be changed?" (required, textarea)
  - "Evidence: links, citations, or explanation" (optional, textarea)
  - "Anything else?" (optional, textarea)
  - "Email (optional, kept private)" (optional, email input)
  - Notice: "Your feedback will be posted publicly as a GitHub issue for review."
- [ ] **FB6** - Add form validation:
  - Feedback field required and non-empty
  - Email format validation (if provided)
- [ ] **FB7** - Auto-capture context:
  - Current URL (includes dataset, selected item, view state)
  - Dataset name extracted from URL
- [ ] **FB8** - Create `FeedbackButton` component labeled "Feedback/Correction"
- [ ] **FB9** - Place `FeedbackButton` in Header component
- [ ] **FB10** - Place `FeedbackButton` in InfoboxPanel component
- [ ] **FB11** - Style feedback form modal with light/dark theme support
- [ ] **FB12** - Add loading state during submission
- [ ] **FB13** - Add success state showing:
  - Success message
  - Link to the created GitHub issue
- [ ] **FB14** - Add error state with user-friendly messages

### Serverless API Endpoint

- [ ] **FB15** - Create `/api/submit-feedback.ts` serverless function
- [ ] **FB16** - Implement request validation:
  - POST method only
  - Content-Type: application/json
  - Required fields present (dataset, feedback, contextUrl)
- [ ] **FB17** - Implement input sanitization:
  - Strip HTML tags from all text fields
  - Validate URLs in evidence field (if URLs detected)
  - Truncate excessively long inputs
- [ ] **FB18** - Format feedback into GitHub issue body (markdown):
  - Use issue template structure
  - Apply labels: `feedback`, `dataset:{dataset_name}`
  - Do NOT include email or IP in issue body (privacy)
- [ ] **FB19** - Call GitHub API to create issue:
  - POST to `https://api.github.com/repos/moxious/historynet/issues`
  - Use GITHUB_PAT for authentication
  - Return created issue URL
- [ ] **FB20** - Add rate limiting: 5 submissions per IP per hour
  - Use Vercel KV or in-memory tracking
  - Return 429 status if exceeded
- [ ] **FB21** - Log submission metadata privately (IP, email if provided) for abuse tracking
  - Do NOT expose in GitHub issue

### Integration & Testing

- [ ] **FB22** - Connect frontend form to `/api/submit-feedback` endpoint
- [ ] **FB23** - Test end-to-end: form submission → GitHub issue created
- [ ] **FB24** - Verify issue has correct labels (`feedback`, dataset label)
- [ ] **FB25** - Verify issue body is formatted correctly and readable
- [ ] **FB26** - Verify email and IP are NOT in the public issue
- [ ] **FB27** - Test rate limiting: submit 6 times, verify 6th is rejected
- [ ] **FB28** - Test error handling: API down, validation failures
- [ ] **FB29** - Test from different pages:
  - Main graph view (general feedback)
  - Node detail page (context captured)
  - Edge detail page (context captured)
- [ ] **FB30** - Test on mobile (bottom sheet or modal behavior)

### Documentation & Polish

- [ ] **FB31** - Add help text near form explaining:
  - What feedback is used for (improving network data)
  - That submissions are public
  - How to provide good evidence
- [ ] **FB32** - Document API endpoint in code (JSDoc or README)
- [ ] **FB33** - Update CHANGELOG.md when milestone complete

## Privacy Considerations

- User IP addresses and emails are **kept private** (not included in public GitHub issues)
- All feedback content is public (users are informed before submission)
- Rate limiting prevents abuse
