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
  },

  // =========================================================================
  // CLASS 12 COMMERCE: ACCOUNTANCY (055)
  // =========================================================================
  {
    id: 'fc-acc-1',
    subject: 'accountancy',
    chapter: 'Accounting for Partnership Firms - Fundamentals',
    topic: 'Rules Applicable in Absence of Partnership Deed',
    front: 'What statutory accounting provisions apply if partners have NO written Partnership Deed?',
    frontHi: 'साझेदारी संलेख (Partnership Deed) के अभाव में कौन से लेखांकन नियम लागू होते हैं?',
    back: '1. Profit/Loss Sharing: Strictly EQUAL (1 : 1).\n2. Interest on Capital: NOT allowed.\n3. Interest on Drawings: NOT charged.\n4. Salary / Commission to Partner: NOT payable.\n5. Interest on Partner’s Loan to Firm: Allowed @ 6% p.a.',
    backHi: '1. लाभ-हानि विभाजन: बराबर (1:1)।\n2. पूंजी पर ब्याज: नहीं दिया जाएगा।\n3. आहरण पर ब्याज: नहीं लिया जाएगा।\n4. पारिश्रमिक/कमीशन: नहीं देय।\n5. साझेदार के ऋण पर ब्याज: 6% प्रतिवर्ष की दर से अनिवार्य।',
    keyPoint: 'Interest on partner loan is a CHARGE against profit (debited to P&L A/c, not P&L Appropriation A/c).'
  },
  {
    id: 'fc-acc-2',
    subject: 'accountancy',
    chapter: 'Goodwill: Nature and Valuation',
    topic: 'Goodwill Valuation: Capitalisation & Super Profit Methods',
    front: 'State the formulas for Goodwill under (a) Super Profit Method and (b) Capitalisation of Average Profit.',
    frontHi: 'ख्याति के मूल्यांकन के सूत्र बताएं: (क) अधिलाभ विधि (Super Profit) और (ख) औसत लाभ का पूंजीकरण।',
    back: '• Super Profit = Average Maintainable Profit - Normal Profit (where Normal Profit = Capital Employed × Normal Rate / 100).\nGoodwill = Super Profit × Number of Years’ Purchase.\n• Capitalisation of Average Profit: Goodwill = Capitalised Value of Business - Net Assets (Capital Employed), where Capitalised Value = (Average Profit / Normal Rate) × 100.',
    backHi: '• अधिलाभ = औसत लाभ - सामान्य लाभ (सामान्य लाभ = विनियोजित पूंजी × सामान्य दर / 100)।\nख्याति = अधिलाभ × क्रय वर्षों की संख्या।\n• पूंजीकरण विधि: ख्याति = व्यवसाय का पूंजीकृत मूल्य - शुद्ध संपत्तियां।',
    formula: 'Goodwill = Super Profit × No. of Years’ Purchase'
  },
  {
    id: 'fc-acc-3',
    subject: 'accountancy',
    chapter: 'Accounting for Share Capital',
    topic: 'Forfeiture & Reissue of Shares',
    front: 'When shares are forfeited, which account is debited and how is Capital Reserve calculated upon reissue?',
    frontHi: 'अंशों के हरण पर कौन सा खाता डेबिट किया जाता है और पुनर्निर्गमन पर पूंजी संचय (Capital Reserve) की गणना कैसे होती है?',
    back: '1. Share Capital A/c is DEBITED with Called-up value on forfeited shares.\n2. Shares Forfeited A/c is CREDITED with amount actually received towards face value.\n3. Unpaid calls are credited to Calls-in-Arrears A/c.\n4. On Reissue: Profit on reissue transferred to Capital Reserve = (Forfeited amount per share - Discount on reissue per share) × Reissued shares.',
    backHi: '1. अंश पूंजी खाता (Share Capital A/c) याचित राशि (Called-up) से डेबिट होता है।\n2. शेयर जब्ती खाता (Forfeited Shares A/c) प्राप्त राशि से क्रेडिट होता है।\n3. पुनर्निर्गमन पर लाभ पूंजी संचय (Capital Reserve) में स्थानांतरित किया जाता है।',
    keyPoint: 'Maximum permissible discount on reissue cannot exceed the amount already forfeited on those specific shares.'
  },
  {
    id: 'fc-acc-4',
    subject: 'accountancy',
    chapter: 'Cash Flow Statement',
    topic: 'Classification of Cash Flow Activities (AS-3)',
    front: 'How are (1) Interest paid on debentures and (2) Dividend received on investment classified in Cash Flow Statement?',
    frontHi: 'रोकड़ प्रवाह विवरण (AS-3) में (1) ऋणपत्रों पर प्रदत्त ब्याज और (2) निवेशों पर प्राप्त लाभांश का वर्गीकरण कैसे होता है?',
    back: 'For a non-financial enterprise:\n1. Interest paid on debentures / bank loans: FINANCING ACTIVITY (cash outflow).\n2. Dividend received / Interest received on non-current investments: INVESTING ACTIVITY (cash inflow).\n(Note: In financial enterprises like banks, both are Operating Activities).',
    backHi: 'गैर-वित्तीय उद्यम हेतु:\n1. ऋणपत्रों पर प्रदत्त ब्याज: वित्तीय क्रिया (Financing Outflow)।\n2. निवेश पर प्राप्त लाभांश/ब्याज: निवेश क्रिया (Investing Inflow)।',
    keyPoint: 'Always distinguish financial enterprises vs non-financial commercial firms in Section A MCQs.'
  },

  // =========================================================================
  // CLASS 12 COMMERCE: BUSINESS STUDIES (054)
  // =========================================================================
  {
    id: 'fc-bst-1',
    subject: 'business_studies',
    chapter: 'Principles of Management',
    topic: 'Henri Fayol’s Principles vs F.W. Taylor’s Scientific Management',
    front: 'Contrast Henri Fayol’s Administrative Principles with F.W. Taylor’s Scientific Management.',
    frontHi: 'हेनरी फेयोल के प्रशासनिक सिद्धांतों तथा एफ.डब्ल्यू. टेलर के वैज्ञानिक प्रबंध में मुख्य अंतर बताएं।',
    back: '• Fayol: Top-level management perspective; focuses on overall administrative functions and human relations; universal applicability; unity of command strictly followed.\n• Taylor: Shop-floor (factory/operational) level perspective; focuses on worker productivity and technical standardization; Functional Foremanship intentionally violates Unity of Command (worker supervised by 8 specialists).',
    backHi: '• फेयोल: शीर्ष स्तरीय प्रबंध दृष्टिकोण; प्रशासनिक दक्षता और आदेश की एकता पर बल।\n• टेलर: कार्यशाला (फैक्ट्री) स्तर; कार्यक्षमता, मानकीकरण और कार्यात्मक फोरमैनशिप (8 विशेषज्ञ)।',
    keyPoint: 'Fayol’s system is based on personal experience; Taylor’s on scientific observations and time-motion studies.'
  },
  {
    id: 'fc-bst-2',
    subject: 'business_studies',
    chapter: 'Organising',
    topic: 'Delegation of Authority vs Decentralisation',
    front: 'What are the three elements of Delegation, and how does Delegation differ from Decentralisation?',
    frontHi: 'अधिकार अंतरण (Delegation) के तीन तत्व क्या हैं और यह विकेंद्रीकरण (Decentralisation) से कैसे भिन्न है?',
    back: 'Three Elements of Delegation:\n1. Authority (right to command and utilize resources - flows downward).\n2. Responsibility (obligation to perform duty - flows upward).\n3. Accountability (answerability for final outcome - cannot be delegated! Flows upward).\nDifference: Delegation is a routine downward assignment between superior and subordinate; Decentralisation is an organization-wide policy decision to disperse authority across all levels.',
    backHi: 'अंतरण के 3 तत्व: 1. अधिकार (ऊपर से नीचे), 2. उत्तरदायित्व (नीचे से ऊपर), 3. जवाबदेही (अनिवार्य, नीचे से ऊपर, इसका अंतरण नहीं हो सकता)।\nविकेंद्रीकरण संपूर्ण संगठन की नीतिगत व्यवस्था है।',
    keyPoint: 'Accountability is absolute and cannot be delegated under any circumstances.'
  },
  {
    id: 'fc-bst-3',
    subject: 'business_studies',
    chapter: 'Financial Management',
    topic: 'Trading on Equity (Financial Leverage)',
    front: 'What is "Trading on Equity", and under what condition does it benefit equity shareholders?',
    frontHi: 'समता पर व्यापार (Trading on Equity) क्या है और यह किस परिस्थिति में समता अंशधारकों को लाभ पहुंचाता है?',
    back: 'Trading on Equity refers to the use of fixed-cost debt capital to magnify Return on Equity (ROE) and Earning Per Share (EPS).\nFavourable Condition: Return on Investment (ROI) must be GREATER than Cost of Debt (Interest Rate) [ROI > Rate of Interest].\nIf ROI < Interest Rate, financial leverage becomes unfavourable and EPS drops.',
    backHi: 'ऋण पूंजी का उपयोग करके समता अंशधारकों के प्रति अंश अर्जन (EPS) को बढ़ाना।\nअनुकूल शर्त: निवेश पर प्रतिफल (ROI) ऋण की ब्याज दर से अधिक होना चाहिए (ROI > Interest Rate)।',
    keyPoint: 'High debt with low ROI leads to financial distress and negative financial leverage.'
  },

  // =========================================================================
  // CLASS 12 COMMERCE: ECONOMICS (030)
  // =========================================================================
  {
    id: 'fc-eco-1',
    subject: 'economics',
    chapter: 'National Income and Related Aggregates',
    topic: 'Inclusions & Exclusions in National Income Estimation',
    front: 'Which of these are included in National Income: (a) Transfer payments, (b) Brokerage on shares, (c) Windfall gains?',
    frontHi: 'राष्ट्रीय आय में क्या शामिल होगा: (क) हस्तांतरण भुगतान, (ख) शेयरों पर दलाली, (ग) आकस्मिक लाभ (लॉटरी)?',
    back: '• (a) Transfer payments (pensions, scholarships, gifts): EXCLUDED (no corresponding factor service rendered).\n• (b) Brokerage on purchase/sale of second-hand shares/property: INCLUDED (reward for productive intermediary factor service).\n• (c) Windfall gains (lotteries, gambling): EXCLUDED (unproductive capital transfer).',
    backHi: '• (क) हस्तांतरण भुगतान (वृद्धावस्था पेंशन, छात्रवृत्ति): शामिल नहीं।\n• (ख) शेयरों पर दलाली (Brokerage): शामिल (उत्पादक सेवा का पारिश्रमिक)।\n• (ग) आकस्मिक लाभ (लॉटरी): शामिल नहीं।',
    keyPoint: 'Only factor payments (Rent, Wages, Interest, Profit) earned for productive services in the current period are included.'
  },
  {
    id: 'fc-eco-2',
    subject: 'economics',
    chapter: 'Money and Banking',
    topic: 'Credit Creation by Commercial Banks & Money Multiplier',
    front: 'How do Commercial Banks create credit, and what is the formula for the Credit Multiplier?',
    frontHi: 'व्यावसायिक बैंक साख सृजन कैसे करते हैं और साख गुणक (Credit Multiplier) का सूत्र क्या है?',
    back: 'Banks create credit out of initial primary cash deposits because depositors withdraw only a fraction of their money daily.\nFormula: Credit Multiplier (k) = 1 / LRR (where LRR = CRR + SLR).\nTotal Credit / Deposit Creation = Initial Primary Deposit × (1 / LRR).\nExample: If LRR = 20%, Multiplier = 1 / 0.20 = 5. A ₹1,000 deposit expands to ₹5,000.',
    backHi: 'साख गुणक = 1 / वैधानिक तरलता अनुपात (LRR)।\nकुल साख सृजन = प्रारंभिक जमा × (1 / LRR)।\nयदि LRR = 20% है, तो गुणक 5 होगा और 1,000 की जमा 5,000 के बराबर साख उत्पन्न करेगी।',
    formula: 'Total Deposits = Primary Deposit × (1 / LRR)'
  },
  {
    id: 'fc-eco-3',
    subject: 'economics',
    chapter: 'Determination of Income and Employment',
    topic: 'Keynesian Investment Multiplier (k) & MPC/MPS Relations',
    front: 'State the relationship between Investment Multiplier (k), MPC, and MPS, and the range of k.',
    frontHi: 'निवेश गुणक (k), सीमांत उपभोग प्रवृत्ति (MPC) और सीमांत बचत प्रवृत्ति (MPS) में संबंध बताएं।',
    back: '• k = ΔY / ΔI = 1 / (1 - MPC) = 1 / MPS.\n• Direct relationship with MPC: Higher the MPC, higher the Multiplier.\n• Inverse relationship with MPS: Higher the MPS, lower the Multiplier.\n• Numerical Range: 1 ≤ k ≤ ∞ (since 0 ≤ MPC ≤ 1). If MPC = 0, k = 1; if MPC = 1, k = ∞.',
    backHi: '• k = 1 / (1 - MPC) = 1 / MPS।\n• MPC से प्रत्यक्ष संबंध (अधिक MPC = अधिक गुणक)।\n• MPS से व्युत्क्रम संबंध।\n• संख्यात्मक सीमा: 1 से अनंत (∞)।',
    formula: 'k = 1 / (1 - MPC) = 1 / MPS'
  },

  // =========================================================================
  // CLASS 12: ENGLISH CORE (301)
  // =========================================================================
  {
    id: 'fc-eng-1',
    subject: 'english_core',
    chapter: 'The Last Lesson',
    topic: 'Themes of Linguistic Chauvinism & Patriotism',
    front: 'What is "Linguistic Chauvinism", and what metaphor does M. Hamel use for language in "The Last Lesson"?',
    frontHi: '"भाषाई अंधराष्ट्रवाद" (Linguistic Chauvinism) क्या है और एम. हेमेल भाषा के लिए क्या उपमा देते हैं?',
    back: '• Linguistic Chauvinism: Aggressive, unreasonable belief that one\'s own language is superior and imposing it on conquered populations (Prussia imposing German on Alsace and Lorraine).\n• M. Hamel\'s Metaphor: "When a people are enslaved, as long as they hold fast to their language it is as if they had the key to their prison."\n• Final Action: He writes "Vive La France!" (Long Live France!) on the board.',
    backHi: '• भाषाई अंधराष्ट्रवाद: अपनी भाषा को दूसरों पर थोपना (जर्मन थोपी गई)।\n• उपमा: भाषा बंदीगृह की वह चाबी है जो जब तक आपके पास है, आप पूरी तरह गुलाम नहीं हो सकते।',
    keyPoint: 'Key phrase for board answers: "Key to their prison" and defense against linguistic cultural annihilation.'
  },
  {
    id: 'fc-eng-2',
    subject: 'english_core',
    chapter: 'Deep Water',
    topic: 'Roosevelt’s Philosophy on Fear and Terror',
    front: 'Explain William Douglas’s realization in "Deep Water": "In death there is peace, there is terror only in the fear of death."',
    frontHi: 'विलियम डगलस के विचार की व्याख्या करें: "मृत्यु में शांति है, आतंक केवल मृत्यु के भय में है।"?',
    back: 'When Douglas was drowning at the YMCA pool, as he lost consciousness, he felt absolute peace, release, and oblivion—no pain, no panic.\nThe terrifying horror had only existed during his struggle and anticipation of death.\nHe corroborates this with President Roosevelt’s aphorism: "All we have to fear is fear itself." Conquering fear through disciplined swimming with an instructor transformed his will to live into a fearless triumph.',
    backHi: 'डगलस ने डूबते समय अनुभव किया कि बेहोशी और मृत्यु शांत है; सारा आतंक केवल मृत्यु के मनोवैज्ञानिक भय में है। रूजवेल्ट का उद्धरण: "हमे केवल भय से ही डरना है।"',
    keyPoint: 'Quote to memorize verbatim: "All we have to fear is fear itself."'
  }
];

