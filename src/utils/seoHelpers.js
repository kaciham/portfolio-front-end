// utils/seoHelpers.js

// Optimize text for SEO
export const optimizeTextForSEO = (text, maxLength = 160) => {
  if (!text) return '';
  
  // Remove extra whitespaces and normalize
  const normalized = text.replace(/\s+/g, ' ').trim();
  
  // Truncate at word boundary
  if (normalized.length <= maxLength) return normalized;
  
  const truncated = normalized.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

// Generate keywords from text
export const generateKeywords = (text, additionalKeywords = []) => {
  if (!text) return additionalKeywords.join(', ');
  
  const commonWords = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'en', 'et', 'ou', 'à', 'avec', 'pour', 'sur', 'dans', 'par', 'ce', 'cette', 'ces', 'qui', 'que', 'dont', 'où'];
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 8);
    
  return [...new Set([...words, ...additionalKeywords])].join(', ');
};

// Generate slug from title
export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

// Check if URL is valid
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Generate Open Graph image URL
export const generateOGImageUrl = (title, description) => {
  const baseUrl = 'https://www.kacihamroun.com/api/og';
  const params = new URLSearchParams({
    title: title || 'Kaci Hamroun - Développeur Full-Stack IA',
    description: optimizeTextForSEO(description, 100),
    theme: 'developer'
  });
  
  return `${baseUrl}?${params.toString()}`;
};

// Structured data helpers
export const generatePersonStructuredData = (person) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": `${person.firstName} ${person.lastName}`,
    "givenName": person.firstName,
    "familyName": person.lastName,
    "jobTitle": "Développeur Full-Stack & Spécialiste Automatisation IA",
    "description": person.bio,
    "url": "https://www.kacihamroun.com",
    "image": person.profilePic ? `https://www.kacihamroun.com${person.profilePic}` : null,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lille",
      "postalCode": "59000",
      "addressRegion": "Hauts-de-France",
      "addressCountry": "FR"
    },
    "sameAs": [
      person.linkedinUrl,
      person.githubUrl,
      "https://www.kacihamroun.com"
    ].filter(Boolean),
    "knowsAbout": person.skills?.map(skill => skill.name) || [],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  };
};

export const generateProjectStructuredData = (project, author) => {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "url": project.projectUrl || `https://www.kacihamroun.com/projects/${generateSlug(project.title)}`,
    "image": project.imageUrl ? `https://www.kacihamroun.com${project.imageUrl}` : null,
    "author": {
      "@type": "Person",
      "name": author ? `${author.firstName} ${author.lastName}` : "Kaci Hamroun",
      "url": "https://www.kacihamroun.com"
    },
    "dateCreated": project.createdAt || new Date().toISOString(),
    "keywords": project.skills?.map(skill => skill.name).join(', '),
    "genre": "Web Development",
    "inLanguage": "fr-FR"
  };
};

export const generateWebSiteStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kaci Hamroun - Portfolio Développeur Full-Stack IA",
    "description": "Portfolio professionnel de Kaci Hamroun, développeur full-stack spécialisé en automatisation IA à Lille.",
    "url": "https://www.kacihamroun.com",
    "inLanguage": "fr-FR",
    "publisher": {
      "@type": "Person",
      "name": "Kaci Hamroun"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.kacihamroun.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};