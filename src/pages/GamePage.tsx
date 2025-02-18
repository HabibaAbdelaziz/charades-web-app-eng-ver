import React, {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wordsData } from '../data/words';

// TODO: Keep track of which words users got right and wrong to display at end of the round
// TODO: create a feature where user can adjust the timer for when round finishes
// TODO: Replace "Correct" and "Pass" buttons after testing with tilt detection
// TODO: Create user guide so IOS 13 and up users enable permissions for motion detection
// TODO: Design nice icons/ banners for each category
const Game: React.FC = () => {
    const { category } = useParams<{category: string}>();
    const navigate = useNavigate();

    //get words for the selected category
    //TODO: make sure that same word is not repeated in the same round
    const words = wordsData[category || ''] || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);

    // If no words found, show error and navigate back to home
    if (!words.length){
        return (
            <div className='min-h-screen flex flex-col items-center justify-center'>
                <h1 className="text-3xl font-bold">Invalid Category</h1>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => navigate('/')}
                >
                    Go Back
                </button>
            </div>
        )
    }

    //get the current word and image
    const currentWord = words[currentIndex];

    // handle correct guess
    const handleCorrectGuess = () => {
        setScore(score+1);
        handleNext();
    }

    //handle pass
    const handlePass = () =>{
        handleNext()
    };

    //Go to the next word or end game
    const handleNext = () => {
        if (currentIndex < words.length-1){
            setCurrentIndex(currentIndex+1);
        }else{
            alert(`Game Over! Your Score: ${score}`)
            navigate('/')
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className='text-3xl font-bold mb-6'>Category: {category}</h1>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-xs w-full">
                {currentWord.image? (
                    <img
                      src={currentWord.image}
                      alt={currentWord.word}
                      className="w-full h-40 object-contain mb-4"
                    />
                ) : (
                    <h2 className='text-2xl font-bold mb-4'>{currentWord.word}</h2>
                )}

                <div className="flex justify-between mt-4">
                    <button
                      onClick={handlePass}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Pass
                    </button>
                    <button
                      onClick={handleCorrectGuess}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        Correct
                    </button>
                </div>
            </div>

            <p className="mt-4 text-gray-600">Score: {score}</p>
        </div>
    )

}

export default Game;