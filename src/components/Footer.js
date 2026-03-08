import React from 'react';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = ({ onCookieSettings }) => {
    return (
        <footer className="bg-foreground text-white py-16 px-6 relative overflow-hidden dot-pattern">
            {/* Accent glow */}
            <div className="glow-accent -top-40 -right-40 opacity-30" />

            <div className="w-full max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-10">
                    {/* Brand */}
                    <div className="text-center sm:text-left">
                        <h2 className="font-display text-2xl gradient-text">Kaci HAMROUN</h2>
                        <p className="text-sm text-white/60 mt-1">Développeur Full-Stack</p>
                    </div>

                    {/* Social */}
                    <div className="flex flex-col items-center gap-3">
                        <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/50">Suivez-moi</span>
                        <div className="flex gap-3">
                            <a
                                href="https://www.linkedin.com/in/kaci-hamroun/"
                                aria-label="Profil LinkedIn"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white/70 hover:bg-accent hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                                target="_blank" rel="noreferrer"
                            >
                                <FaLinkedinIn size={22} />
                            </a>
                            <a
                                href="https://github.com/kaciham"
                                aria-label="Profil GitHub"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white/70 hover:bg-accent hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                                target="_blank" rel="noreferrer"
                            >
                                <FaGithub size={22} />
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                        <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/50">Contact</span>
                        <p className="text-sm text-white/60 mt-2">kacihamrounpro@gmail.com</p>
                        <p className="text-sm text-white/60">+33 6 18 37 41 61</p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="h-px bg-white/10 mt-10 mb-5" />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onCookieSettings}
                            className="text-xs text-white/40 hover:text-white/80 transition-colors duration-200"
                            aria-label="Gérer les paramètres de cookies"
                        >
                            Gérer les cookies
                        </button>
                        <span className="text-white/20">|</span>
                        <a href="/politique-confidentialite" className="text-xs text-white/40 hover:text-white/80 transition-colors duration-200">
                            Politique de confidentialité
                        </a>
                    </div>
                    <p className="text-xs text-white/30">© {new Date().getFullYear()} Kaci HAMROUN</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
