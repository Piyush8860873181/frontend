import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Send, 
  MessageSquare, 
  Tag, 
  MapPin, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { messageService, offerService } from '../services/api';

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedConvId = searchParams.get('conv');

  const { user } = useAuth();
  const { socket, joinConversation, emitMessage } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const currentUserId = (user?._id || user?.id || '').toString();

  // Load conversations list
  const loadConversations = async () => {
    try {
      const res = await messageService.getConversations();
      if (res.data?.success) {
        const convList = res.data.data;
        setConversations(convList);

        if (convList.length > 0) {
          const target = selectedConvId
            ? convList.find(c => (c._id || c.id) === selectedConvId) || convList[0]
            : convList[0];
          setActiveConversation(target);
          if (target && !selectedConvId) {
            setSearchParams({ conv: target._id || target.id });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // When active conversation changes, load messages
  useEffect(() => {
    if (!activeConversation) return;

    const convId = activeConversation._id || activeConversation.id;
    joinConversation(convId);

    const loadMessages = async () => {
      try {
        const res = await messageService.getMessages(convId);
        if (res.data?.success) {
          setMessages(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    loadMessages();

    // Polling fallback every 3s
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [activeConversation?._id]);

  // Socket event listener for real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (activeConversation && (data.conversationId === (activeConversation._id || activeConversation.id))) {
        setMessages((prev) => [...prev, data.message || data]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message', handleReceiveMessage);
  }, [socket, activeConversation]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    const convId = activeConversation._id || activeConversation.id;
    const recipient = activeConversation.otherUser;
    const recipientId = recipient?._id || recipient?.id;

    try {
      setSending(true);
      const text = messageText.trim();
      setMessageText('');

      const res = await messageService.sendMessage({
        conversationId: convId,
        recipientId,
        productId: activeConversation.product?._id || activeConversation.product,
        content: text,
      });

      if (res.data?.success) {
        const newMsg = res.data.data;
        setMessages((prev) => [...prev, newMsg]);
        emitMessage({ conversationId: convId, message: newMsg });
      }
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleRespondOfferInChat = async (offerId, action) => {
    try {
      const res = await offerService.respondToOffer(offerId, { action });
      if (res.data?.success) {
        // Refresh messages to show updated offer status
        const convId = activeConversation._id || activeConversation.id;
        const msgRes = await messageService.getMessages(convId);
        if (msgRes.data?.success) {
          setMessages(msgRes.data.data);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update offer.');
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-500">Loading campus conversations...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <MessageSquare className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">No Messages Yet</h2>
        <p className="text-xs text-slate-500">
          When you click "Chat with Seller" or receive an inquiry on your items, your chats will appear here.
        </p>
        <Link
          to="/marketplace"
          className="inline-block px-6 py-2.5 bg-brand-700 text-white rounded-full text-xs font-semibold shadow-md"
        >
          Explore Marketplace
        </Link>
      </div>
    );
  }

  const otherUser = activeConversation?.otherUser || {};
  const product = activeConversation?.product || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs h-[750px] flex overflow-hidden">
        
        {/* LEFT: Conversation List Sidebar */}
        <div className="w-80 sm:w-96 border-r border-slate-200/80 flex flex-col bg-slate-50/50 flex-shrink-0">
          <div className="p-4 border-b border-slate-200/80 bg-white">
            <h2 className="font-extrabold text-base text-slate-900">Campus Inquiries</h2>
            <p className="text-[11px] text-slate-500">Negotiations & student direct chats</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((c) => {
              const cId = c._id || c.id;
              const isSelected = activeConversation && (activeConversation._id || activeConversation.id) === cId;
              const cOther = c.otherUser || {};
              const cProduct = c.product || {};

              return (
                <button
                  key={cId}
                  onClick={() => {
                    setActiveConversation(c);
                    setSearchParams({ conv: cId });
                  }}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-white border-l-4 border-brand-700 shadow-xs' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <img
                    src={cOther.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${cOther.fullName || 'Student'}`}
                    alt={cOther.fullName}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {cOther.fullName || 'Campus Student'}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <p className="text-[11px] font-medium text-emerald-700 truncate">
                      Re: {cProduct.title || 'Product'}
                    </p>

                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {c.lastMessage || 'Started conversation'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Active Chat Room */}
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Chat Header with Product Summary */}
          {activeConversation ? (
            <>
              <div className="p-3.5 px-6 border-b border-slate-200/80 bg-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={otherUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser.fullName || 'Student'}`}
                    alt={otherUser.fullName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900">{otherUser.fullName || 'Student'}</h3>
                      {otherUser.isCollegeVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">{otherUser.collegeName || 'Campus'}</p>
                  </div>
                </div>

                {/* Product Reference Card */}
                {product && (
                  <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 max-w-xs">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                      alt={product.title}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="truncate text-xs">
                      <p className="font-semibold text-slate-800 truncate">{product.title}</p>
                      <p className="text-[11px] font-bold text-emerald-700">₹{product.sellingPrice}</p>
                    </div>
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="p-1 text-slate-400 hover:text-brand-700"
                      title="View listing page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
                {messages.map((m, idx) => {
                  const mSenderId = (m.sender?._id || m.sender || '').toString();
                  const isMe = mSenderId === currentUserId;

                  return (
                    <div
                      key={m._id || idx}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-brand-700 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                        }`}
                      >
                        {m.content}
                      </div>

                      {/* Embedded Offer Card (if message has offer) */}
                      {m.offer && (
                        <div className="mt-2 p-3.5 rounded-2xl bg-white border-2 border-emerald-500/30 shadow-md max-w-sm space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                            <Tag className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Bargain Proposal</span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Offer Price: <span className="font-extrabold text-slate-900 text-sm">₹{m.offer.offerPrice}</span> (Listed: ₹{m.offer.originalPrice})
                          </p>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-500">
                              Status: <span className="uppercase font-bold text-emerald-600">{m.offer.status}</span>
                            </span>

                            {/* If I'm the seller and offer is pending */}
                            {!isMe && m.offer.status === 'pending' && (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleRespondOfferInChat(m.offer._id, 'accept')}
                                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRespondOfferInChat(m.offer._id, 'reject')}
                                  className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-bold text-[10px]"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3.5 px-6 border-t border-slate-200 bg-white flex items-center gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message or meetup proposal..."
                  className="flex-1 py-2.5 px-4 text-xs sm:text-sm bg-slate-100 border border-transparent rounded-full focus:bg-white focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="p-2.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white shadow-md shadow-brand-700/20 active:scale-95 disabled:opacity-40 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a conversation from the left to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
