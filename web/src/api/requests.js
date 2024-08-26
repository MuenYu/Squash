import { authKey, client } from "./const";
import { redirect } from "react-router-dom";

export async function login(formData) {
  const username = formData.get("username").trim();
  const password = formData.get("password").trim();
  if (username?.length === 0 || password?.length === 0) {
    throw new Error("Empty username or password");
  }
  const resp = await client.post("users/login", {
    json: { username: username, password: password },
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return localStorage.setItem(authKey, respData.token);
}

function useAuthCheck(apiFunc) {
  return async function (...args) {
    const token = localStorage.getItem(authKey);
    if (!token) return redirect("/login");
    return await apiFunc(...args);
  };
}

async function initCompressionTaskAPI(formData) {
  const videoFile = formData.get("videoFile");
  const videoName = formData.get("videoName").trim();

  if (videoFile?.size === 0 && videoName?.length === 0)
    throw new Error("Please upload or select a video to compress");
  const resp = await client.post("videos/compress", {
    body: formData,
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.taskId;
}
export const initCompressionTask = useAuthCheck(initCompressionTaskAPI);

async function fetchProgressAPI(taskId) {
  const resp = await client.get(`videos/progress/${taskId}`);
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.progress;
}
export const fetchProgress = useAuthCheck(fetchProgressAPI);

async function fetchVideoListAPI() {
  const resp = await client.get("videos");
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.data;
}
export const fetchVideoList = useAuthCheck(
  fetchVideoListAPI
);

async function videoDownloadAPI(fileName) {
  const resp = await client.get(`videos/${fileName}`);
  if (!resp.ok) {
    const respData = await resp.json();
    throw new Error(respData.msg);
  }
  return await resp.blob();
}
export const videoDownload = useAuthCheck(videoDownloadAPI);
