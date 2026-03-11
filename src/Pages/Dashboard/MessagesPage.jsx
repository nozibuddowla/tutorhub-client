import { useContext, useEffect, useRef, useState, useCallback } from "react";
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
      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[var(--bg-elevated)]" />
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
}) => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b border-[var(--bg-border)]">
      <h2 className="text-lg font-black text-[var(--text-primary)]">
        Messages
      </h2>
      <p className="text-xs text-[var(--text-muted)] mt-0.5">
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
        <div className="text-center py-16 px-2">
          <div className="text-5xl mb-3">💬</div>
          <p className="text-[var(--text-secondary)] font-medium text-sm">
            No conversations yet
          </p>
          <p className="text-[var(--text-muted)] text-xs mt-1">
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
              className={`w-full text-left px-2 py-3.5 flex items-center gap-3 border-b border-gray-50 transition-colors ${
                isSelected
                  ? "bg-purple-50 dark:bg-purple-900/30 border-l-4 border-l-purple-600"
                  : "hover:bg-[var(--bg-surface)]"
              }`}
            >
              <Avatar src={otherPhoto} name={otherName} size={10} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p
                    className={`text-sm font-semibold truncate ${isSelected ? "text-purple-700 dark:text-purple-300" : "text-[var(--text-primary)]"}`}
                  >
                    {otherName}
                  </p>
                  <span className="text-xs text-[var(--text-muted)] shrink-0 ml-2">
                    {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {conv.lastMessage || conv.tuitionTitle || "No messages yet"}
                  </p>
                  {unread > 0 && (
                    <span className="shrink-0 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
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

// ─── Chat Window ──────────────────────────────────────────────────────────────
const ChatWindow = ({ conversation, currentUser }) => {
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

  // ✅ FIX: async function inside effect — no direct setState at effect body level
  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      setLoading(true);
      setMessages([]);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/messages/${conversation._id}`,
          { withCredentials: true },
        );
        if (!cancelled) setMessages(res.data);
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadMessages();
    sock.emit("join_conversation", conversation._id);

    const handleReceive = (msg) => {
      if (msg.conversationId === conversation._id) {
        setMessages((prev) => {
          if (prev.find((m) => m._id?.toString() === msg._id?.toString()))
            return prev;
          return [...prev, msg];
        });
      }
    };

    sock.on("receive_message", handleReceive);
    return () => {
      cancelled = true;
      sock.off("receive_message", handleReceive);
    };
  }, [conversation._id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    sock.emit("send_message", {
      conversationId: conversation._id,
      senderEmail: currentUser.email,
      senderName: currentUser.displayName || "User",
      senderPhoto: currentUser.photoURL || "",
      receiverEmail: otherEmail,
      text: trimmed,
    });
    setText("");
    setSending(false);
    inputRef.current?.focus();
  }, [text, sending, conversation._id, currentUser, otherEmail, sock]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--bg-border)] flex items-center gap-3 bg-[var(--bg-elevated)]">
        <Avatar src={otherPhoto} name={otherName} size={10} online />
        <div className="flex-1">
          <p className="font-bold text-[var(--text-primary)]">{otherName}</p>
          <p className="text-xs text-[var(--text-muted)]">
            📚 {conversation.tuitionTitle}
          </p>
        </div>
        <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-semibold px-2.5 py-1 rounded-full">
          Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[var(--bg-surface)]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-3">👋</div>
            <p className="text-[var(--text-secondary)] font-medium">
              Start the conversation!
            </p>
            <p className="text-[var(--text-muted)] text-sm mt-1">
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
                    className={`px-2 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? "bg-linear-to-br from-purple-600 to-purple-700 text-white rounded-br-md"
                        : "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm border border-[var(--bg-border)] rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-[var(--text-muted)] px-1">
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
      <div className="px-2 py-3 border-t border-[var(--bg-border)] bg-[var(--bg-elevated)] flex items-end gap-3">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${otherName}...`}
          rows={1}
          className="flex-1 resize-none px-2 py-2.5 bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition max-h-32"
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

  // ✅ FIX: async function inside effect
  useEffect(() => {
    if (!user?.email) return;

    const loadConversations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/conversations/${user.email}`,
          { withCredentials: true },
        );
        setConversations(res.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  const handleSelect = useCallback(
    (conv) => {
      setSelected(conv);
      setMobileShowChat(true);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conv._id
            ? { ...c, unreadCount: { ...c.unreadCount, [user.email]: 0 } }
            : c,
        ),
      );
    },
    [user?.email],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-[calc(100vh-8rem)] bg-[var(--bg-elevated)] rounded-2xl shadow-sm border border-[var(--bg-border)] overflow-hidden flex">
      <div
        className={`w-full md:w-80 border-r border-[var(--bg-border)] flex-shrink-0 flex flex-col ${mobileShowChat ? "hidden md:flex" : "flex"}`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selected?._id}
          onSelect={handleSelect}
          currentUserEmail={user?.email}
          loading={loading}
        />
      </div>

      <div
        className={`flex-1 flex flex-col min-w-0 ${!mobileShowChat ? "hidden md:flex" : "flex"}`}
      >
        {selected ? (
          <>
            <div className="md:hidden px-2 pt-3">
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
            <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center text-4xl mb-4">
              💬
            </div>
            <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">
              Your Messages
            </h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-xs">
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
