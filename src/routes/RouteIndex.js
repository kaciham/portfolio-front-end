import React, { Suspense } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import LoadingWrapper from '../components/LoadingWrapper';

// Lazy load page components for code-splitting (performance optimization)
const Home = React.lazy(() => import("../pages/Home"))
const PrivacyPolicy = React.lazy(() => import("../pages/PrivacyPolicy"))

// Component to handle redirects from old URLs that were in sitemap
const RedirectToHome = () => {
    return <Navigate to="/" replace />;
};

const RouteIndex = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingWrapper isLoading={true} />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
                    {/* Redirect old sitemap URLs to home page */}
                    <Route path="/services/*" element={<RedirectToHome />} />
                    <Route path="/blog" element={<RedirectToHome />} />
                    <Route path="/mentions-legales" element={<RedirectToHome />} />
                    {/* Catch-all route for any other URLs */}
                    <Route path="*" element={<RedirectToHome />} />
                    {/* <Route path="/about" element={<About />} />
                    <Route path="/service" element={<Service />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path='/projet' element={<Projet />} /> */}
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default RouteIndex;
