import { z } from "zod";

export const historyRequestSchema = z.object({
  inicio: z.string().min(1),
  fim: z.string().min(1),
  tipos_pacotes: z.string(),
  veiccodigo: z.string().min(1),
  token: z.string().min(1),
});

export const historyRecordSchema = z
  .object({
    data: z.string().min(1),
    latitude: z.string().min(1),
    longitude: z.string().min(1),
    velocidade: z.string().optional(),
    veiculo: z.string().optional(),
    motorista: z.string().optional(),
    giro: z.string().optional(),
    pedal: z.string().optional(),
    media: z.string().optional(),
    estado: z.string().optional(),
    tipo: z.string().optional(),
    veicplaca: z.string().optional(),
  })
  .catchall(z.unknown());

export const historyResponseSchema = z.array(historyRecordSchema);
