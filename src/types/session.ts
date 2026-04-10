import type { z } from "zod";

import type {
  packageTypeRecordSchema,
  silentSessionBackendResponseSchema,
  silentSessionResponseSchema,
  vehicleRecordSchema,
} from "@/src/schemas/sessionSchema";

export type VehicleRecord = z.infer<typeof vehicleRecordSchema>;
export type PackageTypeRecord = z.infer<typeof packageTypeRecordSchema>;
export type SilentSessionBackendResponse = z.infer<
  typeof silentSessionBackendResponseSchema
>;
export type SilentSessionResponse = z.infer<typeof silentSessionResponseSchema>;
