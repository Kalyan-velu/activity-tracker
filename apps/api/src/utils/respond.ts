import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const ok = <T>(
  c: Context,
  data: T,
  code: ContentfulStatusCode | undefined = 200,
) => c.json({ status: true as const, data }, code);

export const err = (
  c: Context,
  message: string,
  code: ContentfulStatusCode | undefined = 500,
) => c.json({ status: false as const, error: { message } }, code);
