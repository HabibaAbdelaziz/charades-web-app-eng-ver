import React from 'react';
import CategoryCard from '../components/CategoryCard';

const categories = [
    {title: 'Countries (Names)', route: '/game/countries_names'},
    {title: 'Foods', route: '/game/foods'},
    {title: 'House Items', route: '/game/house-items'},
    {title: 'Movies', route: '/game/movies'},
    {title: 'Pop Songs', route: '/game/pop-songs'}
]

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className='text-4xl font-bold text-gray-800 mb-8'>Choose a Category</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                {categories.map((category)=>(
                    <CategoryCard 
                        key={category.title}
                        title={category.title}
                        route={category.route}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home;