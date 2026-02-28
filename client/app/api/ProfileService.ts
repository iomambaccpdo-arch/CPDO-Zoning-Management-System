import axiosInstance from "../lib/axios";
import type { User } from "~/store/auth";

export class ProfileService {
  static async updateProfile(data: any) {
    const response = await axiosInstance.put<User>("/api/profile", data);
    return response.data;
  }
}
