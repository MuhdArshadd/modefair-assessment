import { test, expect } from "@playwright/test";
import { openFirstMovieBooking } from "../helpers/gsc-booking";

test(
  "TC02 - past dates are not available for booking",
  async ({ page }) => {
    const { bookingPage } =
      await openFirstMovieBooking(page);

    const dateButtons = bookingPage.locator(
      "button.date-option-container",
    );

    // Make sure booking dates are actually displayed.
    await expect(dateButtons.first()).toBeVisible();

    const dateIds = await dateButtons.evaluateAll((buttons) =>
      buttons.map((button) => button.id),
    );

    expect(dateIds.length).toBeGreaterThan(0);

    // Get today's date specifically in Malaysia timezone.
    // Example: "2026-09-01"
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kuala_Lumpur",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    console.log("Today's date:", today);
    console.log("Available booking dates:", dateIds);

    // Negative validation:
    // GSC must not provide any booking date earlier than today.
    for (const dateId of dateIds) {
      expect(
        dateId >= today,
        `Past date ${dateId} should not be available for booking`,
      ).toBeTruthy();
    }
  },
);