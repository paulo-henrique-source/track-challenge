import axios from "axios";

import { silentSessionPayloadSchema } from "@/schemas/sessionSchema";
import type { SilentSessionPayload } from "@/types/session";
import { getAxiosErrorMessage } from "@/utils/axios";

const INTERNAL_SILENT_SESSION_ENDPOINT = "/api/silent-session";

export const silentSessionQueryKey = ["silent-session"] as const;

export async function requestSilentSession(): Promise<SilentSessionPayload> {
  try {
    const { data } = await axios.post(INTERNAL_SILENT_SESSION_ENDPOINT);

    const parsedResponse = silentSessionPayloadSchema.safeParse(data);

    if (!parsedResponse.success) {
      throw new Error("Invalid silent session endpoint response");
    }

    return parsedResponse.data;
  } catch (error) {
    const message = getAxiosErrorMessage(error);

    if (message) {
      throw new Error(message);
    }

    throw error instanceof Error
      ? error
      : new Error("Unexpected silent login error");
  }
}
