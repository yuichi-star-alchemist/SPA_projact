import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import Game from "./js/nonogram.jsx"
import "./css/nonogram.css"



const root = createRoot(document.getElementById("root"))
root.render(
  <StrictMode>
    <Game />
  </StrictMode>
)
