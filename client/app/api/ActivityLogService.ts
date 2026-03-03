import axiosInstance from "../lib/axios";

export interface ActivityLogUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ActivityLog {
  id: number;
  user_id: number | null;
  action: string; // login | logout | create | update | delete | download
  module: string; // auth | documents | files | accounts
  record: string | null;
  description: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: ActivityLogUser;
}

export interface PaginatedActivityLogs {
  data: ActivityLog[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export class ActivityLogService {
  static async getLogs(params?: {
    search?: string;
    action?: string;
    module?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
  }) {
    const response = await axiosInstance.get<PaginatedActivityLogs>(
      "/api/activity-logs",
      { params },
    );
    return response.data;
  }
}
