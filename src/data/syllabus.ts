import { SubjectInfo } from '../types/quiz';

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
