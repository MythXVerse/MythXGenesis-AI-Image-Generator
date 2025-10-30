
import React from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-dark-bg bg-grid-dark-border/[0.2] relative flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-dark-bg [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="w-full max-w-7xl mx-auto z-10 flex-grow">
        <Header />
        <main>
          <ImageGenerator />
        </main>
      </div>
      <footer className="w-full text-center text-medium-text text-sm py-4 z-10">
        © 2024 MythXVerse | Sumit Rathod. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
