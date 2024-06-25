import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Layout from "./components/layout/Layout"
import Reviews from "./pages/Reviews"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="/overview" element={<Home/>}/>
        <Route path="/reviews" element={<Reviews/>}/>
        <Route path="/search" element={<Home/>}/>
        <Route path="/bookmark" element={<Home/>}/>
        <Route path="/billing" element={<Home/>}/>
        <Route path="/feedback" element={<Home/>}/>
        <Route path="/terms-and-conditions" element={<Home/>}/>
        <Route path="/settings" element={<Home/>}/>
        <Route path="/profile" element={<Home/>}/>
        <Route path="/logout" element={<Home/>}/>
      </Route>
    </Routes>
  )
}

export default App
