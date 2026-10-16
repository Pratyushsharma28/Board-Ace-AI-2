import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ClassProvider } from './context/ClassContext';
import { AppLayout } from './components/layout/AppLayout';

// Core Application Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuizPage } from './pages/QuizPage';
import { ExamPage } from './pages/ExamPage';
import { AITutorPage } from './pages/AITutorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PracticePage } from './pages/PracticePage';
import { RevisionPage } from './pages/RevisionPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { FormulasPage } from './pages/FormulasPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { SettingsPage } from './pages/SettingsPage';

// Next-Generation AI Learning Feature Pages
import { PdfToQuizPage } from './pages/PdfToQuizPage';
import { StudyRoadmapPage } from './pages/StudyRoadmapPage';
import { AnswerCheckerPage } from './pages/AnswerCheckerPage';
import { MistakeDetectivePage } from './pages/MistakeDetectivePage';
import { MasteryMapPage } from './pages/MasteryMapPage';
import { DailyChallengePage } from './pages/DailyChallengePage';
import { NotesGeneratorPage } from './pages/NotesGeneratorPage';
import { QuestionPaperPage } from './pages/QuestionPaperPage';

// AI Learning Intelligence System Upgrade Pages
import { LearningDnaPage } from './pages/LearningDnaPage';
import { WeakChaptersPage } from './pages/WeakChaptersPage';
import { StudyCoachPage } from './pages/StudyCoachPage';
import { SmartRetryPage } from './pages/SmartRetryPage';
import { ProgressTimelinePage } from './pages/ProgressTimelinePage';
import { MistakeNotebookPage } from './pages/MistakeNotebookPage';
import { FocusModePage } from './pages/FocusModePage';
import { ChapterTrackerPage } from './pages/ChapterTrackerPage';

// CBSE PYQ Hub and Competency-Based Practice Pages
import { PyqHubPage } from './pages/PyqHubPage';
import { CompetencyPracticePage } from './pages/CompetencyPracticePage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ClassProvider>
          <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Application Layout with Fixed/Collapsible Sidebar & Topbar */}
            <Route element={<AppLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="exam" element={<ExamPage />} />
              <Route path="ai-tutor" element={<AITutorPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="practice" element={<PracticePage />} />
              <Route path="revision" element={<RevisionPage />} />
              <Route path="flashcards" element={<FlashcardsPage />} />
              <Route path="formulas" element={<FormulasPage />} />
              <Route path="study-planner" element={<StudyPlannerPage />} />
              <Route path="bookmarks" element={<BookmarksPage />} />
              <Route path="settings" element={<SettingsPage />} />

              {/* Next-Gen AI Feature Routes */}
              <Route path="pdf-to-quiz" element={<PdfToQuizPage />} />
              <Route path="study-roadmap" element={<StudyRoadmapPage />} />
              <Route path="answer-checker" element={<AnswerCheckerPage />} />
              <Route path="mistake-detective" element={<MistakeDetectivePage />} />
              <Route path="mastery-map" element={<MasteryMapPage />} />
              <Route path="daily-challenge" element={<DailyChallengePage />} />
              <Route path="notes-generator" element={<NotesGeneratorPage />} />
              <Route path="question-paper" element={<QuestionPaperPage />} />

              {/* AI Learning Intelligence System Upgrade Routes */}
              <Route path="learning-dna" element={<LearningDnaPage />} />
              <Route path="weak-chapters" element={<WeakChaptersPage />} />
              <Route path="study-coach" element={<StudyCoachPage />} />
              <Route path="smart-retry" element={<SmartRetryPage />} />
              <Route path="progress-timeline" element={<ProgressTimelinePage />} />
              <Route path="mistake-notebook" element={<MistakeNotebookPage />} />
              <Route path="focus-mode" element={<FocusModePage />} />
              <Route path="chapter-tracker" element={<ChapterTrackerPage />} />

              {/* CBSE PYQ Hub & Competency-Based Practice */}
              <Route path="pyq-hub" element={<PyqHubPage />} />
              <Route path="competency-practice" element={<CompetencyPracticePage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </ClassProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
