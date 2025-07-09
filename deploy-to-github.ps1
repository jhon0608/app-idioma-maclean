# Script para subir el proyecto Maclean a GitHub
# Ejecutar como: .\deploy-to-github.ps1

Write-Host "🚀 Iniciando despliegue a GitHub..." -ForegroundColor Green

# Verificar si estamos en la carpeta correcta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Asegúrate de estar en la carpeta del proyecto." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Carpeta del proyecto verificada" -ForegroundColor Green

# Inicializar Git si no existe
if (-not (Test-Path ".git")) {
    Write-Host "📦 Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al inicializar Git" -ForegroundColor Red
        exit 1
    }
}

# Configurar Git (opcional, solo si no está configurado)
Write-Host "⚙️ Configurando Git..." -ForegroundColor Yellow
git config user.name "jhon0608"
git config user.email "macleanjhon17@gmail.com"

# Agregar todos los archivos
Write-Host "📁 Agregando archivos al repositorio..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al agregar archivos" -ForegroundColor Red
    exit 1
}

# Mostrar estado
Write-Host "📋 Estado del repositorio:" -ForegroundColor Cyan
git status --short

# Hacer commit
Write-Host "💾 Creando commit..." -ForegroundColor Yellow
$commitMessage = @"
🎉 Maclean Language Learning Platform - Complete Implementation

✅ Features:
- User authentication system (register/login)
- MongoDB integration with real database
- Modern React frontend with Tailwind CSS
- Express.js backend API
- Responsive dashboard
- Language learning interface structure
- User progress tracking system

🛠️ Tech Stack:
- Frontend: React 18, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: bcryptjs encryption
- Icons: Lucide React

🎯 Ready for production deployment
"@

git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al crear commit" -ForegroundColor Red
    exit 1
}

# Verificar si el remoto ya existe
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    Write-Host "🔗 Agregando repositorio remoto..." -ForegroundColor Yellow
    git remote add origin https://github.com/jhon0608/app-idioma-maclean.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al agregar repositorio remoto" -ForegroundColor Red
        exit 1
    }
}

# Cambiar a rama main
Write-Host "🌿 Configurando rama main..." -ForegroundColor Yellow
git branch -M main

# Subir al repositorio
Write-Host "⬆️ Subiendo al repositorio GitHub..." -ForegroundColor Yellow
Write-Host "📝 Nota: Si te pide credenciales, usa tu token de GitHub como contraseña" -ForegroundColor Cyan

git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 ¡Proyecto subido exitosamente a GitHub!" -ForegroundColor Green
    Write-Host "🌐 URL: https://github.com/jhon0608/app-idioma-maclean" -ForegroundColor Cyan
    Write-Host "📋 Archivos incluidos:" -ForegroundColor Yellow
    Write-Host "   - Código fuente completo (React + Node.js)" -ForegroundColor White
    Write-Host "   - Sistema de autenticación funcional" -ForegroundColor White
    Write-Host "   - Integración con MongoDB" -ForegroundColor White
    Write-Host "   - Documentación completa (README.md)" -ForegroundColor White
    Write-Host "   - Configuración de desarrollo" -ForegroundColor White
} else {
    Write-Host "❌ Error al subir al repositorio" -ForegroundColor Red
    Write-Host "💡 Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "   1. Verifica tu conexión a internet" -ForegroundColor White
    Write-Host "   2. Asegúrate de tener permisos en el repositorio" -ForegroundColor White
    Write-Host "   3. Usa un token de GitHub como contraseña" -ForegroundColor White
    Write-Host "   4. Verifica que el repositorio existe en GitHub" -ForegroundColor White
    exit 1
}

Write-Host "✨ Proceso completado" -ForegroundColor Green
