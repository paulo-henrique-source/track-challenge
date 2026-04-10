import axios from "axios";
import { NextResponse } from "next/server";

import {
  getAxiosResponseError,
  parseBackendResponse,
} from "@/src/utils/silentSession";

export async function POST() {
  const endpoint = process.env.SILENT_SESSION_URL;

  if (!endpoint) {
    return NextResponse.json(
      { message: "SILENT_SESSION_URL is not configured" },
      { status: 500 },
    );
  }

  const user = process.env.SILENT_SESSION_USER;
  const password = process.env.SILENT_SESSION_PASSWORD;

  if (!user || !password) {
    return NextResponse.json(
      {
        message:
          "SILENT_SESSION_USER and SILENT_SESSION_PASSWORD must be configured",
      },
      { status: 500 },
    );
  }

  try {
    const response = await axios.post(endpoint, {
      usuario: user,
      senha: password,
    });

    const normalizedResponse = parseBackendResponse(response.data);

    return NextResponse.json(normalizedResponse);
  } catch (error) {
    const axiosError = getAxiosResponseError(error, "Silent login failed");

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
