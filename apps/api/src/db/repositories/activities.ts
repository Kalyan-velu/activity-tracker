import type { ActivityType } from "../../schemas/activities.js";
import * as db from "../index.js";

export const activityRepository = {
  create: async (data: ActivityType) => {
    const res = await db.query(
      "INSERT INTO activities (task,user_id) VALUES ($1, $2)",
      [data.task, data.user_id],
    );
    return res.rows[0];
  },
};