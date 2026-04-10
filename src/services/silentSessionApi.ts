import axios from "axios";

import { silentSessionResponseSchema } from "@/schemas/sessionSchema";
import type { SilentSessionResponse } from "@/types/session";
import { getAxiosErrorMessage } from "@/utils/axios";

const INTERNAL_SILENT_SESSION_ENDPOINT = "/api/silent-session";

export const silentSessionQueryKey = ["silent-session"];

export async function requestSilentSession(): Promise<SilentSessionResponse> {
  try {
    const { data } = await axios.post(INTERNAL_SILENT_SESSION_ENDPOINT);

    const parsedResponse = silentSessionResponseSchema.safeParse(data);

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
