import { authKey, client } from "./const";

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

export async function initCompressionTask(formData) {
  const videoFile = formData.get("videoFile");

  if (videoFile?.size === 0)
    throw new Error("Please upload a video to compress");
  const resp = await client.post("videos/compress", {
    body: formData,
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.taskId;
}

export async function fetchProgress(taskId) {
  const resp = await client.get(`videos/progress/${taskId}`);
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.progress;
}

export async function fetchCompressedVideoList() {
  const resp = await client.get("videos");
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.data;
}

export async function videoDownload(fileName) {
  const resp = await client.get(`videos/${fileName}`)
  if (!resp.ok) {
    const respData = await resp.json();
    throw new Error(respData.msg)
  }
  return await resp.blob()
}