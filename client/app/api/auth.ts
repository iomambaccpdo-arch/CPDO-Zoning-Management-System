import axiosInstance from "../lib/axios";

export class Authentication {
  static async csrf() {
    return axiosInstance.get("/sanctum/csrf-cookie");
  }

  static async login(credentials: Record<string, string>) {
    await this.csrf();
    const response = await axiosInstance.post("/login", credentials);
    return response.data;
  }

  static async logout() {
    const response = await axiosInstance.post("/logout");
    return response.data;
  }

  static async me() {
    const response = await axiosInstance.get("/api/user");
    return response.data;
  }
}
