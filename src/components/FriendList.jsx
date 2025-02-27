
// FriendList.jsx
import React, { useState } from "react";

const FriendList = ({ currentUser, onSelectFriend }) => {
  const [friends, setFriends] = useState([
    { id: 1, name: "general", isChannel: true }
  ]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      // Prevent adding yourself as a friend
      if (newFriendName.trim().toLowerCase() === currentUser.toLowerCase()) {
        alert("You cannot add yourself as a friend");
        return;
      }
      
      // Check if friend already exists
      if (friends.some(f => f.name.toLowerCase() === newFriendName.trim().toLowerCase() && !f.isChannel)) {
        alert("This friend is already in your list");
        return;
      }
      
      const newFriend = {
        id: Date.now(),
        name: newFriendName.trim(),
        isChannel: false
      };
      setFriends([...friends, newFriend]);
      setNewFriendName("");
      setShowAddFriend(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white h-full w-64 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">Talk-a-Tive</div>
          <button 
            onClick={() => setShowAddFriend(!showAddFriend)}
            className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-xl"
            title="Add a friend to chat with"
          >
            +
          </button>
        </div>
        <div className="mt-4">
          <div className="bg-gray-700 rounded-full flex items-center px-3 py-1">
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent outline-none w-full text-white"
            />
            <span>🔍</span>
          </div>
        </div>
        {showAddFriend && (
          <div className="mt-4 bg-gray-700 p-2 rounded">
            <input
              type="text"
              placeholder="Friend's username"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              className="bg-gray-600 p-2 rounded w-full mb-2 text-white"
              autoFocus
            />
            <button 
              onClick={handleAddFriend}
              className="bg-blue-500 text-white p-1 rounded w-full"
            >
              Add Friend
            </button>
          </div>
        )}
      </div>
      <div className="overflow-y-auto flex-grow">
        {friends.map(friend => (
          <div 
            key={friend.id}
            onClick={() => onSelectFriend(friend)}
            className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
          >
            {friend.isChannel ? (
              <span className="text-lg mr-2">#</span>
            ) : (
              <span className="text-lg mr-2">👤</span>
            )}
            <span>{friend.name}</span>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-700 mt-auto">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            👤
          </div>
          <span className="ml-2">{currentUser}</span>
        </div>
      </div>
    </div>
  );
};

export default FriendList;