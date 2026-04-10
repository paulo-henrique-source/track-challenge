import axios from "axios";

export function getAxiosErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const response = error.response?.data;

  if (
    response &&
    typeof response === "object" &&
    "message" in response &&
    typeof response.message === "string"
  ) {
    return response.message;
  }

  const status = error.response?.status;

  return status ? `Silent login failed (${status})` : "Silent login failed";
}
