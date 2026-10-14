import { SubjectId } from '../types/quiz';

export interface Flashcard {
  id: string;
  subject: SubjectId;
  chapter: string;
  topic: string;
  front: string;
  frontHi?: string;
  back: string;
  backHi?: string;
  formula?: string;
  keyPoint?: string;
}

export const CBSE_FLASHCARDS: Flashcard[] = [
  // Mathematics
  {
    id: 'fc-m-1',
    subject: 'mathematics',
    chapter: 'Relations and Functions',
    topic: 'Equivalence Relation',
    front: 'What conditions must a relation R on set A satisfy to be an Equivalence Relation?',
    frontHi: 'समुच्चय A पर संबंध R को तुल्यता संबंध (Equivalence Relation) होने के लिए किन शर्तों को पूरा करना होगा?',
    back: '1. Reflexive: (a, a) ∈ R for all a ∈ A.\n2. Symmetric: (a, b) ∈ R ⇒ (b, a) ∈ R.\n3. Transitive: (a, b) ∈ R and (b, c) ∈ R ⇒ (a, c) ∈ R.',
    backHi: '1. स्वतुल्य: प्रत्येक a ∈ A के लिए (a, a) ∈ R.\n2. सममित: (a, b) ∈ R ⇒ (b, a) ∈ R.\n3. संक्रामक: (a, b) ∈ R तथा (b, c) ∈ R ⇒ (a, c) ∈ R.',
    keyPoint: 'CBSE Board favorite: Always check for empty relation or counter-example when proving not transitive.'
  },
  {
    id: 'fc-m-2',
    subject: 'mathematics',
    chapter: 'Matrices',
    topic: 'Skew-Symmetric Matrix Properties',
    front: 'What is a Skew-Symmetric Matrix, and what can be said about its diagonal elements?',
    frontHi: 'विषम-सममित आव्यूह (Skew-Symmetric Matrix) क्या है और इसके विकर्ण अवयवों के बारे में क्या कहा जा सकता है?',
    back: 'A matrix A is skew-symmetric if Aᵀ = -A.\nAll diagonal elements of a skew-symmetric matrix are strictly ZERO (since aᵢᵢ = -aᵢᵢ ⇒ 2aᵢᵢ = 0).',
    backHi: 'आव्यूह A विषम-सममित होता है यदि Aᵀ = -A.\nइसके सभी मुख्य विकर्ण अवयव अनिवार्यतः शून्य (0) होते हैं।',
    formula: 'Aᵀ = -A, aᵢᵢ = 0'
  },
  {
    id: 'fc-m-3',
    subject: 'mathematics',
    chapter: 'Determinants',
    topic: 'Adjoint & Inverse Theorem',
    front: 'State the relation between a square matrix A, its adjoint adj(A), and its determinant |A|.',
    frontHi: 'वर्ग आव्यूह A, इसके सहखंडज adj(A) तथा सारणिक |A| के बीच संबंध बताएं।',
    back: 'A · adj(A) = adj(A) · A = |A| · Iₙ\nAlso: |adj(A)| = |A|ⁿ⁻¹ where n is matrix order.',
    backHi: 'A · adj(A) = adj(A) · A = |A| · Iₙ\nतथा |adj(A)| = |A|ⁿ⁻¹ (जहाँ n आव्यूह की कोटि है)।',
    formula: 'A · adj(A) = |A| Iₙ, |adj(A)| = |A|ⁿ⁻¹'
  },
  {
    id: 'fc-m-4',
    subject: 'mathematics',
    chapter: 'Integrals',
    topic: 'Integration by Parts (ILATE)',
    front: 'What is the formula for Integration by Parts and the order of function selection?',
    frontHi: 'खंडशः समाकलन (Integration by Parts) का सूत्र और फलनों के चयन का क्रम क्या है?',
    back: '∫ u·v dx = u ∫ v dx - ∫ [ (du/dx) · ∫ v dx ] dx\nPriority rule: ILATE (Inverse, Logarithmic, Algebraic, Trigonometric, Exponential).',
    backHi: '∫ u·v dx = u ∫ v dx - ∫ [ (du/dx) · ∫ v dx ] dx\nप्राथमिकता नियम: ILATE (प्रतिलोम, लघुगणकीय, बीजगणितीय, त्रिकोणमितीय, चरघातांकी)।',
    formula: '∫ u·v dx = u ∫ v dx - ∫ [ u\' ∫ v dx ] dx'
  },
  {
    id: 'fc-m-5',
    subject: 'mathematics',
    chapter: 'Vectors',
    topic: 'Cross Product & Angle',
    front: 'How is the Vector (Cross) Product defined and what does |a × b| geometrically represent?',
    frontHi: 'सदिश गुणनफल (a × b) कैसे परिभाषित है और |a × b| ज्यामितीय रूप से क्या दर्शाता है?',
    back: 'a × b = |a||b| sin θ n̂ (where n̂ is perpendicular unit vector by right-hand thumb rule).\nGeometrically, |a × b| is the area of a parallelogram with adjacent sides a and b.',
    backHi: 'a × b = |a||b| sin θ n̂\nज्यामितीय रूप से |a × b| संलग्न भुजाओं a तथा b वाले समांतर चतुर्भुज का क्षेत्रफल है।',
    formula: '|a × b| = |a||b| sin θ'
  },
  {
    id: 'fc-m-6',
    subject: 'mathematics',
    chapter: 'Probability',
    topic: "Bayes' Theorem",
    front: "State Bayes' Theorem for finding posterior probability P(Eᵢ | A).",
    frontHi: "पश्च प्रायिकता P(Eᵢ | A) ज्ञात करने हेतु बेज़ प्रमेय (Bayes' Theorem) बताएं।",
    back: "P(Eᵢ | A) = [ P(Eᵢ) · P(A | Eᵢ) ] / ∑ [ P(Eⱼ) · P(A | Eⱼ) ]\nApplies when events E₁, E₂, ... form a partition of sample space S.",
    backHi: "P(Eᵢ | A) = [ P(Eᵢ) · P(A | Eᵢ) ] / ∑ [ P(Eⱼ) · P(A | Eⱼ) ]",
    formula: "P(Eᵢ|A) = P(Eᵢ)P(A|Eᵢ) / ∑ P(Eⱼ)P(A|Eⱼ)"
  },

  // Physics
  {
    id: 'fc-p-1',
    subject: 'physics',
    chapter: 'Electric Charges and Fields',
    topic: "Gauss's Law",
    front: "State Gauss's Law in electrostatics and its mathematical form.",
    frontHi: "स्थिरवैद्युतिकी में गाउस का नियम एवं इसका गणितीय रूप बताएं।",
    back: 'The total electric flux through any closed surface is equal to 1/ε₀ times the net charge enclosed by the surface.\nΦ = ∮ E · dA = q_enclosed / ε₀',
    backHi: 'किसी बंद पृष्ठ से गुजरने वाला कुल वैद्युत फ्लक्स उस पृष्ठ द्वारा परिबद्ध कुल आवेश का 1/ε₀ गुना होता है।\nΦ = ∮ E · dA = q_enclosed / ε₀',
    formula: 'Φ = ∮ E · dA = q_in / ε₀'
  },
  {
    id: 'fc-p-2',
    subject: 'physics',
    chapter: 'Electrostatic Potential and Capacitance',
    topic: 'Parallel Plate Capacitor',
    front: 'What is the capacitance of a parallel plate capacitor with dielectric constant K?',
    frontHi: 'परावैद्युतांक K वाली समानांतर पट्टिका संधारित्र की धारिता क्या होती है?',
    back: 'C = (K · ε₀ · A) / d\nWithout dielectric: C₀ = (ε₀ · A) / d.\nCapacitance increases by factor K when dielectric fills space between plates.',
    backHi: 'C = (K · ε₀ · A) / d\nवायु संधारित्र: C₀ = (ε₀ · A) / d.\nपरावैद्युत भरने पर धारिता K गुना बढ़ जाती है।',
    formula: 'C = K ε₀ A / d'
  },
  {
    id: 'fc-p-3',
    subject: 'physics',
    chapter: 'Current Electricity',
    topic: "Kirchhoff's Laws",
    front: "State Kirchhoff's First Law (Junction Rule) and Second Law (Loop Rule).",
    frontHi: "किरचॉफ का प्रथम नियम (संधि नियम) तथा द्वितीय नियम (पाश नियम) बताएं।",
    back: "1. Junction Rule: ∑ I = 0 at any junction (Conservation of Charge).\n2. Loop Rule: ∑ ΔV = 0 around any closed circuit loop (Conservation of Energy).",
    backHi: "1. संधि नियम: किसी संधि पर मिलने वाली सभी धाराओं का बीजगणितीय योग शून्य होता है (आवेश संरक्षण)।\n2. लूप नियम: किसी बंद परिपथ में विभव परिवर्तनों का कुल योग शून्य होता है (ऊर्जा संरक्षण)।",
    keyPoint: 'Junction rule = Conservation of Charge; Loop rule = Conservation of Energy.'
  },
  {
    id: 'fc-p-4',
    subject: 'physics',
    chapter: 'Electromagnetic Induction',
    topic: "Faraday's and Lenz's Law",
    front: "State Faraday's Law of Electromagnetic Induction and Lenz's Law.",
    frontHi: "फैराडे का वैद्युतचुंबकीय प्रेरण का नियम एवं लेन्ज का नियम बताएं।",
    back: "Induced emf ε = -dΦ_B / dt\nLenz's Law: The polarity of induced emf is such that it produces a current that opposes the change in magnetic flux that produced it (Conservation of Energy).",
    backHi: "प्रेरित वि.वा.बल ε = -dΦ_B / dt\nलेन्ज का नियम: प्रेरित वि.वा.बल की दिशा सदैव ऐसी होती है कि वह उस कारण का विरोध करती है जिससे वह स्वयं उत्पन्न होती है (ऊर्जा संरक्षण)।",
    formula: 'ε = -N (dΦ_B / dt)'
  },
  {
    id: 'fc-p-5',
    subject: 'physics',
    chapter: 'Ray Optics and Optical Instruments',
    topic: "Lens Maker's Formula",
    front: "What is the Lens Maker's Formula?",
    frontHi: "लेंस निर्माता सूत्र (Lens Maker's Formula) क्या है?",
    back: '1/f = (μ - 1) [ (1/R₁) - (1/R₂) ]\nwhere μ = refractive index of lens material relative to medium, R₁ & R₂ are radii of curvature with proper sign convention.',
    backHi: '1/f = (μ - 1) [ (1/R₁) - (1/R₂) ]\nजहाँ μ माध्यम के सापेक्ष लेंस का अपवर्तनांक है तथा R₁, R₂ वक्रता त्रिज्याएँ हैं।',
    formula: '1/f = (μ - 1) (1/R₁ - 1/R₂)'
  },
  {
    id: 'fc-p-6',
    subject: 'physics',
    chapter: 'Dual Nature of Radiation and Matter',
    topic: 'de Broglie Wavelength',
    front: 'What is the de Broglie wavelength of an electron accelerated through potential difference V?',
    frontHi: 'V विभवांतर से त्वरित किसी इलेक्ट्रॉन की दे ब्रॉग्ली तरंगदैर्घ्य क्या होती है?',
    back: 'λ = h / p = h / √(2m·e·V)\nFor an electron: λ ≈ 1.227 / √V nm (or 12.27 / √V Å).',
    backHi: 'λ = h / p = h / √(2m·e·V)\nइलेक्ट्रॉन के लिए: λ ≈ 1.227 / √V nm (या 12.27 / √V Å)।',
    formula: 'λ = 1.227 / √V nm'
  },

  // Chemistry
  {
    id: 'fc-c-1',
    subject: 'chemistry',
    chapter: 'Solutions',
    topic: "Raoult's Law & Colligative Properties",
    front: "State Raoult's Law for volatile solutes and the formula for Relative Lowering of Vapour Pressure.",
    frontHi: "वाष्पशील विलेय हेतु राउल्ट का नियम तथा वाष्प दाब के आपेक्षिक अवनमन का सूत्र बताएं।",
    back: 'For a solution of volatile liquids, partial vapour pressure of each component is directly proportional to its mole fraction: p₁ = p₁° · x₁.\nRelative lowering: (p₁° - p₁) / p₁° = x₂ = n₂ / (n₁ + n₂).',
    backHi: 'प्रत्येक घटक का आंशिक वाष्प दाब उसके मोल अंश के समानुपाती होता है: p₁ = p₁° · x₁.\nआपेक्षिक अवनमन: (p₁° - p₁) / p₁° = x₂',
    formula: '(p₁° - p₁) / p₁° = x₂'
  },
  {
    id: 'fc-c-2',
    subject: 'chemistry',
    chapter: 'Electrochemistry',
    topic: 'Nernst Equation',
    front: 'State the Nernst Equation for a general cell reaction at 298 K.',
    frontHi: '298 K ताप पर सामान्य सेल अभिक्रिया के लिए नर्नस्ट समीकरण बताएं।',
    back: 'E_cell = E°_cell - (0.0591 / n) · log₁₀ Q\nwhere n = number of moles of electrons transferred, Q = reaction quotient = [Products] / [Reactants].',
    backHi: 'E_cell = E°_cell - (0.0591 / n) · log₁₀ Q\nजहाँ n = स्थानांतरित इलेक्ट्रॉनों की संख्या, Q = अभिक्रिया भागफल।',
    formula: 'E_cell = E°_cell - (0.0591 / n) log Q'
  },
  {
    id: 'fc-c-3',
    subject: 'chemistry',
    chapter: 'Chemical Kinetics',
    topic: 'First Order Kinetics & Half-Life',
    front: 'What is the integrated rate equation and half-life for a First-Order Reaction?',
    frontHi: 'प्रथम कोटि की अभिक्रिया के लिए समाकलित वेग समीकरण तथा अर्ध-आयु काल क्या है?',
    back: 'k = (2.303 / t) · log₁₀ [R]₀ / [R]\nHalf-life: t₁/₂ = 0.693 / k\nNotice: First order half-life is completely independent of initial reactant concentration [R]₀.',
    backHi: 'k = (2.303 / t) · log₁₀ [R]₀ / [R]\nt₁/₂ = 0.693 / k\nमहत्वपूर्ण: प्रथम कोटि की अर्ध-आयु प्रारंभिक सांद्रता [R]₀ पर निर्भर नहीं करती।',
    formula: 't₁/₂ = 0.693 / k'
  },
  {
    id: 'fc-c-4',
    subject: 'chemistry',
    chapter: 'Coordination Compounds',
    topic: 'Crystal Field Splitting in Octahedral Complexes',
    front: 'How do d-orbitals split in an octahedral crystal field?',
    frontHi: 'अष्टफलकीय क्रिस्टल क्षेत्र में d-कक्षक किस प्रकार विभाजित होते हैं?',
    back: 'Degenerate d-orbitals split into two sets:\n1. Lower energy t₂g set (d_xy, d_yz, d_zx) stabilized by -0.4 Δ₀.\n2. Higher energy eg set (d_x²-y², d_z²) destabilized by +0.6 Δ₀.\nEnergy difference between eg and t₂g is Δ₀.',
    backHi: 'd-कक्षक दो समूहों में विभाजित होते हैं:\n1. निम्न ऊर्जा t₂g कक्षक (d_xy, d_yz, d_zx) [-0.4 Δ₀]\n2. उच्च ऊर्जा eg कक्षक (d_x²-y², d_z²) [+0.6 Δ₀]',
    formula: 'Δ₀ = E(eg) - E(t₂g)'
  },
  {
    id: 'fc-c-5',
    subject: 'chemistry',
    chapter: 'Aldehydes, Ketones and Carboxylic Acids',
    topic: 'Aldol Condensation vs Cannizzaro Reaction',
    front: 'What is the key structural requirement distinguishing Aldol Condensation from Cannizzaro Reaction?',
    frontHi: 'ऐल्डोल संघनन और कैनिजारो अभिक्रिया के बीच मुख्य संरचनात्मक अंतर क्या है?',
    back: '• Aldol Condensation requires aldehydes/ketones having at least ONE α-hydrogen (in presence of dil. NaOH).\n• Cannizzaro Reaction occurs in aldehydes having NO α-hydrogen (e.g. HCHO, PhCHO) in conc. KOH (disproportionation into alcohol + carboxylate).',
    backHi: '• ऐल्डोल संघनन: कम से कम एक α-हाइड्रोजन आवश्यक (तनु NaOH)।\n• कैनिजारो अभिक्रिया: कोई α-हाइड्रोजन नहीं (जैसे HCHO, C₆H₅CHO) (सांद्र KOH)।',
    keyPoint: 'HCHO and C₆H₅CHO undergo Cannizzaro; CH₃CHO undergoes Aldol.'
  }
];
