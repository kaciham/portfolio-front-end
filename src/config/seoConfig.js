// config/seoConfig.js
export const SEO_CONFIG = {
  default: {
    title: "Kaci Hamroun - Développeur Full-Stack & Automatisation IA | Lille 59000",
    description: "Kaci Hamroun, développeur full-stack spécialisé en automatisation IA à Lille. Expert React, Node.js, Python, intelligence artificielle et solutions d'automatisation sur mesure.",
    keywords: "développeur full-stack, automatisation IA, intelligence artificielle, React, Node.js, Python, développeur web Lille, automatisation processus, machine learning, développeur frontend backend, Kaci Hamroun, freelance développeur Lille",
    canonical: "https://www.kacihamroun.com",
    ogImage: "https://www.kacihamroun.com/images/kaci-hamroun-og.jpg",
    ogType: "website",
    locale: "fr_FR",
    siteName: "Kaci Hamroun - Portfolio"
  },
  
  pages: {
    home: {
      title: "Kaci Hamroun - Développeur Full-Stack & Automatisation IA | Lille",
      description: "Portfolio de Kaci Hamroun, développeur full-stack expert en automatisation IA à Lille. Découvrez mes projets, compétences et services en développement web.",
      keywords: "portfolio développeur, Kaci Hamroun, développeur full-stack Lille, automatisation IA, projets web"
    },
    
    about: {
      title: "À Propos - Kaci Hamroun | Développeur Full-Stack IA Lille",
      description: "Découvrez le parcours de Kaci Hamroun, développeur full-stack spécialisé en automatisation IA. Compétences, expérience et passion pour l'innovation technologique.",
      keywords: "à propos Kaci Hamroun, parcours développeur, compétences IA, expérience full-stack"
    },
    
    projects: {
      title: "Projets - Kaci Hamroun | Réalisations Web & Automatisation IA",
      description: "Explorez les projets de Kaci Hamroun : applications web innovantes, solutions d'automatisation IA et développements full-stack. Découvrez mon expertise technique.",
      keywords: "projets développement web, automatisation IA, applications React, solutions Python, portfolio projets"
    },
    
    contact: {
      title: "Contact - Kaci Hamroun | Développeur Full-Stack & Automatisation IA Lille",
      description: "Contactez Kaci Hamroun pour vos projets de développement web et d'automatisation IA. Freelance disponible à Lille et en télétravail.",
      keywords: "contact développeur web, automatisation IA Lille, freelance développeur, projet web, consultation technique"
    }
  },
  
  services: {
    webDevelopment: {
      title: "Développement Web Full-Stack - Kaci Hamroun | React, Node.js Lille",
      description: "Services de développement web full-stack avec React, Node.js et technologies modernes. Solutions sur mesure pour entreprises et startups à Lille.",
      keywords: "développement web Lille, React Node.js, full-stack developer, application web sur mesure"
    },
    
    aiAutomation: {
      title: "Automatisation IA - Solutions Intelligentes | Kaci Hamroun Lille",
      description: "Développement de solutions d'automatisation basées sur l'intelligence artificielle. Optimisez vos processus avec des technologies IA avancées.",
      keywords: "automatisation IA, intelligence artificielle, processus automatisés, machine learning, Python IA"
    },
    
    consulting: {
      title: "Conseil Technique - Architecture & Stratégie Tech | Kaci Hamroun",
      description: "Conseil en architecture technique et stratégie technologique. Expertise en développement web, IA et transformation digitale.",
      keywords: "conseil technique, architecture logicielle, stratégie tech, transformation digitale, expertise IA"
    }
  },
  
  business: {
    name: "Kaci Hamroun",
    type: "Person",
    location: {
      city: "Lille",
      postalCode: "59000",
      region: "Hauts-de-France",
      country: "FR",
      coordinates: {
        latitude: "50.6292",
        longitude: "3.0573"
      }
    },
    contact: {
      email: "kacihamroun@outlook.com",
      website: "https://www.kacihamroun.com"
    },
    social: {
      linkedin: "https://www.linkedin.com/in/kaci-hamroun",
      github: "https://github.com/kaciham"
    },
    services: [
      "Développement Web Full-Stack",
      "Automatisation IA",
      "Conseil Technique",
      "Formation Développement"
    ],
    technologies: [
      "React.js",
      "Node.js", 
      "Python",
      "JavaScript",
      "TypeScript",
      "MongoDB",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Machine Learning"
    ]
  }
};

export const generatePageSEO = (pageKey, customData = {}) => {
  const defaultSEO = SEO_CONFIG.default;
  const pageSEO = SEO_CONFIG.pages[pageKey] || {};
  
  return {
    ...defaultSEO,
    ...pageSEO,
    ...customData
  };
};

export const generateServiceSEO = (serviceKey, customData = {}) => {
  const defaultSEO = SEO_CONFIG.default;
  const serviceSEO = SEO_CONFIG.services[serviceKey] || {};
  
  return {
    ...defaultSEO,
    ...serviceSEO,
    ...customData
  };
};

export default SEO_CONFIG;