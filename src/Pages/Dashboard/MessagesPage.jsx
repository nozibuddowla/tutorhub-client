import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { AuthContext } from "../../Provider/AuthProvider";

// ─── Singleton socket ─────────────────────────────────────────────────────────
let socket = null;
const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const Avatar = ({ src, name, size = 10, online = false }) => (
  <div className="relative shrink-0">
    <img
      src={src || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
      alt={name}
      className={`w-${size} h-${size} rounded-full object-cover`}
      onError={(e) => {
        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
      }}
    />
    {online && (
      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
    )}
  </div>
);

// ─── Conversation List ────────────────────────────────────────────────────────
const ConversationList = ({
  conversations,
  selectedId,
  onSelect,
  currentUserEmail,
  loading,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900">Messages</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {conversations.length} conversation
          {conversations.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-5xl mb-3">💬</div>
            <p className="text-gray-500 font-medium text-sm">
              No conversations yet
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Start chatting from your tuition cards
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isStudent = conv.studentEmail === currentUserEmail;
            const otherName = isStudent ? conv.tutorName : conv.studentName;
            const otherPhoto = isStudent ? conv.tutorPhoto : conv.studentPhoto;
            const unread = conv.unreadCount?.[currentUserEmail] || 0;
            const isSelected = conv._id === selectedId;

            return (
              <button
                key={conv._id}
                onClick={() => onSelect(conv)}
                className={`w-full text-left px-4 py-3.5 flex items-center gap-3 border-b border-gray-50 transition-colors ${
                  isSelected
                    ? "bg-purple-50 border-l-4 border-l-purple-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <Avatar src={otherPhoto} name={otherName} size={10} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p
                      className={`text-sm font-semibold truncate ${isSelected ? "text-purple-700" : "text-gray-900"}`}
                    >
                      {otherName}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500 truncate">
                      {conv.lastMessage ||
                        conv.tuitionTitle ||
                        "No messages yet"}
                    </p>
                    {unread > 0 && (
                      <span className="shrink-0 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    📚 {conv.tuitionTitle}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

// ─── Chat Window ──────────────────────────────────────────────────────────────
const ChatWindow = ({ conversation, currentUser, role }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const sock = getSocket();

  const isStudent = conversation.studentEmail === currentUser.email;
  const otherName = isStudent
    ? conversation.tutorName
    : conversation.studentName;
  const otherPhoto = isStudent
    ? conversation.tutorPhoto
    : conversation.studentPhoto;
  const otherEmail = isStudent
    ? conversation.tutorEmail
    : conversation.studentEmail;

  useEffect(() => {
    setLoading(true);
    setMessages([]);

    // Fetch existing messages
    axios
      .get(`${import.meta.env.VITE_API_URL}/messages/${conversation._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Join socket room
    sock.emit("join_conversation", conversation._id);

    // Listen for new messages
    const handleReceive = (msg) => {
      if (msg.conversationId === conversation._id) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.find((m) => m._id?.toString() === msg._id?.toString()))
            return prev;
          return [...prev, msg];
        });
      }
    };

    sock.on("receive_message", handleReceive);
    return () => sock.off("receive_message", handleReceive);
  }, [conversation._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    const payload = {
      conversationId: conversation._id,
      senderEmail: currentUser.email,
      senderName: currentUser.displayName || "User",
      senderPhoto: currentUser.photoURL || "",
      receiverEmail: otherEmail,
      text: trimmed,
    };

    sock.emit("send_message", payload);
    setText("");
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
        <Avatar src={otherPhoto} name={otherName} size={10} online />
        <div className="flex-1">
          <p className="font-bold text-gray-900">{otherName}</p>
          <p className="text-xs text-gray-400">
            📚 {conversation.tuitionTitle}
          </p>
        </div>
        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
          Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-3">👋</div>
            <p className="text-gray-500 font-medium">Start the conversation!</p>
            <p className="text-gray-400 text-sm mt-1">
              Say hello to {otherName}
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderEmail === currentUser.email;
            const showAvatar =
              i === 0 || messages[i - 1]?.senderEmail !== msg.senderEmail;

            return (
              <div
                key={msg._id || i}
                className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar placeholder for alignment */}
                <div className="w-8 shrink-0">
                  {!isMine && showAvatar && (
                    <img
                      src={
                        otherPhoto ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${otherName}`
                      }
                      alt={otherName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </div>

                <div
                  className={`max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? "bg-linear-to-br from-purple-600 to-purple-700 text-white rounded-br-md"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-gray-400 px-1">
                    {formatTime(msg.createdAt)}
                    {isMine && (
                      <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-end gap-3">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${otherName}...`}
          rows={1}
          className="flex-1 resize-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition max-h-32"
          style={{ minHeight: "42px" }}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          className="w-10 h-10 bg-linear-to-br from-purple-600 to-teal-600 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ─── Main Messages Page ───────────────────────────────────────────────────────
const MessagesPage = () => {
  const { user, role } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/conversations/${user.email}`, {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleSelect = (conv) => {
    setSelected(conv);
    setMobileShowChat(true);
    // Clear unread locally
    setConversations((prev) =>
      prev.map((c) =>
        c._id === conv._id
          ? { ...c, unreadCount: { ...c.unreadCount, [user.email]: 0 } }
          : c,
      ),
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
      {/* Sidebar — Conversation List */}
      <div
        className={`w-full md:w-80 border-r border-gray-100 flex-shrink-0 flex flex-col ${
          mobileShowChat ? "hidden md:flex" : "flex"
        }`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selected?._id}
          onSelect={handleSelect}
          currentUserEmail={user?.email}
          loading={loading}
        />
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${!mobileShowChat ? "hidden md:flex" : "flex"}`}
      >
        {selected ? (
          <>
            {/* Mobile back button */}
            <div className="md:hidden px-4 pt-3">
              <button
                onClick={() => setMobileShowChat(false)}
                className="text-sm text-purple-600 font-semibold flex items-center gap-1"
              >
                ← Back to conversations
              </button>
            </div>
            <ChatWindow
              conversation={selected}
              currentUser={user}
              role={role}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center text-4xl mb-4">
              💬
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Your Messages
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Select a conversation to start chatting, or open a message from
              your tuition cards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
