'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Search, Paperclip } from 'lucide-react'

interface Message {
  id: number
  sender: 'customer' | 'seller'
  text: string
  time: string
}

interface Conversation {
  id: number
  customer: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: boolean
  messages: Message[]
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    customer: 'Ana García López',
    avatar: '👩',
    lastMessage: 'Hola, ¿tienes disponibilidad del MacBook Pro en gris?',
    timestamp: 'Hace 5 min',
    unread: true,
    messages: [
      { id: 1, sender: 'customer', text: 'Hola, ¿tienes disponibilidad del MacBook Pro en gris?', time: '10:30' },
      { id: 2, sender: 'seller', text: 'Sí, tenemos disponibilidad en stock. ¿Necesitas algo más?', time: '10:32' },
      { id: 3, sender: 'customer', text: 'Perfecto, voy a hacer la compra ahora', time: '10:35' },
    ],
  },
  {
    id: 2,
    customer: 'Carlos López Martín',
    avatar: '👨',
    lastMessage: 'Gracias por el envío rápido',
    timestamp: 'Hace 2 horas',
    unread: false,
    messages: [
      { id: 1, sender: 'customer', text: '¿Puedo cambiar mi dirección de envío?', time: '09:00' },
      { id: 2, sender: 'seller', text: 'Claro, ¿cuál es tu nueva dirección?', time: '09:05' },
      { id: 3, sender: 'customer', text: 'Gracias por el envío rápido', time: '14:20' },
    ],
  },
  {
    id: 3,
    customer: 'María Rodríguez González',
    avatar: '👩',
    lastMessage: '¿Aceptas devoluciones?',
    timestamp: 'Hace 1 día',
    unread: false,
    messages: [
      { id: 1, sender: 'customer', text: '¿Aceptas devoluciones?', time: 'Ayer 15:30' },
      { id: 2, sender: 'seller', text: 'Sí, aceptamos devoluciones dentro de 30 días', time: 'Hoy 09:15' },
    ],
  },
  {
    id: 4,
    customer: 'Juan Pérez Sánchez',
    avatar: '👨',
    lastMessage: '¿Cuándo llega mi pedido?',
    timestamp: 'Hace 3 días',
    unread: false,
    messages: [
      { id: 1, sender: 'customer', text: '¿Cuándo llega mi pedido?', time: 'Hace 3 días' },
      { id: 2, sender: 'seller', text: 'Tu pedido está en tránsito. Consulta el número de seguimiento.', time: 'Hace 2 días' },
    ],
  },
]

export default function MensajesPage() {
  const [selectedId, setSelectedId] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [messageText, setMessageText] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0]

  const filteredConversations = conversations.filter(conv =>
    conv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        sender: 'seller',
        text: messageText,
        time: 'Ahora',
      }

      const updatedConversations = conversations.map(conv =>
        conv.id === selectedId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageText,
              timestamp: 'Ahora',
            }
          : conv
      )

      setConversations(updatedConversations)
      setMessageText('')
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-[#000000]">Mensajes</h1>
        <p className="text-[#4A4A4A]">Comunícate con tus clientes</p>
      </div>

      {/* Main Chat Layout */}
      <div className="grid gap-6 lg:grid-cols-3 h-[700px]">
        {/* Conversations List */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-gray-100 overflow-hidden flex flex-col" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4A4A4A]" />
              <input
                type="text"
                placeholder="Buscar conversación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 pl-10 pr-3 py-2 text-sm bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="overflow-y-auto flex-1">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedId(conversation.id)}
                className={`w-full px-4 py-3 border-b border-gray-100 text-left transition-all duration-200 ${
                  selectedId === conversation.id
                    ? 'bg-[#0066FF]/5 border-l-4 border-l-[#0066FF]'
                    : 'hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl flex-shrink-0">{conversation.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={`font-semibold text-sm truncate ${conversation.unread ? 'text-[#000000] font-extrabold' : 'text-[#000000]'}`}>
                        {conversation.customer}
                      </p>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-[#0066FF] rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-xs truncate ${conversation.unread ? 'text-[#000000] font-medium' : 'text-[#4A4A4A]'}`}>
                      {conversation.lastMessage}
                    </p>
                    <p className="text-[10px] text-[#4A4A4A] mt-1">{conversation.timestamp}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-gray-100 overflow-hidden flex flex-col lg:col-span-2" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{selectedConversation.avatar}</div>
              <div>
                <p className="font-semibold text-[#000000]">{selectedConversation.customer}</p>
                <p className="text-sm text-[#4A4A4A]">En línea</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FFFFFF]">
            {selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'customer' && (
                  <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0 text-sm">
                    {selectedConversation.avatar}
                  </div>
                )}
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender === 'seller'
                      ? 'bg-[#0066FF] text-white rounded-br-none'
                      : 'bg-[#FAFAFA] text-[#000000] rounded-bl-none'
                  }`}
                >
                  <p className="text-sm break-words">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'seller' ? 'text-blue-100' : 'text-[#4A4A4A]'
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
          <div className="p-4 border-t border-gray-100 bg-[#FFFFFF]">
            <div className="flex gap-3">
              <button
                className="p-2.5 rounded-2xl hover:bg-[#FAFAFA] text-[#4A4A4A] hover:text-[#000000] transition-colors duration-200 disabled:opacity-50"
                disabled={isSending}
                title="Adjuntar archivo"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                disabled={isSending}
                className="flex-1 rounded-2xl border border-gray-200 px-4 py-2 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || isSending}
                className="px-4 py-2.5 rounded-2xl bg-[#0066FF] text-white hover:bg-[#0052CC] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
