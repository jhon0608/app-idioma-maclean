@echo off
echo 🚀 Iniciando despliegue a GitHub...

REM Verificar si estamos en la carpeta correcta
if not exist "package.json" (
    echo ❌ Error: No se encontró package.json. Asegúrate de estar en la carpeta del proyecto.
    pause
    exit /b 1
)

echo ✅ Carpeta del proyecto verificada

REM Inicializar Git si no existe
if not exist ".git" (
    echo 📦 Inicializando repositorio Git...
    git init
    if errorlevel 1 (
        echo ❌ Error al inicializar Git
        pause
        exit /b 1
    )
)

REM Configurar Git
echo ⚙️ Configurando Git...
git config user.name "jhon0608"
git config user.email "macleanjhon17@gmail.com"

REM Agregar todos los archivos
echo 📁 Agregando archivos al repositorio...
git add .
if errorlevel 1 (
    echo ❌ Error al agregar archivos
    pause
    exit /b 1
)

REM Mostrar estado
echo 📋 Estado del repositorio:
git status --short

REM Hacer commit
echo 💾 Creando commit...
git commit -m "🎉 Maclean Language Learning Platform - Complete Implementation - ✅ User authentication system - MongoDB integration - Modern React frontend - Express.js backend - Ready for production"
if errorlevel 1 (
    echo ❌ Error al crear commit
    pause
    exit /b 1
)

REM Agregar repositorio remoto
echo 🔗 Agregando repositorio remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/jhon0608/app-idioma-maclean.git
if errorlevel 1 (
    echo ❌ Error al agregar repositorio remoto
    pause
    exit /b 1
)

REM Cambiar a rama main
echo 🌿 Configurando rama main...
git branch -M main

REM Subir al repositorio
echo ⬆️ Subiendo al repositorio GitHub...
echo 📝 Nota: Si te pide credenciales, usa tu token de GitHub como contraseña
git push -u origin main
if errorlevel 1 (
    echo ❌ Error al subir al repositorio
    echo 💡 Posibles soluciones:
    echo    1. Verifica tu conexión a internet
    echo    2. Asegúrate de tener permisos en el repositorio
    echo    3. Usa un token de GitHub como contraseña
    echo    4. Verifica que el repositorio existe en GitHub
    pause
    exit /b 1
)

echo 🎉 ¡Proyecto subido exitosamente a GitHub!
echo 🌐 URL: https://github.com/jhon0608/app-idioma-maclean
echo 📋 Archivos incluidos:
echo    - Código fuente completo (React + Node.js)
echo    - Sistema de autenticación funcional
echo    - Integración con MongoDB
echo    - Documentación completa (README.md)
echo    - Configuración de desarrollo
echo ✨ Proceso completado

pause
