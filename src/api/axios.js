// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api/", // Make sure ye port aapke django se match karta ho
// });

// // REQUEST INTERCEPTOR: Har request me token attach karne ke liye
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // RESPONSE INTERCEPTOR: Global Error Handling ke liye (Jaise 401 Token Expired)
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Agar error 401 (Unauthorized) hai, matlab token expire ho gaya ya galat hai
//     if (error.response && error.response.status === 401) {
//       console.warn("Session Expired. Logging out user...");

//       // 1. Storage se purane/kharaab tokens hata do
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       localStorage.removeItem("user_role");
//       localStorage.removeItem("username");

//       // 2. User ko batao ki login phir se karna padega
//       alert("Session Expired! Please login again.");

//       // 3. Seedha Login page par redirect kar do (Maan ke chal raha hu '/' aapka login route hai)
//       window.location.href = "/";
//     }

//     return Promise.reject(error);
//   },
// );

// export default api;

import axios from "axios";

const api = axios.create({
   baseURL: "https://smg-erp.duckdns.org/api/",
   // baseURL: "http://localhost:8000/api/",
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // FIX YAHAN HAI: Agar URL me 'login' likha hai, toh Session Expire wala code mat chalao!
      if (
        error.config &&
        error.config.url &&
        error.config.url.includes("login")
      ) {
        return Promise.reject(error); // Wapas login page ko error de do
      }

      console.warn("Session Expired. Logging out user...");

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("username");

      alert("Session Expired! Please login again.");
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default api;