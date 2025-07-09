import React from 'react'
import { Globe } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="animate-spin">
            <Globe className="h-12 w-12 text-primary-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando...</h2>
        <p className="text-gray-600">Preparando tu experiencia de aprendizaje</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
