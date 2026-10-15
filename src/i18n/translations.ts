export type Language = 'en' | 'hi';

export interface Translations {
  nav: {
    brandSubtitle: string;
    home: string;
    dashboard: string;
    weakTopicRadar: string;
    practiceQuiz: string;
    examMode: string;
    launchQuiz: string;
    offlineSaved: string;
    storageNote: string;
    langEn: string;
    langHi: string;
    lightMode: string;
    darkMode: string;
    aiTutor: string;
    smartPractice: string;
    revision: string;
    quiz: string;
    exam: string;
    analytics: string;
    flashcards: string;
    formulas: string;
    studyPlanner: string;
    bookmarks: string;
    settings: string;
    pdfToQuiz: string;
    studyRoadmap: string;
    answerChecker: string;
    mistakeDetective: string;
    masteryMap: string;
    dailyChallenge: string;
    notesGenerator: string;
    questionPaper: string;
    learningDna: string;
    weakChapters: string;
    studyCoach: string;
    smartRetry: string;
    progressTimeline: string;
    mistakeNotebook: string;
    focusMode: string;
    chapterTracker: string;
    collapseSidebar: string;
    expandSidebar: string;
  };
  revision: {
    navTitle: string;
    brandKicker: string;
    pageTitle: string;
    pageSubtitle: string;
    totalSaved: string;
    dueForRevision: string;
    mastered: string;
    autoSavedMistakes: string;
    bookmarkedQuestions: string;
    srsBannerTitle: string;
    srsBannerDesc: string;
    tabDue: string;
    tabAll: string;
    tabIncorrect: string;
    tabBookmarked: string;
    tabMastered: string;
    practiceDueBtn: string;
    practiceAllBtn: string;
    subjectFilterAll: string;
    searchPlaceholder: string;
    dueNowBadge: string;
    stage1Badge: string;
    stage2Badge: string;
    stage3Badge: string;
    masteredBadge: string;
    markAsRevised: string;
    markedRevised: string;
    retryBtn: string;
    cancelRetry: string;
    checkAnswer: string;
    retryCorrectFeedback: string;
    retryIncorrectFeedback: string;
    savedBecauseIncorrect: string;
    savedBecauseBookmark: string;
    recommendedHeader: string;
    recommendedSub: string;
    addRecommendedToRevision: string;
    practiceRecommendedBtn: string;
    emptyDueTitle: string;
    emptyDueDesc: string;
    emptyAllTitle: string;
    emptyAllDesc: string;
    emptyFilterTitle: string;
    emptyFilterDesc: string;
    startQuizPrompt: string;
    deleteItem: string;
    itemDeletedToast: string;
    revisedToast: string;
    correctCelebration: string;
    incorrectRetryNote: string;
    viewExplanation: string;
    hideExplanation: string;
    reviewCountLabel: string;
    incorrectCountLabel: string;
  };
  smartPractice: {
    pageTitle: string;
    pageSubtitle: string;
    kicker: string;
    heroHeading: string;
    heroSub: string;
    startRecommendedDrill: string;
    targetDifficulty: string;
    allSubjects: string;
    subjectFilterLabel: string;
    difficultyFilterLabel: string;
    autoStepUpLabel: string;
    autoStepUpDesc: string;
    metricsAttempted: string;
    metricsAccuracy: string;
    metricsTrend: string;
    trendImproving: string;
    trendDeclining: string;
    trendSteady: string;
    trendNew: string;
    reasonBadgeMistake: string;
    reasonBadgeAccuracy: string;
    reasonBadgeMastery: string;
    reasonBadgeUnattempted: string;
    stepUpBadge: string;
    revisionBadge: string;
    questionsCount: string;
    startSessionBtn: string;
    viewQuestionsBtn: string;
    emptyTitle: string;
    emptyDesc: string;
    progressSummaryTitle: string;
    repeatedMistakesFound: string;
    adaptiveEngineActive: string;
    whyRecommendedHeading: string;
    drillReadyToast: string;
  };
  hero: {
    kicker: string;
    titleLine1: string;
    titleGradient: string;
    subtitle: string;
    description: string;
    btnPractice: string;
    btnExam: string;
    btnDashboard: string;
    sessionBadge: string;
    sessionBadgeSub: string;
    coverageBadge: string;
    coverageBadgeSub: string;
    freeBadge: string;
    freeBadgeSub: string;
    bannerTag: string;
    bannerTitle: string;
    bannerDesc: string;
  };
  landing: {
    featuresTitle: string;
    featuresSubtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    subjectsTitle: string;
    subjectsSubtitle: string;
    mathsDesc: string;
    physicsDesc: string;
    chemDesc: string;
    practiceNow: string;
    launchExam: string;
    sampleChallengeTitle: string;
    sampleChallengeSubtitle: string;
    correctAnswerMsg: string;
    wrongAnswerMsg: string;
    analyzeMistakeBtn: string;
    footerText: string;
    madeBy: string;
  };
  dashboard: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    storageBadge: string;
    statAccuracy: string;
    statQuestions: string;
    statQuizzes: string;
    statStreak: string;
    statStreakSub: string;
    statWeakTopics: string;
    btnStartPractice: string;
    btnStartExam: string;
    btnViewRadar: string;
    subjectsHeading: string;
    subjectsSub: string;
    recentHeading: string;
    recentSub: string;
    noAttemptsTitle: string;
    noAttemptsDesc: string;
    reviewBtn: string;
    chaptersCount: string;
    weightageLabel: string;
    savedQuestionsHeading: string;
    savedQuestionsSub: string;
    noBookmarksTitle: string;
    noBookmarksDesc: string;
    continueExamBtn: string;
    continueExamSub: string;
    discardExamBtn: string;
    weakChaptersHeading: string;
    weakChaptersSub: string;
    noWeakChapters: string;
  };
  config: {
    modalTitle: string;
    modalSubtitle: string;
    boardLabel: string;
    subjectLabel: string;
    chapterLabel: string;
    allChapters: string;
    difficultyLabel: string;
    easy: string;
    medium: string;
    hard: string;
    mixed: string;
    questionCountLabel: string;
    typeLabel: string;
    typeMcq: string;
    typeNumerical: string;
    typeConceptual: string;
    typeAssertionReason: string;
    typeCaseBased: string;
    typeMixed: string;
    modeLabel: string;
    modePractice: string;
    modePracticeDesc: string;
    modeExam: string;
    modeExamDesc: string;
    examDurationLabel: string;
    examDurationOption10: string;
    examDurationOption15: string;
    examDurationOption20: string;
    examDurationOption30: string;
    examDurationOption45: string;
    examDurationOption60: string;
    examDurationCustom: string;
    examDurationMinutesUnit: string;
    aiToggleLabel: string;
    aiToggleDesc: string;
    curatedBadge: string;
    startBtn: string;
    generatingMsg: string;
    fallbackBtn: string;
    cancelBtn: string;
  };
  quiz: {
    questionLabel: string;
    of: string;
    timeRemaining: string;
    practiceModeBadge: string;
    examModeBadge: string;
    simulatedExamBadge: string;
    curatedSourceBadge: string;
    aiSourceBadge: string;
    flagReview: string;
    flagged: string;
    bookmark: string;
    bookmarked: string;
    reportQuestion: string;
    reportModalTitle: string;
    reportModalDesc: string;
    reportReason1: string;
    reportReason2: string;
    reportReason3: string;
    reportReason4: string;
    reportCommentPlaceholder: string;
    reportSubmitBtn: string;
    reportCancelBtn: string;
    reportNotice: string;
    reportSavedToast: string;
    clearChoice: string;
    previous: string;
    next: string;
    submitQuiz: string;
    confirmSubmitTitle: string;
    confirmSubmitDesc: string;
    warnUnanswered: string;
    warnFlagged: string;
    btnReviewUnanswered: string;
    btnReviewFlagged: string;
    cancel: string;
    confirm: string;
    questionPalette: string;
    paletteAttempted: string;
    paletteUnattempted: string;
    paletteFlagged: string;
    paletteAnsweredReview: string;
    filterPaletteAll: string;
    filterPaletteUnattempted: string;
    filterPaletteReview: string;
    timeAlert5Min: string;
    timeAlert1Min: string;
    viewInHindi: string;
    viewInEnglish: string;
    officialExplanation: string;
    pitfallWarning: string;
    boardTip: string;
    instructionsTitle: string;
    instructionsSubtitle: string;
    instructionsDisclaimer: string;
    instructionsItemSubject: string;
    instructionsItemDuration: string;
    instructionsItemTotalQuestions: string;
    instructionsItemMarking: string;
    instructionsItemMarkingDesc: string;
    instructionsItemRulesTitle: string;
    instructionsRuleTimer: string;
    instructionsRuleNav: string;
    instructionsRuleSave: string;
    instructionsRuleReview: string;
    instructionsRulePalette: string;
    instructionsRuleSubmit: string;
    instructionsRuleIntegrity: string;
    instructionsAcknowledge: string;
    instructionsStartBtn: string;
    instructionsBackBtn: string;
  };
  results: {
    title: string;
    subtitle: string;
    backToDashboard: string;
    scoreLabel: string;
    accuracyLabel: string;
    timeSpent: string;
    attemptedCount: string;
    unansweredCount: string;
    correctCount: string;
    incorrectCount: string;
    avgTimePerQuestion: string;
    simulatedExamNotice: string;
    gradeGreat: string;
    gradeGood: string;
    gradeNeedsWork: string;
    retakeBtn: string;
    radarHeading: string;
    radarSub: string;
    strongTopicsTitle: string;
    practiseTopicsTitle: string;
    weakTopicsTitle: string;
    notEnoughData: string;
    filterAll: string;
    filterIncorrect: string;
    filterUnanswered: string;
    filterFlagged: string;
    analyzeMistakeBtn: string;
    solutionSteps: string;
    commonPitfall: string;
    boardTip: string;
  };
  radar: {
    pageTitle: string;
    pageSubtitle: string;
    newQuizBtn: string;
    formulaTitle: string;
    formulaText: string;
    categoryStrong: string;
    categoryPractise: string;
    categoryWeak: string;
    statusStrong: string;
    statusPractise: string;
    statusWeak: string;
    statusNoData: string;
    actionStrong: string;
    actionPractise: string;
    actionWeak: string;
    actionNoData: string;
    tableTopic: string;
    tableSubject: string;
    tableAttempted: string;
    tableCorrect: string;
    tableAccuracy: string;
    tableStatus: string;
    tableAction: string;
    practiceAllWeakBtn: string;
    targetDrillBtn: string;
    emptyRadar: string;
    exportData: string;
    resetData: string;
    resetConfirm: string;
  };
  mistake: {
    title: string;
    subtitle: string;
    coreConcept: string;
    whyCorrect: string;
    whySelectedWrong: string;
    memoryAnchor: string;
    followUpTitle: string;
    followUpDesc: string;
    askTeacher: string;
    askPlaceholder: string;
    askBtn: string;
    analyzing: string;
    closeBtn: string;
  };
  tutor: {
    pageTitle: string;
    pageSubtitle: string;
    kicker: string;
    subjectLabel: string;
    mathsOption: string;
    physicsOption: string;
    chemistryOption: string;
    inputPlaceholder: string;
    sendBtn: string;
    uploadPhotoBtn: string;
    removePhotoBtn: string;
    actionExplainSimply: string;
    actionAnotherExample: string;
    actionExplainFormula: string;
    actionSummarize: string;
    actionCopy: string;
    actionCopied: string;
    actionSaveDoubt: string;
    actionDoubtSaved: string;
    clearChatBtn: string;
    loadingTitle: string;
    loadingStep1: string;
    loadingStep2: string;
    followUpPlaceholder: string;
    suggestedHeading: string;
    mathsSample1: string;
    mathsSample2: string;
    physicsSample1: string;
    physicsSample2: string;
    chemSample1: string;
    chemSample2: string;
    savedDoubtsTab: string;
    chatTab: string;
    noSavedDoubtsTitle: string;
    noSavedDoubtsDesc: string;
    disclaimer: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      brandSubtitle: 'CBSE CLASS 12 · 2026–27',
      home: 'Home',
      dashboard: 'Dashboard',
      weakTopicRadar: 'Weak Topic Radar',
      practiceQuiz: 'Practice Quiz',
      examMode: 'Exam Mode',
      launchQuiz: 'Launch Quiz',
      offlineSaved: 'Offline & Local Saved',
      storageNote: 'Progress saved in browser storage',
      langEn: 'English',
      langHi: 'हिन्दी',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      aiTutor: 'AI Tutor',
      smartPractice: 'Smart Practice',
      revision: 'Revision Center',
      quiz: 'AI Quiz Generator',
      exam: 'Exam Simulator',
      analytics: 'Analytics',
      flashcards: 'Flashcards',
      formulas: 'Formula Library',
      studyPlanner: 'Study Planner',
      bookmarks: 'Bookmarks',
      settings: 'Settings',
      pdfToQuiz: 'PDF to Quiz',
      studyRoadmap: 'AI Study Roadmap',
      answerChecker: 'Mock Board Examiner',
      mistakeDetective: 'Mistake Detective 2.0',
      masteryMap: 'Mastery Map',
      dailyChallenge: 'Daily Challenge',
      notesGenerator: 'AI Notes Generator',
      questionPaper: 'Question Paper',
      learningDna: 'AI Learning DNA',
      weakChapters: 'Weak Chapter Detector',
      studyCoach: 'AI Study Coach',
      smartRetry: 'Smart Retry Mode',
      progressTimeline: 'Progress Timeline',
      mistakeNotebook: 'Mistake Notebook',
      focusMode: 'Focus Mode',
      chapterTracker: 'Chapter Tracker',
      collapseSidebar: 'Collapse sidebar',
      expandSidebar: 'Expand sidebar',
    },
    revision: {
      navTitle: 'Smart Revision',
      brandKicker: 'Science-Backed Spaced Repetition',
      pageTitle: 'Smart Revision System',
      pageSubtitle: 'Review questions you missed, revisit bookmarked high-yield concepts, and master difficult CBSE topics using adaptive spaced repetition.',
      totalSaved: 'Saved Items',
      dueForRevision: 'Due for Revision',
      mastered: 'Mastered Concepts',
      autoSavedMistakes: 'Quiz Mistakes Logged',
      bookmarkedQuestions: 'Bookmarked Questions',
      srsBannerTitle: 'Adaptive Spaced-Repetition Active (1d → 3d → 7d → 14d)',
      srsBannerDesc: 'Questions you get wrong are automatically queued here. Once revised or retried correctly, their review interval doubles until the concept is permanently mastered for your board exams.',
      tabDue: 'Due for Review',
      tabAll: 'All Saved',
      tabIncorrect: 'Quiz Mistakes',
      tabBookmarked: 'Bookmarked',
      tabMastered: 'Mastered (Stage 4)',
      practiceDueBtn: 'Practice Due Questions',
      practiceAllBtn: 'Practice All Filtered',
      subjectFilterAll: 'All Subjects',
      searchPlaceholder: 'Search questions, chapters, or topics...',
      dueNowBadge: 'Due Today (Stage 0)',
      stage1Badge: 'Stage 1 (1 Day)',
      stage2Badge: 'Stage 2 (3 Days)',
      stage3Badge: 'Stage 3 (7 Days)',
      masteredBadge: 'Mastered (Stage 4)',
      markAsRevised: 'Mark as Revised',
      markedRevised: 'Revised',
      retryBtn: 'Retry Question',
      cancelRetry: 'Cancel',
      checkAnswer: 'Check Answer',
      retryCorrectFeedback: 'Excellent! You got it right. Advanced to next spaced-repetition stage.',
      retryIncorrectFeedback: 'Not quite. Check the official NCERT explanation below. Kept due for revision.',
      savedBecauseIncorrect: 'Auto-saved from Quiz Mistake',
      savedBecauseBookmark: 'Bookmarked Question',
      recommendedHeader: 'Targeted Revision Recommendations',
      recommendedSub: 'Concepts identified from your actual quiz performance and mistake patterns.',
      addRecommendedToRevision: 'Add to Revision List',
      practiceRecommendedBtn: 'Practice Topic',
      emptyDueTitle: 'All Caught Up! No Questions Due Today',
      emptyDueDesc: 'Great job! You have revised all due concepts. Continue practicing quizzes or review all saved questions to reinforce your memory.',
      emptyAllTitle: 'No Saved Questions in Revision List',
      emptyAllDesc: 'Questions you answer incorrectly during quizzes are automatically captured here for revision. You can also bookmark tricky questions anytime.',
      emptyFilterTitle: 'No Matching Revision Items',
      emptyFilterDesc: 'No saved questions match your active subject or search criteria.',
      startQuizPrompt: 'Start a Practice Quiz',
      deleteItem: 'Remove from Revision',
      itemDeletedToast: 'Question removed from revision list',
      revisedToast: 'Concept marked as revised! Next review scheduled.',
      correctCelebration: 'Correct! Memory reinforced.',
      incorrectRetryNote: 'Incorrect attempt logged. Added back to today’s review list.',
      viewExplanation: 'View Official Explanation',
      hideExplanation: 'Hide Explanation',
      reviewCountLabel: 'Times Revised',
      incorrectCountLabel: 'Errors Logged',
    },
    smartPractice: {
      pageTitle: 'Smart Practice Engine',
      pageSubtitle: 'Adaptive CBSE Class 12 question recommendations tailored to your actual quiz performance, accuracy, and weak areas.',
      kicker: 'Adaptive CBSE Intelligence',
      heroHeading: 'Personalized Practice Recommendations',
      heroSub: 'Our deterministic engine continuously analyzes your quiz attempts, tracks accuracy, flags repeated mistakes, and steps up question difficulty as your understanding solidifies.',
      startRecommendedDrill: 'Start Recommended Drill',
      targetDifficulty: 'Target Difficulty',
      allSubjects: 'All Subjects',
      subjectFilterLabel: 'Subject Focus',
      difficultyFilterLabel: 'Difficulty Mode',
      autoStepUpLabel: 'Adaptive Step-Up',
      autoStepUpDesc: 'Gradually recommend harder questions as your topic accuracy surpasses 80%',
      metricsAttempted: 'Questions Attempted',
      metricsAccuracy: 'Accuracy',
      metricsTrend: 'Trend',
      trendImproving: 'Improving',
      trendDeclining: 'Needs Attention',
      trendSteady: 'Consolidating',
      trendNew: 'New Syllabus Area',
      reasonBadgeMistake: 'Revision Recommended',
      reasonBadgeAccuracy: 'Concept Strengthening',
      reasonBadgeMastery: 'HOTS Step-Up',
      reasonBadgeUnattempted: 'High-Yield Board Coverage',
      stepUpBadge: 'Gradual Step-Up Active',
      revisionBadge: 'Revision Drill',
      questionsCount: 'Questions',
      startSessionBtn: 'Start Practice Drill',
      viewQuestionsBtn: 'Inspect Questions',
      emptyTitle: 'No Recommendations Needed Right Now',
      emptyDesc: 'Take practice quizzes or simulated board exams to populate personalized topic-by-topic recommendations.',
      progressSummaryTitle: 'Adaptive Diagnostic Summary',
      repeatedMistakesFound: 'Repeated mistake patterns identified and addressed with targeted revision.',
      adaptiveEngineActive: 'Engine is actively calibrating question difficulty (Easy → Medium → Hard).',
      whyRecommendedHeading: 'Why This Topic Is Recommended',
      drillReadyToast: 'Smart Practice Drill configured and loaded!',
    },
    hero: {
      kicker: 'CBSE Class 12 · Academic Session 2026–27',
      titleLine1: 'Your Smart Companion for',
      titleGradient: 'CBSE Board Exams',
      subtitle: 'Practice Smarter. Understand Better. Prepare with AI.',
      description:
        'Tailored specifically for CBSE Class 12 Mathematics, Physics, and Chemistry. Master Section A MCQs, decode exam traps with Mistake Detective, and eliminate weak topics under realistic time constraints.',
      btnPractice: 'Start Practice Quiz',
      btnExam: 'Launch Exam Mode',
      btnDashboard: 'Open Dashboard',
      sessionBadge: '2026–27',
      sessionBadgeSub: 'Official CBSE Session',
      coverageBadge: '37 Chapters',
      coverageBadgeSub: 'Full NCERT Coverage',
      freeBadge: '100% Free',
      freeBadgeSub: 'Spark / Local Safe',
      bannerTag: 'Official 2026–27 CBSE Blueprint',
      bannerTitle: 'Master Section A MCQs & Assertion-Reason',
      bannerDesc:
        "Target high-yield topics like Gauss's Law, Nernst Equation, and Differential Equations with instant concept forensics.",
    },
    landing: {
      featuresTitle: 'Why Top Scorers Practice on BoardAce AI',
      featuresSubtitle:
        'Built strictly around the CBSE Class 12 curriculum with syllabus verification, zero paid subscriptions, and privacy-first local storage.',
      feature1Title: 'Weak Topic Radar',
      feature1Desc:
        'Calculates real-time topic accuracy and categorizes your progress into Strong, Practice, and Needs Attention areas.',
      feature2Title: 'Mistake Detective',
      feature2Desc:
        'Deep-dive into incorrect answers with step-by-step NCERT reasons, common traps, and memory anchor rules.',
      feature3Title: 'CBSE Exam Mode',
      feature3Desc:
        'Practice under realistic board pressure with countdown timer, 5-minute warning alert, and question palette.',
      feature4Title: 'Full Class 12 Syllabus',
      feature4Desc:
        'Covers all 37 chapters across Mathematics (041), Physics (042), and Chemistry (043) with verified formulas.',
      subjectsTitle: 'Subjects Aligned with 2026–27 Session',
      subjectsSubtitle:
        'Choose a subject to drill specific chapters or test yourself across the complete syllabus.',
      mathsDesc: 'Calculus, Vectors, 3D Geometry, Linear Programming & Probability',
      physicsDesc: 'Electrostatics, Magnetism, Optics, Modern Physics & Semiconductor Devices',
      chemDesc: 'Physical, Inorganic & Organic Chemistry with reaction mechanisms',
      practiceNow: 'Practice Chapter',
      launchExam: 'Exam Mode',
      sampleChallengeTitle: 'Try a Live Board Question Challenge',
      sampleChallengeSubtitle:
        'Solve this high-yield question from Physics Chapter 1: Electric Charges and Fields.',
      correctAnswerMsg: 'Excellent! Your concept is solid as per CBSE NCERT theory.',
      wrongAnswerMsg: 'Not quite right. Let Mistake Detective break down the misconception.',
      analyzeMistakeBtn: 'Analyze with Mistake Detective',
      footerText: 'BoardAce AI · CBSE Class 12 (Session 2026–27) · Free & Open Education Platform',
      madeBy: 'Made with ♥ by Pratyush Sharma',
    },
    dashboard: {
      welcomeTitle: 'Welcome, Class 12 Aspirant!',
      welcomeSubtitle:
        'Your board preparation hub for Mathematics, Physics, and Chemistry. Practice quizzes, eliminate weak topics, and track your streak.',
      storageBadge: 'Local Browser Storage Active · 100% Private',
      statAccuracy: 'Overall Accuracy',
      statQuestions: 'Questions Solved',
      statQuizzes: 'Quizzes Completed',
      statStreak: 'Day Streak',
      statStreakSub: 'Consistency drives board marks',
      statWeakTopics: 'Weak Topics Flagged',
      btnStartPractice: 'New Practice Quiz',
      btnStartExam: 'Launch Exam Mode',
      btnViewRadar: 'View Weak Topic Radar',
      subjectsHeading: 'Class 12 Core Subjects',
      subjectsSub: 'Select a subject or chapter to begin targeted practice.',
      recentHeading: 'Recent Quiz Activity',
      recentSub: 'Review your past attempts, inspect answer explanations, and target mistakes.',
      noAttemptsTitle: 'No quizzes taken yet',
      noAttemptsDesc: 'Launch your first practice quiz or exam simulation to begin tracking your performance.',
      reviewBtn: 'Review Answers',
      chaptersCount: 'Chapters',
      weightageLabel: 'Est. Weightage',
      savedQuestionsHeading: 'Saved & Bookmarked Questions',
      savedQuestionsSub: 'Review difficult questions, verify formulas, and launch focused revision drills.',
      noBookmarksTitle: 'No saved questions yet',
      noBookmarksDesc: 'Click the Bookmark icon while practicing to pin tricky NCERT problems here.',
      continueExamBtn: 'Continue Previous Exam',
      continueExamSub: 'You have an unfinished CBSE exam in progress. Resume where you left off.',
      discardExamBtn: 'Discard Exam',
      weakChaptersHeading: 'Priority Chapters to Focus',
      weakChaptersSub: 'Identified based on your actual quiz accuracy (< 75%). Practice these to maximize board marks.',
      noWeakChapters: 'Great job! No weak chapters identified yet. Keep practicing to maintain high accuracy.',
    },
    config: {
      modalTitle: 'Custom Quiz Generator',
      modalSubtitle: 'Configure your target CBSE board practice session',
      boardLabel: 'Board & Academic Session',
      subjectLabel: 'Subject',
      chapterLabel: 'Chapter / Unit',
      allChapters: 'All Chapters (Full Syllabus Mock)',
      difficultyLabel: 'Difficulty Level',
      easy: 'Easy (NCERT Direct / Basic Formulas)',
      medium: 'Medium (Standard CBSE Board Level)',
      hard: 'Hard (Exemplar / HOTS)',
      mixed: 'Mixed (Realistic Board Distribution)',
      questionCountLabel: 'Number of Questions',
      typeLabel: 'Question Format',
      typeMcq: 'Multiple Choice Questions (MCQ)',
      typeNumerical: 'Numerical & Calculation Problems',
      typeConceptual: 'Conceptual & Theory Questions',
      typeAssertionReason: 'Assertion & Reason',
      typeCaseBased: 'Case-Based MCQs',
      typeMixed: 'Mixed Format (Standard Board Style)',
      modeLabel: 'Practice Environment',
      modePractice: 'Practice Mode',
      modePracticeDesc: 'Instant explanations, no time pressure, learn at your pace.',
      modeExam: 'CBSE Exam Mode',
      modeExamDesc: 'Timed test, countdown timer, question palette, real pressure.',
      examDurationLabel: 'Exam Duration',
      examDurationOption10: '10 Mins (Quick Section)',
      examDurationOption15: '15 Mins (Fast Drill)',
      examDurationOption20: '20 Mins (Standard 10-Q)',
      examDurationOption30: '30 Mins (Deep Revision)',
      examDurationOption45: '45 Mins (Mock Section)',
      examDurationOption60: '60 Mins (Full Section Mock)',
      examDurationCustom: 'Custom Duration',
      examDurationMinutesUnit: 'mins',
      aiToggleLabel: 'AI Question Generator (Gemini)',
      aiToggleDesc: 'Generates fresh board questions tailored to your chapter and difficulty.',
      curatedBadge: 'NCERT Verified Board Bank',
      startBtn: 'Start Quiz Session',
      generatingMsg: 'Generating CBSE board questions with AI...',
      fallbackBtn: 'Use Verified Question Bank Instead',
      cancelBtn: 'Cancel',
    },
    quiz: {
      questionLabel: 'Question',
      of: 'of',
      timeRemaining: 'Time Remaining',
      practiceModeBadge: 'Practice Mode',
      examModeBadge: 'CBSE Exam Mode',
      simulatedExamBadge: 'Simulated Board Exam',
      curatedSourceBadge: 'Curated NCERT Question',
      aiSourceBadge: 'AI-Generated Question (Verified)',
      flagReview: 'Mark for Review',
      flagged: 'Flagged for Review',
      bookmark: 'Bookmark',
      bookmarked: 'Bookmarked',
      reportQuestion: 'Report Question',
      reportModalTitle: 'Report Question',
      reportModalDesc: 'Help identify potential issues. Reports are saved locally on this device.',
      reportReason1: 'Incorrect Answer',
      reportReason2: 'Incorrect Explanation',
      reportReason3: 'Confusing Question',
      reportReason4: 'Other',
      reportCommentPlaceholder: 'Additional context or correction (optional)...',
      reportSubmitBtn: 'Save Report Locally',
      reportCancelBtn: 'Cancel',
      reportNotice: 'Note: There is no reporting backend. Reports are saved locally on your device for your own review.',
      reportSavedToast: 'Question report saved locally on your device.',
      clearChoice: 'Clear Choice',
      previous: 'Previous',
      next: 'Next',
      submitQuiz: 'Submit Exam',
      confirmSubmitTitle: 'Ready to Submit Your Examination?',
      confirmSubmitDesc:
        'Please review your attempt statistics below before finalizing. Answers are evaluated against verified NCERT keys.',
      warnUnanswered: 'Warning: You have unanswered question(s). Unanswered questions receive 0 marks.',
      warnFlagged: 'Note: You have question(s) marked for review. Please verify your selected choices.',
      btnReviewUnanswered: 'Review Unanswered',
      btnReviewFlagged: 'Review Flagged',
      cancel: 'Return to Exam',
      confirm: 'Yes, Finalize Submission',
      questionPalette: 'Question Palette',
      paletteAttempted: 'Answered',
      paletteUnattempted: 'Unanswered',
      paletteFlagged: 'Marked for Review',
      paletteAnsweredReview: 'Answered & Review',
      filterPaletteAll: 'All',
      filterPaletteUnattempted: 'Unanswered',
      filterPaletteReview: 'Review',
      timeAlert5Min: '⚠️ 5 Minutes Remaining in Exam Mode!',
      timeAlert1Min: '⚠️ 1 Minute Remaining! Please finalize your answers.',
      viewInHindi: 'हिंदी में देखें',
      viewInEnglish: 'View in English',
      officialExplanation: 'Verified NCERT Board Explanation',
      pitfallWarning: 'Common Trap & Misconception',
      boardTip: 'CBSE Examiner Tip for 2026–27',
      instructionsTitle: 'Examination Instructions & Rules',
      instructionsSubtitle: 'CBSE Class 12 Board Exam Simulator · Session 2026–27',
      instructionsDisclaimer: 'Simulated Practice Examination: Designed strictly for conceptual drill, time management, and self-assessment based on the CBSE Class 12 NCERT curriculum. This is not an official CBSE examination paper.',
      instructionsItemSubject: 'Subject & Syllabus',
      instructionsItemDuration: 'Allocated Duration',
      instructionsItemTotalQuestions: 'Total Questions',
      instructionsItemMarking: 'Scoring Pattern',
      instructionsItemMarkingDesc: '+1 mark for correct response, 0 for incorrect/unanswered. Calculated strictly with verified answer keys.',
      instructionsItemRulesTitle: 'Instructions & Navigation Rules',
      instructionsRuleTimer: 'Countdown Timer: Ticking starts immediately when you click "Start Examination". Visual warnings appear at 5 minutes and 1 minute remaining. Examination auto-submits when time expires.',
      instructionsRuleNav: 'Free Question Navigation: Use Previous/Next buttons, keyboard shortcuts (← / →, P / N), or jump instantly to any question using the Question Palette.',
      instructionsRuleSave: 'Answer Preservation: Selected answers are instantly preserved in your browser during navigation and even if the page refreshes.',
      instructionsRuleReview: 'Mark for Review: Flag uncertain questions anytime using "Mark for Review" or shortcut "F" to revisit before submission.',
      instructionsRulePalette: 'Palette Status: Answered (Green), Unanswered (Gray), Marked for Review (Amber), Answered & Marked for Review (Violet).',
      instructionsRuleSubmit: 'Submission Safeguard: An itemized summary warns you if any questions are unanswered or flagged before finalizing.',
      instructionsRuleIntegrity: 'Answer Keys: Results are computed purely from verified NCERT keys without simulated estimations.',
      instructionsAcknowledge: 'I have read, understood, and agree to adhere to all examination guidelines.',
      instructionsStartBtn: 'Start Examination Now',
      instructionsBackBtn: 'Exit to Settings',
    },
    results: {
      title: 'Exam Performance Diagnostic',
      subtitle: 'Comprehensive accuracy analysis & Weak Topic breakdown',
      backToDashboard: 'Back to Dashboard',
      scoreLabel: 'Final Score',
      accuracyLabel: 'Accuracy',
      timeSpent: 'Time Spent',
      attemptedCount: 'Attempted',
      unansweredCount: 'Unanswered',
      correctCount: 'Correct',
      incorrectCount: 'Incorrect',
      avgTimePerQuestion: 'Avg. Pace',
      simulatedExamNotice: 'CBSE Class 12 Simulated Practice Exam: Evaluated with verified answer keys. Official CBSE board examinations are conducted offline by the board.',
      gradeGreat: 'Outstanding! Excellent command of the syllabus.',
      gradeGood: 'Good attempt! A few concepts need targeted revision.',
      gradeNeedsWork: 'Needs Practice. Use Mistake Detective to address conceptual gaps.',
      retakeBtn: 'Retake Exam',
      radarHeading: 'Weak Topic Radar for this Attempt',
      radarSub: 'Topic-level diagnostic computed using official CBSE formula.',
      strongTopicsTitle: 'Strong Topics (>75% Accuracy)',
      practiseTopicsTitle: 'Topics to Practise (50%–75% Accuracy)',
      weakTopicsTitle: 'Topics Needing Attention (<50% Accuracy)',
      notEnoughData: 'Not enough data',
      filterAll: 'All Questions',
      filterIncorrect: 'Mistakes Only',
      filterUnanswered: 'Unanswered Only',
      filterFlagged: 'Flagged Questions',
      analyzeMistakeBtn: 'Mistake Detective',
      solutionSteps: 'Step-by-step Working',
      commonPitfall: 'Exam Trap',
      boardTip: 'Board Scoring Tip',
    },
    radar: {
      pageTitle: 'Weak Topic Radar Dashboard',
      pageSubtitle: 'Cumulative CBSE Class 12 diagnostic analysis and adaptive practice',
      newQuizBtn: 'New Practice Quiz',
      formulaTitle: 'Topic Performance Formula',
      formulaText: 'Topic Accuracy = (Correct Answers / Attempted Questions) × 100',
      categoryStrong: 'Strong Topics',
      categoryPractise: 'Topics to Practise',
      categoryWeak: 'Topics Needing More Attention',
      statusStrong: 'Strong',
      statusPractise: 'Practise',
      statusWeak: 'Needs Attention',
      statusNoData: 'Not enough data',
      actionStrong: 'Mastered! Maintain readiness with quick periodic revision.',
      actionPractise: 'Good base. Revise key formulas and solve 5 targeted questions.',
      actionWeak: 'High priority! Review NCERT theory and inspect traps with Mistake Detective.',
      actionNoData: 'No questions attempted yet for this topic. Start a quiz to diagnose.',
      tableTopic: 'Topic Name',
      tableSubject: 'Subject',
      tableAttempted: 'Attempted',
      tableCorrect: 'Correct',
      tableAccuracy: 'Accuracy',
      tableStatus: 'Status',
      tableAction: 'Recommended Action',
      practiceAllWeakBtn: 'Practice Weak Topics',
      targetDrillBtn: 'Target Drill',
      emptyRadar: 'No quiz attempts recorded yet. Take a quiz to generate your Weak Topic Radar!',
      exportData: 'Export Progress (JSON)',
      resetData: 'Reset Local Progress',
      resetConfirm: 'Are you sure you want to reset all saved quiz attempts and analytics?',
    },
    mistake: {
      title: 'Mistake Detective Forensics',
      subtitle: 'NCERT concept autopsy & exam trap decoding',
      coreConcept: 'Core Concept',
      whyCorrect: 'Why the Correct Option is Right',
      whySelectedWrong: 'Common Trap / Why Your Choice Was Wrong',
      memoryAnchor: 'Memory Anchor & Exam Mind-Check',
      followUpTitle: 'Targeted Concept Check Question',
      followUpDesc: 'Solve this 1-minute follow-up question to cement your understanding.',
      askTeacher: 'Ask Mistake Detective a Clarification Question',
      askPlaceholder: 'e.g. Why does the sign change in step 2?',
      askBtn: 'Ask AI Teacher',
      analyzing: 'Investigating mistake forensics with AI...',
      closeBtn: 'Close Analysis',
    },
    tutor: {
      pageTitle: 'AI Personal Tutor',
      pageSubtitle: '24/7 CBSE Class 12 Master Teacher for Mathematics, Physics & Chemistry',
      kicker: 'CBSE Class 12 · Academic Session 2026–27',
      subjectLabel: 'Select Subject',
      mathsOption: 'Mathematics (041)',
      physicsOption: 'Physics (042)',
      chemistryOption: 'Chemistry (043)',
      inputPlaceholder: 'Ask any Class 12 doubt or concept (e.g., Explain Integration by Parts, Lenz\'s Law derivation, Aldol condensation mechanism)...',
      sendBtn: 'Ask Tutor',
      uploadPhotoBtn: 'Attach Question Photo',
      removePhotoBtn: 'Remove Image',
      actionExplainSimply: 'Explain Simply',
      actionAnotherExample: 'Give Another Example',
      actionExplainFormula: 'Explain Formula',
      actionSummarize: 'Summarize',
      actionCopy: 'Copy Answer',
      actionCopied: 'Copied!',
      actionSaveDoubt: 'Save Doubt',
      actionDoubtSaved: 'Doubt Saved!',
      clearChatBtn: 'Clear Conversation',
      loadingTitle: 'Analyzing CBSE Class 12 Concept...',
      loadingStep1: 'Reviewing NCERT theory & equations...',
      loadingStep2: 'Formulating step-by-step master explanation...',
      followUpPlaceholder: 'Ask a follow-up question or request clarification...',
      suggestedHeading: 'High-Yield CBSE Doubts & Practice Questions',
      mathsSample1: 'How do I determine if a relation is Equivalence?',
      mathsSample2: 'Step-by-step method to solve Integration by Parts with ILATE rule',
      physicsSample1: 'Explain Gauss\'s Law and how to calculate electric field of an infinite sheet',
      physicsSample2: 'Derive the magnetic field inside a long current-carrying solenoid',
      chemSample1: 'Explain Aldol Condensation mechanism and conditions',
      chemSample2: 'How do I use Nernst equation to calculate cell EMF under non-standard conditions?',
      savedDoubtsTab: 'Saved Doubts & Solved Notes',
      chatTab: 'Live Tutoring Session',
      noSavedDoubtsTitle: 'No doubts saved yet',
      noSavedDoubtsDesc: 'When you ask the AI Tutor questions, click "Save Doubt" to bookmark key explanations for revision.',
      disclaimer: 'Explanations are aligned with NCERT CBSE Class 12 curriculum. Always verify with official CBSE marking schemes.',
    },
  },
  hi: {
    nav: {
      brandSubtitle: 'सीबीएसई कक्षा 12 · 2026–27',
      home: 'होम',
      dashboard: 'डैशबोर्ड',
      weakTopicRadar: 'कमज़ोर टॉपिक रडार',
      practiceQuiz: 'अभ्यास क्विज़',
      examMode: 'परीक्षा मोड',
      launchQuiz: 'क्विज़ शुरू करें',
      offlineSaved: 'ऑफ़लाइन व स्थानीय सुरक्षित',
      storageNote: 'प्रगति ब्राउज़र स्टोरेज में सुरक्षित है',
      langEn: 'English',
      langHi: 'हिन्दी',
      lightMode: 'लाइट मोड',
      darkMode: 'डार्क मोड',
      aiTutor: 'एआई ट्यूटर',
      smartPractice: 'स्मार्ट अभ्यास',
      revision: 'दोहराव केंद्र',
      quiz: 'AI क्विज़ जनरेटर',
      exam: 'परीक्षा सिम्युलेटर',
      analytics: 'विश्लेषण',
      flashcards: 'फ्लैशकार्ड्स',
      formulas: 'सूत्र पुस्तकालय',
      studyPlanner: 'अध्ययन योजनाकार',
      bookmarks: 'बुकमार्क',
      settings: 'सेटिंग्स',
      pdfToQuiz: 'PDF से क्विज़',
      studyRoadmap: 'AI अध्ययन रोडमैप',
      answerChecker: 'मॉक बोर्ड परीक्षक',
      mistakeDetective: 'गलती जासूस 2.0',
      masteryMap: 'अवधारणा दक्षता मानचित्र',
      dailyChallenge: 'दैनिक अभ्यास चुनौती',
      notesGenerator: 'AI त्वरित नोट्स',
      questionPaper: 'प्रश्न पत्र जनरेटर',
      learningDna: 'AI शिक्षण डीएनए',
      weakChapters: 'कमजोर अध्याय संसूचक',
      studyCoach: 'AI अध्ययन कोच',
      smartRetry: 'स्मार्ट पुनः प्रयास',
      progressTimeline: 'प्रगति समयरेखा',
      mistakeNotebook: 'मेरी गलती नोटबुक',
      focusMode: 'फोकस मोड',
      chapterTracker: 'अध्याय ट्रैकर',
      collapseSidebar: 'साइडबार छोटा करें',
      expandSidebar: 'साइडबार विस्तार करें',
    },
    revision: {
      navTitle: 'स्मार्ट पुनरावलोकन',
      brandKicker: 'वैज्ञानिक अंतराल दोहराव (Spaced Repetition)',
      pageTitle: 'स्मार्ट पुनरावलोकन प्रणाली (Smart Revision)',
      pageSubtitle: 'क्विज़ में गलत हुए प्रश्नों की समीक्षा करें, बुकमार्क किए गए कठिन प्रश्नों का पुनः अभ्यास करें और बोर्ड परीक्षा की तैयारी को सुदृढ़ बनाएं।',
      totalSaved: 'सहेजे गए प्रश्न',
      dueForRevision: 'आज दोहराव हेतु देय',
      mastered: 'कंठस्थ अवधारणाएं',
      autoSavedMistakes: 'दर्ज क्विज़ गलतियां',
      bookmarkedQuestions: 'बुकमार्क प्रश्न',
      srsBannerTitle: 'अनुकूली अंतराल दोहराव सक्रिय (1 दिन → 3 दिन → 7 दिन → 14 दिन)',
      srsBannerDesc: 'जिन प्रश्नों में आपसे गलती होती है, वे स्वतः यहाँ जुड़ जाते हैं। सही हल करने पर अंतराल बढ़ता जाता है जब तक कि आप उस पर पूर्ण पकड़ न बना लें।',
      tabDue: 'दोहराव हेतु देय',
      tabAll: 'सभी सहेजे गए',
      tabIncorrect: 'क्विज़ की गलतियां',
      tabBookmarked: 'बुकमार्क किए गए',
      tabMastered: 'सिद्ध/कंठस्थ (चरण 4)',
      practiceDueBtn: 'देय प्रश्नों का अभ्यास करें',
      practiceAllBtn: 'सभी फ़िल्टर किए गए हल करें',
      subjectFilterAll: 'सभी विषय',
      searchPlaceholder: 'प्रश्न, अध्याय या टॉपिक खोजें...',
      dueNowBadge: 'आज देय (चरण 0)',
      stage1Badge: 'चरण 1 (1 दिन)',
      stage2Badge: 'चरण 2 (3 दिन)',
      stage3Badge: 'चरण 3 (7 दिन)',
      masteredBadge: 'कंठस्थ (चरण 4)',
      markAsRevised: 'दोहराया गया चिह्नित करें',
      markedRevised: 'दोहराया गया',
      retryBtn: 'पुनः हल करें',
      cancelRetry: 'रद्द करें',
      checkAnswer: 'उत्तर जांचें',
      retryCorrectFeedback: 'बहुत बढ़िया! आपका उत्तर सही है। अगले अंतराल चरण में स्थानांतरित किया गया।',
      retryIncorrectFeedback: 'सही नहीं है। नीचे आधिकारिक NCERT व्याख्या देखें। आज दोहराव सूची में बनाए रखा गया।',
      savedBecauseIncorrect: 'क्विज़ गलती से स्वतः सहेजा गया',
      savedBecauseBookmark: 'बुकमार्क किया गया प्रश्न',
      recommendedHeader: 'लक्षित दोहराव सिफारिशें',
      recommendedSub: 'आपके वास्तविक क्विज़ प्रदर्शन और गलतियों के विश्लेषण के आधार पर अनुशंसित।',
      addRecommendedToRevision: 'दोहराव सूची में जोड़ें',
      practiceRecommendedBtn: 'टॉपिक अभ्यास करें',
      emptyDueTitle: 'उत्कृष्ट! आज कोई प्रश्न देय नहीं है',
      emptyDueDesc: 'बहुत खूब! आपने सभी देय अवधारणाओं की समीक्षा कर ली है। अधिक अभ्यास के लिए नई क्विज़ लें या सभी सहेजे प्रश्नों को देखें।',
      emptyAllTitle: 'दोहराव सूची में कोई सहेजा प्रश्न नहीं है',
      emptyAllDesc: 'क्विज़ के दौरान गलत होने वाले प्रश्न स्वतः यहाँ दर्ज हो जाते हैं। आप किसी भी प्रश्न को बुकमार्क भी कर सकते हैं।',
      emptyFilterTitle: 'कोई मेल खाता प्रश्न नहीं मिला',
      emptyFilterDesc: 'वर्तमान विषय या खोज मानदंडों से मेल खाता कोई प्रश्न उपलब्ध नहीं है।',
      startQuizPrompt: 'अभ्यास क्विज़ शुरू करें',
      deleteItem: 'दोहराव से हटाएं',
      itemDeletedToast: 'प्रश्न दोहराव सूची से हटा दिया गया',
      revisedToast: 'अवधारणा दोहराई गई चिह्नित! अगला दोहराव निर्धारित।',
      correctCelebration: 'सही उत्तर! स्मृति सुदृढ़ हुई।',
      incorrectRetryNote: 'पुनः प्रयास में गलती दर्ज। आज की दोहराव सूची में रखा गया।',
      viewExplanation: 'आधिकारिक व्याख्या देखें',
      hideExplanation: 'व्याख्या छिपाएं',
      reviewCountLabel: 'दोहराव की संख्या',
      incorrectCountLabel: 'दर्ज गलतियां',
    },
    smartPractice: {
      pageTitle: 'स्मार्ट अभ्यास इंजन',
      pageSubtitle: 'आपके वास्तविक क्विज़ प्रदर्शन, सटीकता और कमज़ोर क्षेत्रों के अनुरूप व्यक्तिगत सीबीएसई कक्षा 12 प्रश्न सिफारिशें।',
      kicker: 'अनुकूली सीबीएसई बुद्धिमत्ता',
      heroHeading: 'लक्षित अभ्यास सिफारिशें',
      heroSub: 'हमारा सटीक एल्गोरिथ्म आपके सभी प्रयासों का विश्लेषण करता है, बार-बार होने वाली गलतियों को चिह्नित करता है और समझ मजबूत होने पर कठिन प्रश्नों की ओर अग्रसर करता है।',
      startRecommendedDrill: 'सिफारिश किया गया अभ्यास शुरू करें',
      targetDifficulty: 'लक्षित कठिनाई स्तर',
      allSubjects: 'सभी विषय',
      subjectFilterLabel: 'विषय चुनें',
      difficultyFilterLabel: 'कठिनाई मोड',
      autoStepUpLabel: 'अनुकूली स्तर वृद्धि',
      autoStepUpDesc: '80% से अधिक सटीकता प्राप्त होने पर स्वतः उच्च स्तरीय (HOTS) प्रश्नों की सिफारिश करें',
      metricsAttempted: 'हल किए गए प्रश्न',
      metricsAccuracy: 'सटीकता',
      metricsTrend: 'प्रवृत्ति',
      trendImproving: 'सुधार जारी',
      trendDeclining: 'ध्यान अपेक्षित',
      trendSteady: 'स्थिर',
      trendNew: 'नया अध्याय',
      reasonBadgeMistake: 'दोहराव आवश्यक',
      reasonBadgeAccuracy: 'अवधारणा सुदृढ़ीकरण',
      reasonBadgeMastery: 'HOTS स्तर वृद्धि',
      reasonBadgeUnattempted: 'महत्वपूर्ण बोर्ड कवरेज',
      stepUpBadge: 'स्तर वृद्धि सक्रिय',
      revisionBadge: 'रिवीजन सत्र',
      questionsCount: 'प्रश्न',
      startSessionBtn: 'अभ्यास शुरू करें',
      viewQuestionsBtn: 'प्रश्न देखें',
      emptyTitle: 'वर्तमान में कोई नई सिफारिश नहीं है',
      emptyDesc: 'अपनी वैयक्तिकृत सिफारिशें देखने के लिए क्विज़ या परीक्षा का अभ्यास करें।',
      progressSummaryTitle: 'अनुकूली विश्लेषण सारांश',
      repeatedMistakesFound: 'बार-बार होने वाली गलतियों की पहचान कर लक्षित दोहराव तैयार किया गया।',
      adaptiveEngineActive: 'इंजन कठिनाई स्तर को निरंतर संतुलित कर रहा है (सरल → मध्यम → कठिन)।',
      whyRecommendedHeading: 'इस विषय की सिफारिश का कारण',
      drillReadyToast: 'स्मार्ट अभ्यास सत्र सफलतापूर्वक तैयार किया गया!',
    },
    hero: {
      kicker: 'सीबीएसई कक्षा 12 · शैक्षणिक सत्र 2026–27',
      titleLine1: 'सीबीएसई बोर्ड परीक्षाओं के लिए आपका',
      titleGradient: 'स्मार्ट साथी',
      subtitle: 'स्मार्ट अभ्यास करें। बेहतर समझें। AI के साथ तैयारी करें।',
      description:
        'सीबीएसई कक्षा 12 गणित, भौतिक विज्ञान और रसायन विज्ञान के लिए विशेष रूप से डिज़ाइन किया गया। सेक्शन A बहुविकल्पीय प्रश्नों में महारत हासिल करें, मिस्टेक डिटेक्टिव से परीक्षा के जालों को समझें और समय सीमा में कमज़ोर टॉपिक्स को सुधारें।',
      btnPractice: 'अभ्यास क्विज़ शुरू करें',
      btnExam: 'परीक्षा मोड शुरू करें',
      btnDashboard: 'डैशबोर्ड खोलें',
      sessionBadge: '2026–27',
      sessionBadgeSub: 'आधिकारिक सीबीएसई सत्र',
      coverageBadge: '37 अध्याय',
      coverageBadgeSub: 'संपूर्ण NCERT पाठ्यक्रम',
      freeBadge: '100% निःशुल्क',
      freeBadgeSub: 'स्थानीय डेटा सुरक्षित',
      bannerTag: 'आधिकारिक 2026–27 सीबीएसई ब्लूप्रिंट',
      bannerTitle: 'सेक्शन A बहुविकल्पीय एवं अभिकथन-कारण प्रश्नों में दक्षता',
      bannerDesc:
        'गाउस का नियम, नर्नस्ट समीकरण और अवकल समीकरण जैसे महत्वपूर्ण विषयों पर तुरंत विश्लेषण प्राप्त करें।',
    },
    landing: {
      featuresTitle: 'शीर्ष छात्र BoardAce AI पर अभ्यास क्यों करते हैं',
      featuresSubtitle:
        'सीबीएसई कक्षा 12 पाठ्यक्रम के अनुसार निर्मित, बिना किसी शुल्क या सदस्यता के, और पूर्ण गोपनीयता के साथ।',
      feature1Title: 'कमज़ोर टॉपिक रडार',
      feature1Desc:
        'प्रत्येक टॉपिक की सटीकता की गणना करता है और आपको मजबूत, अभ्यास योग्य और ध्यान देने योग्य श्रेणियों में मार्गदर्शन देता है।',
      feature2Title: 'मिस्टेक डिटेक्टिव',
      feature2Desc:
        'गलत उत्तरों का चरण-दर-चरण NCERT विश्लेषण, सामान्य परीक्षा जाल और स्मरण सूत्र प्रदान करता है।',
      feature3Title: 'सीबीएसई परीक्षा मोड',
      feature3Desc:
        'उलटी गिनती टाइमर, 5-मिनट की चेतावनी और प्रश्न पैलेट के साथ वास्तविक बोर्ड परीक्षा के माहौल में अभ्यास करें।',
      feature4Title: 'संपूर्ण कक्षा 12 पाठ्यक्रम',
      feature4Desc:
        'गणित (041), भौतिक विज्ञान (042) और रसायन विज्ञान (043) के सभी 37 अध्यायों को प्रमाणित सूत्रों के साथ शामिल करता है।',
      subjectsTitle: '2026–27 सत्र के अनुसार विषय',
      subjectsSubtitle: 'अध्याय-वार अभ्यास करने या पूरे पाठ्यक्रम की मॉक परीक्षा देने के लिए विषय चुनें।',
      mathsDesc: 'कलन, सदिश, 3D ज्यामिति, रैखिक प्रोग्रामन और प्रायिकता',
      physicsDesc: 'स्थिरवैद्युतिकी, चुंबकत्व, प्रकाशिकी, आधुनिक भौतिकी और अर्धचालक',
      chemDesc: 'भौतिक, अकार्बनिक और कार्बनिक रसायन अभिक्रिया तंत्र सहित',
      practiceNow: 'अध्याय अभ्यास',
      launchExam: 'परीक्षा मोड',
      sampleChallengeTitle: 'लाइव बोर्ड प्रश्न चुनौती हल करें',
      sampleChallengeSubtitle:
        'भौतिक विज्ञान अध्याय 1: विद्युत आवेश तथा क्षेत्र से इस महत्वपूर्ण प्रश्न को हल करें।',
      correctAnswerMsg: 'बहुत बढ़िया! NCERT सिद्धांत के अनुसार आपकी अवधारणा बिल्कुल सही है।',
      wrongAnswerMsg: 'यह उत्तर सही नहीं है। आइए मिस्टेक डिटेक्टिव से इस गलती को समझें।',
      analyzeMistakeBtn: 'मिस्टेक डिटेक्टिव से विश्लेषण करें',
      footerText: 'BoardAce AI · सीबीएसई कक्षा 12 (सत्र 2026–27) · निःशुल्क एवं खुला शिक्षण मंच',
      madeBy: 'प्रत्युष शर्मा द्वारा निर्मित (Made with ♥ by Pratyush Sharma)',
    },
    dashboard: {
      welcomeTitle: 'स्वागत है, कक्षा 12 के छात्र!',
      welcomeSubtitle:
        'गणित, भौतिकी और रसायन विज्ञान के लिए आपका बोर्ड तैयारी केंद्र। क्विज़ हल करें, कमज़ोरियाँ दूर करें और अपनी निरंतरता बनाए रखें।',
      storageBadge: 'ब्राउज़र स्टोरेज सक्रिय · 100% निजी एवं सुरक्षित',
      statAccuracy: 'कुल सटीकता',
      statQuestions: 'हल किए गए प्रश्न',
      statQuizzes: 'पूर्ण किए गए क्विज़',
      statStreak: 'दिनों की स्ट्रीक',
      statStreakSub: 'नियमितता से ही बोर्ड में शीर्ष अंक आते हैं',
      statWeakTopics: 'चिह्नित कमज़ोर टॉपिक्स',
      btnStartPractice: 'नया अभ्यास क्विज़',
      btnStartExam: 'परीक्षा मोड शुरू करें',
      btnViewRadar: 'कमज़ोर टॉपिक रडार देखें',
      subjectsHeading: 'कक्षा 12 के मुख्य विषय',
      subjectsSub: 'लक्षित अभ्यास शुरू करने के लिए कोई विषय या अध्याय चुनें।',
      recentHeading: 'हालिया क्विज़ गतिविधियाँ',
      recentSub: 'अपने पिछले प्रयासों की समीक्षा करें, स्पष्टीकरण देखें और गलतियों को सुधारें।',
      noAttemptsTitle: 'अभी तक कोई क्विज़ पूरा नहीं हुआ',
      noAttemptsDesc: 'अपनी तैयारी का मूल्यांकन करने के लिए पहला अभ्यास क्विज़ या परीक्षा अनुकरण शुरू करें।',
      reviewBtn: 'उत्तरों की समीक्षा',
      chaptersCount: 'अध्याय',
      weightageLabel: 'अनुमानित अंक',
      savedQuestionsHeading: 'सहेजे गए एवं बुकमार्क प्रश्न',
      savedQuestionsSub: 'कठिन प्रश्नों की समीक्षा करें, सूत्रों की जांच करें और लक्षित अभ्यास सत्र शुरू करें।',
      noBookmarksTitle: 'कोई सहेजा गया प्रश्न नहीं',
      noBookmarksDesc: 'क्विज़ के दौरान महत्वपूर्ण प्रश्नों को यहाँ सुरक्षित करने के लिए बुकमार्क आइकन पर क्लिक करें।',
      continueExamBtn: 'पिछली परीक्षा जारी रखें',
      continueExamSub: 'आपकी एक सीबीएसई बोर्ड परीक्षा प्रगति पर है। जहाँ छोड़ा था वहीं से पुनः शुरू करें।',
      discardExamBtn: 'परीक्षा निरस्त करें',
      weakChaptersHeading: 'प्राथमिकता वाले कमज़ोर अध्याय',
      weakChaptersSub: 'वास्तविक क्विज़ परिणामों (< 75% सटीकता) के आधार पर चुने गए। बोर्ड में अधिकतम अंक हेतु इन पर ध्यान दें।',
      noWeakChapters: 'शानदार! अभी तक कोई कमज़ोर अध्याय नहीं पाया गया। उच्च सटीकता बनाए रखने के लिए अभ्यास जारी रखें।',
    },
    config: {
      modalTitle: 'कस्टम क्विज़ जनरेटर',
      modalSubtitle: 'अपने लक्षित सीबीएसई बोर्ड अभ्यास सत्र को कॉन्फ़िगर करें',
      boardLabel: 'बोर्ड एवं शैक्षणिक सत्र',
      subjectLabel: 'विषय',
      chapterLabel: 'अध्याय / इकाई',
      allChapters: 'सभी अध्याय (संपूर्ण पाठ्यक्रम मॉक)',
      difficultyLabel: 'कठिनाई स्तर',
      easy: 'आसान (NCERT प्रत्यक्ष / बुनियादी सूत्र)',
      medium: 'मध्यम (मानक सीबीएसई बोर्ड स्तर)',
      hard: 'कठिन (एग्जेंपलर / HOTS स्तर)',
      mixed: 'मिश्रित (संतुलित बोर्ड वितरण)',
      questionCountLabel: 'प्रश्नों की संख्या',
      typeLabel: 'प्रश्न का प्रारूप',
      typeMcq: 'बहुविकल्पीय प्रश्न (MCQ)',
      typeNumerical: 'संख्यात्मक एवं गणना प्रश्न',
      typeConceptual: 'सैद्धांतिक एवं अवधारणात्मक प्रश्न',
      typeAssertionReason: 'अभिकथन एवं कारण (Assertion & Reason)',
      typeCaseBased: 'केस-आधारित प्रश्न (Case-Based)',
      typeMixed: 'मिश्रित प्रारूप (मानक बोर्ड शैली)',
      modeLabel: 'अभ्यास वातावरण',
      modePractice: 'अभ्यास मोड (Practice)',
      modePracticeDesc: 'तुरंत व्याख्या, समय का कोई दबाव नहीं, अपनी गति से सीखें।',
      modeExam: 'सीबीएसई परीक्षा मोड (Exam Mode)',
      modeExamDesc: 'उलटी गिनती टाइमर, प्रश्न पैलेट, वास्तविक परीक्षा जैसा दबाव।',
      examDurationLabel: 'परीक्षा अवधि',
      examDurationOption10: '10 मिनट (त्वरित खंड टेस्ट)',
      examDurationOption15: '15 मिनट (तीव्र अभ्यास)',
      examDurationOption20: '20 मिनट (मानक 10-प्रश्न)',
      examDurationOption30: '30 मिनट (गहन पुनरीक्षण)',
      examDurationOption45: '45 मिनट (मॉक खंड)',
      examDurationOption60: '60 मिनट (पूर्ण मॉक)',
      examDurationCustom: 'कस्टम अवधि',
      examDurationMinutesUnit: 'मिनट',
      aiToggleLabel: 'AI प्रश्न जनरेटर (Gemini)',
      aiToggleDesc: 'आपके चुने हुए अध्याय और स्तर के अनुसार नए बोर्ड प्रश्न तैयार करता है।',
      curatedBadge: 'प्रमाणित NCERT बोर्ड प्रश्न बैंक',
      startBtn: 'क्विज़ सत्र शुरू करें',
      generatingMsg: 'AI द्वारा सीबीएसई बोर्ड प्रश्न तैयार किए जा रहे हैं...',
      fallbackBtn: 'प्रमाणित प्रश्न बैंक का उपयोग करें',
      cancelBtn: 'रद्द करें',
    },
    quiz: {
      questionLabel: 'प्रश्न',
      of: '/',
      timeRemaining: 'शेष समय',
      practiceModeBadge: 'अभ्यास मोड',
      examModeBadge: 'सीबीएसई परीक्षा मोड',
      simulatedExamBadge: 'सिम्युलेटेड बोर्ड परीक्षा',
      curatedSourceBadge: 'प्रमाणित NCERT प्रश्न',
      aiSourceBadge: 'AI-निर्मित प्रश्न (सत्यापित)',
      flagReview: 'समीक्षा हेतु चिह्नित करें',
      flagged: 'समीक्षा के लिए चिह्नित',
      bookmark: 'बुकमार्क',
      bookmarked: 'बुकमार्क किया गया',
      reportQuestion: 'प्रश्न रिपोर्ट करें',
      reportModalTitle: 'प्रश्न की रिपोर्ट करें',
      reportModalDesc: 'प्रश्न की गुणवत्ता जांच में मदद करें। यह रिपोर्ट आपके डिवाइस पर स्थानीय रूप से सुरक्षित होती है।',
      reportReason1: 'गलत उत्तर',
      reportReason2: 'गलत व्याख्या',
      reportReason3: 'भ्रमित करने वाला प्रश्न',
      reportReason4: 'अन्य',
      reportCommentPlaceholder: 'अतिरिक्त विवरण या सुधार (वैकल्पिक)...',
      reportSubmitBtn: 'रिपोर्ट स्थानीय रूप से सहेजें',
      reportCancelBtn: 'रद्द करें',
      reportNotice: 'सूचना: कोई रिपोर्टिंग बैकएंड नहीं है। यह रिपोर्ट आपके व्यक्तिगत अवलोकन हेतु आपके ब्राउज़र में सुरक्षित की जाती है।',
      reportSavedToast: 'प्रश्न की रिपोर्ट आपके डिवाइस पर सुरक्षित कर ली गई है।',
      clearChoice: 'विकल्प साफ़ करें',
      previous: 'पिछला',
      next: 'अगला',
      submitQuiz: 'परीक्षा सबमिट करें',
      confirmSubmitTitle: 'क्या आप परीक्षा सबमिट करने के लिए तैयार हैं?',
      confirmSubmitDesc:
        'कृपया अंतिम सबमिशन से पहले अपने हल किए गए प्रश्नों के आंकड़े देख लें। उत्तरों का मूल्यांकन केवल प्रमाणित उत्तर कुंजियों द्वारा किया जाता है।',
      warnUnanswered: 'चेतावनी: आपके पास अनुत्तरित प्रश्न हैं। अनुत्तरित प्रश्नों पर 0 अंक मिलेंगे।',
      warnFlagged: 'ध्यान दें: आपके प्रश्न समीक्षा के लिए चिह्नित हैं। कृपया अपने उत्तरों की पुष्टि करें।',
      btnReviewUnanswered: 'अनुत्तरित प्रश्न देखें',
      btnReviewFlagged: 'चिह्नित प्रश्न देखें',
      cancel: 'परीक्षा पर वापस जाएं',
      confirm: 'हाँ, अंतिम सबमिशन करें',
      questionPalette: 'प्रश्न पैलेट',
      paletteAttempted: 'हल किए गए',
      paletteUnattempted: 'अनुत्तरित',
      paletteFlagged: 'समीक्षा हेतु',
      paletteAnsweredReview: 'हल व समीक्षा हेतु',
      filterPaletteAll: 'सभी',
      filterPaletteUnattempted: 'अनुत्तरित',
      filterPaletteReview: 'समीक्षा',
      timeAlert5Min: '⚠️ परीक्षा मोड में केवल 5 मिनट शेष हैं!',
      timeAlert1Min: '⚠️ केवल 1 मिनट शेष! कृपया अपने उत्तरों को अंतिम रूप दें।',
      viewInHindi: 'हिंदी में देखें',
      viewInEnglish: 'View in English',
      officialExplanation: 'प्रमाणित NCERT बोर्ड व्याख्या',
      pitfallWarning: 'सामान्य भूल एवं परीक्षा का जाल',
      boardTip: 'सीबीएसई 2026–27 परीक्षक युक्ति',
      instructionsTitle: 'परीक्षा निर्देश एवं दिशा-निर्देश',
      instructionsSubtitle: 'सीबीएसई कक्षा 12 बोर्ड परीक्षा सिम्युलेटर · सत्र 2026–27',
      instructionsDisclaimer: 'सिम्युलेटेड अभ्यास परीक्षा: NCERT पाठ्यक्रम के आधार पर अवधारणा अभ्यास, समय प्रबंधन एवं आत्म-मूल्यांकन हेतु निर्मित। यह कोई आधिकारिक सीबीएसई बोर्ड प्रश्न पत्र नहीं है।',
      instructionsItemSubject: 'विषय एवं पाठ्यक्रम',
      instructionsItemDuration: 'निर्धारित समय',
      instructionsItemTotalQuestions: 'कुल प्रश्न',
      instructionsItemMarking: 'अंकन योजना',
      instructionsItemMarkingDesc: 'प्रत्येक सही उत्तर के लिए +1 अंक, अनुत्तरित या गलत उत्तर के लिए 0 अंक। पूर्णतः प्रमाणित उत्तर कुंजियों से गणना।',
      instructionsItemRulesTitle: 'निर्देश एवं नेविगेशन नियम',
      instructionsRuleTimer: 'उलटी गिनती टाइमर: "परीक्षा शुरू करें" पर क्लिक करते ही समय शुरू हो जाएगा। 5 मिनट और 1 मिनट शेष रहने पर चेतावनी दिखेगी। समय समाप्त होने पर स्वतः सबमिशन होगा।',
      instructionsRuleNav: 'स्वतंत्र प्रश्न नेविगेशन: अगले/पिछले बटन, कीबोर्ड शॉर्टकट (← / →, P / N) अथवा प्रश्न पैलेट से किसी भी प्रश्न पर सीधे पहुँचें।',
      instructionsRuleSave: 'उत्तर संरक्षण: आपके चुने हुए उत्तर तुरंत ब्राउज़र में सुरक्षित हो जाते हैं और नेविगेशन या पेज रीलोड होने पर भी सुरक्षित रहते हैं।',
      instructionsRuleReview: 'समीक्षा हेतु चिह्नित करें: अनिश्चित प्रश्नों को "समीक्षा हेतु चिह्नित करें" या शॉर्टकट "F" से फ्लैग करें ताकि सबमिशन से पहले पुनः जांच सकें।',
      instructionsRulePalette: 'पैलेट स्थिति: हल किए गए (हरा), अनुत्तरित (धूसर), समीक्षा हेतु (अंबर), हल व समीक्षा हेतु (बैंगनी)।',
      instructionsRuleSubmit: 'सबमिशन सुरक्षा: अंतिम सबमिशन से पूर्व एक सारांश आपको अनुत्तरित या समीक्षा वाले प्रश्नों के प्रति सचेत करेगा।',
      instructionsRuleIntegrity: 'उत्तर कुंजी: परिणाम बिना किसी अनुमान के पूरी तरह से सत्यापित NCERT उत्तर कुंजियों द्वारा तय होते हैं।',
      instructionsAcknowledge: 'मैंने परीक्षा के सभी नियमों एवं निर्देशों को पढ़ व समझ लिया है।',
      instructionsStartBtn: 'परीक्षा अभी शुरू करें',
      instructionsBackBtn: 'सेटिंग्स पर वापस',
    },
    results: {
      title: 'परीक्षा प्रदर्शन निदान',
      subtitle: 'विस्तृत सटीकता विश्लेषण एवं कमज़ोर टॉपिक रिपोर्ट',
      backToDashboard: 'डैशबोर्ड पर वापस जाएं',
      scoreLabel: 'अंतिम प्राप्तांक',
      accuracyLabel: 'सटीकता',
      timeSpent: 'लगा समय',
      attemptedCount: 'हल किए गए प्रश्न',
      unansweredCount: 'अनुत्तरित',
      correctCount: 'सही',
      incorrectCount: 'गलत',
      avgTimePerQuestion: 'औसत गति',
      simulatedExamNotice: 'सीबीएसई कक्षा 12 सिम्युलेटेड अभ्यास परीक्षा: प्रमाणित उत्तर कुंजियों से मूल्यांकित। आधिकारिक बोर्ड परीक्षाएं ऑफलाइन पेन-पेपर पर आयोजित होती हैं।',
      gradeGreat: 'उत्कृष्ट प्रदर्शन! पाठ्यक्रम पर आपका मजबूत नियंत्रण है।',
      gradeGood: 'अच्छा प्रयास! कुछ विषयों पर लक्षित दोहराव की आवश्यकता है।',
      gradeNeedsWork: 'अभ्यास की आवश्यकता है। अवधारणाओं को समझने के लिए मिस्टेक डिटेक्टिव का उपयोग करें।',
      retakeBtn: 'पुनः परीक्षा दें',
      radarHeading: 'इस प्रयास का कमज़ोर टॉपिक रडार',
      radarSub: 'आधिकारिक सीबीएसई सूत्र द्वारा निकाला गया टॉपिक-वार निदान।',
      strongTopicsTitle: 'मजबूत विषय (>75% सटीकता)',
      practiseTopicsTitle: 'अभ्यास योग्य विषय (50%–75% सटीकता)',
      weakTopicsTitle: 'अधिक ध्यान देने योग्य विषय (<50% सटीकता)',
      notEnoughData: 'अपर्याप्त डेटा',
      filterAll: 'सभी प्रश्न',
      filterIncorrect: 'केवल गलत उत्तर',
      filterUnanswered: 'केवल अनुत्तरित प्रश्न',
      filterFlagged: 'समीक्षा हेतु चिह्नित प्रश्न',
      analyzeMistakeBtn: 'मिस्टेक डिटेक्टिव',
      solutionSteps: 'चरण-दर-चरण हल',
      commonPitfall: 'परीक्षा का जाल',
      boardTip: 'अंक प्राप्ति युक्ति',
    },
    radar: {
      pageTitle: 'कमज़ोर टॉपिक रडार डैशबोर्ड',
      pageSubtitle: 'सीबीएसई कक्षा 12 समग्र प्रदर्शन विश्लेषण एवं अनुकूलित अभ्यास',
      newQuizBtn: 'नया अभ्यास क्विज़',
      formulaTitle: 'टॉपिक प्रदर्शन सूत्र',
      formulaText: 'टॉपिक सटीकता = (सही उत्तर / हल किए गए प्रश्न) × 100',
      categoryStrong: 'मजबूत विषय',
      categoryPractise: 'अभ्यास योग्य विषय',
      categoryWeak: 'अधिक ध्यान देने योग्य विषय',
      statusStrong: 'मजबूत',
      statusPractise: 'अभ्यास योग्य',
      statusWeak: 'अधिक ध्यान आवश्यक',
      statusNoData: 'अपर्याप्त डेटा',
      actionStrong: 'उत्तम पकड़! समय-समय पर संक्षिप्त दोहराव करते रहें।',
      actionPractise: 'अच्छा आधार है। मुख्य सूत्र दोहराएं और 5 लक्षित प्रश्न हल करें।',
      actionWeak: 'अत्यंत महत्वपूर्ण! NCERT सिद्धांत पढ़ें और मिस्टेक डिटेक्टिव से जालों को समझें।',
      actionNoData: 'इस टॉपिक पर अभी कोई प्रश्न हल नहीं किया गया। जांच हेतु क्विज़ शुरू करें।',
      tableTopic: 'टॉपिक का नाम',
      tableSubject: 'विषय',
      tableAttempted: 'हल किए',
      tableCorrect: 'सही उत्तर',
      tableAccuracy: 'सटीकता',
      tableStatus: 'स्थिति',
      tableAction: 'सुझाई गई अगली कार्रवाई',
      practiceAllWeakBtn: 'कमज़ोर टॉपिक्स का अभ्यास करें',
      targetDrillBtn: 'लक्षित अभ्यास',
      emptyRadar: 'अभी तक कोई क्विज़ रिकॉर्ड नहीं है। कमज़ोर टॉपिक रडार सक्रिय करने के लिए क्विज़ दें!',
      exportData: 'प्रगति डेटा डाउनलोड करें (JSON)',
      resetData: 'स्थानीय डेटा रीसेट करें',
      resetConfirm: 'क्या आप अपने सभी सुरक्षित क्विज़ परिणाम और विश्लेषण रीसेट करना चाहते हैं?',
    },
    mistake: {
      title: 'मिस्टेक डिटेक्टिव विश्लेषण',
      subtitle: 'NCERT अवधारणा परीक्षण एवं परीक्षा जाल का निवारण',
      coreConcept: 'मूल अवधारणा',
      whyCorrect: 'सही विकल्प क्यों सही है',
      whySelectedWrong: 'सामान्य भूल / आपका चुना हुआ विकल्प क्यों गलत था',
      memoryAnchor: 'स्मरण सूत्र एवं परीक्षा युक्ति',
      followUpTitle: 'लक्षित अवधारणा पुष्टि प्रश्न',
      followUpDesc: 'अपनी समझ को पक्का करने के लिए इस 1-मिनट के अनुवर्ती प्रश्न को हल करें।',
      askTeacher: 'मिस्टेक डिटेक्टिव से कोई सवाल पूछें',
      askPlaceholder: 'उदा. चरण 2 में चिह्न क्यों बदल गया?',
      askBtn: 'AI शिक्षक से पूछें',
      analyzing: 'AI द्वारा गलती का विस्तृत विश्लेषण किया जा रहा है...',
      closeBtn: 'विश्लेषण बंद करें',
    },
    tutor: {
      pageTitle: 'AI पर्सनल ट्यूटर',
      pageSubtitle: 'गणित, भौतिकी एवं रसायन विज्ञान हेतु सीबीएसई कक्षा 12 का 24/7 शैक्षणिक मार्गदर्शक',
      kicker: 'सीबीएसई कक्षा 12 · शैक्षणिक सत्र 2026–27',
      subjectLabel: 'विषय चुनें',
      mathsOption: 'गणित (041)',
      physicsOption: 'भौतिक विज्ञान (042)',
      chemistryOption: 'रसायन विज्ञान (043)',
      inputPlaceholder: 'कक्षा 12 का कोई भी प्रश्न या संदेह पूछें (उदा. खंडशः समाकलन समझाइए, लेन्ज़ का नियम निगमन, ऐल्डोल संघनन क्रियाविधि)...',
      sendBtn: 'ट्यूटर से पूछें',
      uploadPhotoBtn: 'प्रश्न की फोटो जोड़ें',
      removePhotoBtn: 'फोटो हटाएं',
      actionExplainSimply: 'सरल भाषा में समझाएं',
      actionAnotherExample: 'अन्य उदाहरण दें',
      actionExplainFormula: 'सूत्र स्पष्ट करें',
      actionSummarize: 'संक्षेप में बताएं',
      actionCopy: 'उत्तर कॉपी करें',
      actionCopied: 'कॉपी हो गया!',
      actionSaveDoubt: 'संदेह सहेजें',
      actionDoubtSaved: 'संदेह सुरक्षित!',
      clearChatBtn: 'बातचीत साफ़ करें',
      loadingTitle: 'सीबीएसई कक्षा 12 अवधारणा का विश्लेषण हो रहा है...',
      loadingStep1: 'NCERT सिद्धांत एवं समीकरणों की समीक्षा...',
      loadingStep2: 'चरणबद्ध विस्तृत समाधान तैयार किया जा रहा है...',
      followUpPlaceholder: 'इस विषय पर अगला प्रश्न या स्पष्टीकरण पूछें...',
      suggestedHeading: 'महत्वपूर्ण बोर्ड संदेह एवं अभ्यास प्रश्न',
      mathsSample1: 'तुल्यता संबंध (Equivalence Relation) की जांच कैसे करें?',
      mathsSample2: 'ILATE नियम के साथ खंडशः समाकलन (Integration by Parts) का चरणबद्ध तरीका',
      physicsSample1: 'गाउस का नियम समझाइए और अनंत समतल चादर के कारण विद्युत क्षेत्र निकालिए',
      physicsSample2: 'एक लंबी धारावाही परिनालिका के भीतर चुंबकीय क्षेत्र का निगमन करें',
      chemSample1: 'ऐल्डोल संघनन की क्रियाविधि और आवश्यक शर्तें समझाइए',
      chemSample2: 'गैर-मानक परिस्थितियों में सेल वि.वा.बल की गणना हेतु नर्नस्ट समीकरण कैसे लगाएं?',
      savedDoubtsTab: 'सहेजे गए संदेह एवं नोट्स',
      chatTab: 'लाइव ट्यूटर सत्र',
      noSavedDoubtsTitle: 'अभी तक कोई संदेह सहेजा नहीं गया',
      noSavedDoubtsDesc: 'जब आप AI ट्यूटर से प्रश्न पूछें, तो मुख्य व्याख्याओं को दोहराव हेतु सुरक्षित करने के लिए "संदेह सहेजें" पर क्लिक करें।',
      disclaimer: 'सभी व्याख्याएं NCERT सीबीएसई कक्षा 12 पाठ्यक्रम के अनुरूप हैं। आधिकारिक मूल्यांकन के लिए सीबीएसई मार्किंग स्कीम देखें।',
    },
  },
};

export const SUBJECT_TRANSLATIONS: Record<string, { nameEn: string; nameHi: string; code: string }> = {
  mathematics: { nameEn: 'Mathematics', nameHi: 'गणित', code: '041' },
  physics: { nameEn: 'Physics', nameHi: 'भौतिक विज्ञान', code: '042' },
  chemistry: { nameEn: 'Chemistry', nameHi: 'रसायन विज्ञान', code: '043' },
};

export const CHAPTER_TRANSLATIONS: Record<string, string> = {
  // Mathematics
  'Relations and Functions': 'संबंध एवं फलन',
  'Inverse Trigonometric Functions': 'प्रतिलोम त्रिकोणमितीय फलन',
  'Matrices': 'आव्यूह',
  'Determinants': 'सारणिक',
  'Continuity and Differentiability': 'सांतत्य तथा अवकलनीयता',
  'Application of Derivatives': 'अवकलज के अनुप्रयोग',
  'Integrals': 'समाकलन',
  'Application of Integrals': 'समाकलनों के अनुप्रयोग',
  'Differential Equations': 'अवकल समीकरण',
  'Vectors': 'सदिश बीजगणित',
  'Three-Dimensional Geometry': 'त्रिविमीय ज्यामिति',
  'Linear Programming': 'रैखिक प्रोग्रामन',
  'Probability': 'प्रायिकता',

  // Physics
  'Electric Charges and Fields': 'विद्युत आवेश तथा क्षेत्र',
  'Electrostatic Potential and Capacitance': 'स्थिरवैद्युत विभव तथा धारिता',
  'Current Electricity': 'विद्युत धारा',
  'Moving Charges and Magnetism': 'गतिमान आवेश और चुंबकत्व',
  'Magnetism and Matter': 'चुंबकत्व एवं द्रव्य',
  'Electromagnetic Induction': 'वैद्युतचुंबकीय प्रेरण',
  'Alternating Current': 'प्रत्यावर्ती धारा',
  'Electromagnetic Waves': 'वैद्युतचुंबकीय तरंगें',
  'Ray Optics and Optical Instruments': 'किरण प्रकाशिकी एवं प्रकाशिक यंत्र',
  'Wave Optics': 'तरंग प्रकाशिकी',
  'Dual Nature of Radiation and Matter': 'विकिरण तथा द्रव्य की द्वैत प्रकृति',
  'Atoms': 'परमाणु',
  'Nuclei': 'नाभिक',
  'Semiconductor Electronics: Materials, Devices and Simple Circuits': 'अर्धचालक इलेक्ट्रॉनिकी: पदार्थ, युक्तियाँ तथा सरल परिपथ',
  'Semiconductor Electronics': 'अर्धचालक इलेक्ट्रॉनिकी',

  // Chemistry
  'Solutions': 'विलयन',
  'Electrochemistry': 'वैद्युतरसायन',
  'Chemical Kinetics': 'रासायनिक बलगतिकी',
  'The d- and f-Block Elements': 'd एवं f ब्लॉक के तत्व',
  'd and f Block Elements': 'd एवं f ब्लॉक के तत्व',
  'Coordination Compounds': 'उपसहसंयोजन यौगिक',
  'Haloalkanes and Haloarenes': 'हैलोऐल्केन तथा हैलोऐरीन',
  'Alcohols, Phenols and Ethers': 'ऐल्कोहॉल, फ़ीनॉल एवं ईथर',
  'Aldehydes, Ketones and Carboxylic Acids': 'ऐल्डिहाइड, कीटोन एवं कार्बोक्सिलिक अम्ल',
  'Amines': 'ऐमीन',
  'Biomolecules': 'जैव-अणु',
};
