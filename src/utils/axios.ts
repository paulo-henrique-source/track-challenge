import axios from "axios";

export function getAxiosErrorMessage(
  error: unknown,
  fallbackMessage = "errors.generic.requestFailed",
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

  return fallbackMessage;
}
