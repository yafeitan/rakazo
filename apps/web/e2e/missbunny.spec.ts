import { expect, test } from "@playwright/test";

test("missbunny opens the guest booking flows and the model dashboard", async ({ page }) => {
  await page.goto("/home");
  await expect(page.getByRole("heading", { name: "你睡觉，AI 也在帮你干活" })).toBeVisible();
  await expect(page.getByText("开张不要钱，看店要钱。")).toBeVisible();
  await expect(
    page.getByText(
      "AI 员工搭建和工具免费，每月 A$300–600 只付看店：回客人、筛单、收定金、记账，不乱说。",
    ),
  ).toBeVisible();
  await expect(page.getByText("Miss Bunny OS").first()).toBeVisible();
  await expect(page.getByText("运营系统")).toBeVisible();
  await expect(page.getByText("需要你确认")).toBeVisible();
  await expect(page.getByText("我们不经手。")).toBeVisible();
  await expect(page.getByText("大约 A$300–600。")).toBeVisible();
  await expect(page.getByText("工具费")).toHaveCount(0);
  await expect(page.getByLabel("艺名")).toBeVisible();
  await expect(page.getByRole("button", { name: "继续" })).toHaveCount(0);

  await page.goto("/demo");
  await expect(page.getByText("AI 员工要每天有稳定的询问。")).toBeVisible();
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
  await expect(page.getByLabel("艺名")).toBeVisible();
  await expect(page.getByText("工具费")).toHaveCount(0);
});

test("onboarding opens a scripted model desk and the public profile hides the deposit", async ({
  page,
}) => {
  await page.goto("/models/wantang");
  await expect(page.getByRole("heading", { name: "晚棠" })).toBeVisible();
  await expect(page.getByText("私人晚宴陪同")).toBeVisible();
  await expect(page.getByText("PayID 订金")).toHaveCount(0);

  await page.goto("/home");
  await page.getByLabel("艺名").fill("晚棠");
  await page.getByLabel("城市").fill("墨尔本");
  await page.getByLabel("可约").fill("周四晚上");
  await page.getByLabel("安排").fill("私人晚宴");
  await page.getByLabel("收款方式").fill("PayID");
  await expect(page).toHaveURL(/\/home|\/$/);
  await page.getByRole("button", { name: "绑定 Catch（演示）" }).click();
  await page.getByRole("button", { name: "绑定 X（演示）" }).click();
  await expect(page).toHaveURL(/\/studio\/ops/);
  await expect(page.getByText("https://mrlootbox.com/wantang")).toBeVisible();
  await expect(page.getByRole("heading", { name: "运营" })).toBeVisible();
  await expect(page.getByText("现在有空吗？想约一次。")).toBeVisible();
  await expect(page.getByText("周四晚上可以。私人晚宴。")).toBeVisible();
  await expect(page.getByText("待付订金")).toBeVisible();
  await page.getByRole("button", { name: "已收款" }).click();
  await expect(page.getByText("0400 000 222（演示）")).toBeVisible();
  await expect(page.getByText("账本记入 PayID 订金 A$100（演示）")).toBeVisible();
  await expect(page.getByText("A$100").first()).toBeVisible();
});

test("missbunny english covers the homepage, join flow, demo, and dashboard", async ({ page }) => {
  await page.goto("/home?lang=en");
  await expect(
    page.getByRole("heading", { name: "You sleep. The AI keeps working." }),
  ).toBeVisible();
  await expect(
    page.getByText("Opening shop is free. Minding the shop is what you pay for."),
  ).toBeVisible();
  await expect(page.getByText("pays only for minding the shop")).toBeVisible();
  await expect(page.getByText("Operating system")).toBeVisible();
  await expect(page.getByText("About A$300–600.")).toBeVisible();
  await expect(page.getByText("We never hold it.")).toBeVisible();
  await expect(page.getByRole("button", { name: "EN", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue" })).toHaveCount(0);

  await page.goto("/demo?lang=en");
  await expect(
    page.getByText("The AI employee needs a steady stream of inquiries every day."),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "missbunny" })).toBeVisible();
  await expect(page.getByText("not agencies")).toBeVisible();
  await expect(page.getByRole("link", { name: "Wantang · PayID deposit" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Chengyue · phone only" })).toBeVisible();
  await page.getByRole("button", { name: "Open the engine as the model" }).click();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByText("工具费")).toHaveCount(0);

  await page.goto("/models/wantang?lang=en");
  await expect(page.getByRole("heading", { name: "Wantang" })).toBeVisible();
  await expect(page.getByText("Melbourne · Chinese · English")).toBeVisible();
  await expect(page.getByText("Private dinner company")).toBeVisible();
  await expect(page.getByText("PayID 订金")).toHaveCount(0);

  await page.goto("/home?lang=en");
  await page.getByLabel("Name").fill("Wantang");
  await page.getByLabel("City").fill("Melbourne");
  await page.getByLabel("Hours").fill("Thursday evening");
  await page.getByLabel("Plans").fill("Private dinner");
  await page.getByLabel("How you get paid").fill("PayID");
  await expect(page).toHaveURL(/lang=en/);
  await page.getByRole("button", { name: "Connect Ivy (demo)" }).click();
  await page.getByRole("button", { name: "Connect X (demo)" }).click();
  await expect(page).toHaveURL(/\/studio\/ops/);
  await expect(page.getByText("https://mrlootbox.com/wantang?lang=en")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Operations" })).toBeVisible();
  await expect(page.getByText("Thursday evening works.")).toBeVisible();
  await expect(page.getByText("Deposit pending")).toBeVisible();
  await page.getByRole("button", { name: "Payment received" }).click();
  await expect(page.getByText("0400 000 222 (demo)")).toBeVisible();
  await expect(page.getByText("Ledger records the PayID deposit A$100 (demo)")).toBeVisible();
  await page.getByRole("button", { name: "Top up" }).click();
  await expect(page.getByRole("heading", { name: "Top up credits" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pay A$200 now" })).toBeEnabled();
  await expect(page.getByText("Total due")).toBeVisible();
});

test("a public profile stays off the operating system origin", async ({ page }) => {
  const response = await page.goto("/p/wantang");
  expect(response?.ok()).toBeTruthy();
  const html = await response?.text();
  expect(html?.toLowerCase()).not.toContain("missbunny");
  expect(html?.toLowerCase()).not.toContain("miss bunny");
  expect(html).not.toContain("/api/");
  expect(html).toContain("https://mrlootbox.com/wantang");
  expect(html).not.toContain("订金");
});

test("the model can top up a demo credit balance", async ({ page }) => {
  await page.goto("/home");
  await page.getByLabel("艺名").fill("晚棠");
  await page.getByLabel("城市").fill("墨尔本");
  await page.getByLabel("可约").fill("周四晚上");
  await page.getByLabel("安排").fill("私人晚宴");
  await page.getByLabel("收款方式").fill("PayID");
  await page.getByRole("button", { name: "绑定 Catch（演示）" }).click();
  await page.getByRole("button", { name: "绑定 X（演示）" }).click();
  await expect(page).toHaveURL(/\/studio\/ops/);
  await page.getByRole("button", { name: "充值" }).click();
  await expect(page.getByRole("heading", { name: "充值额度" })).toBeVisible();
  await expect(page.getByRole("button", { name: "A$200", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "现在支付 A$200" })).toBeEnabled();
  await page.getByRole("button", { name: "其他" }).click();
  await page.getByLabel("其他金额").fill("20");
  await expect(page.getByText("至少 A$50")).toBeVisible();
  await expect(page.getByRole("button", { name: /现在支付/ })).toBeDisabled();
  await page.getByLabel("其他金额").fill("80");
  await page.getByRole("button", { name: "现在支付 A$80" }).click();
  await expect(page.getByText("已记入演示余额 A$80")).toBeVisible();
  await page.getByRole("button", { name: "完成" }).click();
  await expect(page.getByText("A$80", { exact: true })).toBeVisible();
});
