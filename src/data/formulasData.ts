import { SubjectId, GradeClass, StreamType } from '../types/quiz';

export interface FormulaItem {
  id: string;
  subject: SubjectId;
  grade?: GradeClass;
  chapter: string;
  name: string;
  nameHi?: string;
  formula: string;
  explanation: string;
  explanationHi?: string;
  variables: string;
  examTip: string;
}

export const CBSE_FORMULAS: FormulaItem[] = [
  // Mathematics
  {
    id: 'f-m-1',
    subject: 'mathematics',
    chapter: 'Matrices',
    name: 'Inverse of a Matrix (Formula)',
    nameHi: 'आव्यूह का व्युत्क्रम',
    formula: 'A⁻¹ = (1 / |A|) · adj(A)',
    explanation: 'Valid only if A is non-singular, i.e., |A| ≠ 0.',
    explanationHi: 'केवल तभी मान्य है जब A व्युत्क्रमणीय हो, अर्थात |A| ≠ 0.',
    variables: '|A| = determinant of A; adj(A) = transpose of cofactor matrix',
    examTip: 'CBSE 5-mark question staple: Always check |A| first before computing cofactors.'
  },
  {
    id: 'f-m-2',
    subject: 'mathematics',
    chapter: 'Determinants',
    name: 'Determinant of Adjoint Theorem',
    nameHi: 'सहखंडज का सारणिक',
    formula: '|adj(A)| = |A|ⁿ⁻¹, |adj(adj(A))| = |A|⁽ⁿ⁻¹⁾²',
    explanation: 'Relation for any n × n square matrix A.',
    explanationHi: 'n × n कोटि के किसी वर्ग आव्यूह A के लिए संबंध।',
    variables: 'n = order of matrix; |A| = determinant',
    examTip: 'Extremely popular in 1-mark Section A MCQs for CBSE 2026-27.'
  },
  {
    id: 'f-m-3',
    subject: 'mathematics',
    chapter: 'Integrals',
    name: 'Special Integrals: √(a² - x²) & 1/(x² + a²)',
    nameHi: 'विशिष्ट समाकलन सूत्र',
    formula: '∫ dx / (x² + a²) = (1/a) arctan(x/a) + C\n∫ dx / √(a² - x²) = arcsin(x/a) + C',
    explanation: 'Standard trigonometric substitution formulas.',
    explanationHi: 'मानक त्रिकोणमितीय प्रतिस्थापन सूत्र।',
    variables: 'a = constant; C = constant of integration',
    examTip: 'Do not forget the (1/a) prefix in arctan, whereas arcsin has NO (1/a) prefix!'
  },
  {
    id: 'f-m-4',
    subject: 'mathematics',
    chapter: 'Application of Integrals',
    name: 'Area bounded by Parabola and Line',
    nameHi: 'परवलय एवं रेखा से घिरा क्षेत्रफल',
    formula: 'Area = ∫ [ y_upper(x) - y_lower(x) ] dx',
    explanation: 'Calculate points of intersection first to determine limits [a, b].',
    explanationHi: 'सीमाएं [a, b] निर्धारित करने के लिए पहले प्रतिच्छेदन बिंदु ज्ञात करें।',
    variables: 'y_upper = upper curve; y_lower = lower curve',
    examTip: 'Always sketch the rough figure and shade the bounded region for board credit.'
  },
  {
    id: 'f-m-5',
    subject: 'mathematics',
    chapter: 'Vectors',
    name: 'Projection of Vector a on Vector b',
    nameHi: 'सदिश a का सदिश b पर प्रक्षेप',
    formula: 'Projection = (a · b) / |b|',
    explanation: 'Scalar projection is a dot product divided by magnitude of target vector.',
    explanationHi: 'अदिश प्रक्षेप डॉट गुणनफल को लक्षित सदिश के परिमाण से भाग देकर मिलता है।',
    variables: 'a · b = a₁b₁ + a₂b₂ + a₃b₃; |b| = √(b₁² + b₂² + b₃²)',
    examTip: 'Vector projection = [ (a · b) / |b|² ] · b.'
  },
  {
    id: 'f-m-6',
    subject: 'mathematics',
    chapter: 'Three-Dimensional Geometry',
    name: 'Shortest Distance between Two Skew Lines',
    nameHi: 'दो विषमतलीय रेखाओं के बीच न्यूनतम दूरी',
    formula: 'd = | (b₁ × b₂) · (a₂ - a₁) | / |b₁ × b₂|',
    explanation: 'For lines r = a₁ + λb₁ and r = a₂ + μb₂.',
    explanationHi: 'रेखाओं r = a₁ + λb₁ तथा r = a₂ + μb₂ के लिए।',
    variables: 'a₁, a₂ = position vectors; b₁, b₂ = direction vectors',
    examTip: 'Guaranteed 5-mark question in CBSE Class 12 Mathematics paper.'
  },

  // Physics
  {
    id: 'f-p-1',
    subject: 'physics',
    chapter: 'Electric Charges and Fields',
    name: 'Electric Field of an Infinite Plane Sheet',
    nameHi: 'अनंत समतल चादर का वैद्युत क्षेत्र',
    formula: 'E = σ / (2ε₀)',
    explanation: 'Field is independent of distance r from the sheet.',
    explanationHi: 'वैद्युत क्षेत्र चादर से दूरी r पर निर्भर नहीं करता।',
    variables: 'σ = surface charge density (C/m²); ε₀ = 8.854 × 10⁻¹² C²/N·m²',
    examTip: 'For a charged conducting plate, E = σ / ε₀ (twice as large due to two surfaces).'
  },
  {
    id: 'f-p-2',
    subject: 'physics',
    chapter: 'Electrostatic Potential and Capacitance',
    name: 'Energy Stored in a Capacitor',
    nameHi: 'संधारित्र में संचित ऊर्जा',
    formula: 'U = (1/2) CV² = (1/2) Q² / C = (1/2) QV',
    explanation: 'Stored in the electrostatic field between the plates.',
    explanationHi: 'पट्टिकाओं के मध्य स्थिरवैद्युत क्षेत्र में संचित।',
    variables: 'C = capacitance (F); V = potential difference (V); Q = charge (C)',
    examTip: 'Energy density u_E = (1/2) ε₀ E².'
  },
  {
    id: 'f-p-3',
    subject: 'physics',
    chapter: 'Current Electricity',
    name: 'Drift Velocity and Electric Current Relation',
    nameHi: 'अपवाह वेग तथा विद्युत धारा में संबंध',
    formula: 'I = n · e · A · v_d',
    explanation: 'Connects macroscopic current to microscopic electron drift velocity.',
    explanationHi: 'स्थूल धारा को सूक्ष्म इलेक्ट्रॉन अपवाह वेग से जोड़ता है।',
    variables: 'n = electron density; e = 1.6 × 10⁻¹⁹ C; A = area (m²); v_d = drift speed (m/s)',
    examTip: 'v_d = (e·E·τ) / m where τ is relaxation time.'
  },
  {
    id: 'f-p-4',
    subject: 'physics',
    chapter: 'Moving Charges and Magnetism',
    name: 'Biot-Savart Law & Circular Coil Magnetic Field',
    nameHi: 'बायो-सावर्ट नियम एवं वृत्ताकार कुंडली का चुंबकीय क्षेत्र',
    formula: 'B_center = (μ₀ · N · I) / (2R)',
    explanation: 'Magnetic field at the center of an N-turn circular loop of radius R.',
    explanationHi: 'R त्रिज्या वाली N फेरों की वृत्ताकार कुंडली के केंद्र पर चुंबकीय क्षेत्र।',
    variables: 'μ₀ = 4π × 10⁻⁷ T·m/A; N = turns; I = current (A); R = radius (m)',
    examTip: 'At axial distance x: B_axis = (μ₀ N I R²) / [ 2 (R² + x²)^(3/2) ].'
  },
  {
    id: 'f-p-5',
    subject: 'physics',
    chapter: 'Alternating Current',
    name: 'Resonant Frequency in Series LCR Circuit',
    nameHi: 'श्रेणी LCR परिपथ में अनुनादी आवृत्ति',
    formula: 'ω₀ = 1 / √(LC), f₀ = 1 / [ 2π √(LC) ]',
    explanation: 'At resonance, inductive reactance equals capacitive reactance (X_L = X_C). Impedance Z = R (minimum).',
    explanationHi: 'अनुनाद पर प्रेरकीय प्रतिघात धारितीय प्रतिघात के बराबर होता है (X_L = X_C)। प्रतिबाधा Z = R (न्यूनतम)।',
    variables: 'L = inductance (H); C = capacitance (F); Z = impedance (Ω)',
    examTip: 'Quality factor Q = (1/R) √(L/C).'
  },
  {
    id: 'f-p-6',
    subject: 'physics',
    chapter: 'Ray Optics and Optical Instruments',
    name: 'Prism Formula & Minimum Deviation',
    nameHi: 'प्रिज्म सूत्र एवं न्यूनतम विचलन',
    formula: 'μ = sin[ (A + D_m) / 2 ] / sin(A / 2)',
    explanation: 'Calculates refractive index of prism material from angle of prism A and minimum deviation D_m.',
    explanationHi: 'प्रिज्म कोण A तथा न्यूनतम विचलन D_m से अपवर्तनांक ज्ञात करने का सूत्र।',
    variables: 'A = prism angle; D_m = angle of minimum deviation; μ = refractive index',
    examTip: 'For thin prism: D = (μ - 1) A.'
  },

  // Chemistry
  {
    id: 'f-c-1',
    subject: 'chemistry',
    chapter: 'Solutions',
    name: 'Elevation in Boiling Point & Depression in Freezing Point',
    nameHi: 'क्वथनांक में उन्नयन तथा हिमांक में अवनमन',
    formula: 'ΔT_b = i · K_b · m\nΔT_f = i · K_f · m',
    explanation: 'Colligative properties depending strictly on the number of solute particles.',
    explanationHi: 'अणुसंख्य गुणधर्म जो विलेय के कणों की संख्या पर निर्भर करते हैं।',
    variables: 'i = van\'t Hoff factor; K_b = ebullioscopic constant; m = molality (mol/kg)',
    examTip: 'For electrolytes (e.g. NaCl, i ≈ 2; K₂SO₄, i ≈ 3). Never omit the van \'t Hoff factor i!'
  },
  {
    id: 'f-c-2',
    subject: 'chemistry',
    chapter: 'Electrochemistry',
    name: 'Gibbs Free Energy and Cell EMF',
    nameHi: 'गिब्स मुक्त ऊर्जा एवं सेल वि.वा.बल',
    formula: 'ΔG° = -n · F · E°_cell',
    explanation: 'Relates standard electrical work to standard Gibbs free energy change.',
    explanationHi: 'मानक विद्युत कार्य को मानक गिब्स मुक्त ऊर्जा परिवर्तन से जोड़ता है।',
    variables: 'n = moles of electrons; F = 96487 C/mol; E°_cell = standard cell potential (V)',
    examTip: 'Spontaneous reaction requires E°_cell > 0 and ΔG° < 0.'
  },
  {
    id: 'f-c-3',
    subject: 'chemistry',
    chapter: 'Chemical Kinetics',
    name: 'Arrhenius Equation for Activation Energy',
    nameHi: 'सक्रियण ऊर्जा हेतु आरहेनियस समीकरण',
    formula: 'log₁₀(k₂ / k₁) = (E_a / 2.303 R) · [ (T₂ - T₁) / (T₁ · T₂) ]',
    explanation: 'Calculates activation energy E_a from rate constants k₁ and k₂ at temperatures T₁ and T₂.',
    explanationHi: 'ताप T₁ तथा T₂ पर वेग स्थिरांक k₁ तथा k₂ से सक्रियण ऊर्जा E_a ज्ञात करने का सूत्र।',
    variables: 'E_a = activation energy (J/mol); R = 8.314 J/K·mol; T = temperature (K)',
    examTip: 'Always convert temperature from Celsius to Kelvin (K = °C + 273.15).'
  },
  {
    id: 'f-c-4',
    subject: 'chemistry',
    chapter: 'Coordination Compounds',
    name: 'Magnetic Moment (Spin-Only Formula)',
    nameHi: 'चुंबकीय आघूर्ण (केवल चक्रण सूत्र)',
    formula: 'μ_s = √( n · (n + 2) ) BM',
    explanation: 'Calculates magnetic moment from number of unpaired electrons n.',
    explanationHi: 'अयुग्मित इलेक्ट्रॉनों की संख्या n से चुंबकीय आघूर्ण की गणना।',
    variables: 'n = number of unpaired electrons; BM = Bohr Magnetons',
    examTip: 'n=1 ⇒ 1.73 BM; n=2 ⇒ 2.83 BM; n=3 ⇒ 3.87 BM; n=4 ⇒ 4.90 BM; n=5 ⇒ 5.92 BM.'
  },

  // ====================================================
  // CBSE CLASS 10 MATHEMATICS & SCIENCE FORMULAS (2026-27)
  // ====================================================
  {
    id: 'f-10-m-1',
    subject: 'mathematics',
    grade: '10',
    chapter: 'Quadratic Equations',
    name: 'Quadratic Formula (Sridharacharya Formula)',
    nameHi: 'द्विघाती सूत्र (श्रीधराचार्य सूत्र)',
    formula: 'x = [ -b ± √(b² - 4ac) ] / (2a)',
    explanation: 'Solves any standard quadratic equation ax² + bx + c = 0 where a ≠ 0.',
    explanationHi: 'द्विघात समीकरण ax² + bx + c = 0 के मूल ज्ञात करने का सार्वत्रिक सूत्र।',
    variables: 'a, b, c = real coefficients; D = b² - 4ac (discriminant)',
    examTip: 'Evaluate D = b² - 4ac first. If D < 0, write directly: "No real roots exist".'
  },
  {
    id: 'f-10-m-2',
    subject: 'mathematics',
    grade: '10',
    chapter: 'Arithmetic Progressions',
    name: 'nth Term & Sum of First n Terms of an AP',
    nameHi: 'समांतर श्रेढ़ी का nवाँ पद एवं n पदों का योग',
    formula: 'aₙ = a + (n - 1)d\nSₙ = (n / 2) · [ 2a + (n - 1)d ] = (n / 2) · (a + l)',
    explanation: 'Fundamental formulas for terms and series in an Arithmetic Progression.',
    explanationHi: 'समांतर श्रेढ़ी के पदों तथा योग की गणना हेतु मूल सूत्र।',
    variables: 'a = first term; d = common difference; n = number of terms; l = last term',
    examTip: 'If given Sₙ, you can find the nth term directly via aₙ = Sₙ - Sₙ₋₁.'
  },
  {
    id: 'f-10-m-3',
    subject: 'mathematics',
    grade: '10',
    chapter: 'Coordinate Geometry',
    name: 'Distance & Internal Section Formula',
    nameHi: 'दूरी एवं अंतः विभाजन सूत्र',
    formula: 'd = √[ (x₂ - x₁)² + (y₂ - y₁)² ]\nP(x, y) = [ (m₁x₂ + m₂x₁) / (m₁ + m₂), (m₁y₂ + m₂y₁) / (m₁ + m₂) ]',
    explanation: 'Calculates Euclidean distance and internal division ratio between two points.',
    explanationHi: 'दो बिंदुओं के बीच दूरी तथा उन्हें m₁:m₂ में विभाजित करने वाले बिंदु के निर्देशांक।',
    variables: '(x₁, y₁) and (x₂, y₂) = coordinates; m₁, m₂ = ratio weights',
    examTip: 'For finding unknown ratio, always assume the ratio to be k : 1 instead of m₁ : m₂ to reduce variables.'
  },
  {
    id: 'f-10-m-4',
    subject: 'mathematics',
    grade: '10',
    chapter: 'Introduction to Trigonometry',
    name: 'Fundamental Trigonometric Identities',
    nameHi: 'त्रिकोणमितीय सर्वसमिकाएँ',
    formula: 'sin²θ + cos²θ = 1\n1 + tan²θ = sec²θ\n1 + cot²θ = cosec²θ',
    explanation: 'Pythagorean identities true for all acute angles 0° ≤ θ ≤ 90°.',
    explanationHi: 'सभी न्यूनकोणों के लिए मान्य मूलभूत त्रिकोणमितीय सर्वसमिकाएँ।',
    variables: 'θ = angle measured in degrees or radians',
    examTip: 'In proof-based questions: sec²θ - tan²θ = 1 ⇒ (secθ - tanθ)(secθ + tanθ) = 1.'
  },
  {
    id: 'f-10-m-5',
    subject: 'mathematics',
    grade: '10',
    chapter: 'Statistics',
    name: 'Empirical Relationship & Mode of Grouped Data',
    nameHi: 'बहुलक एवं आनुभविक संबंध सूत्र',
    formula: 'Mode = 3 · Median - 2 · Mean\nMode = l + [ (f₁ - f₀) / (2f₁ - f₀ - f₂) ] · h',
    explanation: 'Calculates the mode of grouped continuous frequency data.',
    explanationHi: 'वर्गीकृत आंकड़ों का बहुलक ज्ञात करने का आधिकारिक सूत्र।',
    variables: 'l = lower limit of modal class; f₁ = modal frequency; f₀ = preceding; f₂ = succeeding; h = class size',
    examTip: 'The modal class is the class interval corresponding to the highest frequency.'
  },
  {
    id: 'f-10-s-1',
    subject: 'science',
    grade: '10',
    chapter: 'Electricity',
    name: 'Ohm’s Law & Resistance of a Conductor',
    nameHi: 'ओम का नियम एवं प्रतिरोध',
    formula: 'V = I · R\nR = ρ · (l / A)',
    explanation: 'Relates potential difference, current, resistance, and specific resistivity.',
    explanationHi: 'विभवांतर, धारा, प्रतिरोध तथा विशिष्ट प्रतिरोधकता (Resistivity) का संबंध।',
    variables: 'V = Volts; I = Amperes; R = Ohms (Ω); ρ = Resistivity (Ω·m); l = length (m); A = area (m²)',
    examTip: 'Resistivity ρ depends ONLY on the material and temperature, NOT on length or thickness.'
  },
  {
    id: 'f-10-s-2',
    subject: 'science',
    grade: '10',
    chapter: 'Electricity',
    name: 'Equivalent Resistance in Series & Parallel',
    nameHi: 'श्रेणीक्रम एवं पार्श्वक्रम तुल्य प्रतिरोध',
    formula: 'Series: R_s = R₁ + R₂ + R₃\nParallel: 1 / R_p = 1 / R₁ + 1 / R₂ + 1 / R₃',
    explanation: 'Formulas to compute total resistance across circuit configurations.',
    explanationHi: 'परिपथ में प्रतिरोधकों के कुल तुल्य प्रतिरोध की गणना।',
    variables: 'R_s = total series resistance; R_p = total parallel resistance',
    examTip: 'For two resistors in parallel: R_p = (R₁ · R₂) / (R₁ + R₂).'
  },
  {
    id: 'f-10-s-3',
    subject: 'science',
    grade: '10',
    chapter: 'Electricity',
    name: 'Joule’s Law of Heating & Electric Power',
    nameHi: 'जूल का तापन नियम एवं विद्युत शक्ति',
    formula: 'H = I² · R · t\nP = V · I = I² · R = V² / R',
    explanation: 'Computes heat generated in a resistor and power consumption in electrical devices.',
    explanationHi: 'चालक में उत्पन्न ऊष्मा तथा विद्युत शक्ति की गणना।',
    variables: 'H = Heat energy (Joules); t = time (seconds); P = Power (Watts, W)',
    examTip: 'Commercial unit of electrical energy: 1 Board of Trade unit (kWh) = 3.6 × 10⁶ Joules.'
  },
  {
    id: 'f-10-s-4',
    subject: 'science',
    grade: '10',
    chapter: 'Light - Reflection and Refraction',
    name: 'Mirror Formula & Spherical Mirror Magnification',
    nameHi: 'दर्पण सूत्र एवं आवर्धन',
    formula: '(1 / f) = (1 / v) + (1 / u)\nm = - (v / u) = (h′ / h)',
    explanation: 'Relates focal length, image distance, and object distance in spherical mirrors.',
    explanationHi: 'गोलीय दर्पणों में फोकस दूरी, प्रतिबिंब दूरी एवं बिम्ब दूरी का संबंध।',
    variables: 'f = focal length; v = image distance; u = object distance; m = magnification',
    examTip: 'New Cartesian Sign Convention: Object distance "u" is ALWAYS negative (-u).'
  },
  {
    id: 'f-10-s-5',
    subject: 'science',
    grade: '10',
    chapter: 'Light - Reflection and Refraction',
    name: 'Lens Formula & Power of a Lens',
    nameHi: 'लेंस सूत्र एवं लेंस की क्षमता',
    formula: '(1 / f) = (1 / v) - (1 / u)\nm = + (v / u)\nP = 1 / f (in metres)',
    explanation: 'Relates focal length, distances, and optical power in spherical lenses.',
    explanationHi: 'लेंस सूत्र तथा डायोप्टर (D) में लेंस की क्षमता की गणना।',
    variables: 'f = focal length (m); P = power in Dioptres (D); m = magnification',
    examTip: 'Notice the sign difference: Mirror formula has + (1/v + 1/u) with - (v/u) magnification; Lens formula has - (1/v - 1/u) with + (v/u) magnification!'
  },

  // =========================================================================
  // CLASS 12 COMMERCE: ACCOUNTANCY (055)
  // =========================================================================
  {
    id: 'f-12-acc-1',
    subject: 'accountancy',
    grade: '12',
    chapter: 'Accounting Ratios',
    name: 'Liquidity Ratios: Current & Quick Ratio',
    nameHi: 'तरलता अनुपात: चालू एवं त्वरित अनुपात',
    formula: 'Current Ratio = Current Assets / Current Liabilities (Ideal: 2:1)\nQuick Ratio = Quick Assets / Current Liabilities (Ideal: 1:1)\nQuick Assets = Current Assets - (Inventories + Prepaid Expenses)',
    explanation: 'Measures the firm’s ability to meet short-term maturing obligations.',
    explanationHi: 'फर्म की अल्पकालीन देनदारियों को चुकाने की क्षमता का मापन करता है।',
    variables: 'CA = Current Assets; CL = Current Liabilities; QA = Liquid/Quick Assets',
    examTip: 'CBSE Trap: Loose tools, stores and spares are EXCLUDED from Inventories when calculating Current Assets and Quick Assets!'
  },
  {
    id: 'f-12-acc-2',
    subject: 'accountancy',
    grade: '12',
    chapter: 'Accounting Ratios',
    name: 'Solvency Ratios: Debt-Equity & Interest Coverage',
    nameHi: 'शोधन क्षमता अनुपात: ऋण-समता एवं ब्याज व्याप्ति अनुपात',
    formula: 'Debt to Equity Ratio = Long-Term Debt / Shareholders’ Funds (Ideal: 2:1)\nInterest Coverage Ratio = Net Profit before Interest and Tax / Fixed Interest Charges (times)',
    explanation: 'Measures enterprise long-term financial solvency and cushion against debt default.',
    explanationHi: 'दीर्घकालीन वित्तीय शोधन क्षमता और स्थिर ब्याज भार वहन क्षमता का मापन।',
    variables: 'Long-term Debt = Debentures + Bonds + Bank Loans; Shareholders’ Funds = Share Capital + Reserves & Surplus',
    examTip: 'A high Interest Coverage Ratio implies safety for lenders. Expressed in "times".'
  },
  {
    id: 'f-12-acc-3',
    subject: 'accountancy',
    grade: '12',
    chapter: 'Accounting Ratios',
    name: 'Activity Ratios: Inventory & Working Capital Turnover',
    nameHi: 'क्रियाशीलता अनुपात: स्टॉक एवं कार्यशील पूंजी आवर्त',
    formula: 'Inventory Turnover = Cost of Revenue from Operations (COGS) / Average Inventory\nWorking Capital Turnover = Revenue from Operations / Net Working Capital\nTrade Receivables Turnover = Net Credit Revenue / Average Trade Receivables',
    explanation: 'Indicates the velocity and efficiency with which enterprise resources are converted into cash.',
    explanationHi: 'व्यावसायिक संसाधनों के उपयोग की दक्षता और आवर्त गति का मापन।',
    variables: 'COGS = Opening Inv + Net Purchases + Direct Exp - Closing Inv; Working Capital = CA - CL',
    examTip: 'Always express turnover ratios in "times". If Revenue from Operations cannot be bifurcated, use Total Revenue.'
  },
  {
    id: 'f-12-acc-4',
    subject: 'accountancy',
    grade: '12',
    chapter: 'Goodwill: Nature and Valuation',
    name: 'Methods of Valuation of Goodwill',
    nameHi: 'ख्याति के मूल्यांकन की विधियां',
    formula: 'Average Profit = (Adjusted Total Profits / No. of Years) × No. of Years’ Purchase\nSuper Profit = (Actual Average Profit - Normal Profit) × No. of Years’ Purchase\nNormal Profit = Capital Employed × (Normal Rate of Return / 100)\nCapitalisation of Super Profit = (Super Profit / Normal Rate) × 100',
    explanation: 'Standard techniques to compute monetary value of commercial reputation and super earning power.',
    explanationHi: 'औसत लाभ, अधिलाभ तथा अधिलाभ के पूंजीकरण द्वारा ख्याति का मूल्यांकन।',
    variables: 'Capital Employed = Total Assets (excl. goodwill/fictitious) - Outside Liabilities',
    examTip: 'Deduct abnormal gains (e.g. profit on sale of machinery, insurance claim) and add back abnormal losses (e.g. fire loss) before averaging!'
  },
  {
    id: 'f-12-acc-5',
    subject: 'accountancy',
    grade: '12',
    chapter: 'Admission of a Partner',
    name: 'Sacrificing Ratio & Capital Adjustments',
    nameHi: 'त्याग अनुपात एवं पूंजी समायोजन',
    formula: 'Sacrificing Ratio = Old Share - New Share\nGaining Ratio = New Share - Old Share\nTotal Capital based on New Partner = New Partner’s Capital × (1 / New Partner’s Share)',
    explanation: 'Determines the proportion in which old partners surrender profit share to admit a new partner.',
    explanationHi: 'पुराने साझेदारों द्वारा नए साझेदार के पक्ष में लाभ के समर्पण का अनुपात।',
    variables: 'SR = Sacrificing Ratio; GR = Gaining Ratio',
    examTip: 'Premium for Goodwill brought in by the incoming partner is ALWAYS credited to Sacrificing Partners in their SACRIFICING RATIO!'
  },
  {
    id: 'f-12-acc-6',
    subject: 'accountancy',
    grade: '12',
    chapter: 'Accounting for Share Capital',
    name: 'Share Forfeiture & Capital Reserve Formula',
    nameHi: 'अंशों का हरण एवं पूंजी संचय हस्तांतरण',
    formula: 'Maximum Reissue Discount = Amount Forfeited on those specific reissued shares\nCapital Reserve = (Amount forfeited on reissued shares) - (Discount allowed on reissue)',
    explanation: 'Surplus gain realized on reissuing forfeited shares is a capital profit transferred to Capital Reserve.',
    explanationHi: 'पुनर्निर्गमित अंशों पर अर्जित लाभ पूंजीगत संचय (Capital Reserve) में अंतरित होता है।',
    variables: 'Called up amount credited to Share Capital; Unpaid calls to Calls in Arrears',
    examTip: 'CBSE 6-mark cornerstone: If only a part of forfeited shares are reissued, calculate forfeited amount strictly proportional to reissued shares!'
  },
  {
    id: 'f-12-acc-7',
    subject: 'accountancy',
    grade: '12',
    chapter: 'Cash Flow Statement',
    name: 'Operating Cash Flow (Indirect Method as per AS-3)',
    nameHi: 'रोकड़ प्रवाह विवरण: परिचालन क्रियाएं',
    formula: 'Cash from Operations = Net Profit before Tax & Extra. Items\n+ Non-cash/Non-operating Expenses (Depreciation, Goodwill w/off, Loss on Asset Sale)\n- Non-operating Incomes (Dividend/Interest Recd, Profit on Asset Sale)\n± Operating Profit before Working Capital Changes\n- Increase in CA + Decrease in CA + Increase in CL - Decrease in CL - Tax Paid',
    explanation: 'Standard indirect computation deriving net cash flows generated by core business operations.',
    explanationHi: 'एएस-3 के अनुसार गैर-रोकड़ मदों तथा कार्यशील पूंजी परिवर्तनों का समायोजन।',
    variables: 'CA = Current Assets (excl. Cash & Cash Equivalents); CL = Current Liabilities (excl. Bank Overdraft/Short-term loans)',
    examTip: 'Bank Overdraft and Cash Credit are FINANCING activities, not working capital changes!'
  },

  // =========================================================================
  // CLASS 12 COMMERCE: ECONOMICS (030)
  // =========================================================================
  {
    id: 'f-12-eco-1',
    subject: 'economics',
    grade: '12',
    chapter: 'National Income and Related Aggregates',
    name: 'National Income Aggregates & Value Added',
    nameHi: 'राष्ट्रीय आय समुच्चय एवं मूल्य संवर्धन सूत्र',
    formula: 'Gross Value Added (GVA_mp) = Value of Output - Intermediate Consumption\nValue of Output = Sales + Change in Stock (Closing - Opening)\nNNP_fc (National Income) = GDP_mp - Depreciation + NFIA - Net Indirect Taxes (NIT)\nReal GDP = (Nominal GDP / Price Index) × 100\nGDP Deflator = (Nominal GDP / Real GDP) × 100',
    explanation: 'Core macroeconomic formulas for computing national income and eliminating inflationary distortions.',
    explanationHi: 'उत्पादन, आय एवं व्यय विधियों द्वारा राष्ट्रीय आय (NNP_fc) की गणना।',
    variables: 'NFIA = Net Factor Income from Abroad; NIT = Indirect Taxes - Subsidies',
    examTip: 'Intermediate consumption does NOT include purchases of fixed capital assets (which are gross investment)!'
  },
  {
    id: 'f-12-eco-2',
    subject: 'economics',
    grade: '12',
    chapter: 'Money and Banking',
    name: 'Money Multiplier & Commercial Bank Credit Creation',
    nameHi: 'मुद्रा गुणक एवं साख निर्माण',
    formula: 'Money Multiplier = 1 / LRR\nTotal Credit Creation = Initial Primary Deposit × (1 / LRR)',
    explanation: 'Formula determining maximum secondary deposits created by commercial banks through fractional reserves.',
    explanationHi: 'वैधानिक आरक्षित अनुपात (LRR) के आधार पर वाणिज्यिक बैंकों द्वारा साख निर्माण।',
    variables: 'LRR = Legal Reserve Ratio = Cash Reserve Ratio (CRR) + Statutory Liquidity Ratio (SLR)',
    examTip: 'If LRR is 20% (0.2), money multiplier = 1/0.2 = 5. A deposit of ₹1,000 generates total credit of ₹5,000.'
  },
  {
    id: 'f-12-eco-3',
    subject: 'economics',
    grade: '12',
    chapter: 'Determination of Income and Employment',
    name: 'Propensity to Consume/Save & Investment Multiplier',
    nameHi: 'उपभोग एवं बचत प्रवृत्ति तथा निवेश गुणक',
    formula: 'APC = C / Y,  MPC = ΔC / ΔY\nAPS = S / Y,  MPS = ΔS / ΔY\nAPC + APS = 1,  MPC + MPS = 1\nInvestment Multiplier (k) = ΔY / ΔI = 1 / (1 - MPC) = 1 / MPS',
    explanation: 'Keynesian equilibrium relationships linking income, consumption, savings, and output expansion.',
    explanationHi: 'कीन्स का निवेश गुणक सिद्धांत: गुणक का मान 1 से अनंत (∞) के बीच होता है।',
    variables: 'Y = Income; C = Consumption; S = Savings; I = Investment; k = Multiplier',
    examTip: 'The value of multiplier k ranges from 1 (when MPC=0) to ∞ (when MPC=1). It varies directly with MPC and inversely with MPS!'
  },
  {
    id: 'f-12-eco-4',
    subject: 'economics',
    grade: '12',
    chapter: 'Government Budget and the Economy',
    name: 'Government Budget Deficits',
    nameHi: 'सरकारी बजट घाटे के माप',
    formula: 'Revenue Deficit = Revenue Expenditure - Revenue Receipts\nFiscal Deficit = Total Expenditure - Total Receipts excluding Borrowings = Total Borrowings\nPrimary Deficit = Fiscal Deficit - Interest Payments',
    explanation: 'Measures budgetary shortfall and government borrowing requirements in a financial year.',
    explanationHi: 'राजस्व घाटा, राजकोषीय घाटा (कुल उधार) एवं प्राथमिक घाटा की गणना।',
    variables: 'Borrowings constitute the fiscal deficit directly. Zero primary deficit implies borrowings are purely for past interest commitments.',
    examTip: 'Primary Deficit = 0 means the government is borrowing solely to pay past interest liabilities!'
  },

  // =========================================================================
  // CLASS 12 COMMERCE: BUSINESS STUDIES (054)
  // =========================================================================
  {
    id: 'f-12-bst-1',
    subject: 'business_studies',
    grade: '12',
    chapter: 'Financial Management',
    name: 'Trading on Equity & Financial Leverage (ROI vs Cost of Debt)',
    nameHi: 'समता पर व्यापार एवं वित्तीय उत्तोलन',
    formula: 'ROI = (EBIT / Total Capital Employed) × 100\nEBT = EBIT - Interest on Debt\nEAT = EBT - Tax\nEPS = EAT / Total Number of Equity Shares',
    explanation: 'Favourable financial leverage occurs when ROI > Rate of Interest on Debt, which amplifies EPS for shareholders.',
    explanationHi: 'जब निवेश पर प्रत्यय (ROI) ऋण की ब्याज दर से अधिक होता है, तो प्रति अंश आय (EPS) बढ़ती है।',
    variables: 'EBIT = Operating Profit; EAT = Earnings after Tax; EPS = Earnings per share',
    examTip: 'CBSE 6-mark case study question: Always show numerical table comparing Situation I (all equity) vs Situation II (debt + equity) to prove Trading on Equity!'
  },
  {
    id: 'f-12-bst-2',
    subject: 'business_studies',
    grade: '12',
    chapter: 'Principles of Management',
    name: 'Fayol’s 14 Principles & Taylor’s Scientific Techniques Framework',
    nameHi: 'फेयोल के 14 सिद्धांत एवं टेलर की वैज्ञानिक तकनीकें',
    formula: 'Fayol: Division of Work, Authority & Responsibility, Discipline, Unity of Command, Unity of Direction, Subordination of Individual Interest, Remuneration, Centralisation, Scalar Chain, Order, Equity, Stability of Personnel, Initiative, Espirit de Corps.\nTaylor: Functional Foremanship (8 Bosses), Time Study, Motion Study, Fatigue Study, Method Study, Differential Piece Wage System.',
    explanation: 'Foundational managerial frameworks for operational efficiency and universal administration.',
    explanationHi: 'हेनरी फेयोल के प्रशासनिक सिद्धांत तथा एफ.डब्ल्यू. टेलर का वैज्ञानिक प्रबंध ढांचा।',
    variables: 'Unity of command prevents dual subordination (1 employee = 1 boss). Unity of direction mandates 1 plan = 1 head.',
    examTip: 'Contrast: Unity of Command prevents confusion in instructions; Unity of Direction prevents overlapping and duplicate activities.'
  },
  {
    id: 'f-12-bst-3',
    subject: 'business_studies',
    grade: '12',
    chapter: 'Consumer Protection',
    name: 'Consumer Protection Act 2019 Pecuniary Jurisdictions',
    nameHi: 'उपभोक्ता संरक्षण अधिनियम 2019: आर्थिक क्षेत्राधिकार',
    formula: 'District Commission: Value of goods/services paid up to ₹50 Lakh\nState Commission: Value exceeding ₹50 Lakh up to ₹2 Crore\nNational Commission: Value exceeding ₹2 Crore',
    explanation: 'Three-tier quasi-judicial consumer disputes redressal machinery established by CPA 2019.',
    explanationHi: 'जिला आयोग (50 लाख तक), राज्य आयोग (50 लाख से 2 करोड़), राष्ट्रीय आयोग (2 करोड़ से अधिक)।',
    variables: 'Appeals: From District Commission to State Commission (within 45 days); From State to National (within 30 days).',
    examTip: 'Under CPA 2019, jurisdiction is determined solely by "Consideration Paid" (not compensation claimed as in 1986 Act)!'
  },

  // =========================================================================
  // CLASS 12: ENGLISH CORE (301)
  // =========================================================================
  {
    id: 'f-12-eng-1',
    subject: 'english_core',
    grade: '12',
    chapter: 'My Mother at Sixty-Six',
    name: 'Literary & Poetic Devices Master Framework',
    nameHi: 'साहित्यिक एवं काव्य उपकरणों का ढांचा',
    formula: 'Simile: Direct comparison with "like/as" ("Ashen like that of a corpse", "As a late winter’s moon")\nMetaphor: Implicit identification ("Endless fountain of immortal drink", "Pad of velvet quiet")\nPersonification: Human attributes to non-living ("Young trees sprinting", "Earth can teach us")\nParadox / Irony: Contradiction revealing deeper truth ("Quiet stillness alive", "Tiger King slain by a toy tiger")',
    explanation: 'Comprehensive guide to rhetorical devices tested in CBSE Class 12 Section C poetry extract questions.',
    explanationHi: 'काव्य सौंदर्य एवं साहित्यिक उपकरणों (उपमा, रूपक, मानवीकरण, विडंबना) की त्वरित मार्गदर्शिका।',
    variables: 'Extract questions carry 6 marks: 1 mark for poetic device identification and 1 mark for explanation.',
    examTip: 'In "My Mother at Sixty-Six", "Young trees sprinting" is Personification AND a contrast between youth/vitality and decaying old age.'
  }
];

export function getFormulasForGrade(grade: GradeClass = '12', stream?: StreamType): FormulaItem[] {
  if (grade === '10') {
    return CBSE_FORMULAS.filter(f => f.grade === '10');
  }
  const class12 = CBSE_FORMULAS.filter(f => !f.grade || f.grade === '12');
  if (stream === 'commerce') {
    return class12.filter(f => ['accountancy', 'business_studies', 'economics', 'english_core'].includes(f.subject));
  }
  if (stream === 'science') {
    return class12.filter(f => ['mathematics', 'physics', 'chemistry'].includes(f.subject));
  }
  return class12;
}

