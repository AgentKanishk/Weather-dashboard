import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Providers } from './components/provider' 
import Home from '@/pages/Home'
import History from '@/pages/History'
import './App.css'

function App() {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </Providers>
  )
}

export default App