import { redirect } from "react-router-dom";
import { authKey, client } from "./const";

export function homeLoader() {
  const jwt = localStorage.getItem(authKey);
  if (!jwt) return redirect("/login");
  return null;
}

export function loginLoader() {
  const jwt = localStorage.getItem(authKey);
  if (jwt) return redirect("/");
  return null;
}

export async function progressLoader(taskId) {
  const resp = await client.get(`videos/progress/${taskId}`);
  const respData = await resp.json()
  if (!resp.ok) {
    throw new Error(respData.msg)
  }
  return respData.msg
}
