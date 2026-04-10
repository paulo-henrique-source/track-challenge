import axios from "axios";

import { silentSessionBackendResponseSchema } from "@/schemas/sessionSchema";
import type { SilentSessionResponse } from "@/types/session";
import { getJwtExpiration } from "@/utils/jwt";

export function parseBackendResponse(response: unknown): SilentSessionResponse {
  const parsedResponse = silentSessionBackendResponseSchema.safeParse(response);

  if (!parsedResponse.success) {
    throw new Error("errors.session.invalidSilentBackendResponse");
  }

  const { token, veiculos, tipospacote } = parsedResponse.data;
  const tokenExp = getJwtExpiration(token);

  if (!tokenExp) {
    throw new Error("errors.session.missingJwtExp");
  }

  return {
    jwtToken: token,
    tokenExp,
    vehicles: veiculos,
    packageTypes: tipospacote,
  };
}

export function getAxiosResponseError(
  error: unknown,
  fallbackMessage = "errors.generic.requestFailed",
) {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const status = error.response?.status ?? 500;
  const response = error.response?.data;

  const message =
    response &&
    typeof response === "object" &&
    "message" in response &&
    typeof response.message === "string"
      ? response.message
      : fallbackMessage;

  return { status, message };
}
