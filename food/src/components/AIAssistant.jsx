// import React, { useState } from "react";

// const AIAssistant = ({ isOpen, onClose }) => {
//   const [messages, setMessages] = useState([
//     {
//       type: "ai",
//       text: "Hi 👋 I am FoodShare AI. How can I help you today?",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = input;
//     setInput("");

//     setMessages((prev) => [
//       ...prev,
//       { type: "user", text: userMessage },
//     ]);

//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/ai/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: userMessage }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setMessages((prev) => [
//           ...prev,
//           { type: "ai", text: data.reply },
//         ]);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           { type: "ai", text: "Something went wrong 😔" },
//         ]);
//       }
//     } catch (error) {
//       console.error(error);
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
//       {isOpen && (
//         <div
//           onClick={onClose}
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
//         ></div>
//       )}

//       <div
//         className={`fixed top-0 right-0 w-96 max-w-full h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 bg-green-600 text-white">
//           <h2 className="text-lg font-semibold">FoodShare AI</h2>
//           <button onClick={onClose}>✖</button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 overflow-y-auto space-y-3">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
//                 msg.type === "user"
//                   ? "bg-green-600 text-white ml-auto"
//                   : "bg-gray-200 text-gray-800"
//               }`}
//             >
//               {msg.text}
//             </div>
//           ))}

//           {loading && (
//             <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm w-fit">
//               Typing...
//             </div>
//           )}
//         </div>

//         {/* Input */}
//         <div className="p-4 border-t flex gap-2">
//           <input
//             type="text"
//             placeholder="Type your message..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AIAssistant;

import React, { useState } from "react";
import API from "../utils/api";   // 👈 IMPORTANT

const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hi 👋 I am FoodShare AI. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { type: "user", text: userMessage },
    ]);

    try {
      setLoading(true);

      // ✅ Using axios instance instead of localhost fetch
      const res = await API.post("/ai/chat", {
        message: userMessage,
      });

      const data = res.data;

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: data.reply },
        ]);
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
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 w-96 max-w-full h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-green-600 text-white">
          <h2 className="text-lg font-semibold">FoodShare AI</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.type === "user"
                  ? "bg-green-600 text-white ml-auto"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm w-fit">
              Typing...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;