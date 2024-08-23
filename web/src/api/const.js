import ky from "ky";

const authKey = "auth";
const baseURL = "http://localhost:3000/api";

const client = ky.create({
  prefixUrl: baseURL,
  throwHttpErrors: false,
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
        }
      },
    ],
  },
});

export { authKey, client };
