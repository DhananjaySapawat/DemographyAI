import { backendUrl } from "@/src/config";
import createApi from "./createApi";

const monitorBackendApi = createApi({
  baseURL: `${backendUrl}/api/monitor`,
});

const monitorAuthBackendApi = createApi({
  baseURL: `${backendUrl}/auth/monitor`,
});

// ── Media ─────────────────────────────────────────────────────────────────────

export const getMediaList = () =>
  monitorBackendApi.get("/media");

export const getMediaById = (requestId: string) =>
  monitorBackendApi.get(`/media/${requestId}`);

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  username: string;
  password: string;
}

export const login = (credentials: LoginCredentials) =>
  monitorAuthBackendApi.post<{ message: string }>("/login", credentials);

export const logout = () =>
  monitorAuthBackendApi.post<{ message: string }>("/logout");

// ── System ────────────────────────────────────────────────────────────────────

export const getSystemStats  = () => monitorBackendApi.get("/system");
export const getProcessStats = () => monitorBackendApi.get("/system/process");
export const getSystemInfo   = () => monitorBackendApi.get("/system/info");