import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom"

import Home from "../pages/Home"


const RouteIndex = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/about" element={<About />} />
                <Route path="/service" element={<Service />} />
                <Route path="/contact" element={<Contact />} />
                <Route path='/projet' element={<Projet />} /> */}
            </Routes>
        </BrowserRouter>
    );
};

export default RouteIndex;