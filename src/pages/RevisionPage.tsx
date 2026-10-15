import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmartRevisionView } from '../components/SmartRevisionView';
import { Question } from '../types/quiz';

export const RevisionPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePracticeQuestions = (questions: Question[]) => {
    if (questions.length === 0) return;
    const firstQ = questions[0];
    const sub = firstQ.subject || 'physics';
    navigate(`/quiz?subject=${sub}`);
  };

  return (
    <div className="animate-fadeIn">
      <SmartRevisionView
        onPracticeQuestions={handlePracticeQuestions}
        onNavigateHome={() => navigate('/dashboard')}
        onStartQuiz={() => navigate('/quiz')}
      />
    </div>
  );
};
