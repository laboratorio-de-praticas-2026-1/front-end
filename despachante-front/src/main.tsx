import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Importando a Montserrat nos pesos principais
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css'; // Normal
import '@fontsource/montserrat/500.css'; // Medium
import '@fontsource/montserrat/600.css'; // Semi-bold
import '@fontsource/montserrat/700.css'; // Bold
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
