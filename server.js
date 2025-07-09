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

// Función para inicializar datos de idiomas y lecciones
const initializeLanguageData = async () => {
  try {
    // Verificar si ya existen idiomas
    const existingLanguages = await Language.countDocuments()
    if (existingLanguages > 0) {
      console.log('📚 Datos de idiomas ya inicializados')
      return
    }

    console.log('🚀 Inicializando datos de idiomas...')

    // Crear idiomas iniciales
    const languages = [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        difficulty: 'beginner',
        totalLessons: 10
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        difficulty: 'intermediate',
        totalLessons: 8
      },
      {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        flag: '🇩🇪',
        difficulty: 'intermediate',
        totalLessons: 6
      },
      {
        code: 'it',
        name: 'Italian',
        nativeName: 'Italiano',
        flag: '🇮🇹',
        difficulty: 'beginner',
        totalLessons: 8
      }
    ]

    await Language.insertMany(languages)
    console.log('✅ Idiomas creados')

    // Crear lecciones de ejemplo para inglés
    const englishLessons = [
      {
        languageCode: 'en',
        level: 'beginner',
        unit: 1,
        lessonNumber: 1,
        title: 'Greetings and Introductions',
        description: 'Learn basic greetings and how to introduce yourself',
        objectives: [
          'Say hello and goodbye',
          'Introduce yourself',
          'Ask someone\'s name'
        ],
        vocabulary: [
          {
            word: 'Hello',
            translation: 'Hola',
            pronunciation: '/həˈloʊ/',
            example: 'Hello, my name is John.',
            audio: ''
          },
          {
            word: 'Goodbye',
            translation: 'Adiós',
            pronunciation: '/ɡʊdˈbaɪ/',
            example: 'Goodbye, see you later!',
            audio: ''
          },
          {
            word: 'Name',
            translation: 'Nombre',
            pronunciation: '/neɪm/',
            example: 'What is your name?',
            audio: ''
          }
        ],
        exercises: [
          {
            type: 'vocabulary',
            question: 'How do you say "Hola" in English?',
            options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
            correctAnswer: 'Hello',
            explanation: 'Hello is the English translation of "Hola"'
          },
          {
            type: 'translation',
            question: 'Translate: "What is your name?"',
            options: ['¿Cómo estás?', '¿Cuál es tu nombre?', '¿Dónde vives?', '¿Qué haces?'],
            correctAnswer: '¿Cuál es tu nombre?',
            explanation: 'This is asking for someone\'s name'
          }
        ]
      },
      {
        languageCode: 'en',
        level: 'beginner',
        unit: 1,
        lessonNumber: 2,
        title: 'Numbers and Colors',
        description: 'Learn numbers 1-10 and basic colors',
        objectives: [
          'Count from 1 to 10',
          'Name basic colors',
          'Use numbers in sentences'
        ],
        vocabulary: [
          {
            word: 'One',
            translation: 'Uno',
            pronunciation: '/wʌn/',
            example: 'I have one apple.',
            audio: ''
          },
          {
            word: 'Red',
            translation: 'Rojo',
            pronunciation: '/red/',
            example: 'The apple is red.',
            audio: ''
          },
          {
            word: 'Blue',
            translation: 'Azul',
            pronunciation: '/bluː/',
            example: 'The sky is blue.',
            audio: ''
          }
        ],
        exercises: [
          {
            type: 'vocabulary',
            question: 'What color is the sky?',
            options: ['Red', 'Blue', 'Green', 'Yellow'],
            correctAnswer: 'Blue',
            explanation: 'The sky is typically blue during the day'
          }
        ]
      }
    ]

    await Lesson.insertMany(englishLessons)
    console.log('✅ Lecciones de inglés creadas')

  } catch (error) {
    console.error('❌ Error inicializando datos de idiomas:', error)
  }
}

// Esquema de Usuario
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
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
  // Campos de activación y suscripción
  isActive: {
    type: Boolean,
    default: false // Los usuarios se registran desactivados
  },
  activatedAt: {
    type: Date,
    default: null // Se establece cuando el admin activa
  },
  expiresAt: {
    type: Date,
    default: null // Se calcula como activatedAt + 30 días
  },
  subscriptionStatus: {
    type: String,
    enum: ['pending', 'active', 'expired', 'suspended'],
    default: 'pending'
  },
  activatedBy: {
    type: String,
    default: null // Email del admin que activó
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'expired'],
    default: 'pending'
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

// Hash password antes de guardar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', UserSchema)

// Esquema de Idiomas
const LanguageSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true // 'en', 'es', 'fr', etc.
  },
  name: {
    type: String,
    required: true // 'English', 'Español', 'Français'
  },
  nativeName: {
    type: String,
    required: true // 'English', 'Español', 'Français'
  },
  flag: {
    type: String,
    required: true // '🇺🇸', '🇪🇸', '🇫🇷'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Esquema de Lecciones
const LessonSchema = new mongoose.Schema({
  languageCode: {
    type: String,
    required: true,
    ref: 'Language'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  unit: {
    type: Number,
    required: true // Unidad 1, 2, 3, etc.
  },
  lessonNumber: {
    type: Number,
    required: true // Lección 1, 2, 3 dentro de la unidad
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  objectives: [{
    type: String // Objetivos de aprendizaje
  }],
  vocabulary: [{
    word: String,
    translation: String,
    pronunciation: String,
    example: String,
    audio: String // URL del audio
  }],
  exercises: [{
    type: {
      type: String,
      enum: ['vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'translation'],
      required: true
    },
    question: String,
    options: [String], // Para multiple choice
    correctAnswer: String,
    explanation: String,
    audio: String, // Para ejercicios de listening
    image: String // Para ejercicios visuales
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Esquema de Progreso del Usuario
const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  languageCode: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  currentUnit: {
    type: Number,
    default: 1
  },
  currentLesson: {
    type: Number,
    default: 1
  },
  completedLessons: [{
    unit: Number,
    lesson: Number,
    score: Number, // 0-100
    completedAt: Date
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0 // Días consecutivos estudiando
  },
  lastStudyDate: {
    type: Date,
    default: Date.now
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

const Language = mongoose.model('Language', LanguageSchema)
const Lesson = mongoose.model('Lesson', LessonSchema)
const UserProgress = mongoose.model('UserProgress', UserProgressSchema)

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
      console.log(`📅 Expira el: ${expirationDate.toLocaleDateString()}`)
    }

    // Verificar expiración solo si tiene fecha de expiración
    if (user.expiresAt && new Date() > user.expiresAt) {
      // Marcar como expirado y desactivar
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

    // Si llegó aquí, el usuario está activo y no ha expirado
    next()
  } catch (error) {
    console.error('Error verificando estado del usuario:', error)
    next()
  }
}

// Función para limpiar usuarios expirados
const cleanExpiredUsers = async () => {
  try {
    const now = new Date()
    const result = await User.updateMany(
      {
        expiresAt: { $lt: now },
        subscriptionStatus: { $ne: 'expired' }
      },
      {
        isActive: false,
        subscriptionStatus: 'expired',
        updatedAt: now
      }
    )

    if (result.modifiedCount > 0) {
      console.log(`🧹 ${result.modifiedCount} usuarios expirados desactivados`)
    }
  } catch (error) {
    console.error('Error limpiando usuarios expirados:', error)
  }
}

// Ejecutar limpieza cada hora
setInterval(cleanExpiredUsers, 60 * 60 * 1000)

// Rutas
// Registro
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Ya existe una cuenta con este email' })
    }

    // Crear nuevo usuario
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`
    })

    await newUser.save()

    console.log('✅ Usuario registrado:', email)

    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        fullName: newUser.fullName
      }
    })
  } catch (error) {
    console.error('❌ Error en registro:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Login
app.post('/api/login', checkUserStatus, async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuario
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos' })
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos' })
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
    console.error('❌ Error en login:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ==================== RUTAS DE IDIOMAS ====================

// Obtener todos los idiomas disponibles
app.get('/api/languages', async (req, res) => {
  try {
    const languages = await Language.find({ isActive: true }).sort({ name: 1 })
    res.json(languages)
  } catch (error) {
    console.error('Error obteniendo idiomas:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener lecciones por idioma y nivel
app.get('/api/languages/:languageCode/lessons', async (req, res) => {
  try {
    const { languageCode } = req.params
    const { level = 'beginner' } = req.query

    const lessons = await Lesson.find({
      languageCode,
      level,
      isActive: true
    }).sort({ unit: 1, lessonNumber: 1 })

    res.json(lessons)
  } catch (error) {
    console.error('Error obteniendo lecciones:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener una lección específica
app.get('/api/lessons/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params
    const lesson = await Lesson.findById(lessonId)

    if (!lesson) {
      return res.status(404).json({ error: 'Lección no encontrada' })
    }

    res.json(lesson)
  } catch (error) {
    console.error('Error obteniendo lección:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener progreso del usuario
app.get('/api/users/:userId/progress', async (req, res) => {
  try {
    const { userId } = req.params
    const { languageCode } = req.query

    let query = { userId }
    if (languageCode) {
      query.languageCode = languageCode
    }

    const progress = await UserProgress.find(query)
    res.json(progress)
  } catch (error) {
    console.error('Error obteniendo progreso:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Actualizar progreso del usuario
app.post('/api/users/:userId/progress', async (req, res) => {
  try {
    const { userId } = req.params
    const { languageCode, unit, lesson, score } = req.body

    let progress = await UserProgress.findOne({ userId, languageCode })

    if (!progress) {
      // Crear nuevo progreso
      progress = new UserProgress({
        userId,
        languageCode,
        currentUnit: unit,
        currentLesson: lesson,
        completedLessons: [{
          unit,
          lesson,
          score,
          completedAt: new Date()
        }],
        totalScore: score,
        lastStudyDate: new Date()
      })
    } else {
      // Actualizar progreso existente
      const existingLesson = progress.completedLessons.find(
        l => l.unit === unit && l.lesson === lesson
      )

      if (!existingLesson) {
        progress.completedLessons.push({
          unit,
          lesson,
          score,
          completedAt: new Date()
        })
      } else {
        // Actualizar score si es mejor
        if (score > existingLesson.score) {
          existingLesson.score = score
          existingLesson.completedAt = new Date()
        }
      }

      // Actualizar posición actual si es la siguiente lección
      if (unit >= progress.currentUnit && lesson >= progress.currentLesson) {
        progress.currentUnit = unit
        progress.currentLesson = lesson + 1
      }

      // Recalcular score total
      progress.totalScore = progress.completedLessons.reduce((sum, l) => sum + l.score, 0)
      progress.lastStudyDate = new Date()
      progress.updatedAt = new Date()
    }

    await progress.save()
    res.json(progress)
  } catch (error) {
    console.error('Error actualizando progreso:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ==================== RUTA DE EMERGENCIA ====================

// Ruta para arreglar cuenta de maclean
app.post('/api/fix-maclean-account', async (req, res) => {
  try {
    const result = await User.findOneAndUpdate(
      { email: 'macleanjhon17@gmail.com' },
      {
        isActive: true,
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // +1 año
        subscriptionStatus: 'active',
        paymentStatus: 'paid',
        updatedAt: new Date()
      },
      { new: true }
    )

    if (result) {
      console.log('✅ Cuenta de maclean arreglada')
      res.json({ success: true, message: 'Cuenta arreglada', user: result })
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' })
    }
  } catch (error) {
    console.error('Error arreglando cuenta:', error)
    res.status(500).json({ error: 'Error interno' })
  }
})

// ==================== PANEL DE ADMINISTRACIÓN ====================

// Obtener todos los usuarios para administración
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 })

    // Agregar información de días restantes
    const usersWithStatus = users.map(user => {
      let daysRemaining = null
      if (user.expiresAt) {
        const now = new Date()
        const diffTime = user.expiresAt - now
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      }

      return {
        ...user.toObject(),
        daysRemaining
      }
    })

    res.json({ users: usersWithStatus })
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Activar usuario manualmente
app.post('/api/admin/activate/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { adminEmail = 'admin@maclean.com' } = req.body

    const now = new Date()
    const expirationDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 días

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isActive: true,
        activatedAt: now,
        expiresAt: expirationDate,
        subscriptionStatus: 'active',
        activatedBy: adminEmail,
        paymentStatus: 'paid',
        updatedAt: now
      },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    console.log(`✅ Usuario activado: ${user.email} por ${adminEmail}`)
    console.log(`📅 Expira el: ${expirationDate.toLocaleDateString()}`)

    res.json({
      success: true,
      message: `Usuario ${user.email} activado por 30 días`,
      user: {
        ...user.toObject(),
        daysRemaining: 30
      }
    })
  } catch (error) {
    console.error('❌ Error activando usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Desactivar usuario manualmente
app.post('/api/admin/deactivate/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { adminEmail = 'admin@maclean.com' } = req.body

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isActive: false,
        subscriptionStatus: 'suspended',
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    console.log(`❌ Usuario desactivado: ${user.email} por ${adminEmail}`)

    res.json({
      success: true,
      message: `Usuario ${user.email} desactivado`,
      user: user.toObject()
    })
  } catch (error) {
    console.error('❌ Error desactivando usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener estadísticas de usuarios
app.get('/api/admin/stats', async (req, res) => {
  try {
    const total = await User.countDocuments()
    const active = await User.countDocuments({ isActive: true })
    const pending = await User.countDocuments({ subscriptionStatus: 'pending' })
    const expired = await User.countDocuments({ subscriptionStatus: 'expired' })

    res.json({
      total,
      active,
      pending,
      expired,
      inactive: total - active
    })
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

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
