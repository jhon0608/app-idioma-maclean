import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import cors from 'cors'

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

// Conexión a MongoDB
const MONGODB_URI = 'mongodb+srv://macleanjhon8:Ooomy2808.@idioma-maclean.6ghudfp.mongodb.net/?retryWrites=true&w=majority&appName=idioma-maclean'

// Esquema de Usuario
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true  // ACTIVAR AUTOMÁTICAMENTE
  },
  activatedAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['pending', 'active', 'expired'],
    default: 'active'  // ACTIVO AUTOMÁTICAMENTE
  },
  activatedBy: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'paid'  // PAGADO AUTOMÁTICAMENTE
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', UserSchema)

// Middleware para verificar usuarios activos
const checkUserStatus = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    
    if (!user) {
      return next() // Continúa si no existe (para registro)
    }

    // Verificar si está activo PRIMERO
    if (!user.isActive) {
      return res.status(403).json({ 
        error: 'Tu cuenta está pendiente de activación. Contacta al administrador.',
        pending: true
      })
    }

    // Si está activo pero NO tiene fechas, establecer fechas automáticamente
    if (user.isActive && (!user.activatedAt || !user.expiresAt)) {
      const now = new Date()
      const expirationDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)) // +30 días
      
      await User.findByIdAndUpdate(user._id, {
        activatedAt: now,
        expiresAt: expirationDate,
        subscriptionStatus: 'active',
        paymentStatus: 'paid',
        updatedAt: now
      })
      
      console.log(`🔧 Fechas establecidas automáticamente para ${user.email}`)
    }

    // Verificar expiración solo si tiene fecha de expiración
    if (user.expiresAt && new Date() > user.expiresAt) {
      await User.findByIdAndUpdate(user._id, {
        isActive: false,
        subscriptionStatus: 'expired',
        updatedAt: new Date()
      })
      
      return res.status(403).json({ 
        error: 'Tu suscripción ha expirado. Contacta al administrador para renovar.',
        expired: true
      })
    }

    next()
  } catch (error) {
    console.error('Error verificando estado del usuario:', error)
    next()
  }
}

// RUTAS

// Registro
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear nuevo usuario con activación automática
    const now = new Date()
    const expirationDate = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)) // +1 año

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      isActive: true,
      activatedAt: now,
      expiresAt: expirationDate,
      subscriptionStatus: 'active',
      paymentStatus: 'paid'
    })

    await newUser.save()

    console.log('✅ Usuario registrado:', email)

    res.status(201).json({
      success: true,
      message: '¡Registro exitoso! Ya puedes hacer login y comenzar a aprender idiomas.',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        fullName: newUser.fullName
      }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuario
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    console.log('✅ Usuario autenticado:', email)

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// RUTAS DE IDIOMAS - AQUÍ IRÁN LAS FUNCIONALIDADES DE APRENDIZAJE

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' })
})

// Conectar a MongoDB y iniciar servidor
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado a MongoDB')
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  })
})
.catch(err => console.error('❌ Error conectando a MongoDB:', err))
