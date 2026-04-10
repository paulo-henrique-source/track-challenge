import axios from "axios";

import type { HistoryRequest } from "@/src/types/history";
import { getAxiosErrorMessage } from "@/src/utils/axios";

const INTERNAL_HISTORY_ENDPOINT = "/api/history";

export async function requestHistory(payload: HistoryRequest): Promise<unknown> {
  try {
    const { data } = await axios.post(INTERNAL_HISTORY_ENDPOINT, payload);
    return data;
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
