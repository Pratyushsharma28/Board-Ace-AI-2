import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AITutorView } from '../components/AITutorView';
import { SubjectId } from '../types/quiz';

export const AITutorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const querySubject = (searchParams.get('subject') as SubjectId) || 'physics';
  const initialSubject = ['mathematics', 'physics', 'chemistry'].includes(querySubject)
    ? querySubject
    : 'physics';

  return (
    <div className="animate-fadeIn">
      <AITutorView
        initialSubject={initialSubject}
        onNavigateHome={() => navigate('/dashboard')}
      />
    </div>
  );
};
