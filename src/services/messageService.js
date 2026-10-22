import { getStorage, setStorage } from './storage';
import { INITIAL_CONVERSATIONS } from './mockData';

const CONVERSATIONS_KEY = 'tutorConnectConversations';

export const messageService = {
  getConversations() {
    return getStorage(CONVERSATIONS_KEY, INITIAL_CONVERSATIONS);
  },

  getConversationById(id) {
    const list = this.getConversations();
    return list.find((c) => c.id === id) || null;
  },

  sendMessage(conversationId, text, senderUser) {
    const list = this.getConversations();
    const index = list.findIndex((c) => c.id === conversationId);
    if (index === -1) return null;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: senderUser.id,
      senderName: senderUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const conv = list[index];
    conv.messages = [...(conv.messages || []), newMessage];
    conv.lastMessage = text;
    conv.lastMessageTime = newMessage.timestamp;

    list[index] = conv;
    setStorage(CONVERSATIONS_KEY, list);
    return { conversation: conv, message: newMessage };
  },

  startConversation(tutor, currentUser, initialText) {
    const list = this.getConversations();
    let conv = list.find((c) => Number(c.tutorId) === Number(tutor.id));

    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        tutorId: tutor.id,
        tutorName: tutor.name,
        userId: currentUser?.id || 'u-guest',
        userName: currentUser?.name || 'Guardian / Learner',
        lastMessage: initialText,
        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unreadCount: 0,
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: currentUser?.id || 'u-guest',
            senderName: currentUser?.name || 'You',
            text: initialText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
      list.unshift(conv);
    } else {
      conv.messages.push({
        id: `msg-${Date.now()}`,
        senderId: currentUser?.id || 'u-guest',
        senderName: currentUser?.name || 'You',
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      conv.lastMessage = initialText;
      conv.lastMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    setStorage(CONVERSATIONS_KEY, list);
    return conv;
  },
};
