import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import tailwindcss from 'tailwindcss'
import './App.css'
import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import CountryDetail from "./pages/CountryDetail";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
       <Route path="/country/:code" element={<CountryDetail />} />
    </Routes>
  )
}

export default App;
