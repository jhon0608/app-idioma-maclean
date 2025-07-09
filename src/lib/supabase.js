// API Backend URL
const API_URL = 'http://localhost:5000/api'

// Estado de usuario actual (en memoria)
let currentUser = JSON.parse(localStorage.getItem('maclean_current_user') || 'null')

// Limpiar datos locales de simulación
export const clearLocalData = () => {
  localStorage.removeItem('maclean_users')
  localStorage.removeItem('maclean_profiles')
  localStorage.removeItem('maclean_current_user')
  localStorage.clear() // Limpiar TODO el localStorage
  console.log('🧹 Datos locales limpiados COMPLETAMENTE - ahora usando API MongoDB')
}

// Funciones de autenticación con API MongoDB
export const auth = {
  // Registrar nuevo usuario
  signUp: async (email, password, userData) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName: userData.firstName,
          lastName: userData.lastName
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro')
      }

      // NO establecer usuario actual - debe estar desactivado
      console.log('✅ Usuario registrado en MongoDB (DESACTIVADO):', data.user.email)

      // Retornar éxito pero SIN sesión activa
      return {
        data: {
          user: null, // No hay usuario activo
          session: null, // No hay sesión
          message: 'Registro exitoso. Tu cuenta está pendiente de activación por el administrador.'
        },
        error: null
      }
    } catch (error) {
      console.error('❌ Error en registro:', error)
      return { data: null, error }
    }
  },

  // Iniciar sesión
  signIn: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        const error = new Error(data.error || 'Error en el login')
        error.pending = data.pending
        error.expired = data.expired
        throw error
      }

      // Establecer usuario actual
      currentUser = {
        id: data.user.id,
        email: data.user.email,
        user_metadata: {
          first_name: data.user.firstName,
          last_name: data.user.lastName,
          full_name: data.user.fullName
        }
      }

      localStorage.setItem('maclean_current_user', JSON.stringify(currentUser))
      console.log('✅ Usuario autenticado desde MongoDB:', data.user.email)

      return {
        data: {
          user: currentUser,
          session: { user: currentUser, access_token: 'mongodb-token' }
        },
        error: null
      }
    } catch (error) {
      console.error('❌ Error en login:', error)
      return { data: null, error }
    }
  },

  // Cerrar sesión
  signOut: async () => {
    try {
      currentUser = null
      localStorage.removeItem('maclean_current_user')
      console.log('✅ Usuario desconectado')
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return Promise.resolve({
      data: { user: currentUser },
      error: null
    })
  },

  // Escuchar cambios de autenticación
  onAuthStateChange: (callback) => {
    setTimeout(() => {
      if (currentUser) {
        callback('SIGNED_IN', { user: currentUser })
      } else {
        callback('SIGNED_OUT', null)
      }
    }, 100)

    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    }
  }
}

// Funciones de base de datos con MongoDB
export const db = {
  // Crear perfil de usuario (ya incluido en el registro)
  createUserProfile: async (userId, profileData) => {
    try {
      // En nuestro esquema, el perfil ya está incluido en el usuario
      return { data: { message: 'Perfil creado con el usuario' }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Obtener perfil de usuario
  getUserProfile: async (userId) => {
    try {
      await connectDB()
      const user = await User.findById(userId)
      if (!user) {
        return { data: null, error: new Error('Usuario no encontrado') }
      }

      const profile = {
        id: user._id.toString(),
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        full_name: user.fullName,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      }

      return { data: profile, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Actualizar perfil de usuario
  updateUserProfile: async (userId, updates) => {
    try {
      await connectDB()
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...updates,
          updatedAt: new Date()
        },
        { new: true }
      )

      if (!updatedUser) {
        return { data: null, error: new Error('Usuario no encontrado') }
      }

      const profile = {
        id: updatedUser._id.toString(),
        first_name: updatedUser.firstName,
        last_name: updatedUser.lastName,
        email: updatedUser.email,
        full_name: updatedUser.fullName,
        created_at: updatedUser.createdAt,
        updated_at: updatedUser.updatedAt
      }

      return { data: profile, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}
