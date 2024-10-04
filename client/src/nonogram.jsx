import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./css/nonogram.css";



const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Game />
  </StrictMode>
);


function Game() {
  return (
    <div className="game">
      <GameHeader />
      <GameInit />
      <Board />
    </div>
  );
}


function GameHeader() {
  return "header";
}


function LifeView() {
  return {};
}

function MarkView() {
  return {};
}

function TimeView() {
  return {};
}


function SettingsButton() {
  // component
}


function RestartButton() {
  // component
}


function GameEndView() {
  return {};
}


function GameInit() {
  const result = <h2>"gameinit"</h2>;
  console.log(result);
  return result;
}


function DifficultyButton() {
  // component
}


function Instructions() {
  return {};
}


function Board() {
  return "board";
}


function LabelContainer() {
  return {};
}


function Label() {
  return {};
}


function CellContainer() {
  return {};
}


function Cell() {
  return {};
}

