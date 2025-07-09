import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db, clearLocalData } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Limpiar datos locales de simulación al iniciar
    clearLocalData()
    // Forzar logout para limpiar cualquier sesión corrupta
    setUser(null)
    setProfile(null)

    // Obtener usuario actual al cargar
    const getInitialUser = async () => {
      try {
        const { data: { user } } = await auth.getCurrentUser()
        if (user) {
          setUser(user)
          // Obtener perfil del usuario
          const { data: profileData } = await db.getUserProfile(user.id)
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error al obtener usuario inicial:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        // Obtener perfil del usuario
        const { data: profileData } = await db.getUserProfile(session.user.id)
        setProfile(profileData)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Función de registro
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await auth.signUp(email, password, userData)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      // El registro fue exitoso pero el usuario queda DESACTIVADO
      return {
        success: true,
        data,
        message: data.message || 'Registro exitoso. Tu cuenta está pendiente de activación.'
      }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Función de inicio de sesión
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await auth.signIn(email, password)

      if (error) {
        // Manejar errores específicos de activación
        if (error.pending) {
          setError('Tu cuenta está pendiente de activación. Contacta al administrador.')
        } else if (error.expired) {
          setError('Tu suscripción ha expirado. Contacta al administrador para renovar.')
        } else {
          setError(error.message || error)
        }
        return { success: false, error: error.message || error }
      }

      return { success: true, data }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Función de cierre de sesión
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await auth.signOut()
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      setUser(null)
      setProfile(null)
      return { success: true }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Limpiar error
  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    clearError,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
