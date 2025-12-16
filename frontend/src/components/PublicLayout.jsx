import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import BackButton from './BackButton';
import ScrollDownButton from './ScrollDownButton';

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
            <WhatsAppButton />
            <BackButton />
            <ScrollDownButton />
        </>
    );
};

export default PublicLayout;
