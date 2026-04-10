import axios from "axios";
import { NextResponse } from "next/server";

import {
  getRequestLanguage,
  resolveServerMessage,
  translateServer,
} from "@/i18n/server";
import {
  getAxiosResponseError,
  parseBackendResponse,
} from "@/utils/silentSession";

const DEFAULT_SILENT_SESSION_URL =
  "https://lifegestaodefrota.com.br/lifeweb/api/login";

export async function POST(request: Request) {
  const language = getRequestLanguage(request);
  const endpoint =
    process.env.SILENT_SESSION_URL?.trim() || DEFAULT_SILENT_SESSION_URL;

  const user = process.env.SILENT_SESSION_USER;
  const password = process.env.SILENT_SESSION_PASSWORD;

  if (!user || !password) {
    return NextResponse.json(
      {
        message: translateServer(
          language,
          "errors.session.credentialsEnvMissing",
        ),
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
    const axiosError = getAxiosResponseError(
      error,
      "errors.session.silentLoginFailed",
    );

    if (axiosError) {
      return NextResponse.json(
        {
          message: resolveServerMessage(
            language,
            axiosError.message,
            "errors.session.silentLoginFailed",
          ),
        },
        { status: axiosError.status },
      );
    }

    return NextResponse.json(
      {
        message: resolveServerMessage(
          language,
          error instanceof Error ? error.message : null,
          "errors.session.unexpectedSilentLogin",
        ),
      },
      { status: 500 },
    );
  }
}
