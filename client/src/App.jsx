import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import FAQPage from "./pages/FAQPage";
import Instructions from "./pages/Instructions";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
