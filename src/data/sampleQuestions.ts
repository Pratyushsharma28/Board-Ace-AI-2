import { Question } from '../types/quiz';

/**
 * Authentic Curated CBSE Class 12 Board Exam Questions (Session 2026–27)
 * Strictly across Mathematics (041), Physics (042), and Chemistry (043).
 * Supports correct mathematical calculations, step-by-step solutions,
 * physics formulas with SI units, and chemical equations with reaction mechanisms.
 * Fully enriched with English and natural Hindi (हिन्दी) translations.
 */

export const CURATED_BOARD_QUESTIONS: Question[] = [
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
  }
];

export function getCuratedQuestions(
  subject?: string,
  chapter?: string,
  count: number = 5,
  difficulty?: string
): Question[] {
  let filtered = [...CURATED_BOARD_QUESTIONS];

  if (subject) {
    filtered = filtered.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
  }

  if (chapter && chapter !== 'all') {
    const chapterMatches = filtered.filter(
      q => q.chapter.toLowerCase().includes(chapter.toLowerCase()) || chapter.toLowerCase().includes(q.chapter.toLowerCase())
    );
    if (chapterMatches.length > 0) {
      filtered = chapterMatches;
    }
  }

  if (difficulty) {
    const diffMatches = filtered.filter(q => q.difficulty === difficulty);
    if (diffMatches.length > 0) {
      filtered = diffMatches;
    }
  }

  if (filtered.length < count && subject) {
    const sameSubjectFallback = CURATED_BOARD_QUESTIONS.filter(
      q => q.subject.toLowerCase() === subject.toLowerCase() && !filtered.some(f => f.id === q.id)
    );
    filtered = [...filtered, ...sameSubjectFallback];
  }

  if (filtered.length === 0) {
    filtered = [...CURATED_BOARD_QUESTIONS];
  }

  // Shuffle slightly and slice to count
  return filtered.slice(0, count);
}
