import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";

import type {
  LoginCredentials,
  User,
  UserRecord,
  UserRole,
} from "../types/auth";

const SESSION_KEY = "app_session";
const USERS_STORAGE_KEY = "sas_users";

// Helper para inicializar y obtener usuarios con soporte para localStorage
const getUsersList = (): UserRecord[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Si hay error en el parseo, se recarga la lista base
    }
  }
  // Si no existe nada guardado en el navegador, se cargan los de users.json por defecto
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  return initialUsers as UserRecord[];
};

const saveUsersList = (usersList: UserRecord[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
};

export const authRepository = {
  getAllUsers(): UserRecord[] {
    return getUsersList();
  },

  login(credentials: LoginCredentials): User | null {
    const currentUsers = getUsersList();
    const foundUser = currentUsers.find(
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
      ownerId: foundUser.ownerId,
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

  createUser(newUser: UserRecord): boolean {
    const currentUsers = getUsersList();
    const exists = currentUsers.some((u) => u.carnet === newUser.carnet);
    if (exists) return false;

    const updated = [...currentUsers, newUser];
    saveUsersList(updated);
    return true;
  },

  updateUserRole(userId: string, newRole: UserRole, assignedStationId?: string): boolean {
    const currentUsers = getUsersList();
    const updated = currentUsers.map((u) => {
      if (u.id === userId) {
        return { ...u, role: newRole, assignedStationId };
      }
      return u;
    });
    saveUsersList(updated);
    return true;
  },

  addEmployee(newEmployee: UserRecord): boolean {
    return this.createUser(newEmployee);
  },

  getEmployeesByStation(stationId: string): User[] {
    const currentUsers = getUsersList();
    return currentUsers.filter(
      (u) => u.role === "TRABAJADOR" && String(u.assignedStationId) === String(stationId)
    );
  },
};