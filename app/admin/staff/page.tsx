"use client"

import { useEffect, useState } from "react"
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit,
  Trash2,
  Shield,
  Phone,
  Mail,
  Building,
  Calendar
} from "lucide-react"

interface StaffMember {
  _id: string
  username: string
  email: string
  fullName: string
  role: string
  department: string
  phone: string
  isActive: boolean
  createdAt: string
}

// Role display names
const roleDisplayNames: Record<string, string> = {
  // Front Desk
  "front_desk_agent": "Front Desk Agent",
  "front_desk_supervisor": "Front Desk Supervisor",
  "front_desk_manager": "Front Desk Manager",
  // Housekeeping
  "housekeeper": "Housekeeper",
  "housekeeping_supervisor": "Housekeeping Supervisor",
  "housekeeping_manager": "Housekeeping Manager",
  // Food & Beverage
  "server": "Server",
  "bartender": "Bartender",
  "fnb_supervisor": "F&B Supervisor",
  "fnb_manager": "F&B Manager",
  // Maintenance
  "maintenance_technician": "Maintenance Technician",
  "maintenance_supervisor": "Maintenance Supervisor",
  "maintenance_manager": "Maintenance Manager",
  // Activities
  "activity_guide": "Activity Guide",
  "activities_supervisor": "Activities Supervisor",
  "activities_manager": "Activities Manager",
  // Management
  "general_manager": "General Manager",
  "assistant_manager": "Assistant Manager",
  // Legacy
  "staff": "Staff",
  "manager": "Manager",
  "admin": "Admin",
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await fetch("/api/admin/staff")
      const data = await response.json()
      if (data.success) {
        setStaff(data.staff)
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStaff = staff.filter(s => {
    const matchesSearch = 
      (s.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (s.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (s.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (s.department?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    
    if (filter === "all") return matchesSearch
    if (filter === "active") return matchesSearch && s.isActive
    if (filter === "inactive") return matchesSearch && !s.isActive
    return matchesSearch
  })

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRoleBadgeColor = (role: string) => {
    if (role === "admin") return "bg-purple-100 text-purple-700"
    if (role.includes("manager")) return "bg-amber-100 text-amber-700"
    if (role.includes("supervisor")) return "bg-blue-100 text-blue-700"
    return "bg-slate-100 text-slate-700"
  }

  const activeCount = staff.filter(s => s.isActive).length
  const inactiveCount = staff.filter(s => !s.isActive).length

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Staff Management</h1>
          <p className="text-slate-500 mt-1">View and manage all registered staff members</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/30"
        >
          <UserPlus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Staff</p>
              <p className="text-2xl font-bold text-slate-800">{staff.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active</p>
              <p className="text-2xl font-bold text-slate-800">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Inactive</p>
              <p className="text-2xl font-bold text-slate-800">{inactiveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, username, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
        >
          <option value="all">All Staff</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            <p className="mt-4 text-slate-500">Loading staff...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No staff members found</p>
            {(searchTerm || filter !== "all") && (
              <button
                onClick={() => { setSearchTerm(""); setFilter("all") }}
                className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Staff Member</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-amber-800">
                            {(member.fullName || member.username || "S").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-800 block">{member.fullName || member.username}</span>
                          <span className="text-xs text-slate-400">@{member.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {member.email}
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {member.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Building className="w-4 h-4 text-slate-400" />
                        {member.department || "General"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border ${getRoleBadgeColor(member.role)}`}>
                        <Shield className="w-3 h-3" />
                        {roleDisplayNames[member.role] || member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full ${
                        member.isActive 
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          member.isActive ? "bg-green-500" : "bg-slate-400"
                        }`} />
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(member.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => {
                            setEditingStaff(member)
                            setShowModal(true)
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit staff"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className={`p-2 rounded-lg transition-colors ${
                            member.isActive 
                              ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                              : "text-slate-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                          title={member.isActive ? "Deactivate" : "Activate"}
                        >
                          {member.isActive ? (
                            <Shield className="w-4 h-4" />
                          ) : (
                            <Shield className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={editingStaff?.fullName || ""}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={editingStaff?.email || ""}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select
                    defaultValue={editingStaff?.department || "General"}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="Front Desk">Front Desk</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Activities">Activities</option>
                    <option value="Management">Management</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    defaultValue={editingStaff?.role || "staff"}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="front_desk_agent">Front Desk Agent</option>
                    <option value="front_desk_supervisor">Front Desk Supervisor</option>
                    <option value="front_desk_manager">Front Desk Manager</option>
                    <option value="housekeeper">Housekeeper</option>
                    <option value="housekeeping_supervisor">Housekeeping Supervisor</option>
                    <option value="housekeeping_manager">Housekeeping Manager</option>
                    <option value="server">Server</option>
                    <option value="bartender">Bartender</option>
                    <option value="fnb_supervisor">F&B Supervisor</option>
                    <option value="fnb_manager">F&B Manager</option>
                    <option value="maintenance_technician">Maintenance Technician</option>
                    <option value="maintenance_supervisor">Maintenance Supervisor</option>
                    <option value="maintenance_manager">Maintenance Manager</option>
                    <option value="activity_guide">Activity Guide</option>
                    <option value="activities_supervisor">Activities Supervisor</option>
                    <option value="activities_manager">Activities Manager</option>
                    <option value="assistant_manager">Assistant Manager</option>
                    <option value="general_manager">General Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  defaultValue={editingStaff?.phone || ""}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter phone number"
                />
              </div>
              {!editingStaff && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter username"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingStaff(null)
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-medium"
                >
                  {editingStaff ? "Save Changes" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
