import React, { useState, useEffect } from 'react';
import { FaLinkedinIn, FaGlobe } from 'react-icons/fa';
import { getUserData } from '../api/apiCalls';
import { getImageUrl } from '../utils/imageHelpers';
import { API_BASE_URL } from '../config/apiConfig';
import SEO from '../components/SEO';

const Bio = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserData();
      if (!response.error && response.data?.portfolios?.length > 0) {
        setUserData(response.data.portfolios[0]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const links = userData
    ? [
        {
          label: 'Mon LinkedIn',
          href: userData.linkedinUrl,
          icon: <FaLinkedinIn />,
        },
        {
          label: 'Mon Portfolio',
          href: 'https://www.kacihamroun.com',
          icon: <FaGlobe />,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      <SEO
        title="Kaci Hamroun — Bio"
        description="Développeur Full-Stack & Automatisation IA à Lille. Retrouvez mon LinkedIn et mon portfolio."
        canonical="https://www.kacihamroun.com/bio"
      />

      {/* Background glow */}
      <div className="glow-accent top-[-200px] left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">

        {/* Avatar */}
        <div className="relative">
          {isLoading ? (
            <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
          ) : userData?.profilePic ? (
            <img
              src={getImageUrl(API_BASE_URL, userData.profilePic)}
              alt={`${userData.firstName} ${userData.lastName}`}
              className="w-24 h-24 rounded-full border-2 border-border object-cover shadow-card"
              width={96}
              height={96}
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-border flex items-center justify-center">
              <span className="font-display text-2xl gradient-text">KH</span>
            </div>
          )}
          {/* Online indicator */}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-background" />
        </div>

        {/* Name */}
        {isLoading ? (
          <div className="h-9 w-48 bg-muted animate-pulse rounded-lg" />
        ) : (
          <h1 className="font-display text-3xl tracking-tight text-center text-foreground leading-tight">
            {userData?.firstName}{' '}
            <span className="gradient-text uppercase">{userData?.lastName}</span>
          </h1>
        )}

        {/* Tagline */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
            Développeur Full-Stack &amp; IA · Lille
          </span>
        </div>

        {/* Bio */}
        {isLoading ? (
          <div className="space-y-2 w-full">
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-4/5 mx-auto" />
          </div>
        ) : (
          <p className="text-sm text-muted-fg text-center leading-relaxed max-w-xs">
            {userData?.bio
              ? userData.bio.length > 160
                ? userData.bio.substring(0, 160).trimEnd() + '…'
                : userData.bio.trim()
              : 'Passionné par la technologie et l’innovation, je crée des solutions web modernes et intelligentes pour transformer les idées en réalité.'}
          </p>
        )}

        {/* Divider */}
        <div className="section-divider w-full" />

        {/* Links */}
        <div className="flex flex-col gap-3 w-full">
          {isLoading
            ? [1, 2].map(i => (
                <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />
              ))
            : links.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="relative flex items-center w-full py-4 px-5 rounded-xl bg-card border border-border text-foreground shadow-card font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 text-accent shrink-0">
                    <span className="text-lg leading-none">{icon}</span>
                  </span>
                  <span className="flex-1 text-center pr-9">{label}</span>
                </a>
              ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-fg mt-2">
          kacihamrounpro@gmail.com
        </p>
      </div>
    </div>
  );
};

export default Bio;
