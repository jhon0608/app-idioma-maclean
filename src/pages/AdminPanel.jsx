import React, { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users')
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const activateUser = async (userId) => {
    setActionLoading(userId)
    try {
      const response = await fetch(`http://localhost:5000/api/admin/activate/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: 'admin@maclean.com' })
      })
      
      if (response.ok) {
        await fetchUsers()
        await fetchStats()
        alert('Usuario activado por 30 días')
      }
    } catch (error) {
      console.error('Error activating user:', error)
      alert('Error activando usuario')
    } finally {
      setActionLoading(null)
    }
  }

  const deactivateUser = async (userId) => {
    setActionLoading(userId)
    try {
      const response = await fetch(`http://localhost:5000/api/admin/deactivate/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: 'admin@maclean.com' })
      })
      
      if (response.ok) {
        await fetchUsers()
        await fetchStats()
        alert('Usuario desactivado')
      }
    } catch (error) {
      console.error('Error deactivating user:', error)
      alert('Error desactivando usuario')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (user) => {
    if (!user.isActive) {
      if (user.subscriptionStatus === 'expired') {
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Expirado</span>
      }
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendiente</span>
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Activo</span>
  }

  const getDaysRemainingBadge = (daysRemaining) => {
    if (daysRemaining === null) return null
    
    if (daysRemaining <= 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Expirado</span>
    } else if (daysRemaining <= 7) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">{daysRemaining} días</span>
    } else {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{daysRemaining} días</span>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona usuarios y suscripciones de Maclean</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expirados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expired || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Usuarios Registrados</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días Restantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getDaysRemainingBadge(user.daysRemaining)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.isActive ? (
                        <button
                          onClick={() => deactivateUser(user._id)}
                          disabled={actionLoading === user._id}
                          className="text-red-600 hover:text-red-900 mr-4 disabled:opacity-50"
                        >
                          {actionLoading === user._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <UserX className="h-4 w-4" />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => activateUser(user._id)}
                          disabled={actionLoading === user._id}
                          className="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50"
                        >
                          {actionLoading === user._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
