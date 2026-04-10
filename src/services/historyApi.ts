import axios from "axios";

import { INTERNAL_HISTORY_ENDPOINT } from "@/consts";
import { historyResponseSchema } from "@/schemas/historySchema";
import type { HistoryRequest, HistoryResponse } from "@/types/history";
import { getAxiosErrorMessage } from "@/utils/axios";

export async function requestHistory(
  payload: HistoryRequest,
): Promise<HistoryResponse> {
  try {
    const { data } = await axios.post(INTERNAL_HISTORY_ENDPOINT, payload);

    const parsedResponse = historyResponseSchema.safeParse(data);

    if (parsedResponse.success === false) {
      throw new Error("Invalid history response payload");
    }

    return parsedResponse.data;
  } catch (error) {
    const message = getAxiosErrorMessage(error, "History request failed");

    if (message) {
      throw new Error(message);
    }

    throw error instanceof Error
      ? error
      : new Error("Unexpected history request error");
  }
}
