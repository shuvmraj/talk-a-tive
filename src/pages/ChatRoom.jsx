import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onChildAdded } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://talkative-1994f-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const ChatRoom = () => {
  const [username, setUsername] = useState("");
  const [friendUsername, setFriendUsername] = useState("");
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);

  useEffect(() => {
    if (chatId) {
      const messagesRef = ref(database, `chats/${chatId}`);
      onChildAdded(messagesRef, (snapshot) => {
        setMessages((prev) => [...prev, snapshot.val()]);
      });
    }
  }, [chatId]);

  const startChat = () => {
    if (username && friendUsername) {
      const sortedUsers = [username, friendUsername].sort().join("_");
      setChatId(sortedUsers);
      setIsChatStarted(true);
    } else {
      alert("Please enter both usernames!");
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      push(ref(database, `chats/${chatId}`), {
        user: username,
        text: input.trim(),
      });
      setInput("");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {!isChatStarted ? (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Friend's Username"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={startChat} className="bg-blue-500 text-white p-2 rounded">
            Start Chat
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold">Chat with {friendUsername}</h2>
          <div className="border p-2 h-64 overflow-y-auto">
            {messages.map((msg, i) => (
              <p key={i} className={`p-1 ${msg.user === username ? "text-right" : "text-left"}`}>
                <strong>{msg.user}:</strong> {msg.text}
              </p>
            ))}
          </div>
          <div className="flex mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border p-2 flex-grow"
            />
            <button onClick={sendMessage} className="bg-green-500 text-white p-2 ml-2">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
