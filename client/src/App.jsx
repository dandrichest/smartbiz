<<<<<<< HEAD
import { useState } from "react";
import LoginForm from "./components/LoginForm";
import SalesRecord from "./components/SalesRecord";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {user ? (
        <SalesRecord onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={< LoginForm />} />
        <Route path="/signup" element={< SignUpForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> main
