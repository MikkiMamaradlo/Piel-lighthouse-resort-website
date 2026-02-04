import { ROLE_PERMISSIONS, type RoleByDepartment, type LegacyRole } from "@/backend/lib/schemas/staff"

export interface UserPermissions {
  canManageStaff: boolean
  canManageBookings: boolean
  canManageRooms: boolean
  canManageGuests: boolean
  canViewReports: boolean
  canManageAttendance: boolean
  canAccessAllDepartments: boolean
}

/**
 * Get permissions for a given role
 */
export function getPermissions(role: string | RoleByDepartment | LegacyRole): UserPermissions {
  const permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]
  
  if (permissions) {
    return permissions
  }
  
  // Default permissions for unknown roles (no access)
  return {
    canManageStaff: false,
    canManageBookings: false,
    canManageRooms: false,
    canManageGuests: false,
    canViewReports: false,
    canManageAttendance: false,
    canAccessAllDepartments: false,
  }
}

/**
 * Check if user has permission for a specific action
 */
export function hasPermission(
  role: string,
  permission: keyof UserPermissions
): boolean {
  const permissions = getPermissions(role)
  return permissions[permission] ?? false
}

/**
 * Check if user is a manager or admin level
 */
export function isManagerOrAbove(role: string): boolean {
  const managerRoles = [
    "manager",
    "admin",
    "front_desk_manager",
    "housekeeping_manager",
    "fnb_manager",
    "maintenance_manager",
    "activities_manager",
    "general_manager",
    "assistant_manager",
  ]
  return managerRoles.includes(role)
}

/**
 * Check if user is a supervisor level
 */
export function isSupervisor(role: string): boolean {
  const supervisorRoles = [
    "front_desk_supervisor",
    "housekeeping_supervisor",
    "fnb_supervisor",
    "maintenance_supervisor",
    "activities_supervisor",
  ]
  return supervisorRoles.includes(role)
}

/**
 * Get role level (higher = more authority)
 */
export function getRoleLevel(role: string): number {
  const levels: Record<string, number> = {
    // Staff level
    "staff": 1,
    "housekeeper": 1,
    "server": 1,
    "bartender": 1,
    "maintenance_technician": 1,
    "activity_guide": 1,
    "front_desk_agent": 1,
    // Supervisor level
    "front_desk_supervisor": 2,
    "housekeeping_supervisor": 2,
    "fnb_supervisor": 2,
    "maintenance_supervisor": 2,
    "activities_supervisor": 2,
    // Manager level
    "manager": 3,
    "front_desk_manager": 3,
    "housekeeping_manager": 3,
    "fnb_manager": 3,
    "maintenance_manager": 3,
    "activities_manager": 3,
    "assistant_manager": 3,
    // Top level
    "general_manager": 4,
    "admin": 4,
  }
  
  return levels[role] || 0
}

/**
 * Compare roles (returns true if role1 >= role2 in hierarchy)
 */
export function isRoleHigherOrEqual(role1: string, role2: string): boolean {
  return getRoleLevel(role1) >= getRoleLevel(role2)
}
