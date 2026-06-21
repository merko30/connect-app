import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type RequestOptions = {
  method?: string;
  body?: any;
};

export async function api<T>(
  path: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  const token = await AsyncStorage.getItem("token");

  const isFormData = body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(["POST", "PUT", "PATCH"].includes(method)
      ? {
          body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        }
      : {}),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw error ?? new Error("API error");
  }

  return res.json();
}
