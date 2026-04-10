import axios from "axios";

export function getAxiosErrorMessage(
  error: unknown,
  fallbackMessage = "Request failed",
) {
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

  return status ? `${fallbackMessage} (${status})` : fallbackMessage;
}
