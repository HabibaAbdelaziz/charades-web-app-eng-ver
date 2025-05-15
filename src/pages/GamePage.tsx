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
    const [isCalibrating, setIsCalibrating] = useState(true);
    const [currentRotation, setCurrentRotation] = useState<number | null>(null);
    const [isDeviceReady, setIsDeviceReady] = useState(false);

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

    const startCalibration = useCallback(() => {
        setIsCalibrating(true);
        setBaselineRotation(null);
        setIsDeviceReady(false);
    }, []);

    const finishCalibration = useCallback(() => {
        if (currentRotation !== null) {
            setBaselineRotation(currentRotation);
            setIsCalibrating(false);
            setIsDeviceReady(true);
        }
    }, [currentRotation]);

    useEffect(() => {
        if (!permissionGranted) return;

        let lastProcessTime = 0;
        const PROCESS_INTERVAL = 1000; // Minimum time between processing events (ms)
        
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (!event.beta) return;
            
            setCurrentRotation(event.beta);

            if (isCalibrating || !baselineRotation) return;
            
            const now = Date.now();
            if (now - lastProcessTime < PROCESS_INTERVAL) return;
            
            const rotation = event.beta - baselineRotation;
            const THRESHOLD = 25; // Degrees of tilt required

            if (Math.abs(rotation) > THRESHOLD) {
                lastProcessTime = now;
                // Changed logic: negative rotation means tilting up (pass)
                handleWordChange(rotation > 0);
            }
        };
        
        window.addEventListener('deviceorientation', handleOrientation);
        
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [permissionGranted, baselineRotation, handleWordChange, isCalibrating]);

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
                    startCalibration();
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
            startCalibration();
        }
    };

    const CalibrationScreen = () => (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Device Calibration</h2>
            <div className="mb-6">
                <p className="text-lg mb-4">Please follow these steps:</p>
                <ol className="text-left list-decimal pl-6 space-y-2">
                    <li>Hold your phone vertically</li>
                    <li>Place it against your forehead</li>
                    <li>Screen should face outward</li>
                    <li>Keep the device steady</li>
                </ol>
            </div>
            {currentRotation !== null && (
                <div className="mb-6">
                    <p>Current device angle: {Math.round(currentRotation)}°</p>
                    <p className="text-sm text-gray-600">
                        {Math.abs(currentRotation - 90) < 15 ? "✅ Good position!" : "❌ Please adjust position"}
                    </p>
                </div>
            )}
            <button
                onClick={finishCalibration}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                disabled={!currentRotation || Math.abs(currentRotation - 90) >= 15}
            >
                Start Game
            </button>
        </div>
    );

    if (!permissionGranted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <button
                    onClick={requestPermission}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                >
                    Enable Motion Controls
                </button>
            </div>
        );
    }

    if (isCalibrating) {
        return <CalibrationScreen />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {showFeedback ? (
                <div className="text-center">
                    <h1 className="text-4xl font-bold">
                        {showFeedback === "correct" ? "✅ Correct!" : "❌ Passed!"}
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
                    <p className="text-gray-600">Tilt <strong>down</strong> for ✅, <strong>up</strong> for ❌</p>
                    <p className="mt-4 text-lg font-semibold">Score: {score}</p>
                    {currentRotation !== null && baselineRotation !== null && (
                        <p className="text-sm text-gray-500 mt-2">
                            Tilt: {Math.round(currentRotation - baselineRotation)}°
                        </p>
                    )}
                    <button
                        onClick={startCalibration}
                        className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
                    >
                        Recalibrate Device
                    </button>
                </>
            )}
        </div>
    )
}

export default Game;