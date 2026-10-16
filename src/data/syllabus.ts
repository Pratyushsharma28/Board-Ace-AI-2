import { SubjectInfo, GradeClass, StreamType } from '../types/quiz';

/**
 * CBSE Class 12 Official Syllabus for Academic Session 2026–27
 * Supported Core Subjects:
 * 1. Mathematics (Subject Code 041) - 13 Chapters
 * 2. Physics (Subject Code 042) - 14 Chapters
 * 3. Chemistry (Subject Code 043) - 10 Chapters
 */

export const CBSE_CLASS_12_SUBJECTS: SubjectInfo[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    code: '041',
    totalChapters: 13,
    description: 'Calculus, Vectors, 3D Geometry, Linear Programming & Probability (CBSE 2026–27)',
    iconName: 'Calculator',
    chapters: [
      {
        id: 'relations-functions',
        name: 'Relations and Functions',
        unit: 'Unit I: Relations and Functions',
        weightageEstimate: '4-5 marks',
        topics: ['Types of Relations (Reflexive, Symmetric, Transitive, Equivalence)', 'One-One and Onto Functions (Bijective)', 'Composition of Functions & Invertible Functions']
      },
      {
        id: 'inverse-trig',
        name: 'Inverse Trigonometric Functions',
        unit: 'Unit I: Relations and Functions',
        weightageEstimate: '3-4 marks',
        topics: ['Principal Value Branches', 'Domain and Range', 'Graphs of Inverse Trigonometric Functions']
      },
      {
        id: 'matrices',
        name: 'Matrices',
        unit: 'Unit II: Algebra',
        weightageEstimate: '5-6 marks',
        topics: ['Matrix Operations & Multiplication', 'Transpose & Properties', 'Symmetric & Skew-Symmetric Matrices', 'Invertible Matrices']
      },
      {
        id: 'determinants',
        name: 'Determinants',
        unit: 'Unit II: Algebra',
        weightageEstimate: '5-6 marks',
        topics: ['Minors, Cofactors & Adjoint', 'Inverse of a Matrix', 'Solving System of Linear Equations using Matrix Method', 'Area of Triangles using Determinants']
      },
      {
        id: 'continuity-diff',
        name: 'Continuity and Differentiability',
        unit: 'Unit III: Calculus',
        weightageEstimate: '8-9 marks',
        topics: ['Continuity at a Point and in an Interval', 'Chain Rule & Derivative of Implicit Functions', 'Derivatives of Exponential and Logarithmic Functions', 'Logarithmic Differentiation', 'Second Order Derivatives']
      },
      {
        id: 'applications-derivatives',
        name: 'Application of Derivatives',
        unit: 'Unit III: Calculus',
        weightageEstimate: '7-8 marks',
        topics: ['Rate of Change of Quantities', 'Strictly Increasing and Decreasing Functions', 'Maxima and Minima (First & Second Derivative Tests)', 'Applied Optimization Word Problems']
      },
      {
        id: 'integrals',
        name: 'Integrals',
        unit: 'Unit III: Calculus',
        weightageEstimate: '9-10 marks',
        topics: ['Integration by Substitution', 'Integration by Partial Fractions', 'Integration by Parts', 'Definite Integrals as Reverse of Differentiation', 'Fundamental Theorem of Calculus', 'Standard Properties of Definite Integrals']
      },
      {
        id: 'applications-integrals',
        name: 'Application of Integrals',
        unit: 'Unit III: Calculus',
        weightageEstimate: '5-6 marks',
        topics: ['Area under Simple Curves (Lines, Parabolas, Circles, Ellipses)', 'Area Bounded between Two Standard Curves']
      },
      {
        id: 'differential-equations',
        name: 'Differential Equations',
        unit: 'Unit III: Calculus',
        weightageEstimate: '6-7 marks',
        topics: ['Order and Degree of Differential Equations', 'General and Particular Solutions', 'Variable Separable Method', 'Homogeneous Differential Equations', 'First-Order Linear Differential Equations (dy/dx + Py = Q)']
      },
      {
        id: 'vector-algebra',
        name: 'Vectors',
        unit: 'Unit IV: Vectors and 3D Geometry',
        weightageEstimate: '6-7 marks',
        topics: ['Scalar (Dot) Product and Properties', 'Vector (Cross) Product and Applications', 'Direction Cosines and Direction Ratios', 'Projection of a Vector on a Line']
      },
      {
        id: 'three-dimensional-geometry',
        name: 'Three-Dimensional Geometry',
        unit: 'Unit IV: Vectors and 3D Geometry',
        weightageEstimate: '7-8 marks',
        topics: ['Vector and Cartesian Equations of a Line', 'Angle between Two Lines', 'Shortest Distance between Two Skew Lines', 'Shortest Distance between Parallel Lines']
      },
      {
        id: 'linear-programming',
        name: 'Linear Programming',
        unit: 'Unit V: Linear Programming',
        weightageEstimate: '5 marks',
        topics: ['Formulation of LPP Problems', 'Graphical Method of Solution', 'Bounded and Unbounded Feasible Regions', 'Corner Point Method for Optimization']
      },
      {
        id: 'probability',
        name: 'Probability',
        unit: 'Unit VI: Probability',
        weightageEstimate: '8 marks',
        topics: ['Conditional Probability & Multiplication Theorem', 'Independent Events', 'Law of Total Probability', 'Bayes’ Theorem', 'Random Variables and Probability Distributions']
      }
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    code: '042',
    totalChapters: 14,
    description: 'Electrostatics, Magnetism, Optics, Modern Physics & Semiconductor Devices (CBSE 2026–27)',
    iconName: 'Atom',
    chapters: [
      {
        id: 'electric-charges-fields',
        name: 'Electric Charges and Fields',
        unit: 'Unit I: Electrostatics',
        weightageEstimate: '8-9 marks (with Ch 2)',
        topics: ["Coulomb’s Law in Vector Form", "Electric Field Lines & Flux", "Electric Dipole in Uniform Field", "Gauss’s Law and Applications (Infinite Wire, Plane Sheet, Spherical Shell)"]
      },
      {
        id: 'electrostatic-potential-capacitance',
        name: 'Electrostatic Potential and Capacitance',
        unit: 'Unit I: Electrostatics',
        weightageEstimate: '7-8 marks',
        topics: ['Electric Potential due to Point Charge & Dipole', 'Equipotential Surfaces & Properties', 'Capacitance of Parallel Plate Capacitor', 'Effect of Dielectric on Capacitance', 'Energy Stored in a Capacitor']
      },
      {
        id: 'current-electricity',
        name: 'Current Electricity',
        unit: 'Unit II: Current Electricity',
        weightageEstimate: '7-8 marks',
        topics: ['Drift Velocity & Mobility (Ohm’s Law Derivation)', 'Temperature Dependence of Resistivity', 'Kirchhoff’s Laws (Junction & Loop Rules)', 'Wheatstone Bridge Principle', 'Combination of Cells (Series & Parallel)']
      },
      {
        id: 'moving-charges-magnetism',
        name: 'Moving Charges and Magnetism',
        unit: 'Unit III: Magnetic Effects of Current & Magnetism',
        weightageEstimate: '8-9 marks (with Ch 5)',
        topics: ['Biot-Savart Law and Applications (Circular Loop)', 'Ampere’s Circuital Law & Solenoid', 'Lorentz Magnetic Force', 'Force between Two Parallel Current-Carrying Conductors', 'Moving Coil Galvanometer (Conversion to Ammeter & Voltmeter)']
      },
      {
        id: 'magnetism-matter',
        name: 'Magnetism and Matter',
        unit: 'Unit III: Magnetic Effects of Current & Magnetism',
        weightageEstimate: '3-4 marks',
        topics: ['Magnetic Dipole Moment of Current Loop & Bar Magnet', 'Earth’s Magnetic Field Elements', 'Magnetic Properties (Dia-, Para-, and Ferro-magnetic materials)']
      },
      {
        id: 'electromagnetic-induction',
        name: 'Electromagnetic Induction',
        unit: 'Unit IV: EMI & Alternating Currents',
        weightageEstimate: '4-5 marks',
        topics: ['Faraday’s Laws of Electromagnetic Induction', 'Lenz’s Law and Conservation of Energy', 'Motional Electromotive Force (EMF)', 'Self and Mutual Inductance']
      },
      {
        id: 'alternating-current',
        name: 'Alternating Current',
        unit: 'Unit IV: EMI & Alternating Currents',
        weightageEstimate: '5-6 marks',
        topics: ['Peak and RMS Values of AC Current & Voltage', 'Phasor Diagrams for L, C, and R Circuits', 'Series LCR Circuit & Resonance Phenomenon', 'Quality (Q) Factor & Power Factor in AC', 'AC Generator and Transformer (Step-up / Step-down)']
      },
      {
        id: 'electromagnetic-waves',
        name: 'Electromagnetic Waves',
        unit: 'Unit V: Electromagnetic Waves',
        weightageEstimate: '3-4 marks',
        topics: ['Displacement Current & Maxwell’s Correction', 'Characteristics and Transverse Nature of EM Waves', 'Electromagnetic Spectrum (Order of Wavelengths & Uses)']
      },
      {
        id: 'ray-optics',
        name: 'Ray Optics and Optical Instruments',
        unit: 'Unit VI: Optics',
        weightageEstimate: '9-10 marks',
        topics: ['Refraction at Spherical Surfaces & Lens Maker’s Formula', 'Total Internal Reflection (TIR) & Optical Fibers', 'Refraction and Dispersion through a Prism', 'Compound Microscope (Magnifying Power)', 'Astronomical Telescope (Refracting & Reflecting types)']
      },
      {
        id: 'wave-optics',
        name: 'Wave Optics',
        unit: 'Unit VI: Optics',
        weightageEstimate: '6-7 marks',
        topics: ['Huygens’ Wavefront Principle & Proof of Laws of Reflection/Refraction', 'Interference of Light & Coherent Sources', 'Young’s Double Slit Experiment (Fringe Width Derivation)', 'Single Slit Diffraction & Central Maximum Width']
      },
      {
        id: 'dual-nature-radiation',
        name: 'Dual Nature of Radiation and Matter',
        unit: 'Unit VII: Dual Nature of Radiation and Matter',
        weightageEstimate: '5-6 marks',
        topics: ['Photoelectric Effect Experimental Observations', 'Einstein’s Photoelectric Equation and Explanation', 'de Broglie Hypothesis & Wavelength of Matter Waves']
      },
      {
        id: 'atoms',
        name: 'Atoms',
        unit: 'Unit VIII: Atoms & Nuclei',
        weightageEstimate: '4-5 marks',
        topics: ['Alpha Particle Scattering & Rutherford’s Nuclear Model', 'Bohr Model of Hydrogen Atom (Radius, Velocity, Energy Levels)', 'Hydrogen Emission Line Spectra (Lyman, Balmer, Paschen Series)']
      },
      {
        id: 'nuclei',
        name: 'Nuclei',
        unit: 'Unit VIII: Atoms & Nuclei',
        weightageEstimate: '3-4 marks',
        topics: ['Composition and Size of Nucleus', 'Mass-Energy Equivalence & Mass Defect', 'Binding Energy per Nucleon and Nuclear Stability', 'Nuclear Fission and Nuclear Fusion']
      },
      {
        id: 'semiconductors',
        name: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',
        unit: 'Unit IX: Electronic Devices',
        weightageEstimate: '7-8 marks',
        topics: ['Energy Band Theory (Conductors, Semiconductors, Insulators)', 'Intrinsic and Extrinsic Semiconductors (p-type, n-type)', 'p-n Junction Diode Formation & Forward/Reverse V-I Characteristics', 'Diode as Half-Wave and Full-Wave Rectifier']
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    code: '043',
    totalChapters: 10,
    description: 'Physical, Inorganic & Organic Chemistry (CBSE 2026–27 Rationalized Syllabus)',
    iconName: 'FlaskConical',
    chapters: [
      {
        id: 'solutions',
        name: 'Solutions',
        unit: 'Unit I: Solutions',
        weightageEstimate: '7 marks',
        topics: ['Types of Solutions & Solubility of Gases (Henry’s Law)', 'Vapour Pressure of Liquid Solutions & Raoult’s Law (Ideal & Non-ideal)', 'Colligative Properties (Relative Lowering of VP, Elevation in BP, Depression in FP, Osmotic Pressure)', 'Van’t Hoff Factor (i) and Abnormal Molar Mass']
      },
      {
        id: 'electrochemistry',
        name: 'Electrochemistry',
        unit: 'Unit II: Electrochemistry',
        weightageEstimate: '9 marks',
        topics: ['Galvanic Cells & Standard Electrode Potential', 'Nernst Equation and Cell Potential Calculations', 'Conductance in Electrolytic Solutions & Kohlrausch’s Law', 'Faraday’s Laws of Electrolysis', 'Batteries (Primary & Secondary), Fuel Cells, and Corrosion']
      },
      {
        id: 'chemical-kinetics',
        name: 'Chemical Kinetics',
        unit: 'Unit III: Chemical Kinetics',
        weightageEstimate: '7 marks',
        topics: ['Rate of Reaction, Order, and Molecularity', 'Integrated Rate Equations for Zero and First-Order Reactions', 'Half-Life of a Reaction (t1/2)', 'Arrhenius Equation & Activation Energy (Ea)', 'Collision Theory of Chemical Reactions']
      },
      {
        id: 'd-and-f-block',
        name: 'The d- and f-Block Elements',
        unit: 'Unit IV: d- and f-Block Elements',
        weightageEstimate: '7 marks',
        topics: ['General Trends in 3d Transition Series (Ionization Enthalpy, Oxidation States, Colour, Catalytic Properties)', 'Potassium Dichromate (K2Cr2O7) & Potassium Permanganate (KMnO4) Preparations and Oxidizing Reactions', 'Lanthanoids: Electronic Configuration, Oxidation States & Lanthanoid Contraction', 'Actinoids: Comparison with Lanthanoids']
      },
      {
        id: 'coordination-compounds',
        name: 'Coordination Compounds',
        unit: 'Unit V: Coordination Compounds',
        weightageEstimate: '7 marks',
        topics: ['Werner’s Theory & IUPAC Nomenclature of Mononuclear Coordination Compounds', 'Geometrical and Optical Isomerism', 'Valence Bond Theory (VBT) and Inner/Outer Orbital Complexes', 'Crystal Field Theory (CFT) & Spectrochemical Series', 'Stability and Applications of Coordination Compounds']
      },
      {
        id: 'haloalkanes-haloarenes',
        name: 'Haloalkanes and Haloarenes',
        unit: 'Unit VI: Haloalkanes and Haloarenes',
        weightageEstimate: '6 marks',
        topics: ['Nomenclature and Nature of C-X Bond', 'Mechanisms of Nucleophilic Substitution (SN1 and SN2) & Stereochemical Aspects', 'Electrophilic Substitution Reactions of Haloarenes', 'Polyhalogen Compounds (Dichloromethane, Chloroform, Iodoform, Freons, DDT)']
      },
      {
        id: 'alcohols-phenols-ethers',
        name: 'Alcohols, Phenols and Ethers',
        unit: 'Unit VII: Alcohols, Phenols and Ethers',
        weightageEstimate: '6 marks',
        topics: ['Methods of Preparation of Alcohols (Hydration, Hydroboration-Oxidation, Grignard Reagent)', 'Acidity of Alcohols and Phenols', 'Electrophilic Substitution in Phenols (Kolbe’s Reaction, Reimer-Tiemann Reaction, Nitration)', 'Williamson’s Ether Synthesis and Cleavage of Ethers by HI']
      },
      {
        id: 'aldehydes-ketones-acids',
        name: 'Aldehydes, Ketones and Carboxylic Acids',
        unit: 'Unit VIII: Aldehydes, Ketones and Carboxylic Acids',
        weightageEstimate: '8 marks',
        topics: ['Nomenclature & Carbonyl Group Structure', 'Nucleophilic Addition Reactions (HCN, NaHSO3, Grignard, Alcohols)', 'Reactivity of α-Hydrogen: Aldol Condensation & Cannizzaro Reaction', 'Distinction Tests (Tollens’ Test, Fehling’s Test, Iodoform Test)', 'Acidity of Carboxylic Acids & Hell-Volhard-Zelinsky (HVZ) Reaction']
      },
      {
        id: 'amines',
        name: 'Amines',
        unit: 'Unit IX: Amines',
        weightageEstimate: '6 marks',
        topics: ['Structure and Basic Character of Amines (Gas Phase vs Aqueous Phase)', 'Methods of Preparation (Hoffmann Bromamide Degradation, Gabriel Phthalimide Synthesis, Reduction of Nitriles)', 'Distinction Tests (Carbylamine Test, Hinsberg’s Reagent Test)', 'Diazonium Salts: Preparation and Synthetic Transformations (Sandmeyer, Gattermann, Coupling Reactions)']
      },
      {
        id: 'biomolecules',
        name: 'Biomolecules',
        unit: 'Unit X: Biomolecules',
        weightageEstimate: '7 marks',
        topics: ['Carbohydrates: Monosaccharides (D-Glucose & D-Fructose open chain and cyclic structure)', 'Disaccharides & Polysaccharides (Glycosidic Linkage)', 'Proteins: Amino Acids, Peptide Bond, Primary/Secondary/Tertiary/Quaternary Structure, Denaturation', 'Vitamins Classification and Deficiency Diseases', 'Nucleic Acids: DNA Double Helix Structure, RNA Types, Differences']
      }
    ]
  }
];

/**
 * CBSE Class 10 Official Syllabus for Academic Session 2026–27
 * Supported Core Subjects:
 * 1. Mathematics (Subject Code 041) - 14 Chapters
 * 2. Science (Subject Code 086) - 13 Chapters
 * 3. Social Science (Subject Code 087) - 20 Chapters
 * 4. English (Subject Code 184) - Literature, Supplementary & Grammar
 */
export const CBSE_CLASS_10_SUBJECTS: SubjectInfo[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    code: '041',
    totalChapters: 14,
    description: 'Algebra, Geometry, Trigonometry, Mensuration & Statistics (CBSE 2026–27 Standard & Basic)',
    iconName: 'Calculator',
    chapters: [
      {
        id: 'real-numbers',
        name: 'Real Numbers',
        unit: 'Unit I: Number Systems',
        weightageEstimate: '6 marks',
        topics: ['Fundamental Theorem of Arithmetic', 'Revisiting Irrational Numbers (Proofs of √2, √3, √5)', 'Decimal Expansions of Rational Numbers']
      },
      {
        id: 'polynomials',
        name: 'Polynomials',
        unit: 'Unit II: Algebra',
        weightageEstimate: '4-5 marks',
        topics: ['Geometrical Meaning of the Zeroes of a Polynomial', 'Relationship between Zeroes and Coefficients of a Quadratic Polynomial']
      },
      {
        id: 'linear-equations',
        name: 'Pair of Linear Equations in Two Variables',
        unit: 'Unit II: Algebra',
        weightageEstimate: '6-7 marks',
        topics: ['Graphical Method of Solution and Consistency Conditions (a1/a2, b1/b2, c1/c2)', 'Substitution Method', 'Elimination Method', 'Word Problems on Real Life Applications']
      },
      {
        id: 'quadratic-equations',
        name: 'Quadratic Equations',
        unit: 'Unit II: Algebra',
        weightageEstimate: '6 marks',
        topics: ['Standard Form ax² + bx + c = 0 (a ≠ 0)', 'Solution by Factorisation', 'Solution by Quadratic Formula (Sridharacharya Formula)', 'Discriminant D = b² - 4ac and Nature of Roots']
      },
      {
        id: 'arithmetic-progressions',
        name: 'Arithmetic Progressions',
        unit: 'Unit II: Algebra',
        weightageEstimate: '5-6 marks',
        topics: ['nth Term of an AP: aₙ = a + (n - 1)d', 'Sum of First n Terms: Sₙ = n/2[2a + (n - 1)d] = n/2[a + l]', 'Daily Life Situational Applications']
      },
      {
        id: 'triangles',
        name: 'Triangles',
        unit: 'Unit IV: Geometry',
        weightageEstimate: '8-9 marks',
        topics: ['Basic Proportionality Theorem (Thales Theorem) and its Converse', 'Criteria for Similarity of Triangles (AAA, SSS, SAS)', 'Proof-Based Geometric Reasoning & Applications']
      },
      {
        id: 'coordinate-geometry',
        name: 'Coordinate Geometry',
        unit: 'Unit III: Coordinate Geometry',
        weightageEstimate: '6 marks',
        topics: ['Review of Concepts of Coordinate Axes', 'Distance Formula: √[(x₂ - x₁)² + (y₂ - y₁)²]', 'Section Formula (Internal Division): [ (m₁x₂ + m₂x₁)/(m₁ + m₂), (m₁y₂ + m₂y₁)/(m₁ + m₂) ]', 'Midpoint Formula']
      },
      {
        id: 'intro-trigonometry',
        name: 'Introduction to Trigonometry',
        unit: 'Unit V: Trigonometry',
        weightageEstimate: '7 marks',
        topics: ['Trigonometric Ratios of an Acute Angle', 'Values of Ratios for 0°, 30°, 45°, 60° and 90°', 'Proof and Application of Identity: sin²θ + cos²θ = 1', '1 + tan²θ = sec²θ and 1 + cot²θ = cosec²θ']
      },
      {
        id: 'applications-trigonometry',
        name: 'Some Applications of Trigonometry',
        unit: 'Unit V: Trigonometry',
        weightageEstimate: '5 marks',
        topics: ['Line of Sight, Angle of Elevation and Angle of Depression', 'Simple Problems on Heights and Distances (Single and Two-Triangle Cases)', 'Angles limited to 30°, 45°, 60°']
      },
      {
        id: 'circles',
        name: 'Circles',
        unit: 'Unit IV: Geometry',
        weightageEstimate: '6 marks',
        topics: ['Tangent to a Circle at Point of Contact is Perpendicular to Radius', 'Lengths of Tangents from an External Point are Equal', 'Cyclic Quadrilaterals circumscribing circles']
      },
      {
        id: 'areas-related-circles',
        name: 'Areas Related to Circles',
        unit: 'Unit VI: Mensuration',
        weightageEstimate: '4 marks',
        topics: ['Area of Sector of Angle θ: (θ/360°) × πr²', 'Length of Arc of Sector: (θ/360°) × 2πr', 'Area of Segment of a Circle (Major and Minor)']
      },
      {
        id: 'surface-areas-volumes',
        name: 'Surface Areas and Volumes',
        unit: 'Unit VI: Mensuration',
        weightageEstimate: '6 marks',
        topics: ['Surface Areas and Volumes of Combinations of Solids (Cubes, Cuboids, Spheres, Hemispheres, Cones, Cylinders)', 'Problems involving Conversion of Solid from One Shape to Another']
      },
      {
        id: 'statistics',
        name: 'Statistics',
        unit: 'Unit VII: Statistics & Probability',
        weightageEstimate: '7 marks',
        topics: ['Mean of Grouped Data (Direct Method & Assumed Mean Method)', 'Mode of Grouped Data: l + [(f₁ - f₀)/(2f₁ - f₀ - f₂)] × h', 'Median of Grouped Data: l + [(n/2 - cf)/f] × h', 'Empirical Relationship: Mode = 3 Median - 2 Mean']
      },
      {
        id: 'probability',
        name: 'Probability',
        unit: 'Unit VII: Statistics & Probability',
        weightageEstimate: '4-5 marks',
        topics: ['Classical Definition of Probability: P(E) = Number of favourable outcomes / Total outcomes', 'Sure Event (P = 1), Impossible Event (P = 0)', 'Complementary Events: P(E) + P(not E) = 1']
      }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    code: '086',
    totalChapters: 13,
    description: 'Chemical Substances, World of Living, Natural Phenomena & Effects of Current (CBSE 2026–27)',
    iconName: 'Atom',
    chapters: [
      {
        id: 'chemical-reactions',
        name: 'Chemical Reactions and Equations',
        unit: 'Unit I: Chemical Substances - Nature and Behaviour',
        weightageEstimate: '6 marks',
        topics: ['Chemical Equations and Balancing by Hit and Trial', 'Types of Reactions: Combination, Decomposition, Displacement, Double Displacement', 'Precipitation and Neutralisation Reactions', 'Oxidation and Reduction in Terms of Gain/Loss of Oxygen/Hydrogen', 'Corrosion and Rancidity Prevention']
      },
      {
        id: 'acids-bases-salts',
        name: 'Acids, Bases and Salts',
        unit: 'Unit I: Chemical Substances - Nature and Behaviour',
        weightageEstimate: '6-7 marks',
        topics: ['Definitions in terms of H⁺ and OH⁻ ions', 'General Properties and Reactions with Metals/Carbonates', 'pH Scale Concept and Importance in Everyday Life', 'Preparation and Uses: Sodium Hydroxide (Chlor-alkali process), Bleaching Powder, Baking Soda, Washing Soda, Plaster of Paris']
      },
      {
        id: 'metals-non-metals',
        name: 'Metals and Non-metals',
        unit: 'Unit I: Chemical Substances - Nature and Behaviour',
        weightageEstimate: '7 marks',
        topics: ['Physical and Chemical Properties of Metals and Non-metals', 'Reactivity Series of Metals', 'Formation and Properties of Ionic Compounds (Electron Dot Structures)', 'Basic Metallurgical Processes (Roasting, Calcination, Electrolytic Refining)', 'Corrosion and Rusting Prevention (Galvanization, Alloys)']
      },
      {
        id: 'carbon-compounds',
        name: 'Carbon and its Compounds',
        unit: 'Unit I: Chemical Substances - Nature and Behaviour',
        weightageEstimate: '7-8 marks',
        topics: ['Covalent Bonding in Carbon Compounds', 'Versatile Nature of Carbon (Catenation, Tetravalency)', 'Homologous Series and Functional Groups (Halo, Alcohol, Ketone, Aldehyde, Alkanes, Alkenes, Alkynes)', 'Chemical Properties: Combustion, Oxidation, Addition, Substitution', 'Ethanol and Ethanoic Acid (Properties and Reactions)', 'Soaps and Detergents (Micelle Formation & Cleansing Action)']
      },
      {
        id: 'life-processes',
        name: 'Life Processes',
        unit: 'Unit II: World of Living',
        weightageEstimate: '8-9 marks',
        topics: ['Autotrophic and Heterotrophic Nutrition (Photosynthesis in Plants, Digestion in Human Alimentary Canal)', 'Respiration: Aerobic vs Anaerobic Pathways (Glycolysis, Krebs cycle in yeast and muscle)', 'Transportation in Plants (Xylem and Phloem) and Animals (Double Circulation in Human Heart)', 'Excretion in Human Beings (Nephron Structure and Urine Formation) and Plants']
      },
      {
        id: 'control-coordination',
        name: 'Control and Coordination',
        unit: 'Unit II: World of Living',
        weightageEstimate: '6 marks',
        topics: ['Tropic Movements in Plants (Phototropism, Geotropism, Hydrotropism, Thigmotropism)', 'Plant Hormones (Auxins, Gibberellins, Cytokinins, Abscisic Acid)', 'Nervous System in Animals: Neuron Structure, Synapse, Reflex Arc', 'Human Brain Anatomy (Forebrain, Midbrain, Hindbrain)', 'Endocrine Glands and Hormones (Thyroid, Pituitary, Pancreas, Adrenal, Gonads)']
      },
      {
        id: 'how-organisms-reproduce',
        name: 'How do Organisms Reproduce?',
        unit: 'Unit II: World of Living',
        weightageEstimate: '7 marks',
        topics: ['Asexual Reproduction Modes: Fission, Fragmentation, Regeneration, Budding, Vegetative Propagation, Spore Formation', 'Sexual Reproduction in Flowering Plants (Structure of Flower, Pollination, Double Fertilisation, Seed Formation)', 'Human Reproductive System (Male and Female)', 'Reproductive Health, Contraceptive Methods, STDs and Prevention']
      },
      {
        id: 'heredity',
        name: 'Heredity and Evolution',
        unit: 'Unit II: World of Living',
        weightageEstimate: '4-5 marks',
        topics: ['Heredity and Variation', 'Mendel’s Laws of Inheritance: Monohybrid Cross (3:1, 1:2:1) and Dihybrid Cross (9:3:3:1)', 'Sex Determination in Human Beings (XX and XY Chromosomes)']
      },
      {
        id: 'light-reflection-refraction',
        name: 'Light - Reflection and Refraction',
        unit: 'Unit III: Natural Phenomena',
        weightageEstimate: '9-10 marks',
        topics: ['Reflection by Spherical Mirrors (Concave and Convex): Ray Diagrams, Sign Convention', 'Mirror Formula: 1/f = 1/v + 1/u and Linear Magnification m = -v/u', 'Refraction of Light and Snell’s Law: sin(i)/sin(r) = n', 'Absolute and Relative Refractive Index', 'Refraction through Spherical Lenses: Lens Formula 1/f = 1/v - 1/u, m = v/u', 'Power of a Lens: P = 1/f (in metres) with Dioptre (D) unit']
      },
      {
        id: 'human-eye',
        name: 'The Human Eye and the Colourful World',
        unit: 'Unit III: Natural Phenomena',
        weightageEstimate: '5 marks',
        topics: ['Functioning of Human Eye (Accommodation, Near Point 25 cm, Far Point ∞)', 'Defects of Vision: Myopia (Concave lens), Hypermetropia (Convex lens), Presbyopia', 'Refraction of Light through a Triangular Glass Prism', 'Dispersion of White Light and Rainbow Formation', 'Atmospheric Refraction (Twinkling of Stars, Advanced Sunrise and Delayed Sunset)', 'Scattering of Light: Tyndall Effect, Blue Sky, Redness of Sun at Sunrise/Sunset']
      },
      {
        id: 'electricity',
        name: 'Electricity',
        unit: 'Unit IV: Effects of Current',
        weightageEstimate: '8-9 marks',
        topics: ['Electric Current (I = Q/t) and Electric Potential Difference (V = W/Q)', 'Ohm’s Law (V = IR) and Verification', 'Resistance and Factors Affecting Resistance: R = ρ(l/A)', 'Resistors in Series (R_s = R₁ + R₂ + ...) and Parallel (1/R_p = 1/R₁ + 1/R₂ + ...)', 'Joule’s Law of Heating: H = I²Rt', 'Electric Power: P = VI = I²R = V²/R, Commercial Unit of Energy (1 kWh = 3.6 × 10⁶ J)']
      },
      {
        id: 'magnetic-effects',
        name: 'Magnetic Effects of Electric Current',
        unit: 'Unit IV: Effects of Current',
        weightageEstimate: '6-7 marks',
        topics: ['Magnetic Field and Field Lines Characteristics', 'Magnetic Field due to Current-Carrying Straight Conductor (Right Hand Thumb Rule)', 'Magnetic Field due to Circular Loop and Solenoid (Electromagnet)', 'Force on a Current-Carrying Conductor in a Magnetic Field', 'Fleming’s Left-Hand Rule and Electric Motor Principle', 'Domestic Electric Circuits (Live, Neutral, Earth wires, Fuse, Short Circuit, Overloading)']
      },
      {
        id: 'our-environment',
        name: 'Our Environment',
        unit: 'Unit V: Natural Resources',
        weightageEstimate: '4-5 marks',
        topics: ['Ecosystem: Components (Biotic and Abiotic)', 'Food Chains and Food Webs: Trophic Levels, 10 Percent Law of Energy Flow', 'Biological Magnification', 'Ozone Layer Depletion and CFCs (Montreal Protocol)', 'Solid Waste Management (Biodegradable and Non-biodegradable Waste)']
      }
    ]
  },
  {
    id: 'social_science',
    name: 'Social Science',
    code: '087',
    totalChapters: 20,
    description: 'History, Contemporary Geography, Democratic Politics & Economic Development (CBSE 2026–27)',
    iconName: 'Globe',
    chapters: [
      // History
      {
        id: 'rise-of-nationalism-europe',
        name: 'The Rise of Nationalism in Europe',
        unit: 'History: India and the Contemporary World - II',
        weightageEstimate: '5 marks',
        topics: ['French Revolution and the Idea of the Nation', 'Napoleonic Code of 1804', 'The Making of Nationalism in Europe (Liberal Nationalism, Zollverein)', 'The Age of Revolutions: 1830-1848', 'Unification of Germany (Otto von Bismarck) and Italy (Mazzini, Garibaldi, Cavour)', 'Visualizing the Nation (Marianne and Germania), Nationalism and Imperialism in Balkans']
      },
      {
        id: 'nationalism-in-india',
        name: 'Nationalism in India',
        unit: 'History: India and the Contemporary World - II',
        weightageEstimate: '6-7 marks',
        topics: ['First World War, Khilafat and Non-Cooperation Movement', 'Differing Strands within the Movement (Towns, Countryside, Tribal Awadh/Gudem Hills, Plantations)', 'Towards Civil Disobedience: Simon Commission, Purna Swaraj, Salt March', 'How Participants saw the Movement', 'The Limits of Civil Disobedience: Dalit participation (Poona Pact), Muslim League', 'The Sense of Collective Belonging (Bharat Mata image, Folklore, Tricolour flag)']
      },
      {
        id: 'making-global-world',
        name: 'The Making of a Global World',
        unit: 'History: India and the Contemporary World - II',
        weightageEstimate: '3-4 marks',
        topics: ['The Pre-modern World (Silk Routes, Food Travels: Potato and Spaghetti)', 'Conquest, Disease and Trade: Smallpox in the Americas', 'The Nineteenth Century (1815-1914): World Economy, Corn Laws, Indentured Labour Migration']
      },
      {
        id: 'print-culture',
        name: 'Print Culture and the Modern World',
        unit: 'History: India and the Contemporary World - II',
        weightageEstimate: '4-5 marks',
        topics: ['The First Printed Books (China, Japan, Korea)', 'Print Comes to Europe: Gutenberg and the Printing Press', 'The Print Revolution and its Impact (Religious Debates, Martin Luther)', 'The Reading Mania and Nineteenth Century developments', 'India and the World of Print: Manuscripts, Print and Censorship (Vernacular Press Act)']
      },
      // Geography
      {
        id: 'resources-development',
        name: 'Resources and Development',
        unit: 'Geography: Contemporary India - II',
        weightageEstimate: '4 marks',
        topics: ['Concept, Classification and Development of Resources', 'Resource Planning in India and Conservation', 'Land Resources, Land Use Pattern in India, Land Degradation and Conservation', 'Soil as a Resource: Classification (Alluvial, Black, Red & Yellow, Laterite, Arid, Forest) and Soil Erosion']
      },
      {
        id: 'forest-wildlife',
        name: 'Forest and Wildlife Resources',
        unit: 'Geography: Contemporary India - II',
        weightageEstimate: '3 marks',
        topics: ['Flora and Fauna in India', 'Conservation of Forest and Wildlife: Wildlife Protection Act 1972, Project Tiger', 'Types and Distribution of Forests (Reserved, Protected, Unclassed)', 'Community and Conservation: Chipko Movement, Joint Forest Management (JFM)']
      },
      {
        id: 'water-resources',
        name: 'Water Resources',
        unit: 'Geography: Contemporary India - II',
        weightageEstimate: '3-4 marks',
        topics: ['Water Scarcity and the Need for Water Conservation and Management', 'Multi-Purpose River Projects and Integrated Water Resources Management (Bhakra Nangal, Hirakud, Sardar Sarovar)', 'Rainwater Harvesting: Rooftop harvesting, Guls/Kuls, Khadins and Johads, Bamboo Drip Irrigation']
      },
      {
        id: 'agriculture',
        name: 'Agriculture',
        unit: 'Geography: Contemporary India - II',
        weightageEstimate: '5 marks',
        topics: ['Types of Farming: Primitive Subsistence, Intensive Subsistence, Commercial Farming', 'Cropping Pattern: Rabi, Kharif, Zaid', 'Major Food Crops (Rice, Wheat, Millets, Maize, Pulses) and Cash/Plantation Crops (Sugarcane, Tea, Coffee, Cotton, Jute)', 'Technological and Institutional Reforms (Green Revolution, White Revolution, KCC, PAIS)', 'Contribution of Agriculture to the National Economy']
      },
      {
        id: 'minerals-energy-resources',
        name: 'Minerals and Energy Resources',
        unit: 'Geography: Contemporary India - II',
        weightageEstimate: '5 marks',
        topics: ['What is a Mineral? Modes of Occurrence', 'Ferrous (Iron Ore, Manganese) and Non-Ferrous (Bauxite, Copper) Minerals', 'Non-Metallic Minerals (Mica, Limestone) and Rock Minerals', 'Conventional Energy Sources (Coal, Petroleum, Natural Gas, Electricity)', 'Non-Conventional Energy Sources (Solar, Wind, Biogas, Tidal, Geothermal)', 'Conservation of Minerals and Energy']
      },
      {
        id: 'manufacturing-industries',
        name: 'Manufacturing Industries',
        unit: 'Geography: Contemporary India - II',
        weightageEstimate: '4-5 marks',
        topics: ['Importance of Manufacturing and Contribution to National Economy', 'Industrial Location Factors (Raw Material, Labour, Capital, Power, Market)', 'Classification of Industries: Agro-based (Textiles, Sugar) and Mineral-based (Iron & Steel, Aluminium, Chemical, Fertilizer, Cement, Automobile, IT)', 'Industrial Pollution and Environmental Degradation', 'Control of Environmental Degradation (NTPC proactive approach)']
      },
      {
        id: 'lifelines-national-economy',
        name: 'Lifelines of National Economy',
        unit: 'Geography: Contemporary India - II',
        weightageEstimate: '3 marks',
        topics: ['Transport: Roadways (Golden Quadrilateral, National Highways), Railways, Pipelines, Waterways (Major Sea Ports), Airways', 'Communication: Personal and Mass Communication (Radio, TV, Films, Print)', 'International Trade as Economic Barometer, Tourism as a Trade']
      },
      // Political Science
      {
        id: 'power-sharing',
        name: 'Power Sharing',
        unit: 'Democratic Politics - II',
        weightageEstimate: '4-5 marks',
        topics: ['Case Studies of Belgium and Sri Lanka (Majoritarianism vs Accommodation)', 'Why Power Sharing is Desirable: Prudential and Moral Reasons', 'Forms of Power Sharing: Horizontal (Legislature, Executive, Judiciary), Vertical (Federal), Social Groups, Political Parties and Pressure Groups']
      },
      {
        id: 'federalism',
        name: 'Federalism',
        unit: 'Democratic Politics - II',
        weightageEstimate: '4-5 marks',
        topics: ['What is Federalism? Key Features of Federalism', 'Coming Together vs Holding Together Federations', 'What Makes India a Federal Country? Three-Fold Distribution of Powers (Union, State, Concurrent Lists, Residuary Powers)', 'How is Federalism Practised? Linguistic States, Language Policy, Centre-State Relations', 'Decentralisation in India: 73rd and 74th Constitutional Amendments (1992)']
      },
      {
        id: 'gender-religion-caste',
        name: 'Gender, Religion and Caste',
        unit: 'Democratic Politics - II',
        weightageEstimate: '4 marks',
        topics: ['Gender and Politics: Sexual Division of Labour, Feminist Movements, Women’s Political Representation', 'Religion, Communalism and Politics: Communal Politics, Secular State Provisions in the Indian Constitution', 'Caste and Politics: Caste Inequalities, Caste in Politics and Politics in Caste']
      },
      {
        id: 'political-parties',
        name: 'Political Parties',
        unit: 'Democratic Politics - II',
        weightageEstimate: '5 marks',
        topics: ['Why do We Need Political Parties? Meaning, Functions and Necessity', 'How Many Parties Should We Have? One-Party, Two-Party and Multi-Party Systems', 'National Political Parties (Criteria: BJP, INC, AAP, BSP, CPI-M) vs State/Regional Parties', 'Challenges to Political Parties: Lack of Internal Democracy, Dynastic Succession, Money & Muscle Power, Meaningful Choices', 'How can Parties be Reformed? Anti-Defection Law, EC mandates, Proposed reforms']
      },
      {
        id: 'outcomes-of-democracy',
        name: 'Outcomes of Democracy',
        unit: 'Democratic Politics - II',
        weightageEstimate: '3-4 marks',
        topics: ['How do We Assess Democracy’s Outcomes? (Promotes equality, enhances dignity, improves decision quality)', 'Accountable, Responsive and Legitimate Government', 'Economic Growth and Development vs Reduction of Inequality and Poverty', 'Accommodation of Social Diversity and Dignity and Freedom of the Citizens']
      },
      // Economics
      {
        id: 'development',
        name: 'Development',
        unit: 'Economics: Understanding Economic Development',
        weightageEstimate: '4 marks',
        topics: ['What Development Promises - Different People, Different Goals (Conflicting Goals)', 'Income and Other Goals (Freedom, Security, Respect)', 'National Development and Comparing Different Countries (Per Capita Income by World Bank Report)', 'Income and Other Criteria: Infant Mortality Rate (IMR), Literacy Rate, Net Attendance Ratio (Kerala vs Haryana/Bihar)', 'Public Facilities (PDS, Health, Education)', 'Sustainability of Development (Groundwater depletion, Exhaustion of natural resources)']
      },
      {
        id: 'sectors-indian-economy',
        name: 'Sectors of the Indian Economy',
        unit: 'Economics: Understanding Economic Development',
        weightageEstimate: '5 marks',
        topics: ['Sectors of Economic Activities: Primary, Secondary, Tertiary', 'Historical Changes in Sectors (Shift to Tertiary Sector in GDP)', 'Where are Most People Employed? Disguised Unemployment / Underemployment in Agriculture', 'How to Create More Employment? (MGNREGA 2005, Cheap credit, Irrigation, Rural industries)', 'Division of Sectors as Organised and Unorganised (Working conditions, Job security)', 'Sectors in Terms of Ownership: Public (Railways, Post Office) and Private Sectors (TATA, Reliance)']
      },
      {
        id: 'money-and-credit',
        name: 'Money and Credit',
        unit: 'Economics: Understanding Economic Development',
        weightageEstimate: '5 marks',
        topics: ['Money as a Medium of Exchange: Elimination of Double Coincidence of Wants (Barter System)', 'Modern Forms of Money: Currency (Paper notes and Coins) and Demand Deposits, Cheques', 'Loan Activities of Banks: Spread as Income', 'Two Different Credit Situations (Productive vs Debt Trap: Salim vs Swapna)', 'Terms of Credit: Collateral, Interest Rate, Documentation, Mode of Repayment', 'Formal vs Informal Sector Loans in India: Role of Reserve Bank of India (RBI)', 'Self-Help Groups (SHGs) for the Poor']
      },
      {
        id: 'globalisation',
        name: 'Globalisation and the Indian Economy',
        unit: 'Economics: Understanding Economic Development',
        weightageEstimate: '4 marks',
        topics: ['Production across Countries: Multinational Corporations (MNCs)', 'Interlinking Production across Countries (Joint ventures, Local partnerships, Buying local companies)', 'Foreign Trade and Integration of Markets', 'What is Globalisation? Factors Enabling Globalisation: Technology (IT & Telecom) and Liberalisation of Foreign Trade & Investment (1991 reforms)', 'World Trade Organisation (WTO) and Fair Globalisation Impact on Small Producers']
      }
    ]
  },
  {
    id: 'english',
    name: 'English',
    code: '184',
    totalChapters: 18,
    description: 'Language & Literature: First Flight, Footprints Without Feet & Integrated Grammar (CBSE 2026–27)',
    iconName: 'BookOpen',
    chapters: [
      {
        id: 'first-flight-prose-1',
        name: 'A Letter to God (G.L. Fuentes)',
        unit: 'First Flight: Prose & Poetry',
        weightageEstimate: '4-5 marks',
        topics: ['Lencho’s Faith in God and the Destruction of Crops by Hailstorm', 'The Postmaster’s Generosity and the "Bunch of Crooks" Irony', 'Themes of Faith, Human Compassion and Irony']
      },
      {
        id: 'first-flight-prose-2',
        name: 'Nelson Mandela: Long Walk to Freedom',
        unit: 'First Flight: Prose & Poetry',
        weightageEstimate: '4-5 marks',
        topics: ['Inauguration Ceremony at Union Buildings Amphitheatre (10th May 1994)', 'Apartheid and the Struggle for Freedom', 'Twin Obligations: To Family and To People', 'Meaning of Courage: Not the Absence of Fear, but Triumph over it']
      },
      {
        id: 'first-flight-prose-3',
        name: 'Two Stories about Flying',
        unit: 'First Flight: Prose & Poetry',
        weightageEstimate: '4 marks',
        topics: ['Part I: His First Flight (Liam O’Flaherty) - Young Seagull Conquering Fear of Flight', 'Part II: Black Aeroplane (Frederick Forsyth) - The Mysterious Pilot of Dakota DS 088 in the Storm']
      },
      {
        id: 'first-flight-prose-4',
        name: 'From the Diary of Anne Frank',
        unit: 'First Flight: Prose & Poetry',
        weightageEstimate: '4 marks',
        topics: ['Anne’s Need for a True Friend ("Kitty")', 'Life in the Secret Annex during Nazi Occupation', 'Interactions with Mr. Keesing and the "Chatterbox" Essays']
      },
      {
        id: 'first-flight-prose-5',
        name: 'Glimpses of India',
        unit: 'First Flight: Prose & Poetry',
        weightageEstimate: '5 marks',
        topics: ['Part I: A Baker from Goa (Lucio Rodrigues) - Pader, Bol and Traditional Goan Village Life', 'Part II: Coorg (Lokesh Abrol) - Coffee Estates, Martial Men, Kodavus and River Kaveri', 'Part III: Tea from Assam (Arup Kumar Datta) - Pranjol, Rajvir and Legends of Tea Discovery']
      },
      {
        id: 'first-flight-prose-6',
        name: 'Mijbil the Otter (Gavin Maxwell)',
        unit: 'First Flight: Prose & Poetry',
        weightageEstimate: '3-4 marks',
        topics: ['Keeping an Otter as a Pet in Camusfearna (Tigris Marshes to London)', 'Mijbil’s Playful Nature and Journey by Air', 'Londoners’ Guesses about Mijbil (Seal, Walrus, Hippo)']
      },
      {
        id: 'first-flight-prose-7',
        name: 'Madam Rides the Bus (Vallikkannan)',
        unit: 'First Flight: Prose & Poetry',
        weightageEstimate: '4-5 marks',
        topics: ['Eight-Year-Old Valliammai (Valli)’s Desire to Ride the Town Bus', 'Planning the Journey: Saving Sixty Paise and Gathering Information', 'Experience on the Bus and Encounter with the Dead Cow (Reality of Death)']
      },
      {
        id: 'first-flight-prose-8',
        name: 'The Sermon at Benares (Betty Renshaw)',
        unit: 'First Flight: Prose & Poetry',
        weightageEstimate: '4-5 marks',
        topics: ['Gautama Buddha’s Path to Enlightenment at Bodh Gaya', 'Kisa Gotami and the Mustard Seed Lesson', 'The Inevitability of Death and Overcoming Grief']
      },
      {
        id: 'first-flight-play-9',
        name: 'The Proposal (Anton Chekhov)',
        unit: 'First Flight: Drama',
        weightageEstimate: '5 marks',
        topics: ['Ivan Vassilevitch Lomov’s Marriage Proposal to Natalya Stepanovna', 'The Petty Arguments over Oxen Meadows and Hunting Dogs (Guess vs Squeezer)', 'Stepan Stepanovitch Chubukov’s Role and Social Satire on Wealthy Russian Marriages']
      },
      {
        id: 'first-flight-poems',
        name: 'First Flight: Essential Poems',
        unit: 'First Flight: Poetry',
        weightageEstimate: '6-8 marks',
        topics: ['Dust of Snow & Fire and Ice (Robert Frost) - Nature’s Healing Power & Destruction by Desire/Hatred', 'A Tiger in the Zoo (Leslie Norris) - Captivity vs Wild Freedom', 'How to Tell Wild Animals (Carolyn Wells) & The Ball Poem (John Berryman - Coping with Loss)', 'Amanda! (Robin Klein) - Longing for Freedom from Nagging', 'The Trees (Adrienne Rich) & Fog (Carl Sandburg)', 'The Tale of Custard the Dragon (Ogden Nash) - Appearance vs True Bravery', 'For Anne Gregory (W.B. Yeats) - Inner Beauty vs Physical Appearance']
      },
      // Footprints Without Feet
      {
        id: 'footprints-1',
        name: 'A Triumph of Surgery (James Herriot)',
        unit: 'Footprints Without Feet: Supplementary',
        weightageEstimate: '3-4 marks',
        topics: ['Mrs. Pumphrey’s Pampering and Tricki’s Bloated Illness', 'Dr. Herriot’s Strict Regime of Exercise and Diet without Medicines', 'Tricki’s Recovery and Mrs. Pumphrey’s Gratitude']
      },
      {
        id: 'footprints-2',
        name: 'The Thief’s Story (Ruskin Bond)',
        unit: 'Footprints Without Feet: Supplementary',
        weightageEstimate: '4 marks',
        topics: ['Hari Singh (Young Thief) and Anil (Struggling Writer)', 'Anil’s Trust: Teaching Hari to Read, Write and Add Numbers', 'The Theft of Six Hundred Rupees and Hari’s Moral Transformation at the Railway Station']
      },
      {
        id: 'footprints-3',
        name: 'The Midnight Visitor (Robert Arthur)',
        unit: 'Footprints Without Feet: Supplementary',
        weightageEstimate: '3 marks',
        topics: ['Ausable (Quick-Witted Secret Agent) and Fowler (Disappointed Romantic Writer)', 'Max’s Intrusion with a Pistol for Important Missile Reports', 'Ausable’s Clever Invention of the Balcony and the Knock at the Door']
      },
      {
        id: 'footprints-4',
        name: 'A Question of Trust (Victor Canning)',
        unit: 'Footprints Without Feet: Supplementary',
        weightageEstimate: '3-4 marks',
        topics: ['Horace Danby: Respectable Citizen and Rare Book Collector Robber', 'The Heist at Shotover Grange and Encounter with the Lady in Red', 'The Irony of Honor among Thieves']
      },
      {
        id: 'footprints-5',
        name: 'Footprints Without Feet (H.G. Wells)',
        unit: 'Footprints Without Feet: Supplementary',
        weightageEstimate: '3-4 marks',
        topics: ['Griffin the Eccentric Scientist: Discovery of Invisibility', 'Misuse of Science: Arson, Theft in London Store and Drury Lane', 'Arrival at Iping Village Inn (Mrs. Hall) and the Burglary at the Clergyman’s House']
      },
      {
        id: 'footprints-6',
        name: 'The Making of a Scientist (Robert W. Peterson)',
        unit: 'Footprints Without Feet: Supplementary',
        weightageEstimate: '4 marks',
        topics: ['Richard Ebright’s Journey from Butterfly Collecting to Molecular Biology', 'Role of his Mother and Dr. Fredrick A. Urquhart', 'Experiments on Monarch and Viceroy Butterflies, Hormones in Gold Spots, and the Theory of Cell Life']
      },
      {
        id: 'footprints-7',
        name: 'The Necklace (Guy de Maupassant)',
        unit: 'Footprints Without Feet: Supplementary',
        weightageEstimate: '4 marks',
        topics: ['Matilda Loisel’s Dissatisfaction with her Modest Life', 'The Minister’s Ball and the Borrowed Diamond Necklace from Madame Forestier', 'Ten Years of Poverty to Repay 36,000 Francs and the Shocking Revelation that the Necklace was Fake (500 Francs)']
      },
      {
        id: 'footprints-8',
        name: 'Bholi (K.A. Abbas)',
        unit: 'Footprints Without Feet: Supplementary',
        weightageEstimate: '4-5 marks',
        topics: ['Sulekha (Bholi)’s Childhood: Smallpox Marks, Stammering, Neglect by Family', 'Transformation through Education: The Teacher’s Encouragement and Kindness', 'Bholi’s Courage to Reject Bishamber Nath’s Dowry Demand (5,000 Rupees) and Becoming Self-Reliant']
      }
    ]
  }
];

/**
 * CBSE Class 12 Science Stream Subjects alias
 */
export const CBSE_CLASS_12_SCIENCE_SUBJECTS: SubjectInfo[] = CBSE_CLASS_12_SUBJECTS;

/**
 * CBSE Class 12 Commerce Stream Official Syllabus (Session 2026–27)
 * Supported Core Subjects:
 * 1. Accountancy (Subject Code 055) - 12 Chapters
 * 2. Business Studies (Subject Code 054) - 12 Chapters
 * 3. Economics (Subject Code 030) - 11 Chapters
 * 4. English Core (Subject Code 301) - 19 Chapters
 */
export const CBSE_CLASS_12_COMMERCE_SUBJECTS: SubjectInfo[] = [
  {
    id: 'accountancy',
    name: 'Accountancy',
    code: '055',
    totalChapters: 12,
    description: 'Partnership Accounts, Company Accounts, Ratios & Cash Flow Statement (CBSE 2026–27)',
    iconName: 'Calculator',
    chapters: [
      {
        id: 'acc-1',
        name: 'Accounting for Partnership Firms - Fundamentals',
        unit: 'Part A - Unit 1: Accounting for Partnership Firms',
        weightageEstimate: '6-8 marks',
        topics: [
          'Provisions of Indian Partnership Act 1932 in the Absence of Partnership Deed',
          'Fixed vs Fluctuating Capital Accounts',
          'Preparation of Profit and Loss Appropriation Account and Division of Profit',
          'Past Adjustments for Omission of Interest on Capital/Drawings and Salary',
          'Guarantee of Minimum Profit to a Partner'
        ]
      },
      {
        id: 'acc-2',
        name: 'Goodwill: Nature and Valuation',
        unit: 'Part A - Unit 1: Accounting for Partnership Firms',
        weightageEstimate: '3-4 marks',
        topics: [
          'Meaning, Nature and Factors Affecting Value of Goodwill',
          'Valuation by Average Profit Method and Weighted Average Method',
          'Super Profit Method and Capitalisation of Super Profit / Average Profit',
          'Accounting Treatment and Distinction between Purchased and Self-Generated Goodwill'
        ]
      },
      {
        id: 'acc-3',
        name: 'Change in Profit Sharing Ratio',
        unit: 'Part A - Unit 1: Accounting for Partnership Firms',
        weightageEstimate: '4-5 marks',
        topics: [
          'Calculation of Sacrificing Ratio and Gaining Ratio',
          'Accounting Treatment of Existing Goodwill and Revaluation of Assets/Liabilities',
          'Treatment of Reserves, Accumulated Profits and Losses',
          'Preparation of Revaluation Account and Partners’ Capital Accounts'
        ]
      },
      {
        id: 'acc-4',
        name: 'Admission of a Partner',
        unit: 'Part A - Unit 1: Accounting for Partnership Firms',
        weightageEstimate: '8-10 marks',
        topics: [
          'Calculation of New Profit Sharing Ratio and Sacrificing Ratio',
          'Accounting for Premium for Goodwill (brought in cash, partially, or unpaid)',
          'Revaluation Account, Accumulated Reserves and Workmen Compensation / Investment Fluctuation Reserve',
          'Adjustment of Partners’ Capital Accounts on the Basis of New Partner’s Capital or Old Partners’ Capital'
        ]
      },
      {
        id: 'acc-5',
        name: 'Retirement and Death of a Partner',
        unit: 'Part A - Unit 1: Accounting for Partnership Firms',
        weightageEstimate: '8-10 marks',
        topics: [
          'Calculation of New Ratio and Gaining Ratio on Retirement',
          'Treatment of Goodwill and Revaluation of Assets & Liabilities',
          'Settlement of Retiring Partner’s Dues and Loan Account',
          'Death of a Partner: Computation of Deceased Partner’s Share of Profit till Date of Death (Turnover / Time Basis)',
          'Preparation of Deceased Partner’s Capital Account and Executor’s Account'
        ]
      },
      {
        id: 'acc-6',
        name: 'Dissolution of a Partnership Firm',
        unit: 'Part A - Unit 1: Accounting for Partnership Firms',
        weightageEstimate: '6-8 marks',
        topics: [
          'Difference between Dissolution of Partnership and Dissolution of Firm',
          'Order of Settlement of Accounts under Section 48 of Partnership Act',
          'Preparation of Realisation Account, Partners’ Loan Accounts, Partners’ Capital Accounts, and Cash/Bank Account',
          'Comprehensive Journal Entries on Dissolution and Unrecorded Assets/Liabilities'
        ]
      },
      {
        id: 'acc-7',
        name: 'Accounting for Share Capital',
        unit: 'Part A - Unit 2: Accounting for Companies',
        weightageEstimate: '10-12 marks',
        topics: [
          'Issue of Shares at Par and at Premium',
          'Public Subscription: Pro-Rata Allotment and Treatment of Excess Application Money',
          'Calls in Arrears and Calls in Advance',
          'Forfeiture of Shares Issued at Par and at Premium',
          'Reissue of Forfeited Shares and Transfer of Balance to Capital Reserve',
          'Disclosure of Share Capital in Company Balance Sheet as per Schedule III Division I'
        ]
      },
      {
        id: 'acc-8',
        name: 'Accounting for Debentures',
        unit: 'Part A - Unit 2: Accounting for Companies',
        weightageEstimate: '6-8 marks',
        topics: [
          'Issue of Debentures at Par, Premium and Discount',
          'Issue of Debentures with Terms of Redemption (At Par, At Premium)',
          'Issue of Debentures for Consideration other than Cash',
          'Issue of Debentures as Collateral Security (Method 1 and Method 2)',
          'Writing off Discount or Loss on Issue of Debentures from Securities Premium / Statement of P&L'
        ]
      },
      {
        id: 'acc-9',
        name: 'Financial Statements of a Company',
        unit: 'Part B - Unit 3: Analysis of Financial Statements',
        weightageEstimate: '4 marks',
        topics: [
          'Format and Major Heads / Sub-heads of Balance Sheet (Schedule III, Division I, Companies Act 2013)',
          'Major Heads of Statement of Profit and Loss',
          'Identification of Items under Equity & Liabilities and Assets',
          'Significance and Limitations of Financial Statements'
        ]
      },
      {
        id: 'acc-10',
        name: 'Financial Statement Analysis',
        unit: 'Part B - Unit 3: Analysis of Financial Statements',
        weightageEstimate: '4 marks',
        topics: [
          'Meaning, Objectives, Importance and Limitations of Financial Analysis',
          'Tools of Analysis: Comparative Balance Sheet and Comparative Statement of Profit & Loss',
          'Common Size Balance Sheet and Common Size Statement of Profit & Loss (Percentages Calculation)'
        ]
      },
      {
        id: 'acc-11',
        name: 'Accounting Ratios',
        unit: 'Part B - Unit 3: Analysis of Financial Statements',
        weightageEstimate: '8 marks',
        topics: [
          'Liquidity Ratios: Current Ratio and Quick / Acid Test Ratio',
          'Solvency Ratios: Debt to Equity, Total Assets to Debt, Proprietary Ratio, Interest Coverage Ratio',
          'Activity / Turnover Ratios: Inventory Turnover, Trade Receivables Turnover, Trade Payables Turnover, Working Capital Turnover',
          'Profitability Ratios: Gross Profit Ratio, Operating Ratio, Operating Profit Ratio, Net Profit Ratio, Return on Investment (ROCE)'
        ]
      },
      {
        id: 'acc-12',
        name: 'Cash Flow Statement',
        unit: 'Part B - Unit 4: Cash Flow Statement',
        weightageEstimate: '8 marks',
        topics: [
          'Meaning, Objectives, Benefits and Limitations as per AS-3 (Revised)',
          'Classification into Operating, Investing and Financing Activities',
          'Calculation of Cash Flows from Operating Activities using Indirect Method (Non-cash / Non-operating adjustments)',
          'Calculation of Cash Flows from Investing Activities (Purchase/Sale of Fixed Assets and Investments with Depreciation Provision)',
          'Calculation of Cash Flows from Financing Activities (Issue of shares/debentures, dividend paid, interest paid, bank loan repayments)'
        ]
      }
    ]
  },
  {
    id: 'business_studies',
    name: 'Business Studies',
    code: '054',
    totalChapters: 12,
    description: 'Principles of Management, Business Environment, Financial Markets & Marketing (CBSE 2026–27)',
    iconName: 'Briefcase',
    chapters: [
      {
        id: 'bst-1',
        name: 'Nature and Significance of Management',
        unit: 'Part A: Principles and Functions of Management',
        weightageEstimate: '5-6 marks',
        topics: [
          'Concept, Objectives (Organisational, Social, Personal) and Importance of Management',
          'Management as an Art, a Science, and a Profession',
          'Levels of Management: Top, Middle, and Supervisory/Operational Management',
          'Coordination: Concept, Characteristics and Importance as the Essence of Management'
        ]
      },
      {
        id: 'bst-2',
        name: 'Principles of Management',
        unit: 'Part A: Principles and Functions of Management',
        weightageEstimate: '6-7 marks',
        topics: [
          'Concept, Nature and Significance of Principles of Management',
          'Henri Fayol’s 14 Principles of Management (Division of Work, Authority & Responsibility, Unity of Command, Unity of Direction, etc.)',
          'F.W. Taylor’s Scientific Management: Principles and Scientific Techniques (Functional Foremanship, Time Study, Motion Study, Fatigue Study, Method Study, Differential Piece Wage System)',
          'Comparison between Fayol and Taylor'
        ]
      },
      {
        id: 'bst-3',
        name: 'Business Environment',
        unit: 'Part A: Principles and Functions of Management',
        weightageEstimate: '4-5 marks',
        topics: [
          'Concept and Importance of Business Environment',
          'Dimensions of Business Environment: Economic, Social, Technological, Political, and Legal',
          'Economic Environment in India and Impact of Economic Reforms (Liberalisation, Privatisation, Globalisation)',
          'Demonetization: Concept and Features'
        ]
      },
      {
        id: 'bst-4',
        name: 'Planning',
        unit: 'Part A: Principles and Functions of Management',
        weightageEstimate: '5-6 marks',
        topics: [
          'Concept, Importance and Limitations of Planning',
          'Planning Process: Setting Objectives, Developing Premises, Identifying Alternatives, Evaluating, Selecting, Implementing and Follow-up',
          'Single-use and Standing Plans: Objectives, Strategy, Policy, Procedure, Method, Rule, Budget, and Programme'
        ]
      },
      {
        id: 'bst-5',
        name: 'Organising',
        unit: 'Part A: Principles and Functions of Management',
        weightageEstimate: '7-8 marks',
        topics: [
          'Concept and Importance of Organising',
          'Organising Process: Identification & Division of Work, Departmentalisation, Assignment of Duties, Establishing Reporting Relationships',
          'Organisational Structure: Functional Structure vs Divisional Structure (Advantages and Disadvantages)',
          'Formal and Informal Organisation',
          'Delegation: Concept, Elements (Authority, Responsibility, Accountability) and Importance',
          'Decentralisation: Concept, Importance and Difference with Delegation'
        ]
      },
      {
        id: 'bst-6',
        name: 'Staffing',
        unit: 'Part A: Principles and Functions of Management',
        weightageEstimate: '6-7 marks',
        topics: [
          'Concept, Importance and Staffing as part of Human Resource Management',
          'Staffing Process: Estimating Manpower Requirements, Recruitment, Selection, Placement, Training, Performance Appraisal, Promotion, Compensation',
          'Recruitment: Internal Sources (Transfers, Promotions) vs External Sources (Campus, Placement Agencies, Direct, Advertisement)',
          'Selection Process and Employment Tests (Intelligence, Aptitude, Personality, Trade, Interest)',
          'Training and Development: Concept, Importance, On-the-job methods (Apprenticeship, Internship) vs Off-the-job methods (Vestibule Training)'
        ]
      },
      {
        id: 'bst-7',
        name: 'Directing',
        unit: 'Part A: Principles and Functions of Management',
        weightageEstimate: '7-8 marks',
        topics: [
          'Concept, Importance and Principles of Directing',
          'Elements of Directing: Supervision, Motivation, Leadership, Communication',
          'Motivation: Maslow’s Need Hierarchy Theory, Financial and Non-Financial Incentives',
          'Leadership: Styles of Leadership (Autocratic, Democratic, Laissez-faire / Free-rein)',
          'Communication: Formal and Informal (Grapevine), Barriers to Effective Communication (Semantic, Psychological, Organisational, Personal) and Measures to Overcome Barriers'
        ]
      },
      {
        id: 'bst-8',
        name: 'Controlling',
        unit: 'Part A: Principles and Functions of Management',
        weightageEstimate: '5-6 marks',
        topics: [
          'Concept and Importance of Controlling',
          'Relationship between Planning and Controlling ("Planning is looking ahead, controlling is looking back")',
          'Controlling Process: Setting Standards, Measurement of Performance, Comparison, Analysing Deviations (Critical Point Control & Management by Exception), Taking Corrective Action'
        ]
      },
      {
        id: 'bst-9',
        name: 'Financial Management',
        unit: 'Part B: Business Finance and Marketing',
        weightageEstimate: '8-9 marks',
        topics: [
          'Concept, Role and Primary Objective of Financial Management (Wealth Maximisation)',
          'Financial Decisions: Investment Decision (Capital Budgeting), Financing Decision, and Dividend Decision (Factors Affecting Each)',
          'Financial Planning: Concept, Objectives and Importance',
          'Capital Structure: Concept, Financial Leverage / Trading on Equity, Factors Affecting Capital Structure Choice',
          'Fixed Capital and Working Capital: Concepts and Factors Affecting Fixed/Working Capital Requirements'
        ]
      },
      {
        id: 'bst-10',
        name: 'Financial Markets',
        unit: 'Part B: Business Finance and Marketing',
        weightageEstimate: '7-8 marks',
        topics: [
          'Concept, Functions and Types of Financial Markets',
          'Money Market and its Instruments: Treasury Bills, Commercial Paper, Call Money, Certificate of Deposit, Commercial Bill',
          'Capital Market: Primary Market (Methods of Floatation) and Secondary Market (Stock Exchange Functions)',
          'Trading Procedure on a Stock Exchange: Demat Account, Depository Participants (NSDL, CDSL), Settlement Cycle',
          'Securities and Exchange Board of India (SEBI): Objectives and Functions (Regulatory, Developmental, and Protective)'
        ]
      },
      {
        id: 'bst-11',
        name: 'Marketing Management',
        unit: 'Part B: Business Finance and Marketing',
        weightageEstimate: '10-11 marks',
        topics: [
          'Marketing Concept, Functions and Marketing Philosophies (Production, Product, Selling, Marketing, and Societal Marketing Concepts)',
          'Marketing Mix: The 4 Ps (Product, Price, Place, Promotion)',
          'Product: Branding (Characteristics of a Good Brand Name), Labelling (Functions), Packaging (Levels and Importance)',
          'Price: Factors Determining Price of a Product',
          'Place: Physical Distribution and Channels of Distribution',
          'Promotion: Promotion Mix (Advertising, Personal Selling, Sales Promotion, Public Relations)'
        ]
      },
      {
        id: 'bst-12',
        name: 'Consumer Protection',
        unit: 'Part B: Business Finance and Marketing',
        weightageEstimate: '5-6 marks',
        topics: [
          'Concept and Importance of Consumer Protection (From Consumer and Business Perspectives)',
          'Consumer Protection Act 2019: Definition of Consumer, Rights of Consumers (Safety, Information, Choice, Heard, Redressal, Consumer Education)',
          'Consumer Responsibilities',
          'Three-Tier Quasi-Judicial Redressal Machinery: District Commission, State Commission, National Commission (Pecuniary Jurisdiction and Appeals)',
          'Remedies Available to Consumers and Role of Consumer NGOs / Voluntary Organisations'
        ]
      }
    ]
  },
  {
    id: 'economics',
    name: 'Economics',
    code: '030',
    totalChapters: 11,
    description: 'Introductory Macroeconomics and Indian Economic Development (CBSE 2026–27)',
    iconName: 'TrendingUp',
    chapters: [
      {
        id: 'eco-1',
        name: 'National Income and Related Aggregates',
        unit: 'Part A: Introductory Macroeconomics',
        weightageEstimate: '10 marks',
        topics: [
          'Basic Concepts: Consumption Goods, Capital Goods, Final Goods, Intermediate Goods, Stock and Flow, Gross/Net Investment, Depreciation',
          'Circular Flow of Income in a Simple Two-Sector Economy',
          'Aggregates: GDP, GNP, NDP, NNP at Market Price and Factor Cost; Real vs Nominal GDP, GDP Deflator, GDP and Welfare',
          'Measurement of National Income: Value Added (Product) Method, Income Method, and Expenditure Method',
          'Treatment of Items in National Income Estimation'
        ]
      },
      {
        id: 'eco-2',
        name: 'Money and Banking',
        unit: 'Part A: Introductory Macroeconomics',
        weightageEstimate: '6 marks',
        topics: [
          'Money: Meaning and Functions; Supply of Money (Currency held by Public + Demand Deposits = M1)',
          'Money Creation / Credit Creation by Commercial Banking System (Money Multiplier = 1/LRR)',
          'Central Bank: Functions of Reserve Bank of India (Bank of Issue, Banker to the Government, Banker’s Bank and Supervisor)',
          'Monetary Policy and Credit Control: Quantitative Instruments (Repo Rate, Reverse Repo Rate, Bank Rate, CRR, SLR, Open Market Operations) and Qualitative Instruments (Margin Requirements)'
        ]
      },
      {
        id: 'eco-3',
        name: 'Determination of Income and Employment',
        unit: 'Part A: Introductory Macroeconomics',
        weightageEstimate: '12 marks',
        topics: [
          'Aggregate Demand (AD = C + I) and its Components; Aggregate Supply (AS = C + S)',
          'Propensities: Average and Marginal Propensity to Consume (APC, MPC) and Save (APS, MPS); Algebraic Relationships',
          'Short-run Equilibrium Output: AD-AS Approach and Saving-Investment (S-I) Approach',
          'Investment Multiplier (k = ΔY/ΔI = 1/(1-MPC) = 1/MPS) and its Step-by-Step Working Mechanism',
          'Problems of Deficient Demand (Deflationary Gap) and Excess Demand (Inflationary Gap)',
          'Fiscal Policy (Taxes, Public Expenditure) and Monetary Policy Measures to Correct Excess and Deficient Demand'
        ]
      },
      {
        id: 'eco-4',
        name: 'Government Budget and the Economy',
        unit: 'Part A: Introductory Macroeconomics',
        weightageEstimate: '6 marks',
        topics: [
          'Government Budget: Meaning, Objectives (Reallocation of Resources, Reducing Inequalities, Economic Stability, Management of Public Enterprises)',
          'Classification of Receipts: Revenue Receipts (Tax vs Non-Tax Revenue) and Capital Receipts (Debt Creating vs Non-Debt Creating)',
          'Classification of Expenditure: Revenue Expenditure and Capital Expenditure; Development vs Non-Development',
          'Measures of Government Deficit: Revenue Deficit, Fiscal Deficit, and Primary Deficit (Meanings, Formulas and Implications)'
        ]
      },
      {
        id: 'eco-5',
        name: 'Balance of Payments & Foreign Exchange Rate',
        unit: 'Part A: Introductory Macroeconomics',
        weightageEstimate: '6 marks',
        topics: [
          'Foreign Exchange Rate: Fixed, Flexible, and Managed Floating Systems; Determination of Flexible Exchange Rate in Foreign Exchange Market',
          'Merits and Demerits; Appreciation vs Depreciation; Devaluation vs Revaluation',
          'Balance of Payments (BOP) Account: Meaning and Structure',
          'Current Account (Visible Trade, Invisible Trade, Unilateral Transfers) and Capital Account (FDI, FII, External Borrowings, NRI Deposits)',
          'Autonomous Items ("Above the Line") vs Accommodating Items ("Below the Line") in BOP'
        ]
      },
      {
        id: 'eco-6',
        name: 'Development Experience (1947-90) & Economic Reforms since 1991',
        unit: 'Part B: Indian Economic Development',
        weightageEstimate: '12 marks',
        topics: [
          'State of Indian Economy on the Eve of Independence (Agriculture, Industry, Foreign Trade, Demographic Indicators)',
          'Five Year Plans: Common Goals (Growth, Modernisation, Self-Reliance, Equity)',
          'Agriculture: Land Reforms and Green Revolution; Industry: Industrial Policy Resolution 1956 and Small Scale Industries (Karve Committee)',
          'Trade Policy: Import Substitution (Inward-looking Trade Strategy)',
          'Economic Reforms 1991: Crisis of 1991, NEP Policies of Liberalisation (Deregulation, Financial, Tax, Foreign Exchange), Privatisation (Disinvestment, Navratnas), and Globalisation (Outsourcing, WTO)',
          'Demonetization and Goods and Services Tax (GST) Overview'
        ]
      },
      {
        id: 'eco-7',
        name: 'Human Capital Formation in India',
        unit: 'Part B: Indian Economic Development',
        weightageEstimate: '6 marks',
        topics: [
          'Concept of Human Capital and Sources (Expenditure on Education, Health, On-the-job Training, Migration, Information)',
          'Human Capital vs Human Development; Economic Growth and Human Capital Linkage',
          'State of Education Sector in India, Government Expenditure on Education, Right to Education (RTE), and National Education Policy'
        ]
      },
      {
        id: 'eco-8',
        name: 'Rural Development',
        unit: 'Part B: Indian Economic Development',
        weightageEstimate: '6 marks',
        topics: [
          'Key Issues in Rural Development: Rural Credit (Institutional Sources: Cooperatives, Commercial Banks, RRBs, NABARD, Self-Help Groups/Microfinance)',
          'Agricultural Marketing System: Defects, Measures to Improve (Regulated Markets, Cooperative Marketing, Storage, MSP, PDS)',
          'Diversification into Productive Activities: Animal Husbandry, Dairying (Operation Flood), Fisheries, Horticulture (Golden Revolution), Information Technology',
          'Organic Farming: Benefits, Limitations and Environmental Sustainability'
        ]
      },
      {
        id: 'eco-9',
        name: 'Employment: Growth, Informalisation and Other Issues',
        unit: 'Part B: Indian Economic Development',
        weightageEstimate: '6 marks',
        topics: [
          'Basic Concepts: Worker, Work Force, Labour Force, Worker-Population Ratio, Labour Force Participation Rate',
          'Participation of People in Employment (Rural vs Urban, Male vs Female)',
          'Self-Employed, Regular Salaried Employees, and Casual Wage Labourers',
          'Informalisation of Indian Workforce (Formal vs Informal Sector)',
          'Types of Unemployment: Disguised, Seasonal, Open, Educated; Government Employment Generation Schemes (MGNREGA)'
        ]
      },
      {
        id: 'eco-10',
        name: 'Sustainable Economic Development',
        unit: 'Part B: Indian Economic Development',
        weightageEstimate: '4 marks',
        topics: [
          'Meaning of Sustainable Development (Brundtland Commission Definition)',
          'Functions and Carrying Capacity / Absorptive Capacity of the Environment',
          'State of India’s Environment: Land Degradation, Biodiversity Loss, Air Pollution, Global Warming, Ozone Depletion',
          'Strategies for Sustainable Development: Non-conventional Sources of Energy (Solar, Wind, Mini-hydel), LPG/Gobar Gas in rural areas, CNG in urban areas, Traditional Knowledge, Bio-pest control, Organic Farming'
        ]
      },
      {
        id: 'eco-11',
        name: 'Development Experience of India: A Comparison with Neighbours',
        unit: 'Part B: Indian Economic Development',
        weightageEstimate: '6 marks',
        topics: [
          'Historical Context: India, Pakistan and China Starting their Development Path around Same Time',
          'Development Strategies: China (Great Leap Forward 1958, Commune System, Great Proletarian Cultural Revolution, Economic Reforms 1978, One-Child Policy), Pakistan (Green Revolution, Nationalisation, Denationalisation, Reforms 1988)',
          'Comparative Analysis on Demographic Indicators (Population, Growth Rate, Sex Ratio, Urbanisation)',
          'Gross Domestic Product and Sectoral Contribution (Agriculture, Industry, Services)',
          'Human Development Indicators: HDI Rank, Life Expectancy, Adult Literacy Rate, Infant Mortality Rate, Maternal Mortality'
        ]
      }
    ]
  },
  {
    id: 'english_core',
    name: 'English Core',
    code: '301',
    totalChapters: 19,
    description: 'Flamingo (Prose & Poetry) and Vistas Supplementary Literature (CBSE 2026–27)',
    iconName: 'BookMarked',
    chapters: [
      {
        id: 'eng-flam-1',
        name: 'The Last Lesson',
        unit: 'Flamingo: Prose',
        weightageEstimate: '3-4 marks',
        topics: [
          'Franz’s Hesitation and the Prussian Occupation of Alsace and Lorraine',
          'M. Hamel’s Final French Lesson and Linguistic Chauvinism',
          'Importance of Mother Tongue as the Key to Prison',
          'M. Hamel’s Writing "Vive La France!" on the Blackboard and Patriotism'
        ]
      },
      {
        id: 'eng-flam-2',
        name: 'Lost Spring: Stories of Stolen Childhood',
        unit: 'Flamingo: Prose',
        weightageEstimate: '4-5 marks',
        topics: [
          'Part I: "Sometimes I find a Rupee in the garbage" - Saheb-e-Alam, Ragpickers of Seemapuri, Plight of Migrants, and Loss of Freedom at the Tea Stall',
          'Part II: "I want to drive a car" - Mukesh, Bangle Makers of Firozabad, Hazardous Glass Furnaces, Glass Industry Health Hazards',
          'Vicious Circle of Sahukars, Middlemen, Policemen, Bureaucrats and Politicians; Mukesh’s Daring Ambition to be a Motor Mechanic'
        ]
      },
      {
        id: 'eng-flam-3',
        name: 'Deep Water',
        unit: 'Flamingo: Prose',
        weightageEstimate: '4-5 marks',
        topics: [
          'William Douglas’s Childhood Fear of Water: California Beach Incident and YMCA Pool Misadventure with the Big Bruiser',
          'The Terror of Drowning, Suffocation, Stark Terror and Blackness',
          'Determination to Overcome Fear: Rigorous Training with Swimming Instructor Piece by Piece',
          'Testing at Lake Wentworth and Warm Lake; Roosevelt’s Quote: "All we have to fear is fear itself"'
        ]
      },
      {
        id: 'eng-flam-4',
        name: 'The Rattrap',
        unit: 'Flamingo: Prose',
        weightageEstimate: '4-5 marks',
        topics: [
          'The Peddler’s Philosophical View: The Entire World as a Giant Rattrap with Baits of Riches, Joy, Shelter and Food',
          'The Old Crofter’s Generosity and the Theft of 30 Kronor',
          'Getting Lost in Ramsjö Ironworks Forest and Mistaken Identity by the Ironmaster',
          'Edla Willmansson’s Compassion, Unconditional Kindness, and Invitation to Christmas Eve',
          'Reformation of the Peddler: Leaving the Stolen 30 Kronor with a Letter Signed as "Captain von Stahle"'
        ]
      },
      {
        id: 'eng-flam-5',
        name: 'Indigo',
        unit: 'Flamingo: Prose',
        weightageEstimate: '4-5 marks',
        topics: [
          'Rajkumar Shukla’s Resolute Persuasion of Mahatma Gandhi to Visit Champaran',
          'The Exploitative Tinkathia System: British Landlords Compelling 15% Indigo Cultivation and Demanding Compensation for Synthetic Indigo',
          'Gandhi’s Civil Disobedience at Motihari Court: Defying Commissioner’s Order and First Triumph of Civil Disobedience in Modern India',
          'Settlement of 25% Refund and Breaking the Prestige of Landlords',
          'Social, Medical and Cultural Upliftment of Champaran Villagers; Self-Reliance and C.F. Andrews'
        ]
      },
      {
        id: 'eng-flam-6',
        name: 'Poets and Pancakes',
        unit: 'Flamingo: Prose',
        weightageEstimate: '3-4 marks',
        topics: [
          'Gemini Studios of Madras and Pancake Brand Make-up Material',
          'Hierarchy and Frustration of the Office Boy in the Make-up Department',
          'Kothamangalam Subbu: Number Two at Gemini Studios, Creativity, Loyalty, and Literary Talents',
          'The Legal Advisor (The Lawyer) and the Tragic Ruin of the Brilliant Actress',
          'Moral Re-Armament Army (MRA) Visit and Presentation of Plays (Jotham Valley and The Forgotten Factor)',
          'Visit of English Poet Stephen Spender, Mutual Incomprehension, and Discovery of "The God That Failed"'
        ]
      },
      {
        id: 'eng-flam-7',
        name: 'The Interview',
        unit: 'Flamingo: Prose',
        weightageEstimate: '3-4 marks',
        topics: [
          'Part I: Diverse Opinions on Interviews by Celebrities (H.G. Wells, Rudyard Kipling, Lewis Carroll, V.S. Naipaul, Saul Bellow)',
          'Part II: Mukund Padmanabhan’s Interview with Professor Umberto Eco of University of Bologna',
          'Umberto Eco’s Philosophical Concept of "Interstices" (Empty Spaces in Time)',
          'Success of Academic Novel "The Name of the Rose" Combining Semiotics, Medieval History and Detective Mystery'
        ]
      },
      {
        id: 'eng-flam-8',
        name: 'Going Places',
        unit: 'Flamingo: Prose',
        weightageEstimate: '3-4 marks',
        topics: [
          'Sophie’s Adolescent Daydreaming, Escapism, and Unrealistic Aspirations (Boutique, Actress, Fashion Designer)',
          'Contrast with Jansie’s Pragmatism and Reality of Working in Biscuit Factory',
          'Sophie’s Family Dynamics: Hardworking Father, Burdened Mother, Taciturn Brother Geoff',
          'Fabricated Encounter with Irish Football Prodigy Danny Casey at Royce’s Arcade',
          'The Painful Solitude and Disillusionment by the Canal Waiting for Someone Who Never Comes'
        ]
      },
      {
        id: 'eng-flam-9',
        name: 'My Mother at Sixty-Six',
        unit: 'Flamingo: Poetry',
        weightageEstimate: '3-4 marks',
        topics: [
          'Kamala Das’s Drive to Cochin Airport Beside her Sleeping Mother',
          'Imagery of Old Age: "Ashen like that of a corpse", "Late winter’s moon"',
          'Contrast with Vitality: "Young trees sprinting", "Merry children spilling out of their homes"',
          'Childhood Fear of Loss, Separation Anxiety, and Parting Smile: "See you soon, Amma; smile and smile and smile"'
        ]
      },
      {
        id: 'eng-flam-10',
        name: 'Keeping Quiet',
        unit: 'Flamingo: Poetry',
        weightageEstimate: '3-4 marks',
        topics: [
          'Pablo Neruda’s Appeal for Twelve Seconds of Universal Stillness and Silence',
          'Cessation of Destructive Human Actions: Fishermen Not Hurting Whales, Salt Gatherers Looking at Hurt Hands',
          'Condemnation of "Wars with gas, wars with fire" with No Survivors',
          'Distinction between Quiet Introspection and Total Inactivity/Death; Earth as Teacher of Renewal'
        ]
      },
      {
        id: 'eng-flam-11',
        name: 'A Thing of Beauty',
        unit: 'Flamingo: Poetry',
        weightageEstimate: '3-4 marks',
        topics: [
          'John Keats’s Romantic Theme: "A thing of beauty is a joy forever; its loveliness increases, it will never pass into nothingness"',
          'Bower of Quiet, Sound Sleep, and Wreathing a Flowery Band to Bind Us to the Earth',
          'Overcoming Despondence, Inhuman Dearth of Noble Natures, Gloomy Days, and Unhealthy Ways',
          'Catalogue of Beautiful Things: Sun, Moon, Trees Old and Young, Daffodils, Clear Rills, Musk-Rose Blooms, Mighty Dead Legends',
          'An Endless Fountain of Immortal Drink Pouring from Heaven’s Brink'
        ]
      },
      {
        id: 'eng-flam-12',
        name: 'A Roadside Stand',
        unit: 'Flamingo: Poetry',
        weightageEstimate: '3-4 marks',
        topics: [
          'Robert Frost’s Critique of Economic Disparity: Rural Folk Setting Up a Roadside Stand Pleading for City Money',
          'Selfish Speeding City Drivers Complaining about Marred Landscape and Signs Turned Wrong',
          'City Folk Stopping Only to Ask Directions, Inquire Gas, or Reverse Vehicles',
          'Critique of "Greedy Good-Doers" and "Beneficent Beasts of Prey" Enforcing Destructive Welfare',
          'The Poet’s Agony at the Unbearable Plight of Poor Rustics and Longing for their Relief'
        ]
      },
      {
        id: 'eng-flam-13',
        name: 'Aunt Jennifer’s Tigers',
        unit: 'Flamingo: Poetry',
        weightageEstimate: '3-4 marks',
        topics: [
          'Adrienne Rich’s Feminist Critique: Bright Topaz Tigers Prancing across Screen, Fearless and Chivalric',
          'Contrast with Aunt Jennifer’s Fluttering, Fragile Hands Unable to Pull the Ivory Needle',
          'Symbolism of "The Massive Weight of Uncle’s Wedding Band" (Patriarchal Oppression and Subjugation)',
          'Immortality of Art: Aunt Jennifer Dead but Hand Ringed with Ordeals, while her Created Tigers Prance Proud and Unafraid'
        ]
      },
      {
        id: 'eng-vist-1',
        name: 'The Third Level',
        unit: 'Vistas: Supplementary Reader',
        weightageEstimate: '4 marks',
        topics: [
          'Charley’s Accidental Discovery of the Non-Existent Third Level of Grand Central Station (New York)',
          '1894 Atmosphere: Brass Spittoons, Gas Lights, Derby Hats, Pocket Watches, Locomotive with Funnel-Shaped Stack',
          'Psychiatrist Friend Sam Weiner’s Diagnosis: "A waking dream wish fulfillment" and Escapism from Modern Insecurity, War, and Worry',
          'The Search for Galesburg, Illinois of 1894; The Letter from Sam Found inside a First-Day Cover Confirming the Third Level'
        ]
      },
      {
        id: 'eng-vist-2',
        name: 'The Tiger King',
        unit: 'Vistas: Supplementary Reader',
        weightageEstimate: '4 marks',
        topics: [
          'Maharaja of Pratibandapuram (Sir Jilani Jung Jung Bahadur) and Chief Astrologer’s Prophecy of Death from the Hundredth Tiger',
          'The King’s Vow and Ruthless Campaign: Killing 99 Tigers across Pratibandapuram and Father-in-Law’s Forests',
          'The Dilemma of the Missing 100th Tiger: Dewan Arranging Old Tiger from Madras People’s Park',
          'The Irony of Fate: The 100th Tiger Surviving the King’s Shot, Killed Later by Hunters; The Fatal Wound Inflicted by a Crude Wooden Toy Tiger’s Sliver Causing Gangrene'
        ]
      },
      {
        id: 'eng-vist-3',
        name: 'Journey to the End of the Earth',
        unit: 'Vistas: Supplementary Reader',
        weightageEstimate: '4 marks',
        topics: [
          'Tishani Doshi’s Expedition to Antarctica Aboard the Russian Research Vessel Akademik Shokalskiy',
          'Gondwana Supercontinent 650 Million Years Ago and Continental Drift Creating Himalayas and Drake Passage',
          'Antarctica’s Pristine Ecosystem without Human Trees, Billboards, or Buildings: Window to Earth’s Past, Present, and Future',
          'Geoff Green’s "Students on Ice" Programme: Educating Future Policy Makers on Climate Change, Ice Shelf Collapses, and Microscopic Phytoplankton'
        ]
      },
      {
        id: 'eng-vist-4',
        name: 'The Enemy',
        unit: 'Vistas: Supplementary Reader',
        weightageEstimate: '4-5 marks',
        topics: [
          'Dr. Sadao Hoki and Hana in World War II Japan: Discovery of Wounded American POW (Tom) Washed Ashore on Beach',
          'Moral Conflict between National Loyalty/Patriotism and Medical Ethics/Humanitarian Hippocratic Oath',
          'Defiance of Domestic Servants’ Superstitions and Departure; Hana’s Unflinching Support in the Operation Room',
          'General Takima’s Self-Absorbed Complicity with Sadao; Secret Assassins Plan Forgotten due to General’s Own Illness',
          'Sadao Arranging Tom’s Escape to the Solitary Island with Food, Water, Quilts, and Flashlight Signals; "I wonder why I could not kill him"'
        ]
      },
      {
        id: 'eng-vist-5',
        name: 'On the Face of It',
        unit: 'Vistas: Supplementary Reader',
        weightageEstimate: '4 marks',
        topics: [
          'Derry: A 14-Year-Old Boy with Acid-Burned Half-Face, Withdrawn, Bitter, Defiant and Scared of Rejection',
          'Mr. Lamb: An Elderly Man with Tin Leg Living in a House without Curtains and an Open Apple Orchard',
          'Philosophical Conversation on Loneliness, Weeds vs Flowers, Bees Humming Songs, and Beauty and the Beast',
          'Mr. Lamb Inspiring Derry to Transcend Physical Disability: "You’ve got two arms, two legs, eyes, ears, a tongue and a brain. You’ll get on the way you want"',
          'Derry’s Transformation and Defying Mother to Return to Mr. Lamb; The Tragic Climax of Mr. Lamb Falling from the Ladder'
        ]
      },
      {
        id: 'eng-vist-6',
        name: 'Memories of Childhood',
        unit: 'Vistas: Supplementary Reader',
        weightageEstimate: '4 marks',
        topics: [
          'Part I: "The Cutting of My Long Hair" (Zitkala-Sa / Gertrude Simmons Bonnin): Cultural Imperialism and Humiliation at Carlisle Indian School, The Dining Room Eating by Formula, Judewin’s Warning, Hiding under Bed, and the Violent Shingling of Hair like a Coward',
          'Part II: "We Too are Human Beings" (Bama): Caste Discrimination and Untouchability in Tamil Nadu Village; The Novel Scene of an Elder Carrying Vadai by String; Annan’s Explanation of Caste Stigma and Guiding Advice: "Because we are born into this community, we are never given any honour or dignity... But if we study and make progress, we can throw away these indignities"'
        ]
      }
    ]
  }
];

/**
 * Helper to fetch subjects for the designated academic grade and stream
 */
export function getSubjectsForGrade(grade: GradeClass = '12', stream: StreamType = 'science'): SubjectInfo[] {
  if (grade === '10') {
    return CBSE_CLASS_10_SUBJECTS;
  }
  return stream === 'commerce' ? CBSE_CLASS_12_COMMERCE_SUBJECTS : CBSE_CLASS_12_SCIENCE_SUBJECTS;
}

/**
 * Returns all unique subjects across Class 12 (Science + Commerce)
 */
export function getAllClass12Subjects(): SubjectInfo[] {
  return [...CBSE_CLASS_12_SCIENCE_SUBJECTS, ...CBSE_CLASS_12_COMMERCE_SUBJECTS];
}

/**
 * Helper to find a subject by ID across a specific grade, stream or globally
 */
export function findSubject(subjectId: string, grade: GradeClass = '12', stream?: StreamType): SubjectInfo | undefined {
  // If stream specified, try that first
  if (stream) {
    const streamSubjects = getSubjectsForGrade(grade, stream);
    const found = streamSubjects.find(s => s.id === subjectId);
    if (found) return found;
  }
  // Try current grade default
  const subjects = getSubjectsForGrade(grade);
  const found = subjects.find(s => s.id === subjectId);
  if (found) return found;

  // Search across all possible subjects (Class 10 + Class 12 Science + Class 12 Commerce)
  const allMasterSubjects = [
    ...CBSE_CLASS_10_SUBJECTS,
    ...CBSE_CLASS_12_SCIENCE_SUBJECTS,
    ...CBSE_CLASS_12_COMMERCE_SUBJECTS,
  ];
  return allMasterSubjects.find(s => s.id === subjectId);
}

