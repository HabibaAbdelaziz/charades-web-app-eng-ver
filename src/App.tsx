import React from 'react'
import './App.css'
import {Routes, Route} from 'react-router-dom';
import Home from './pages/HomePage';
import Game from './pages/GamePage';

//App.tsx is the Root Component where the main layout and routing logic are defined.
// It defines the structure and navigation of the app
// Contains the page routing using React Router.
// Serves as a container for all other components and pages
// Where it is used? As the top-level componenet that wraps all the other components.
// App.tsx should include the routing logic using React Router (<Routes> and <Route> components),
// NOT main.tsx. main.tsx should wrap App with <BrowserRouter> to enable routing, but should not contain any routing logic itself.

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:category" element={<Game />} />
    </Routes>
  )
}
export default App
