import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Globe, Star, Users, Clock, ArrowRight, Search } from 'lucide-react'
import { API_BASE_URL } from '../config/api'


const LanguageSelection = () => {
  const [languages, setLanguages] = useState([])
  const [filteredLanguages, setFilteredLanguages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchLanguages()
  }, [])

  useEffect(() => {
    filterLanguages()
  }, [languages, searchTerm, selectedCategory, selectedDifficulty])

  const fetchLanguages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/languages`)
      if (response.ok) {
        const data = await response.json()
        setLanguages(data)
      }
    } catch (error) {
      console.error('Error fetching languages:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLanguages = () => {
    let filtered = languages

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(lang => 
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lang => lang.category === selectedCategory)
    }

    // Filtrar por dificultad
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(lang => lang.difficulty === selectedDifficulty)
    }

    setFilteredLanguages(filtered)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyStars = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 1
      case 'intermediate': return 2
      case 'advanced': return 3
      default: return 1
    }
  }

  const handleLanguageSelect = (languageCode) => {
    navigate(`/learn/${languageCode}`)
  }

  const categories = ['all', 'European', 'Asian', 'Middle Eastern', 'Nordic']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando idiomas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Selecciona tu Idioma</h1>
                <p className="text-gray-600">¡Hola {user?.firstName}! ¿Qué idioma quieres aprender hoy?</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar idioma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categoría */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las regiones' : category}
                </option>
              ))}
            </select>

            {/* Dificultad */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'Todas las dificultades' : 
                   difficulty === 'beginner' ? 'Principiante' :
                   difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de Idiomas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLanguages.map((language) => (
            <div
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100 hover:border-blue-200"
            >
              <div className="p-6">
                {/* Flag y Nombre */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{language.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {language.name}
                  </h3>
                  <p className="text-sm text-gray-500">{language.nativeName}</p>
                </div>

                {/* Información */}
                <div className="space-y-3">
                  {/* Dificultad */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dificultad:</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < getDifficultyStars(language.difficulty)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Badge de dificultad */}
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(language.difficulty)}`}>
                      {language.difficulty === 'beginner' ? 'Principiante' :
                       language.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                    </span>
                  </div>

                  {/* Lecciones */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{language.totalLessons} lecciones</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay resultados */}
        {filteredLanguages.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron idiomas</h3>
            <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LanguageSelection
