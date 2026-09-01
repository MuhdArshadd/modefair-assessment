import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  testDir: './tests',

  /*
   * Keep tests sequential for this assessment.
   * They are independently executable, but running several booking
   * flows simultaneously against the live GSC site could cause
   * session/state conflicts.
   */
  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  /*
   * One worker prevents our independent tests from interfering
   * with each other on the live booking website.
   */
  workers: 1,

  reporter: 'html',

  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});