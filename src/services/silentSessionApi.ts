import axios from "axios";

import { silentSessionPayloadSchema, type SilentSessionPayload } from "@/types";

const INTERNAL_SILENT_SESSION_ENDPOINT = "/api/silent-session";

export const silentSessionQueryKey = ["silent-session"] as const;

function getAxiosErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const responsePayload = error.response?.data;

  if (
    responsePayload &&
    typeof responsePayload === "object" &&
    "message" in responsePayload &&
    typeof responsePayload.message === "string"
  ) {
    return responsePayload.message;
  }

  const status = error.response?.status;

  return status ? `Silent login failed (${status})` : "Silent login failed";
}

export async function requestSilentSession(): Promise<SilentSessionPayload> {
  try {
    const { data } = await axios.post<unknown>(
      INTERNAL_SILENT_SESSION_ENDPOINT,
    );

    const parsedPayload = silentSessionPayloadSchema.safeParse(data);

    if (!parsedPayload.success) {
      throw new Error("Invalid silent session endpoint response");
    }

    return parsedPayload.data;
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
