import React from "react";

const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
      <div className="text-xl font-bold">Talk-a-Tive</div>
      <div className="flex items-center">
        <div className="bg-green-500 rounded-full px-3 py-1 text-sm ml-2">Live</div>
      </div>
    </div>
  );
};

export default Navbar;