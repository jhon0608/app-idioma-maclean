const fs = require('fs')
const path = require('path')

// Función para actualizar URLs en archivos
function updateApiUrls(dir) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      updateApiUrls(filePath)
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8')
      
      // Reemplazar URLs de localhost por la configuración dinámica
      const oldPattern = /'http:\/\/localhost:5000'/g
      const newPattern = '`${API_BASE_URL}`'
      
      if (content.includes('http://localhost:5000')) {
        console.log(`Actualizando: ${filePath}`)
        
        // Agregar import si no existe
        if (!content.includes('import { API_BASE_URL }') && content.includes('http://localhost:5000')) {
          const importLine = "import { API_BASE_URL } from '../config/api'\n"
          
          // Encontrar la línea de imports
          const lines = content.split('\n')
          let insertIndex = 0
          
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
              insertIndex = i + 1
            } else if (lines[i].trim() === '' && insertIndex > 0) {
              break
            }
          }
          
          lines.splice(insertIndex, 0, importLine)
          content = lines.join('\n')
        }
        
        // Reemplazar URLs
        content = content.replace(/http:\/\/localhost:5000/g, '${API_BASE_URL}')
        content = content.replace(/fetch\('([^']*\$\{API_BASE_URL\}[^']*)'\)/g, 'fetch(`$1`)')
        
        fs.writeFileSync(filePath, content, 'utf8')
      }
    }
  })
}

console.log('🔄 Actualizando URLs de API...')
updateApiUrls('./src')
console.log('✅ URLs actualizadas correctamente')
