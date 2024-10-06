import { ContainerDiv, LinkButton, OnClickButton } from "./components"
import { useState } from "react"

export default Game

const cells = 20

function Game() {
  let content
  const [isGame, setIsGame] = useState(false)
  const [fieldBoolList, setFieldBoolList] = useState(Array(cells ** 2).fill())
  const [fieldStateList, setFieldStateList] = useState(Array(cells ** 2).fill(false))

  if (isGame) {
    content = <Board handleUpdateFieldStateList={ onUpdateFieldStateList } fieldStateList={ fieldStateList } fieldBoolList={ fieldBoolList } />
  } else {
    content = <GameInit onInitGame={ handleInitGame } />
  }

  function handleInitGame(difficultyIndex) {
    setFieldBoolList(createFieldBoolList(difficultyIndex))
    setIsGame(!isGame)
  }
  
  function createFieldBoolList(difficultyIndex) {
    const levelList = [
      0.2,// ↑ easy
      0.4,
      0.5,
      0.6,
      0.8,
    ]
    const lebel = levelList[difficultyIndex]
    const newFieldList = Array(cells ** 2).fill().map(() => {
      return Math.random() > lebel
    })

    return newFieldList
  }

  function onUpdateFieldStateList(idx) {
    if (fieldStateList[idx]) return

    const newFieldStateList = [...fieldStateList]
    newFieldStateList[idx] = true
    
    setFieldStateList(newFieldStateList)
  }

  return (
    <ContainerDiv addClass="content">
      <GameHeader />
      { content }
    </ContainerDiv>
  )
}

function GameHeader() {
  return (
    <ContainerDiv addClass="game-header">
      nonogram建設中・・・
      <a href="/">ホームへ戻る</a><br/>
      <SettingsButton />
      <RestartButton />
      <GameEndView />
    </ContainerDiv>
  )
}

function SettingsButton() {
  return <LinkButton href="/">設定ページ</LinkButton>
}

function RestartButton() {
  return <OnClickButton onClick={ () => {} }>もう一度！</OnClickButton>
}

function GameEndView() {
  return "game is end"
}

function GameInit({ onInitGame }) {
  const buttonTitles = ["簡単", "普通", "熟練", "鬼畜", "運ゲー"]
  const childrenList = Array(5).fill().map((val, idx) => {
    return (
      <OnClickButton  key={ idx } onClick={ () => onInitGame(idx) }>
        { buttonTitles[idx] }
      </OnClickButton>
    )
  })

  return (
    <ContainerDiv addClass="game-init">
      <Instructions />
      <ContainerDiv addClass="difficulty">
        { childrenList }
      </ContainerDiv>
    </ContainerDiv>
  )
}

function Instructions() {
  return (
    <p>
      ・・・<br/>
       説明は以上です<br/>
       難易度を選択してください！
    </p>
  )
}

function Board({ handleUpdateFieldStateList, fieldStateList, fieldBoolList }) {
  return (
    <ContainerDiv addClass="board">
      <ContainerDiv addClass="board-top">
        <ContainerDiv addClass="board-navi">
          <LifeView />
          <MarkView />
          <TimeView />
        </ContainerDiv>
        <LabelContainer className="row" />
      </ContainerDiv>
      <ContainerDiv addClass="board-buttom">
        <LabelContainer className="column" />
        <CellContainer className="cell-container" handleUpdateFieldStateList={ handleUpdateFieldStateList } fieldStateList={ fieldStateList } fieldBoolList={ fieldBoolList } />
      </ContainerDiv>
    </ContainerDiv>
  )
}

function LifeView() {
  return (
    <ContainerDiv addClass="life">
      ♥がなくなるとゲームオーバー！<br/>
      ♥♥♥♥♥
    </ContainerDiv>
  )
}

function MarkView() {
  return (
    <ContainerDiv addClass="choice">
      現在〇を使用中
      <OnClickButton className="change-choice">
        切り替え
      </OnClickButton>
    </ContainerDiv>
  )
}

function TimeView() {
  const time = Date.now().toString() + " sec"
  return time
}

function LabelContainer({ className }) {
  const labelList = Array(cells).fill().map((val, idx) => {
    return <Label key={ idx } />
  })

  return (
    <ContainerDiv addClass={ className }>
      { labelList }
    </ContainerDiv>
  )
}

function Label() {
  return (
    <ContainerDiv addClass="label">
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>10</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
    </ContainerDiv>
  )
}

function CellContainer({ className, handleUpdateFieldStateList, fieldStateList, fieldBoolList }) {
  const cellList = Array(cells ** 2).fill().map((val, idx) => {
    let cellClassName = "cell"
    let children = ""
    if (fieldStateList && fieldStateList[idx]) {
      if (fieldBoolList[idx]) cellClassName += " pushed-true"
      if (!fieldBoolList[idx]) children = "✕"
    }

    return <Cell key={ idx } cellClassName={ cellClassName } handleClickCell={ () => onCellClick(idx) }>
      { children }
    </Cell>
  })
  
  function onCellClick(idx) {
    handleUpdateFieldStateList(idx)
  }
  
  return (
    <ContainerDiv addClass={ className }>
      { cellList }
    </ContainerDiv>
  )
}

function Cell({ cellClassName, handleClickCell, children }) {
  return (
    <button className={ cellClassName } onClick={ handleClickCell }>
      { children }
    </button>
  )
}

