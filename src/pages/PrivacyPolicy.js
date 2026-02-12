import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-web3-dark">
      <SEO
        title="Politique de Confidentialité - Kaci Hamroun"
        description="Politique de confidentialité de Kaci Hamroun concernant l'utilisation des cookies et la protection des données personnelles."
        keywords="politique confidentialité, cookies, protection données, RGPD, Kaci Hamroun"
        canonical="https://www.kacihamroun.com/politique-confidentialite"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-web3-card border border-web3-accent/30 rounded-2xl p-8 shadow-card">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
            Politique de Confidentialité
          </h1>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-web3-cyan mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                La protection de vos données personnelles est essentielle pour nous. Cette politique de confidentialité 
                explique comment nous collectons, utilisons et protégeons vos informations lorsque vous visitez notre site web.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-web3-cyan mb-4">2. Cookies</h2>
              
              <h3 className="text-lg font-medium text-white mb-2">2.1. Qu'est-ce qu'un cookie ?</h3>
              <p className="leading-relaxed mb-4">
                Un cookie est un petit fichier texte déposé sur votre navigateur lorsque vous visitez un site web. 
                Il permet au site de reconnaître votre appareil et de mémoriser certaines informations.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">2.2. Types de cookies utilisés</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-200">Cookies strictement nécessaires</h4>
                  <p className="text-sm text-gray-400">Essentiels au fonctionnement du site, ils ne peuvent être désactivés.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-200">Cookies de performance</h4>
                  <p className="text-sm text-gray-400">Permettent d'analyser l'utilisation du site pour l'améliorer.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-200">Cookies de fonctionnalité</h4>
                  <p className="text-sm text-gray-400">Mémorisent vos préférences pour une meilleure expérience.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-web3-cyan mb-4">3. Gestion des cookies</h2>
              <p className="leading-relaxed">
                Vous pouvez à tout moment modifier vos préférences concernant les cookies via le bandeau de consentement 
                en bas de page. Vous pouvez également configurer votre navigateur pour refuser les cookies, 
                mais cela peut limiter certaines fonctionnalités du site.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-web3-cyan mb-4">4. Vos droits</h2>
              <p className="leading-relaxed">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Accès à vos données personnelles</li>
                <li>Rectification de vos données inexactes</li>
                <li>Effacement de vos données (droit à l'oubli)</li>
                <li>Limitation du traitement de vos données</li>
                <li>Portabilité de vos données</li>
                <li>Opposition au traitement de vos données</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-web3-cyan mb-4">5. Contact</h2>
              <p className="leading-relaxed">
                Pour exercer vos droits ou pour toute question concernant cette politique de confidentialité, 
                vous pouvez nous contacter via la page de contact du site.
              </p>
            </section>

            <div className="pt-6 border-t border-web3-accent/20">
              <p className="text-sm text-gray-400 text-center">
                Cette politique de confidentialité peut être mise à jour. Nous vous invitons à la consulter régulièrement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;