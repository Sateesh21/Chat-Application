import { z } from "zod";

export const createRoomValidator = z.object({
  type: z.enum(["direct", "group"]),
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  members: z.array(z.string()),
}).refine(
  (data) => {
    return data.type === "direct"
      ? data.members.length === 1
      : data.members.length > 1;
  },
  {
    message: "Direct chat needs exactly 2 members, group chat needs at least 2",
    path: ["members"],
  }
);

export type CreateRoomInput = z.infer<typeof createRoomValidator>;