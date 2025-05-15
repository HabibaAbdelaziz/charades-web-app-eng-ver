import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
    category: string;
    icon: string;
    description: string;
    wordCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, icon, description, wordCount }) => {
    return (
        <Link 
            to={`/game/${category}`}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-sm"
        >
            <div className="flex items-center mb-4">
                <span className="text-4xl mr-4" role="img" aria-label={category}>
                    {icon}
                </span>
                <h3 className="text-2xl font-bold text-white capitalize">
                    {category}
                </h3>
            </div>
            <p className="text-gray-300 mb-3">
                {description}
            </p>
            <div className="flex justify-between items-center text-sm">
                <span className="text-blue-400">
                    {wordCount} words
                </span>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                    Play Now →
                </span>
            </div>
        </Link>
    );
};

export default CategoryCard;