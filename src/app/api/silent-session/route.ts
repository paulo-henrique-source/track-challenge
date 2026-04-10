import axios from "axios";
import { NextResponse } from "next/server";

import {
  getAxiosResponseError,
  parseBackendResponse,
} from "@/utils/silentSession";

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

  try {
    const response = await axios.post(endpoint, {
      usuario: user,
      senha: password,
    });

    const normalizedResponse = parseBackendResponse(response.data);

    return NextResponse.json(normalizedResponse);
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
