import { buttonVariants } from "@rakazo/ui-web";
import { Link, useNavigate } from "react-router-dom";
import { call } from "../api";
import { useDemo } from "../shell";

const STEPS = [
  "浏览主页不需要登录。",
  "预约时输入邀请码 MB-DEMO。",
  "选择时间，以及她自己配置的收款方式。",
  "你点「我已付款」后，她确认到账，联系方式才会出现。",
  "右上角切换到模特，看今日询问、账本和月费。",
  "待付款订单里可以用「模拟超时」；她可以点「未收到」。",
];

export function DemoPage() {
  const navigate = useNavigate();
  const { apply } = useDemo();

  async function openEngine() {
    const body = await call("session", { role: "model", modelId: "wantang" });
    apply(body.shell);
    navigate("/studio/dashboard");
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center pt-10 text-center">
      <h1 className="text-display font-medium tracking-tight">missbunny</h1>
      <p className="mt-4 text-body-lg text-muted-foreground">
        只服务澳洲的独立模特，不服务经纪公司。私人、克制、由你决定。
      </p>
      <ol className="mt-10 w-full space-y-3 text-left text-body">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="w-5 shrink-0 text-muted-foreground">{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <Link to="/models" className={`${buttonVariants({ size: "lg" })} mt-10`}>
        以客人浏览
      </Link>
      <button
        type="button"
        className={`${buttonVariants({ variant: "text" })} mt-4`}
        onClick={() => void openEngine()}
      >
        以模特查看引擎
      </button>
    </div>
  );
}
