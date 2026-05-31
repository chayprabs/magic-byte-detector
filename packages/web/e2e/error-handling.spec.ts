import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

test("full server scan shows alert when API returns 500 with empty body", async ({ page }) => {
  await page.route("**/api/v1/scan", (route) =>
    route.fulfill({ status: 500, body: "" }),
  );

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "filesniff-"));
  const filePath = path.join(tmp, "scan.pdf");
  fs.writeFileSync(filePath, Buffer.from([0x25, 0x50, 0x44, 0x46]));

  await page.goto("/");
  await page.locator('input[type="file"]').first().setInputFiles(filePath);
  await expect(page.getByRole("article")).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Full server scan (ssdeep)", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("alert")).not.toBeEmpty();
});

test("batch upload shows alert when API returns 500 with empty body", async ({ page }) => {
  await page.route("**/api/v1/batch", (route) =>
    route.fulfill({ status: 500, body: "" }),
  );

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "filesniff-"));
  const zipPath = path.join(tmp, "empty.zip");
  fs.writeFileSync(zipPath, Buffer.from([0x50, 0x4b, 0x05, 0x06, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));

  await page.goto("/");
  await page.getByRole("tab", { name: /Batch ZIP/i }).click();
  await page.locator('input[type="file"][accept*="zip"]').setInputFiles(zipPath);
  await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("alert")).not.toBeEmpty();
});
