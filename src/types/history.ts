import type { z } from "zod";

import type {
  historyRequestSchema,
  historyRecordSchema,
  historyResponseSchema,
} from "@/schemas/historySchema";

export type HistoryRequest = z.infer<typeof historyRequestSchema>;
export type HistoryRecord = z.infer<typeof historyRecordSchema>;
export type HistoryResponse = z.infer<typeof historyResponseSchema>;
