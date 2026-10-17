export type UserRole = "DEVELOPER" | "ADMIN" | "USUARIO";

export interface User {
  id: string;
  name: string;
  carnet: string;
  role: UserRole;
  assignedStationId?: string; // Surtidor asignado (si es Administrador)
  adminId?: string;           // ID del Administrador a cargo (si es Usuario/Trabajador)
}

export interface UserRecord extends User {
  password: string;
}

export interface LoginCredentials {
  carnet: string;
  password: string;
}