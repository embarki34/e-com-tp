// components/Header.tsx
import React from 'react';

// Define props interface
interface HeaderProps {
    title: string; // Title to display in the header
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="bg-white text-black p-4 text-center">
            <h1 className="text-4xl font-bold">{title}</h1> {/* Use the title prop */}
        </header>
    );
};

export default Header;
