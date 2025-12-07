import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	//  MODIFIÉ - Sauvegarde les tokens dans localStorage
	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}

		try {
			const res = await axios.post("/auth/signup", { name, email, password });
			
			//  AJOUTÉ - Sauvegarde les tokens dans localStorage
			if (res.data.accessToken) {
				localStorage.setItem('accessToken', res.data.accessToken);
			}
			if (res.data.refreshToken) {
				localStorage.setItem('refreshToken', res.data.refreshToken);
			}
			
			set({ user: res.data.user, loading: false });
			toast.success("Account created successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},

	// MODIFIÉ - Sauvegarde les tokens dans localStorage
	login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/login", { email, password });

			//  AJOUTÉ - Sauvegarde les tokens dans localStorage
			if (res.data.accessToken) {
				localStorage.setItem('accessToken', res.data.accessToken);
			}
			if (res.data.refreshToken) {
				localStorage.setItem('refreshToken', res.data.refreshToken);
			}

			set({ user: res.data.user, loading: false });
			toast.success("Logged in successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},

	// MODIFIÉ - Efface aussi localStorage
	logout: async () => {
		try {
			await axios.post("/auth/logout");
			
			// ✅ AJOUTÉ - Efface localStorage
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			
			set({ user: null });
			toast.success("Logged out successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	// ✅ MODIFIÉ - Utilise le token depuis localStorage
	checkAuth: async () => {
		// Vérifie si le token existe
		const token = localStorage.getItem('accessToken');
		
		if (!token) {
			set({ user: null, checkingAuth: false });
			return;
		}

		try {
			const response = await axios.get('/auth/profile');
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.error('Auth check failed:', error);
			// Si le token est expiré, efface localStorage
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			set({ user: null, checkingAuth: false });
		}
	},

	//  Utilise refreshToken depuis localStorage
	refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const refreshToken = localStorage.getItem('refreshToken');
			
			if (!refreshToken) {
				throw new Error('No refresh token');
			}

			const response = await axios.post("/auth/refresh-token", { 
				refreshToken // - Envoie le refreshToken dans le body
			});
			
			//- Sauvegarde le nouveau accessToken
			if (response.data.accessToken) {
				localStorage.setItem('accessToken', response.data.accessToken);
			}
			
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			// Efface localStorage si le refresh échoue
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);