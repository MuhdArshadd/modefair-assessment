# AI Usage Notes

AI assistance (ChatGPT) was used during this assessment as a development and debugging aid.

## How AI Was Used

- Helped interpret the assessment requirements and break them into suitable Playwright test scenarios.
- Assisted in designing three independently executable tests:
  - Movie selection validation
  - Past-date negative validation
  - Complete booking and summary validation
- Suggested Playwright/TypeScript code based on HTML elements, DOM inspection, and test errors provided during development.
- Helped troubleshoot selectors for dynamic elements such as:
  - Movies
  - Showtimes
  - Seats
  - Food and drinks
  - Confirmation buttons and popups
- Helped improve synchronization by using Playwright assertions, auto-waiting, and event-based waits instead of fixed delays.
- Suggested reusable helper functions for common booking navigation and authentication.
- Assisted with environment-variable handling so login credentials were not hardcoded into the test files.
- Helped review the final test structure, negative coverage, assertions, and README documentation.

## Development Process

The website was manually inspected during the assessment, and relevant HTML, test output, and errors were provided to AI for analysis.

AI-generated suggestions were reviewed, integrated, executed, and adjusted against the actual GSC website until the tests passed.

The final suite was verified both individually and as a complete test run using Playwright.