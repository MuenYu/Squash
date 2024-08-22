import ky from "ky";

const authKey = "auth";
const baseURL = "http://localhost:3000/api";

const client = ky.create({
  prefixUrl: baseURL,
  throwHttpErrors: false,
  headers: () => {
    const token = localStorage.getItem(authKey);
    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  },
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          localStorage.removeItem(authKey);
        }
      },
    ],
  },
});

export { authKey, client };
