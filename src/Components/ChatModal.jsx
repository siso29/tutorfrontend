import { useState, useEffect, useRef } from 'react';
import { messageService } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

function ChatModal({ tutor, onClose }) {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeConvId, setActiveConvId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let active = true;
    if (!tutor) return () => { active = false; };
    const load = async () => {
      try {
        const conversations = await messageService.getServerConversations();
        const conv = conversations.find((c) => Number(c.tutor_id) === Number(tutor.id) || Number(c.student_id) === Number(tutor.id));
        if (conv) {
          if (!active) return;
          setActiveConvId(conv.id);
          const serverMessages = await messageService.getServerMessages(conv.id);
          if (!active) return;
          setMessages(serverMessages.map((m) => ({ id: m.id, senderId: m.sender_id, senderName: m.sender_name, text: m.body, timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })));
          return;
        }
      } catch {
        // Demo accounts and offline mode use the existing local conversation store.
      }
      if (!active) return;
      const convs = messageService.getConversations();
      const conv = convs.find((c) => Number(c.tutorId) === Number(tutor.id));
      if (conv) {
        setActiveConvId(conv.id);
        setMessages(conv.messages || []);
      } else {
        setActiveConvId(null);
        setMessages([{ id: 'welcome', senderId: tutor.id, senderName: tutor.name, text: `Hello! I am ${tutor.name}. Feel free to ask me any questions about learning sessions, subjects, or schedule.`, timestamp: 'Just now' }]);
      }
    };
    load();
    return () => { active = false; };
  }, [tutor, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    const sender = user || { id: 'guest-user', name: 'Guardian / Learner' };
    try {
      let conversationId = activeConvId;
      if (!conversationId || String(conversationId).startsWith('conv-')) {
        const created = await messageService.createServerConversation(tutor.id);
        conversationId = created.conversation.id;
        setActiveConvId(conversationId);
      }
      const result = await messageService.sendServerMessage(conversationId, text);
      const m = result.message;
      setMessages((previous) => [...previous, { id: m.id, senderId: m.sender_id, senderName: sender.name || user?.name || 'You', text: m.body, timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      // Keep the existing browser-storage demo working if the account is not a real backend account.
      if (!activeConvId || String(activeConvId).startsWith('conv-')) {
        const conv = messageService.startConversation(tutor, sender, text);
        setActiveConvId(conv.id); setMessages(conv.messages);
      } else {
        const result = messageService.sendMessage(activeConvId, text, sender);
        if (result) setMessages([...result.conversation.messages]);
      }
    }
    addToast(`Message sent to ${tutor.name}`, 'success');
    setInputText('');
  };

  if (!tutor) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Chat with {tutor.name}</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {tutor.subjects?.join(', ')} · Typically replies within a few hours
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((m) => {
              const isMine =
                Number(m.senderId) === Number(user?.id) ||
                m.senderId === 'guest-user' ||
                m.senderName?.includes('You') ||
                m.senderName === user?.name;

              return (
                <div
                  key={m.id}
                  className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}
                >
                  <div className="chat-sender-name">{m.senderName}</div>
                  <div>{m.text}</div>
                  <div className="chat-time">{m.timestamp}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-form" onSubmit={handleSend}>
            <input
              type="text"
              className="chat-input"
              placeholder={`Write a message to ${tutor.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              autoFocus
            />
            <button type="submit" className="chat-send-btn">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
