'use client';

const Footer = () => {
    const mailToMe = () => {
        window.location.href = "mailto:embarki24@gmail.com";
    };

    return (
        <footer className="bg-white  shadow p-4 dark:bg-gray-800 sticky-footer">
            <div className="w-full mx-auto max-w-screen-xl md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2024 <a href="https://portfolio-omar-embarkis-projects.vercel.app/" className="hover:underline">E-Commerce</a>. All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="/" className="hover:underline me-4 md:me-6">Home</a>
                    </li>
                    <li>
                        <a href="/products" className="hover:underline me-4 md:me-6">Products</a>
                    </li>
                    <li>
                        <a onClick={mailToMe} className="hover:underline cursor-pointer">Contact</a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
