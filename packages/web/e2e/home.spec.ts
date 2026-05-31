import { test, expect } from "@playwright/test";

test("home loads and sniffs hex PDF header", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner").getByText("FileSniff")).toBeVisible();
  await page.getByRole("tab", { name: /Hex/i }).click();
  await page.getByPlaceholder(/hex/i).fill("25 50 44 46 2D 31");
  await page.getByRole("button", { name: /Sniff bytes/i }).click();
  await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });
});

test("privacy, terms, and disclaimer links work", async ({ page }) => {
  const legal = page.getByRole("navigation", { name: "Legal" });
  await page.goto("/");
  await legal.getByRole("link", { name: "Privacy Policy" }).click();
  await expect(page.getByRole("heading", { name: /Privacy Policy/i })).toBeVisible();
  await page.goto("/");
  await legal.getByRole("link", { name: "Terms & Conditions" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Terms & Conditions" })).toBeVisible();
  await page.goto("/");
  await legal.getByRole("link", { name: "Disclaimer" }).click();
  await expect(page.getByRole("heading", { name: /Legal Disclaimer/i })).toBeVisible();
});

test("seo route loads", async ({ page }) => {
  await page.goto("/mime-detector");
  await expect(page.getByRole("heading", { name: /MIME Detector/i })).toBeVisible();
});
