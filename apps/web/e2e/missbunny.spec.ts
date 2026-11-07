import { expect, test } from "@playwright/test";

test("missbunny opens the guest booking flows and the model dashboard", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { name: "missbunny" })).toBeVisible();
  await expect(page.getByText("不服务经纪公司")).toBeVisible();
  await expect(page.getByRole("link", { name: "晚棠 · PayID 订金" })).toBeVisible();
  await expect(page.getByRole("link", { name: "澄月 · 只留电话" })).toBeVisible();

  await page.getByRole("link", { name: "晚棠 · PayID 订金" }).click();
  await expect(page.getByRole("heading", { name: "预约 晚棠" })).toBeVisible();
  await expect(page.getByText("需要 PayID 订金（演示）")).toBeVisible();
  await expect(page.getByLabel("电话")).toBeVisible();

  await page.goto("/models/chengyue/book");
  await expect(page.getByRole("heading", { name: "预约 澄月" })).toBeVisible();
  await expect(page.getByText("留下电话即可预约（演示）")).toBeVisible();

  await page.goto("/demo");
  await page.getByRole("button", { name: "以模特查看引擎" }).click();
  await expect(page.getByRole("heading", { name: "订金" })).toBeVisible();
  await expect(page.getByText("PayID A$100（演示）")).toBeVisible();
  await expect(page.getByText("只用你资料里的内容回答，不编")).toBeVisible();
});
