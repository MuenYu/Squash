import { authKey, client } from "./const";
import { redirect } from "react-router-dom";

export async function register({ username, password, email }) {
  console.log('Registering user:', { username, email });
  if (!username || !password || !email) {
    throw new Error("Please fill all fields");
  }
  const resp = await client.post("auth/register", {
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
    const resp = await client.post("auth/confirm", {
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
  if (!username || !password) {
    throw new Error("Username and password are required");
  }
  const resp = await client.post("auth/login", {
    json: { username, password },
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg || "Login failed");
  }

  const data = respData.data;

  if (data.challengeName === 'SOFTWARE_TOKEN_MFA') {
    return { requiresMFA: true, session: data.session, username };
  }
  localStorage.setItem(authKey, data.idToken);
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('username', username);
  return { requiresMFA: false, mfaEnabled: data.mfaEnabled };
}

function useAuthCheck(apiFunc) {
  return async function (...args) {
    const token = localStorage.getItem(authKey);
    if (!token) return redirect("auth/login");
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

// async function initCompressionTaskAPI(formData) {
//   const videoFile = formData.get("videoFile");
//   const videoName = formData.get("videoName").trim();

//   if (videoFile?.size === 0 && videoName?.length === 0)
//     throw new Error("Please upload or select a video to compress");
//   const resp = await client.post("common/videos/compress", {
//     body: formData,
//   });
//   const respData = await resp.json();
//   if (!resp.ok) {
//     throw new Error(respData.msg);
//   }
//   return respData.taskId;
// }
// export const initCompressionTask = useAuthCheck(initCompressionTaskAPI);

async function uploadAndCompressAPI(formData) {
  const videoFile = formData.get("videoFile");
  if (!videoFile?.size) {
    throw new Error("Please upload a video to compress");
  }
  
  const resp = await client.post("common/videos/compress", {
    body: formData,
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.msg;
}
export const uploadAndCompress = useAuthCheck(uploadAndCompressAPI);

async function compressExistingAPI(formData) {
  const videoName = formData.get("videoName");
  if (!videoName) {
    throw new Error("Please select a video to compress");
  }

  const resp = await client.post(`common/videos/${videoName}/compress`, {
    body: JSON.stringify({
      level: formData.get("level")
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.msg;
}
export const compressExisting = useAuthCheck(compressExistingAPI);

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
  const resp = await client.get("common/history");
  const history = await resp.json();
  if (!resp.ok) throw new Error(history.msg);
  return history.data
}
export const fetchHistory = useAuthCheck(fetchHistoryAPI);

async function fetchUploadVideoAPI() {
  const resp = await client.get("common/videos");
  const upload = await resp.json();
  if (!resp.ok) throw new Error(upload.msg);
  return upload.data;
}
export const fetchUploadVideo = useAuthCheck(fetchUploadVideoAPI)

async function videoDownloadAPI(fileName) {
  const resp = await client.get(`common/videos/${fileName}`);
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
  const resp = await client.post("auth/setup-mfa", {
    json: { accessToken },
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg || "MFA setup failed");
  }
  return respData.data.secretCode;
}

export async function verifyMFA(accessToken, userCode) {
  const resp = await client.post("auth/verify-mfa", {
    json: { accessToken, userCode },
  });
  if (!resp.ok) {
    const respData = await resp.json();
    throw new Error(respData.msg || "MFA verification failed");
  }
}

export async function verifyMFAChallenge({ username, session, mfaCode }) {
  const resp = await client.post("auth/verify-mfa-challenge", {
    json: { username, session, mfaCode },
  });
  const respData = await resp.json();
  const data = respData.data;
  if (!resp.ok) {
    throw new Error(respData.msg || "MFA verification failed");
  }
  localStorage.setItem(authKey, data.idToken);
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
}
