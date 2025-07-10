import React, { useState, useEffect, useRef } from 'react'
import { Send, Mic, MicOff, Volume2, Bot, User, Loader, MessageCircle } from 'lucide-react'
import { API_BASE_URL } from '../config/api'

const AITutor = ({ language, userLevel = 'beginner', topic = 'Conversación general' }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [conversationStarted, setConversationStarted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  // Configurar reconocimiento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = getLanguageCode(language.code)

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language.code])

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mapeo de códigos de idioma
  const getLanguageCode = (code) => {
    const languageMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'ru': 'ru-RU',
      'nl': 'nl-NL',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'hi': 'hi-IN',
      'ar': 'ar-SA',
      'he': 'he-IL',
      'sv': 'sv-SE',
      'no': 'no-NO'
    }
    return languageMap[code] || 'en-US'
  }

  // Iniciar conversación con el tutor
  const startConversation = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-tutor/start-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languageCode: language.code,
          languageName: language.name,
          userLevel,
          topic
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages([{
          id: Date.now(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }])
        setConversationStarted(true)
      } else {
        setMessages([{
          id: Date.now(),
          role: 'assistant',
          content: data.fallbackMessage || 'Error al iniciar la conversación',
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: '¡Hola! Soy tu tutor de IA. Lamentablemente tengo problemas técnicos ahora, pero podemos practicar de todas formas. ¿Qué te gustaría aprender hoy? 😊',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
      setConversationStarted(true)
    }
  }

  // Enviar mensaje al tutor
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-tutor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          languageCode: language.code,
          languageName: language.name,
          userLevel,
          conversationHistory: messages.slice(-6) // Últimos 6 mensajes para contexto
        })
      })

      const data = await response.json()
      
      setTimeout(() => {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.success ? data.message : data.fallbackMessage || 'Lo siento, no pude procesar tu mensaje.',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])
        setIsTyping(false)
      }, 1000) // Simular tiempo de "escritura"

    } catch (error) {
      console.error('Error sending message:', error)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Lo siento, tengo problemas para responder ahora. ¿Puedes intentar de nuevo? 🤔',
          timestamp: new Date()
        }])
        setIsTyping(false)
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para reproducir mensaje con voz
  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = getLanguageCode(language.code)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  // Iniciar/detener reconocimiento de voz
  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  // Manejar envío con Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg h-[700px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">Tutor de IA - {language.name}</h3>
            <p className="text-sm opacity-90">
              Nivel: {userLevel} • Tema: {topic}
            </p>
            <p className="text-xs opacity-75">
              🗣️ Conversando en {language.nativeName}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!conversationStarted ? (
          <div className="text-center py-8">
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <Bot className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Hola! Soy tu tutor personal de {language.name}
              </h4>
              <p className="text-gray-600 mb-4">
                Estoy aquí para ayudarte a aprender de forma interactiva. 
                Podemos conversar, practicar pronunciación y resolver tus dudas.
              </p>
              <button
                onClick={startConversation}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Iniciando...</span>
                  </div>
                ) : (
                  'Comenzar Conversación'
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                } rounded-lg p-3`}>
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className="h-5 w-5 mt-0.5 text-blue-500" />
                    )}
                    {message.role === 'user' && (
                      <User className="h-5 w-5 mt-0.5 text-white" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => speakMessage(message.content)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Volume2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {conversationStarted && (
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              {recognitionRef.current && (
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              )}
              
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {isListening && (
            <div className="mt-2 text-center">
              <span className="text-sm text-red-600 flex items-center justify-center space-x-1">
                <Mic className="h-4 w-4 animate-pulse" />
                <span>Escuchando...</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AITutor
