
import { Subject } from '../types';
import { useNavigate } from 'react-router-dom';

interface SubjectCardProps {
  subject: Subject;
  isTvFocused?: boolean;
  onClick?: () => void;
}

export default function SubjectCard({ subject, isTvFocused = false, onClick }: SubjectCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    onClick?.();
    navigate(`/subject/${subject.id}`);
  };
  
  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transform transition-all duration-300 bg-gradient-to-br ${subject.color} rounded-3xl shadow-lg ${
        isTvFocused 
          ? 'scale-110 shadow-2xl ring-4 ring-white ring-opacity-80' 
          : 'hover:scale-105 hover:shadow-xl'
      } ${isTvFocused ? 'p-8' : 'p-6'}`}
    >
      <div className={`mb-3 text-center ${isTvFocused ? 'text-8xl' : 'text-6xl'}`}>
        {subject.icon}
      </div>
      <h3 className={`font-bold text-white text-center mb-2 ${isTvFocused ? 'text-3xl' : 'text-2xl'}`}>
        {subject.name}
      </h3>
      <p className={`text-white/80 text-center ${isTvFocused ? 'text-lg' : 'text-sm'}`}>
        {subject.description}
      </p>
    </div>
  );
}
