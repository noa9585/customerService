import axios from 'axios';

const baseURL = 'https://localhost:7260/api';

const axiosInstance = axios.create({ baseURL });

// ── Request interceptor ──────────────────────────────────────────────────────
// שולח את הטוקן הנכון: קודם בודק נציג, אחר כך לקוח
axiosInstance.interceptors.request.use((request) => {
  const repToken = localStorage.getItem('representativeToken');
  const custToken = localStorage.getItem('token');
  const token = repToken || custToken;

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// ── Response interceptor ─────────────────────────────────────────────────────
// הגרסה הקודמת בדקה status בתוך then — זה לא עובד כי Axios זורק שגיאה על 4xx/5xx
axiosInstance.interceptors.response.use(
  (response) => response, // תגובות תקינות — עבור הלאה
  (error) => {
    if (error.response?.status === 401) {
      // ניקוי טוקנים והפניה לדף כניסה מתאים
      const wasRep = !!localStorage.getItem('representativeToken');
      localStorage.removeItem('token');
      localStorage.removeItem('representativeToken');
      localStorage.removeItem('user');

      location.href = wasRep ? '/RepresentativeLogin' : '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from 'axios';

// const baseURL = 'https://localhost:7260/api';

// const axiosInstance = axios.create({ baseURL });

// axiosInstance.interceptors.request.use((request) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     request.headers.Authorization = `Bearer ${token}`;
//   }
//   return request;
// });

// axiosInstance.interceptors.response.use((response) => {
//   if (response.status === 401) {
//     location.href = '/login';
//   }
//   return response;
// });

// export default axiosInstance;