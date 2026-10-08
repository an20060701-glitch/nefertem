import type { Fragrance, UsageLog, UserFragrance } from "@/types";

/** What the add / edit form produces; ids and bookkeeping are the repo's job. */
export type FragranceDraft = Omit<Fragrance, "id" | "createdAt" | "origin"> & {
  origin?: Fragrance["origin"];
};

export type UsageDraft = Omit<UsageLog, "id" | "timestamp">;

/**
 * One interface, two homes: this device for guests, Firestore for members
 * (architecture §4.2). Components never talk to storage directly.
 */
export interface CollectionRepo {
  kind: "device" | "account";
  subscribe(onItems: (items: UserFragrance[]) => void, onError?: (e: unknown) => void): () => void;
  subscribeUsage(onLogs: (logs: UsageLog[]) => void, onError?: (e: unknown) => void): () => void;
  /** Adds a scent; pass `id` to keep a known id (a demo scent keeps its catalogue id). */
  add(draft: FragranceDraft, options?: { id?: string; image?: Blob }): Promise<UserFragrance>;
  update(id: string, patch: Partial<FragranceDraft>, options?: { image?: Blob | null }): Promise<void>;
  remove(id: string): Promise<void>;
  /** Records a wear; also bumps usageCount / lastUsedAt when the scent is in the collection. */
  logUsage(entry: UsageDraft): Promise<UsageLog>;
  /**
   * Takes back wears (重新開始 sets today's pick aside, An 2026-10-07): the logs go, and
   * each scent's usageCount / lastUsedAt fall back to what the remaining `usage` says.
   */
  undoUsage(logs: readonly UsageLog[], usage: readonly UsageLog[]): Promise<void>;
  /**
   * When today's 香水選擇 was last restarted (重新開始), wherever it was pressed: a
   * member's devices all follow it; a guest's stays on this device.
   */
  subscribeRestart(onRestart: (at: number | undefined) => void, onError?: (e: unknown) => void): () => void;
  markRestarted(at: number): Promise<void>;
  /**
   * Shelves of 我的香水櫃 the member took away with their X (An, 2026-10-08): only the shelf
   * is hidden, never its scents. A member's devices all follow it; a guest's stays on this device.
   */
  subscribeHiddenShelves(onKeys: (keys: string[]) => void, onError?: (e: unknown) => void): () => void;
  setHiddenShelves(keys: readonly string[]): Promise<void>;
  /** Photos need an account (Storage is per member). */
  supportsImages: boolean;
}
