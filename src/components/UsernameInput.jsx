import React from "react";
import { useState } from "react";

const UsernameInput = ({ setUsername }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setUsername(input.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Enter Your Username</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Join Chat
        </button>
      </form>
    </div>
  );
};

export default UsernameInput;
