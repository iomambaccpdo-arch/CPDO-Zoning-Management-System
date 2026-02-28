import axiosInstance from "../lib/axios";

export interface Role {
  id: number;
  name: string;
  code: number;
}

export interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  designation: string;
  section: string;
  roles: Role[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export class AccountService {
  static async getUsers(params?: {
    search?: string;
    page?: number;
    per_page?: number;
  }) {
    const response = await axiosInstance.get<PaginatedResponse<User>>(
      "/api/users",
      { params },
    );
    return response.data;
  }

  static async createUser(data: any) {
    const response = await axiosInstance.post<User>("/api/users", data);
    return response.data;
  }

  static async updateUser(id: number, data: any) {
    // Laravel might need POST with _method=PUT for multipart, but since we use JSON:
    const response = await axiosInstance.put<User>(`/api/users/${id}`, data);
    return response.data;
  }

  static async deleteUser(id: number) {
    const response = await axiosInstance.delete(`/api/users/${id}`);
    return response.data;
  }

  static async getRoles() {
    const response = await axiosInstance.get<Role[]>("/api/roles");
    return response.data;
  }
}
