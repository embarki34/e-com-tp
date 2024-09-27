'use client'; // ensures this is a client-side component
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">E-Commerce</span>
                </Link>
                <button
                    onClick={toggleDropdown}
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded={isOpen ? 'true' : 'false'}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className={`${isOpen ? '' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link href="/" className={`block py-2 px-3 rounded md:p-0 ${
                                pathname === '/' ? 'text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent '
                            } dark:text-white md:dark:text-blue-500`} aria-current={pathname === '/' ? 'page' : undefined}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/products" className={`block py-2 px-3 rounded md:p-0 ${
                                pathname === '/products' ? 'text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent '
                            } dark:text-white md:dark:text-blue-500`} aria-current={pathname === '/products' ? 'page' : undefined}>
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link href="/status" className={`block py-2 px-3 rounded md:p-0 ${
                                pathname === '/status' ? 'text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent '
                            } dark:text-white md:dark:text-blue-500`} aria-current={pathname === '/status' ? 'page' : undefined}>
                                Status
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
