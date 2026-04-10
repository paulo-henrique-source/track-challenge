import { z } from "zod"

export const sessionRecordSchema = z.record(z.string(), z.unknown())

export const silentSessionPayloadSchema = z.object({
  jwtToken: z.string().min(1),
  tokenExp: z.number(),
  vehicles: z.array(sessionRecordSchema),
  packageTypes: z.array(sessionRecordSchema),
})

export type SessionRecord = z.infer<typeof sessionRecordSchema>

export type SilentSessionPayload = z.infer<typeof silentSessionPayloadSchema>
