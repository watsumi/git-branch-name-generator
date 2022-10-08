import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <header>
      <h2>Branch Name Generator</h2>
    </header>
    <App />
  </React.StrictMode>
)
