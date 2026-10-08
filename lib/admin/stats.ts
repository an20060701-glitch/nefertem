import "server-only";
import { parseServiceAccount } from "@/lib/line/token";
import { firebaseConfig, firestoreDatabaseId } from "@/lib/firebase/config";
import { accessToken } from "./google";
import { summarize, type Member, type SiteStats } from "./summary";

const DAY = 86_400_000;

interface AuthUser {
  localId: string;
  email?: string;
  displayName?: string;
  createdAt?: string;
  lastLoginAt?: string;
  lastRefreshAt?: string;
  providerUserInfo?: { providerId: string }[];
}

/** Google / LINE (Firebase OIDC) / LINE (our own server, uid `line:<sub>`). */
function providerOf(user: AuthUser): Member["provider"] {
  const ids = (user.providerUserInfo ?? []).map((p) => p.providerId);
  if (ids.includes("google.com")) return "google";
  if (user.localId.startsWith("line:") || ids.some((id) => id.startsWith("oidc."))) return "line";
  return "other";
}

/** Latest of sign-in and token refresh: a member who stays signed in only refreshes. */
function lastSeen(user: AuthUser): number | null {
  const times = [Number(user.lastLoginAt), Date.parse(user.lastRefreshAt ?? "")].filter(Number.isFinite);
  return times.length ? Math.max(...times) : null;
}

export function adminConfig() {
  const account = parseServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  const projectId = firebaseConfig.projectId;
  return account && projectId && firebaseConfig.apiKey ? { account, projectId, apiKey: firebaseConfig.apiKey } : null;
}

type Config = NonNullable<ReturnType<typeof adminConfig>>;

/** Every Firebase Auth account, 500 at a time. */
async function listAuthUsers(config: Config, token: string): Promise<AuthUser[]> {
  const users: AuthUser[] = [];
  for (let offset = 0; ; offset += 500) {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${config.projectId}/accounts:query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ returnUserInfo: true, limit: "500", offset: String(offset) }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`accounts:query ${res.status}`);
    const page = ((await res.json()) as { userInfo?: AuthUser[] }).userInfo ?? [];
    users.push(...page);
    if (page.length < 500) return users;
  }
}

/** COUNT() of users/{uid}/{collectionId}, optionally only `timestamp >= since`. */
async function countDocs(config: Config, token: string, uid: string, collectionId: string, since?: number) {
  const db = firestoreDatabaseId ?? "(default)";
  const parent = `projects/${config.projectId}/databases/${db}/documents/users/${encodeURIComponent(uid)}`;
  const where =
    since === undefined
      ? undefined
      : {
          fieldFilter: {
            field: { fieldPath: "timestamp" },
            op: "GREATER_THAN_OR_EQUAL",
            value: { integerValue: String(since) },
          },
        };
  const res = await fetch(`https://firestore.googleapis.com/v1/${parent}:runAggregationQuery`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      structuredAggregationQuery: {
        structuredQuery: { from: [{ collectionId }], ...(where && { where }) },
        aggregations: [{ alias: "n", count: {} }],
      },
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`runAggregationQuery ${res.status}`);
  const [first] = (await res.json()) as { result?: { aggregateFields?: { n?: { integerValue?: string } } } }[];
  return Number(first?.result?.aggregateFields?.n?.integerValue ?? 0);
}

export async function loadStats(config: Config, now = Date.now()): Promise<SiteStats> {
  const token = await accessToken(config.account);
  const users = await listAuthUsers(config, token);
  const members = await Promise.all(
    users.map(async (user): Promise<Member> => {
      const [perfumes, wears, wears7d] = await Promise.all([
        countDocs(config, token, user.localId, "fragrances"),
        countDocs(config, token, user.localId, "usageLogs"),
        countDocs(config, token, user.localId, "usageLogs", now - 7 * DAY),
      ]);
      return {
        name: user.displayName || user.email || "（未命名）",
        email: user.email ?? null,
        provider: providerOf(user),
        createdAt: Number(user.createdAt) || null,
        lastSeenAt: lastSeen(user),
        perfumes,
        wears,
        wears7d,
      };
    }),
  );
  return summarize(members, now);
}

/** The signed-in user behind a Firebase ID token, if the token is valid. */
export async function verifyIdToken(config: Config, idToken: string) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${config.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) return null;
  const [user] = ((await res.json()) as { users?: { email?: string; emailVerified?: boolean }[] }).users ?? [];
  return user ?? null;
}

/** ADMIN_EMAILS: comma-separated sign-in emails allowed to see the stats. */
export function isAdmin(user: { email?: string; emailVerified?: boolean } | null): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return !!user?.email && !!user.emailVerified && allowed.includes(user.email.toLowerCase());
}
