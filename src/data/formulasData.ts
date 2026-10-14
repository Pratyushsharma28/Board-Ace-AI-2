import { SubjectId } from '../types/quiz';

export interface FormulaItem {
  id: string;
  subject: SubjectId;
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
  }
];
