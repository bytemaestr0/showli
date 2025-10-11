import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Set proper viewport for mobile
document.documentElement.style.overflow = 'hidden'
document.body.style.overflow = 'auto'
document.body.style.overscrollBehavior = 'none'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
