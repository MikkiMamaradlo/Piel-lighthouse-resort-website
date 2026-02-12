import type { ObjectId } from "mongodb"

// Department definitions
export type Department = 
  | "Front Desk"
  | "Housekeeping"
  | "Food & Beverage"
  | "Maintenance"
  | "Activities"
  | "Management"

// Department-specific roles
export type RoleByDepartment = 
  // Front Desk roles
  | "front_desk_agent"
  | "front_desk_supervisor"
  | "front_desk_manager"
  // Housekeeping roles
  | "housekeeper"
  | "housekeeping_supervisor"
  | "housekeeping_manager"
  // Food & Beverage roles
  | "server"
  | "bartender"
  | "fnb_supervisor"
  | "fnb_manager"
  // Maintenance roles
  | "maintenance_technician"
  | "maintenance_supervisor"
  | "maintenance_manager"
  // Activities roles
  | "activity_guide"
  | "activities_supervisor"
  | "activities_manager"
  // Management roles
  | "general_manager"
  | "assistant_manager"

// Legacy role types for backward compatibility
export type LegacyRole = "staff" | "manager" | "admin"

export interface Staff {
  _id?: ObjectId
  username: string
  email: string
  password: string
  fullName: string
  department: Department | string
  role: RoleByDepartment | LegacyRole
  phone: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Department to default role mapping
export const DEPARTMENT_ROLES: Record<Department, RoleByDepartment[]> = {
  "Front Desk": ["front_desk_agent", "front_desk_supervisor", "front_desk_manager"],
  "Housekeeping": ["housekeeper", "housekeeping_supervisor", "housekeeping_manager"],
  "Food & Beverage": ["server", "bartender", "fnb_supervisor", "fnb_manager"],
  "Maintenance": ["maintenance_technician", "maintenance_supervisor", "maintenance_manager"],
  "Activities": ["activity_guide", "activities_supervisor", "activities_manager"],
  "Management": ["assistant_manager", "general_manager"],
}

// Permission levels for each role
export const ROLE_PERMISSIONS: Record<RoleByDepartment | LegacyRole, {
  canManageStaff: boolean
  canManageBookings: boolean
  canManageRooms: boolean
  canManageGuests: boolean
  canViewReports: boolean
  canManageAttendance: boolean
  canAccessAllDepartments: boolean
}> = {
  // Front Desk roles
  "front_desk_agent": { canManageStaff: false, canManageBookings: true, canManageRooms: false, canManageGuests: true, canViewReports: false, canManageAttendance: false, canAccessAllDepartments: false },
  "front_desk_supervisor": { canManageStaff: false, canManageBookings: true, canManageRooms: true, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: false },
  "front_desk_manager": { canManageStaff: true, canManageBookings: true, canManageRooms: true, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: true },
  // Housekeeping roles
  "housekeeper": { canManageStaff: false, canManageBookings: false, canManageRooms: true, canManageGuests: false, canViewReports: false, canManageAttendance: false, canAccessAllDepartments: false },
  "housekeeping_supervisor": { canManageStaff: true, canManageBookings: false, canManageRooms: true, canManageGuests: false, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: false },
  "housekeeping_manager": { canManageStaff: true, canManageBookings: true, canManageRooms: true, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: true },
  // Food & Beverage roles
  "server": { canManageStaff: false, canManageBookings: false, canManageRooms: false, canManageGuests: true, canViewReports: false, canManageAttendance: false, canAccessAllDepartments: false },
  "bartender": { canManageStaff: false, canManageBookings: false, canManageRooms: false, canManageGuests: true, canViewReports: false, canManageAttendance: false, canAccessAllDepartments: false },
  "fnb_supervisor": { canManageStaff: true, canManageBookings: false, canManageRooms: false, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: false },
  "fnb_manager": { canManageStaff: true, canManageBookings: true, canManageRooms: true, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: true },
  // Maintenance roles
  "maintenance_technician": { canManageStaff: false, canManageBookings: false, canManageRooms: true, canManageGuests: false, canViewReports: false, canManageAttendance: false, canAccessAllDepartments: false },
  "maintenance_supervisor": { canManageStaff: true, canManageBookings: false, canManageRooms: true, canManageGuests: false, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: false },
  "maintenance_manager": { canManageStaff: true, canManageBookings: true, canManageRooms: true, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: true },
  // Activities roles
  "activity_guide": { canManageStaff: false, canManageBookings: false, canManageRooms: false, canManageGuests: true, canViewReports: false, canManageAttendance: false, canAccessAllDepartments: false },
  "activities_supervisor": { canManageStaff: true, canManageBookings: false, canManageRooms: false, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: false },
  "activities_manager": { canManageStaff: true, canManageBookings: true, canManageRooms: true, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: true },
  // Management roles
  "general_manager": { canManageStaff: true, canManageBookings: true, canManageRooms: true, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: true },
  "assistant_manager": { canManageStaff: true, canManageBookings: true, canManageRooms: true, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: true },
  // Legacy roles (backward compatibility)
  "staff": { canManageStaff: false, canManageBookings: false, canManageRooms: false, canManageGuests: false, canViewReports: false, canManageAttendance: false, canAccessAllDepartments: false },
  "manager": { canManageStaff: true, canManageBookings: true, canManageRooms: true, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: true },
  "admin": { canManageStaff: true, canManageBookings: true, canManageRooms: true, canManageGuests: true, canViewReports: true, canManageAttendance: true, canAccessAllDepartments: true },
}
