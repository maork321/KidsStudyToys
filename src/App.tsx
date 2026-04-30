import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SubjectPage from "@/pages/SubjectPage";
import CoursePage from "@/pages/CoursePage";
import LearningPage from "@/pages/LearningPage";
import AchievementsPage from "@/pages/AchievementsPage";
import ProfilePage from "@/pages/ProfilePage";
import ParentCenter from "@/pages/ParentCenter";
import MathPractice from "@/pages/MathPractice";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/subject/:id" element={<SubjectPage />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/parent" element={<ParentCenter />} />
        <Route path="/math-practice" element={<MathPractice />} />
      </Routes>
    </Router>
  );
}
