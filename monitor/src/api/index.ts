import { backendUrl } from "@/src/config";
import createApi from "./createApi";

const monitorBackendApi = createApi({
  baseURL: `${backendUrl}/api/monitor`,
});

export const getMediaList = () =>
  monitorBackendApi.get("/media");

export const getMediaById = (requestId: string) =>
  monitorBackendApi.get(`/media/${requestId}`);


