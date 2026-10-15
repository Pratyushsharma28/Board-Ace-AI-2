import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmartPracticeView } from '../components/SmartPracticeView';
import { Question, SubjectId, DifficultyLevel } from '../types/quiz';

export const PracticePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartDrill = (
    questions: Question[],
    meta: { subject: SubjectId; chapter: string; difficulty: DifficultyLevel; topic: string }
  ) => {
    // Navigate to quiz page with the selected subject and chapter
    navigate(`/quiz?subject=${meta.subject}&chapter=${encodeURIComponent(meta.chapter)}`);
  };

  return (
    <div className="animate-fadeIn">
      <SmartPracticeView
        onStartDrill={handleStartDrill}
        onNavigateHome={() => navigate('/dashboard')}
      />
    </div>
  );
};
