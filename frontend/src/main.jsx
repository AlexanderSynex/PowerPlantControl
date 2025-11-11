import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PowerControl from './js/PowerControl';
import Auth from './js/Auth';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/auth" element={ <Auth/> } />
        <Route path="/" element={ <PowerControl /> }  />
      </Routes>
    </Router>
  </StrictMode>,
)
