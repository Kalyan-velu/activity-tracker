import { Hono } from "hono";
import { activitySchema } from "../schemas/activities.js";
import { ok } from "../utils/respond.js";
import { zValidator } from "@hono/zod-validator";
import { activityRepository } from "../db/repositories/activities.js";

export const activitiesRouter = new Hono();

activitiesRouter.post(
  "/",
  zValidator("json", activitySchema.required({ user_id: true })),
  async (c) => {
    const { task, user_id } = c.req.valid("json");
    const data = await activityRepository.create({ task, user_id });
    return ok(c, data, 201);
  },
);
