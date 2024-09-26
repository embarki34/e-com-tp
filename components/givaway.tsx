import React from 'react';
import BlurFade from "@/components/magicui/blur-fade";

const GiveawaySection = () => {
    return (
        <section className="relative bg-gradient-to-r from-purple-500 to-blue-600 animate-gradient-x dark:from-purple-800 dark:to-blue-900 rounded-lg">
            <BlurFade>
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6 text-center">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-white">
                        Sign up here to get a chance to enter our giveaway
                    </h2>
                    <p className="mb-6 font-light text-gray-200 md:text-lg">
                        Join our community and stand a chance to win amazing prizes!
                    </p>
                    <a
                        href="#"
                        className="transition-transform transform hover:scale-105 text-white bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-transparent dark:border-gray-400 dark:hover:bg-gray-600 dark:hover:text-white focus:outline-none dark:focus:ring-gray-600"
                    >
                        Enter the Giveaway
                    </a>
                </div>
            </BlurFade>
        </section>
    );
};

export default GiveawaySection;
