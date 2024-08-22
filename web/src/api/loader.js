import { redirect } from "react-router-dom";
import { authKey } from "./const";

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
