import { BrowserRouter, Routes, Route } from "react-router-dom"

import React from "react"
import Home from "./pages/Home"
import "./App.css"

const App = () => {
  return (
    <BrowserRouter>
      {/* <Container> */}
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      {/* </Container> */}
    </BrowserRouter>
  )
}

export default App