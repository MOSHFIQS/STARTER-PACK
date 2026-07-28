export type UserRole = "SUPER_ADMIN" | "ADMIN" | "CUSTOMER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface User {
     id: string;
     email: string;
     phone?: string | null;
     firstName: string;
     lastName: string;
     fullName: string;
     role: UserRole;
     status: UserStatus;
     avatarUrl?: string | null;
     bio?: string | null;
     address?: string | null;
     city?: string | null;
     country?: string | null;
     postalCode?: string | null;
     dateOfBirth?: string | null;
     gender?: string | null;
     emailVerified?: boolean;
     phoneVerified?: boolean;
     lastLoginAt?: string | null;
     lastLoginIp?: string | null;
     lastDevice?: string | null;
     createdAt?: string;
     updatedAt?: string;
}

// Auth responses no longer carry tokens — the JWT is set as an HttpOnly
// cookie by the backend and is never exposed to JavaScript.
export interface LoginResponse {
     user: User;
}

export interface RegisterResponse {
     user: User;
}
