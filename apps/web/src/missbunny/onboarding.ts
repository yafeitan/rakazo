export type WorkspaceDraft = {
  stageName: string;
  city: string;
  availability: string;
  services: string;
  payment: string;
};

export const EMPTY_WORKSPACE: WorkspaceDraft = {
  stageName: "",
  city: "",
  availability: "",
  services: "",
  payment: "",
};

export const WORKSPACE_KEY = "missbunny.workspace";

const REQUIRED: (keyof WorkspaceDraft)[] = [
  "stageName",
  "city",
  "availability",
  "services",
  "payment",
];

/** Fields still empty. The workspace starts when this list is empty. */
export function missingWorkspace(draft: WorkspaceDraft): (keyof WorkspaceDraft)[] {
  return REQUIRED.filter((key) => draft[key].trim().length === 0);
}

export function workspaceReady(draft: WorkspaceDraft): boolean {
  return missingWorkspace(draft).length === 0;
}
