# 🚀 INSTRUCCIONES PARA SUBIR A GITHUB

## 📋 OPCIÓN 1: Script Automático (RECOMENDADO)

### Para PowerShell:
1. Abre PowerShell como Administrador
2. Navega a la carpeta del proyecto:
   ```powershell
   cd "c:\Users\Admin\Documents\augment-projects\app-idiomas"
   ```
3. Ejecuta el script:
   ```powershell
   .\deploy-to-github.ps1
   ```

### Para Command Prompt:
1. Abre CMD como Administrador
2. Navega a la carpeta del proyecto:
   ```cmd
   cd "c:\Users\Admin\Documents\augment-projects\app-idiomas"
   ```
3. Ejecuta el script:
   ```cmd
   deploy-to-github.bat
   ```

## 📋 OPCIÓN 2: Comandos Manuales

Si los scripts no funcionan, ejecuta estos comandos uno por uno:

```bash
# 1. Navegar a la carpeta
cd "c:\Users\Admin\Documents\augment-projects\app-idiomas"

# 2. Inicializar Git
git init

# 3. Configurar Git
git config user.name "jhon0608"
git config user.email "macleanjhon17@gmail.com"

# 4. Agregar archivos
git add .

# 5. Hacer commit
git commit -m "🎉 Maclean Language Learning Platform - Complete Implementation"

# 6. Agregar repositorio remoto
git remote add origin https://github.com/jhon0608/app-idioma-maclean.git

# 7. Subir a GitHub
git branch -M main
git push -u origin main
```

## 🔐 AUTENTICACIÓN

Si te pide credenciales:
- **Usuario**: jhon0608
- **Contraseña**: Usa tu token de GitHub (NO tu contraseña normal)

### Para crear un token:
1. Ve a GitHub.com
2. Settings → Developer settings → Personal access tokens
3. Generate new token (classic)
4. Selecciona permisos: repo, workflow
5. Copia el token y úsalo como contraseña

## 📁 ARCHIVOS QUE SE SUBIRÁN

✅ **Frontend (React)**
- `src/` - Todo el código React
- `public/` - Archivos estáticos
- `index.html` - Página principal

✅ **Backend (Node.js)**
- `server-simple.js` - Servidor backend simplificado
- `server.js` - Servidor completo con funciones de idiomas

✅ **Configuración**
- `package.json` - Dependencias del proyecto
- `README.md` - Documentación completa
- `.gitignore` - Archivos a ignorar
- `tailwind.config.js` - Configuración de Tailwind
- `vite.config.js` - Configuración de Vite

✅ **Scripts de despliegue**
- `deploy-to-github.ps1` - Script de PowerShell
- `deploy-to-github.bat` - Script de Batch

## 🎯 RESULTADO ESPERADO

Después de ejecutar exitosamente:
- ✅ Repositorio creado en: https://github.com/jhon0608/app-idioma-maclean
- ✅ Código fuente completo subido
- ✅ Documentación incluida
- ✅ Listo para desarrollo colaborativo

## ⚠️ SOLUCIÓN DE PROBLEMAS

### Error: "Git no reconocido"
- Instala Git desde: https://git-scm.com/download/win

### Error: "Permission denied"
- Ejecuta como Administrador
- Verifica que tienes permisos en el repositorio GitHub

### Error: "Authentication failed"
- Usa token de GitHub en lugar de contraseña
- Verifica que el token tenga permisos de repo

### Error: "Repository not found"
- Verifica que el repositorio existe en GitHub
- Asegúrate de que la URL es correcta

## 📞 CONTACTO

Si tienes problemas:
1. Revisa los mensajes de error
2. Verifica tu conexión a internet
3. Asegúrate de tener Git instalado
4. Usa token de GitHub para autenticación

¡El proyecto está listo para ser subido! 🚀
