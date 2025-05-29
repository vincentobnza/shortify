export function ErrorResponse(error: Error | string, status: number = 500) {
  const message =
    typeof error === "string" ? error : error.message || "Something went wrong";

  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function SuccessResponse<T>(data: T, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
