import { z } from "zod";

export const activitySchema = z.object({
  id: z.uuid().optional(),
  task: z.string({ message: "Please enter a task." }).max(500),
  user_id: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ActivityType = z.infer<typeof activitySchema>;