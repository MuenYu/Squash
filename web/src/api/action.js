import { redirect } from "react-router-dom";
import { authKey, client } from "./const";

export async function loginAction({ request }) {
  const formData = await request.formData();
  const username = formData.get("username").trim();
  const password = formData.get("password").trim();

  if (username?.length === 0 || password?.length === 0) {
    return { error: "Empty username or password" };
  }

  const resp = await client.post("users/login", {
    json: { username: username, password: password },
  });
  const respData = await resp.json();
  if (!resp.ok) {
    return { error: `${respData.msg}` };
  }
  localStorage.setItem(authKey, respData.token);
  return redirect("/");
}

export async function initTaskAction({ request }) {
  const formData = await request.formData();
  const videoFile = formData.get("videoFile");

  if (videoFile?.size === 0)
    return { error: `Please upload a video to compress` };
  if (videoFile.size >= 52428800)
    return { error: `Please upload a video no longer than 50 MB` };

  const resp = await client.post("videos/compress", {
    body: formData,
  });
  const respData = await resp.json();
  if (!resp.ok) {
    return {error: `${respData.msg}`}
  }
  return {taskId: `${respData.msg}`};
}
