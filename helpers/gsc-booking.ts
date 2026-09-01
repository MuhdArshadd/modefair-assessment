import { expect, Page } from "@playwright/test";

export async function openFirstMovieBooking(page: Page) {
  await page.goto("https://www.gsc.com.my/");

  await page
    .locator("#navbarCollapse")
    .getByRole("link", { name: "Movies" })
    .click();

  const movieCard = page
    .locator(".col-6.col-xl-3.col-lg-4")
    .filter({
      has: page.locator('img[alt*="movie poster"]'),
    })
    .first();

  await expect(movieCard).toBeVisible();

  const poster = movieCard
    .locator('img[alt*="movie poster"]')
    .first();

  const posterAlt = await poster.getAttribute("alt");

  if (!posterAlt) {
    throw new Error("Movie poster does not contain an alt attribute");
  }

  const movieName = posterAlt
    .replace(/\s*movie poster.*$/i, "")
    .trim();

  await movieCard.hover();

  const buyNowButton = movieCard.getByRole("link", {
    name: "Buy Now",
  });

  await expect(buyNowButton).toBeVisible();

  const bookingPagePromise = page.waitForEvent("popup");

  await buyNowButton.click();

  const bookingPage = await bookingPagePromise;

  return {
    bookingPage,
    movieName,
  };
}