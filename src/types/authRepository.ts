import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";

import type {
  LoginCredentials,
  User,
  UserRecord,
  UserRole,
} from "../types/auth";

const SESSION_KEY = "app_session";
const USERS_KEY = "sas_users";

export const authRepository = {
  // Obtener la lista completa de usuarios
  getAllUsers(): UserRecord[] {
    const savedUsers = storageService.get<UserRecord[]>(USERS_KEY);
    
    // Si no hay usuarios o el arreglo está vacío, forzar la carga desde users.json
    if (!savedUsers || !Array.isArray(savedUsers) || savedUsers.length === 0) {
      const defaultUsers = initialUsers as UserRecord[];
      storageService.set<UserRecord[]>(USERS_KEY, defaultUsers);
      return defaultUsers;
    }
    return savedUsers;
  },

  // Crear un nuevo usuario en la plataforma
  createUser(newUserData: Omit<UserRecord, "id"> | UserRecord): UserRecord {
    const users = this.getAllUsers();
    
    const newUser: UserRecord = {
      ...newUserData,
      id: "id" in newUserData && newUserData.id ? newUserData.id : String(Date.now()),
    };

    // Evitar duplicados por id o carnet
    const filteredUsers = users.filter((u) => u.carnet !== newUser.carnet);
    const updatedUsers = [...filteredUsers, newUser];
    
    storageService.set<UserRecord[]>(USERS_KEY, updatedUsers);
    return newUser;
  },

  login(credentials: LoginCredentials): User | null {
    const users = this.getAllUsers();
    const foundUser = users.find(
      (user) =>
        user.carnet === credentials.carnet &&
        user.password === credentials.password
    );

    if (!foundUser) {
      return null;
    }

    const sessionUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      carnet: foundUser.carnet,
      role: foundUser.role,
      assignedStationId: foundUser.assignedStationId,
      adminId: foundUser.adminId,
    };

    storageService.set<User>(SESSION_KEY, sessionUser);
    return sessionUser;
  },

  getCurrentUser(): User | null {
    return storageService.get<User>(SESSION_KEY);
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  logout(): void {
    storageService.remove(SESSION_KEY);
  },

  updateUserRole(userId: string, newRole: UserRole, assignedStationId?: string): boolean {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== "DEVELOPER") {
      console.warn("Permiso denegado: Solo el Desarrollador puede cambiar roles.");
      return false;
    }

    const users = this.getAllUsers();
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        if (u.role === "DEVELOPER") return u;

        return {
          ...u,
          role: newRole,
          assignedStationId: newRole === "ADMIN" ? assignedStationId : undefined,
          adminId: newRole === "ADMIN" ? undefined : u.adminId,
        };
      }
      return u;
    });

    storageService.set<UserRecord[]>(USERS_KEY, updatedUsers);

    if (currentUser && currentUser.id === userId) {
      const updatedSession: User = {
        ...currentUser,
        role: newRole,
        assignedStationId: newRole === "ADMIN" ? assignedStationId : undefined,
      };
      storageService.set<User>(SESSION_KEY, updatedSession);
    }

    return true;
  },

  assignWorkerToAdmin(workerUserId: string, adminId?: string): void {
    const users = this.getAllUsers();
    const updatedUsers = users.map((u) =>
      u.id === workerUserId ? { ...u, adminId } : u
    );
    storageService.set<UserRecord[]>(USERS_KEY, updatedUsers);
  },

  getWorkersByAdmin(adminId: string): UserRecord[] {
    const users = this.getAllUsers();
    return users.filter((u) => u.adminId === adminId);
  }
};