import axios from "axios";

import { silentSessionBackendResponseSchema } from "@/src/schemas/sessionSchema";
import type { SilentSessionResponse } from "@/src/types/session";
import { getJwtExpiration } from "@/src/utils/jwt";

export function parseBackendResponse(response: unknown): SilentSessionResponse {
  const parsedResponse = silentSessionBackendResponseSchema.safeParse(response);

  if (!parsedResponse.success) {
    throw new Error("Invalid silent session backend response");
  }

  const { token, veiculos, tipospacote } = parsedResponse.data;
  const tokenExp = getJwtExpiration(token);

  if (!tokenExp) {
    throw new Error("JWT token missing valid exp claim");
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
  fallbackMessage = "Request failed",
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
      : `${fallbackMessage} (${status})`;

  return { status, message };
}
