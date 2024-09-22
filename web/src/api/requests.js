import { authKey, client } from "./const";
import { redirect } from "react-router-dom";

export async function register({ username, password, email }) {
  console.log('Registering user:', { username, email });
  if (!username || !password || !email) {
    throw new Error("Please fill all fields");
  }
  const resp = await client.post("users/register", {
    json: { username, password, email },
  });
  if (!resp.ok) {
    const respData = await resp.json();
    throw new Error(respData.msg || "Registration failed");
  }
}

export async function confirmRegistration(username, code) {
  console.log('Confirming registration:', { username, code });
  if (!username || !code) {
    throw new Error("Username and verification code are required");
  }
  try {
    const resp = await client.post("users/confirm", {
      json: { username, code },
    });
    if (!resp.ok) {
      const respData = await resp.json();
      throw new Error(respData.msg || "Confirmation failed");
    }
    return resp.json();
  } catch (error) {
    console.error('Confirmation error:', error);
    throw error;
  }
}


export async function login({ username, password }) {
  console.log('Logging in user:', { username });
  if (!username || !password) {
    throw new Error("Username and password are required");
  }
  const resp = await client.post("users/login", {
    json: { username, password },
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg || "Login failed");
  }
  if (respData.challengeName === 'SOFTWARE_TOKEN_MFA') {
    return { requiresMFA: true, session: respData.session, username };
  }
  localStorage.setItem(authKey, respData.idToken);
  localStorage.setItem('accessToken', respData.accessToken);
  localStorage.setItem('refreshToken', respData.refreshToken);
  localStorage.setItem('username', username);
  return { requiresMFA: false, mfaEnabled: respData.mfaEnabled };
}

function useAuthCheck(apiFunc) {
  return async function (...args) {
    const token = localStorage.getItem(authKey);
    if (!token) return redirect("/login");
    try {
      return await apiFunc(...args);
    } catch (error) {
      if (error.message.includes("Invalid token") || error.message.includes("Token expired")) {
        localStorage.removeItem(authKey);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return redirect("/login");
      }
      throw error;
    }
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

async function fetchHistoryAPI() {
  const resp = await client.get("videos/history");
  const history = await resp.json();
  if (!resp.ok) throw new Error(history.msg);
  return history.data
}
export const fetchHistory = useAuthCheck(fetchHistoryAPI);

async function fetchUploadVideoAPI() {
  const resp = await client.get("videos/upload");
  const upload = await resp.json();
  if (!resp.ok) throw new Error(upload.msg);
  return upload.data;
}
export const fetchUploadVideo = useAuthCheck(fetchUploadVideoAPI)

async function videoDownloadAPI(fileName) {
  const resp = await client.get(`videos/${fileName}`);
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData;
}
export const videoDownload = useAuthCheck(videoDownloadAPI);

async function detailAPI(videoName) {
  if (!videoName) throw new Error("no video name");
  const resp = await client.get(`videos/detail/${videoName}`)
  const detail = await resp.json()
  if (!resp.ok) throw new Error(detail.msg || "get detail failed");
  return detail.data
}
export const detail = useAuthCheck(detailAPI);

export async function setupMFA(accessToken) {
  const resp = await client.post("users/setup-mfa", {
    json: { accessToken },
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg || "MFA setup failed");
  }
  return respData.secretCode;
}

export async function verifyMFA(accessToken, userCode) {
  const resp = await client.post("users/verify-mfa", {
    json: { accessToken, userCode },
  });
  if (!resp.ok) {
    const respData = await resp.json();
    throw new Error(respData.msg || "MFA verification failed");
  }
}

export async function verifyMFAChallenge({ username, session, mfaCode }) {
  const resp = await client.post("users/verify-mfa-challenge", {
    json: { username, session, mfaCode },
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg || "MFA verification failed");
  }
  localStorage.setItem(authKey, respData.idToken);
  localStorage.setItem('accessToken', respData.accessToken);
  localStorage.setItem('refreshToken', respData.refreshToken);
}

export async function exchangeGoogleToken(code) {
  const resp = await client.post("users/google", { json: { code } });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || "Failed to authenticate with Google");
  }
  // Store tokens in localStorage
  localStorage.setItem(authKey, data.idToken);
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data;
}

export const initiateGoogleSignIn = async () => {
  try {
    const resp = await client.get("users/google-signin-url");
    if (!resp.ok) {
      const respData = await resp.json();
      throw new Error(respData.msg || "Failed to initiate Google Sign-In");
    }
    const { url } = await resp.json();
    window.location.href = url;
  } catch (error) {
    console.error('Failed to initiate Google Sign-In:', error);
    throw error;
  }
};