"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/providers/providers';
import { Moon, Sun, Home, Package, Activity } from 'lucide-react'; // Import icons

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-bold text-blue-600 dark:text-blue-400">E-Commerce</span>
                </Link>
                <button
                    onClick={toggleDropdown}
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded={isOpen ? 'true' : 'false'}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link href="/" className={`flex items-center py-2 px-3 rounded transition-colors duration-200 ${
                                pathname === '/' ? 'text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                            }`} aria-current={pathname === '/' ? 'page' : undefined}>
                                <Home className="w-5 h-5 mr-2" />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/products" className={`flex items-center py-2 px-3 rounded transition-colors duration-200 ${
                                pathname === '/products' ? 'text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                            }`} aria-current={pathname === '/products' ? 'page' : undefined}>
                                <Package className="w-5 h-5 mr-2" />
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link href="/status" className={`flex items-center py-2 px-3 rounded transition-colors duration-200 ${
                                pathname === '/status' ? 'text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                            }`} aria-current={pathname === '/status' ? 'page' : undefined}>
                                <Activity className="w-5 h-5 mr-2" />
                                Status
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center py-2 px-3 rounded transition-colors duration-200 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                            >
                                {theme === 'dark' ? (
                                    <>
                                        <Sun className="w-5 h-5 mr-2" />
                                        
                                    </>
                                ) : (
                                    <>
                                        <Moon className="w-5 h-5 mr-2" />
                                        
                                    </>
                                )}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;