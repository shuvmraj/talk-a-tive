import React, { useState } from "react";
import UsernameInput from "../components/UsernameInput";
import ChatRoom from "./ChatRoom";

const Home = () => {
  const [username, setUsername] = useState(null);

  return username ? <ChatRoom username={username} /> : <UsernameInput setUsername={setUsername} />;
};

export default Home;
