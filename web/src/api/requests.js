import { authKey, client } from "./const";

export async function login(formData) {
  const { username, password } = formData;
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
