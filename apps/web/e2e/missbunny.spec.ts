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
  await expect(page.getByRole("button", { name: "继续" })).toBeDisabled();
  await page.getByRole("button", { name: "自运营" }).click();
  await expect(page.getByRole("button", { name: "继续" })).toBeEnabled();
  await expect(page.getByText("IVY")).toHaveCount(0);
  await expect(page.getByText("绑定 X")).toHaveCount(0);

  await page.goto("/demo");
  await expect(page.getByText("AI 员工要每天有稳定的询问。")).toBeVisible();
  await expect(page.getByRole("button", { name: "继续" })).toBeDisabled();
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
  await expect(page.getByRole("heading", { name: "月费" })).toBeVisible();
  await expect(page.getByText("A$420")).toBeVisible();
  await expect(page.getByText("工具费")).toHaveCount(0);
  await expect(page.getByText("A$80")).toHaveCount(0);
  await expect(page.getByText("只用你资料里的内容回答，不编")).toBeVisible();
});

test("onboarding opens a scripted model desk and the public profile hides the deposit", async ({
  page,
}) => {
  await page.goto("/models/wantang");
  await expect(page.getByRole("heading", { name: "晚棠" })).toBeVisible();
  await expect(page.getByText("私人晚宴陪同")).toBeVisible();
  await expect(page.getByText("PayID 订金")).toHaveCount(0);

  await page.goto("/home");
  await page.getByRole("button", { name: "自运营" }).click();
  await page.getByRole("button", { name: "继续" }).click();
  await expect(page).toHaveURL(/\/studio\/dashboard\?aha=1/);
  await expect(page.getByRole("heading", { name: "模特后台" })).toBeVisible();
  await expect(page.getByText("周四晚上还有空吗？想约一次私人晚宴。")).toBeVisible();
  await expect(page.getByText("私人晚宴可以安排")).toBeVisible();
  await expect(page.getByText("待付订金")).toBeVisible();
  await page.getByRole("button", { name: "已收款" }).click();
  await expect(page.getByText("0400 000 222（演示）")).toBeVisible();
  await expect(page.getByText("账本记入 PayID 订金 A$100（演示）")).toBeVisible();
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
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  await page.getByRole("button", { name: "Self-run" }).click();
  await expect(page.getByRole("button", { name: "Continue" })).toBeEnabled();
  await expect(page.getByText("IVY")).toHaveCount(0);
  await expect(page.getByText("Connect X")).toHaveCount(0);

  await page.goto("/demo?lang=en");
  await expect(
    page.getByText("The AI employee needs a steady stream of inquiries every day."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  await expect(page.getByRole("heading", { name: "missbunny" })).toBeVisible();
  await expect(page.getByText("not agencies")).toBeVisible();
  await expect(page.getByRole("link", { name: "Wantang · PayID deposit" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Chengyue · phone only" })).toBeVisible();
  await page.getByRole("button", { name: "Open the engine as the model" }).click();
  await expect(page.getByRole("heading", { name: "Deposit" })).toBeVisible();
  await expect(page.getByText("PayID A$100 (demo)")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Monthly fee" })).toBeVisible();
  await expect(page.getByText("A$420")).toBeVisible();
  await expect(page.getByText("AI usage, about A$300–600 · demo")).toBeVisible();
  await expect(page.getByText("Answers only from your profile. Nothing invented.")).toBeVisible();
  await expect(page.getByText("Are you free Thursday evening?")).toBeVisible();
  await expect(page.getByText("Needs you to confirm")).toBeVisible();
  await expect(page.getByText("工具费")).toHaveCount(0);
  await page.getByRole("button", { name: "中文", exact: true }).click();
  await expect(page.getByRole("heading", { name: "订金" })).toBeVisible();
  await expect(page).not.toHaveURL(/lang=en/);

  await page.goto("/models/wantang?lang=en");
  await expect(page.getByRole("heading", { name: "Wantang" })).toBeVisible();
  await expect(page.getByText("Melbourne · Chinese · English")).toBeVisible();
  await expect(page.getByText("Private dinner company")).toBeVisible();
  await expect(page.getByText("PayID 订金")).toHaveCount(0);

  await page.goto("/home?lang=en");
  await page.getByRole("button", { name: "Self-run" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/aha=1/);
  await expect(page.getByRole("heading", { name: "Model desk" })).toBeVisible();
  await expect(page.getByText("I’d like a private dinner.")).toBeVisible();
  await expect(page.getByText("Deposit pending")).toBeVisible();
  await page.getByRole("button", { name: "Payment received" }).click();
  await expect(page.getByText("0400 000 222 (demo)")).toBeVisible();
  await expect(page.getByText("Ledger records the PayID deposit A$100 (demo)")).toBeVisible();
});
