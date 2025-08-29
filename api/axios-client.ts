import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Tạo instance
const baseAxiosClient: AxiosInstance = axios.create({
  baseURL: 'https://68aad315909a5835049d1650.mockapi.io/api',
});

// Response interceptor
baseAxiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Directly return the data so you don't need .data in calls
    return response.data;
  },
  (error) => {
    // Optional: handle errors globally
    return Promise.reject(error);
  }
);

// Create a typed wrapper that returns the data directly
const axiosClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    baseAxiosClient.get(url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => baseAxiosClient.post(url, data, config),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => baseAxiosClient.put(url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    baseAxiosClient.delete(url, config),
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => baseAxiosClient.patch(url, data, config),
};

export default axiosClient;
