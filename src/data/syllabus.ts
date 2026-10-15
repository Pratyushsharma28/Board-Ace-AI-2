import { SubjectInfo, GradeClass } from '../types/quiz';

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
 * Helper to fetch subjects for the designated academic grade
 */
export function getSubjectsForGrade(grade: GradeClass = '12'): SubjectInfo[] {
  return grade === '10' ? CBSE_CLASS_10_SUBJECTS : CBSE_CLASS_12_SUBJECTS;
}

/**
 * Helper to find a subject by ID across a specific grade or both grades
 */
export function findSubject(subjectId: string, grade: GradeClass = '12'): SubjectInfo | undefined {
  const subjects = getSubjectsForGrade(grade);
  const found = subjects.find(s => s.id === subjectId);
  if (found) return found;
  // Fallback check across other grade if needed
  const otherSubjects = grade === '12' ? CBSE_CLASS_10_SUBJECTS : CBSE_CLASS_12_SUBJECTS;
  return otherSubjects.find(s => s.id === subjectId);
}

