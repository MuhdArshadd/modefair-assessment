import { test, expect } from "@playwright/test";
import { openFirstMovieBooking } from "../helpers/gsc-booking";

test(
  "TC01 - selected movie is displayed correctly on booking page",
  async ({ page }) => {
    const { bookingPage, movieName } =
      await openFirstMovieBooking(page);

    const bookingMovieName = (
      await bookingPage
        .locator("h1.font-montBold")
        .innerText()
    ).trim();

    expect(bookingMovieName.toLowerCase()).toBe(
      movieName.toLowerCase()
    );
  }
);