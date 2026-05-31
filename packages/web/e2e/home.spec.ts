import { test, expect } from "@playwright/test";

test("home loads and sniffs hex PDF header", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner").getByText("FileSniff")).toBeVisible();
  await page.getByRole("button", { name: /Hex/i }).click();
  await page.getByPlaceholder(/hex/i).fill("25 50 44 46 2D 31");
  await page.getByRole("button", { name: /Sniff bytes/i }).click();
  await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });
});

test("privacy and terms links work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Privacy/i }).click();
  await expect(page.getByRole("heading", { name: /Privacy Policy/i })).toBeVisible();
  await page.goto("/");
  await page.getByRole("link", { name: /Terms/i }).click();
  await expect(page.getByRole("heading", { name: /Terms/i })).toBeVisible();
});

test("seo route loads", async ({ page }) => {
  await page.goto("/mime-detector");
  await expect(page.getByRole("heading", { name: /MIME Detector/i })).toBeVisible();
});
