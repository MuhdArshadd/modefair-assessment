# GSC Playwright UI Automation

A small Playwright UI automation project for the Golden Screen Cinemas (GSC) movie booking flow.

The project covers movie selection, booking date validation, showtime selection, authentication, seat selection, food and drink selection, and booking-summary validation.

The automation intentionally stops at the **booking review / summary stage** and does **not proceed with payment or complete an actual purchase**.

---

## Technology

- Playwright
- TypeScript
- Node.js
- dotenv

---

## Project Structure

```
assessment/
├── helpers/
│   ├── gsc-auth.ts
│   └── gsc-booking.ts
│
├── tests/
│   ├── tc01-movie-selection.spec.ts
│   ├── tc02-past-date.spec.ts
│   └── tc03-complete-booking.spec.ts
│
├── .env
├── .gitignore
├── playwright.config.ts
├── package.json
└── package-lock.json
```

### Helper modules

`gsc-booking.ts`

Contains reusable navigation logic for:

- Opening the GSC website
- Navigating to the Movies page
- Dynamically selecting the first available movie
- Capturing the selected movie name
- Opening the movie booking page

`gsc-auth.ts`

Contains reusable authentication logic using credentials loaded from environment variables.

---

# Test Scenarios

The solution contains **three independently executable Playwright test scenarios**.

## TC01 — Movie Selection Validation

**File**

tests/tc01-movie-selection.spec.ts

### Objective

Verify that a movie selected from the GSC Movies page is correctly displayed on its booking page.

### Flow

1. Open the GSC website.
2. Navigate to Movies.
3. Dynamically select the first available movie.
4. Capture the movie name.
5. Click **Buy Now**.
6. Open the booking page.
7. Verify that the movie displayed on the booking page matches the selected movie.

### Type

Positive functional UI test.

---

## TC02 — Past Date Validation

**File**

tests/tc02-past-date.spec.ts

### Objective

Verify that past dates are not exposed as valid booking dates.

### Flow

1. Open a movie booking page.
2. Retrieve all available booking-date options.
3. Determine the current date using the `Asia/Kuala_Lumpur` timezone.
4. Verify that every displayed booking date is today or later.

### Type

Negative UI validation.

This scenario provides the basic negative test coverage required by ensuring that invalid historical booking dates cannot be selected.

---

## TC03 — Complete Booking and Summary Validation

**File**

tests/tc03-complete-booking.spec.ts

### Objective

Verify that selections made throughout a valid booking flow are correctly reflected in the final booking summary.

### Flow

1. Dynamically select a movie.
2. Select the first available booking date.
3. Select an available showtime.
4. Capture the selected:
   - Movie
   - Cinema
   - Showtime
   - Experience
5. Authenticate using the configured GSC account.
6. Select the first available seat.
7. Capture:
   - Seat type
   - Seat number(s)
   - Ticket quantity
8. Select food according to the ticket quantity.
9. Select drinks according to the ticket quantity.
10. Confirm the selections.
11. Close the confirmation popup.
12. Reach the booking review / summary.
13. Validate that all selected booking information is correctly reflected.

### Summary validations

The test verifies:

- Movie
- Cinema
- Booking date
- Showtime
- Cinema experience
- Seat number(s)
- Seat type
- Ticket quantity
- Food selection
- Drink selection
- Presence of the booking total

### Type

End-to-end UI test and booking-summary validation scenario.

The test intentionally ends at the booking review and does **not proceed to payment**.

---

# Prerequisites

Ensure the following are installed:

- Node.js
- npm

Check the installed versions:

node --version
npm --version

---

# Installation

## 1. Install project dependencies

From the project directory:

npm install

## 2. Install Playwright browsers

npx playwright install

If only Chromium is required:

npx playwright install chromium

---

# Environment Configuration

Authentication credentials are stored using environment variables rather than being hardcoded into the tests.

Create a `.env` file in the project root:

GSC_PHONE=your_phone_number
GSC_PASSWORD=your_password

The `.env` file should not be committed to source control.

Example `.gitignore`:

gitignore:
node_modules/
playwright-report/
test-results/
.env

---

# Running the Tests

## Run all tests

npx playwright test --project=chromium

Expected result:

3 passed

---

## Run TC01 independently

npx playwright test tc01-movie-selection.spec.ts --project=chromium

---

## Run TC02 independently

npx playwright test tc02-past-date.spec.ts --project=chromium

---

## Run TC03 independently

npx playwright test tc03-complete-booking.spec.ts --project=chromium

---

# Running Tests in Headed Mode

To observe the browser while the automation executes:

## All tests

npx playwright test --project=chromium --headed

## Individual test

Example:

npx playwright test tc03-complete-booking.spec.ts --project=chromium --headed

---

# Playwright HTML Report

After executing the tests, open the Playwright HTML report with:

npx playwright show-report

The report provides information such as:

- Passed / failed test status
- Test execution duration
- Failure details
- Screenshots or traces when configured

> Note: Test reports and traces may contain information captured during test execution. Authentication credentials should remain protected and reports containing sensitive information should not be shared unnecessarily.

---

# Automation Design

## Independent Test Execution

Each test is independently executable and establishes its own browser state.

Tests do not depend on another test running beforehand.

For example:

TC01 does not prepare TC02
TC02 does not prepare TC03
TC03 does not depend on TC01 or TC02

Reusable navigation logic is shared through helper functions instead of sharing test state.

---

## Dynamic Test Data

The automation avoids hardcoding values that may change between executions.

Examples include dynamically retrieving:

- Movie name
- Available booking date
- Showtime
- Cinema
- Experience
- Seat type
- Seat number
- Ticket quantity
- Food item
- Drink item

This makes the tests less dependent on a specific movie, seat, showtime, or concession item.

---

## Reusable Code

Common functionality has been extracted into reusable helpers.

helpers/gsc-booking.ts
helpers/gsc-auth.ts

A full Page Object Model was intentionally not introduced because this is a small automation exercise. Lightweight reusable helpers provide sufficient separation while keeping the solution simple.

---

## Selector Strategy

The automation prioritizes meaningful Playwright selectors where available, including:

- `getByRole()`
- `getByText()`
- Accessible image `alt` attributes
- Scoped locators
- Stable application element IDs
- CSS selectors where no semantic locator is available

The solution avoids large or brittle XPath expressions.

Selections such as the movie, showtime, seat, food, and drink are performed dynamically instead of relying on hardcoded content.

---

## Waiting Strategy

The automation uses Playwright's built-in auto-waiting and web-first assertions.

Examples include:

await expect(locator).toBeVisible();
await expect(locator).toBeEnabled();
await page.waitForEvent("popup");
await locator.scrollIntoViewIfNeeded();

The tests do not use unnecessary fixed delays such as:

page.waitForTimeout(...)

Instead, execution waits for actual UI states or events.

---

# Test Coverage Summary

| Test | Scenario                                                     | Type              |
|------|--------------------------------------------------------------|-------------------|
| TC01 | Selected movie is correctly displayed on booking page        | Positive          |
| TC02 | Past dates are not available for booking                     | Negative          |
| TC03 | Complete booking selections are reflected in booking summary | E2E / Validation  |

The suite therefore provides:

- Three independently executable automated UI scenarios
- Positive functional coverage
- Basic negative UI coverage
- End-to-end booking-flow coverage
- Booking-summary validation
- Reusable helper functions
- Dynamic test-data selection
- Playwright auto-waiting
- No unnecessary fixed waits

---

# Scope

### Included

Movie selection
→ Date selection
→ Showtime / experience selection
→ Login
→ Seat selection
→ Food and drink selection
→ Booking review
→ Summary validation

### Excluded

Payment information
Payment submission
Actual purchase / transaction

No real payment is performed by the automation.

---

# Notes

The GSC website is a live application. Available movies, cinemas, showtimes, seats, food items, and drinks may change over time.

The automation therefore uses dynamic selection where practical to reduce dependency on specific live test data.