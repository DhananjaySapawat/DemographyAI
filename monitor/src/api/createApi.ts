// src/api/createApi.ts

type Params = Record<string, string | number | boolean | undefined>;
type ResponseType = "json" | "blob" | "text";

interface Config {
  params?: Params;
  headers?: Record<string, string>;
  responseType?: ResponseType;
}

interface CreateApiOptions {
  baseURL: string;
  getToken?: () => string | null;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export default function createApi({ baseURL, getToken }: CreateApiOptions) {
  async function request<T>(method: string, path: string, body?: unknown, config?: Config): Promise<{ data: T }> {
    const url = new URL(`${baseURL}${path}`);

    config?.params && Object.entries(config.params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });

    const token = getToken?.();

    const res = await fetch(url.toString(), {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...config?.headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(res.status, err.detail ?? err.message ?? res.statusText);
    }

    if (res.status === 204) return { data: undefined as T };
    if (config?.responseType === "blob") return { data: await res.blob() as T };
    if (config?.responseType === "text") return { data: await res.text() as T };
    return { data: await res.json() as T };
  }

  return {
    get:    <T>(path: string,                 config?: Config) => request<T>("GET",    path, undefined, config),
    post:   <T>(path: string, body?: unknown, config?: Config) => request<T>("POST",   path, body,      config),
    put:    <T>(path: string, body?: unknown, config?: Config) => request<T>("PUT",    path, body,      config),
    patch:  <T>(path: string, body?: unknown, config?: Config) => request<T>("PATCH",  path, body,      config),
    delete: <T>(path: string,                config?: Config)  => request<T>("DELETE", path, undefined, config),
  };
}