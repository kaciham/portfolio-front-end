// components/BreadcrumbSEO.js
import React from 'react';

const BreadcrumbSEO = ({ items = [] }) => {
  if (!items.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Fil d'Ariane" className="text-sm text-gray-600 mb-4">
        <ol className="flex space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {item.url ? (
                <a href={item.url} className="hover:text-blue-600 transition-colors">
                  {item.name}
                </a>
              ) : (
                <span className="text-gray-800 font-medium">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default BreadcrumbSEO;