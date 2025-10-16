// scripts/generateSitemap.js
const fs = require('fs');
const path = require('path');

const generateSitemap = (projects = [], services = []) => {
  const baseUrl = 'https://www.kacihamroun.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Page d'accueil -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${baseUrl}/images/kaci-hamroun-profile.jpg</image:loc>
      <image:title>Kaci Hamroun - Développeur Full-Stack Automatisation IA</image:title>
      <image:caption>Portrait professionnel de Kaci Hamroun, développeur full-stack spécialisé en automatisation IA à Lille</image:caption>
    </image:image>
  </url>
  
  <!-- Sections principales -->
  <url>
    <loc>${baseUrl}/#about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/#projects</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/#contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Add dynamic project pages
  projects.forEach(project => {
    const slug = project.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
      
    sitemap += `
  
  <url>
    <loc>${baseUrl}/projects/${slug}</loc>
    <lastmod>${project.updatedAt || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    ${project.imageUrl ? `<image:image>
      <image:loc>${baseUrl}${project.imageUrl}</image:loc>
      <image:title>${project.title}</image:title>
      <image:caption>${project.description?.substring(0, 100)}...</image:caption>
    </image:image>` : ''}
  </url>`;
  });

  // Add dynamic service pages
  services.forEach(service => {
    const slug = service.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
      
    sitemap += `
  
  <url>
    <loc>${baseUrl}/services/${slug}</loc>
    <lastmod>${service.updatedAt || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add static service pages
  const staticServices = [
    'developpement-web-lille',
    'automatisation-ia',
    'react-nodejs-development',
    'python-machine-learning'
  ];

  staticServices.forEach(service => {
    sitemap += `
  
  <url>
    <loc>${baseUrl}/services/${service}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `

</urlset>`;

  return sitemap;
};

// Generate and save sitemap
const saveSitemap = (projects = [], services = []) => {
  const sitemapContent = generateSitemap(projects, services);
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('✅ Sitemap generated successfully!');
};

module.exports = { generateSitemap, saveSitemap };