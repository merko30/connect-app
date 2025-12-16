import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function api<T>(
  path: string,
  { method = "GET", body }: RequestOptions = {}
): Promise<T> {
  const token = await AsyncStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(method === "POST"
      ? { body: body ? JSON.stringify(body) : undefined }
      : {}),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw error ?? new Error("API error");
  }

  return res.json();
}
