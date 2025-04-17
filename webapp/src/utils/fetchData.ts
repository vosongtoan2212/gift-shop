export const fetchData = async (
  path: string,
  method: string = "GET",
  headers: HeadersInit = {},
  body?: BodyInit | null,
  token?: string
) => {
  let res,
    data,
    errorMessage,
    isLoading = true;

  try {
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    };

    if (method !== "GET" && method !== "HEAD" && body) {
      requestOptions.body = body;
    }

    res = await fetch(path, requestOptions);
    data = await res.json();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "An error occurred";
  } finally {
    isLoading = false;
  }

  return { res, data, errorMessage, isLoading };
};
