export type UserRole = "DEVELOPER" | "DUENO" | "TRABAJADOR" | "USUARIO";

export interface User {
  id: string;
  name: string;
  carnet: string;
  role: UserRole;
  assignedStationId?: string; // ID del único surtidor que puede gestionar (Dueño o Trabajador)
  ownerId?: string;           // ID del Dueño que creó/asígnó al trabajador (si es TRABAJADOR)
}

export interface UserRecord extends User {
  password: string;
}

export interface LoginCredentials {
  carnet: string;
  password: string;
}