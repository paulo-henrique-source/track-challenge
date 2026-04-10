import axios from "axios";
import { NextResponse } from "next/server";

import {
  getRequestLanguage,
  resolveServerMessage,
  translateServer,
} from "@/i18n/server";
import { historyRequestSchema } from "@/schemas/historySchema";
import { getAxiosResponseError } from "@/utils/silentSession";

const DEFAULT_HISTORY_URL =
  "https://lifegestaodefrota.com.br/lifeweb/api/historico";

export async function POST(request: Request) {
  const language = getRequestLanguage(request);
  const endpoint = process.env.HISTORY_URL?.trim() || DEFAULT_HISTORY_URL;

  const user = process.env.SILENT_SESSION_USER;

  if (user == null || user.length === 0) {
    return NextResponse.json(
      { message: translateServer(language, "errors.session.userEnvMissing") },
      { status: 500 },
    );
  }

  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: translateServer(language, "errors.history.invalidJsonPayload") },
      { status: 400 },
    );
  }

  const parsedRequest = historyRequestSchema.safeParse(body);

  if (parsedRequest.success === false) {
    return NextResponse.json(
      {
        message: translateServer(
          language,
          "errors.history.invalidHistoryRequestPayload",
        ),
      },
      { status: 400 },
    );
  }

  const { inicio, fim, tipos_pacotes, veiccodigo, token } = parsedRequest.data;

  try {
    const response = await axios.post(endpoint, {
      inicio,
      fim,
      tipos_pacotes,
      veiccodigo,
      usuario: user,
      token,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    const axiosError = getAxiosResponseError(
      error,
      "errors.history.requestFailed",
    );

    if (axiosError) {
      return NextResponse.json(
        {
          message: resolveServerMessage(
            language,
            axiosError.message,
            "errors.history.requestFailed",
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
          "errors.history.unexpectedHistoryRequest",
        ),
      },
      { status: 500 },
    );
  }
}
