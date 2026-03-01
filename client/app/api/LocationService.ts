import axiosInstance from "../lib/axios";

export interface Purok {
  id: number;
  barangay_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Barangay {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  puroks: Purok[];
}

export class LocationService {
  static async getBarangays(): Promise<Barangay[]> {
    const response = await axiosInstance.get<Barangay[]>("/api/barangays");
    return response.data;
  }
}
