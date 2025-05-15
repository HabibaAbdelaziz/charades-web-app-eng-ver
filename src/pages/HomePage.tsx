import React from 'react';
import CategoryCard from '../components/CategoryCard';
import { wordsData } from '../data/words';

const categoryInfo = {
    foods: {
        icon: '🍔',
        description: 'Act out various foods',
    },
    countries: {
        icon: '🌎',
        description: 'Represent different countries and cultures',
    },
    movies: {
        icon: '🎥',
        description: 'Act out various movies',
    }
};

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12 pt-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Charades
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Hold your device to your forehead, act out the words, and tilt to score!
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(categoryInfo).map(([category, info]) => (
                        <CategoryCard
                            key={category}
                            category={category}
                            icon={info.icon}
                            description={info.description}
                            wordCount={wordsData[category]?.length || 0}
                        />
                    ))}
                </div>

                <footer className="mt-12 text-center text-gray-400 text-sm">
                    <p>Tilt your device down ⬇️ for correct guesses, up ⬆️ to pass</p>
                    <p className="mt-2">Best played on mobile devices with motion sensors</p>
                </footer>
            </div>
        </div>
    );
};

export default HomePage;