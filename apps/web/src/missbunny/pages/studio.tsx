import { Button, Input, Label, NativeSelect, NativeSelectOption, Textarea } from "@rakazo/ui-web";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProfileDraft } from "../api";
import { call } from "../api";
import { assess, CITIES, emptyDraft, LANGUAGES } from "../domain";
import { useDemo } from "../shell";

export const DRAFT_KEY = "missbunny.draft";

const fieldClass = "mt-2 h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg";

export function StudioPage() {
  const { shell, apply } = useDemo();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ProfileDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [payKind, setPayKind] = useState<"payid" | "bank">("payid");
  const [payName, setPayName] = useState("");
  const [payRef, setPayRef] = useState("");

  useEffect(() => {
    if (shell.session.role !== "model") return;
    let active = true;
    void call<{ draft: ProfileDraft | null }>("studio")
      .then((body) => {
        if (!active) return;
        apply(body.shell);
        setDraft(body.draft ?? emptyDraft());
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "没有完成");
      });
    return () => {
      active = false;
    };
  }, [apply, shell.session.modelId, shell.session.role]);

  if (shell.session.role !== "model") {
    return <p className="pt-8 text-muted-foreground">切换到模特身份</p>;
  }
  if (!draft) return error ? <p className="pt-8 text-destructive">{error}</p> : null;

  const form = draft;
  const assessment = assess(form);
  const patch = (next: Partial<ProfileDraft>) => setDraft({ ...form, ...next });

  const addPayment = () => {
    if (!payRef.trim()) return;
    patch({
      paymentMethods: [
        ...form.paymentMethods,
        {
          id: `pay-${Date.now()}`,
          kind: payKind,
          label: payKind === "payid" ? "PayID" : "银行转账",
          accountName: payName.trim() || form.stageName || "收款人",
          reference: payRef.trim(),
        },
      ],
    });
    setPayRef("");
    setPayName("");
  };

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const body = await call<{ bio: string }>("generate", { draft });
      apply(body.shell);
      setDraft((current) => (current ? { ...current, bio: body.bio } : current));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "没有完成");
    } finally {
      setGenerating(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    navigate("/studio/engine");
  }

  return (
    <form onSubmit={submit} className="mx-auto flex w-full max-w-md flex-col gap-6 pt-4">
      <div>
        <h1 className="text-heading3 font-medium">档案</h1>
        <p className="mt-2 text-muted-foreground">准备度 {assessment.score}</p>
      </div>
      {assessment.gaps.length > 0 ? (
        <ul className="flex flex-col gap-1 text-body">
          {assessment.gaps.map((gap) => (
            <li key={gap.id}>{gap.suggestion}</li>
          ))}
        </ul>
      ) : null}
      <div>
        <Label htmlFor="stage">艺名</Label>
        <Input
          id="stage"
          value={draft.stageName}
          onChange={(event) => patch({ stageName: event.target.value })}
          className={fieldClass}
        />
      </div>
      <div>
        <Label htmlFor="city">城市</Label>
        <NativeSelect
          id="city"
          className="mt-2"
          aria-label="城市"
          value={draft.city}
          onChange={(event) => patch({ city: event.target.value })}
        >
          <NativeSelectOption value="">选择城市</NativeSelectOption>
          {CITIES.map((city) => (
            <NativeSelectOption key={city} value={city}>
              {city}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <fieldset>
        <legend className="text-label text-muted-foreground">语言</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {LANGUAGES.map((language) => (
            <label key={language} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.languages.includes(language)}
                onChange={(event) => {
                  const languages = event.target.checked
                    ? [...draft.languages, language]
                    : draft.languages.filter((item) => item !== language);
                  patch({ languages });
                }}
              />
              {language}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <Label htmlFor="services">服务说明</Label>
        <Textarea
          id="services"
          value={draft.services}
          onChange={(event) => patch({ services: event.target.value })}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="availability">可约时间</Label>
        <Input
          id="availability"
          value={draft.availability}
          onChange={(event) => patch({ availability: event.target.value })}
          className={fieldClass}
        />
      </div>
      <div>
        <Label htmlFor="bio">主页简介</Label>
        <Textarea
          id="bio"
          value={draft.bio}
          onChange={(event) => patch({ bio: event.target.value })}
          className="mt-2"
        />
        <Button
          type="button"
          variant="outline"
          className="mt-3"
          disabled={generating}
          onClick={() => void generate()}
        >
          {generating ? "正在写" : "生成主页文案"}
        </Button>
      </div>
      <div>
        <p className="text-label text-muted-foreground">照片</p>
        <div className="mt-2 flex gap-2" aria-hidden>
          {Array.from({ length: draft.photoCount }, (_, index) => (
            <span key={index} className="size-14 rounded-lg bg-muted" />
          ))}
        </div>
        <div className="mt-3 flex gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={draft.photoCount >= 6}
            onClick={() => patch({ photoCount: draft.photoCount + 1 })}
          >
            添加照片
          </Button>
          {draft.photoCount > 0 ? (
            <Button
              type="button"
              variant="text"
              onClick={() => patch({ photoCount: draft.photoCount - 1 })}
            >
              移除一张
            </Button>
          ) : null}
        </div>
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-label text-muted-foreground">收款方式</legend>
        <ul className="flex flex-col gap-2">
          {draft.paymentMethods.map((method) => (
            <li key={method.id} className="flex items-center justify-between gap-3">
              <span>
                {method.label}
                <span className="ml-2 text-muted-foreground">{method.reference}</span>
              </span>
              <Button
                type="button"
                variant="text"
                onClick={() =>
                  patch({
                    paymentMethods: draft.paymentMethods.filter((item) => item.id !== method.id),
                  })
                }
              >
                移除
              </Button>
            </li>
          ))}
        </ul>
        <NativeSelect
          aria-label="收款类型"
          value={payKind}
          onChange={(event) => setPayKind(event.target.value === "bank" ? "bank" : "payid")}
        >
          <NativeSelectOption value="payid">PayID</NativeSelectOption>
          <NativeSelectOption value="bank">银行转账</NativeSelectOption>
        </NativeSelect>
        <Input
          aria-label="收款人"
          placeholder="收款人"
          value={payName}
          onChange={(event) => setPayName(event.target.value)}
          className="h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg"
        />
        <Input
          aria-label="账号或 PayID"
          placeholder="账号或 PayID"
          value={payRef}
          onChange={(event) => setPayRef(event.target.value)}
          className="h-12 rounded-xl px-4 text-[16px]/6 md:text-body-lg"
        />
        <Button type="button" variant="outline" onClick={addPayment} disabled={!payRef.trim()}>
          添加收款方式
        </Button>
      </fieldset>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-label text-muted-foreground">私人联系方式</legend>
        <p className="text-muted-foreground">确认收款后才会给客人。</p>
        {(
          [
            ["wechat", "微信"],
            ["telegram", "Telegram"],
            ["whatsapp", "WhatsApp"],
            ["sms", "短信"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              value={draft.contacts[key] ?? ""}
              onChange={(event) =>
                patch({ contacts: { ...draft.contacts, [key]: event.target.value } })
              }
              className={fieldClass}
            />
          </div>
        ))}
      </fieldset>
      {error ? <p className="text-destructive">{error}</p> : null}
      <Button type="submit" size="xl">
        提交给引擎
      </Button>
    </form>
  );
}
