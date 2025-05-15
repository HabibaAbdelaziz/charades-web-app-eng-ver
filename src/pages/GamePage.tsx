import React, {useState, useEffect, useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wordsData } from '../data/words';

// TODO: Keep track of which words users got right and wrong to display at end of the round
// TODO: create a feature where user can adjust the timer for when round finishes
// TODO: Replace "Correct" and "Pass" buttons after testing with tilt detection
// TODO: Create user guide so IOS 13 and up users enable permissions for motion detection
// TODO: Design nice icons/ banners for each category
// TODO: Make sure user places device on forehead and detect whether it is or not. Display message for user to put device on forehead.
// TODO: Display on screen when user tilts device up or down. (passes the word or gets it correct)
const Game: React.FC = () => {
    const { category } = useParams<{category: string}>();
    const normalizedCategory = category?.toLowerCase() || ''; // Normalize to lowercase
    const navigate = useNavigate();

    //get words for the selected category
    //TODO: make sure that same word is not repeated in the same round
    const words = wordsData[normalizedCategory || ''] || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    // Request permission before accessing motion data from user (required on iOS 13+). Remember if user already granted permission before or not.
    const [permissionGranted, setPermissionGranted] = useState(
        localStorage.getItem("motionPermission") === "granted"
    );
    const [showFeedback, setShowFeedback] = useState<null | "correct" | "pass">(null);
    const [isProcessingMotion, setIsProcessingMotion] = useState(false);
    const [baselineRotation, setBaselineRotation] = useState<number | null>(null);

    const handleWordChange = useCallback((isCorrect: boolean) => {
        if (showFeedback || isProcessingMotion) return;

        setIsProcessingMotion(true);
        setShowFeedback(isCorrect ? "correct" : "pass");
        
        if (isCorrect) {
            setScore((prev) => prev + 1);
        }

        setTimeout(() => {
            setShowFeedback(null);
            setCurrentIndex((prev) => (prev + 1) % words.length);
            setIsProcessingMotion(false);
        }, 2000);
    }, [showFeedback, isProcessingMotion, words.length]);

    useEffect(() => {
        if (!permissionGranted) return;

        let lastProcessTime = 0;
        const PROCESS_INTERVAL = 1000; // Minimum time between processing events (ms)
        
        const calibrateBaseline = (event: DeviceOrientationEvent) => {
            if (baselineRotation === null && event.beta !== null) {
                setBaselineRotation(event.beta);
            }
        };

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (!event.beta || baselineRotation === null) return;
            
            const now = Date.now();
            if (now - lastProcessTime < PROCESS_INTERVAL) return;
            
            const rotation = event.beta - baselineRotation;
            const THRESHOLD = 20; // Degrees of tilt required

            if (Math.abs(rotation) > THRESHOLD) {
                lastProcessTime = now;
                handleWordChange(rotation > 0); // Tilting down (positive) is correct
            }
        };

        // Set up initial calibration
        window.addEventListener('deviceorientation', calibrateBaseline, { once: true });
        
        // Set up the main orientation handler
        window.addEventListener('deviceorientation', handleOrientation);
        
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('deviceorientation', calibrateBaseline);
        };
    }, [permissionGranted, baselineRotation, handleWordChange]);

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

    const requestPermission = async () => {
        if (
            typeof DeviceOrientationEvent !== "undefined" &&
            "requestPermission" in DeviceOrientationEvent
        ) {
            try {
                const permission = await (DeviceOrientationEvent as unknown as {requestPermission: () => Promise<string>}).requestPermission();
                if (permission === "granted") {
                    setPermissionGranted(true);
                    localStorage.setItem("motionPermission", "granted");
                } else {
                    alert("Motion permission denied. Please enable device orientation permissions to play.");
                }
            } catch (error) {
                console.error("Error requesting motion permission:", error);
                alert("Error requesting motion permission. Please ensure you're using a supported device and browser.");
            }
        } else {
            setPermissionGranted(true);
            localStorage.setItem("motionPermission", "granted");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {!permissionGranted ? (
                <button
                    onClick={requestPermission}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                >
                    Enable Motion Controls
                </button>
            ) : showFeedback? (
                // show pass or correct feedback
                <div className="text-center">
                    <h1 className="text-4xl font-bold">
                        {showFeedback === "correct" ?  "✅ Correct!" : "❌ Passed!"}
                    </h1>
                    <p className="text-gray-600 mt-2">Next word in 2 seconds....</p>
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-4">{currentWord.word}</h1>
                    {currentWord.image && (
                        <img 
                            src={currentWord.image}
                            alt={`Flag of ${currentWord.word}`}
                            className="w-40 h-40 object-contain mb-4 border border-gray-300"
                        />
                    )}
                    <p className="text-gray-600">Tilt **down** for ✅, **up** for ❌</p>
                    <p className="mt-4 text-lg font-semibold">Score: {score}</p>
                </>
            )}
        </div>
    )

    // The below functions are used to test the app using "correct" or "pass"  buttons instead of tilting the device up (pass) or down (correct)
    // // handle correct guess
    // const handleCorrectGuess = () => {
    //     setScore(score+1);
    //     handleNext();
    // }

    // //handle pass
    // const handlePass = () =>{
    //     handleNext()
    // };

    // //Go to the next word or end game
    // const handleNext = () => {
    //     if (currentIndex < words.length-1){
    //         setCurrentIndex(currentIndex+1);
    //     }else{
    //         alert(`Game Over! Your Score: ${score}`)
    //         navigate('/')
    //     }
    // };

    // return (
    //     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    //         <h1 className='text-3xl font-bold mb-6'>Category: {category}</h1>
    //         <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-xs w-full">
    //             {currentWord.image? (
    //                 <img
    //                   src={currentWord.image}
    //                   alt={currentWord.word}
    //                   className="w-full h-40 object-contain mb-4"
    //                 />
    //             ) : (
    //                 <h2 className='text-2xl font-bold mb-4'>{currentWord.word}</h2>
    //             )}

    //             <div className="flex justify-between mt-4">
    //                 <button
    //                   onClick={handlePass}
    //                   className="bg-red-500 text-black px-4 py-2 rounded-lg hover:bg-red-600"
    //                 >
    //                     Pass
    //                 </button>
    //                 <button
    //                   onClick={handleCorrectGuess}
    //                   className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600"
    //                 >
    //                     Correct
    //                 </button>
    //             </div>
    //         </div>

    //         <p className="mt-4 text-gray-600">Score: {score}</p>
    //     </div>
    // )

}

export default Game;