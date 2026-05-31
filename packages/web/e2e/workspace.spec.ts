import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

const SEO_PATHS = [
  "/",
  "/what-is-this-file",
  "/mime-detector",
  "/magic-byte-checker",
  "/office-macro-detect",
  "/polyglot-file-check",
];

const SAMPLE_BUTTONS = [
  "sample.pdf",
  "sample.zip",
  "polyglot.pdf.zip",
  "macro.doc",
  "fake.jpg",
  "random.bin",
];

test.describe("SniffWorkspace", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  for (const sample of SAMPLE_BUTTONS) {
    test(`sample button ${sample} shows result card`, async ({ page }) => {
      await page.getByRole("button", { name: sample, exact: true }).click();
      await expect(page.getByRole("article")).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
      await expect(page.getByText(/confidence/i)).toBeVisible();
      await expect(page.getByText(/SHA-256:/i)).toBeVisible();
    });
  }

  test("hex mode: spaced hex detects PDF", async ({ page }) => {
    await page.getByRole("tab", { name: /Hex/i }).click();
    await page.getByPlaceholder(/hex/i).fill("25 50 44 46 2D 31");
    await page.getByRole("button", { name: /Sniff bytes/i }).click();
    await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });
  });

  test("hex mode: compact hex detects PDF", async ({ page }) => {
    await page.getByRole("tab", { name: /Hex/i }).click();
    await page.getByPlaceholder(/hex/i).fill("255044462D31");
    await page.getByRole("button", { name: /Sniff bytes/i }).click();
    await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });
  });

  test("hex mode: base64 detects PDF", async ({ page }) => {
    await page.getByRole("tab", { name: /Hex/i }).click();
    await page.getByPlaceholder(/hex/i).fill("JVBERi0x");
    await page.getByRole("button", { name: /Sniff bytes/i }).click();
    await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });
  });

  test("file upload via choose file", async ({ page }) => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "filesniff-"));
    const filePath = path.join(tmp, "test.pdf");
    fs.writeFileSync(filePath, Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]));

    await page.locator('input[type="file"]').first().setInputFiles(filePath);
    await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/File: test\.pdf/i)).toBeVisible();
  });

  test("choose file button opens picker", async ({ page }) => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "filesniff-"));
    const filePath = path.join(tmp, "drop.pdf");
    fs.writeFileSync(filePath, Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]));

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Choose file" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });
  });

  test("privacy toggle re-sniffs uploaded file", async ({ page }) => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "filesniff-"));
    const filePath = path.join(tmp, "big.bin");
    fs.writeFileSync(filePath, Buffer.alloc(8192, 0x25));

    await page.locator('input[type="file"]').first().setInputFiles(filePath);
    await expect(page.getByRole("article")).toBeVisible({ timeout: 10000 });
    const readBefore = await page.getByText(/Read \d+ bytes/).textContent();

    const privacy = page.getByRole("checkbox");
    await privacy.uncheck();
    await expect(page.getByText(/Read \d+ bytes/)).not.toHaveText(readBefore ?? "", { timeout: 10000 });
    await expect(page.getByText(/Read 8192 bytes/)).toBeVisible({ timeout: 10000 });

    await privacy.check();
    await expect(page.getByText(/Read 4096 bytes/)).toBeVisible({ timeout: 10000 });
  });

  test("privacy toggle re-sniffs after hex paste", async ({ page }) => {
    await page.getByRole("tab", { name: /Hex/i }).click();
    const pairs = Array.from({ length: 5000 }, () => "ff").join(" ");
    await page.getByPlaceholder(/hex/i).fill(pairs);
    await page.getByRole("button", { name: /Sniff bytes/i }).click();
    await expect(page.getByText(/Read 4096 bytes/)).toBeVisible({ timeout: 10000 });
    await page.getByRole("checkbox").uncheck();
    await expect(page.getByText(/Read 5000 bytes/)).toBeVisible({ timeout: 10000 });
  });

  test("full server scan button appears after file upload", async ({ page }) => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "filesniff-"));
    const filePath = path.join(tmp, "scan.pdf");
    fs.writeFileSync(filePath, Buffer.from([0x25, 0x50, 0x44, 0x46]));

    await page.locator('input[type="file"]').first().setInputFiles(filePath);
    await expect(page.getByRole("button", { name: "Full server scan (ssdeep)", exact: true })).toBeVisible();
  });

  test("batch tab shows upload UI", async ({ page }) => {
    await page.getByRole("tab", { name: /Batch ZIP/i }).click();
    await expect(page.getByText(/Upload a ZIP/i)).toBeVisible();
    await expect(page.locator('input[type="file"][accept*="zip"]')).toBeVisible();
  });

  test("export JSON and CSV triggers download", async ({ page }) => {
    await page.getByRole("button", { name: "sample.pdf", exact: true }).click();
    await expect(page.getByRole("article")).toBeVisible({ timeout: 10000 });

    const jsonDl = page.waitForEvent("download");
    await page.getByRole("button", { name: "JSON", exact: true }).click();
    const json = await jsonDl;
    expect(json.suggestedFilename()).toMatch(/-result\.json$/);

    const csvDl = page.waitForEvent("download");
    await page.getByRole("button", { name: "CSV", exact: true }).click();
    const csv = await csvDl;
    expect(csv.suggestedFilename()).toMatch(/-result\.csv$/);
  });

  test("result card tabs: result, hex, json", async ({ page }) => {
    await page.getByRole("button", { name: "sample.pdf", exact: true }).click();
    await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "Hex", exact: true }).click();
    await expect(page.getByText(/25 50 44 46/i)).toBeVisible();

    await page.getByRole("button", { name: "Raw JSON", exact: true }).click();
    await expect(page.locator("pre").filter({ hasText: /"primary"/ })).toBeVisible();

    await page.getByRole("button", { name: "Result", exact: true }).click();
    await expect(page.getByRole("heading", { name: "PDF" })).toBeVisible();
  });
});

test.describe("SEO routes", () => {
  for (const p of SEO_PATHS) {
    test(`${p} loads workspace with samples`, async ({ page }) => {
      await page.goto(p);
      await expect(page.getByText(/Try a sample/i)).toBeVisible();
      await page.getByRole("button", { name: "sample.pdf", exact: true }).click();
      await expect(page.getByRole("article")).toBeVisible({ timeout: 10000 });
    });
  }
});
