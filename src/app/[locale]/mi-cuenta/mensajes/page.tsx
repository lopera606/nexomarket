'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Search, Paperclip, MessageCircle } from 'lucide-react'

interface Message {
  id: number
  sender: 'customer' | 'store'
  text: string
  time: string
}

interface Conversation {
  id: string
  storeName: string
  storeAvatar: string
  lastMessage: string
  timeAgo: string
  unread: boolean
  messageCount: number
  messages: Message[]
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    storeName: 'TechStore Pro',
    storeAvatar: '🏪',
    lastMessage: '¿Te ha llegado ya tu pedido? Confirma que todo está bien',
    timeAgo: 'Hace 2 horas',
    unread: true,
    messageCount: 1,
    messages: [
      { id: 1, sender: 'store', text: 'Hola, tu pedido fue despachado el 19 de marzo', time: '10:30' },
      { id: 2, sender: 'customer', text: 'Gracias, estoy esperando la entrega', time: '10:35' },
      { id: 3, sender: 'store', text: '¿Te ha llegado ya tu pedido? Confirma que todo está bien', time: '15:45' },
    ],
  },
  {
    id: '2',
    storeName: 'Adventure Gear',
    storeAvatar: '⛺',
    lastMessage: 'Gracias por tu compra! Esperamos verte pronto de nuevo',
    timeAgo: 'Ayer',
    unread: false,
    messageCount: 0,
    messages: [
      { id: 1, sender: 'customer', text: 'Hola, ¿envían internacionalmente?', time: 'Ayer 09:00' },
      { id: 2, sender: 'store', text: 'Sí, enviamos a toda Europa', time: 'Ayer 10:15' },
      { id: 3, sender: 'customer', text: 'Perfecto, acabo de hacer mi compra', time: 'Ayer 14:30' },
      { id: 4, sender: 'store', text: 'Gracias por tu compra! Esperamos verte pronto de nuevo', time: 'Ayer 18:20' },
    ],
  },
  {
    id: '3',
    storeName: 'HomeLight Solutions',
    storeAvatar: '🏠',
    lastMessage: 'Hemos recibido tu consulta sobre el producto. Te responderemos pronto',
    timeAgo: 'Hace 3 días',
    unread: false,
    messageCount: 0,
    messages: [
      { id: 1, sender: 'customer', text: '¿Qué voltaje tiene esta lámpara?', time: 'Hace 3 días 11:00' },
      { id: 2, sender: 'store', text: 'Hemos recibido tu consulta sobre el producto. Te responderemos pronto', time: 'Hace 3 días 13:30' },
    ],
  },
  {
    id: '4',
    storeName: 'Tech Accessories',
    storeAvatar: '📦',
    lastMessage: 'Tu devolución ha sido procesada con éxito',
    timeAgo: 'Hace 1 semana',
    unread: false,
    messageCount: 0,
    messages: [
      { id: 1, sender: 'customer', text: 'Necesito devolver el producto', time: 'Hace 1 semana 09:00' },
      { id: 2, sender: 'store', text: 'Claro, te enviaremos una etiqueta de devolución', time: 'Hace 1 semana 10:00' },
      { id: 3, sender: 'customer', text: 'Ya lo envié de vuelta', time: 'Hace 5 días 16:00' },
      { id: 4, sender: 'store', text: 'Tu devolución ha sido procesada con éxito', time: 'Hace 1 semana 14:00' },
    ],
  },
]

export default function MensajesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [selectedId, setSelectedId] = useState<string>('1')
  const [searchQuery, setSearchQuery] = useState('')
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0]

  const filteredConversations = conversations.filter(conv =>
    conv.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = conversations.filter(conv => conv.unread).length

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation.messages])

  const handleSendMessage = async () => {
    if (messageText.trim() && !isSending) {
      setIsSending(true)
      await new Promise(resolve => setTimeout(resolve, 300))

      const newMessage: Message = {
        id: selectedConversation.messages.length + 1,
        sender: 'customer',
        text: messageText,
        time: 'Ahora',
      }

      const updatedConversations = conversations.map(conv =>
        conv.id === selectedId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageText,
              timeAgo: 'Hace unos segundos',
            }
          : conv
      )

      setConversations(updatedConversations)
      setMessageText('')
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">Mensajes</h1>
        <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A]">
          {unreadCount > 0
            ? `${unreadCount} msg sin leer`
            : 'Tus conversaciones'}
        </p>
      </div>

      {/* Chat Layout */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 h-[500px] sm:h-[600px] lg:h-[700px]">
        {/* Conversations List - Left Panel */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#FFFFFF] border border-gray-100 overflow-hidden flex flex-col" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          {/* Search */}
          <div className="p-3 sm:p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-[#4A4A4A]" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl sm:rounded-2xl border border-gray-200 pl-10 pr-3 py-2 text-xs sm:text-sm bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="overflow-y-auto flex-1">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedId(conversation.id)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 text-left transition-all duration-200 ${
                    selectedId === conversation.id
                      ? 'bg-[#0066FF]/5 border-l-4 border-l-[#0066FF]'
                      : 'hover:bg-[#FAFAFA]'
                  }`}
                >
                  <div className="flex gap-2 sm:gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center text-base sm:text-lg flex-shrink-0">
                      {conversation.storeAvatar}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5 sm:mb-1">
                        <p
                          className={`font-semibold text-xs sm:text-sm truncate ${
                            conversation.unread ? 'text-[#000000] font-extrabold' : 'text-[#000000]'
                          }`}
                        >
                          {conversation.storeName}
                        </p>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-[#0066FF] rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className={`text-[10px] sm:text-xs truncate ${conversation.unread ? 'text-[#000000] font-medium' : 'text-[#4A4A4A]'}`}>
                        {conversation.lastMessage}
                      </p>
                      <p className="text-[8px] sm:text-[10px] text-[#4A4A4A] mt-0.5 sm:mt-1">{conversation.timeAgo}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 sm:p-8 text-center">
                <MessageCircle className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-[#4A4A4A] mb-2" />
                <p className="text-xs sm:text-sm text-[#4A4A4A]">No se encontraron conversaciones</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area - Right Panel */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#FFFFFF] border border-gray-100 overflow-hidden flex flex-col lg:col-span-2" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          {/* Chat Header */}
          <div className="p-3 sm:p-6 border-b border-gray-100 flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center text-base sm:text-lg flex-shrink-0">
              {selectedConversation.storeAvatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs sm:text-sm text-[#000000] truncate">{selectedConversation.storeName}</p>
              <p className="text-[10px] sm:text-xs text-[#4A4A4A]">En línea</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-[#FFFFFF]">
            {selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'store' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    {selectedConversation.storeAvatar}
                  </div>
                )}
                <div
                  className={`max-w-[70%] sm:max-w-xs px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl ${
                    message.sender === 'customer'
                      ? 'bg-[#0066FF] text-white rounded-br-none'
                      : 'bg-[#FAFAFA] text-[#000000] rounded-bl-none'
                  }`}
                >
                  <p className="text-xs sm:text-sm break-words">{message.text}</p>
                  <p
                    className={`text-[10px] sm:text-xs mt-1 ${
                      message.sender === 'customer' ? 'text-blue-100' : 'text-[#4A4A4A]'
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 sm:p-4 border-t border-gray-100 bg-[#FFFFFF]">
            <div className="flex gap-2 sm:gap-3">
              <button
                className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl hover:bg-[#FAFAFA] text-[#4A4A4A] hover:text-[#000000] transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
                disabled={isSending}
                title="Adjuntar archivo"
              >
                <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <input
                type="text"
                placeholder="Mensaje..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                disabled={isSending}
                className="flex-1 rounded-xl sm:rounded-2xl border border-gray-200 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || isSending}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#0066FF] text-white hover:bg-[#0052CC] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
