import { Dashboard } from "../entities/Dashboard";

export interface IDashboardRepository {
  getDashboard(): Promise<Dashboard>;
}