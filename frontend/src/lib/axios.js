// import axios from "axios";

// const axiosInstance = axios.create({
// 	baseURL: "https://daisy-mern-e-commerce.onrender.com/api",
// 	withCredentials: true,
// });

// axiosInstance.interceptors.response.use(
// 	(response) => response,
// 	(error) => {
// 		console.error("API Error:", {
// 			message: error.message,
// 			status: error.response?.status,
// 			data: error.response?.data,
// 			url: error.config?.url,
// 		});
// 		return Promise.reject(error);
// 	}
// );

// export default axiosInstance;
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://daisy-mern-e-commerce.onrender.com/api",
	withCredentials: true,
});
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", {
			message: error.message,
			status: error.response?.status,
			data: error.response?.data,
			url: error.config?.url,
		});
		return Promise.reject(error);
	}
);

export default axiosInstance;