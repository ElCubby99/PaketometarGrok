import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const outDir = "/opt/cursor/artifacts/paketometar";

const routes = [
  { path: "/", name: "home" },
  { path: "/map", name: "map" },
  { path: "/report", name: "report" },
  { path: "/carriers/gls", name: "carrier-gls" },
  { path: "/escalations", name: "escalations" },
  { path: "/about", name: "about" },
];

async function settleMap(page: Page) {
  if ((await page.locator(".map-frame").count()) === 0) return;
  await page.locator(".leaflet-container").waitFor({ timeout: 15_000 });
  await page.waitForFunction(
    () => {
      const tiles = [...document.querySelectorAll("img.leaflet-tile")];
      return tiles.some((tile) => {
        const image = tile as HTMLImageElement;
        return image.complete && image.naturalWidth > 0;
      });
    },
    { timeout: 20_000 },
  );
  await page.waitForTimeout(250);
}

test.beforeAll(async () => {
  await mkdir(outDir, { recursive: true });
});

for (const route of routes) {
  test(`desktop ${route.name}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route.path);
    await settleMap(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({
      path: `${outDir}/desktop-${route.name}.png`,
      fullPage: true,
    });
  });

  test(`mobile ${route.name}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route.path);
    await settleMap(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({
      path: `${outDir}/mobile-${route.name}.png`,
      fullPage: true,
    });
  });
}

test("keyboard focus ring on the brand", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await settleMap(page);
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Paketometar" })).toBeFocused();
  await page.screenshot({ path: `${outDir}/focus-brand.png` });
});

test("map filter chip keeps a visible focus ring", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/map");
  await settleMap(page);
  const chip = page.getByRole("button", { name: "Kašnjenje", exact: true });
  await chip.focus();
  await expect(chip).toBeFocused();
  await page.screenshot({ path: `${outDir}/focus-filter-chip.png`, fullPage: false });
});

test("reduced motion disables the live pulse", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await settleMap(page);
  const duration = await page.locator(".live-dot").first().evaluate((element) => {
    return getComputedStyle(element).animationDuration;
  });
  const durationMs = await page.locator(".live-dot").first().evaluate((element) => {
    const raw = getComputedStyle(element).animationDuration;
    const value = Number.parseFloat(raw);
    return raw.endsWith("ms") ? value : value * 1000;
  });
  expect(durationMs, `animation-duration was ${duration}`).toBeLessThan(1);
  await expect(page.locator(".leaflet-container")).toHaveAttribute("data-zoom-animation", "off");
  await page.screenshot({ path: `${outDir}/reduced-motion-home.png`, fullPage: true });
});

test("map filters change the aggregate", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/map");
  await settleMap(page);
  await expect(page.locator(".leaflet-control-zoom-in")).toHaveAttribute("title", "Povećaj");
  await expect(page.locator(".leaflet-control-attribution")).toContainText("OpenStreetMap");
  const sample = page.locator(".instrument-chrome .data");
  await expect(sample).toContainText("4");
  await page.getByRole("button", { name: "Kašnjenje", exact: true }).click();
  await expect(sample).not.toContainText("4\u00A0102");
  await page.locator("#area-filter").selectOption("split");
  await expect(page.locator(".instrument-chrome")).toContainText("Split");
  await page.screenshot({ path: `${outDir}/desktop-map-filtered.png`, fullPage: true });
});

test("report consents stay independent", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/report");
  await expect(page.locator("legend", { hasText: "Kako je prošla dostava?" })).toBeVisible();
  await page.getByRole("button", { name: "Bilo je problema" }).click();
  await page.locator("#btn-next").click();
  await expect(page.locator("legend", { hasText: "Prijevoznik i trajanje" })).toBeVisible();
  await page.locator("#carrier").selectOption("gls");
  await page.locator("#area").fill("Zagreb, Trešnjevka");
  await page.locator("#btn-next").click();
  await expect(page.locator("legend", { hasText: "Detalji iskustva" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Kašnjenje", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator("#btn-next").click();
  await expect(page.locator("legend", { hasText: "Kontakt (opcionalno)" })).toBeVisible();

  const edit = page.locator("input[name=consent_edit]");
  const bcc = page.locator("input[name=consent_bcc]");
  await edit.check();
  await expect(bcc).not.toBeChecked();
  await bcc.check();
  await expect(edit).toBeChecked();
  await edit.uncheck();
  await expect(edit).not.toBeChecked();
  await expect(bcc).toBeChecked();
  await page.screenshot({ path: `${outDir}/desktop-report-step4-bcc-only.png`, fullPage: true });

  await page.locator("#btn-prev").click();
  await expect(page.locator("legend", { hasText: "Detalji iskustva" })).toBeVisible();
  await page.locator("#btn-next").click();
  await expect(bcc).toBeChecked();
  await expect(edit).not.toBeChecked();

  await page.locator("#btn-submit").click();
  await expect(page.locator("[data-field=consent_edit]")).toHaveAttribute("data-value", "no");
  await expect(page.locator("[data-field=consent_bcc]")).toHaveAttribute("data-value", "yes");
  await expect(page.getByText("Podaci nisu poslani")).toBeVisible();
  await page.screenshot({ path: `${outDir}/desktop-report-receipt.png`, fullPage: true });
});

test("carrier dossier gives the reply equal weight", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/carriers/gls");
  const metrics = page.locator("section", { has: page.getByRole("heading", { name: "Mjerne ploče" }) });
  const reply = page.locator("section", { has: page.getByRole("heading", { name: "Pravo odgovora tvrtke" }) });
  await expect(metrics).toBeVisible();
  await expect(reply).toBeVisible();
  await expect(page.getByText("prijavljeno / navodno, neprovjereno").first()).toBeVisible();
  const boxes = await page.evaluate(() => {
    const sections = [...document.querySelectorAll(".equal-blocks > section")];
    return sections.map((section) => {
      const rect = section.getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    });
  });
  expect(boxes).toHaveLength(2);
  expect(Math.abs(boxes[0].width - boxes[1].width)).toBeLessThanOrEqual(2);
  expect(Math.abs(boxes[0].height - boxes[1].height)).toBeLessThanOrEqual(2);
});
