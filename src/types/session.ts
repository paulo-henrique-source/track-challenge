import type { z } from "zod";

import type {
  packageTypeRecordSchema,
  silentSessionBackendResponseSchema,
  silentSessionPayloadSchema,
  vehicleRecordSchema,
} from "@/schemas/sessionSchema";

export type VehicleRecord = z.infer<typeof vehicleRecordSchema>;
export type PackageTypeRecord = z.infer<typeof packageTypeRecordSchema>;
export type SilentSessionBackendResponse = z.infer<
  typeof silentSessionBackendResponseSchema
>;
export type SilentSessionPayload = z.infer<typeof silentSessionPayloadSchema>;
