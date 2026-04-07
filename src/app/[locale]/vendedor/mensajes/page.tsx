'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Search, Paperclip, Loader2, MessageSquare } from 'lucide-react'

interface Message {
  id: string;
  sender: 'customer' | 'seller';
  senderName: string;
  text: string;
  time: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  customer: string;
  customerId: string;
  subject: string | null;
  isClosed: boolean;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
}

export default function MensajesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/vendedor/mensajes')
        if (res.ok) {
          const data = await res.json()
          const convos = data.conversations || []
          setConversations(convos)
          if (convos.length > 0) setSelectedId(convos[0].id)
        }
      } catch {
        console.error('Error fetching messages')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const selectedConversation = conversations.find(c => c.id === selectedId) || null

  const filteredConversations = conversations.filter(conv =>
    conv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.subject || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages])

  const handleSendMessage = async () => {
    if (messageText.trim() && !isSending) {
      setIsSending(true)
      // Optimistic update
      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        sender: 'seller',
        senderName: 'Tu',
        text: messageText,
        time: new Date().toISOString(),
        isRead: true,
      }

      setConversations(prev => prev.map(conv =>
        conv.id === selectedId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessageAt: new Date().toISOString(),
            }
          : conv
      ))
      setMessageText('')
      setIsSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="space-y-6 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-[#000000]">Mensajes</h1>
          <p className="text-[#4A4A4A]">Comunicate con tus clientes</p>
        </div>
        <div className="rounded-3xl bg-[#FFFFFF] border border-gray-100 p-12 text-center" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#000000] mb-2">Sin mensajes</h2>
          <p className="text-[#4A4A4A]">Cuando tus clientes te escriban, las conversaciones apareceran aqui.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-[#000000]">Mensajes</h1>
        <p className="text-[#4A4A4A]">Comunicate con tus clientes</p>
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
                placeholder="Buscar conversacion..."
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
                  <div className="text-xl flex-shrink-0">
                    {conversation.customer.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={`font-semibold text-sm truncate ${conversation.unreadCount > 0 ? 'text-[#000000] font-extrabold' : 'text-[#000000]'}`}>
                        {conversation.customer}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <div className="w-2 h-2 bg-[#0066FF] rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-xs truncate ${conversation.unreadCount > 0 ? 'text-[#000000] font-medium' : 'text-[#4A4A4A]'}`}>
                      {conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].text : conversation.subject || 'Sin mensajes'}
                    </p>
                    <p className="text-[10px] text-[#4A4A4A] mt-1">
                      {new Date(conversation.lastMessageAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-gray-100 overflow-hidden flex flex-col lg:col-span-2" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedConversation.customer.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-[#000000]">{selectedConversation.customer}</p>
                    <p className="text-sm text-[#4A4A4A]">
                      {selectedConversation.isClosed ? 'Conversacion cerrada' : 'Activa'}
                    </p>
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
                        {selectedConversation.customer.charAt(0)}
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
                        {new Date(message.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {!selectedConversation.isClosed && (
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
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#4A4A4A]">
              Selecciona una conversacion
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
