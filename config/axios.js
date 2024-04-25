import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_KEY,
});

// request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("chat_access_token");
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// KYC INSTANCE
export const kycInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_KYC_API_KEY,
  headers: {
    Authorization: "Basic bmFhc2FhcGk6cEpSMlliVTBpSVpadlJoQ0J1amg=",
  },
});

//Blog Instance
export const blogInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BLOG_URL,
});

// Nepse Instance
export const nepseInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEPSE_URL,
});

//CI Instance
export const CiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CI_URL,
});
