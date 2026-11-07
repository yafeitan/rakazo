import type { DemoState, ProfileDraft } from "../domain";
import {
  acknowledgeInquiry,
  applyTimeouts,
  bookInquiry,
  checkout,
  commitEngine,
  completeOrder,
  confirmReceived,
  createOrder,
  dashboard,
  disputeOrder,
  draftFromProfile,
  engineSteps,
  listOrders,
  markPaid,
  modelChoices,
  ownProfile,
  presentOrder,
  searchProfiles,
  setDeposit,
  setRole,
  simulateTimeout,
  toPublicProfile,
} from "../domain";
import { generateProfileCopy } from "./llm";
import { decodeState, encodeState } from "./store";

type Payload = Record<string, unknown>;

const STEP_MS = 0;

function shellOf(state: DemoState) {
  return { session: state.session, models: modelChoices(state) };
}

function json(state: DemoState, body: Payload, status = 200): Response {
  return Response.json({ token: encodeState(state), shell: shellOf(state), ...body }, { status });
}

function fail(state: DemoState, error: string, status: number): Response {
  return json(state, { error }, status);
}

function asDraft(value: unknown): ProfileDraft | null {
  if (!value || typeof value !== "object") return null;
  const draft = value as ProfileDraft;
  if (typeof draft.stageName !== "string" || !Array.isArray(draft.languages)) return null;
  if (!Array.isArray(draft.paymentMethods) || typeof draft.contacts !== "object") return null;
  return draft;
}

function stringField(value: unknown): string {
  return typeof value === "string" ? value : "";
}

async function dispatch(
  state: DemoState,
  body: Payload,
): Promise<Response | { stream: true; state: DemoState; draft: ProfileDraft }> {
  const op = stringField(body.op);
  if (op === "bootstrap") return json(state, {});
  if (op === "session") {
    const role = body.role === "model" ? "model" : "user";
    const modelId = typeof body.modelId === "string" ? body.modelId : state.session.modelId;
    const next = setRole(state, role, modelId);
    if (!next) return fail(state, "没有这个档案", 404);
    return json(next, {});
  }
  if (op === "profiles") {
    return json(state, { profiles: searchProfiles(state, stringField(body.q)) });
  }
  if (op === "profile") {
    const profile = state.profiles.find(
      (item) => item.slug === stringField(body.slug) && item.published,
    );
    if (!profile) return fail(state, "找不到主页", 404);
    return json(state, { profile: toPublicProfile(profile) });
  }
  if (op === "checkout") {
    const result = checkout(state, stringField(body.slug));
    if (!result) return fail(state, "找不到主页", 404);
    return json(state, result);
  }
  if (op === "studio") {
    if (state.session.role !== "model") return fail(state, "请切换到模特", 403);
    const profile = ownProfile(state);
    return json(state, { profile, draft: profile ? draftFromProfile(profile) : null });
  }
  if (op === "generate") {
    const draft = asDraft(body.draft);
    if (!draft) return fail(state, "档案不完整", 400);
    const copy = await generateProfileCopy(draft);
    return json(state, copy);
  }
  if (op === "engine.start") {
    const draft = asDraft(body.draft);
    if (!draft) return fail(state, "档案不完整", 400);
    if (body.sync === true) {
      const committed = commitEngine(state, draft);
      if (!committed.ok) return fail(state, committed.error, 403);
      return json(committed.state, {
        assessment: committed.assessment,
        steps: engineSteps(committed.assessment.ready),
      });
    }
    return { stream: true, state, draft };
  }
  if (op === "dashboard") {
    const payload = dashboardPayload(state);
    if (!payload) return fail(state, "请切换到模特", 403);
    return json(state, payload);
  }
  if (op === "acknowledge") {
    const next = acknowledgeInquiry(state, stringField(body.id));
    if (!next) return fail(state, "这条询问不能这样处理", 409);
    const payload = dashboardPayload(next);
    if (!payload) return fail(next, "请切换到模特", 403);
    return json(next, payload);
  }
  if (op === "bookLead") {
    const booked = bookInquiry(state, stringField(body.id));
    if (!booked.ok) return fail(state, booked.error, 409);
    const payload = dashboardPayload(booked.state);
    if (!payload) return fail(booked.state, "请切换到模特", 403);
    return json(booked.state, payload);
  }
  if (op === "orders") return json(state, { orders: listOrders(state) });
  if (op === "order") {
    const order = state.orders.find((item) => item.id === stringField(body.id));
    if (!order) return fail(state, "找不到订单", 404);
    const view = presentOrder(state, order, true);
    if (!view) return fail(state, "找不到订单", 404);
    return json(state, { order: view });
  }
  if (op === "setDeposit") {
    const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);
    const updated = setDeposit(state, amount);
    if (!updated.ok) return fail(state, updated.error, 409);
    const payload = dashboardPayload(updated.state);
    if (!payload) return fail(updated.state, "请切换到模特", 403);
    return json(updated.state, payload);
  }
  if (op === "createOrder") {
    const created = createOrder(state, {
      slug: stringField(body.slug),
      startsAt: stringField(body.startsAt),
      phone: stringField(body.phone),
    });
    if (!created.ok) return fail(state, created.error, 403);
    const order = created.state.orders.find((item) => item.id === created.orderId);
    const view = order ? presentOrder(created.state, order, true) : null;
    return json(created.state, { order: view });
  }
  const orderId = stringField(body.id);
  const mutated =
    op === "pay"
      ? markPaid(state, orderId, {
          note: stringField(body.note),
          screenshotAttached: body.screenshotAttached === true,
        })
      : op === "confirm"
        ? confirmReceived(state, orderId)
        : op === "dispute"
          ? disputeOrder(state, orderId)
          : op === "timeout"
            ? simulateTimeout(state, orderId)
            : op === "complete"
              ? completeOrder(state, orderId)
              : undefined;
  if (mutated === undefined) return fail(state, "未知操作", 404);
  if (!mutated) return fail(state, "这个订单不能这样变更", 409);
  const order = mutated.orders.find((item) => item.id === orderId);
  const view = order ? presentOrder(mutated, order, true) : null;
  return json(mutated, { order: view });
}

function dashboardPayload(state: DemoState) {
  const view = dashboard(state);
  if (!view) return null;
  const { profile, ...rest } = view;
  return {
    ...rest,
    stageName: profile.stageName,
    city: profile.city,
    published: profile.published,
    engineStarted: profile.engineStarted,
    photoCount: profile.photoCount,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function streamEngine(state: DemoState, draft: ProfileDraft): Response {
  const committed = commitEngine(state, draft);
  if (!committed.ok) return fail(state, committed.error, 403);
  const steps = engineSteps(committed.assessment.ready);
  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      const send = (event: Payload) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };
      send({
        type: "result",
        token: encodeState(committed.state),
        shell: shellOf(committed.state),
        assessment: committed.assessment,
      });
      for (const step of steps) {
        await delay(STEP_MS);
        send({ type: "step", ...step });
      }
      send({ type: "done" });
      controller.close();
    },
  });
  return new Response(body, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
}

export async function handleMissbunny(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "只接受 POST" }, { status: 405 });
  }
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "无法读取请求" }, { status: 400 });
  }
  const token =
    typeof payload.token === "string" ? payload.token : request.headers.get("x-missbunny-token");
  const state = applyTimeouts(decodeState(token));
  const result = await dispatch(state, payload);
  if (result instanceof Response) return result;
  return streamEngine(result.state, result.draft);
}
