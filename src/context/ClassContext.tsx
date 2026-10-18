import React, { createContext, useContext, useState, useEffect } from 'react';
import { GradeClass, StreamType, SubjectId, SubjectInfo, AcademicTrackId, getAcademicTrackId } from '../types/quiz';
import { getSubjectsForGrade, CBSE_CLASS_12_SCIENCE_SUBJECTS } from '../data/syllabus';

const SELECTED_GRADE_KEY = 'boardace_selected_grade';
const SELECTED_STREAM_KEY = 'boardace_selected_stream';

export interface ClassContextType {
  grade: GradeClass;
  setGrade: (grade: GradeClass) => void;
  stream: StreamType;
  setStream: (stream: StreamType) => void;
  academicTrackId: AcademicTrackId;
  academicSession: string;
  subjects: SubjectInfo[];
  currentSubjectId: SubjectId;
  setCurrentSubjectId: (id: SubjectId) => void;
  currentChapter: string;
  setCurrentChapter: (chapter: string) => void;
  isClass10: boolean;
  isClass12: boolean;
  isScience: boolean;
  isCommerce: boolean;
  gradeLabel: string;
  streamLabel: string;
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

  const [stream, setStreamState] = useState<StreamType>(() => {
    try {
      const stored = localStorage.getItem(SELECTED_STREAM_KEY);
      if (stored === 'commerce' || stored === 'science') return stored;
      return 'science';
    } catch {
      return 'science';
    }
  });

  const subjects = getSubjectsForGrade(grade, stream);
  const [currentSubjectId, setCurrentSubjectId] = useState<SubjectId>(() => {
    return subjects[0]?.id || 'mathematics';
  });
  const [currentChapter, setCurrentChapter] = useState<string>('all');

  // Ensure currentSubjectId is valid for the current grade & stream
  useEffect(() => {
    const validSubjectIds = subjects.map(s => s.id);
    if (!validSubjectIds.includes(currentSubjectId)) {
      setCurrentSubjectId(subjects[0]?.id || 'mathematics');
      setCurrentChapter('all');
    }
  }, [grade, stream, subjects, currentSubjectId]);

  const setGrade = (newGrade: GradeClass) => {
    setGradeState(newGrade);
    setCurrentChapter('all');
    try {
      localStorage.setItem(SELECTED_GRADE_KEY, newGrade);
      window.dispatchEvent(new Event('boardace_grade_change'));
    } catch (e) {
      console.error('Failed to save selected grade to localStorage', e);
    }
  };

  const setStream = (newStream: StreamType) => {
    setStreamState(newStream);
    setCurrentChapter('all');
    try {
      localStorage.setItem(SELECTED_STREAM_KEY, newStream);
      window.dispatchEvent(new Event('boardace_stream_change'));
    } catch (e) {
      console.error('Failed to save selected stream to localStorage', e);
    }
  };

  const isClass10 = grade === '10';
  const isClass12 = grade === '12';
  const isScience = isClass12 && stream === 'science';
  const isCommerce = isClass12 && stream === 'commerce';
  const gradeLabel = isClass10 ? 'CBSE Class 10' : 'CBSE Class 12';
  const streamLabel = stream === 'commerce' ? 'Commerce' : 'Science';
  const academicTrackId = getAcademicTrackId(grade, stream);
  const academicSession = '2026–27';

  return (
    <ClassContext.Provider
      value={{
        grade,
        setGrade,
        stream,
        setStream,
        academicTrackId,
        academicSession,
        subjects,
        currentSubjectId,
        setCurrentSubjectId,
        currentChapter,
        setCurrentChapter,
        isClass10,
        isClass12,
        isScience,
        isCommerce,
        gradeLabel,
        streamLabel,
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
      stream: 'science',
      setStream: () => {},
      academicTrackId: 'class12_science',
      academicSession: '2026–27',
      subjects: CBSE_CLASS_12_SCIENCE_SUBJECTS,
      currentSubjectId: 'mathematics',
      setCurrentSubjectId: () => {},
      currentChapter: 'all',
      setCurrentChapter: () => {},
      isClass10: false,
      isClass12: true,
      isScience: true,
      isCommerce: false,
      gradeLabel: 'CBSE Class 12',
      streamLabel: 'Science',
    };
  }
  return context;
};


