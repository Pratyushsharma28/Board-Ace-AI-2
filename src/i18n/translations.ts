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
    flagReview: string;
    flagged: string;
    clearChoice: string;
    previous: string;
    next: string;
    submitQuiz: string;
    confirmSubmitTitle: string;
    confirmSubmitDesc: string;
    cancel: string;
    confirm: string;
    questionPalette: string;
    paletteAttempted: string;
    paletteUnattempted: string;
    paletteFlagged: string;
    timeAlert5Min: string;
    timeAlert1Min: string;
    viewInHindi: string;
    viewInEnglish: string;
    officialExplanation: string;
    pitfallWarning: string;
    boardTip: string;
  };
  results: {
    title: string;
    subtitle: string;
    backToDashboard: string;
    scoreLabel: string;
    accuracyLabel: string;
    timeSpent: string;
    attemptedCount: string;
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
      flagReview: 'Mark for Review',
      flagged: 'Flagged for Review',
      clearChoice: 'Clear Choice',
      previous: 'Previous',
      next: 'Next',
      submitQuiz: 'Submit Quiz',
      confirmSubmitTitle: 'Ready to Submit Your Quiz?',
      confirmSubmitDesc:
        'You have answered all or part of your questions. Would you like to finish and view your detailed performance breakdown?',
      cancel: 'Return to Quiz',
      confirm: 'Yes, Submit Test',
      questionPalette: 'Question Palette',
      paletteAttempted: 'Attempted',
      paletteUnattempted: 'Unattempted',
      paletteFlagged: 'Flagged',
      timeAlert5Min: '⚠️ 5 Minutes Remaining in Exam Mode!',
      timeAlert1Min: '⚠️ 1 Minute Remaining! Please finalize your answers.',
      viewInHindi: 'हिंदी में देखें',
      viewInEnglish: 'View in English',
      officialExplanation: 'Verified NCERT Board Explanation',
      pitfallWarning: 'Common Trap & Misconception',
      boardTip: 'CBSE Examiner Tip for 2026–27',
    },
    results: {
      title: 'Exam Performance Diagnostic',
      subtitle: 'Comprehensive accuracy analysis & Weak Topic breakdown',
      backToDashboard: 'Back to Dashboard',
      scoreLabel: 'Final Score',
      accuracyLabel: 'Accuracy',
      timeSpent: 'Time Spent',
      attemptedCount: 'Attempted',
      gradeGreat: 'Outstanding! Excellent command of the syllabus.',
      gradeGood: 'Good attempt! A few concepts need targeted revision.',
      gradeNeedsWork: 'Needs Practice. Use Mistake Detective to address conceptual gaps.',
      retakeBtn: 'Retake Quiz',
      radarHeading: 'Weak Topic Radar for this Attempt',
      radarSub: 'Topic-level diagnostic computed using official CBSE formula.',
      strongTopicsTitle: 'Strong Topics (>75% Accuracy)',
      practiseTopicsTitle: 'Topics to Practise (50%–75% Accuracy)',
      weakTopicsTitle: 'Topics Needing Attention (<50% Accuracy)',
      notEnoughData: 'Not enough data',
      filterAll: 'All Questions',
      filterIncorrect: 'Mistakes Only',
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
      flagReview: 'समीक्षा हेतु चिह्नित करें',
      flagged: 'समीक्षा के लिए चिह्नित',
      clearChoice: 'विकल्प साफ़ करें',
      previous: 'पिछला',
      next: 'अगला',
      submitQuiz: 'क्विज़ सबमिट करें',
      confirmSubmitTitle: 'क्या आप क्विज़ सबमिट करने के लिए तैयार हैं?',
      confirmSubmitDesc:
        'आप अपने प्रश्नों को पूरा या आंशिक रूप से हल कर चुके हैं। क्या आप समाप्त करके अपना विस्तृत परिणाम देखना चाहते हैं?',
      cancel: 'क्विज़ पर वापस जाएं',
      confirm: 'हाँ, टेस्ट सबमिट करें',
      questionPalette: 'प्रश्न पैलेट',
      paletteAttempted: 'हल किए गए',
      paletteUnattempted: 'शेष प्रश्न',
      paletteFlagged: 'समीक्षा हेतु',
      timeAlert5Min: '⚠️ परीक्षा मोड में केवल 5 मिनट शेष हैं!',
      timeAlert1Min: '⚠️ केवल 1 मिनट शेष! कृपया अपने उत्तरों को अंतिम रूप दें।',
      viewInHindi: 'हिंदी में देखें',
      viewInEnglish: 'View in English',
      officialExplanation: 'प्रमाणित NCERT बोर्ड व्याख्या',
      pitfallWarning: 'सामान्य भूल एवं परीक्षा का जाल',
      boardTip: 'सीबीएसई 2026–27 परीक्षक युक्ति',
    },
    results: {
      title: 'परीक्षा प्रदर्शन निदान',
      subtitle: 'विस्तृत सटीकता विश्लेषण एवं कमज़ोर टॉपिक रिपोर्ट',
      backToDashboard: 'डैशबोर्ड पर वापस जाएं',
      scoreLabel: 'अंतिम प्राप्तांक',
      accuracyLabel: 'सटीकता',
      timeSpent: 'लगा समय',
      attemptedCount: 'हल किए गए प्रश्न',
      gradeGreat: 'उत्कृष्ट प्रदर्शन! पाठ्यक्रम पर आपका मजबूत नियंत्रण है।',
      gradeGood: 'अच्छा प्रयास! कुछ विषयों पर लक्षित दोहराव की आवश्यकता है।',
      gradeNeedsWork: 'अभ्यास की आवश्यकता है। अवधारणाओं को समझने के लिए मिस्टेक डिटेक्टिव का उपयोग करें।',
      retakeBtn: 'पुनः प्रयास करें',
      radarHeading: 'इस प्रयास का कमज़ोर टॉपिक रडार',
      radarSub: 'आधिकारिक सीबीएसई सूत्र द्वारा निकाला गया टॉपिक-वार निदान।',
      strongTopicsTitle: 'मजबूत विषय (>75% सटीकता)',
      practiseTopicsTitle: 'अभ्यास योग्य विषय (50%–75% सटीकता)',
      weakTopicsTitle: 'अधिक ध्यान देने योग्य विषय (<50% सटीकता)',
      notEnoughData: 'अपर्याप्त डेटा',
      filterAll: 'सभी प्रश्न',
      filterIncorrect: 'केवल गलत उत्तर',
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
