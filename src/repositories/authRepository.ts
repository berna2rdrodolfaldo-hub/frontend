import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";

import type {
  LoginCredentials,
  User,
  UserRecord,
} from "../types/auth";

const SESSION_KEY = "app_session";

const users = initialUsers as UserRecord[];

export const authRepository = {
  login(credentials: LoginCredentials): User | null {
    const foundUser = users.find(
      (user) =>
        user.carnet === credentials.carnet &&
        user.password === credentials.password
    );

    if (!foundUser) {
      return null;
    }

    // Mantenemos la misma estructura y añadimos los campos de vinculación al surtidor
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

  // FUNCIÓN NUEVA (No elimina ninguna existente):
  // Permite al Dueño registrar a sus empleados para su mismo surtidor
  addEmployee(newEmployee: UserRecord): boolean {
    const exists = users.some((u) => u.carnet === newEmployee.carnet);
    if (exists) return false;

    users.push(newEmployee);
    return true;
  },

  // FUNCIÓN NUEVA: Obtener la lista de empleados asignados a un Dueño/Surtidor específico
  getEmployeesByStation(stationId: string): User[] {
    return users.filter(
      (u) => u.role === "TRABAJADOR" && u.assignedStationId === stationId
    );
  },
};