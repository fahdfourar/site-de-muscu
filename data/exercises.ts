export type ExercisePhase = {
  name: string;
  description: string;
  color: string;
  startRatio: number;
  endRatio: number;
};

export type Exercise = {
  id: string;
  name: string;
  difficulty: "débutant" | "intermédiaire";
  primaryMuscle: string;
  secondaryMuscles: string[];
  steps: { title: string; description: string }[];
  commonMistakes: { mistake: string; correction: string }[];
  phases: ExercisePhase[];
  animationType: string;
};

export type MuscleGroup = {
  slug: string;
  name: string;
  description: string;
  color: string;
  gradient: string;
  icon: string;
  exercises: Exercise[];
};

export const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    slug: "pectoraux",
    name: "Pectoraux",
    description: "Muscles de la poitrine",
    color: "#7C3AED",
    gradient: "from-purple-700 to-purple-500",
    icon: "chest",
    exercises: [
      {
        id: "developpé-couche",
        name: "Développé couché",
        difficulty: "débutant",
        primaryMuscle: "Pectoraux",
        secondaryMuscles: ["Triceps", "Épaules antérieures"],
        animationType: "bench-press",
        phases: [
          { name: "Départ", description: "Bras tendus, barre au-dessus de la poitrine", color: "#06B6D4", startRatio: 0, endRatio: 0.15 },
          { name: "Descente", description: "Descendre lentement vers la poitrine", color: "#F97316", startRatio: 0.15, endRatio: 0.5 },
          { name: "Point bas", description: "Barre frôle la poitrine", color: "#EF4444", startRatio: 0.5, endRatio: 0.6 },
          { name: "Poussée", description: "Pousser fort vers le haut", color: "#10B981", startRatio: 0.6, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position sur le banc", description: "Allonge-toi à plat, pieds au sol, yeux sous la barre." },
          { title: "Prise en main", description: "Saisit la barre légèrement plus large que les épaules, pouces enroulés." },
          { title: "Descente contrôlée", description: "Descends la barre vers le milieu de ta poitrine en 2-3 secondes." },
          { title: "Poussée explosive", description: "Pousse la barre vers le haut en expirant, bras presque tendus." },
        ],
        commonMistakes: [
          { mistake: "Fesses décollées du banc", correction: "Garde les fesses collées, cintre naturel du dos uniquement." },
          { mistake: "Coudes trop écartés à 90°", correction: "Coudes à 45-75° du corps pour protéger les épaules." },
          { mistake: "Rebond sur la poitrine", correction: "Contrôle la descente, pause d'une seconde en bas." },
        ],
      },
      {
        id: "pompes",
        name: "Pompes",
        difficulty: "débutant",
        primaryMuscle: "Pectoraux",
        secondaryMuscles: ["Triceps", "Abdominaux"],
        animationType: "push-up",
        phases: [
          { name: "Position haute", description: "Corps droit, bras tendus", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Descente", description: "Coudes à 45°, descente contrôlée", color: "#F97316", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point bas", description: "Poitrine proche du sol", color: "#EF4444", startRatio: 0.55, endRatio: 0.65 },
          { name: "Poussée", description: "Retour position haute", color: "#10B981", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position de départ", description: "Mains légèrement plus larges que les épaules, corps droit." },
          { title: "Gainage", description: "Contracte le ventre et les fessiers pour garder le corps aligné." },
          { title: "Descente", description: "Descends jusqu'à ce que ta poitrine frôle le sol." },
          { title: "Remontée", description: "Pousse le sol et reviens en position haute en expirant." },
        ],
        commonMistakes: [
          { mistake: "Fesses en l'air", correction: "Gainage actif, corps droit de la tête aux pieds." },
          { mistake: "Tête qui tombe", correction: "Regarde 30cm devant toi, nuque dans l'alignement du dos." },
        ],
      },
      {
        id: "ecarté-haltères",
        name: "Écarté haltères",
        difficulty: "intermédiaire",
        primaryMuscle: "Pectoraux",
        secondaryMuscles: ["Épaules antérieures"],
        animationType: "chest-fly",
        phases: [
          { name: "Position haute", description: "Haltères au-dessus de la poitrine, légèrement fléchis", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Ouverture", description: "Descendre les bras en arc de cercle", color: "#F97316", startRatio: 0.1, endRatio: 0.55 },
          { name: "Étirement", description: "Maximum d'étirement des pectoraux", color: "#EF4444", startRatio: 0.55, endRatio: 0.65 },
          { name: "Fermeture", description: "Ramener les haltères en arc de cercle", color: "#10B981", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position sur le banc", description: "Allongé, haltères au-dessus de la poitrine, paumes face à face." },
          { title: "Légère flexion des coudes", description: "Garde les coudes légèrement fléchis tout au long du mouvement." },
          { title: "Ouverture en arc", description: "Descends les bras sur les côtés en arc de cercle jusqu'à l'étirement." },
          { title: "Fermeture en arc", description: "Ramène les haltères vers le haut en imaginant enlacer un arbre." },
        ],
        commonMistakes: [
          { mistake: "Coudes trop fléchis", correction: "Garde les coudes presque droits, c'est un étirement, pas une presse." },
          { mistake: "Descente trop basse", correction: "Arrête quand tes bras sont parallèles au sol pour protéger les épaules." },
        ],
      },
    ],
  },
  {
    slug: "dos",
    name: "Dos",
    description: "Dorsaux, trapèzes, rhomboïdes",
    color: "#06B6D4",
    gradient: "from-cyan-600 to-cyan-400",
    icon: "back",
    exercises: [
      {
        id: "tractions",
        name: "Tractions",
        difficulty: "intermédiaire",
        primaryMuscle: "Grand dorsal",
        secondaryMuscles: ["Biceps", "Trapèzes"],
        animationType: "pull-up",
        phases: [
          { name: "Suspension", description: "Bras tendus, prise pronation", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Montée", description: "Tirer les coudes vers les hanches", color: "#10B981", startRatio: 0.1, endRatio: 0.6 },
          { name: "Point haut", description: "Menton au-dessus de la barre", color: "#F97316", startRatio: 0.6, endRatio: 0.7 },
          { name: "Descente", description: "Descente lente et contrôlée", color: "#8B5CF6", startRatio: 0.7, endRatio: 1.0 },
        ],
        steps: [
          { title: "Prise en main", description: "Saisit la barre en pronation, mains légèrement plus larges que les épaules." },
          { title: "Activation du dos", description: "Avant de tirer, rentre les épaules en arrière et en bas." },
          { title: "Traction", description: "Tire les coudes vers les hanches, imagine écraser une orange sous tes aisselles." },
          { title: "Descente", description: "Reviens à la suspension complète en 2-3 secondes, bras tendus." },
        ],
        commonMistakes: [
          { mistake: "Balancement du corps", correction: "Corps immobile, mouvement des bras uniquement." },
          { mistake: "Demi-répétition", correction: "Descends jusqu'à extension complète des bras à chaque rep." },
        ],
      },
      {
        id: "rowing-haltère",
        name: "Rowing haltère",
        difficulty: "débutant",
        primaryMuscle: "Grand dorsal",
        secondaryMuscles: ["Biceps", "Rhomboïdes"],
        animationType: "dumbbell-row",
        phases: [
          { name: "Position basse", description: "Bras tendu, haltère en bas", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Traction", description: "Coude monte vers le plafond", color: "#10B981", startRatio: 0.1, endRatio: 0.6 },
          { name: "Point haut", description: "Coude au-dessus du dos", color: "#F97316", startRatio: 0.6, endRatio: 0.7 },
          { name: "Retour", description: "Descente lente et contrôlée", color: "#8B5CF6", startRatio: 0.7, endRatio: 1.0 },
        ],
        steps: [
          { title: "Appui sur le banc", description: "Un genou et une main sur le banc, dos parallèle au sol." },
          { title: "Prise de l'haltère", description: "Saisit l'haltère, bras tendu vers le bas, paume vers toi." },
          { title: "Traction du coude", description: "Tire le coude vers le plafond en gardant le dos droit." },
          { title: "Contraction", description: "En haut, serre le dos 1 seconde avant de redescendre." },
        ],
        commonMistakes: [
          { mistake: "Rotation du torse", correction: "Le dos reste parallèle au sol, seul le bras bouge." },
          { mistake: "Tirer avec le biceps", correction: "Pense à pousser le coude vers le haut, pas à fléchir le bras." },
        ],
      },
      {
        id: "tirage-poulie",
        name: "Tirage poulie haute",
        difficulty: "débutant",
        primaryMuscle: "Grand dorsal",
        secondaryMuscles: ["Biceps", "Trapèzes inférieurs"],
        animationType: "lat-pulldown",
        phases: [
          { name: "Position haute", description: "Bras tendus, barre au-dessus", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Traction", description: "Barre descend vers le menton", color: "#10B981", startRatio: 0.1, endRatio: 0.6 },
          { name: "Point bas", description: "Barre sous le menton, coudes bas", color: "#F97316", startRatio: 0.6, endRatio: 0.7 },
          { name: "Retour", description: "Remontée contrôlée", color: "#8B5CF6", startRatio: 0.7, endRatio: 1.0 },
        ],
        steps: [
          { title: "Installation", description: "Assis, cuisses bloquées sous les rouleaux, dos légèrement incliné en arrière." },
          { title: "Prise large", description: "Mains en pronation, légèrement plus larges que les épaules." },
          { title: "Traction vers le menton", description: "Tire la barre vers le haut de ta poitrine en gardant la poitrine haute." },
          { title: "Retour contrôlé", description: "Remonte lentement jusqu'à extension complète des bras." },
        ],
        commonMistakes: [
          { mistake: "Tirer derrière la nuque", correction: "Toujours tirer devant, vers le menton ou le haut de la poitrine." },
          { mistake: "Corps qui bascule en arrière", correction: "Légère inclinaison fixe du dos, pas de balancement." },
        ],
      },
    ],
  },
  {
    slug: "epaules",
    name: "Épaules",
    description: "Deltoïdes antérieur, médial, postérieur",
    color: "#8B5CF6",
    gradient: "from-violet-600 to-violet-400",
    icon: "shoulders",
    exercises: [
      {
        id: "développé-militaire",
        name: "Développé militaire",
        difficulty: "débutant",
        primaryMuscle: "Deltoïde antérieur",
        secondaryMuscles: ["Triceps", "Trapèzes"],
        animationType: "overhead-press",
        phases: [
          { name: "Départ", description: "Barre au niveau des épaules", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Poussée", description: "Pousser la barre vers le haut", color: "#10B981", startRatio: 0.1, endRatio: 0.6 },
          { name: "Point haut", description: "Bras tendus au-dessus de la tête", color: "#F97316", startRatio: 0.6, endRatio: 0.7 },
          { name: "Descente", description: "Retour contrôlé aux épaules", color: "#8B5CF6", startRatio: 0.7, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position debout", description: "Debout, pieds écartés dans l'alignement des épaules, dos droit." },
          { title: "Prise de la barre", description: "Barre repose sur les deltoïdes antérieurs, prise légèrement plus large que les épaules." },
          { title: "Poussée verticale", description: "Pousse la barre verticalement au-dessus de ta tête en gainage actif." },
          { title: "Descente contrôlée", description: "Ramène la barre aux épaules lentement, sans à-coup." },
        ],
        commonMistakes: [
          { mistake: "Cambrer le bas du dos", correction: "Contracte les abdos et les fessiers, bassin neutre tout au long." },
          { mistake: "Barre en avant de la tête", correction: "La barre monte verticalement, passa légèrement en arrière de la tête." },
        ],
      },
      {
        id: "élévations-latérales",
        name: "Élévations latérales",
        difficulty: "débutant",
        primaryMuscle: "Deltoïde médial",
        secondaryMuscles: ["Deltoïde antérieur", "Trapèzes"],
        animationType: "lateral-raise",
        phases: [
          { name: "Départ", description: "Haltères le long du corps", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Montée", description: "Bras montent sur les côtés", color: "#10B981", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point haut", description: "Bras parallèles au sol", color: "#F97316", startRatio: 0.55, endRatio: 0.65 },
          { name: "Descente", description: "Retour contrôlé", color: "#8B5CF6", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position de départ", description: "Debout, haltères le long du corps, légère flexion des coudes." },
          { title: "Montée latérale", description: "Lève les bras sur les côtés jusqu'à l'horizontale, poignets neutres." },
          { title: "Pouce légèrement bas", description: "Tourne très légèrement le pouce vers le bas, comme si tu versais un verre." },
          { title: "Descente lente", description: "Redescends en 2-3 secondes pour maximiser la tension." },
        ],
        commonMistakes: [
          { mistake: "Trop lourd, compensation du trapèze", correction: "Prends léger, l'épaule fait tout le travail sans hausser les épaules." },
          { mistake: "Monter au-dessus des épaules", correction: "Parallèle au sol maximum pour cibler le deltoïde médial." },
        ],
      },
      {
        id: "face-pull",
        name: "Face pull",
        difficulty: "débutant",
        primaryMuscle: "Deltoïde postérieur",
        secondaryMuscles: ["Rhomboïdes", "Trapèzes"],
        animationType: "face-pull",
        phases: [
          { name: "Bras tendus", description: "Position de départ, bras tendus vers la poulie", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Traction", description: "Tirer vers le visage en écartant les coudes", color: "#10B981", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point haut", description: "Coudes à hauteur des épaules, mains près du visage", color: "#F97316", startRatio: 0.55, endRatio: 0.65 },
          { name: "Retour", description: "Extension contrôlée vers la poulie", color: "#8B5CF6", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Réglage de la poulie", description: "Poulie haute avec corde, à hauteur de visage ou légèrement au-dessus." },
          { title: "Prise en main", description: "Saisit chaque extrémité de la corde, paumes vers le bas." },
          { title: "Traction vers le visage", description: "Tire la corde vers ton visage, coudes hauts sur les côtés." },
          { title: "Rotation externe", description: "En fin de mouvement, coudes en arrière, poignets en rotation externe." },
        ],
        commonMistakes: [
          { mistake: "Coudes trop bas", correction: "Garde les coudes à hauteur d'épaules ou au-dessus." },
          { mistake: "Trop de poids", correction: "Prends léger, l'objectif est la mobilité et la santé des épaules." },
        ],
      },
    ],
  },
  {
    slug: "biceps",
    name: "Biceps",
    description: "Biceps brachial, brachial",
    color: "#F97316",
    gradient: "from-orange-600 to-orange-400",
    icon: "bicep",
    exercises: [
      {
        id: "curl-barre",
        name: "Curl barre",
        difficulty: "débutant",
        primaryMuscle: "Biceps brachial",
        secondaryMuscles: ["Brachial", "Brachioradial"],
        animationType: "barbell-curl",
        phases: [
          { name: "Position basse", description: "Bras tendus, barre en bas", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Flexion", description: "Fléchir les coudes vers le haut", color: "#10B981", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point haut", description: "Barre proche des épaules", color: "#F97316", startRatio: 0.55, endRatio: 0.65 },
          { name: "Extension", description: "Redescente lente et contrôlée", color: "#8B5CF6", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position debout", description: "Debout, dos droit, barre en prise supination (paumes vers le haut)." },
          { title: "Coudes fixes", description: "Les coudes restent collés aux flancs tout au long du mouvement." },
          { title: "Flexion", description: "Fléchis les avant-bras vers les épaules en contractant les biceps." },
          { title: "Descente contrôlée", description: "Descends lentement, n'oublie pas la phase excentrique." },
        ],
        commonMistakes: [
          { mistake: "Balancer le dos", correction: "Dos droit, seuls les avant-bras bougent. Réduis le poids si nécessaire." },
          { mistake: "Coudes qui avancent", correction: "Les coudes restent en arrière, fixes aux flancs." },
        ],
      },
      {
        id: "curl-haltères-alterné",
        name: "Curl haltères alterné",
        difficulty: "débutant",
        primaryMuscle: "Biceps brachial",
        secondaryMuscles: ["Brachial"],
        animationType: "dumbbell-curl",
        phases: [
          { name: "Départ", description: "Haltère bas, paume vers soi", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Rotation", description: "La paume tourne vers le haut en montant", color: "#10B981", startRatio: 0.1, endRatio: 0.4 },
          { name: "Point haut", description: "Paume vers le haut, contraction maximale", color: "#F97316", startRatio: 0.4, endRatio: 0.55 },
          { name: "Retour", description: "Descente lente avec rotation inverse", color: "#8B5CF6", startRatio: 0.55, endRatio: 1.0 },
        ],
        steps: [
          { title: "Départ neutre", description: "Haltères le long du corps, paumes face aux cuisses." },
          { title: "Supination", description: "En montant, tourne la paume vers le plafond (supination)." },
          { title: "Alternance", description: "Un bras monte pendant que l'autre descend." },
          { title: "Contraction au sommet", description: "Serre le biceps une seconde en haut avant de redescendre." },
        ],
        commonMistakes: [
          { mistake: "Pas de supination", correction: "La rotation du poignet est essentielle pour un recrutement maximal." },
          { mistake: "Trop vite", correction: "Travaille lentement, 2 secondes montée, 2 secondes descente." },
        ],
      },
      {
        id: "curl-marteau",
        name: "Curl marteau",
        difficulty: "débutant",
        primaryMuscle: "Brachioradial",
        secondaryMuscles: ["Biceps brachial", "Brachial"],
        animationType: "hammer-curl",
        phases: [
          { name: "Départ", description: "Prise neutre, pouce vers le haut", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Montée", description: "Fléchir sans rotation", color: "#10B981", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point haut", description: "Haltère vertical, coude fléchi", color: "#F97316", startRatio: 0.55, endRatio: 0.65 },
          { name: "Descente", description: "Retour lent", color: "#8B5CF6", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Prise neutre", description: "Haltères le long du corps, pouce vers le haut (prise marteau)." },
          { title: "Pas de rotation", description: "Contrairement au curl classique, le poignet reste neutre tout au long." },
          { title: "Montée", description: "Fléchis les avant-bras vers les épaules, coudes fixes." },
          { title: "Descente", description: "Redescends lentement, extension complète des bras en bas." },
        ],
        commonMistakes: [
          { mistake: "Tourner le poignet", correction: "La prise neutre est l'objectif, elle cible le brachio-radial." },
        ],
      },
    ],
  },
  {
    slug: "triceps",
    name: "Triceps",
    description: "Chef long, médial, latéral",
    color: "#10B981",
    gradient: "from-emerald-600 to-emerald-400",
    icon: "tricep",
    exercises: [
      {
        id: "dips",
        name: "Dips",
        difficulty: "intermédiaire",
        primaryMuscle: "Triceps",
        secondaryMuscles: ["Pectoraux inférieurs", "Épaules antérieures"],
        animationType: "dips",
        phases: [
          { name: "Position haute", description: "Bras tendus sur les barres parallèles", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Descente", description: "Fléchir les coudes, légèrement penché en avant", color: "#F97316", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point bas", description: "Coudes à 90°", color: "#EF4444", startRatio: 0.55, endRatio: 0.65 },
          { name: "Poussée", description: "Extension des bras vers le haut", color: "#10B981", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Appui sur les barres", description: "Mains sur les barres parallèles, bras tendus, corps légèrement incliné." },
          { title: "Descente contrôlée", description: "Fléchis les coudes jusqu'à ce qu'ils soient à 90°." },
          { title: "Coudes proches du corps", description: "Garde les coudes orientés vers l'arrière, pas sur les côtés." },
          { title: "Remontée", description: "Pousse fort pour revenir à l'extension complète." },
        ],
        commonMistakes: [
          { mistake: "Descente trop profonde", correction: "Arrête à 90° des coudes pour protéger les épaules." },
          { mistake: "Corps trop vertical", correction: "Légère inclinaison du tronc en avant pour cibler les triceps." },
        ],
      },
      {
        id: "pushdown-corde",
        name: "Pushdown corde",
        difficulty: "débutant",
        primaryMuscle: "Triceps",
        secondaryMuscles: [],
        animationType: "tricep-pushdown",
        phases: [
          { name: "Départ", description: "Coudes fléchis à 90°, corde au niveau de la poitrine", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Extension", description: "Pousser la corde vers le bas", color: "#10B981", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point bas", description: "Bras tendus, séparation de la corde", color: "#F97316", startRatio: 0.55, endRatio: 0.65 },
          { name: "Retour", description: "Remontée lente", color: "#8B5CF6", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Réglage de la poulie", description: "Poulie haute avec corde, saisit les deux extrémités." },
          { title: "Coudes fixes", description: "Les coudes restent collés au corps à hauteur de taille." },
          { title: "Extension vers le bas", description: "Pousse la corde vers le bas et légèrement vers l'extérieur." },
          { title: "Séparation en bas", description: "En bas, écarte légèrement les poignets pour la contraction maximale." },
        ],
        commonMistakes: [
          { mistake: "Coudes qui bougent", correction: "Les coudes sont fixes, seuls les avant-bras bougent." },
          { mistake: "Se pencher en avant", correction: "Reste droit, utilise moins de poids si tu dois compenser." },
        ],
      },
      {
        id: "extension-nuque",
        name: "Extension nuque",
        difficulty: "intermédiaire",
        primaryMuscle: "Chef long du triceps",
        secondaryMuscles: ["Chef médial"],
        animationType: "overhead-tricep",
        phases: [
          { name: "Départ", description: "Haltère au-dessus de la tête, bras tendus", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Descente", description: "Fléchir les coudes, haltère derrière la tête", color: "#F97316", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point bas", description: "Coudes à 90°, étirement du chef long", color: "#EF4444", startRatio: 0.55, endRatio: 0.65 },
          { name: "Extension", description: "Tendre les bras vers le haut", color: "#10B981", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Saisir l'haltère", description: "Assis ou debout, tiens l'haltère avec les deux mains au-dessus de la tête." },
          { title: "Coudes hauts", description: "Garde les coudes pointés vers le plafond, proches des oreilles." },
          { title: "Flexion derrière la tête", description: "Descends l'haltère derrière la tête en contrôlant." },
          { title: "Extension complète", description: "Remonte jusqu'à extension complète sans verrouiller les coudes." },
        ],
        commonMistakes: [
          { mistake: "Coudes qui s'écartent", correction: "Les coudes restent proches de la tête, pointés vers le haut." },
        ],
      },
    ],
  },
  {
    slug: "quadriceps",
    name: "Quadriceps",
    description: "Vaste médial, latéral, droit fémoral",
    color: "#EC4899",
    gradient: "from-pink-600 to-pink-400",
    icon: "quads",
    exercises: [
      {
        id: "squat",
        name: "Squat",
        difficulty: "débutant",
        primaryMuscle: "Quadriceps",
        secondaryMuscles: ["Fessiers", "Ischio-jambiers", "Mollets"],
        animationType: "squat",
        phases: [
          { name: "Départ", description: "Debout, barre sur les trapèzes", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Descente", description: "Genoux et hanches fléchissent ensemble", color: "#F97316", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point bas", description: "Cuisses parallèles au sol minimum", color: "#EF4444", startRatio: 0.55, endRatio: 0.65 },
          { name: "Remontée", description: "Poussée explosive des jambes", color: "#10B981", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position des pieds", description: "Pieds dans l'alignement des épaules ou légèrement plus larges, pieds légèrement tournés." },
          { title: "Descente", description: "Descends comme si tu t'asseyais sur une chaise, torse droit, genoux dans l'axe des pieds." },
          { title: "Profondeur", description: "Descends au moins jusqu'à ce que les cuisses soient parallèles au sol." },
          { title: "Remontée", description: "Pousse le sol en expirant, reviens à la position debout complète." },
        ],
        commonMistakes: [
          { mistake: "Genoux qui rentrent vers l'intérieur", correction: "Pousse activement les genoux vers l'extérieur dans l'axe des pieds." },
          { mistake: "Torse qui bascule en avant", correction: "Regarde devant toi, poitrine haute, dos droit." },
          { mistake: "Talons qui se lèvent", correction: "Travaille la mobilité des chevilles ou surélève légèrement les talons." },
        ],
      },
      {
        id: "presse-cuisses",
        name: "Presse à cuisses",
        difficulty: "débutant",
        primaryMuscle: "Quadriceps",
        secondaryMuscles: ["Fessiers", "Ischio-jambiers"],
        animationType: "leg-press",
        phases: [
          { name: "Position haute", description: "Jambes tendues, pieds sur la plateforme", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Descente", description: "Fléchir les genoux, plateforme descend", color: "#F97316", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point bas", description: "Genoux à 90° minimum", color: "#EF4444", startRatio: 0.55, endRatio: 0.65 },
          { name: "Poussée", description: "Étendre les jambes sans verrouiller", color: "#10B981", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position des pieds", description: "Pieds dans la partie haute de la plateforme, écartés dans l'alignement des épaules." },
          { title: "Descente contrôlée", description: "Descends lentement, genoux dans l'axe des pieds." },
          { title: "Profondeur", description: "Genoux à 90° ou un peu plus, sans décoller les fessiers." },
          { title: "Poussée", description: "Pousse fort sans verrouiller les genoux en haut." },
        ],
        commonMistakes: [
          { mistake: "Verrouiller les genoux en haut", correction: "Garde une légère flexion à l'extension pour protéger les articulations." },
          { mistake: "Fessiers qui décollent", correction: "Dos collé au dossier, descends moins profond si nécessaire." },
        ],
      },
      {
        id: "fentes-avant",
        name: "Fentes avant",
        difficulty: "débutant",
        primaryMuscle: "Quadriceps",
        secondaryMuscles: ["Fessiers", "Ischio-jambiers"],
        animationType: "lunge",
        phases: [
          { name: "Debout", description: "Position initiale, jambes ensemble", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Grand pas en avant", description: "Un pied avance loin devant", color: "#F97316", startRatio: 0.1, endRatio: 0.4 },
          { name: "Descente", description: "Genou arrière vers le sol", color: "#EF4444", startRatio: 0.4, endRatio: 0.65 },
          { name: "Remontée", description: "Pousser le sol pour revenir debout", color: "#10B981", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Grand pas en avant", description: "Fais un grand pas en avant, pied à plat au sol." },
          { title: "Descente verticale", description: "Le genou avant fait 90°, le genou arrière descend vers le sol." },
          { title: "Genou avant dans l'axe", description: "Le genou avant ne dépasse pas la pointe du pied." },
          { title: "Remontée", description: "Pousse avec le pied avant pour revenir à la position initiale." },
        ],
        commonMistakes: [
          { mistake: "Genou avant dépasse le pied", correction: "Fais un pas plus grand pour garder le genou dans l'axe." },
          { mistake: "Torse qui penche en avant", correction: "Garde le dos droit et la poitrine haute." },
        ],
      },
    ],
  },
  {
    slug: "abdominaux",
    name: "Abdominaux",
    description: "Grand droit, obliques, transverse",
    color: "#06B6D4",
    gradient: "from-cyan-600 to-teal-400",
    icon: "abs",
    exercises: [
      {
        id: "crunch",
        name: "Crunch",
        difficulty: "débutant",
        primaryMuscle: "Grand droit de l'abdomen",
        secondaryMuscles: ["Obliques"],
        animationType: "crunch",
        phases: [
          { name: "Position allongée", description: "Sur le dos, genoux fléchis, mains derrière la tête", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Montée", description: "Soulever les épaules du sol", color: "#10B981", startRatio: 0.1, endRatio: 0.55 },
          { name: "Contraction", description: "Maximum de contraction abdominale", color: "#F97316", startRatio: 0.55, endRatio: 0.65 },
          { name: "Descente", description: "Retour lent au sol", color: "#8B5CF6", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position de départ", description: "Allongé sur le dos, genoux fléchis à 90°, pieds au sol." },
          { title: "Mains", description: "Mains derrière la tête, coudes ouverts sur les côtés, sans tirer le cou." },
          { title: "Montée", description: "Soulève les épaules en contractant les abdos, pas les hanches." },
          { title: "Descente", description: "Redescends lentement sans poser complètement les épaules entre chaque rep." },
        ],
        commonMistakes: [
          { mistake: "Tirer sur le cou", correction: "Les mains guident, elles ne tirent pas. Regarde le plafond." },
          { mistake: "Monter trop haut", correction: "Le crunch n'est pas un sit-up, seules les épaules se lèvent." },
        ],
      },
      {
        id: "planche",
        name: "Planche",
        difficulty: "débutant",
        primaryMuscle: "Transverse de l'abdomen",
        secondaryMuscles: ["Grand droit", "Fessiers", "Épaules"],
        animationType: "plank",
        phases: [
          { name: "Position", description: "Corps droit, appui avant-bras et orteils", color: "#06B6D4", startRatio: 0, endRatio: 0.2 },
          { name: "Tenue", description: "Maintenir le gainage actif", color: "#10B981", startRatio: 0.2, endRatio: 0.8 },
          { name: "Fin", description: "Retour au sol", color: "#8B5CF6", startRatio: 0.8, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position avant-bras", description: "Sur les avant-bras et les orteils, coudes sous les épaules." },
          { title: "Corps droit", description: "Corps aligné de la tête aux pieds, ni fesses en l'air ni ventre qui traîne." },
          { title: "Respiration", description: "Respire normalement, contracte le ventre sans bloquer." },
          { title: "Durée", description: "Commence par 20-30 secondes, augmente progressivement." },
        ],
        commonMistakes: [
          { mistake: "Fesses trop hautes", correction: "Corps droit, pas de triangle. Les hanches à hauteur des épaules." },
          { mistake: "Bloquer la respiration", correction: "Respire doucement, la planche n'est pas en apnée." },
        ],
      },
      {
        id: "leg-raise",
        name: "Leg raise",
        difficulty: "intermédiaire",
        primaryMuscle: "Grand droit inférieur",
        secondaryMuscles: ["Iliopsoas", "Obliques"],
        animationType: "leg-raise",
        phases: [
          { name: "Position basse", description: "Allongé, jambes tendues près du sol", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Montée", description: "Jambes montent vers le plafond", color: "#10B981", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point haut", description: "Jambes verticales ou légèrement au-delà", color: "#F97316", startRatio: 0.55, endRatio: 0.65 },
          { name: "Descente", description: "Jambes redescendent lentement", color: "#8B5CF6", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Position de départ", description: "Allongé sur le dos, mains sous les fesses, jambes tendues." },
          { title: "Lombes collées au sol", description: "Garde le bas du dos collé au sol pendant tout le mouvement." },
          { title: "Montée des jambes", description: "Lève les jambes tendues jusqu'à la verticale en expirant." },
          { title: "Descente lente", description: "Descends lentement, arrête avant que le bas du dos ne se décolle." },
        ],
        commonMistakes: [
          { mistake: "Bas du dos qui se décolle", correction: "Diminue l'amplitude si ton dos se cambre, remonte les jambes plus haut." },
          { mistake: "Genoux fléchis", correction: "Jambes tendues pour maximiser l'intensité sur les abdos inférieurs." },
        ],
      },
    ],
  },
  {
    slug: "fessiers",
    name: "Fessiers",
    description: "Grand, moyen et petit fessier",
    color: "#F59E0B",
    gradient: "from-amber-600 to-amber-400",
    icon: "glutes",
    exercises: [
      {
        id: "hip-thrust",
        name: "Hip thrust",
        difficulty: "débutant",
        primaryMuscle: "Grand fessier",
        secondaryMuscles: ["Ischio-jambiers", "Lombaires"],
        animationType: "hip-thrust",
        phases: [
          { name: "Position basse", description: "Dos sur le banc, hanches au sol", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Poussée", description: "Hanches montent vers le plafond", color: "#10B981", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point haut", description: "Corps parallèle au sol, fessiers contractés", color: "#F97316", startRatio: 0.55, endRatio: 0.65 },
          { name: "Descente", description: "Hanches redescendent lentement", color: "#8B5CF6", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Dos sur le banc", description: "Haut du dos appuyé sur le banc, pieds à plat, barre sur les hanches." },
          { title: "Pieds bien placés", description: "Pieds à plat, à largeur d'épaules, genoux à 90° en haut." },
          { title: "Poussée des hanches", description: "Pousse les hanches vers le plafond en contractant fort les fessiers." },
          { title: "Contraction haute", description: "Garde les hanches hautes 1 seconde, serres les fessiers au maximum." },
        ],
        commonMistakes: [
          { mistake: "Cambrer le bas du dos", correction: "Bascule le bassin en rentrant le ventre, pas de cambrure extrême." },
          { mistake: "Pieds trop proches", correction: "Règle la position des pieds pour que les genoux soient à 90° en haut." },
        ],
      },
      {
        id: "squat-sumo",
        name: "Squat sumo",
        difficulty: "débutant",
        primaryMuscle: "Grand fessier",
        secondaryMuscles: ["Quadriceps", "Adducteurs"],
        animationType: "sumo-squat",
        phases: [
          { name: "Debout", description: "Pieds très écartés, pointes vers l'extérieur", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Descente", description: "Genoux s'ouvrent vers l'extérieur", color: "#F97316", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point bas", description: "Cuisses parallèles, genoux bien ouverts", color: "#EF4444", startRatio: 0.55, endRatio: 0.65 },
          { name: "Remontée", description: "Poussée en contractant les fessiers", color: "#10B981", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Écart des pieds", description: "Pieds très écartés (150% de la largeur d'épaules), pointes à 45°." },
          { title: "Descente", description: "Descends en gardant les genoux dans l'axe des pieds, torse droit." },
          { title: "Activation des fessiers", description: "Pense à pousser les genoux vers l'extérieur et serrer les fessiers." },
          { title: "Remontée", description: "Pousse fort pour remonter en expirant." },
        ],
        commonMistakes: [
          { mistake: "Genoux qui rentrent", correction: "Pousse activement les genoux vers l'extérieur." },
        ],
      },
      {
        id: "kickback-câble",
        name: "Kickback câble",
        difficulty: "débutant",
        primaryMuscle: "Grand fessier",
        secondaryMuscles: ["Ischio-jambiers"],
        animationType: "cable-kickback",
        phases: [
          { name: "Position", description: "Penché en avant, jambe légèrement fléchie", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Extension", description: "Jambe pousse vers l'arrière", color: "#10B981", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point haut", description: "Jambe en extension complète, fessier contracté", color: "#F97316", startRatio: 0.55, endRatio: 0.65 },
          { name: "Retour", description: "Jambe revient à la position initiale", color: "#8B5CF6", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Fixation de la cheville", description: "Fixe la sangle à la cheville, poulie basse, main sur l'appui." },
          { title: "Légère flexion", description: "Légèrement penché en avant, jambe de travail légèrement fléchie." },
          { title: "Kickback", description: "Pousse la jambe vers l'arrière et vers le haut en contractant le fessier." },
          { title: "Retour lent", description: "Reviens lentement à la position initiale sans poser le pied." },
        ],
        commonMistakes: [
          { mistake: "Trop grand mouvement", correction: "Amplitude raisonnable, l'accent est sur la contraction du fessier." },
        ],
      },
    ],
  },
  {
    slug: "ischio-jambiers",
    name: "Ischio-jambiers",
    description: "Biceps fémoral, semi-tendineux",
    color: "#EF4444",
    gradient: "from-red-600 to-red-400",
    icon: "hamstrings",
    exercises: [
      {
        id: "rdl",
        name: "Soulevé de terre roumain",
        difficulty: "intermédiaire",
        primaryMuscle: "Ischio-jambiers",
        secondaryMuscles: ["Grand fessier", "Lombaires"],
        animationType: "rdl",
        phases: [
          { name: "Debout", description: "Barre tenue devant les cuisses", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Hip hinge", description: "Hanches poussent en arrière, barre glisse le long des jambes", color: "#F97316", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point bas", description: "Barre sous les genoux, ischio-jambiers étirés", color: "#EF4444", startRatio: 0.55, endRatio: 0.65 },
          { name: "Remontée", description: "Hanches reviennent en avant pour se redresser", color: "#10B981", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Prise de la barre", description: "Debout, barre tenue en pronation devant les cuisses, pieds à largeur d'épaules." },
          { title: "Hip hinge", description: "Pousse les hanches vers l'arrière (pas les genoux vers le bas)." },
          { title: "Dos droit", description: "Garde le dos droit et plat tout au long, barre reste près des jambes." },
          { title: "Étirement", description: "Descends jusqu'à sentir l'étirement dans les ischio-jambiers." },
        ],
        commonMistakes: [
          { mistake: "Dos arrondi", correction: "Dos plat obligatoire. Si tu ne peux pas, descends moins bas." },
          { mistake: "Confondre avec le squat", correction: "RDL = mouvement de hanches, pas de genoux. Les genoux restent quasi droits." },
        ],
      },
      {
        id: "leg-curl",
        name: "Leg curl allongé",
        difficulty: "débutant",
        primaryMuscle: "Ischio-jambiers",
        secondaryMuscles: ["Mollets"],
        animationType: "leg-curl",
        phases: [
          { name: "Jambes tendues", description: "Allongé ventre, jambes en extension", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Flexion", description: "Jambes montent vers les fessiers", color: "#10B981", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point haut", description: "Genoux à 90° ou plus, ischio bien contractés", color: "#F97316", startRatio: 0.55, endRatio: 0.65 },
          { name: "Extension", description: "Descente lente et contrôlée", color: "#8B5CF6", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Installation sur la machine", description: "Allonge-toi sur le ventre, cheville sous les rouleaux." },
          { title: "Hanches collées", description: "Garde les hanches plaquées contre le banc tout au long." },
          { title: "Flexion", description: "Ramène les talons vers les fessiers en expirant." },
          { title: "Descente lente", description: "Descends lentement sur 2-3 secondes, phase excentrique importante." },
        ],
        commonMistakes: [
          { mistake: "Hanches qui se soulèvent", correction: "Les hanches restent au contact du banc, réduis le poids si besoin." },
        ],
      },
      {
        id: "good-morning",
        name: "Good morning",
        difficulty: "intermédiaire",
        primaryMuscle: "Ischio-jambiers",
        secondaryMuscles: ["Lombaires", "Grand fessier"],
        animationType: "good-morning",
        phases: [
          { name: "Debout", description: "Barre sur les trapèzes, debout droit", color: "#06B6D4", startRatio: 0, endRatio: 0.1 },
          { name: "Hip hinge", description: "Hanches poussent en arrière, torse descend", color: "#F97316", startRatio: 0.1, endRatio: 0.55 },
          { name: "Point bas", description: "Torse presque parallèle au sol", color: "#EF4444", startRatio: 0.55, endRatio: 0.65 },
          { name: "Remontée", description: "Hanches reviennent en avant", color: "#10B981", startRatio: 0.65, endRatio: 1.0 },
        ],
        steps: [
          { title: "Barre sur les trapèzes", description: "Barre basse sur les trapèzes (comme le squat low bar), prise large." },
          { title: "Légère flexion des genoux", description: "Genoux très légèrement fléchis, jamais verrouillés." },
          { title: "Hip hinge", description: "Pousse les hanches en arrière, le torse descend vers le sol." },
          { title: "Dos droit", description: "Dos neutre obligatoire, c'est un exercice avancé, commence léger." },
        ],
        commonMistakes: [
          { mistake: "Trop lourd trop tôt", correction: "Commence avec juste la barre pour maîtriser le mouvement." },
          { mistake: "Dos arrondi", correction: "Dos plat et neutre, ou tu risques une blessure lombaire." },
        ],
      },
    ],
  },
];

export function getMuscleGroup(slug: string): MuscleGroup | undefined {
  return MUSCLE_GROUPS.find((g) => g.slug === slug);
}
