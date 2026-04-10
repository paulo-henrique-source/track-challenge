import axios from "axios";

export function getAxiosErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const responsePayload = error.response?.data;

  if (
    responsePayload &&
    typeof responsePayload === "object" &&
    "message" in responsePayload &&
    typeof responsePayload.message === "string"
  ) {
    return responsePayload.message;
  }

  const status = error.response?.status;

  return status ? `Silent login failed (${status})` : "Silent login failed";
}
