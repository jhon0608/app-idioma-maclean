const mongoose = require('mongoose')

// Conexión a MongoDB
const MONGODB_URI = 'mongodb+srv://macleanjhon8:Ooomy2808.@idioma-maclean.6ghudfp.mongodb.net/?retryWrites=true&w=majority&appName=idioma-maclean'

// Esquema de Idiomas
const LanguageSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nativeName: { type: String, required: true },
  flag: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  isActive: { type: Boolean, default: true },
  totalLessons: { type: Number, default: 0 },
  category: { type: String, enum: ['European', 'Asian', 'Middle Eastern', 'Nordic', 'African', 'American'], default: 'European' },
  createdAt: { type: Date, default: Date.now }
})

const Language = mongoose.model('Language', LanguageSchema)

const updateLanguages = async () => {
  try {
    console.log('🔗 Conectando a MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Conectado a MongoDB')

    // Borrar idiomas existentes
    console.log('🗑️ Eliminando idiomas existentes...')
    await Language.deleteMany({})

    // Crear idiomas nuevos
    console.log('🚀 Creando nuevos idiomas...')
    const languages = [
      // Idiomas Europeos
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', difficulty: 'beginner', totalLessons: 15, category: 'European', isActive: true },
      { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', difficulty: 'beginner', totalLessons: 12, category: 'European', isActive: true },
      { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', difficulty: 'intermediate', totalLessons: 10, category: 'European', isActive: true },
      { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', difficulty: 'intermediate', totalLessons: 8, category: 'European', isActive: true },
      { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', difficulty: 'beginner', totalLessons: 10, category: 'European', isActive: true },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', difficulty: 'beginner', totalLessons: 10, category: 'European', isActive: true },
      { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', difficulty: 'advanced', totalLessons: 12, category: 'European', isActive: true },
      { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', difficulty: 'intermediate', totalLessons: 8, category: 'European', isActive: true },
      
      // Idiomas Asiáticos
      { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文', flag: '🇨🇳', difficulty: 'advanced', totalLessons: 15, category: 'Asian', isActive: true },
      { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', difficulty: 'advanced', totalLessons: 12, category: 'Asian', isActive: true },
      { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', difficulty: 'advanced', totalLessons: 10, category: 'Asian', isActive: true },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', difficulty: 'intermediate', totalLessons: 8, category: 'Asian', isActive: true },
      
      // Idiomas del Medio Oriente
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', difficulty: 'advanced', totalLessons: 12, category: 'Middle Eastern', isActive: true },
      { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', difficulty: 'advanced', totalLessons: 8, category: 'Middle Eastern', isActive: true },
      
      // Idiomas Nórdicos
      { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', difficulty: 'intermediate', totalLessons: 8, category: 'Nordic', isActive: true },
      { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', difficulty: 'intermediate', totalLessons: 8, category: 'Nordic', isActive: true }
    ]

    await Language.insertMany(languages)
    console.log(`✅ ${languages.length} idiomas creados exitosamente`)

    // Verificar
    const count = await Language.countDocuments()
    console.log(`📊 Total de idiomas en base de datos: ${count}`)

    console.log('🎉 Actualización completada')
    process.exit(0)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

updateLanguages()
