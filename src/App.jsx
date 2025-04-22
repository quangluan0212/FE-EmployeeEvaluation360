import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import './index.css'
import LoginPage from "./pages/LoginPage"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
<<<<<<< HEAD
        <Route path="/login" element={<LoginPage />} />
=======
>>>>>>> 563993734dc786c621b7ae2ce6791bdaa78ff8f7
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
