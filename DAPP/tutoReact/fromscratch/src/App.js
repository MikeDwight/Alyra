import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Navigation from "./components/Navigation";

function App() {
  // state


  // comportement


  // affichage
  return (
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='*' element={<Home />}></Route>
        </Routes>
      </BrowserRouter>    
  )

}

export default App;