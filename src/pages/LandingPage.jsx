import React from 'react'
import { Link } from 'react-router-dom'
import { Globe, BookOpen, Users, Award, Play, Star, ArrowRight, Languages, Zap, Shield } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Maclean</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Características</a>
              <a href="#languages" className="text-gray-600 hover:text-primary-600 transition-colors">Idiomas</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors">Testimonios</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors">Precios</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn-primary">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Aprende <span className="text-primary-600">Todos los Idiomas</span>
              <br />del Mundo
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Descubre la forma más efectiva y divertida de dominar cualquier idioma. 
              Con Maclean, el mundo está a tu alcance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="btn-outline text-lg px-8 py-4 flex items-center">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </button>
            </div>
            <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span>4.9/5 estrellas</span>
              </div>
              <div>+50,000 estudiantes</div>
              <div>30+ idiomas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Maclean?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma combina tecnología avanzada con métodos de enseñanza probados
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Aprendizaje Rápido</h3>
              <p className="text-gray-600">
                Metodología científicamente probada que acelera tu proceso de aprendizaje hasta 3x más rápido
              </p>
            </div>
            
            <div className="card text-center">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Languages className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">30+ Idiomas</h3>
              <p className="text-gray-600">
                Desde inglés y español hasta mandarín y árabe. Todos los idiomas que necesitas en un solo lugar
              </p>
            </div>
            
            <div className="card text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comunidad Global</h3>
              <p className="text-gray-600">
                Conecta con estudiantes de todo el mundo y practica con hablantes nativos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Idiomas Disponibles
            </h2>
            <p className="text-xl text-gray-600">
              Explora nuestra amplia selección de idiomas
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Inglés', flag: '🇺🇸', level: 'Todos los niveles' },
              { name: 'Español', flag: '🇪🇸', level: 'Todos los niveles' },
              { name: 'Francés', flag: '🇫🇷', level: 'Todos los niveles' },
              { name: 'Alemán', flag: '🇩🇪', level: 'Todos los niveles' },
              { name: 'Italiano', flag: '🇮🇹', level: 'Todos los niveles' },
              { name: 'Portugués', flag: '🇵🇹', level: 'Todos los niveles' },
              { name: 'Mandarín', flag: '🇨🇳', level: 'Básico-Avanzado' },
              { name: 'Japonés', flag: '🇯🇵', level: 'Básico-Intermedio' },
              { name: 'Coreano', flag: '🇰🇷', level: 'Básico-Intermedio' },
              { name: 'Árabe', flag: '🇸🇦', level: 'Básico-Intermedio' },
              { name: 'Ruso', flag: '🇷🇺', level: 'Básico-Intermedio' },
              { name: 'Hindi', flag: '🇮🇳', level: 'Básico' }
            ].map((lang, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">{lang.flag}</div>
                <h3 className="font-semibold text-gray-900">{lang.name}</h3>
                <p className="text-sm text-gray-500">{lang.level}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar tu aventura lingüística?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Únete a miles de estudiantes que ya están dominando nuevos idiomas con Maclean
          </p>
          <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center">
            Comenzar Ahora - Es Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-8 w-8 text-primary-400" />
                <span className="text-2xl font-bold">Maclean</span>
              </div>
              <p className="text-gray-400">
                La plataforma líder para aprender idiomas de forma efectiva y divertida.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <p className="text-gray-400">macleanjhon17@gmail.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Maclean. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
