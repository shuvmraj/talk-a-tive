// Login.jsx
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://talkative-1994f-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);

  // Fetch existing users to check for username uniqueness
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const users = snapshot.val();
          setExistingUsers(Object.keys(users));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const validateUsername = (username) => {
    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return "Username can only contain letters, numbers, underscores and hyphens";
    }
    if (isRegistering && existingUsers.includes(username)) {
      return "This username is already taken";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      setIsLoading(false);
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      // Check if user exists
      const userRef = ref(database, `users/${username}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        setError("Username not found. Please register first.");
        setIsLoading(false);
        return;
      }

      const userData = snapshot.val();
      
      // Simple password checking - in a real app, you would use proper hashing
      if (userData.password !== password) {
        setError("Incorrect password");
        setIsLoading(false);
        return;
      }

      // Login successful
      onLogin(username);
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      setIsLoading(false);
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Check if username is already taken
      const userRef = ref(database, `users/${username}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        setError("This username is already taken");
        setIsLoading(false);
        return;
      }

      // Save new user data
      await set(userRef, {
        username,
        password, // In a real app, this should be hashed
        createdAt: Date.now()
      });

      // Registration successful
      onLogin(username);
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Welcome to Talk-a-Tive
        </h1>
        
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${!isRegistering ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setIsRegistering(false)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 ${isRegistering ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </button>
        </div>
        
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a unique username"
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {isRegistering && (
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : isRegistering ? (
              "Create Account"
            ) : (
              "Login"
            )}
          </button>
        </form>
        
        <p className="text-gray-400 text-sm text-center mt-6">
          {isRegistering 
            ? "Already have an account? Login to continue chatting." 
            : "New to Talk-a-Tive? Create an account to get started."}
        </p>
      </div>
    </div>
  );
};

export default Login;