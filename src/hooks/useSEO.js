// hooks/useSEO.js
import { useEffect, useState } from 'react';

export const useSEO = () => {
  const [pageData, setPageData] = useState({
    title: '',
    description: '',
    keywords: '',
    canonical: '',
    ogImage: ''
  });

  const updateSEO = (newData) => {
    setPageData(prev => ({ ...prev, ...newData }));
  };

  const generateProjectSEO = (project, userName = 'Kaci Hamroun') => {
    const skills = project.skills?.map(skill => skill.name).join(', ') || '';
    
    return {
      title: `${project.title} - Projet ${userName} | Développeur Full-Stack IA`,
      description: `Découvrez ${project.title}, un projet de ${userName}, développeur full-stack spécialisé en automatisation IA. Technologies utilisées: ${skills}. ${project.description?.substring(0, 120)}...`,
      keywords: `${project.title}, ${skills}, projet développement web, ${userName}, automatisation IA, Lille`,
      canonical: `https://www.kacihamroun.com/projects/${project.slug || project._id}`,
      ogImage: project.imageUrl ? `https://www.kacihamroun.com${project.imageUrl}` : 'https://www.kacihamroun.com/images/project-default.jpg'
    };
  };

  const generateServiceSEO = (service) => {
    return {
      title: `${service.name} - Services Kaci Hamroun | Développeur Full-Stack IA Lille`,
      description: `Service professionnel: ${service.description}. Expert en développement web et automatisation IA à Lille. Contactez-moi pour votre projet.`,
      keywords: `${service.name}, services développement web, automatisation IA, Lille, freelance développeur`,
      canonical: `https://www.kacihamroun.com/services/${service.slug}`,
      ogImage: 'https://www.kacihamroun.com/images/services-og.jpg'
    };
  };

  const generateContactSEO = () => {
    return {
      title: 'Contact - Kaci Hamroun | Développeur Full-Stack & Automatisation IA Lille',
      description: 'Contactez Kaci Hamroun, développeur full-stack spécialisé en automatisation IA à Lille. Discutons de votre projet web ou d\'automatisation.',
      keywords: 'contact développeur web, automatisation IA Lille, freelance développeur, projet web, consultation technique',
      canonical: 'https://www.kacihamroun.com/contact',
      ogImage: 'https://www.kacihamroun.com/images/contact-og.jpg'
    };
  };

  return {
    pageData,
    updateSEO,
    generateProjectSEO,
    generateServiceSEO,
    generateContactSEO
  };
};