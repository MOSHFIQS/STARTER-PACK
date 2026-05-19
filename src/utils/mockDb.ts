import { UserProfile, AuthResponse, UserRole } from "@/types/auth";

export const mockDb = {
  // Mock Authentication Login
  mockLogin(email: string): AuthResponse {
    let role: UserRole = "SUPER_ADMIN";
    let name = "Moshfiqur Rahman";
    let permissions = ["users:read", "settings:write"];

    const emailLower = email.toLowerCase();
    if (emailLower.startsWith("more") || emailLower.includes("user")) {
      role = "USER";
      name = "Guest Explorer";
      permissions = ["users:read"];
    } else if (emailLower.startsWith("manager")) {
      role = "MANAGER";
      name = "Operations Manager";
      permissions = ["users:read"];
    }

    const mockUser: UserProfile = {
      id: role === "USER" ? "user-777" : role === "MANAGER" ? "manager-888" : "admin-999",
      name: name,
      email: email,
      role: role,
      avatarUrl: role === "USER" 
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" 
        : role === "MANAGER"
        ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80"
        : "https://avatars.githubusercontent.com/u/47231456?v=4",
      permissions: permissions,
      createdAt: new Date().toISOString(),
    };
    return {
      accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockTokenSecretKey_${role}`,
      data: mockUser,
    };
  },
};
