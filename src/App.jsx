import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import FriendList from "./components/FriendList";
import ChatBox from "./components/ChatBox";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState({
    id: 1,
    name: "general",
    isChannel: true
  });

  // If no user is logged in, show the login screen
  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <FriendList currentUser={currentUser} onSelectFriend={setSelectedFriend} />
        <ChatBox currentUser={currentUser} selectedFriend={selectedFriend} />
      </div>
    </div>
  );
}

export default App;
