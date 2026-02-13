"use client"

import { useEffect, useState } from "react"
import { 
  Users, 
  Search, 
  Edit,
  Shield,
  Phone,
  Mail,
  Building,
  Calendar,
  Plus,
  X,
  Copy,
  Check,
  Eye,
  EyeOff
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
  "front_desk_agent": "Front Desk Agent",
  "front_desk_supervisor": "Front Desk Supervisor",
  "front_desk_manager": "Front Desk Manager",
  "housekeeper": "Housekeeper",
  "housekeeping_supervisor": "Housekeeping Supervisor",
  "housekeeping_manager": "Housekeeping Manager",
  "server": "Server",
  "bartender": "Bartender",
  "fnb_supervisor": "F&B Supervisor",
  "fnb_manager": "F&B Manager",
  "maintenance_technician": "Maintenance Technician",
  "maintenance_supervisor": "Maintenance Supervisor",
  "maintenance_manager": "Maintenance Manager",
  "activity_guide": "Activity Guide",
  "activities_supervisor": "Activities Supervisor",
  "activities_manager": "Activities Manager",
  "general_manager": "General Manager",
  "assistant_manager": "Assistant Manager",
  "staff": "Staff",
  "manager": "Manager",
  "admin": "Admin",
}

// Department options
const DEPARTMENTS = [
  { value: "Front Desk", label: "Front Desk" },
  { value: "Housekeeping", label: "Housekeeping" },
  { value: "Food & Beverage", label: "Food & Beverage" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Activities", label: "Activities" },
  { value: "Management", label: "Management" },
  { value: "General", label: "General" },
]

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    department: "General",
    role: "staff",
    phone: "",
    password: "",
    confirmPassword: "",
  })

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
    return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
  }

  const activeCount = staff.filter(s => s.isActive).length
  const inactiveCount = staff.filter(s => !s.isActive).length

  const getRolesForDepartment = (department: string) => {
    const roleOptions: Record<string, string[]> = {
      "Front Desk": ["front_desk_agent", "front_desk_supervisor", "front_desk_manager"],
      "Housekeeping": ["housekeeper", "housekeeping_supervisor", "housekeeping_manager"],
      "Food & Beverage": ["server", "bartender", "fnb_supervisor", "fnb_manager"],
      "Maintenance": ["maintenance_technician", "maintenance_supervisor", "maintenance_manager"],
      "Activities": ["activity_guide", "activities_supervisor", "activities_manager"],
      "Management": ["assistant_manager", "general_manager"],
      "General": ["staff", "manager", "admin"],
    }
    return roleOptions[department] || ["staff"]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError("")
    setFormSuccess("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match")
      setFormLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters")
      setFormLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          department: formData.department,
          role: formData.role,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setFormSuccess("Staff account created successfully!")
        fetchStaff()
        setTimeout(() => {
          setShowModal(false)
          setFormSuccess("")
          setFormData({
            username: "",
            email: "",
            fullName: "",
            department: "General",
            role: "staff",
            phone: "",
            password: "",
            confirmPassword: "",
          })
        }, 2000)
      } else {
        setFormError(data.error || "Failed to create staff")
      }
    } catch {
      setFormError("An error occurred. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEditStaff = (member: StaffMember) => {
    setEditingStaff(member)
    setFormData({
      username: member.username,
      email: member.email,
      fullName: member.fullName,
      department: member.department || "General",
      role: member.role,
      phone: member.phone || "",
      password: "",
      confirmPassword: "",
    })
    setShowModal(true)
  }

  const handleToggleActive = async (member: StaffMember) => {
    try {
      const response = await fetch(`/api/admin/staff`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: member._id, isActive: !member.isActive }),
      })
      
      const data = await response.json()
      if (data.success) {
        fetchStaff()
      } else {
        console.error("Failed to update staff status")
      }
    } catch (error) {
      console.error("Error updating staff status:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Staff Management</h1>
          <p className="text-slate-500 mt-1">View and manage all staff members</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-medium shadow-lg shadow-amber-500/30"
        >
          <Plus className="w-5 h-5" />
          Add New Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Total Staff</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{staff.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Active</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Inactive</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{inactiveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-300" />
          <input
            type="text"
            placeholder="Search by name, email, username, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
        >
          <option value="all">All Staff</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 dark:text-slate-300">Loading staff...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400 dark:text-slate-300" />
            </div>
            <p className="text-slate-500 dark:text-slate-300">No staff members found</p>
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
              <thead className="bg-slate-50 dark:bg-slate-700/50/80">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Staff Member</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Department</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50 dark:bg-slate-700/50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-amber-800">
                            {(member.fullName || member.username || "S").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-800 block">{member.fullName || member.username}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-300">@{member.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                        {member.email}
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <Phone className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                          {member.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Building className="w-4 h-4 text-slate-400 dark:text-slate-300" />
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
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          member.isActive ? "bg-green-500" : "bg-slate-400"
                        }`} />
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                        {formatDate(member.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditStaff(member)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit staff details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleActive(member)}
                          className={`p-2 rounded-lg transition-colors ${
                            member.isActive 
                              ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                              : "text-slate-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                          title={member.isActive ? "Deactivate" : "Activate"}
                        >
                          <Shield className="w-4 h-4" />
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

      {/* Add New Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Staff Member</h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setFormSuccess("")
                  setFormError("")
                }}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <Check className="w-5 h-5" />
                  {formSuccess}
                </div>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs font-bold">!</span>
                  {formError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        department: e.target.value,
                        role: getRolesForDepartment(e.target.value)[0]
                      })
                    }}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {getRolesForDepartment(formData.department).map((role) => (
                      <option key={role} value={role}>
                        {roleDisplayNames[role] || role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Password Fields */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Create password for staff"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Confirm password"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormSuccess("")
                    setFormError("")
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:bg-slate-700/50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create Staff"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}







