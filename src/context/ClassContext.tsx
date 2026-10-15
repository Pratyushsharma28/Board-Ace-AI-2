import React, { createContext, useContext, useState, useEffect } from 'react';
import { GradeClass, SubjectId, SubjectInfo } from '../types/quiz';
import { getSubjectsForGrade, CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';

const SELECTED_GRADE_KEY = 'boardace_selected_grade';

interface ClassContextType {
  grade: GradeClass;
  setGrade: (grade: GradeClass) => void;
  subjects: SubjectInfo[];
  currentSubjectId: SubjectId;
  setCurrentSubjectId: (id: SubjectId) => void;
  isClass10: boolean;
  isClass12: boolean;
  gradeLabel: string;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grade, setGradeState] = useState<GradeClass>(() => {
    try {
      const stored = localStorage.getItem(SELECTED_GRADE_KEY);
      if (stored === '10' || stored === '12') return stored;
      return '12';
    } catch {
      return '12';
    }
  });

  const subjects = getSubjectsForGrade(grade);
  const [currentSubjectId, setCurrentSubjectId] = useState<SubjectId>(() => {
    return subjects[0]?.id || 'mathematics';
  });

  // Ensure currentSubjectId is valid for the current grade
  useEffect(() => {
    const validSubjectIds = subjects.map(s => s.id);
    if (!validSubjectIds.includes(currentSubjectId)) {
      setCurrentSubjectId(subjects[0]?.id || 'mathematics');
    }
  }, [grade, subjects, currentSubjectId]);

  const setGrade = (newGrade: GradeClass) => {
    setGradeState(newGrade);
    try {
      localStorage.setItem(SELECTED_GRADE_KEY, newGrade);
      // Dispatch storage event for other components if needed
      window.dispatchEvent(new Event('boardace_grade_change'));
    } catch (e) {
      console.error('Failed to save selected grade to localStorage', e);
    }
  };

  const isClass10 = grade === '10';
  const isClass12 = grade === '12';
  const gradeLabel = isClass10 ? 'CBSE Class 10' : 'CBSE Class 12';

  return (
    <ClassContext.Provider
      value={{
        grade,
        setGrade,
        subjects,
        currentSubjectId,
        setCurrentSubjectId,
        isClass10,
        isClass12,
        gradeLabel,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = (): ClassContextType => {
  const context = useContext(ClassContext);
  if (!context) {
    // Graceful fallback if called outside provider
    return {
      grade: '12',
      setGrade: () => {},
      subjects: CBSE_CLASS_12_SUBJECTS,
      currentSubjectId: 'mathematics',
      setCurrentSubjectId: () => {},
      isClass10: false,
      isClass12: true,
      gradeLabel: 'CBSE Class 12',
    };
  }
  return context;
};
