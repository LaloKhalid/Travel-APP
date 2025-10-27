
import './App.css'
import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import CountryDetail from "./pages/CountryDetail";

function App() {


  return (
    
    <Routes>
      <Route path="/" element={<Home/>}/>
       <Route path="/country/:code" element={<CountryDetail />} />
    </Routes>
  )
}

export default App;
