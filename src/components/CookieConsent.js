import React, { useState, useEffect } from 'react';

const CookieConsent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Toujours activé, ne peut pas être désactivé
    performance: true,
    functionality: true
  });

  useEffect(() => {
    // Vérifie si l'utilisateur a déjà accepté les cookies
    const consentData = localStorage.getItem('cookieConsent');
    if (!consentData) {
      setIsVisible(true);
    } else {
      try {
        const parsedData = JSON.parse(consentData);
        const now = new Date();
        const consentDate = new Date(parsedData.timestamp);
        const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000; // 6 mois en millisecondes
        
        // Vérifie si le consentement a expiré (plus de 6 mois)
        if (now - consentDate > sixMonthsInMs) {
          setIsVisible(true);
        }
      } catch (error) {
        // Si le format des données est invalide, afficher le bandeau
        setIsVisible(true);
      }
    }
  }, []);

  // Si l'utilisateur n'a pas encore consenti, afficher le bandeau en bas de page
  if (isVisible && !showSettings) {
    return (
      <>
        {children}
        <div className="fixed bottom-0 left-0 right-0 bg-web3-card border-t border-web3-accent/30 shadow-2xl z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Nous utilisons des cookies
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Ce site utilise des cookies pour améliorer votre expérience de navigation, 
                  analyser l'utilisation du site et vous proposer des contenus personnalisés.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const consentData = {
                      consent: 'custom',
                      preferences: cookiePreferences,
                      timestamp: new Date().toISOString(),
                      version: '1.0'
                    };
                    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
                    setIsVisible(false);
                  }}
                  className="bg-gradient-to-r from-web3-accent to-web3-purple text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-web3-accent focus:ring-offset-2 focus:ring-offset-web3-dark"
                >
                  Accepter ma sélection
                </button>
                <button
                  onClick={() => {
                    const consentData = {
                      consent: 'all',
                      preferences: {
                        necessary: true,
                        performance: true,
                        functionality: true
                      },
                      timestamp: new Date().toISOString(),
                      version: '1.0'
                    };
                    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
                    setIsVisible(false);
                  }}
                  className="bg-web3-darker border border-web3-accent/50 text-gray-300 hover:text-white hover:border-web3-accent font-medium py-2 px-6 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-web3-accent focus:ring-offset-2 focus:ring-offset-web3-dark"
                >
                  Accepter tout
                </button>
                <button
                  onClick={() => {
                    const consentData = {
                      consent: 'none',
                      preferences: {
                        necessary: true, // Toujours activé
                        performance: false,
                        functionality: false
                      },
                      timestamp: new Date().toISOString(),
                      version: '1.0'
                    };
                    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
                    setIsVisible(false);
                  }}
                  className="bg-transparent border border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-web3-dark"
                >
                  Refuser les cookies optionnels
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const handleAcceptAll = () => {
    const consentData = {
      consent: 'all',
      preferences: {
        necessary: true,
        performance: true,
        functionality: true
      },
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setIsVisible(false);
    setShowSettings(false);
  };


  const handleCustomAccept = () => {
    const consentData = {
      consent: 'custom',
      preferences: cookiePreferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleSettingsChange = (type) => {
    if (type === 'necessary') return; // Ne peut pas être désactivé
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Si l'utilisateur a consenti, afficher le contenu normal avec accès aux paramètres
  if (!isVisible && !showSettings) {
    return (
      <>
        {children}
        {/* Floating Cookie Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="fixed bottom-6 right-6 bg-web3-accent hover:bg-web3-purple text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-web3-accent focus:ring-offset-2 focus:ring-offset-web3-dark z-40"
          title="Gérer les paramètres des cookies"
        >
          🍪 Gérer les cookies
        </button>
      </>
    );
  }

  return (
    <>
      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-web3-card border border-web3-accent/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Paramètres des cookies</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-200 mb-2">Cookies strictement nécessaires</h4>
                  <p className="text-sm text-gray-400 mb-3">Essentiels au fonctionnement du site. Impossible de les désactiver.</p>
                  <div className="flex items-center justify-between p-3 bg-web3-darker rounded-lg">
                    <span className="text-sm text-gray-300">Toujours actif</span>
                    <div className="w-10 h-6 bg-green-500 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-200 mb-2">Cookies de performance</h4>
                  <p className="text-sm text-gray-400 mb-3">Permettent d'analyser l'utilisation du site pour l'améliorer.</p>
                  <div className="flex items-center justify-between p-3 bg-web3-darker rounded-lg">
                    <span className="text-sm text-gray-300">Analytics et statistiques</span>
                    <button
                      onClick={() => handleSettingsChange('performance')}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        cookiePreferences.performance ? 'bg-web3-accent' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        cookiePreferences.performance ? 'right-0.5' : 'left-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-200 mb-2">Cookies de fonctionnalité</h4>
                  <p className="text-sm text-gray-400 mb-3">Mémorisent vos préférences pour une meilleure expérience.</p>
                  <div className="flex items-center justify-between p-3 bg-web3-darker rounded-lg">
                    <span className="text-sm text-gray-300">Préférences et personnalisation</span>
                    <button
                      onClick={() => handleSettingsChange('functionality')}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        cookiePreferences.functionality ? 'bg-web3-accent' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        cookiePreferences.functionality ? 'right-0.5' : 'left-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={handleCustomAccept}
                  className="flex-1 bg-gradient-to-r from-web3-accent to-web3-purple text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-web3-accent focus:ring-offset-2 focus:ring-offset-web3-dark"
                >
                  Enregistrer mes choix
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-web3-darker border border-web3-accent/50 text-gray-300 hover:text-white hover:border-web3-accent font-medium py-2 px-6 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-web3-accent focus:ring-offset-2 focus:ring-offset-web3-dark"
                >
                  Accepter tout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;