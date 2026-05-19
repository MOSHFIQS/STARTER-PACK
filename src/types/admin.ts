import { Role } from "./role";


export type Admin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password:string;
  nationalId: string;
  addressLine: string;
  image: string | null;
  roleId: string;
  role: Role;
  status: "pending" | "active" | "inactive" |"deleted" 
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};



export type AllAdmins = {
     data: Admin[]
     total: number
     page: number
     limit: number
};

