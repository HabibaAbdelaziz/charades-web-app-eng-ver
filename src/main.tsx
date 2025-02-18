import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx' //Ropt component
import { BrowserRouter } from 'react-router-dom'

// Entry point of the React app (root of the React component tree is created and connected to the HTML)
// main.tsx is used only once to bootstrap the application
// BrowserRouter is used to enable routing throughout the app
// StrictMode is for highlighting potential problems in development
// main.tsx should wrap App with <BrowserRouter> to enable routing, but should not contain any routing logic itself.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
