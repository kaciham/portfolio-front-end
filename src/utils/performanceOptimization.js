// utils/performanceOptimization.js

// Lazy loading for components
export const lazyLoadComponent = (importFunc) => {
  return React.lazy(() => {
    return new Promise(resolve => {
      setTimeout(() => resolve(importFunc()), 100);
    });
  });
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical CSS
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.as = 'style';
  criticalCSS.href = '/static/css/critical.css';
  document.head.appendChild(criticalCSS);

  // Preload critical fonts
  const fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];
  
  fonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = fontUrl;
    document.head.appendChild(link);
  });
};

// Optimize images
export const getOptimizedImageUrl = (originalUrl, width = 800, quality = 80) => {
  if (!originalUrl) return '';
  
  // If using a CDN like Cloudinary or similar, add optimization parameters
  if (originalUrl.includes('cloudinary') || originalUrl.includes('imagekit')) {
    return `${originalUrl}?w=${width}&q=${quality}&f=auto`;
  }
  
  return originalUrl;
};

// Debounce function for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Web Vitals tracking
export const trackWebVitals = () => {
  // Track Largest Contentful Paint (LCP)
  const trackLCP = () => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          name: 'LCP',
          value: Math.round(lastEntry.startTime),
          event_category: 'Performance'
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  };

  // Track First Input Delay (FID)
  const trackFID = () => {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'FID',
            value: Math.round(entry.processingStart - entry.startTime),
            event_category: 'Performance'
          });
        }
      }
    }).observe({ entryTypes: ['first-input'] });
  };

  // Track Cumulative Layout Shift (CLS)
  const trackCLS = () => {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
      
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          name: 'CLS',
          value: Math.round(clsValue * 1000),
          event_category: 'Performance'
        });
      }
    }).observe({ entryTypes: ['layout-shift'] });
  };

  // Initialize tracking
  if ('PerformanceObserver' in window) {
    trackLCP();
    trackFID();
    trackCLS();
  }
};

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'www.google-analytics.com'
  ];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
};

// Critical CSS injection
export const injectCriticalCSS = (css) => {
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
};

export default {
  lazyLoadComponent,
  preloadCriticalResources,
  getOptimizedImageUrl,
  debounce,
  throttle,
  createIntersectionObserver,
  trackWebVitals,
  addResourceHints,
  injectCriticalCSS
};