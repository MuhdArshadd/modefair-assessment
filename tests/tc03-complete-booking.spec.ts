import { test, expect } from "@playwright/test";
import { loginToGSC } from "../helpers/gsc-auth";
import { openFirstMovieBooking } from "../helpers/gsc-booking";

test(
  "TC03 - complete booking selections are reflected correctly in summary",
  async ({ page }) => {
    // ---------------------------------
    // 1. Select movie
    // ---------------------------------

    const { bookingPage, movieName } =
      await openFirstMovieBooking(page);

    // ---------------------------------
    // 2. Select first available date
    // ---------------------------------

    const dateButton = bookingPage
      .locator("button.date-option-container")
      .first();

    await expect(dateButton).toBeVisible();
    await expect(dateButton).toBeEnabled();

    const dateParts = (await dateButton.innerText())
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);

    const [day, dateNumber, month] = dateParts;

    const expectedDateText =
      `${day.charAt(0) + day.slice(1).toLowerCase()} ` +
      `${Number(dateNumber)} ${month}`;

    console.log("Selected date:", expectedDateText);

    await dateButton.click();

    // ---------------------------------
    // 3. Select first available showtime
    // ---------------------------------

    const showtime = bookingPage
      .locator(".showtime-option-container")
      .first();

    await expect(showtime).toBeVisible();

    const selectedTime = (
      await showtime
        .locator(".showtime")
        .innerText()
    ).trim();

    const selectedShowType = (
      await showtime
        .locator(".show-type")
        .innerText()
    ).trim();

    const cinemaPanel = bookingPage
      .locator("mat-expansion-panel")
      .filter({
        has: showtime,
      })
      .first();

    const selectedCinema = (
      await cinemaPanel
        .locator("h3")
        .innerText()
    ).trim();

    console.log("Selected movie:", movieName);
    console.log("Selected cinema:", selectedCinema);
    console.log("Selected time:", selectedTime);
    console.log("Selected experience:", selectedShowType);

    await showtime.click();

    // ---------------------------------
    // 4. Login prerequisite
    // ---------------------------------

    await loginToGSC(bookingPage);

    const closePopup = bookingPage.locator(
      ".cursor-pointer.gsc-icon-sm",
    );

    await expect(closePopup).toBeVisible();
    await closePopup.click();

    // ---------------------------------
    // 5. Select first available seat
    // ---------------------------------

    const availableSeat = bookingPage
      .locator(
        '.seating-arrangement img:not([alt="occupied"])',
      )
      .first();

    await expect(availableSeat).toBeVisible();

    const selectedSeatType = (
      await availableSeat.getAttribute("alt")
    )?.trim();

    if (!selectedSeatType) {
      throw new Error(
        "Unable to determine selected seat type",
      );
    }

    await availableSeat.click();

    // ---------------------------------
    // 6. Capture ticket quantity
    // ---------------------------------

    const confirmSeats = bookingPage
      .locator(".btn-style")
      .filter({
        hasText:
          /Confirm\s*-\s*\d+\s+ticket\(s\)/,
      });

    await expect(confirmSeats).toBeVisible();

    const confirmationText = (
      await confirmSeats.innerText()
    ).trim();

    const ticketMatch =
      confirmationText.match(/(\d+)\s+ticket/);

    if (!ticketMatch) {
      throw new Error(
        `Unable to determine ticket quantity from: ${confirmationText}`,
      );
    }

    const ticketCount = Number(ticketMatch[1]);

    // ---------------------------------
    // Capture selected seat numbers
    // ---------------------------------

    const seatSelectionBar =
      bookingPage.locator(".btm-btn");

    await expect(seatSelectionBar).toBeVisible();

    const seatSelectionText =
      await seatSelectionBar.innerText();

    const selectedSeats =
      seatSelectionText.match(
        /\b[A-Z]\d{2}\b/g,
      ) ?? [];

    if (selectedSeats.length === 0) {
      throw new Error(
        `Unable to determine selected seat numbers from: ${seatSelectionText}`,
      );
    }

    console.log(
      "Selected seat type:",
      selectedSeatType,
    );
    console.log("Selected seats:", selectedSeats);
    console.log("Ticket count:", ticketCount);

    await confirmSeats.click();

    // ---------------------------------
    // 7. Select first available food
    // ---------------------------------

    const foodItem = bookingPage
      .locator(".menu-items")
      .first();

    await foodItem.scrollIntoViewIfNeeded();
    await expect(foodItem).toBeVisible();

    const foodImage =
      foodItem.locator("img.zoom-img");

    const selectedFood = (
      await foodImage.getAttribute("alt")
    )?.trim();

    if (!selectedFood) {
      throw new Error(
        "Unable to determine food item name",
      );
    }

    const foodPlusButton = foodItem
      .locator('img[alt="selection_icon"]')
      .last();

    for (let i = 0; i < ticketCount; i++) {
      await foodPlusButton.click();
    }

    console.log("Selected food:", selectedFood);
    console.log(
      "Food quantity:",
      ticketCount,
    );

    // ---------------------------------
    // 8. Select first available drink
    // ---------------------------------

    const drinkSection =
      bookingPage.locator("#drinkM");

    await drinkSection.scrollIntoViewIfNeeded();
    await expect(drinkSection).toBeVisible();

    const drinkItem = drinkSection
      .locator(".menu-items")
      .first();

    await expect(drinkItem).toBeVisible();

    const drinkImage =
      drinkItem.locator("img.zoom-img");

    const selectedDrink = (
      await drinkImage.getAttribute("alt")
    )?.trim();

    if (!selectedDrink) {
      throw new Error(
        "Unable to determine drink item name",
      );
    }

    const drinkPlusButton = drinkItem
      .locator('img[alt="selection_icon"]')
      .last();

    for (let i = 0; i < ticketCount; i++) {
      await drinkPlusButton.click();
    }

    console.log(
      "Selected drink:",
      selectedDrink,
    );
    console.log(
      "Drink quantity:",
      ticketCount,
    );

    // ---------------------------------
    // 9. Confirm food/drink selection
    // ---------------------------------

    const confirmButton = bookingPage
      .locator(".confirm-sec:visible")
      .locator("..");

    await expect(confirmButton).toBeVisible();

    await confirmButton.scrollIntoViewIfNeeded();
    await confirmButton.click();

    // ---------------------------------
    // 10. Close popup
    // ---------------------------------

    const summaryPopupClose = bookingPage
      .locator(
        'img[alt="close button"]:visible',
      )
      .first();

    await expect(
      summaryPopupClose,
    ).toBeVisible();

    await summaryPopupClose.click();

    // Wait until summary is ready
    await expect(
      bookingPage.getByText("Ticket(s)", {
        exact: true,
      }),
    ).toBeVisible();

    // ---------------------------------
    // 11. Validate booking summary
    // ---------------------------------

    const summary = bookingPage
      .locator("section.grow")
      .filter({
        hasText: "Ticket(s)",
      })
      .first();

    await expect(summary).toBeVisible();

    const escapeRegExp = (value: string) =>
      value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

    // Movie
    await expect(
      summary
        .getByText(
          new RegExp(
            `^${escapeRegExp(movieName)}$`,
            "i",
          ),
        )
        .first(),
    ).toBeVisible();

    // Cinema
    const summaryCinema = summary
      .getByText("Cinema", {
        exact: true,
      })
      .locator("..")
      .locator(".info");

    await expect(summaryCinema).toHaveText(
      new RegExp(
        escapeRegExp(selectedCinema),
        "i",
      ),
    );

    // Seats
    const summarySeat = summary
      .getByText("Seat(s)", {
        exact: true,
      })
      .locator("..")
      .locator(".info");

    await expect(summarySeat).toBeVisible();

    const summarySeats = (
      await summarySeat.innerText()
    )
      .split(",")
      .map((seat) => seat.trim());

    expect(summarySeats).toEqual(
      selectedSeats,
    );

    // Date + time
    const summaryTime = summary
      .getByText("Time", {
        exact: true,
      })
      .locator("..")
      .locator(".info");

    await expect(
      summaryTime,
    ).toContainText(expectedDateText);

    await expect(
      summaryTime,
    ).toContainText(selectedTime);

    // Experience
    await expect(summary).toContainText(
      new RegExp(
        escapeRegExp(selectedShowType),
        "i",
      ),
    );

    // Ticket type + quantity
    const ticketSection = summary
      .getByText("Ticket(s)", {
        exact: true,
      })
      .locator("..");

    const ticketText = (
      await ticketSection.innerText()
    )
      .replace(/\s+/g, "")
      .toLowerCase();

    const expectedTicketText =
      `${selectedSeatType}x${ticketCount}`
        .replace(/\s+/g, "")
        .toLowerCase();

    expect(ticketText).toContain(
      expectedTicketText,
    );

    // Food + drink
    const foodSection = summary
      .getByText("Food Selection", {
        exact: true,
      })
      .locator("..");

    await expect(foodSection).toContainText(
      `${selectedFood} x ${ticketCount}`,
    );

    await expect(foodSection).toContainText(
      `${selectedDrink} x ${ticketCount}`,
    );

    // Total must be present
    const totalSection = summary
      .getByText("Total", {
        exact: true,
      })
      .locator("..");

    await expect(totalSection).toContainText(
      /RM\s*\d+\.\d{2}/,
    );

    console.log(
      "Summary validation completed successfully",
    );
  },
);