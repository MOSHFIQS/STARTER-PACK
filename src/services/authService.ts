import api from "./api";
import { LoginCredentials, AuthResponse, UserProfile } from "@/types/auth";

export const authService = {
  /**
   * Log in user with email and password credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/admin/login", credentials);
    return response.data;
  },

  /**
   * Fetch current authenticated user's details
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<{ data: UserProfile }>("/admin/profile");
    return response.data.data;
  },

  /**
   * Log out current user (calls server endpoint if needed)
   */
  async logout(): Promise<void> {
    await api.post("/admin/logout");
  },
};
