import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import halfpricesale from "./images/halfpricesale.jpg"
import athome from "./images/athome.jpg"
import coding from "./images/coding.jpg"
import easycode from "./images/easycode.jpg"

const advertisementData = [
    {
        id: 1,
        title: "Learn New Skills Online",
        subtitle: "Unlock Your Potential with Our Courses",
        backgroundImage: easycode,
        buttonText: "Explore Courses"
    },
    {
        id: 2,
        title: "Summer Learning Sale",
        subtitle: "50% Off All Tech Courses",
        backgroundImage: halfpricesale,
        buttonText: "Claim Offer"
    },
    {
        id: 3,
        title: "Master Technology from Home",
        subtitle: "Flexible Online Learning",
        backgroundImage: coding,
        buttonText: "Start Learning"
    }
];

const AdvertisementBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % advertisementData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + advertisementData.length) % advertisementData.length);
    };

    return (
        <div className="relative w-full h-[600px] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5 }}
                >
                    <div
                        className="w-full h-full bg-cover bg-center flex items-center justify-center text-white"
                        style={{ backgroundImage: `url(${advertisementData[currentSlide].backgroundImage})` }}
                    >
                        <div className="text-center bg-black bg-opacity-50 p-12 rounded-lg max-w-2xl">
                            <h2 className="text-5xl font-bold mb-6">
                                {advertisementData[currentSlide].title}
                            </h2>
                            <p className="text-2xl mb-8">
                                {advertisementData[currentSlide].subtitle}
                            </p>
                            <button className="bg-blue-600 text-white px-8 py-4 text-lg rounded-full hover:bg-blue-700 transition">
                                {advertisementData[currentSlide].buttonText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full"
            >
                ←
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full"
            >
                →
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {advertisementData.map((_, index) => (
                    <div
                        key={index}
                        className={`w-4 h-4 rounded-full cursor-pointer ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdvertisementBanner;