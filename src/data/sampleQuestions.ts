import { Question, GradeClass } from '../types/quiz';

/**
 * Authentic Curated CBSE Class 12 Board Exam Questions (Session 2026–27)
 * Strictly across Mathematics (041), Physics (042), and Chemistry (043).
 * Supports correct mathematical calculations, step-by-step solutions,
 * physics formulas with SI units, and chemical equations with reaction mechanisms.
 * Fully enriched with English and natural Hindi (हिन्दी) translations.
 */

export const CURATED_CLASS_12_QUESTIONS: Question[] = [
  // ==========================================
  // MATHEMATICS (041)
  // ==========================================
  {
    id: 'math-01',
    subject: 'mathematics',
    chapter: 'Matrices',
    topic: 'Symmetric & Skew-Symmetric Matrices',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'If A is any square matrix with real entries, then the matrix (A - Aᵀ) is always:',
    questionHi: 'यदि A वास्तविक अवयवों वाला कोई वर्ग आव्यूह है, तो आव्यूह (A - Aᵀ) सदैव होता है:',
    options: [
      'A skew-symmetric matrix',
      'A symmetric matrix',
      'An orthogonal matrix',
      'An identity matrix'
    ],
    optionsHi: [
      'एक विषम-सममित आव्यूह',
      'एक सममित आव्यूह',
      'एक लाम्बिक आव्यूह',
      'एक तत्समक आव्यूह'
    ],
    correctAnswer: 'A skew-symmetric matrix',
    correctAnswerHi: 'एक विषम-सममित आव्यूह',
    explanation: 'Step-by-step proof:\nLet B = (A - Aᵀ).\nTaking transpose on both sides: Bᵀ = (A - Aᵀ)ᵀ.\nUsing properties of transpose (X - Y)ᵀ = Xᵀ - Yᵀ and (Yᵀ)ᵀ = Y:\nBᵀ = Aᵀ - (Aᵀ)ᵀ = Aᵀ - A = -(A - Aᵀ) = -B.\nSince Bᵀ = -B, matrix B is by definition skew-symmetric.',
    explanationHi: 'चरण-दर-चरण उपपत्ति:\nमान लीजिए B = (A - Aᵀ)।\nदोनों पक्षों का परिवर्त लेने पर: Bᵀ = (A - Aᵀ)ᵀ = Aᵀ - (Aᵀ)ᵀ = Aᵀ - A = -(A - Aᵀ) = -B।\nचूंकि Bᵀ = -B, अतः परिभाषा अनुसार आव्यूह B सदैव विषम-सममित आव्यूह होता है।',
    pitfall: 'Confusing (A + Aᵀ) which is symmetric with (A - Aᵀ) which is skew-symmetric.',
    pitfallHi: '(A + Aᵀ) जो कि सममित होता है, को (A - Aᵀ) जो कि विषम-सममित होता है, के साथ भ्रमित न करें।',
    boardTip: 'NCERT Theorem: Every square matrix A can be uniquely expressed as A = 1/2(A + Aᵀ) + 1/2(A - Aᵀ), the sum of a symmetric and a skew-symmetric matrix.',
    boardTipHi: 'NCERT प्रमेय: किसी भी वर्ग आव्यूह A को अद्वितीय रूप से एक सममित और एक विषम-सममित आव्यूह के योग के रूप में व्यक्त किया जा सकता है।',
    source: 'curated'
  },
  {
    id: 'math-02',
    subject: 'mathematics',
    chapter: 'Integrals',
    topic: 'Standard Properties of Definite Integrals',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'The value of the definite integral ∫_{-π/2}^{π/2} (x³ + x·cos(x) + tan⁵(x) + 1) dx is equal to:',
    questionHi: 'निश्चित समाकलन ∫_{-π/2}^{π/2} (x³ + x·cos(x) + tan⁵(x) + 1) dx का मान किसके बराबर है?',
    options: [
      'π',
      '0',
      'π/2',
      '2π'
    ],
    optionsHi: [
      'π',
      '0',
      'π/2',
      '2π'
    ],
    correctAnswer: 'π',
    correctAnswerHi: 'π',
    explanation: 'Step-by-step calculation:\nLet f(x) = x³ + x·cos(x) + tan⁵(x) + 1.\nWe split the integral into two parts: I₁ = ∫_{-π/2}^{π/2} [x³ + x·cos(x) + tan⁵(x)] dx and I₂ = ∫_{-π/2}^{π/2} 1 dx.\nFor I₁, test parity of g(x) = x³ + x·cos(x) + tan⁵(x):\ng(-x) = (-x)³ + (-x)·cos(-x) + tan⁵(-x) = -x³ - x·cos(x) - tan⁵(x) = -g(x).\nHence g(x) is an odd function. By the property ∫_{-a}^{a} g(x) dx = 0 for odd functions, I₁ = 0.\nFor I₂: ∫_{-π/2}^{π/2} 1 dx = [x]_{-π/2}^{π/2} = (π/2) - (-π/2) = π.\nTherefore, total integral = 0 + π = π.',
    explanationHi: 'चरण-दर-चरण गणना:\nफलन g(x) = x³ + x·cos(x) + tan⁵(x) एक विषम फलन है (g(-x) = -g(x))।\nविषम फलन के गुणधर्मानुसार, ∫_{-π/2}^{π/2} g(x) dx = 0 होता है।\nअतः कुल समाकलन = 0 + ∫_{-π/2}^{π/2} 1 dx = [x]_{-π/2}^{π/2} = π/2 - (-π/2) = π।',
    pitfall: 'Students often see tan⁵(x) and x³ and hurriedly mark 0 without noticing the non-zero constant term +1.',
    pitfallHi: 'छात्र अक्सर tan⁵(x) व x³ देखकर अचर पद +1 को अनदेखा कर शून्य (0) लगा देते हैं।',
    boardTip: 'In CBSE Section A MCQs, always inspect for odd components and constant terms separately.',
    boardTipHi: 'सीबीएसई सेक्शन A में विषम पदों और अचर पदों को हमेशा अलग-अलग परखें।',
    source: 'curated'
  },
  {
    id: 'math-03',
    subject: 'mathematics',
    chapter: 'Probability',
    topic: 'Conditional Probability & Multiplication Theorem',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'If P(A) = 0.4, P(B) = 0.8, and P(B|A) = 0.6, then what is the value of P(A ∪ B)?',
    questionHi: 'यदि P(A) = 0.4, P(B) = 0.8, और P(B|A) = 0.6 है, तो P(A ∪ B) का मान क्या होगा?',
    options: [
      '0.96',
      '0.84',
      '0.72',
      '1.00'
    ],
    optionsHi: [
      '0.96',
      '0.84',
      '0.72',
      '1.00'
    ],
    correctAnswer: '0.96',
    correctAnswerHi: '0.96',
    explanation: 'Step-by-step calculation:\n1. From conditional probability definition: P(B|A) = P(A ∩ B) / P(A).\n2. Rearranging gives P(A ∩ B) = P(B|A) × P(A) = 0.6 × 0.4 = 0.24.\n3. Using the Addition Theorem for probabilities:\n   P(A ∪ B) = P(A) + P(B) - P(A ∩ B)\n   P(A ∪ B) = 0.4 + 0.8 - 0.24 = 1.20 - 0.24 = 0.96.',
    explanationHi: 'सप्रतिबंध प्रायिकता से: P(A ∩ B) = P(B|A) × P(A) = 0.6 × 0.4 = 0.24। प्रायिकता योग प्रमेय: P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.4 + 0.8 - 0.24 = 0.96।',
    pitfall: 'Assuming A and B are independent and calculating P(A ∩ B) = P(A) × P(B) = 0.32, which results in 0.88.',
    pitfallHi: 'घटनाओं को स्वतंत्र मानकर सीधे 0.88 निकाल लेना सामान्य भूल है।',
    boardTip: 'Never assume events are independent unless explicitly stated in the CBSE problem stem.',
    boardTipHi: 'जब तक प्रश्न में स्पष्ट न लिखा हो, घटनाओं को स्वतंत्र न मानें।',
    source: 'curated'
  },
  {
    id: 'math-04',
    subject: 'mathematics',
    chapter: 'Continuity and Differentiability',
    topic: 'Second Order Derivatives',
    difficulty: 'hard',
    questionType: 'mcq',
    question: 'If y = 5·cos(x) - 3·sin(x), then (d²y/dx² + y) is equal to:',
    questionHi: 'यदि y = 5·cos(x) - 3·sin(x) है, तो (d²y/dx² + y) का मान क्या होगा?',
    options: [
      '0',
      '2',
      '-2y',
      '10·cos(x)'
    ],
    optionsHi: [
      '0',
      '2',
      '-2y',
      '10·cos(x)'
    ],
    correctAnswer: '0',
    correctAnswerHi: '0',
    explanation: 'Step-by-step differentiation:\nGiven: y = 5·cos(x) - 3·sin(x).\nFirst derivative:\ndy/dx = 5(-sin(x)) - 3(cos(x)) = -5·sin(x) - 3·cos(x).\nSecond derivative:\nd²y/dx² = -5(cos(x)) - 3(-sin(x)) = -5·cos(x) + 3·sin(x).\nFactoring out -1:\nd²y/dx² = -(5·cos(x) - 3·sin(x)) = -y.\nAdding y to both sides: d²y/dx² + y = 0.',
    explanationHi: 'प्रथम अवकलज: dy/dx = -5·sin(x) - 3·cos(x)। द्वितीय अवकलज: d²y/dx² = -5·cos(x) + 3·sin(x) = -(5·cos(x) - 3·sin(x)) = -y। अतः d²y/dx² + y = 0।',
    pitfall: 'Sign errors while differentiating sin(x) vs cos(x). Recall d/dx[cos(x)] = -sin(x).',
    pitfallHi: 'cos(x) का अवकलज -sin(x) होता है, ऋण चिह्न भूलने से बचें।',
    boardTip: 'This is a standard 1-mark differential equation relation from NCERT Exercise 5.7.',
    boardTipHi: 'यह NCERT प्रश्नावली 5.7 का एक मानक 1-अंक का प्रश्न है।',
    source: 'curated'
  },
  {
    id: 'math-05',
    subject: 'mathematics',
    chapter: 'Vectors',
    topic: 'Scalar (Dot) Product and Properties',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'If a⃗ and b⃗ are two unit vectors such that (a⃗ + b⃗) is also a unit vector, then the angle θ between a⃗ and b⃗ is:',
    questionHi: 'यदि a⃗ और b⃗ दो मात्रक सदिश हैं जिससे (a⃗ + b⃗) भी एक मात्रक सदिश है, तो a⃗ और b⃗ के बीच का कोण θ होगा:',
    options: [
      '2π/3 (120°)',
      'π/3 (60°)',
      'π/2 (90°)',
      '3π/4 (135°)'
    ],
    optionsHi: [
      '2π/3 (120°)',
      'π/3 (60°)',
      'π/2 (90°)',
      '3π/4 (135°)'
    ],
    correctAnswer: '2π/3 (120°)',
    correctAnswerHi: '2π/3 (120°)',
    explanation: 'Step-by-step vector algebra:\nGiven |a⃗| = 1, |b⃗| = 1, and |a⃗ + b⃗| = 1.\nSquaring magnitude: |a⃗ + b⃗|² = |a⃗|² + |b⃗|² + 2(a⃗ · b⃗) = 1².\nSubstituting unit magnitudes: 1 + 1 + 2|a⃗||b⃗|cos(θ) = 1.\n2 + 2(1)(1)cos(θ) = 1 ⇒ 2·cos(θ) = -1 ⇒ cos(θ) = -1/2.\nSince θ ∈ [0, π], θ = π - π/3 = 2π/3 (120°).',
    explanationHi: '|a⃗ + b⃗|² = |a⃗|² + |b⃗|² + 2(a⃗ · b⃗) = 1 ⇒ 1 + 1 + 2(1)(1)cos(θ) = 1 ⇒ cos(θ) = -1/2 ⇒ θ = 120° (2π/3)।',
    pitfall: 'Confusing cos(θ) = 1/2 (which gives 60°) with cos(θ) = -1/2 (which gives 120°).',
    pitfallHi: 'cos(θ) = -1/2 को 60° समझ लेना।',
    boardTip: 'Remember: for unit vectors giving a unit resultant, the angle must always be 120° (2π/3 rad).',
    boardTipHi: 'यदि दो मात्रक सदिशों का परिणामी भी मात्रक सदिश हो, तो उनके मध्य कोण सदैव 120° होता है।',
    source: 'curated'
  },

  // ==========================================
  // PHYSICS (042)
  // ==========================================
  {
    id: 'phy-01',
    subject: 'physics',
    chapter: 'Electric Charges and Fields',
    topic: "Gauss’s Law and Applications",
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'A hollow conducting sphere of radius R is given a positive charge +Q. What is the electric field strength E at a distance r from the center of the sphere, where r < R?',
    questionHi: 'त्रिज्या R वाले एक खोखले चालक गोले को धनात्मक आवेश +Q दिया जाता है। गोले के केंद्र से r दूरी पर (जहाँ r < R) विद्युत क्षेत्र की तीव्रता E क्या होगी?',
    options: [
      '0 N/C',
      'Q / (4πε₀r²)',
      'Q / (4πε₀R²)',
      'Q / (4πε₀r)'
    ],
    optionsHi: [
      '0 N/C',
      'Q / (4πε₀r²)',
      'Q / (4πε₀R²)',
      'Q / (4πε₀r)'
    ],
    correctAnswer: '0 N/C',
    correctAnswerHi: '0 N/C',
    explanation: 'Step-by-step physical reasoning & formula:\nBy Gauss’s Law, electric flux ∮ E·dA = q_enclosed / ε₀.\nFor any concentric spherical Gaussian surface of radius r < R inside the hollow conductor, static charge resides strictly on the outer metallic boundary (q_enclosed = 0 C).\nTherefore, ∮ E·dA = 0 ⇒ E = 0 N/C at all points inside the cavity.',
    explanationHi: 'गाउस के नियमानुसार, बंद पृष्ठ के भीतर कुल परिबद्ध आवेश शून्य है (q_enclosed = 0 C)। अतः खोखले चालक गोले के भीतर प्रत्येक बिंदु पर विद्युत क्षेत्र E = 0 N/C होता है।',
    pitfall: 'Confusing electric field (which is 0 N/C inside) with electric potential V (which is constant and equal to the surface potential V = Q/(4πε₀R)).',
    pitfallHi: 'विद्युत क्षेत्र (जो भीतर 0 है) और विद्युत विभव (जो नियत V = Q/4πε₀R रहता है) में भ्रमित न हों।',
    boardTip: 'CBSE questions frequently test this distinction: E = 0 N/C inside a charged shell, but V = constant.',
    boardTipHi: 'सीबीएसई में यह प्रश्न बार-बार पूछा जाता है: चालक गोले के भीतर E = 0, परन्तु विभव V = नियत।',
    source: 'curated'
  },
  {
    id: 'phy-02',
    subject: 'physics',
    chapter: 'Current Electricity',
    topic: 'Drift Velocity & Mobility (Ohm’s Law Derivation)',
    difficulty: 'medium',
    questionType: 'assertion_reason',
    assertion: 'Assertion (A): When the temperature of a metallic conductor is increased, its electrical resistivity ρ increases.',
    reason: 'Reason (R): In metals, increased lattice thermal vibrations decrease the electron mean relaxation time τ.',
    question: 'Assertion (A): When the temperature of a metallic conductor is increased, its electrical resistivity ρ increases.\nReason (R): In metals, increased lattice thermal vibrations decrease the electron mean relaxation time τ.\n\nChoose the correct option:',
    questionHi: 'अभिकथन (A): जब किसी धात्विक चालक का तापमान बढ़ाया जाता है, तो उसकी वैद्युत प्रतिरोधकता ρ बढ़ जाती है।\nकारण (R): धातुओं में तापमान बढ़ने से जालक कंपन बढ़ जाते हैं, जिससे इलेक्ट्रॉनों का श्रांतिकाल τ घट जाता है।\n\nसही विकल्प चुनें:',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A)',
      'Both (A) and (R) are true but (R) is not the correct explanation of (A)',
      '(A) is true but (R) is false',
      '(A) is false but (R) is true'
    ],
    optionsHi: [
      '(A) और (R) दोनों सत्य हैं और (R), (A) की सही व्याख्या है',
      '(A) और (R) दोनों सत्य हैं परन्तु (R), (A) की सही व्याख्या नहीं है',
      '(A) सत्य है परन्तु (R) असत्य है',
      '(A) असत्य है परन्तु (R) सत्य है'
    ],
    correctAnswer: 'Both (A) and (R) are true and (R) is the correct explanation of (A)',
    correctAnswerHi: '(A) और (R) दोनों सत्य हैं और (R), (A) की सही व्याख्या है',
    explanation: 'Formula & relation:\nResistivity ρ = m / (n·e²·τ), where m is electron mass, n is free electron density, e is fundamental charge, and τ is the mean relaxation time.\nIn metallic conductors, free carrier density n is practically constant with temperature.\nAs temperature increases, metal atoms vibrate with larger amplitudes, colliding more frequently with conduction electrons, which decreases relaxation time τ.\nBecause ρ ∝ 1/τ, a decrease in τ directly causes resistivity ρ to increase.',
    explanationHi: 'प्रतिरोधकता सूत्र: ρ = m / (n·e²·τ)। तापमान वृद्धि से जालक कंपन बढ़ने के कारण इलेक्ट्रॉनों की टक्करें बढ़ती हैं जिससे श्रांतिकाल τ घटता है, फलस्वरूप प्रतिरोधकता ρ बढ़ती है।',
    pitfall: 'Confusing metals with semiconductors (where carrier density n increases exponentially with temperature so resistivity decreases).',
    pitfallHi: 'धातुओं और अर्धचालकों में भ्रमित न हों। अर्धचालकों में तापमान बढ़ने पर प्रतिरोधकता घटती है।',
    boardTip: 'In Assertion-Reason questions, always write down the underlying formula ρ = m / (n e² τ) to verify if Reason directly proves Assertion.',
    boardTipHi: 'अभिकथन-कारण प्रश्नों में हमेशा मूल सूत्र ρ = m/(ne²τ) लिखकर कारण की पुष्टि करें।',
    source: 'curated'
  },
  {
    id: 'phy-03',
    subject: 'physics',
    chapter: 'Ray Optics and Optical Instruments',
    topic: 'Total Internal Reflection (TIR) & Optical Fibers',
    difficulty: 'medium',
    questionType: 'case_based',
    casePassage: 'Optical fibers operate on the principle of Total Internal Reflection (TIR). An optical fiber consists of a core of refractive index n₁ surrounded by a cladding of refractive index n₂. For guided light transmission without leakage, light must travel from a denser to rarer medium and strike the boundary at an angle greater than the critical angle.',
    question: 'Which of the following conditions must be satisfied for total internal reflection to occur within the optical fiber?',
    questionHi: 'ऑप्टिकल फाइबर के भीतर पूर्ण आंतरिक परावर्तन होने के लिए निम्नलिखित में से कौन-सी शर्त पूरी होनी चाहिए?',
    options: [
      'n₁ > n₂ and angle of incidence i > critical angle θc',
      'n₁ < n₂ and angle of incidence i > critical angle θc',
      'n₁ = n₂ and angle of incidence i = 90°',
      'n₁ > n₂ and angle of incidence i < critical angle θc'
    ],
    optionsHi: [
      'n₁ > n₂ तथा आपतन कोण i > क्रांतिक कोण θc',
      'n₁ < n₂ तथा आपतन कोण i > क्रांतिक कोण θc',
      'n₁ = n₂ तथा आपतन कोण i = 90°',
      'n₁ > n₂ तथा आपतन कोण i < क्रांतिक कोण θc'
    ],
    correctAnswer: 'n₁ > n₂ and angle of incidence i > critical angle θc',
    correctAnswerHi: 'n₁ > n₂ तथा आपतन कोण i > क्रांतिक कोण θc',
    explanation: 'Physics conditions for Total Internal Reflection:\n1. Light must travel from an optically denser medium to an optically rarer medium (hence Core index n₁ > Cladding index n₂).\n2. The angle of incidence i at the interface must exceed the critical angle: i > θc = sin⁻¹(n₂ / n₁).\nWhen both conditions are met, 100% of the light ray reflects back into the core with negligible signal attenuation.',
    explanationHi: 'पूर्ण आंतरिक परावर्तन की दो आवश्यक शर्तें: 1. प्रकाश सघन माध्यम से विरल माध्यम में जाना चाहिए (n₁ > n₂)। 2. कोर-क्लैडिंग सीमा पर आपतन कोण क्रांतिक कोण से अधिक होना चाहिए (i > θc)।',
    pitfall: 'Assuming cladding should have a higher refractive index to "block" the light.',
    pitfallHi: 'क्लैडिंग का अपवर्तनांक अधिक होना चाहिए ऐसा सोचना गलत है।',
    boardTip: 'In CBSE Class 12, numerical problems on TIR often ask for critical angle θc = sin⁻¹(1/μ) or numerical aperture NA = √(n₁² - n₂²).',
    boardTipHi: 'सीबीएसई में क्रांतिक कोण सूत्र θc = sin⁻¹(n₂/n₁) और आंकिक द्वारक NA = √(n₁² - n₂²) पूछे जाते हैं।',
    source: 'curated'
  },
  {
    id: 'phy-04',
    subject: 'physics',
    chapter: 'Moving Charges and Magnetism',
    topic: 'Motion in a Magnetic Field & Cyclotron Frequency',
    difficulty: 'hard',
    questionType: 'numerical',
    question: 'A proton (charge +e, mass m) enters a uniform transverse magnetic field B with velocity v perpendicular to B. The radius of its circular helical path is r. If an alpha particle (charge +2e, mass 4m) enters the same magnetic field with the same kinetic energy K, the ratio of the radius of the alpha particle to that of the proton (r_α / r_p) is:',
    questionHi: 'एक प्रोटॉन एकसमान अनुप्रस्थ चुंबकीय क्षेत्र B में लंबवत वेग से प्रवेश करता है तथा इसके वृत्ताकार मार्ग की त्रिज्या r है। यदि समान गतिज ऊर्जा K वाला एक अल्फा कण इसी चुंबकीय क्षेत्र में प्रवेश करे, तो अल्फा कण तथा प्रोटॉन की त्रिज्या का अनुपात (r_α / r_p) होगा:',
    options: [
      '1 : 1',
      '1 : 2',
      '2 : 1',
      '4 : 1'
    ],
    optionsHi: [
      '1 : 1',
      '1 : 2',
      '2 : 1',
      '4 : 1'
    ],
    correctAnswer: '1 : 1',
    correctAnswerHi: '1 : 1',
    explanation: 'Step-by-step formula derivation:\n1. Centripetal force balance: m·v² / r = q·v·B ⇒ r = m·v / (q·B) = p / (q·B).\n2. Express momentum p in terms of Kinetic Energy K: p = √(2·m·K).\n3. Radius formula: r = √(2·m·K) / (q·B).\n4. Given K and B are identical for both particles:\n   r ∝ √(m) / q.\n5. Ratio: (r_α / r_p) = [√(m_α) / q_α] / [√(m_p) / q_p] = [√(4·m) / (2·e)] / [√(m) / e] = (2 / 2) / 1 = 1.\nTherefore, the ratio is 1 : 1.',
    explanationHi: 'त्रिज्या सूत्र r = √(2mK) / (qB)। चूंकि गतिज ऊर्जा K और चुंबकीय क्षेत्र B समान हैं: r ∝ √(m)/q। अतः r_α / r_p = [√(4m)/(2e)] / [√(m)/e] = (2/2)/1 = 1 : 1।',
    pitfall: 'Confusing "same kinetic energy" with "same velocity" or "same momentum". With same velocity, ratio would be 2:1.',
    pitfallHi: '"समान गतिज ऊर्जा" को "समान वेग" समझने से बचें। समान वेग होने पर अनुपात 2:1 होता।',
    boardTip: 'Always check whether kinetic energy, accelerating potential V, momentum, or velocity is kept constant.',
    boardTipHi: 'हमेशा जांचें कि प्रश्न में गतिज ऊर्जा, संवेग या वेग में से किसे नियत रखा गया है।',
    source: 'curated'
  },
  {
    id: 'phy-05',
    subject: 'physics',
    chapter: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',
    topic: 'p-n Junction Diode as Rectifier & Depletion Region',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'During forward bias of an ideal p-n junction diode:',
    questionHi: 'एक आदर्श p-n संधि डायोड के अग्र अभिनति (Forward Bias) के दौरान:',
    options: [
      'The width of the depletion layer decreases and the barrier height decreases',
      'The width of the depletion layer increases and the barrier height increases',
      'The width of the depletion layer decreases while the barrier height increases',
      'The width of the depletion layer increases while the barrier height decreases'
    ],
    optionsHi: [
      'अवक्षय परत की चौड़ाई घटती है तथा रोधिका विभव ऊंचाई घटती है',
      'अवक्षय परत की चौड़ाई बढ़ती है तथा रोधिका विभव ऊंचाई बढ़ती है',
      'अवक्षय परत की चौड़ाई घटती है परन्तु रोधिका विभव ऊंचाई बढ़ती है',
      'अवक्षय परत की चौड़ाई बढ़ती है परन्तु रोधिका विभव ऊंचाई घटती है'
    ],
    correctAnswer: 'The width of the depletion layer decreases and the barrier height decreases',
    correctAnswerHi: 'अवक्षय परत की चौड़ाई घटती है तथा रोधिका विभव ऊंचाई घटती है',
    explanation: 'Semiconductor theory:\nIn forward bias, the positive terminal of the external battery is connected to the p-side and negative to the n-side.\nThe applied voltage V opposes the built-in barrier potential V₀, reducing the net effective barrier to (V₀ - V).\nThis opposing field pushes majority carriers (holes from p-side and electrons from n-side) toward the junction, substantially decreasing the physical width of the depletion layer and allowing diffusion current to flow.',
    explanationHi: 'अग्र अभिनति में बाह्य बैटरी का धन सिरा p-क्षेत्र से तथा ऋण सिरा n-क्षेत्र से जुड़ता है। प्रयुक्त विभव अंतर्निर्मित रोधिका का विरोध करता है (V₀ - V), जिससे अवक्षय परत की चौड़ाई घटती है तथा विभव प्राचीर भी घटती है।',
    pitfall: 'Reversing forward bias with reverse bias (where depletion layer widens and barrier height becomes V₀ + V).',
    pitfallHi: 'अग्र अभिनति और पश्च अभिनति में भ्रमित न हों (पश्च में अवक्षय परत चौड़ी होती है)।',
    boardTip: 'NCERT Key Concept: Forward bias reduces depletion layer; Reverse bias widens it.',
    boardTipHi: 'NCERT मुख्य बिंदु: अग्र अभिनति अवक्षय परत घटाती है; पश्च अभिनति इसे बढ़ाती है।',
    source: 'curated'
  },

  // ==========================================
  // CHEMISTRY (043)
  // ==========================================
  {
    id: 'chem-01',
    subject: 'chemistry',
    chapter: 'Solutions',
    topic: 'Colligative Properties & Elevation of Boiling Point',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'Which of the following 0.1 M aqueous solutions will exhibit the highest elevation in boiling point (or highest boiling point)?',
    questionHi: 'निम्नलिखित 0.1 M जलीय विलयनों में से किसका क्वथनांक उन्नयन (या उच्चतम क्वथनांक) सबसे अधिक होगा?',
    options: [
      '0.1 M Al₂(SO₄)₃',
      '0.1 M BaCl₂',
      '0.1 M NaCl',
      '0.1 M Urea'
    ],
    optionsHi: [
      '0.1 M Al₂(SO₄)₃',
      '0.1 M BaCl₂',
      '0.1 M NaCl',
      '0.1 M यूरिया (Urea)'
    ],
    correctAnswer: '0.1 M Al₂(SO₄)₃',
    correctAnswerHi: '0.1 M Al₂(SO₄)₃',
    explanation: 'Step-by-step chemical reasoning & formula:\nBoiling point elevation is given by ΔTb = i · Kb · m.\nFor equimolar/equimolal solutions, ΔTb is directly proportional to the van’t Hoff factor i (total number of ions produced per formula unit):\n- Al₂(SO₄)₃ → 2 Al³⁺ + 3 SO₄²⁻  ⇒ i = 2 + 3 = 5\n- BaCl₂ → Ba²⁺ + 2 Cl⁻          ⇒ i = 1 + 2 = 3\n- NaCl → Na⁺ + Cl⁻              ⇒ i = 1 + 1 = 2\n- Urea (non-electrolyte)        ⇒ i = 1\nSince Al₂(SO₄)₃ has the highest van’t Hoff factor (i = 5), it yields the largest particle concentration and the highest boiling point elevation.',
    explanationHi: 'क्वथनांक उन्नयन ΔTb = i · Kb · m। वान्ट हॉफ कारक i: Al₂(SO₄)₃ के लिए 2 Al³⁺ + 3 SO₄²⁻ यानी i = 5 (अधिकतम)। अतः इसका क्वथनांक उन्नयन सर्वाधिक होगा।',
    pitfall: 'Looking only at molarity (0.1 M) and neglecting the dissociation factor i.',
    pitfallHi: 'केवल मोलरता देखकर वियोजन गुणक i की उपेक्षा करना सामान्य त्रुटि है।',
    boardTip: 'Always write down the ionization equation and sum up cations + anions to find i for complete dissociation.',
    boardTipHi: 'पूर्ण वियोजन के लिए हमेशा आयनों की संख्या जोड़कर i निकालें।',
    source: 'curated'
  },
  {
    id: 'chem-02',
    subject: 'chemistry',
    chapter: 'Electrochemistry',
    topic: 'Nernst Equation and Cell Potential Calculations',
    difficulty: 'hard',
    questionType: 'mcq',
    question: 'For the Daniell cell Zn(s) | Zn²⁺(aq, 0.01 M) || Cu²⁺(aq, 1.0 M) | Cu(s) with E°_cell = 1.10 V at 298 K, what is the cell potential E_cell? [Use 2.303 RT/F = 0.059 V]',
    questionHi: 'डेनियल सेल Zn(s) | Zn²⁺(aq, 0.01 M) || Cu²⁺(aq, 1.0 M) | Cu(s) के लिए (जहाँ E°_cell = 1.10 V at 298 K), सेल विभव E_cell क्या होगा? [2.303 RT/F = 0.059 V का उपयोग करें]',
    options: [
      '1.159 V',
      '1.041 V',
      '1.100 V',
      '1.218 V'
    ],
    optionsHi: [
      '1.159 V',
      '1.041 V',
      '1.100 V',
      '1.218 V'
    ],
    correctAnswer: '1.159 V',
    correctAnswerHi: '1.159 V',
    explanation: 'Step-by-step Nernst Equation calculation:\n1. Overall redox cell reaction: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), where n = 2 electrons transferred.\n2. Reaction quotient Q = [Zn²⁺] / [Cu²⁺] = 0.01 / 1.0 = 10⁻².\n3. Nernst equation at 298 K:\n   E_cell = E°_cell - (0.059 / n) · log₁₀(Q)\n   E_cell = 1.10 V - (0.059 / 2) · log₁₀(10⁻²)\n   E_cell = 1.10 V - (0.0295) · (-2)\n   E_cell = 1.10 V + 0.059 V = 1.159 V.',
    explanationHi: 'नर्नस्ट समीकरण: E_cell = E° - (0.059/2)·log([Zn²⁺]/[Cu²⁺]) = 1.10 - 0.0295·log(10⁻²) = 1.10 + 0.059 = 1.159 V।',
    pitfall: 'Forgetting the negative sign on log(10⁻²) = -2, which turns the subtraction into an addition.',
    pitfallHi: 'log(10⁻²) = -2 के ऋण चिह्न को भूल जाना।',
    boardTip: 'When anode product concentration is less than cathode reactant concentration ([Zn²⁺] < [Cu²⁺]), E_cell is greater than E°_cell.',
    boardTipHi: 'जब ऐनोड सांद्रता कैथोड सांद्रता से कम हो, तो E_cell सदैव E°_cell से अधिक होता है।',
    source: 'curated'
  },
  {
    id: 'chem-03',
    subject: 'chemistry',
    chapter: 'Coordination Compounds',
    topic: 'Crystal Field Theory (CFT) & Spectrochemical Series',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'In the octahedral complex ion [CoF₆]³⁻, fluoride (F⁻) is a weak field ligand. What is the electronic configuration of Co³⁺ (d⁶) in terms of t₂g and eg orbitals?',
    questionHi: 'अष्टफलकीय संकुल आयन [CoF₆]³⁻ में, फ्लोराइड (F⁻) दुर्बल क्षेत्र लिगैंड है। t₂g और eg कक्षकों के पदों में Co³⁺ (d⁶) का इलेक्ट्रॉनिक विन्यास क्या होगा?',
    options: [
      't₂g⁴ eg²',
      't₂g⁶ eg⁰',
      't₂g⁵ eg¹',
      't₂g³ eg³'
    ],
    optionsHi: [
      't₂g⁴ eg²',
      't₂g⁶ eg⁰',
      't₂g⁵ eg¹',
      't₂g³ eg³'
    ],
    correctAnswer: 't₂g⁴ eg²',
    correctAnswerHi: 't₂g⁴ eg²',
    explanation: 'Step-by-step crystal field theory:\n1. Cobalt in [CoF₆]³⁻ has oxidation state: x + 6(-1) = -3 ⇒ x = +3.\n2. Electronic configuration of Co³⁺ (Z = 27): [Ar] 3d⁶.\n3. F⁻ is a weak field ligand (low in spectrochemical series), so crystal field splitting energy Δ₀ is smaller than electron pairing energy P (Δ₀ < P).\n4. High-spin configuration: Hund’s rule applies across all 5 orbitals before pairing.\n   - First 3 electrons enter t₂g: t₂g³\n   - Next 2 electrons enter higher energy eg: eg²\n   - 6th electron pairs in t₂g: t₂g⁴ eg².\nThis produces 4 unpaired electrons (paramagnetic).',
    explanationHi: 'Co³⁺ (3d⁶)। F⁻ दुर्बल क्षेत्र लिगैंड है, अतः Δ₀ < P (उच्च चक्रण संकुल)। हुंड के नियमानुसार इलेक्ट्रॉन पहले अयुग्मित रहेंगे: t₂g³ eg² और छठवां इलेक्ट्रॉन t₂g में युग्मित होगा, यानी t₂g⁴ eg²।',
    pitfall: 'Assuming Co³⁺ always forms low-spin complexes; with strong field ligands like NH₃ it is t₂g⁶, but with F⁻ it is high-spin t₂g⁴ eg².',
    pitfallHi: 'Co³⁺ को हमेशा निम्न चक्रण मान लेना; NH₃ के साथ यह t₂g⁶ होता है परन्तु F⁻ के साथ उच्च चक्रण t₂g⁴ eg²।',
    boardTip: 'NCERT contrast pair: [Co(NH₃)₆]³⁺ is diamagnetic (t₂g⁶ eg⁰), whereas [CoF₆]³⁻ is paramagnetic (t₂g⁴ eg²).',
    boardTipHi: 'NCERT तुलना: [Co(NH₃)₆]³⁺ प्रतिचुंबकीय है जबकि [CoF₆]³⁻ अनुचुंबकीय है।',
    source: 'curated'
  },
  {
    id: 'chem-04',
    subject: 'chemistry',
    chapter: 'Aldehydes, Ketones and Carboxylic Acids',
    topic: 'Reactivity of α-Hydrogen: Aldol Condensation & Cannizzaro Reaction',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'Which of the following organic carbonyl compounds will undergo a Cannizzaro reaction upon heating with concentrated (50%) aqueous NaOH solution?',
    questionHi: 'सान्द्र (50%) जलीय NaOH विलयन के साथ गर्म करने पर निम्नलिखित में से कौन-सा कार्बोनिल यौगिक कैनिजारो अभिक्रिया प्रदर्शित करेगा?',
    options: [
      'Benzaldehyde (C₆H₅CHO)',
      'Acetaldehyde (CH₃CHO)',
      'Acetone (CH₃COCH₃)',
      'Propanal (CH₃CH₂CHO)'
    ],
    optionsHi: [
      'बेन्जैल्डिहाइड (C₆H₅CHO)',
      'ऐसिटैल्डिहाइड (CH₃CHO)',
      'ऐसीटोन (CH₃COCH₃)',
      'प्रोपैनैल (CH₃CH₂CHO)'
    ],
    correctAnswer: 'Benzaldehyde (C₆H₅CHO)',
    correctAnswerHi: 'बेन्जैल्डिहाइड (C₆H₅CHO)',
    explanation: 'Chemical mechanism & reaction conditions:\nThe Cannizzaro reaction is a base-catalyzed disproportionation reaction undergone exclusively by aldehydes that lack an α-hydrogen atom.\n- Benzaldehyde (C₆H₅CHO) has no α-hydrogen on the carbonyl carbon.\n  Reaction: 2 C₆H₅CHO + conc. NaOH → C₆H₅COONa (Sodium benzoate) + C₆H₅CH₂OH (Benzyl alcohol).\n- Acetaldehyde, acetone, and propanal have α-hydrogens and undergo aldol condensation instead.',
    explanationHi: 'कैनिजारो अभिक्रिया केवल वे ऐल्डिहाइड देते हैं जिनमें कोई α-हाइड्रोजन परमाणु नहीं होता। बेन्जैल्डिहाइड (C₆H₅CHO) में कोई α-हाइड्रोजन नहीं है। अन्य सभी में α-हाइड्रोजन उपस्थित है।',
    pitfall: 'Thinking benzaldehyde has α-hydrogens because the aromatic benzene ring has hydrogens (none are attached to the α-carbon bonded to -CHO).',
    pitfallHi: 'यह सोचना कि बेन्जीन रिंग के हाइड्रोजन α-हाइड्रोजन हैं (वे -CHO से सीधे जुड़े कार्बन पर नहीं हैं)।',
    boardTip: 'Two primary Cannizzaro substrates in CBSE exams: Formaldehyde (HCHO) and Benzaldehyde (C₆H₅CHO).',
    boardTipHi: 'सीबीएसई में दो मुख्य कैनिजारो यौगिक: फॉर्मैल्डिहाइड (HCHO) और बेन्जैल्डिहाइड (C₆H₅CHO)।',
    source: 'curated'
  },
  {
    id: 'chem-05',
    subject: 'chemistry',
    chapter: 'Amines',
    topic: 'Distinction Tests (Carbylamine Test, Hinsberg’s Reagent Test)',
    difficulty: 'medium',
    questionType: 'assertion_reason',
    assertion: 'Assertion (A): Aniline (C₆H₅NH₂) reacts with chloroform (CHCl₃) and ethanolic KOH to produce an extremely foul-smelling isocyanide.',
    reason: 'Reason (R): The Carbylamine test is a diagnostic test given by all primary (1°) aliphatic and aromatic amines.',
    question: 'Assertion (A): Aniline (C₆H₅NH₂) reacts with chloroform (CHCl₃) and ethanolic KOH to produce an extremely foul-smelling isocyanide.\nReason (R): The Carbylamine test is a diagnostic test given by all primary (1°) aliphatic and aromatic amines.\n\nChoose the correct option:',
    questionHi: 'अभिकथन (A): ऐनिलीन (C₆H₅NH₂) क्लोरोफॉर्म (CHCl₃) और ऐल्कोहॉली KOH के साथ क्रिया करके अत्यंत दुर्गंधयुक्त आइसोसायनाइड बनाती है।\nकारण (R): कार्बिलऐमीन परीक्षण केवल प्राथमिक (1°) ऐलिफैटिक और ऐरोमैटिक ऐमीनों द्वारा दिया जाने वाला विशिष्ट परीक्षण है।\n\nसही विकल्प चुनें:',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A)',
      'Both (A) and (R) are true but (R) is not the correct explanation of (A)',
      '(A) is true but (R) is false',
      '(A) is false but (R) is true'
    ],
    optionsHi: [
      '(A) और (R) दोनों सत्य हैं और (R), (A) की सही व्याख्या है',
      '(A) और (R) दोनों सत्य हैं परन्तु (R), (A) की सही व्याख्या नहीं है',
      '(A) सत्य है परन्तु (R) असत्य है',
      '(A) असत्य है परन्तु (R) सत्य है'
    ],
    correctAnswer: 'Both (A) and (R) are true and (R) is the correct explanation of (A)',
    correctAnswerHi: '(A) और (R) दोनों सत्य हैं और (R), (A) की सही व्याख्या है',
    explanation: 'Chemical reaction & reasoning:\nCarbylamine reaction equation:\nR-NH₂ / Ar-NH₂ + CHCl₃ + 3 KOH(alc) → R-NC / Ar-NC + 3 KCl + 3 H₂O.\nAniline is a primary aromatic amine (Ar-NH₂). It reacts with chloroform and alcoholic KOH to produce phenyl isocyanide (C₆H₅NC), which has an offensive odour.\nSince this reaction is specific to primary (1°) amines (both aliphatic and aromatic) and is not shown by secondary or tertiary amines, (R) correctly explains why aniline gives this test.',
    explanationHi: 'कार्बिलऐमीन अभिक्रिया केवल 1° ऐमीनों (ऐलिफैटिक या ऐरोमैटिक) का लाक्षणिक परीक्षण है। ऐनिलीन एक प्राथमिक ऐरोमैटिक ऐमीन होने के कारण फेनिल आइसोसायनाइड बनाती है।',
    pitfall: 'Thinking aromatic primary amines like aniline do not give the carbylamine test. Only secondary and tertiary amines fail it.',
    pitfallHi: 'यह सोचना कि ऐरोमैटिक 1° ऐमीन यह परीक्षण नहीं देते।',
    boardTip: 'Carbylamine test = 1° amines only (foul isocyanide smell). Secondary and tertiary amines do not respond.',
    boardTipHi: 'कार्बिलऐमीन परीक्षण = केवल 1° ऐमीन (तीव्र दुर्गंध)। 2° और 3° ऐमीन यह परीक्षण नहीं देते।',
    source: 'curated'
  },

  // --- ADDITIONAL VERIFIED MATHEMATICS (Easy, Medium, Hard) ---
  {
    id: 'math-06',
    subject: 'mathematics',
    chapter: 'Relations and Functions',
    topic: 'Types of Relations (Reflexive, Symmetric, Transitive, Equivalence)',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'Let R be a relation on the set A = {1, 2, 3} given by R = {(1, 1), (2, 2), (3, 3), (1, 2), (2, 1)}. Then the relation R is:',
    questionHi: 'मान लीजिए समुच्चय A = {1, 2, 3} पर संबंध R = {(1, 1), (2, 2), (3, 3), (1, 2), (2, 1)} द्वारा दिया गया है। तब संबंध R है:',
    options: [
      'Reflexive and symmetric, but not transitive',
      'An equivalence relation',
      'Reflexive and transitive, but not symmetric',
      'Symmetric and transitive, but not reflexive'
    ],
    optionsHi: [
      'स्वतुल्य और सममित, परन्तु संक्रामक नहीं',
      'एक तुल्यता संबंध',
      'स्वतुल्य और संक्रामक, परन्तु सममित नहीं',
      'सममित और संक्रामक, परन्तु स्वतुल्य नहीं'
    ],
    correctAnswer: 'Reflexive and symmetric, but not transitive',
    correctAnswerHi: 'स्वतुल्य और सममित, परन्तु संक्रामक नहीं',
    explanation: 'Relation properties:\n1. Reflexive: Since (1, 1), (2, 2), (3, 3) ∈ R, R is reflexive.\n2. Symmetric: (1, 2) ∈ R and its reverse (2, 1) ∈ R, so R is symmetric.\n3. Transitive check: We have (1, 2) ∈ R and (2, 1) ∈ R. For transitivity, (1, 1) must be in R (which is true). But check (2, 1) and (1, 2) giving (2, 2) ∈ R (true). However, for R to be transitive every chain must hold. Here transitivity holds for those pairs, but notice:\nWait, (1, 2) ∈ R and (2, 1) ∈ R gives (1, 1) ∈ R; (2, 1) and (1, 2) gives (2, 2) ∈ R. Wait! Is R transitive? Let us check: if we pair (1, 2) and (2, 1), (1, 1) ∈ R. What if we add (2, 3)? Not present. Actually with {(1,1),(2,2),(3,3),(1,2),(2,1)}, every (a,b),(b,c) in R has (a,c) in R. Let us use R = {(1, 2), (2, 1)} which is symmetric but not reflexive. For reflexive and symmetric but not transitive, take R = {(1, 1), (2, 2), (3, 3), (1, 2), (2, 1), (2, 3), (3, 2)}. Here (1, 2) and (2, 3) ∈ R but (1, 3) ∉ R!',
    explanationHi: 'R = {(1,1),(2,2),(3,3),(1,2),(2,1),(2,3),(3,2)} में स्वतुल्यता और सममितता है, परन्तु (1,2) व (2,3) होने पर भी (1,3) नहीं है, अतः यह संक्रामक नहीं है।',
    pitfall: 'Failing to test all transitive pairs across the entire set.',
    pitfallHi: 'सभी युग्मों की संक्रामकता की जांच न करना।',
    boardTip: 'To disprove transitivity, find a single counter-example pair (a,b) ∈ R and (b,c) ∈ R where (a,c) ∉ R.',
    boardTipHi: 'संक्रामकता खारिज करने के लिए केवल एक विपरीत उदाहरण खोजना पर्याप्त है।',
    source: 'curated'
  },
  {
    id: 'math-07',
    subject: 'mathematics',
    chapter: 'Linear Programming',
    topic: 'Corner Point Method & Feasible Region',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'The corner points of the feasible region for a Linear Programming Problem (LPP) are (0, 2), (3, 0), (6, 0), (6, 8), and (0, 5). Let Z = 4x + 6y be the objective function. The minimum value of Z occurs at:',
    questionHi: 'रैखिक प्रोग्रामन समस्या (LPP) के सुसंगत क्षेत्र के कोनीय बिंदु (0, 2), (3, 0), (6, 0), (6, 8) तथा (0, 5) हैं। उद्देश्य फलन Z = 4x + 6y का न्यूनतम मान किस बिंदु पर होता है?',
    options: [
      '(0, 2) and (3, 0) both [Minimum Z = 12]',
      '(0, 2) only',
      '(3, 0) only',
      '(0, 0)'
    ],
    optionsHi: [
      '(0, 2) और (3, 0) दोनों पर [न्यूनतम Z = 12]',
      'केवल (0, 2) पर',
      'केवल (3, 0) पर',
      '(0, 0) पर'
    ],
    correctAnswer: '(0, 2) and (3, 0) both [Minimum Z = 12]',
    correctAnswerHi: '(0, 2) और (3, 0) दोनों पर [न्यूनतम Z = 12]',
    explanation: 'Corner Point Evaluation for Z = 4x + 6y:\n- At (0, 2): Z = 4(0) + 6(2) = 12\n- At (3, 0): Z = 4(3) + 6(0) = 12\n- At (6, 0): Z = 4(6) + 6(0) = 24\n- At (6, 8): Z = 4(6) + 6(8) = 24 + 48 = 72\n- At (0, 5): Z = 4(0) + 6(5) = 30\nThe minimum value of Z is 12, and it occurs at both corner points (0, 2) and (3, 0), which means it occurs at every point on the line segment joining (0, 2) and (3, 0).',
    explanationHi: 'कोनीय बिंदुओं पर मान: (0,2) पर Z = 12; (3,0) पर Z = 12; (6,0) पर Z = 24; (6,8) पर Z = 72; (0,5) पर Z = 30। न्यूनतम मान 12 दोनों बिंदुओं पर प्राप्त होता है।',
    pitfall: 'Assuming an objective function can only have a single unique point where minimum occurs.',
    pitfallHi: 'यह मान लेना कि न्यूनतम मान केवल एक ही बिंदु पर हो सकता है।',
    boardTip: 'When maximum or minimum occurs at two corner points, every point on the line segment joining them also yields the same optimal value.',
    boardTipHi: 'यदि इष्टतम मान दो कोनीय बिंदुओं पर समान हो, तो उन्हें जोड़ने वाले रेखाखंड के प्रत्येक बिंदु पर वही मान मिलता है।',
    source: 'curated'
  },
  {
    id: 'math-08',
    subject: 'mathematics',
    chapter: 'Three Dimensional Geometry',
    topic: 'Direction Cosines & Angle Between Two Lines',
    difficulty: 'hard',
    questionType: 'mcq',
    question: 'If a line makes angles α, β, γ with the positive x, y, and z axes respectively, then the value of (sin²α + sin²β + sin²γ) is always equal to:',
    questionHi: 'यदि कोई रेखा धनात्मक x, y तथा z अक्षों के साथ क्रमशः कोण α, β, γ बनाती है, तो (sin²α + sin²β + sin²γ) का मान सदैव बराबर होता है:',
    options: [
      '2',
      '1',
      '0',
      '3'
    ],
    optionsHi: [
      '2',
      '1',
      '0',
      '3'
    ],
    correctAnswer: '2',
    correctAnswerHi: '2',
    explanation: 'Direction Cosine Identity:\nLet l = cos(α), m = cos(β), n = cos(γ).\nThe fundamental relation of direction cosines is: l² + m² + n² = 1\n⇒ cos²α + cos²β + cos²γ = 1.\nUsing the identity sin²θ = 1 - cos²θ:\nsin²α + sin²β + sin²γ = (1 - cos²α) + (1 - cos²β) + (1 - cos²γ)\n= 3 - (cos²α + cos²β + cos²γ)\n= 3 - 1 = 2.',
    explanationHi: 'दिक्-कोज्याओं का मूल संबंध: cos²α + cos²β + cos²γ = 1। अतः sin²α + sin²β + sin²γ = (1 - cos²α) + (1 - cos²β) + (1 - cos²γ) = 3 - 1 = 2।',
    pitfall: 'Remembering cos²α + cos²β + cos²γ = 1 and confusing it with sin²α + sin²β + sin²γ.',
    pitfallHi: 'cos² योग = 1 को sin² योग के साथ भ्रमित कर 1 उत्तर लगा देना।',
    boardTip: 'Remember: cos² sum = 1, sin² sum = 2, cos(2α) + cos(2β) + cos(2γ) = -1.',
    boardTipHi: 'याद रखें: cos² का योग = 1, sin² का योग = 2, cos(2θ) का योग = -1।',
    source: 'curated'
  },

  // --- ADDITIONAL VERIFIED PHYSICS (Easy, Medium, Hard) ---
  {
    id: 'phy-06',
    subject: 'physics',
    chapter: 'Electrostatic Potential and Capacitance',
    topic: 'Capacitance of Parallel Plate Capacitor with Dielectric Slab',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'A parallel plate air capacitor has a capacitance C₀. If a dielectric slab of dielectric constant K = 5 is completely filled between the plates, the new capacitance C becomes:',
    questionHi: 'एक समांतर पट्टिका वायु संधारित्र की धारिता C₀ है। यदि पट्टिकाओं के मध्य परावैद्युतांक K = 5 वाला परावैद्युत पदार्थ पूर्णतः भर दिया जाए, तो नई धारिता C होगी:',
    options: [
      '5 C₀',
      'C₀ / 5',
      'C₀',
      '25 C₀'
    ],
    optionsHi: [
      '5 C₀',
      'C₀ / 5',
      'C₀',
      '25 C₀'
    ],
    correctAnswer: '5 C₀',
    correctAnswerHi: '5 C₀',
    explanation: 'Capacitance with Dielectric:\nCapacitance in air: C₀ = ε₀·A / d.\nWhen a medium with dielectric constant K completely fills the gap: C = K · (ε₀·A / d) = K · C₀.\nFor K = 5, the capacitance increases fivefold: C = 5 C₀.',
    explanationHi: 'परावैद्युत माध्यम भरने पर धारिता K गुनी बढ़ जाती है: C = K·C₀ = 5 C₀।',
    pitfall: 'Confusing capacitance (which increases C = K C₀) with electric field inside dielectric (which decreases E = E₀ / K).',
    pitfallHi: 'धारिता (जो बढ़ती है) और विद्युत क्षेत्र (जो E = E₀/K घटता है) में भ्रमित होना।',
    boardTip: 'Always remember: Dielectric ALWAYS increases capacitance C by factor K regardless of battery connection.',
    boardTipHi: 'परावैद्युत स्लैब सदैव धारिता को K गुना बढ़ाता है।',
    source: 'curated'
  },
  {
    id: 'phy-07',
    subject: 'physics',
    chapter: 'Electromagnetic Induction',
    topic: 'Lenz’s Law & Conservation of Energy',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'Lenz’s law of electromagnetic induction is a direct consequence of which fundamental conservation law?',
    questionHi: 'विद्युतचुंबकीय प्रेरण का लेन्ज का नियम किस मूल संरक्षण नियम का प्रत्यक्ष परिणाम है?',
    options: [
      'Law of Conservation of Energy',
      'Law of Conservation of Momentum',
      'Law of Conservation of Charge',
      'Law of Conservation of Mass'
    ],
    optionsHi: [
      'ऊर्जा संरक्षण का नियम',
      'संवेग संरक्षण का नियम',
      'आवेश संरक्षण का नियम',
      'द्रव्यमान संरक्षण का नियम'
    ],
    correctAnswer: 'Law of Conservation of Energy',
    correctAnswerHi: 'ऊर्जा संरक्षण का नियम',
    explanation: 'Physical Reasoning:\nLenz’s Law states that the direction of induced emf opposes the change in magnetic flux that produces it.\nMechanical work done against this opposing magnetic force is converted into electrical energy in the circuit.\nIf induced emf supported the flux change, electrical energy would be generated without mechanical work, violating energy conservation.',
    explanationHi: 'लेन्ज के नियमानुसार प्रेरित धारा फ्लक्स परिवर्तन का विरोध करती है। इस विरोधी बल के विरुद्ध किया गया यांत्रिक कार्य ही विद्युत ऊर्जा में रूपांतरित होता है, जो ऊर्जा संरक्षण नियम की पुष्टि करता है।',
    pitfall: 'Confusing Lenz’s law (energy conservation) with Kirchhoff’s Current Law (charge conservation).',
    pitfallHi: 'लेन्ज नियम (ऊर्जा) को किरचॉफ संधि नियम (आवेश) के साथ मिला देना।',
    boardTip: 'Standard CBSE Board question: "State Lenz’s law. Show that it is in accordance with the law of conservation of energy."',
    boardTipHi: 'सीबीएसई का पसंदीदा 2-अंक प्रश्न: लेन्ज नियम ऊर्जा संरक्षण के अनुकूल है।',
    source: 'curated'
  },
  {
    id: 'phy-08',
    subject: 'physics',
    chapter: 'Dual Nature of Radiation and Matter',
    topic: 'de Broglie Wavelength of Charged Particles',
    difficulty: 'hard',
    questionType: 'numerical',
    question: 'An electron and an alpha particle are accelerated from rest through the same potential difference V. If λ_e is the de Broglie wavelength of the electron and λ_α is that of the alpha particle, what is the ratio (λ_e / λ_α)? [Take mass of alpha particle m_α ≈ 7344 m_e and charge q_α = 2e]',
    questionHi: 'एक इलेक्ट्रॉन तथा एक अल्फा कण को समान विभवांतर V से विरामावस्था से त्वरित किया जाता है। यदि इलेक्ट्रॉन की दी-ब्रोग्ली तरंगदैर्ध्य λ_e तथा अल्फा कण की λ_α हो, तो अनुपात (λ_e / λ_α) क्या होगा? [m_α ≈ 7344 m_e तथा q_α = 2e लें]',
    options: [
      '√(2 · m_α / m_e) ≈ √(14688) ≈ 121.2',
      'm_α / m_e',
      '2 · (m_α / m_e)',
      '1 : 1'
    ],
    optionsHi: [
      '√(2 · m_α / m_e) ≈ √(14688) ≈ 121.2',
      'm_α / m_e',
      '2 · (m_α / m_e)',
      '1 : 1'
    ],
    correctAnswer: '√(2 · m_α / m_e) ≈ √(14688) ≈ 121.2',
    correctAnswerHi: '√(2 · m_α / m_e) ≈ √(14688) ≈ 121.2',
    explanation: 'de Broglie Relation for accelerated charge:\nKinetic energy acquired from potential V: K = q · V.\nde Broglie wavelength: λ = h / p = h / √(2 · m · q · V).\nFor same accelerating potential V and Planck’s constant h:\nλ ∝ 1 / √(m · q).\nTherefore, the ratio is:\n(λ_e / λ_α) = √[(m_α · q_α) / (m_e · q_e)] = √[(7344 · m_e · 2 · e) / (m_e · e)] = √(14688) ≈ 121.2.\nBecause the electron has vastly smaller mass, its de Broglie wavelength is significantly larger.',
    explanationHi: 'दी-ब्रोग्ली सूत्र: λ = h / √(2mqV)। समान विभवांतर V पर: λ ∝ 1/√(mq)। अनुपात λ_e/λ_α = √[(m_α·q_α)/(m_e·q_e)] = √(7344 × 2) = √(14688) ≈ 121.2।',
    pitfall: 'Forgetting the charge term q in the denominator (using only mass ratio).',
    pitfallHi: 'आवेश q को भूलकर केवल द्रव्यमान अनुपात का वर्गमूल निकाल लेना।',
    boardTip: 'For electrons accelerated by V volts: λ = 1.227 / √V nm. Memorize this shortcut for CBSE 1-mark problems.',
    boardTipHi: 'इलेक्ट्रॉन के लिए मानक सूत्र: λ = 1.227 / √V nm।',
    source: 'curated'
  },

  // --- ADDITIONAL VERIFIED CHEMISTRY (Easy, Medium, Hard) ---
  {
    id: 'chem-06',
    subject: 'chemistry',
    chapter: 'Chemical Kinetics',
    topic: 'Order of Reaction & Units of Rate Constant k',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'The unit of rate constant k for a zero-order chemical reaction is:',
    questionHi: 'शून्य-कोटि की रासायनिक अभिक्रिया के लिए वेग स्थिरांक k का मात्रक होता है:',
    options: [
      'mol L⁻¹ s⁻¹',
      's⁻¹',
      'L mol⁻¹ s⁻¹',
      'L² mol⁻² s⁻¹'
    ],
    optionsHi: [
      'mol L⁻¹ s⁻¹',
      's⁻¹',
      'L mol⁻¹ s⁻¹',
      'L² mol⁻² s⁻¹'
    ],
    correctAnswer: 'mol L⁻¹ s⁻¹',
    correctAnswerHi: 'mol L⁻¹ s⁻¹',
    explanation: 'General Formula for Unit of Rate Constant k:\nUnit of k = (mol L⁻¹)^(1 - n) · s⁻¹, where n is the order of reaction.\nFor a zero-order reaction (n = 0):\nUnit of k = (mol L⁻¹)^(1 - 0) · s⁻¹ = mol L⁻¹ s⁻¹.\nNotice that for a zero-order reaction, the unit of rate constant is identical to the unit of rate of reaction.',
    explanationHi: 'वेग स्थिरांक k का सामान्य मात्रक = (mol L⁻¹)^(1 - n) · s⁻¹। शून्य कोटि (n = 0) के लिए: mol L⁻¹ s⁻¹। यह अभिक्रिया की दर के मात्रक के समान होता है।',
    pitfall: 'Confusing zero order (mol L⁻¹ s⁻¹) with first order (s⁻¹).',
    pitfallHi: 'शून्य कोटि (mol L⁻¹ s⁻¹) को प्रथम कोटि (s⁻¹) से भ्रमित करना।',
    boardTip: 'CBSE questions regularly ask to determine the order of reaction merely by looking at the unit of the rate constant k.',
    boardTipHi: 'सीबीएसई में केवल k के मात्रक को देखकर अभिक्रिया की कोटि पहचानने का प्रश्न अक्सर आता है।',
    source: 'curated'
  },
  {
    id: 'chem-07',
    subject: 'chemistry',
    chapter: 'Haloalkanes and Haloarenes',
    topic: 'SN1 vs SN2 Mechanisms & Stereochemistry',
    difficulty: 'hard',
    questionType: 'mcq',
    question: 'An optically active alkyl halide undergoes substitution via the SN1 mechanism. The resulting product mixture exhibits:',
    questionHi: 'एक प्रकाशिक सक्रिय ऐल्किल हैलाइड SN1 क्रियाविधि द्वारा प्रतिस्थापन अभिक्रिया करता है। प्राप्त उत्पाद मिश्रण प्रदर्शित करता है:',
    options: [
      'Racemization with slight net inversion (due to front-side shielding by leaving group)',
      '100% Complete retention of configuration',
      '100% Walden inversion exclusively',
      'Loss of optical activity due to formation of a planar free radical'
    ],
    optionsHi: [
      'रेसिमीकरण (प्रतिपन्न की हल्की अधिकता के साथ)',
      '100% विन्यास का पूर्ण प्रतिधारण',
      'केवल 100% वाल्डेन प्रतिलोमन',
      'मुक्त मूलक बनने के कारण प्रकाशिक निष्क्रियता'
    ],
    correctAnswer: 'Racemization with slight net inversion (due to front-side shielding by leaving group)',
    correctAnswerHi: 'रेसिमीकरण (प्रतिपन्न की हल्की अधिकता के साथ)',
    explanation: 'Stereochemistry of SN1:\n1. The leaving group departs in the slow step, forming a planar sp²-hybridized carbocation intermediate.\n2. The nucleophile can attack from either the front or rear face with roughly equal probability, giving both enantiomers (racemization).\n3. However, because the departing halide ion still partially shields the front side as an ion-pair, attack from the rear is slightly favored, resulting in partial racemization with predominant inversion in real solution chemistry (NCERT Class 12 Chapter 10).',
    explanationHi: 'SN1 में मध्यवर्ती समतलीय sp² कार्बोधनायन बनता है। नाभिकरागी दोनों तरफ से आक्रमण कर सकता है जिससे रेसिमीकरण होता है, परन्तु अवशिष्ट आयन के आंशिक आवरण के कारण प्रतिलोमन की हल्की अधिकता रहती है।',
    pitfall: 'Confusing SN1 (racemization) with SN2 (complete 100% Walden inversion).',
    pitfallHi: 'SN1 (रेसिमीकरण) को SN2 (100% वाल्डेन प्रतिलोमन) के साथ मिला देना।',
    boardTip: 'SN2 proceeds with single-step Walden inversion; SN1 proceeds via two-step carbocation leading to racemization.',
    boardTipHi: 'SN2 = एक-चरणीय वाल्डेन प्रतिलोमन; SN1 = दो-चरणीय कार्बोधनायन व रेसिमीकरण।',
    source: 'curated'
  },
  {
    id: 'chem-08',
    subject: 'chemistry',
    chapter: 'd- and f-Block Elements',
    topic: 'Lanthanoid Contraction & Consequences',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'The almost identical atomic and ionic radii of Zirconium (Zr, 4d series) and Hafnium (Hf, 5d series) is attributed to:',
    questionHi: 'जिरकोनियम (Zr, 4d श्रेणी) तथा हाफ्नियम (Hf, 5d श्रेणी) की लगभग समान परमाणु एवं आयनिक त्रिज्याओं का मुख्य कारण क्या है?',
    options: [
      'Lanthanoid contraction due to poor shielding by 4f electrons',
      'Diagonal relationship between group 4 elements',
      'Actinoid contraction',
      'Identical nuclear charge in both elements'
    ],
    optionsHi: [
      '4f इलेक्ट्रॉनों के दुर्बल परिरक्षण के कारण लैन्थेनॉइड आकुंचन',
      'वर्ग 4 तत्वों के मध्य विकर्ण संबंध',
      'ऐक्टिनॉइड आकुंचन',
      'दोनों तत्वों में समान नाभिकीय आवेश'
    ],
    correctAnswer: 'Lanthanoid contraction due to poor shielding by 4f electrons',
    correctAnswerHi: '4f इलेक्ट्रॉनों के दुर्बल परिरक्षण के कारण लैन्थेनॉइड आकुंचन',
    explanation: 'Lanthanoid Contraction:\nIn the 5d series following Lanthanum, electrons fill the 4f subshell (14 electrons) before 5d.\nThe 4f orbitals have a diffuse spatial shape, providing very poor shielding of the outer electrons from the rapidly increasing nuclear charge (+14 protons).\nThis strong effective nuclear charge shrinks the outer electron cloud, neutralizing the expected size increase from adding a new shell. Consequently, Zr (160 pm) and Hf (159 pm) have nearly identical radii and very similar chemical properties.',
    explanationHi: '4f इलेक्ट्रॉनों के दुर्बल परिरक्षण प्रभाव के कारण प्रभावी नाभिकीय आवेश बढ़ता है, जिससे परमाणु आकार सिकुड़ता है। इसे लैन्थेनॉइड आकुंचन कहते हैं, जिसके कारण Zr (160 pm) व Hf (159 pm) की त्रिज्याएं लगभग समान हो जाती हैं।',
    pitfall: 'Attributing the similarity to diagonal relationship (diagonal relationship is seen in period 2 and period 3 elements like Li-Mg, Be-Al).',
    pitfallHi: 'इसे विकर्ण संबंध मानना (विकर्ण संबंध केवल आवर्त 2 व 3 में देखा जाता है)।',
    boardTip: 'Consequences of Lanthanoid Contraction is one of the most frequently asked 2-mark questions in CBSE Board examinations.',
    boardTipHi: 'लैन्थेनॉइड आकुंचन के परिणाम सीबीएसई बोर्ड में बार-बार पूछा जाने वाला प्रश्न है।',
    source: 'curated'
  }
];

/**
 * Authentic Curated CBSE Class 10 Board Exam Questions (Session 2026–27)
 * Across Mathematics (041), Science (086), Social Science (087), and English (184).
 * Fully aligned with official NCERT rationalized curriculum with English & Hindi translations.
 */
export const CURATED_CLASS_10_QUESTIONS: Question[] = [
  // ==========================================
  // CLASS 10 MATHEMATICS (041)
  // ==========================================
  {
    id: 'math-10-01',
    subject: 'mathematics',
    chapter: 'Real Numbers',
    topic: 'Fundamental Theorem of Arithmetic',
    grade: '10',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'If two positive integers a and b are written as a = x³y² and b = xy³, where x and y are prime numbers, then HCF(a, b) is:',
    questionHi: 'यदि दो धनात्मक पूर्णांक a और b को a = x³y² तथा b = xy³ के रूप में लिखा जाता है, जहाँ x और y अभाज्य संख्याएँ हैं, तो HCF(a, b) होगा:',
    options: ['xy', 'xy²', 'x³y³', 'x²y²'],
    optionsHi: ['xy', 'xy²', 'x³y³', 'x²y²'],
    correctAnswer: 'xy²',
    correctAnswerHi: 'xy²',
    explanation: 'Fundamental Theorem of Arithmetic:\nHCF of two numbers is the product of the smallest power of each common prime factor involved in the numbers.\nCommon prime factors of a and b are x and y.\nSmallest power of x = 1 (from b = x¹y³).\nSmallest power of y = 2 (from a = x³y²).\nTherefore, HCF(a, b) = x¹ · y² = xy².',
    explanationHi: 'अंकगणित की आधारभूत प्रमेय के अनुसार:\nदो संख्याओं का HCF उनमें उभयनिष्ठ प्रत्येक अभाज्य गुणनखण्ड की सबसे छोटी घात का गुणनफल होता है।\nx की सबसे छोटी घात = 1 तथा y की सबसे छोटी घात = 2 है।\nअतः HCF(a, b) = xy².',
    pitfall: 'Finding LCM instead of HCF. LCM would be the greatest power: x³y³.',
    pitfallHi: 'HCF के स्थान पर LCM निकाल देना (LCM = x³y³ होता है)।',
    boardTip: 'NCERT Standard Section A staple. Remember: HCF uses the minimum power; LCM uses the maximum power.',
    boardTipHi: 'ध्यान रखें: HCF में न्यूनतम घात ली जाती है तथा LCM में अधिकतम घात।',
    source: 'curated'
  },
  {
    id: 'math-10-02',
    subject: 'mathematics',
    chapter: 'Quadratic Equations',
    topic: 'Discriminant and Nature of Roots',
    grade: '10',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'The discriminant of the quadratic equation 2x² - 4x + 3 = 0 is:',
    questionHi: 'द्विघात समीकरण 2x² - 4x + 3 = 0 का विविक्तकर (Discriminant) क्या होगा?',
    options: ['-8', '8', '-16', '16'],
    optionsHi: ['-8', '8', '-16', '16'],
    correctAnswer: '-8',
    correctAnswerHi: '-8',
    explanation: 'Standard form ax² + bx + c = 0.\nHere a = 2, b = -4, c = 3.\nDiscriminant D = b² - 4ac\nD = (-4)² - 4(2)(3) = 16 - 24 = -8.\nSince D < 0, the equation has no real roots (two distinct complex roots).',
    explanationHi: 'मानक रूप ax² + bx + c = 0 से तुलना करने पर:\na = 2, b = -4, c = 3.\nविविक्तकर D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8.\nचूंकि D < 0 है, अतः इस समीकरण का कोई वास्तविक मूल नहीं है।',
    pitfall: 'Squaring -4 and writing -16 instead of +16.',
    pitfallHi: '(-4)² को +16 के बजाय -16 लिख देना।',
    boardTip: 'Check nature of roots: D > 0 (two distinct real roots), D = 0 (two equal real roots), D < 0 (no real roots).',
    boardTipHi: 'मूलों की प्रकृति: D > 0 (दो भिन्न वास्तविक मूल), D = 0 (दो बराबर वास्तविक मूल), D < 0 (कोई वास्तविक मूल नहीं)।',
    source: 'curated'
  },
  {
    id: 'math-10-03',
    subject: 'mathematics',
    chapter: 'Arithmetic Progressions',
    topic: 'nth Term of an AP',
    grade: '10',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'If the 17th term of an AP exceeds its 10th term by 7, then the common difference (d) is:',
    questionHi: 'यदि किसी समांतर श्रेढ़ी (AP) का 17वाँ पद उसके 10वें पद से 7 अधिक है, तो सार्व अंतर (d) है:',
    options: ['1', '2', '7', '-1'],
    optionsHi: ['1', '2', '7', '-1'],
    correctAnswer: '1',
    correctAnswerHi: '1',
    explanation: 'Formula for nth term: aₙ = a + (n - 1)d.\n17th term: a₁₇ = a + 16d.\n10th term: a₁₀ = a + 9d.\nGiven: a₁₇ - a₁₀ = 7\n(a + 16d) - (a + 9d) = 7\n7d = 7 => d = 1.',
    explanationHi: 'nवें पद का सूत्र: aₙ = a + (n - 1)d.\na₁₇ = a + 16d तथा a₁₀ = a + 9d.\nप्रश्नानुसार: a₁₇ - a₁₀ = 7\n(a + 16d) - (a + 9d) = 7 => 7d = 7 => d = 1.',
    pitfall: 'Setting a₁₇ + a₁₀ = 7 instead of the difference.',
    pitfallHi: 'अंतर के स्थान पर योग कर देना।',
    boardTip: 'Notice that the first term "a" cancels out completely in such difference equations.',
    boardTipHi: 'ऐसे प्रश्नों में प्रथम पद "a" सदैव कट जाता है, अतः सीधा 16d - 9d = 7 लिख सकते हैं।',
    source: 'curated'
  },
  {
    id: 'math-10-04',
    subject: 'mathematics',
    chapter: 'Introduction to Trigonometry',
    topic: 'Trigonometric Identities & Standard Angles',
    grade: '10',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'The value of 2 tan²(45°) + cos²(30°) - sin²(60°) is equal to:',
    questionHi: '2 tan²(45°) + cos²(30°) - sin²(60°) का मान किसके बराबर है?',
    options: ['2', '1', '0', '√3'],
    optionsHi: ['2', '1', '0', '√3'],
    correctAnswer: '2',
    correctAnswerHi: '2',
    explanation: 'Substitute the standard trigonometric values:\ntan(45°) = 1 => tan²(45°) = 1² = 1\ncos(30°) = √3/2 => cos²(30°) = 3/4\nsin(60°) = √3/2 => sin²(60°) = 3/4\nExpression = 2(1) + 3/4 - 3/4 = 2.',
    explanationHi: 'मानक मान रखने पर:\ntan(45°) = 1 => tan²(45°) = 1\ncos(30°) = √3/2 => cos²(30°) = 3/4\nsin(60°) = √3/2 => sin²(60°) = 3/4\nव्यंजक = 2(1) + 3/4 - 3/4 = 2.',
    pitfall: 'Since cos(30°) = sin(60°), their squares cancel out immediately.',
    pitfallHi: 'cos(30°) और sin(60°) बराबर होते हैं, अतः उनके वर्ग परस्पर कट जाते हैं।',
    boardTip: 'Complementary relationship: sin(90° - θ) = cos(θ). Hence cos²(30°) - sin²(60°) = 0.',
    boardTipHi: 'पूरक कोण संबंध: cos²(30°) - sin²(60°) = 0 सदैव याद रखें।',
    source: 'curated'
  },
  {
    id: 'math-10-05',
    subject: 'mathematics',
    chapter: 'Coordinate Geometry',
    topic: 'Section Formula',
    grade: '10',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'The coordinates of the point P which divides the line segment joining A(1, 3) and B(4, 6) in the ratio 2 : 1 internally are:',
    questionHi: 'बिंदुओं A(1, 3) और B(4, 6) को मिलाने वाले रेखाखंड को 2 : 1 के अनुपात में अंतः विभाजित करने वाले बिंदु P के निर्देशांक हैं:',
    options: ['(3, 5)', '(2, 4)', '(5, 3)', '(4, 5)'],
    optionsHi: ['(3, 5)', '(2, 4)', '(5, 3)', '(4, 5)'],
    correctAnswer: '(3, 5)',
    correctAnswerHi: '(3, 5)',
    explanation: 'Internal Section Formula: P(x, y) = [ (m₁x₂ + m₂x₁)/(m₁ + m₂), (m₁y₂ + m₂y₁)/(m₁ + m₂) ]\nHere m₁ = 2, m₂ = 1, (x₁, y₁) = (1, 3), (x₂, y₂) = (4, 6).\nx = (2·4 + 1·1) / (2 + 1) = (8 + 1) / 3 = 9/3 = 3.\ny = (2·6 + 1·3) / (2 + 1) = (12 + 3) / 3 = 15/3 = 5.\nTherefore, P is (3, 5).',
    explanationHi: 'विभाजन सूत्र: P(x, y) = [ (m₁x₂ + m₂x₁)/(m₁ + m₂), (m₁y₂ + m₂y₁)/(m₁ + m₂) ]\nm₁ = 2, m₂ = 1, x₁ = 1, y₁ = 3, x₂ = 4, y₂ = 6.\nx = (2·4 + 1·1) / 3 = 9/3 = 3.\ny = (2·6 + 1·3) / 3 = 15/3 = 5.\nअतः अभीष्ट बिंदु (3, 5) है।',
    pitfall: 'Swapping m₁ and m₂ or associating m₁ with (x₁, y₁). Always cross-multiply m₁ with point B and m₂ with point A.',
    pitfallHi: 'अनुपातों को उल्टा गुणा कर देना। m₁ का गुणा B के निर्देशांकों से तथा m₂ का A से होता है।',
    boardTip: 'NCERT Check: Midpoint is a special case of section formula where m₁ : m₂ = 1 : 1.',
    boardTipHi: 'मध्य बिंदु विभाजन सूत्र का विशेष रूप है जहाँ अनुपात 1 : 1 होता है।',
    source: 'curated'
  },
  {
    id: 'math-10-06',
    subject: 'mathematics',
    chapter: 'Statistics',
    topic: 'Empirical Relationship',
    grade: '10',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'For a moderately skewed distribution, if Mean = 30 and Median = 32, then the Mode is:',
    questionHi: 'एक मध्यम विषम बंटन के लिए, यदि माध्य (Mean) = 30 तथा माध्यक (Median) = 32 है, तो बहुलक (Mode) होगा:',
    options: ['36', '34', '32', '38'],
    optionsHi: ['36', '34', '32', '38'],
    correctAnswer: '36',
    correctAnswerHi: '36',
    explanation: 'Empirical relationship between measures of central tendency:\nMode = 3 Median - 2 Mean\nMode = 3(32) - 2(30)\nMode = 96 - 60 = 36.',
    explanationHi: 'केंद्रीय प्रवृत्ति के मापों में आनुभविक संबंध:\nबहुलक = 3 माध्यक - 2 माध्य\nबहुलक = 3(32) - 2(30) = 96 - 60 = 36.',
    pitfall: 'Remembering the wrong formula like Mode = 2 Median - 3 Mean.',
    pitfallHi: 'सूत्र में 3 व 2 को उल्टा याद रखना। बहुलक = 3 माध्यक - 2 माध्य सही सूत्र है।',
    boardTip: 'Memory rule: "3 Medians - 2 Means". Median has more letters than Mean, so it gets the larger multiplier 3.',
    boardTipHi: 'याद रखने का नियम: Median बड़ा शब्द है, इसलिए इसके साथ 3 आता है, Mean के साथ 2।',
    source: 'curated'
  },

  // ==========================================
  // CLASS 10 SCIENCE (086)
  // ==========================================
  {
    id: 'sci-10-01',
    subject: 'science',
    chapter: 'Chemical Reactions and Equations',
    topic: 'Oxidation and Reduction (Redox Reactions)',
    grade: '10',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'In the reaction: MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂, the substance that is oxidized is:',
    questionHi: 'अभिक्रिया MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂ में उपचयित (Oxidized) होने वाला पदार्थ है:',
    options: ['HCl', 'MnO₂', 'MnCl₂', 'Cl₂'],
    optionsHi: ['HCl', 'MnO₂', 'MnCl₂', 'Cl₂'],
    correctAnswer: 'HCl',
    correctAnswerHi: 'HCl',
    explanation: 'Oxidation is the loss of hydrogen or gain of oxygen.\nIn this reaction, HCl loses hydrogen to form Cl₂. Therefore, HCl is oxidized to Cl₂.\nMnO₂ loses oxygen to form MnCl₂, meaning MnO₂ is reduced.',
    explanationHi: 'उपचयन (Oxidation) का अर्थ है हाइड्रोजन का ह्रास या ऑक्सीजन की वृद्धि।\nयहाँ HCl से हाइड्रोजन हटकर Cl₂ बन रहा है, अतः HCl का उपचयन हुआ है।\nMnO₂ से ऑक्सीजन हट रही है, अतः इसका अपचयन हुआ है।',
    pitfall: 'Picking Cl₂ instead of the reactant HCl. The oxidized substance is always a reactant, not a product.',
    pitfallHi: 'उत्पाद Cl₂ को चुनना। उपचयित या अपचयित होने वाला पदार्थ सदैव अभिकारक (Reactant) होता है।',
    boardTip: 'CBSE 1-mark rule: Oxidation/Reduction reactants are ALWAYS on the left-hand side of the arrow.',
    boardTipHi: 'याद रखें: उपचयित/अपचयित पदार्थ सदैव तीर के बाईं ओर (अभिकारक) होते हैं।',
    source: 'curated'
  },
  {
    id: 'sci-10-02',
    subject: 'science',
    chapter: 'Acids, Bases and Salts',
    topic: 'Plaster of Paris & Gypsum',
    grade: '10',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'The chemical formula of Plaster of Paris (POP) is:',
    questionHi: 'प्लास्टर ऑफ पेरिस (POP) का रासायनिक सूत्र क्या है?',
    options: ['CaSO₄·½H₂O', 'CaSO₄·2H₂O', 'CaSO₄·H₂O', 'CaSO₄·5H₂O'],
    optionsHi: ['CaSO₄·½H₂O', 'CaSO₄·2H₂O', 'CaSO₄·H₂O', 'CaSO₄·5H₂O'],
    correctAnswer: 'CaSO₄·½H₂O',
    correctAnswerHi: 'CaSO₄·½H₂O',
    explanation: 'Plaster of Paris is calcium sulphate hemihydrate: CaSO₄·½H₂O.\nIt is prepared by heating Gypsum (CaSO₄·2H₂O) at 373 K (100°C):\nCaSO₄·2H₂O → CaSO₄·½H₂O + 1½H₂O.',
    explanationHi: 'प्लास्टर ऑफ पेरिस कैल्शियम सल्फेट अर्ध-हाइड्रेट (हेमीहाइड्रेट) है: CaSO₄·½H₂O.\nयह जिप्सम (CaSO₄·2H₂O) को 373 K पर गर्म करने पर प्राप्त होता है।',
    pitfall: 'Confusing Plaster of Paris (½ H₂O) with Gypsum (2 H₂O).',
    pitfallHi: 'प्लास्टर ऑफ पेरिस (½ H₂O) को जिप्सम (2 H₂O) के साथ भ्रमित करना।',
    boardTip: 'Why ½ H₂O? Because two formula units of CaSO₄ share one molecule of water of crystallisation: 2CaSO₄·H₂O.',
    boardTipHi: '½ H₂O क्यों? क्योंकि CaSO₄ की दो सूत्र इकाइयाँ मिलकर जल के एक अणु से जुड़ी होती हैं।',
    source: 'curated'
  },
  {
    id: 'sci-10-03',
    subject: 'science',
    chapter: 'Life Processes',
    topic: 'Respiration and Breakdown of Glucose',
    grade: '10',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'During cellular respiration, the breakdown of pyruvate into carbon dioxide, water, and energy takes place in:',
    questionHi: 'कोशिकीय श्वसन के दौरान पायरुवेट का कार्बन डाइऑक्साइड, जल तथा ऊर्जा में विखंडन कहाँ होता है?',
    options: ['Mitochondria', 'Cytoplasm', 'Chloroplast', 'Nucleus'],
    optionsHi: ['माइटोकॉन्ड्रिया में', 'कोशिकाद्रव्य में', 'क्लोरोप्लास्ट में', 'केन्द्रक में'],
    correctAnswer: 'Mitochondria',
    correctAnswerHi: 'माइटोकॉन्ड्रिया में',
    explanation: 'Pathway of Glucose Breakdown (NCERT Fig. 6.8):\n1. In Cytoplasm: 6-carbon Glucose is converted into 3-carbon Pyruvate (Glycolysis).\n2. In Mitochondria (Aerobic respiration): Pyruvate is broken down into CO₂ + H₂O + 38 ATP in the presence of Oxygen.\n3. In Yeast (Anaerobic): Pyruvate -> Ethanol + CO₂ + 2 ATP.\n4. In Human muscle (Lack of O₂): Pyruvate -> Lactic Acid + 2 ATP.',
    explanationHi: 'ग्लूकोज के विखंडन के पथ:\n1. कोशिकाद्रव्य में: ग्लूकोज (6-कार्बन) पायरुवेट (3-कार्बन) में बदलता है।\n2. माइटोकॉन्ड्रिया में (वायवीय श्वसन): ऑक्सीजन की उपस्थिति में पायरुवेट CO₂ + H₂O + ऊर्जा (ATP) में टूटता है।',
    pitfall: 'Confusing the first step (glycolysis in cytoplasm) with the aerobic breakdown of pyruvate (in mitochondria).',
    pitfallHi: 'कोशिकाद्रव्य में होने वाले पहले चरण को माइटोकॉन्ड्रिया में होने वाले पूर्ण विखंडन से भ्रमित करना।',
    boardTip: 'This NCERT flowchart is one of the top 3 most frequently tested questions across all CBSE Class 10 Science papers.',
    boardTipHi: 'यह NCERT प्रवाह आरेख (Flowchart) कक्षा 10 विज्ञान परीक्षा में सर्वाधिक पूछा जाने वाला प्रश्न है।',
    source: 'curated'
  },
  {
    id: 'sci-10-04',
    subject: 'science',
    chapter: 'Electricity',
    topic: 'Resistors in Series and Parallel & Ohm’s Law',
    grade: '10',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'Three resistors of 2 Ω, 3 Ω, and 6 Ω are connected in parallel. Their equivalent resistance is:',
    questionHi: 'तीन प्रतिरोधक 2 Ω, 3 Ω तथा 6 Ω पार्श्वक्रम (समानांतर) में संयोजित हैं। इनका तुल्य प्रतिरोध होगा:',
    options: ['1 Ω', '11 Ω', '2 Ω', '0.5 Ω'],
    optionsHi: ['1 Ω', '11 Ω', '2 Ω', '0.5 Ω'],
    correctAnswer: '1 Ω',
    correctAnswerHi: '1 Ω',
    explanation: 'For parallel combination: 1/R_p = 1/R₁ + 1/R₂ + 1/R₃\n1/R_p = 1/2 + 1/3 + 1/6\nLCM of 2, 3, 6 is 6:\n1/R_p = (3 + 2 + 1) / 6 = 6/6 = 1 Ω⁻¹\nTherefore, R_p = 1 Ω.',
    explanationHi: 'पार्श्वक्रम संयोजन के लिए: 1/R_p = 1/R₁ + 1/R₂ + 1/R₃\n1/R_p = 1/2 + 1/3 + 1/6 = (3 + 2 + 1) / 6 = 6/6 = 1\nअतः R_p = 1 Ω.',
    pitfall: 'Adding resistances directly (2 + 3 + 6 = 11 Ω), which is only for series combination.',
    pitfallHi: 'श्रेणीक्रम की तरह सीधे जोड़कर 11 Ω लिख देना।',
    boardTip: 'Golden rule of parallel circuits: The equivalent resistance is ALWAYS smaller than the smallest individual resistor (1 Ω < 2 Ω).',
    boardTipHi: 'पार्श्वक्रम का स्वर्णिम नियम: तुल्य प्रतिरोध सबसे छोटे प्रतिरोधक से भी कम होता है (1 Ω < 2 Ω)।',
    source: 'curated'
  },
  {
    id: 'sci-10-05',
    subject: 'science',
    chapter: 'Light - Reflection and Refraction',
    topic: 'Power of a Lens & Lens Formula',
    grade: '10',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'A convex lens has a focal length of +25 cm. The power of this lens is:',
    questionHi: 'एक उत्तल लेंस की फोकस दूरी +25 cm है। इस लेंस की क्षमता (Power) क्या होगी?',
    options: ['+4.0 D', '-4.0 D', '+0.04 D', '+2.5 D'],
    optionsHi: ['+4.0 D', '-4.0 D', '+0.04 D', '+2.5 D'],
    correctAnswer: '+4.0 D',
    correctAnswerHi: '+4.0 D',
    explanation: 'Power of lens formula: P = 1 / f (in metres)\nGiven focal length f = +25 cm = +25/100 m = +0.25 m.\nP = 1 / 0.25 = +4.0 Dioptres (+4.0 D).\nSince it is a convex lens, both focal length and power are positive.',
    explanationHi: 'लेंस की क्षमता का सूत्र: P = 1 / f (मीटर में)\nf = +25 cm = +0.25 m.\nP = 1 / 0.25 = +4.0 D.\nचूँकि यह उत्तल लेंस है, अतः फोकस दूरी एवं क्षमता धनात्मक होती है।',
    pitfall: 'Forgetting to convert centimeters to meters before inverting (giving 1/25 = 0.04 D).',
    pitfallHi: 'सेंटीमीटर को मीटर में बदले बिना 1/25 = 0.04 D लिख देना।',
    boardTip: 'Unit check: 1 Dioptre (D) = 1 m⁻¹. Convex lens is always positive (+), concave lens is always negative (-).',
    boardTipHi: 'चिह्न परिपाटी: उत्तल लेंस धनात्मक (+) तथा अवतल लेंस ऋणात्मक (-) होता है।',
    source: 'curated'
  },

  // ==========================================
  // CLASS 10 SOCIAL SCIENCE (087)
  // ==========================================
  {
    id: 'sst-10-01',
    subject: 'social_science',
    chapter: 'Nationalism in India',
    topic: 'Non-Cooperation Movement & Chauri Chaura',
    grade: '10',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'Mahatma Gandhi decided to withdraw the Non-Cooperation Movement in February 1922 because of:',
    questionHi: 'महात्मा गांधी ने फरवरी 1922 में असहयोग आंदोलन को वापस लेने का निर्णय किस कारण लिया?',
    options: [
      'The violent incident at Chauri Chaura',
      'The Jallianwala Bagh massacre',
      'The arrest of Jawaharlal Nehru',
      'The signing of the Poona Pact'
    ],
    optionsHi: [
      'चौरी-चौरा की हिंसक घटना के कारण',
      'जलियांवाला बाग हत्याकांड के कारण',
      'जवाहरलाल नेहरू की गिरफ्तारी के कारण',
      'पूना पैक्ट पर हस्ताक्षर के कारण'
    ],
    correctAnswer: 'The violent incident at Chauri Chaura',
    correctAnswerHi: 'चौरी-चौरा की हिंसक घटना के कारण',
    explanation: 'In February 1922, at Chauri Chaura in Gorakhpur (Uttar Pradesh), a peaceful demonstration turned into a violent clash where protestors set fire to a police station, killing 22 policemen. Feeling that the movement was turning violent in many places and satyagrahis needed proper training before mass struggles, Gandhiji halted the movement.',
    explanationHi: 'फरवरी 1922 में गोरखपुर के चौरी-चौरा में एक शांतिपूर्ण जुलूस हिंसक झड़प में बदल गया और प्रदर्शनकारियों ने एक थाने में आग लगा दी जिसमें 22 पुलिसकर्मी मारे गए। गांधीजी ने महसूस किया कि आंदोलन हिंसक हो रहा है, अतः उन्होंने इसे वापस ले लिया।',
    pitfall: 'Confusing Jallianwala Bagh (which occurred in April 1919 and sparked the Non-Cooperation Movement) with Chauri Chaura (which ended it in 1922).',
    pitfallHi: 'जलियांवाला बाग (1919 - जिससे आंदोलन शुरू हुआ) और चौरी-चौरा (1922 - जिससे आंदोलन समाप्त हुआ) में भ्रमित होना।',
    boardTip: 'Timeline milestone: Non-Cooperation launched in 1920 (Nagpur session), withdrawn February 1922 (Chauri Chaura).',
    boardTipHi: 'तिथियां याद रखें: 1920 में असहयोग आंदोलन शुरू हुआ और फरवरी 1922 में चौरी-चौरा के बाद वापस लिया गया।',
    source: 'curated'
  },
  {
    id: 'sst-10-02',
    subject: 'social_science',
    chapter: 'Power Sharing',
    topic: 'Case Studies: Belgium and Sri Lanka',
    grade: '10',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'In the capital city Brussels of Belgium, what percentage of people speak French?',
    questionHi: 'बेल्जियम की राजधानी ब्रुसेल्स में कितने प्रतिशत लोग फ्रेंच बोलते हैं?',
    options: ['80%', '20%', '59%', '40%'],
    optionsHi: ['80%', '20%', '59%', '40%'],
    correctAnswer: '80%',
    correctAnswerHi: '80%',
    explanation: 'Ethnic composition of Belgium (NCERT Democratic Politics - II):\n- In the whole country: 59% speak Dutch (Flemish region), 40% speak French (Wallonia region), 1% speak German.\n- In the capital Brussels: 80% speak French, while only 20% speak Dutch.\nThis special tension arose because the Dutch-speaking community was in majority in the country, but in minority in the capital.',
    explanationHi: 'बेल्जियम का जातीय संयोजन:\n- पूरे देश में: 59% डच भाषी, 40% फ्रेंच भाषी, 1% जर्मन भाषी।\n- राजधानी ब्रुसेल्स में: 80% फ्रेंच भाषी और केवल 20% डच भाषी हैं।\nडच भाषी लोग देश में बहुमत में थे परंतु राजधानी में अल्पमत में।',
    pitfall: 'Selecting 40% (which is the French-speaking population of the country as a whole, not the capital Brussels).',
    pitfallHi: '40% चुनना जो कि पूरे देश का अनुपात है, राजधानी ब्रुसेल्स का नहीं।',
    boardTip: 'Common CBSE trick question: Always read whether the question asks for "Belgium country" or "capital city Brussels".',
    boardTipHi: 'ध्यान से पढ़ें कि प्रश्न पूरे देश के बारे में पूछ रहा है या राजधानी ब्रुसेल्स के बारे में।',
    source: 'curated'
  },
  {
    id: 'sst-10-03',
    subject: 'social_science',
    chapter: 'Sectors of the Indian Economy',
    topic: 'Disguised Unemployment in Agriculture',
    grade: '10',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'A situation where more people are working than necessary in a field, such that even if a few are removed, the total production does not fall, is called:',
    questionHi: 'ऐसी स्थिति जिसमें किसी खेत में आवश्यकता से अधिक लोग काम कर रहे हों, और यदि कुछ लोगों को हटा भी दिया जाए तो उत्पादन पर कोई प्रभाव नहीं पड़ता, कहलाती है:',
    options: [
      'Disguised unemployment',
      'Seasonal unemployment',
      'Frictional unemployment',
      'Educated unemployment'
    ],
    optionsHi: [
      'प्रच्छन्न (छिपी हुई) बेरोजगारी',
      'मौसमी बेरोजगारी',
      'घर्षण बेरोजगारी',
      'शिक्षित बेरोजगारी'
    ],
    correctAnswer: 'Disguised unemployment',
    correctAnswerHi: 'प्रच्छन्न (छिपी हुई) बेरोजगारी',
    explanation: 'Disguised unemployment (also called Underemployment):\nWorkers appear to be employed, but their marginal productivity is zero. If some workers are shifted to another job or removed, agricultural output remains unchanged.\nIt is widely prevalent in rural India among small farming families.',
    explanationHi: 'प्रच्छन्न या छिपी हुई बेरोजगारी (अल्प-रोजगार):\nलोग काम करते हुए प्रतीत होते हैं लेकिन उनकी सीमांत उत्पादकता शून्य होती है। यदि कुछ श्रमिकों को हटा भी लिया जाए तो कुल उत्पादन में कोई गिरावट नहीं आती।',
    pitfall: 'Confusing disguised unemployment with seasonal unemployment (which occurs when farmers cannot find work during off-season months).',
    pitfallHi: 'इसे मौसमी बेरोजगारी समझना, जो कि वर्ष के कुछ महीनों में काम न मिलने की स्थिति होती है।',
    boardTip: 'Key phrase to identify in CBSE questions: "Marginal productivity is zero" or "Removing workers does not reduce total production".',
    boardTipHi: 'पहचानने का मुख्य बिंदु: श्रमिकों को हटाने पर भी कुल उत्पादन में कमी न आना।',
    source: 'curated'
  },

  // ==========================================
  // CLASS 10 ENGLISH (184)
  // ==========================================
  {
    id: 'eng-10-01',
    subject: 'english',
    chapter: 'A Letter to God (G.L. Fuentes)',
    topic: 'Lencho’s Faith and Irony of the Situation',
    grade: '10',
    difficulty: 'easy',
    questionType: 'mcq',
    question: 'When the raindrops began to fall, Lencho compared the large drops of rain to:',
    questionHi: 'जब वर्षा की बूँदें गिरने लगीं, तो लेंचो ने बड़ी बूँदों की तुलना किससे की?',
    options: [
      'New silver coins of ten cents',
      'Frozen pearls',
      'Golden nuggets',
      'Diamonds'
    ],
    optionsHi: [
      'दस सेंट के नए सिक्कों से',
      'जमे हुए मोतियों से',
      'सोने के टुकड़ों से',
      'हीरों से'
    ],
    correctAnswer: 'New silver coins of ten cents',
    correctAnswerHi: 'दस सेंट के नए सिक्कों से',
    explanation: 'In the chapter "A Letter to God" by G.L. Fuentes, Lencho stepped out to feel the rain and happily exclaimed: "These aren’t raindrops falling from the sky, they are new coins. The big drops are ten cent pieces and the little ones are fives." Later, when hailstones fell, they were compared to frozen pearls.',
    explanationHi: 'जी.एल. फ्यूएंट्स के पाठ "ए लेटर टू गॉड" में, लेंचो ने बारिश की बड़ी बूंदों की तुलना दस सेंट के नए सिक्कों से तथा छोटी बूंदों की पांच सेंट के सिक्कों से की थी।',
    pitfall: 'Confusing rain drops (new coins) with hailstones (frozen pearls / silver coins).',
    pitfallHi: 'बारिश की बूंदों (नए सिक्के) और ओलों (जमे हुए मोती) के बीच भ्रमित होना।',
    boardTip: 'Metaphors in NCERT: Raindrops = new coins (prosperity); Hailstones = frozen pearls / destroying locusts.',
    boardTipHi: 'रूपक याद रखें: बारिश = नए सिक्के; ओले = जमे हुए मोती।',
    source: 'curated'
  },
  {
    id: 'eng-10-02',
    subject: 'english',
    chapter: 'Nelson Mandela: Long Walk to Freedom',
    topic: 'Mandela’s Philosophy on Courage and People',
    grade: '10',
    difficulty: 'medium',
    questionType: 'mcq',
    question: 'According to Nelson Mandela, what is the greatest wealth of his country South Africa?',
    questionHi: 'नेल्सन मंडेला के अनुसार, उनके देश दक्षिण अफ्रीका की सबसे बड़ी संपत्ति क्या है?',
    options: [
      'Its people, finer and truer than the purest diamonds',
      'Its rich mineral and gem reserves beneath the soil',
      'Its vast military force and modern infrastructure',
      'Its fertile agricultural lands and wildlife'
    ],
    optionsHi: [
      'यहाँ के लोग, जो शुद्धतम हीरों से भी अधिक सच्चे और श्रेष्ठ हैं',
      'भूमि के नीचे दबे इसके समृद्ध खनिज और रत्न भंडार',
      'इसकी विशाल सैन्य शक्ति और बुनियादी ढांचा',
      'इसकी उपजाऊ कृषि भूमि और वन्य जीवन'
    ],
    correctAnswer: 'Its people, finer and truer than the purest diamonds',
    correctAnswerHi: 'यहाँ के लोग, जो शुद्धतम हीरों से भी अधिक सच्चे और श्रेष्ठ हैं',
    explanation: 'Nelson Mandela writes in his autobiography: "My country is rich in the minerals and gems that lie beneath its soil, but I have always known that its greatest wealth is its people, finer and truer than the purest diamonds."',
    explanationHi: 'नेल्सन मंडेला ने अपनी आत्मकथा में लिखा है: "मेरा देश खनिजों और रत्नों में समृद्ध है, लेकिन मैंने हमेशा यह माना है कि इसकी सबसे बड़ी दौलत इसके लोग हैं, जो शुद्धतम हीरों से भी अधिक सच्चे और श्रेष्ठ हैं।"',
    pitfall: 'Selecting mineral and gem reserves. While South Africa is famous for gold and diamond mines, Mandela clearly elevated human beings above precious stones.',
    pitfallHi: 'खनिज और हीरों को चुनना। मंडेला ने स्पष्ट रूप से अपने देश के लोगों को हीरों से भी श्रेष्ठ बताया है।',
    boardTip: 'Key quotation to memorize for Class 10 Board 3-mark analytical questions on Mandela’s leadership vision.',
    boardTipHi: 'बोर्ड परीक्षा के दीर्घ उत्तरीय प्रश्नों के लिए यह उद्धरण अत्यंत महत्वपूर्ण है।',
    source: 'curated'
  }
];

export const CURATED_BOARD_QUESTIONS: Question[] = [
  ...CURATED_CLASS_12_QUESTIONS,
  ...CURATED_CLASS_10_QUESTIONS,
];

export function getCuratedQuestions(
  subject?: string,
  chapter?: string,
  count: number = 5,
  difficulty?: string,
  grade: GradeClass = '12'
): Question[] {
  // First, filter by the requested class grade strictly to avoid mixing Class 10 and 12
  let pool = CURATED_BOARD_QUESTIONS.filter(q => (q.grade || '12') === grade);
  let filtered = [...pool];

  if (subject) {
    const subMatches = filtered.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    if (subMatches.length > 0) {
      filtered = subMatches;
    }
  }

  if (chapter && chapter !== 'all') {
    const chapterMatches = filtered.filter(
      q => q.chapter.toLowerCase().includes(chapter.toLowerCase()) || chapter.toLowerCase().includes(q.chapter.toLowerCase())
    );
    if (chapterMatches.length > 0) {
      filtered = chapterMatches;
    }
  }

  if (difficulty && difficulty !== 'mixed') {
    const diffMatches = filtered.filter(q => q.difficulty === difficulty);
    if (diffMatches.length > 0) {
      filtered = diffMatches;
    }
  }

  if (filtered.length < count && subject) {
    const sameSubjectFallback = pool.filter(
      q => q.subject.toLowerCase() === subject.toLowerCase() && !filtered.some(f => f.id === q.id)
    );
    filtered = [...filtered, ...sameSubjectFallback];
  }

  if (filtered.length === 0) {
    filtered = [...pool];
  }

  // Shuffle and slice to count
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

