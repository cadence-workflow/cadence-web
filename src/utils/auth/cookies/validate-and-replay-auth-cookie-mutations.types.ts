export type ValidateAndReplayResult =
  | { ok: true }
  | { ok: false; reason: 'over-budget'; totalBytes: number }
  | { ok: false; reason: 'unknown-cookie-name'; name: string };
