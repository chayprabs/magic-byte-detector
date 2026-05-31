import { test, expect } from "@playwright/test";

test("URL scan then privacy toggle does not replace result with stale local sniff", async ({
  page,
}) => {
  await page.route("**/api/v1/scan/url", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        primary: {
          mime: "application/pdf",
          format: "PDF",
          family: "document",
          confidence: 0.99,
        },
        alternatives: [],
        extensionMismatch: false,
        mimeMismatch: false,
        ambiguity: false,
        riskFlags: [],
        hashes: { sha256: "abc" },
        routingHints: [],
        bytesRead: 100,
        privacyMode: false,
      }),
    });
  });

  await page.goto("/");
  await page.getByRole("tab", { name: /URL/i }).click();
  await page.getByPlaceholder(/example.com/i).fill("https://example.com/a.pdf");
  await page.getByRole("button", { name: /Fetch/i }).click();
  await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });

  await page.getByRole("tab", { name: /^File$/i }).click();
  await page.getByRole("checkbox").click();
  await page.getByRole("checkbox").click();
  await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible();
});

test("rapid double-click sample keeps last result stable", async ({ page }) => {
  await page.goto("/");
  const btn = page.getByRole("button", { name: "sample.pdf", exact: true });
  await btn.dblclick();
  await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });
});
