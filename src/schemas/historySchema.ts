import { z } from "zod";

export const historyRequestSchema = z.object({
  inicio: z.string().min(1),
  fim: z.string().min(1),
  tipos_pacotes: z.string(),
  veiccodigo: z.string().min(1),
  token: z.string().min(1),
});
