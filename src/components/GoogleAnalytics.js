// src/components/GoogleAnalytics.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAnalytics = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Replace with YOUR Measurement ID
    const measurementId = 'G-BN8QHJQZ9R';
    
    // Load Google Analytics script
    if (!window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', measurementId);
    }
  }, []);

  // Track page views when route changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-BN8QHJQZ9R', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;