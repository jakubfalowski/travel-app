type RequestMethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ClientOptions = {
  data?: Record<string, unknown> | string;
  headers?: Record<string, string>;
  method?: RequestMethodType;
} & RequestInit;

async function client(
  endpoint: string,
  {
    data: requestData,
    headers: customHeaders,
    ...customConfig
  }: ClientOptions = {}
) {
  const headers: Record<string, string> = {};

  headers["x-rapidapi-host"] = "booking-com15.p.rapidapi.com";
  headers["x-rapidapi-key"] = process.env.REACT_APP_BOOKING_API_KEY || "";

  if (requestData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method: requestData ? "POST" : "GET",
    body: requestData ? JSON.stringify(requestData) : undefined,
    headers: {
      ...headers,
      ...customHeaders,
    },
    ...customConfig,
  };

  const response = await window.fetch(endpoint, config);

  const data = await response.json().catch(() => null);
  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}

export { client };
