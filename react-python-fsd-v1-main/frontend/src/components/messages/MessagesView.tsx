import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  User,
  MessageSquare,
} from "lucide-react";
import {
  getMessages,
  sendMessage,
  Message as ApiMessage,
  MessageCreate,
} from "../../api/messages";

const CURRENT_USER_ID = 1; // TODO: Replace with real user id from auth

const demoUsers = [
  { id: 1, name: "You" },
  { id: 2, name: "Alice" },
  { id: 3, name: "Bob" },
];
const demoGroups = [
  { id: 1, name: "Math Study Group" },
  { id: 2, name: "Physics Team" },
];

const fallbackMessages = {
  public: [
    {
      id: 1,
      sender_id: 2,
      content: "Welcome to the public chat!",
      type: "public",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      sender_id: 1,
      content: "Hi everyone!",
      type: "public",
      timestamp: new Date().toISOString(),
    },
  ],
  private: [
    {
      id: 3,
      sender_id: 2,
      recipient_id: 1,
      content: "Hey, are you coming to the study session tonight?",
      type: "private",
      timestamp: new Date().toISOString(),
    },
    {
      id: 4,
      sender_id: 1,
      recipient_id: 2,
      content: "Yes, I'll be there!",
      type: "private",
      timestamp: new Date().toISOString(),
    },
  ],
  group: [
    {
      id: 5,
      sender_id: 3,
      group_id: 1,
      content: "Can anyone help me solve this math question: What is the integral of x^2?",
      type: "group",
      timestamp: new Date().toISOString(),
    },
    {
      id: 6,
      sender_id: 2,
      group_id: 1,
      content: "Sure! The answer is (1/3)x^3 + C.",
      type: "group",
      timestamp: new Date().toISOString(),
    },
  ],
};

const MessagesView: React.FC = () => {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'public' | 'private' | 'group'>('public');
  const [recipientId, setRecipientId] = useState<number>(2); // default to Alice
  const [groupId, setGroupId] = useState<number>(1); // default to first group
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use only static fallbackMessages
  useEffect(() => {
    setMessages((fallbackMessages[type] as ApiMessage[]).slice().reverse());
    setError(null);
    setLoading(false);
    // eslint-disable-next-line
  }, [type, groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // Add new message to static messages
    const msg: ApiMessage = {
      id: Date.now(),
      sender_id: 1, // You
      content: newMessage,
      type: type as 'public' | 'private' | 'group',
      timestamp: new Date().toISOString(),
      ...(type === 'private' ? { recipient_id: recipientId } : {}),
      ...(type === 'group' ? { group_id: groupId } : {}),
    };
    setMessages([msg, ...messages]);
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {type === 'public' && 'Public Chat'}
              {type === 'private' && `Private Chat with ${demoUsers.find(u => u.id === recipientId)?.name}`}
              {type === 'group' && `Group: ${demoGroups.find(g => g.id === groupId)?.name}`}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <select
              className="border rounded px-2 py-1"
              value={type}
              onChange={e => setType(e.target.value as any)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="group">Group</option>
            </select>
            {type === 'private' && (
              <select
                className="border rounded px-2 py-1"
                value={recipientId}
                onChange={e => setRecipientId(Number(e.target.value))}
              >
                {demoUsers.filter(u => u.id !== CURRENT_USER_ID).map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            )}
            {type === 'group' && (
              <select
                className="border rounded px-2 py-1"
                value={groupId}
                onChange={e => setGroupId(Number(e.target.value))}
              >
                {demoGroups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet.</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === CURRENT_USER_ID ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg break-words ${
                    message.sender_id === CURRENT_USER_ID
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender_id === CURRENT_USER_ID
                        ? "text-indigo-200"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="bg-white border-t border-gray-200 p-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessagesView;
