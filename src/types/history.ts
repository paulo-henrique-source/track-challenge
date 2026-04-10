import type { z } from "zod";

import type { historyRequestSchema } from "@/src/schemas/historySchema";

export type HistoryRequest = z.infer<typeof historyRequestSchema>;
