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
    if (!tutor) return;

    const convs = messageService.getConversations();
    let conv = convs.find((c) => Number(c.tutorId) === Number(tutor.id));

    if (conv) {
      setActiveConvId(conv.id);
      setMessages(conv.messages || []);
    } else {
      // Preview mode before first message
      setMessages([
        {
          id: 'welcome',
          senderId: tutor.id,
          senderName: tutor.name,
          text: `Hello! I am ${tutor.name}. Feel free to ask me any questions about learning sessions, subjects, or schedule.`,
          timestamp: 'Just now',
        },
      ]);
    }
  }, [tutor]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const sender = user || {
      id: 'guest-user',
      name: 'Guardian / Learner',
    };

    if (!activeConvId) {
      const conv = messageService.startConversation(tutor, sender, inputText.trim());
      setActiveConvId(conv.id);
      setMessages(conv.messages);
    } else {
      const res = messageService.sendMessage(activeConvId, inputText.trim(), sender);
      if (res) {
        setMessages([...res.conversation.messages]);
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
                m.senderId === user?.id ||
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
