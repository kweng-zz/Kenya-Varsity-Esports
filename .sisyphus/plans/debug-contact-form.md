# Debug Plan: Contact Form 400 Error

## TL;DR

> **Quick Summary**: The 400 error is caused by API validation, but the frontend currently hides the specific reason. This plan exposes the `details` field in the frontend console and UI to pinpoint the exact invalid field.
> 
> **Deliverables**:
> - Updated `src/components/ContactForm.tsx` to log and display validation details.
> - Verification of fix by reproducing error and seeing clear message.
> 
> **Estimated Effort**: Quick (1 wave)
> **Parallel Execution**: Sequential

---

## Context

### Original Request
User reports 400 Bad Request on `/api/contact` and suggested a middleman service. Investigation proved it's a local validation error hidden by the UI.

### Investigation Findings
- **Source**: `src/app/api/contact/route.ts` returns 400 when `validateInput` fails.
- **Payload**: Returns JSON `{ success: false, error: 'VALIDATION_ERROR', details: [...] }`.
- **Gap**: `src/components/ContactForm.tsx` currently only logs `result.error`. It ignores `result.details`.
- **Conclusion**: The frontend is swallowing the error explanation.

---

## Work Objectives

### Core Objective
Make validation errors visible so we can fix the input data.

### Concrete Deliverables
- `src/components/ContactForm.tsx`: Log `result.details` to console.error.
- `src/components/ContactForm.tsx`: Update UI error message to include details if available (e.g., "Validation Error: Message too short").

### Definition of Done
- [ ] Submitting invalid form triggers 400.
- [ ] Browser Console shows: `❌ Form submission failed: VALIDATION_ERROR [{field: "message", message: "..."}]`.
- [ ] UI displays more specific error message.

---

## Verification Strategy

### Automated Verification Only
> **ZERO USER INTERVENTION**: Verification must be fully automated.

**For Frontend/UI changes (using Playwright):**
Each task includes a Playwright script that:
1. Navigates to the contact page.
2. Fills invalid data (e.g., message too short).
3. Submits form.
4. Asserts that the console logs the validation details (using console message monitoring).
5. Asserts that the UI displays the error.

---

## TODOs

- [ ] 1. Update ContactForm.tsx to expose validation details

  **What to do**:
  - Modify `handleSubmit` to check for `result.details`.
  - Update `console.error` to include `result.details`.
  - Update `setErrorMessage` to append details if present (e.g., `result.details.map(d => d.message).join(', ')`).

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple frontend logic change in one file.
  - **Skills**: [`frontend-ui-ux`, `playwright`]

  **References**:
  - `src/app/api/contact/route.ts:68-73`: The API error response structure (`details` array).
  - `src/components/ContactForm.tsx:86-88`: Current error handling logic to modify.

  **Acceptance Criteria**:
  - [ ] `console.error` call includes `result.details`.
  - [ ] `errorMessage` state includes detail messages when available.

  **Automated Verification (Playwright)**:
  ```typescript
  // Agent executes via playwright skill:
  // 1. Monitor console messages.
  // 2. Go to contact page (assuming /contact or similar, will check routes).
  // 3. Fill name="Test", email="test@test.com", message="Short" (fail length).
  // 4. Click Submit.
  // 5. Assert console contains "Validation Error".
  // 6. Assert console contains "message must be at least 10 characters long".
  ```

  **Commit**: YES
  - Message: `fix(ui): display validation error details in contact form`
  - Files: `src/components/ContactForm.tsx`

---

## Success Criteria

### Verification Commands
```bash
# No direct CLI command since this is frontend behavior.
# Relies on Playwright verification script.
```

### Final Checklist
- [ ] User can see exactly why the request failed (e.g. "Message too short").
