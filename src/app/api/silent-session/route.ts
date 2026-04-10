import axios from "axios";
import { NextResponse } from "next/server";

import type { SessionRecord, SilentSessionPayload } from "@/types";
import { getJwtExpiration } from "@/utils/jwt";

function readString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return null;
}

function readArray(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value as SessionRecord[];
    }
  }

  return [];
}

function parseBackendPayload(
  payload: Record<string, unknown>,
): SilentSessionPayload {
  const jwtToken = readString(payload, ["jwt_token", "jwtToken", "token"]);
  if (!jwtToken) {
    throw new Error("JWT token not found in response");
  }

  const tokenExp = getJwtExpiration(jwtToken);
  if (!tokenExp) {
    throw new Error("JWT token missing valid exp claim");
  }

  return {
    jwtToken,
    tokenExp,
    vehicles: readArray(payload, ["veiculos", "vehicles"]),
    packageTypes: readArray(payload, [
      "tipos_pacote",
      "tiposPacote",
      "package_types",
      "packageTypes",
    ]),
  };
}

function getAxiosResponseError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const status = error.response?.status ?? 500;
  const responsePayload = error.response?.data;

  const message =
    responsePayload &&
    typeof responsePayload === "object" &&
    "message" in responsePayload &&
    typeof responsePayload.message === "string"
      ? responsePayload.message
      : `Silent login failed (${status})`;

  return { status, message };
}

export async function POST() {
  const endpoint = process.env.SILENT_SESSION_URL;

  if (!endpoint) {
    return NextResponse.json(
      { message: "SILENT_SESSION_URL is not configured" },
      { status: 500 },
    );
  }

  const usuario = process.env.SILENT_SESSION_USER;
  const senha = process.env.SILENT_SESSION_PASSWORD;

  try {
    const backendResponse = await axios.post<Record<string, unknown>>(endpoint, {
      usuario,
      senha,
    });

    const normalizedPayload = parseBackendPayload(backendResponse.data);

    return NextResponse.json(normalizedPayload);
  } catch (error) {
    const axiosError = getAxiosResponseError(error);

    if (axiosError) {
      return NextResponse.json(
        { message: axiosError.message },
        { status: axiosError.status },
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unexpected silent login error",
      },
      { status: 500 },
    );
  }
}
