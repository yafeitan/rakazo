import { buttonVariants } from "@rakazo/ui-web";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Shimmer } from "../../components/ai/primitives";
import type { Assessment, ProfileDraft } from "../api";
import { call, streamEngine } from "../api";
import { useDemo } from "../shell";
import { DRAFT_KEY } from "./studio";

export function EnginePage() {
  const { shell, apply } = useDemo();
  const shellRef = useRef(shell);
  shellRef.current = shell;
  const [lines, setLines] = useState<string[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queue = useRef<string[]>([]);
  const pumping = useRef(false);
  const finished = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;
    queue.current = [];
    pumping.current = false;
    finished.current = false;
    setLines([]);
    setDone(false);
    setAssessment(null);

    const pump = () => {
      if (pumping.current || ignore) return;
      pumping.current = true;
      const tick = () => {
        if (ignore) return;
        const next = queue.current.shift();
        if (!next) {
          pumping.current = false;
          if (finished.current) setDone(true);
          return;
        }
        setLines((current) => [...current, next]);
        window.setTimeout(tick, 520);
      };
      tick();
    };

    void (async () => {
      if (shellRef.current.session.role !== "model") {
        setError("切换到模特身份");
        return;
      }
      let draft: ProfileDraft | null = null;
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { modelId?: string; draft?: ProfileDraft };
        if (parsed.modelId === shellRef.current.session.modelId && parsed.draft) {
          draft = parsed.draft;
        }
      }
      if (!draft) {
        const studio = await call<{ draft: ProfileDraft | null }>("studio");
        if (ignore) return;
        apply(studio.shell);
        draft = studio.draft;
      }
      if (!draft) {
        setError("先填写档案");
        return;
      }
      await streamEngine(
        draft,
        (event) => {
          if (ignore) return;
          if (event.shell) apply(event.shell);
          if (event.assessment) setAssessment(event.assessment);
          if (event.type === "step" && event.text) {
            queue.current.push(event.text);
            pump();
          }
          if (event.type === "done") {
            finished.current = true;
            pump();
          }
        },
        controller.signal,
      );
    })().catch((reason: unknown) => {
      if (ignore) return;
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setError(reason instanceof Error ? reason.message : "没有完成");
    });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [apply]);

  const ready = assessment?.ready === true;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col pt-8">
      <h1 className="text-heading3 font-medium">我们正在为你工作</h1>
      <ol className="mt-8 flex flex-col gap-3" aria-live="polite">
        {lines.map((line, index) => {
          const active = !done && index === lines.length - 1;
          return (
            <li key={`${line}-${index}`}>
              {active ? (
                <Shimmer>{line}</Shimmer>
              ) : (
                <span className="text-muted-foreground">{line}</span>
              )}
            </li>
          );
        })}
      </ol>
      {error ? <p className="mt-6 text-destructive">{error}</p> : null}
      {done && assessment && !ready ? (
        <div className="mt-8">
          <p className="text-muted-foreground">准备度 {assessment.score}</p>
          <ul className="mt-3 flex flex-col gap-1">
            {assessment.gaps.map((gap) => (
              <li key={gap.id}>{gap.suggestion}</li>
            ))}
          </ul>
          <Link to="/studio" className={`${buttonVariants({ size: "lg" })} mt-6`}>
            返回修改
          </Link>
        </div>
      ) : null}
      {done && ready ? (
        <Link to="/studio/dashboard" className={`${buttonVariants({ size: "lg" })} mt-8 w-fit`}>
          查看今日
        </Link>
      ) : null}
    </div>
  );
}
