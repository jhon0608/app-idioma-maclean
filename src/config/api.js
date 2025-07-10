// Configuración de API para desarrollo
const getApiUrl = () => {
  // Si estamos en desarrollo y no es localhost, usar la IP de la red
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:5000`
  }

  // Para localhost, usar localhost
  return 'http://localhost:5000'
}

export const API_BASE_URL = getApiUrl()

console.log('🌐 API URL configurada:', API_BASE_URL)
