import React from 'react';
import {Link} from 'react-router-dom';

type CategoryCardProps = {
    title: string;
    route: string;
};

const CategoryCard: React.FC<CategoryCardProps> = ({title, route}) => {
    return (
        <Link to={route}>
            <div className="bg-blue-500 text-white p-4 rounded-2xl shadow-lg hover:bg-blue-600 transition duration-300 cursor-pointer">
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
        </Link>
    )
}

export default CategoryCard;