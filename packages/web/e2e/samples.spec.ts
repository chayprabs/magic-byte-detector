import { test, expect } from "@playwright/test";

test("fake.jpg sample shows extension mismatch in result card", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "fake.jpg", exact: true }).click();
  const card = page.getByRole("article");
  await expect(card.getByText(/Extension does not match/i)).toBeVisible({ timeout: 10000 });
});

test("polyglot sample shows ambiguity warning in result card", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "polyglot.pdf.zip", exact: true }).click();
  const card = page.getByRole("article");
  await expect(card.getByText(/Multiple strong signatures/i)).toBeVisible({ timeout: 10000 });
});

test("macro.doc sample shows office macro risk badge", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "macro.doc", exact: true }).click();
  const card = page.getByRole("article");
  await expect(card.getByText("Office macros", { exact: true })).toBeVisible({ timeout: 10000 });
});

test("hex mode: 0x-prefixed hex detects PDF", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /Hex/i }).click();
  await page.getByPlaceholder(/hex/i).fill("0x25 0x50 0x44 0x46");
  await page.getByRole("button", { name: /Sniff bytes/i }).click();
  await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });
});
