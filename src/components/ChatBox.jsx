import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onChildAdded } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://talkative-1994f-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const ChatBox = ({ currentUser, selectedFriend }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  
  // Create a unique chat ID based on whether it's a channel or direct message
  const chatId = selectedFriend.isChannel 
    ? `channel_${selectedFriend.name}` 
    : [currentUser, selectedFriend.name].sort().join("_");

  useEffect(() => {
    // Reset messages when changing chats
    setMessages([]);
    
    // Listen for new messages
    const messagesRef = ref(database, `chats/${chatId}`);
    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      setMessages((prev) => [...prev, snapshot.val()]);
    });
    
    // Add a welcome message for empty chats
    if (!selectedFriend.isChannel) {
      setMessages([{
        system: true,
        text: `This is the beginning of your direct message history with ${selectedFriend.name}`
      }]);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [chatId, selectedFriend.name, selectedFriend.isChannel]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      push(ref(database, `chats/${chatId}`), {
        user: currentUser,
        text: input.trim(),
        timestamp: Date.now()
      });
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full flex-grow">
      <div className="bg-gray-700 p-3 flex items-center border-b border-gray-600">
        <span className="text-white font-medium">
          {selectedFriend.isChannel ? `# ${selectedFriend.name}` : selectedFriend.name}
        </span>
      </div>
      
      <div 
        className="flex-grow overflow-y-auto p-4"
        style={{ 
          backgroundImage: "url('/assets/talkative.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="flex flex-col">
          <div className="bg-black bg-opacity-60 text-white p-5 rounded-lg text-center mb-6">
            <div className="text-4xl mb-2">{selectedFriend.isChannel ? "#" : "👤"}</div>
            <h2 className="text-2xl font-bold mb-1">
              Welcome to {selectedFriend.isChannel ? `#${selectedFriend.name}` : `chat with ${selectedFriend.name}`}
            </h2>
            <p className="text-gray-300">
              {selectedFriend.isChannel 
                ? "This is the main general community" 
                : `Start of your conversation with ${selectedFriend.name}`}
            </p>
          </div>
          
          {messages.map((msg, i) => {
            // Handle system messages
            if (msg.system) {
              return (
                <div key={i} className="text-center my-3">
                  <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {msg.text}
                  </span>
                </div>
              );
            }
            
            // Handle user messages
            return (
              <div 
                key={i} 
                className={`max-w-xs md:max-w-md my-1 ${msg.user === currentUser ? "ml-auto" : "mr-auto"}`}
              >
                <div className={`px-3 py-2 rounded-lg ${msg.user === currentUser 
                  ? "bg-blue-500 text-white" 
                  : "bg-white text-black"}`}
                >
                  <div className="font-bold">{msg.user}</div>
                  <div>{msg.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="bg-gray-700 p-3 flex items-center">
        <div className="bg-gray-800 flex items-center rounded-full flex-grow px-4 py-2">
          <input
            type="text"
            placeholder={`Message ${selectedFriend.isChannel ? '#' + selectedFriend.name : selectedFriend.name}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-transparent outline-none text-white flex-grow"
          />
          <button onClick={sendMessage} className="text-blue-500 ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;