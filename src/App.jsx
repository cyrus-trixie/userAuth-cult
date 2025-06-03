import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
function App() {
 return(
  <>
  <Router>
    <Routes>
      <Route path="/" element={<LogIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/home" element={<Home/>}/>
    </Routes>
  </Router>
   
</>
  
  
 
 );
}

export default App
