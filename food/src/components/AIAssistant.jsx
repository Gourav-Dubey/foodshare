// import React, { useState, useRef, useEffect } from "react";
// import API from "../utils/api";

// const AIAssistant = ({ isOpen, onClose }) => {
//   const [messages, setMessages] = useState([
//     {
//       type: "ai",
//       text: "Hi 👋 I am FoodShare AI. How can I help you today?",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = input;
//     setInput("");

//     setMessages((prev) => [...prev, { type: "user", text: userMessage }]);

//     try {
//       setLoading(true);

//       const res = await API.post("/ai/chat", { message: userMessage });
//       const data = res.data;

//       if (data.success) {
//         setMessages((prev) => [...prev, { type: "ai", text: data.reply }]);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           { type: "ai", text: "Something went wrong 😔" },
//         ]);
//       }
//     } catch (error) {
//       console.error("AI Error:", error);
//       setMessages((prev) => [
//         ...prev,
//         { type: "ai", text: "Server error 😔" },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

//         :root {
//           --bg-panel: #0d1f1a;
//           --bg-surface: #122318;
//           --bg-input: #0a1a14;
//           --border: rgba(52, 211, 153, 0.15);
//           --border-bright: rgba(52, 211, 153, 0.35);
//           --green-primary: #22c55e;
//           --green-bright: #4ade80;
//           --green-dim: rgba(34, 197, 94, 0.12);
//           --text-primary: #e2f5ec;
//           --text-muted: rgba(226, 245, 236, 0.45);
//           --shadow: 0 0 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(52,211,153,0.08);
//         }

//         .ai-panel {
//           font-family: 'DM Sans', sans-serif;
//           position: fixed;
//           top: 0;
//           right: 0;
//           width: 400px;
//           max-width: 100vw;
//           height: 100%;
//           background: var(--bg-panel);
//           box-shadow: var(--shadow);
//           z-index: 50;
//           display: flex;
//           flex-direction: column;
//           transform: translateX(100%);
//           transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
//           border-left: 1px solid var(--border);
//           overflow: hidden;
//         }

//         .ai-panel.open {
//           transform: translateX(0);
//         }

//         /* Subtle grid bg texture */
//         .ai-panel::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background-image:
//             linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px);
//           background-size: 32px 32px;
//           pointer-events: none;
//           z-index: 0;
//         }

//         .ai-header {
//           position: relative;
//           z-index: 1;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 20px 24px 18px;
//           border-bottom: 1px solid var(--border);
//           background: linear-gradient(135deg, #0d2418 0%, #122318 100%);
//         }

//         .ai-header-left {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .ai-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 12px;
//           background: linear-gradient(135deg, #16a34a, #22c55e);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 18px;
//           box-shadow: 0 0 16px rgba(34,197,94,0.3);
//           flex-shrink: 0;
//         }

//         .ai-header-title {
//           font-family: 'Playfair Display', serif;
//           font-size: 18px;
//           color: var(--text-primary);
//           letter-spacing: -0.3px;
//           line-height: 1.2;
//         }

//         .ai-header-subtitle {
//           font-size: 11px;
//           color: var(--green-primary);
//           letter-spacing: 1.5px;
//           text-transform: uppercase;
//           font-weight: 500;
//           display: flex;
//           align-items: center;
//           gap: 5px;
//         }

//         .status-dot {
//           width: 6px;
//           height: 6px;
//           border-radius: 50%;
//           background: var(--green-primary);
//           animation: pulse 2s infinite;
//         }

//         @keyframes pulse {
//           0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
//           50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(34,197,94,0); }
//         }

//         .ai-close-btn {
//           background: rgba(255,255,255,0.05);
//           border: 1px solid var(--border);
//           color: var(--text-muted);
//           width: 32px;
//           height: 32px;
//           border-radius: 8px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 14px;
//           transition: all 0.2s;
//         }

//         .ai-close-btn:hover {
//           background: rgba(34,197,94,0.1);
//           border-color: var(--border-bright);
//           color: var(--text-primary);
//         }

//         .ai-messages {
//           position: relative;
//           z-index: 1;
//           flex: 1;
//           padding: 20px 18px;
//           overflow-y: auto;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//           scrollbar-width: thin;
//           scrollbar-color: rgba(34,197,94,0.2) transparent;
//         }

//         .ai-messages::-webkit-scrollbar {
//           width: 4px;
//         }
//         .ai-messages::-webkit-scrollbar-thumb {
//           background: rgba(34,197,94,0.2);
//           border-radius: 2px;
//         }

//         .msg-row {
//           display: flex;
//           gap: 10px;
//           align-items: flex-end;
//         }

//         .msg-row.user {
//           flex-direction: row-reverse;
//         }

//         .msg-icon {
//           width: 28px;
//           height: 28px;
//           border-radius: 8px;
//           background: linear-gradient(135deg, #16a34a, #22c55e);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 13px;
//           flex-shrink: 0;
//           box-shadow: 0 0 10px rgba(34,197,94,0.25);
//         }

//         .msg-bubble {
//           max-width: 78%;
//           padding: 10px 14px;
//           border-radius: 16px;
//           font-size: 13.5px;
//           line-height: 1.55;
//           font-weight: 400;
//         }

//         .msg-bubble.ai {
//           background: var(--bg-surface);
//           border: 1px solid var(--border);
//           color: var(--text-primary);
//           border-bottom-left-radius: 4px;
//         }

//         .msg-bubble.user {
//           background: linear-gradient(135deg, #16a34a, #22c55e);
//           color: #fff;
//           border-bottom-right-radius: 4px;
//           box-shadow: 0 4px 16px rgba(34,197,94,0.25);
//         }

//         .typing-bubble {
//           background: var(--bg-surface);
//           border: 1px solid var(--border);
//           color: var(--text-muted);
//           padding: 10px 16px;
//           border-radius: 16px;
//           border-bottom-left-radius: 4px;
//           font-size: 13px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .typing-dots span {
//           display: inline-block;
//           width: 5px;
//           height: 5px;
//           border-radius: 50%;
//           background: var(--green-primary);
//           animation: typingDot 1.2s infinite;
//         }
//         .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
//         .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

//         @keyframes typingDot {
//           0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
//           30% { transform: translateY(-4px); opacity: 1; }
//         }

//         .ai-input-area {
//           position: relative;
//           z-index: 1;
//           padding: 16px 18px 20px;
//           border-top: 1px solid var(--border);
//           background: var(--bg-panel);
//         }

//         .ai-input-wrapper {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           background: var(--bg-input);
//           border: 1px solid var(--border);
//           border-radius: 14px;
//           padding: 4px 4px 4px 16px;
//           transition: border-color 0.2s, box-shadow 0.2s;
//         }

//         .ai-input-wrapper:focus-within {
//           border-color: var(--border-bright);
//           box-shadow: 0 0 0 3px rgba(34,197,94,0.08);
//         }

//         .ai-input {
//           flex: 1;
//           background: transparent;
//           border: none;
//           outline: none;
//           color: var(--text-primary);
//           font-family: 'DM Sans', sans-serif;
//           font-size: 13.5px;
//           padding: 10px 0;
//           caret-color: var(--green-primary);
//         }

//         .ai-input::placeholder {
//           color: var(--text-muted);
//         }

//         .ai-send-btn {
//           background: linear-gradient(135deg, #16a34a, #22c55e);
//           border: none;
//           color: #fff;
//           width: 38px;
//           height: 38px;
//           border-radius: 10px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 15px;
//           flex-shrink: 0;
//           transition: all 0.2s;
//           box-shadow: 0 2px 12px rgba(34,197,94,0.3);
//         }

//         .ai-send-btn:hover {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 18px rgba(34,197,94,0.45);
//         }

//         .ai-send-btn:active {
//           transform: translateY(0);
//         }

//         .ai-overlay {
//           position: fixed;
//           inset: 0;
//           background: rgba(0,0,0,0.5);
//           backdrop-filter: blur(4px);
//           z-index: 40;
//           opacity: 0;
//           pointer-events: none;
//           transition: opacity 0.3s;
//         }

//         .ai-overlay.open {
//           opacity: 1;
//           pointer-events: all;
//         }
//       `}</style>

//       <div
//         className={`ai-overlay ${isOpen ? "open" : ""}`}
//         onClick={onClose}
//       />

//       <div className={`ai-panel ${isOpen ? "open" : ""}`}>
//         {/* Header */}
//         <div className="ai-header">
//           <div className="ai-header-left">
//             <div className="ai-avatar">🤖</div>
//             <div>
//               <div className="ai-header-title">FoodShare AI</div>
//               <div className="ai-header-subtitle">
//                 <span className="status-dot" />
//                 Online
//               </div>
//             </div>
//           </div>
//           <button className="ai-close-btn" onClick={onClose}>✕</button>
//         </div>

//         {/* Messages */}
//         <div className="ai-messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`msg-row ${msg.type}`}>
//               {msg.type === "ai" && (
//                 <div className="msg-icon">🍃</div>
//               )}
//               <div className={`msg-bubble ${msg.type}`}>{msg.text}</div>
//             </div>
//           ))}

//           {loading && (
//             <div className="msg-row">
//               <div className="msg-icon">🍃</div>
//               <div className="typing-bubble">
//                 <div className="typing-dots">
//                   <span /><span /><span />
//                 </div>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input */}
//         <div className="ai-input-area">
//           <div className="ai-input-wrapper">
//             <input
//               type="text"
//               placeholder="Ask me anything..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               className="ai-input"
//             />
//             <button className="ai-send-btn" onClick={sendMessage}>
//               ➤
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AIAssistant;

import React, { useState, useRef, useEffect } from "react";
import API from "../utils/api";

const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hi 👋 I am FoodShare AI. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);

    try {
      setLoading(true);

      const res = await API.post("/ai/chat", { message: userMessage });
      const data = res.data;

      if (data.success) {
        setMessages((prev) => [...prev, { type: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: "Something went wrong 😔" },
        ]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Server error 😔" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .ai-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 40;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .ai-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .ai-panel {
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          top: 0;
          right: 0;
          width: 420px;
          max-width: 100vw;
          height: 100%;
          background: #060e08;
          z-index: 50;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.32, 0, 0.12, 1);
          overflow: hidden;
          border-left: 1px solid rgba(52,211,153,0.1);
        }
        .ai-panel.open {
          transform: translateX(0);
          box-shadow: -24px 0 80px rgba(0,0,0,0.7), -1px 0 0 rgba(52,211,153,0.08);
        }

        /* Ambient grid texture */
        .ai-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        /* Top ambient orb */
        .ai-panel::after {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%);
          filter: blur(30px);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Header ── */
        .ai-header {
          position: relative;
          z-index: 2;
          padding: 0 20px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(52,211,153,0.08);
          background: linear-gradient(180deg, rgba(10,26,14,0.95) 0%, rgba(6,14,8,0.8) 100%);
          flex-shrink: 0;
        }

        /* Top accent line on header */
        .ai-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.5) 40%, rgba(52,211,153,0.8) 60%, transparent 100%);
        }

        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ai-avatar-wrap {
          position: relative;
        }

        .ai-avatar {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0f4c24 0%, #16a34a 50%, #22c55e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          border: 1px solid rgba(74,222,128,0.25);
          box-shadow: 0 0 20px rgba(22,163,74,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        .ai-avatar-ring {
          position: absolute;
          inset: -3px;
          border-radius: 17px;
          border: 1px solid rgba(74,222,128,0.2);
          animation: ringPulse 3s ease-in-out infinite;
        }

        @keyframes ringPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.04); }
        }

        .ai-header-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ai-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          color: #f0fdf4;
          letter-spacing: -0.2px;
          line-height: 1.2;
        }

        .ai-header-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          color: #4ade80;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: statusPulse 2s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .ai-close-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(240,253,244,0.4);
          width: 34px;
          height: 34px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .ai-close-btn:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.25);
          color: #fca5a5;
        }

        /* ── Messages ── */
        .ai-messages {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 24px 18px 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(34,197,94,0.15) transparent;
        }
        .ai-messages::-webkit-scrollbar { width: 3px; }
        .ai-messages::-webkit-scrollbar-thumb {
          background: rgba(34,197,94,0.15);
          border-radius: 2px;
        }

        /* Date/time divider */
        .msg-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 4px 0;
        }
        .msg-divider::before, .msg-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(52,211,153,0.08);
        }
        .msg-divider span {
          font-size: 10px;
          color: rgba(187,247,208,0.25);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .msg-row {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          animation: msgIn 0.3s ease forwards;
        }
        .msg-row.user { flex-direction: row-reverse; }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .msg-icon {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0f4c24, #16a34a);
          border: 1px solid rgba(74,222,128,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
          box-shadow: 0 2px 12px rgba(22,163,74,0.2);
        }

        .msg-bubble {
          max-width: 80%;
          padding: 11px 15px;
          border-radius: 18px;
          font-size: 13.5px;
          line-height: 1.6;
          font-weight: 400;
          position: relative;
        }

        .msg-bubble.ai {
          background: rgba(10,26,14,0.9);
          border: 1px solid rgba(52,211,153,0.12);
          color: #d1fae5;
          border-bottom-left-radius: 5px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
        }

        /* subtle top highlight on AI bubble */
        .msg-bubble.ai::before {
          content: '';
          position: absolute;
          top: 0; left: 12px; right: 12px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,222,128,0.2), transparent);
          border-radius: 1px;
        }

        .msg-bubble.user {
          background: linear-gradient(135deg, #14532d 0%, #16a34a 100%);
          color: #f0fdf4;
          border-bottom-right-radius: 5px;
          box-shadow: 0 4px 20px rgba(22,163,74,0.25);
          border: 1px solid rgba(74,222,128,0.2);
        }

        /* ── Typing indicator ── */
        .typing-row {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          animation: msgIn 0.3s ease forwards;
        }

        .typing-bubble {
          background: rgba(10,26,14,0.9);
          border: 1px solid rgba(52,211,153,0.12);
          padding: 12px 18px;
          border-radius: 18px;
          border-bottom-left-radius: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .typing-dots span {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ade80;
          animation: typingBounce 1.3s ease-in-out infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.16s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.32s; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        /* ── Input area ── */
        .ai-input-area {
          position: relative;
          z-index: 2;
          padding: 14px 18px 22px;
          border-top: 1px solid rgba(52,211,153,0.08);
          background: rgba(6,14,8,0.95);
          flex-shrink: 0;
        }

        /* Suggested prompts */
        .ai-suggestions {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .ai-suggestion-chip {
          background: rgba(22,163,74,0.07);
          border: 1px solid rgba(52,211,153,0.12);
          color: rgba(187,247,208,0.55);
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 100px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .ai-suggestion-chip:hover {
          background: rgba(22,163,74,0.14);
          border-color: rgba(52,211,153,0.25);
          color: #86efac;
        }

        .ai-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(10,26,14,0.8);
          border: 1px solid rgba(52,211,153,0.15);
          border-radius: 16px;
          padding: 5px 5px 5px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ai-input-wrapper:focus-within {
          border-color: rgba(74,222,128,0.4);
          box-shadow: 0 0 0 3px rgba(22,163,74,0.08);
        }

        .ai-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #d1fae5;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          padding: 9px 0;
          caret-color: #4ade80;
        }
        .ai-input::placeholder {
          color: rgba(187,247,208,0.25);
        }

        .ai-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #14532d, #16a34a);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(22,163,74,0.3);
          border: 1px solid rgba(74,222,128,0.2);
        }
        .ai-send-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22,163,74,0.45);
        }
        .ai-send-btn:active {
          transform: translateY(0);
        }

        .ai-footer-note {
          text-align: center;
          font-size: 10px;
          color: rgba(187,247,208,0.2);
          margin-top: 10px;
          letter-spacing: 0.05em;
        }
      `}</style>

      {/* Overlay */}
      <div className={`ai-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />

      {/* Panel */}
      <div className={`ai-panel ${isOpen ? "open" : ""}`}>

        {/* ── Header ── */}
        <div className="ai-header">
          <div className="ai-header-left">
            <div className="ai-avatar-wrap">
              <div className="ai-avatar">🤖</div>
              <div className="ai-avatar-ring" />
            </div>
            <div className="ai-header-info">
              <div className="ai-header-title">FoodShare AI</div>
              <div className="ai-header-status">
                <span className="status-dot" />
                Online
              </div>
            </div>
          </div>
          <button className="ai-close-btn" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Messages ── */}
        <div className="ai-messages">
          <div className="msg-divider">
            <span>Today</span>
          </div>

          {messages.map((msg, index) => (
            <div key={index} className={`msg-row ${msg.type}`}>
              {msg.type === "ai" && (
                <div className="msg-icon">🍃</div>
              )}
              <div className={`msg-bubble ${msg.type}`}>{msg.text}</div>
            </div>
          ))}

          {loading && (
            <div className="typing-row">
              <div className="msg-icon">🍃</div>
              <div className="typing-bubble">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input ── */}
        <div className="ai-input-area">
          <div className="ai-suggestions">
            {["How to donate?", "Find NGOs near me", "Track donation"].map((s) => (
              <button
                key={s}
                className="ai-suggestion-chip"
                onClick={() => setInput(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="ai-input-wrapper">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="ai-input"
            />
            <button className="ai-send-btn" onClick={sendMessage}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8L2 2l2.5 6L2 14l12-6z" fill="white"/>
              </svg>
            </button>
          </div>
          <div className="ai-footer-note">Powered by FoodShare AI · Always learning</div>
        </div>

      </div>
    </>
  );
};

export default AIAssistant;