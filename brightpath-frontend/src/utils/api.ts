import axios from "axios";

type ApiErrorResponse = {
  message?: string;
  error?: string;
  status?: number;
};

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseMessage = error.response?.data?.message;
    if (responseMessage) {
      return responseMessage;
    }

    if (error.response?.status) {
      return `${fallbackMessage} (${error.response.status})`;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
