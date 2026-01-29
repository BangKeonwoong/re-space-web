import React from 'react';
import Hero from '../components/Hero';
import BentoGrid from '../components/BentoGrid';
import Marquee from '../components/Marquee';
import Process from '../components/Process';

const Home = () => {
    return (
        <main>
            <Hero />
            <BentoGrid />
            <Marquee />
            <Process />
        </main>
    );
};

export default Home;
