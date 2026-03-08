import React from 'react';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = ({ onCookieSettings }) => {
    return (
        <footer className="bg-[#020203] border-t border-white/[0.06] text-linear-fg py-12 px-4 mt-16">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8">
                    {/* Brand */}
                    <div className="text-center sm:text-left">
                        <h2 className="text-lg font-semibold tracking-tight gradient-text">Kaci HAMROUN</h2>
                        <p className="text-sm text-linear-muted mt-1">Développeur Full-Stack</p>
                    </div>

                    {/* Social */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-mono tracking-widest uppercase text-linear-muted">Suivez-moi</span>
                        <div className="flex gap-3">
                            <a
                                href="https://www.linkedin.com/in/kaci-hamroun/"
                                aria-label="Profil LinkedIn"
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.06] text-linear-muted hover:text-linear-accent hover:border-linear-borderAccent hover:bg-white/[0.08] transition-all duration-200"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FaLinkedinIn size={16} />
                            </a>
                            <a
                                href="https://github.com/kaciham"
                                aria-label="Profil GitHub"
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.06] text-linear-muted hover:text-linear-accent hover:border-linear-borderAccent hover:bg-white/[0.08] transition-all duration-200"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FaGithub size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Contact info */}
                    <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                        <span className="text-xs font-mono tracking-widest uppercase text-linear-muted">Contact</span>
                        <p className="text-sm text-linear-muted mt-2">kacihamrounpro@gmail.com</p>
                        <p className="text-sm text-linear-muted">+33 6 18 37 41 61</p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="section-divider mt-8 mb-4" />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onCookieSettings}
                            className="text-xs text-linear-muted hover:text-linear-fg transition-colors duration-200"
                            aria-label="Gérer les paramètres de cookies"
                        >
                            Gérer les cookies
                        </button>
                        <span className="text-white/[0.1]">|</span>
                        <a
                            href="/politique-confidentialite"
                            className="text-xs text-linear-muted hover:text-linear-fg transition-colors duration-200"
                        >
                            Politique de confidentialité
                        </a>
                    </div>
                    <p className="text-xs text-linear-muted/60">
                        © {new Date().getFullYear()} Kaci HAMROUN
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
