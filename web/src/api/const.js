import ky from "ky";

const authKey = "auth";
const accessToken = "accessToken";
const refreshToken = "refreshToken";
const baseURL = import.meta.env.VITE_API ?? "/api";

const client = ky.create({
  prefixUrl: baseURL,
  throwHttpErrors: false,
  timeout: 120000,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem(authKey);
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        } else {
          request.headers.delete("Authorization");
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          localStorage.removeItem(authKey);
          localStorage.removeItem(accessToken);
          localStorage.removeItem(refreshToken);
        }
      },
    ],
  },
});

export { authKey, accessToken, refreshToken, client };
