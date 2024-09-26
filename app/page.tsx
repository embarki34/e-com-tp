import HeroSection from "@/components/hero";
import GiveawaySection from "@/components/givaway";
import {MarqueeDemo} from "@/components/productsFade";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-800">
            <div className="w-full max-w-screen-xl px-4">
                <HeroSection />

                <MarqueeDemo/>
                <br/>
               <br/>
                <GiveawaySection/>
                <br/>
                <Footer/>
            </div>
        </div>
    );
}
