import { buttonVariants } from "@rakazo/ui-web";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { OnboardingFlow } from "./onboarding-flow";

const LINES = [
  ["24 小时回复询问", "She sleeps. Replies keep going."],
  ["预约有人看着", "Bookings stay in view."],
  ["只用你写过的资料回答", "拿不准，就标「需要你确认」。"],
  ["钱进你自己的 PayID", "我们不经手。"],
  ["每天的工作和入账，都看得见", "演示账本。"],
  ["月费是 AI 用量", "大约 A$300–600。"],
  ["客人留下电话就能约", "订金默认是 0。要收，就在设置里打开 PayID 订金。"],
];

export function HomePage() {
  useEffect(() => {
    document.title = "Miss Bunny OS";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Miss Bunny OS，澳洲独立模特的运营系统。你睡觉，AI 也在帮你干活。");
  }, []);

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 px-5 py-5">
        <div>
          <p className="text-body-lg font-medium">Miss Bunny OS</p>
          <p className="text-label text-muted-foreground">运营系统</p>
        </div>
        <Link to="/demo" className={buttonVariants({ variant: "text" })}>
          试用演示
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-16 px-5 pb-20 pt-8">
        <section>
          <p className="text-label text-muted-foreground">AI that works while you sleep</p>
          <h1 className="mt-4 max-w-xl text-[2.5rem] font-medium leading-tight tracking-tight sm:text-[4rem]">
            你睡觉，AI 也在帮你干活
          </h1>
          <p className="mt-6 max-w-md text-body-lg text-muted-foreground">
            只服务澳洲的独立模特。不服务经纪公司。
          </p>
          <Link to="/demo" className={`${buttonVariants({ size: "lg" })} mt-8`}>
            试用演示
          </Link>
        </section>
        <section className="flex flex-col gap-10">
          {LINES.map(([line, detail]) => (
            <div key={line}>
              <h2 className="max-w-xl text-[1.75rem] font-medium leading-tight tracking-tight">
                {line}
              </h2>
              <p className="mt-2 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </section>
        <OnboardingFlow />
      </main>
      <footer className="px-5 py-8 text-muted-foreground">Miss Bunny OS</footer>
    </div>
  );
}
