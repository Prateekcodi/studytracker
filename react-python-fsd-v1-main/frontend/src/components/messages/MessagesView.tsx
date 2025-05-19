import React, { useState } from "react";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  User,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Math Study Group",
    lastMessage: "Does anyone want to review calculus tonight?",
    timestamp: "2024-03-19T10:30:00",
    unread: 3,
  },
  {
    id: "2",
    name: "Physics Team",
    lastMessage: "I uploaded the problem set solutions",
    timestamp: "2024-03-19T09:15:00",
    unread: 0,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
    lastMessage: "Thanks for helping with the homework!",
    timestamp: "2024-03-18T18:45:00",
    unread: 1,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "other",
    text: "Hey everyone! Shall we start our study session?",
    timestamp: "2024-03-19T10:00:00",
    read: true,
  },
  {
    id: "2",
    senderId: "me",
    text: "Yes, I am ready to begin!",
    timestamp: "2024-03-19T10:01:00",
    read: true,
  },
  {
    id: "3",
    senderId: "other",
    text: "Great! Lets focus on chapter 5 today",
    timestamp: "2024-03-19T10:02:00",
    read: true,
  },
];

const MessagesView: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Here you would typically send the message to your backend
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Chats Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
                selectedChat === chat.id ? "bg-indigo-50" : ""
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              {chat.avatar ? (
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="text-indigo-600" size={24} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(chat.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                  {chat.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {mockChats.find((c) => c.id === selectedChat)?.name}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Phone size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Video size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    message.senderId === "me"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === "me"
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
            ))}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="bg-white border-t border-gray-200 p-4"
          >
            <div className="flex items-center space-x-4">
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
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
