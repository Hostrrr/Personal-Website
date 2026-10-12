import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import './styles/apple-theme.css'
import App from './App.jsx'
import DemoShell from './demos/DemoShell.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/demos/:slug" element={<DemoShell />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
