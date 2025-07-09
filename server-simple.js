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

// Esquema de Idiomas
const LanguageSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  nativeName: {
    type: String,
    required: true
  },
  flag: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  unit: {
    type: Number,
    required: true
  },
  lessonNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  vocabulary: [{
    word: String,
    translation: String,
    pronunciation: String,
    example: String
  }],
  exercises: [{
    type: {
      type: String,
      enum: ['vocabulary', 'translation', 'multiple-choice', 'fill-blank'],
      required: true
    },
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
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
    lessonId: mongoose.Schema.Types.ObjectId,
    unit: Number,
    lesson: Number,
    score: Number,
    completedAt: Date
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
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

// Completar lección y actualizar progreso
app.post('/api/lessons/:lessonId/complete', async (req, res) => {
  try {
    const { lessonId } = req.params
    const { userId, score } = req.body

    // Obtener la lección
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
      return res.status(404).json({ error: 'Lección no encontrada' })
    }

    // Buscar o crear progreso del usuario
    let progress = await UserProgress.findOne({
      userId,
      languageCode: lesson.languageCode
    })

    if (!progress) {
      progress = new UserProgress({
        userId,
        languageCode: lesson.languageCode,
        level: lesson.level,
        currentUnit: lesson.unit,
        currentLesson: lesson.lessonNumber,
        completedLessons: [],
        totalScore: 0,
        streak: 1,
        lastStudyDate: new Date()
      })
    }

    // Verificar si ya completó esta lección
    const existingCompletion = progress.completedLessons.find(
      cl => cl.lessonId.toString() === lessonId
    )

    if (existingCompletion) {
      // Actualizar score si es mejor
      if (score > existingCompletion.score) {
        existingCompletion.score = score
        existingCompletion.completedAt = new Date()
      }
    } else {
      // Agregar nueva lección completada
      progress.completedLessons.push({
        lessonId,
        unit: lesson.unit,
        lesson: lesson.lessonNumber,
        score,
        completedAt: new Date()
      })
    }

    // Actualizar progreso general
    progress.totalScore = progress.completedLessons.reduce((sum, cl) => sum + cl.score, 0)
    progress.lastStudyDate = new Date()
    progress.updatedAt = new Date()

    // Actualizar posición actual si es la siguiente lección
    if (lesson.unit >= progress.currentUnit && lesson.lessonNumber >= progress.currentLesson) {
      progress.currentUnit = lesson.unit
      progress.currentLesson = lesson.lessonNumber + 1
    }

    await progress.save()

    console.log(`✅ Lección completada: ${lesson.title} por usuario ${userId}`)
    res.json({ success: true, progress, score })
  } catch (error) {
    console.error('Error completando lección:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' })
})

// Ruta para verificar email exacto
app.get('/api/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params
    const user = await User.findOne({ email: email.toLowerCase() })

    if (user) {
      res.json({
        found: true,
        email: user.email,
        isActive: user.isActive,
        subscriptionStatus: user.subscriptionStatus
      })
    } else {
      res.json({ found: false, searchedEmail: email })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Función para inicializar datos de ejemplo
async function initializeData() {
  try {
    // Verificar si ya existen idiomas
    const existingLanguages = await Language.countDocuments()
    if (existingLanguages > 0) {
      console.log('📚 Datos de idiomas ya existen')
      return
    }

    console.log('🔄 Inicializando datos de idiomas...')

    // Crear idiomas
    const languages = [
      {
        code: 'en',
        name: 'Inglés',
        nativeName: 'English',
        flag: '🇺🇸',
        difficulty: 'beginner',
        totalLessons: 10
      },
      {
        code: 'fr',
        name: 'Francés',
        nativeName: 'Français',
        flag: '🇫🇷',
        difficulty: 'intermediate',
        totalLessons: 8
      },
      {
        code: 'de',
        name: 'Alemán',
        nativeName: 'Deutsch',
        flag: '🇩🇪',
        difficulty: 'intermediate',
        totalLessons: 6
      },
      {
        code: 'it',
        name: 'Italiano',
        nativeName: 'Italiano',
        flag: '🇮🇹',
        difficulty: 'beginner',
        totalLessons: 7
      }
    ]

    await Language.insertMany(languages)
    console.log('✅ Idiomas creados')

    // Crear lecciones de inglés
    const englishLessons = [
      {
        languageCode: 'en',
        level: 'beginner',
        unit: 1,
        lessonNumber: 1,
        title: 'Saludos Básicos',
        description: 'Aprende a saludar en inglés',
        vocabulary: [
          { word: 'Hello', translation: 'Hola', pronunciation: '/həˈloʊ/', example: 'Hello, how are you?' },
          { word: 'Good morning', translation: 'Buenos días', pronunciation: '/ɡʊd ˈmɔrnɪŋ/', example: 'Good morning, everyone!' },
          { word: 'Good afternoon', translation: 'Buenas tardes', pronunciation: '/ɡʊd ˌæftərˈnun/', example: 'Good afternoon, sir.' },
          { word: 'Good evening', translation: 'Buenas noches', pronunciation: '/ɡʊd ˈivnɪŋ/', example: 'Good evening, ladies and gentlemen.' },
          { word: 'Goodbye', translation: 'Adiós', pronunciation: '/ɡʊdˈbaɪ/', example: 'Goodbye, see you tomorrow!' }
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: '¿Cómo se dice "Hola" en inglés?',
            options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
            correctAnswer: 'Hello',
            explanation: 'Hello es la forma más común de saludar en inglés.'
          },
          {
            type: 'translation',
            question: 'Traduce: "Good morning"',
            correctAnswer: 'Buenos días',
            explanation: 'Good morning se usa para saludar en la mañana.'
          },
          {
            type: 'fill-blank',
            question: 'Complete: "_____, how are you?"',
            correctAnswer: 'Hello',
            explanation: 'Hello es el saludo más apropiado para esta frase.'
          }
        ]
      },
      {
        languageCode: 'en',
        level: 'beginner',
        unit: 1,
        lessonNumber: 2,
        title: 'Presentaciones',
        description: 'Aprende a presentarte en inglés',
        vocabulary: [
          { word: 'My name is', translation: 'Mi nombre es', pronunciation: '/maɪ neɪm ɪz/', example: 'My name is John.' },
          { word: 'I am', translation: 'Yo soy', pronunciation: '/aɪ æm/', example: 'I am a student.' },
          { word: 'Nice to meet you', translation: 'Mucho gusto', pronunciation: '/naɪs tu mit ju/', example: 'Nice to meet you, Maria.' },
          { word: 'Where are you from?', translation: '¿De dónde eres?', pronunciation: '/wɛr ɑr ju frʌm/', example: 'Where are you from?' },
          { word: 'I am from', translation: 'Soy de', pronunciation: '/aɪ æm frʌm/', example: 'I am from Mexico.' }
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: '¿Cómo se dice "Mi nombre es" en inglés?',
            options: ['My name is', 'I am from', 'Nice to meet you', 'Where are you from'],
            correctAnswer: 'My name is',
            explanation: 'My name is es la forma estándar de decir tu nombre.'
          },
          {
            type: 'translation',
            question: 'Traduce: "Nice to meet you"',
            correctAnswer: 'Mucho gusto',
            explanation: 'Nice to meet you se usa cuando conoces a alguien por primera vez.'
          }
        ]
      },
      {
        languageCode: 'en',
        level: 'beginner',
        unit: 1,
        lessonNumber: 3,
        title: 'Números del 1 al 10',
        description: 'Aprende los números básicos en inglés',
        vocabulary: [
          { word: 'One', translation: 'Uno', pronunciation: '/wʌn/', example: 'I have one book.' },
          { word: 'Two', translation: 'Dos', pronunciation: '/tu/', example: 'Two cats are playing.' },
          { word: 'Three', translation: 'Tres', pronunciation: '/θri/', example: 'Three apples on the table.' },
          { word: 'Four', translation: 'Cuatro', pronunciation: '/fɔr/', example: 'Four students in the class.' },
          { word: 'Five', translation: 'Cinco', pronunciation: '/faɪv/', example: 'Five fingers on my hand.' },
          { word: 'Six', translation: 'Seis', pronunciation: '/sɪks/', example: 'Six chairs in the room.' },
          { word: 'Seven', translation: 'Siete', pronunciation: '/ˈsɛvən/', example: 'Seven days in a week.' },
          { word: 'Eight', translation: 'Ocho', pronunciation: '/eɪt/', example: 'Eight hours of sleep.' },
          { word: 'Nine', translation: 'Nueve', pronunciation: '/naɪn/', example: 'Nine planets in the solar system.' },
          { word: 'Ten', translation: 'Diez', pronunciation: '/tɛn/', example: 'Ten fingers total.' }
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: '¿Cómo se dice "cinco" en inglés?',
            options: ['Four', 'Five', 'Six', 'Seven'],
            correctAnswer: 'Five',
            explanation: 'Five es el número cinco en inglés.'
          },
          {
            type: 'translation',
            question: 'Traduce: "Eight"',
            correctAnswer: 'Ocho',
            explanation: 'Eight significa ocho en español.'
          }
        ]
      }
    ]

    await Lesson.insertMany(englishLessons)
    console.log('✅ Lecciones de inglés creadas')

  } catch (error) {
    console.error('❌ Error inicializando datos:', error)
  }
}

// Conectar a MongoDB y iniciar servidor
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Conectado a MongoDB')

  // Inicializar datos de ejemplo
  await initializeData()

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    console.log(`📚 API de idiomas disponible en http://localhost:${PORT}/api/languages`)
  })
})
.catch(err => console.error('❌ Error conectando a MongoDB:', err))
