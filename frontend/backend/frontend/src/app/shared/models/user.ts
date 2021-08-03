import { UserRole } from "./role.enum";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  created: Date;
  userRole: UserRole;
  token?: string;
  currentHashedRefreshToken?: string;
}
