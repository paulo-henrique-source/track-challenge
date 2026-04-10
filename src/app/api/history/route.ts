import axios from "axios";
import { NextResponse } from "next/server";

import { historyRequestSchema } from "@/schemas/historySchema";
import { getAxiosResponseError } from "@/utils/silentSession";

export async function POST(request: Request) {
  const endpoint = process.env.HISTORY_URL;

  if (!endpoint) {
    return NextResponse.json(
      { message: "HISTORY_URL is not configured" },
      { status: 500 },
    );
  }

  const user = process.env.SILENT_SESSION_USER;

  if (user == null || user.length === 0) {
    return NextResponse.json(
      { message: "SILENT_SESSION_USER must be configured" },
      { status: 500 },
    );
  }

  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const parsedRequest = historyRequestSchema.safeParse(body);

  if (parsedRequest.success === false) {
    return NextResponse.json(
      { message: "Invalid history request payload" },
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
    const axiosError = getAxiosResponseError(error, "History request failed");

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
            : "Unexpected history request error",
      },
      { status: 500 },
    );
  }
}
