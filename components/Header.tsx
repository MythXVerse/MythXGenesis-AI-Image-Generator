
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-brand-secondary via-brand-accent to-white text-transparent bg-clip-text pb-2">
        MythXGenesis
      </h1>
      <p className="text-medium-text mt-2 text-base md:text-lg max-w-3xl mx-auto">
        As <span className="font-semibold text-brand-accent">AIVerse 2100</span>, I use your vision to forge photorealistic characters. Create, customize, and evolve your digital self with unparalleled precision.
      </p>
    </header>
  );
};

export default Header;