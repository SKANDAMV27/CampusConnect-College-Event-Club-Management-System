import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
} from "lucide-react";

import { apiFetch } from "../api/api";

function CampusChatbot() {
  const [open, setOpen] = useState(false);

  const [minimized, setMinimized] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([
      {
        id: 1,
        sender: "bot",
        text:
          "Hi! I'm CampusConnect Assistant. How can I help you today?",
      },
    ]);

  const messagesEndRef =
    useRef(null);

  /* =========================================================
     SCROLL TO BOTTOM
  ========================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await apiFetch(
        "/chatbot/message",
        {
          method: "POST",
          body: JSON.stringify({
            message: text,
          }),
        }
      );

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          response?.message ||
          "Sorry, I could not understand that.",
      };

      setMessages((previous) => [
        ...previous,
        botMessage,
      ]);
    } catch (error) {
      console.error(
        "Chatbot error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "bot",
          text:
            "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     ENTER KEY
  ========================================================= */

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  /* =========================================================
     QUICK QUESTIONS
  ========================================================= */

  const quickQuestions = [
    "Show upcoming events",
    "How do I register for an event?",
    "What clubs are available?",
    "Show my registrations",
  ];

  const handleQuickQuestion = (question) => {
    setMessage(question);
  };

  /* =========================================================
     CLOSED CHATBOT
  ========================================================= */

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          fixed
          bottom-6
          right-6
          z-[90]
          w-14
          h-14
          rounded-full
          bg-teal-700
          text-white
          shadow-lg
          flex
          items-center
          justify-center
          hover:bg-teal-800
          transition
        "
        title="Open CampusConnect Assistant"
      >
        <MessageCircle size={25} />
      </button>
    );
  }

  /* =========================================================
     CHATBOT
  ========================================================= */

  return (
    <div
      className="
        fixed
        bottom-5
        right-5
        z-[90]
        w-[calc(100vw-40px)]
        sm:w-[400px]
        bg-white
        border
        border-gray-300
        rounded-xl
        shadow-2xl
        overflow-hidden
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          h-16
          px-4
          bg-teal-700
          text-white
          flex
          items-center
          justify-between
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              w-10
              h-10
              rounded-full
              bg-white/15
              flex
              items-center
              justify-center
            "
          >
            <Bot size={21} />
          </div>

          <div>
            <p
              className="
                text-sm
                font-semibold
              "
            >
              CampusConnect Assistant
            </p>

            <p
              className="
                text-xs
                text-teal-100
              "
            >
              Online
            </p>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            gap-1
          "
        >
          <button
            type="button"
            onClick={() =>
              setMinimized(
                (previous) => !previous
              )
            }
            className="
              w-8
              h-8
              rounded-md
              flex
              items-center
              justify-center
              hover:bg-white/10
            "
          >
            <Minimize2 size={17} />
          </button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="
              w-8
              h-8
              rounded-md
              flex
              items-center
              justify-center
              hover:bg-white/10
            "
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* =================================================
              MESSAGES
          ================================================= */}

          <div
            className="
              h-[420px]
              overflow-y-auto
              bg-gray-50
              p-4
            "
          >
            {messages.map((item) => (
              <div
                key={item.id}
                className={`
                  flex
                  mb-4
                  ${
                    item.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    gap-2
                    max-w-[85%]
                    ${
                      item.sender === "user"
                        ? "flex-row-reverse"
                        : ""
                    }
                  `}
                >
                  <div
                    className={`
                      w-8
                      h-8
                      rounded-full
                      flex
                      items-center
                      justify-center
                      shrink-0
                      ${
                        item.sender === "user"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-teal-100 text-teal-700"
                      }
                    `}
                  >
                    {item.sender === "user" ? (
                      <User size={15} />
                    ) : (
                      <Bot size={15} />
                    )}
                  </div>

                  <div
                    className={`
                      px-3
                      py-2.5
                      rounded-lg
                      text-sm
                      leading-5
                      ${
                        item.sender === "user"
                          ? "bg-teal-700 text-white rounded-tr-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                      }
                    `}
                  >
                    {item.text}
                  </div>
                </div>
              </div>
            ))}

            {/* TYPING */}

            {loading && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-gray-500
                  mb-3
                "
              >
                <Bot size={15} />

                CampusConnect Assistant
                is typing...
              </div>
            )}

            {/* QUICK QUESTIONS */}

            {messages.length === 1 && (
              <div className="mt-4">
                <p
                  className="
                    text-xs
                    font-medium
                    text-gray-500
                    mb-2
                  "
                >
                  Quick questions
                </p>

                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map(
                    (question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() =>
                          handleQuickQuestion(
                            question
                          )
                        }
                        className="
                          px-3
                          py-2
                          rounded-lg
                          border
                          border-gray-300
                          bg-white
                          text-xs
                          text-gray-700
                          hover:border-teal-600
                          hover:text-teal-700
                          transition
                        "
                      >
                        {question}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            <div
              ref={messagesEndRef}
            />
          </div>

          {/* =================================================
              INPUT
          ================================================= */}

          <div
            className="
              p-3
              bg-white
              border-t
              border-gray-200
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask something..."
                disabled={loading}
                className="
                  flex-1
                  h-11
                  px-3
                  border
                  border-gray-300
                  rounded-lg
                  text-sm
                  outline-none
                  focus:border-teal-600
                  focus:ring-1
                  focus:ring-teal-600
                  disabled:bg-gray-100
                "
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={
                  loading ||
                  !message.trim()
                }
                className="
                  w-11
                  h-11
                  rounded-lg
                  bg-teal-700
                  text-white
                  flex
                  items-center
                  justify-center
                  hover:bg-teal-800
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <Send size={18} />
              </button>
            </div>

            <p
              className="
                mt-2
                text-[10px]
                text-gray-400
                text-center
              "
            >
              CampusConnect Assistant
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default CampusChatbot;