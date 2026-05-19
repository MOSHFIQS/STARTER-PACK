export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "USER";

export interface UserPermission {
  id: string;
  name: string;
  code: string; // e.g., 'products:create'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  permissions?: string[];
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  data: UserProfile;
}
