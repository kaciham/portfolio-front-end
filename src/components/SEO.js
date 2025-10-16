import { useEffect } from 'react';

const SEO = ({ 
  title = "Kaci Hamroun - Développeur Full-Stack & Automatisation IA | Lille 59000",
  description = "Kaci Hamroun, développeur full-stack spécialisé en automatisation IA à Lille. Expert React, Node.js, Python, intelligence artificielle et solutions d'automatisation sur mesure.",
  keywords = "développeur full-stack, automatisation IA, intelligence artificielle, React, Node.js, Python, développeur web Lille, automatisation processus, machine learning, développeur frontend backend, Kaci Hamroun, freelance développeur Lille",
  canonical = "https://www.kacihamroun.com",
  ogImage = "https://www.kacihamroun.com/images/kaci-hamroun-og.jpg",
  jsonLd = null
}) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonical);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', ogImage);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonical);
    }
    
    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
    
    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', ogImage);
    }
    
    // Update JSON-LD structured data
    if (jsonLd) {
      let existingJsonLd = document.querySelector('script[type="application/ld+json"]');
      if (existingJsonLd) {
        existingJsonLd.textContent = JSON.stringify(jsonLd);
      } else {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
      }
    }
    
  }, [title, description, keywords, canonical, ogImage, jsonLd]);
  
  return null; // This component doesn't render anything
};

export default SEO;