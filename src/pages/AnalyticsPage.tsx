import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalyticsView } from '../components/AnalyticsView';
import { QuizAttempt } from '../types/quiz';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  const handlePracticeWeakTopics = (weakTopics: string[]) => {
    if (weakTopics && weakTopics.length > 0) {
      navigate(`/quiz?topic=${encodeURIComponent(weakTopics[0])}`);
    } else {
      navigate('/quiz');
    }
  };

  const handleReviewAttempt = (attempt: QuizAttempt) => {
    navigate(`/quiz?review=${attempt.id}`);
  };

  return (
    <div className="animate-fadeIn">
      <AnalyticsView
        onStartQuiz={handleStartQuiz}
        onPracticeWeakTopics={handlePracticeWeakTopics}
        onReviewAttempt={handleReviewAttempt}
      />
    </div>
  );
};
