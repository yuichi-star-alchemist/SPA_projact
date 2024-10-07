import { ContainerDiv, LinkButton, OnClickButton } from "./components"
import { useState } from "react"

export default Game

const cells = 20

function Game() {
  let content
  /* フィールドの構造
  0  1  2...  |cells==20
  20 21 22
  .
  .
  380......cells**2-1
  -----------------*/
  const [isGame, setIsGame] = useState(false)
  // 当たり判定を保持
  const [fieldBoolList, setFieldBoolList] = useState(Array(cells ** 2).fill())
  // クリックフラグを保持
  const [fieldStateList, setFieldStateList] = useState(Array(cells ** 2).fill(false))
  // row, column 連続数を保持
  const [labelsCountList, setLabelsCountList] = useState()
  // row, column trueの開始位置を保持
  const [labelsBoolIndex, setLabelsBoolIndex] = useState()

  if (isGame) {
    content = <Board handleUpdateFieldStateList={ onUpdateFieldStateList } fieldStateList={ fieldStateList } fieldBoolList={ fieldBoolList } labelsCountList={ labelsCountList } labelsBoolIndex={ labelsBoolIndex } />
  } else {
    content = <GameInit onInitGame={ handleInitGame } />
  }

  function handleInitGame(difficultyIndex) {
    const newFieldBoolList = createFieldBoolList(difficultyIndex)
    setFieldBoolList(newFieldBoolList)
    setLabelsCountList(makeCountList(newFieldBoolList))
    setLabelsBoolIndex(makeLabelsBoolIndexList(newFieldBoolList))
    setIsGame(true)
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

  function getCountInColumn(newFieldBoolList, i, j) {
    const result = []
    let count = 0
    let idx
    for (let k=0; k<cells; k++) {
      if (i == 0) {// rowは左からj行目
        idx = cells * k + j
      } else {// columnは上からj列目
        idx = cells * j + k
      }
      if (newFieldBoolList[idx]) {
        count++
      } else {
        if (count) {
          result.push(count)
          count = 0
        }
      }
      if (k == cells - 1 && count) result.push(count)
    }
    
    return result
  }

  function makeCountList(newFieldBoolList) {
    const countList = [[], []]
    for (let i=0; i<2; i++) {
      for (let j=0; j<cells; j++) {
        countList[i].push(getCountInColumn(newFieldBoolList, i, j))
      }
    }

    return countList
  }

  function makeLabelsBoolIndexList(newFieldBoolList) {
    // 開始位置を保持する配列を初期化
    const countList = [
      Array(cells).fill().map(() => []),
      Array(cells).fill().map(() => [])
    ]

    let isConcatRow = false
    let isConcatColumn = false
    for (let i=0; i<cells; i++) {
      for (let j=0; j<cells; j++) {
        const cellRow = newFieldBoolList[cells * j + i]
        if (!isConcatRow && cellRow) {
          countList[0][i].push(j)
          isConcatRow = true
        } else if (isConcatRow && !cellRow){
          isConcatRow = false
        }
        
        const cellColumn = newFieldBoolList[cells * i + j]
        if (!isConcatColumn && cellColumn) {
          countList[1][i].push(j)
          isConcatColumn = true
        } else if (isConcatColumn && !cellColumn){
          isConcatColumn = false
        }
      }
    }

    return countList
  }

  function onUpdateFieldStateList(idx) {
    if (fieldStateList[idx]) return

    const newFieldStateList = [...fieldStateList]
    newFieldStateList[idx] = true
    
    setFieldStateList(newFieldStateList)
  }

  function checkIsTrueInColumn() {
    // 渡されたindexの1列の中にtrueがあるかどうかの判定を返す
    return
  }



  return (
    <ContainerDiv addClass="content">
      <GameHeader />
      {/* <button onClick={ () => console.log(labelsCountList, labelsBoolIndex) } className="debug" ></button> */}
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
  return <OnClickButton className="restart" onClick={ () => {} }>もう一度！</OnClickButton>
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

function Board({ handleUpdateFieldStateList, fieldStateList, fieldBoolList, labelsCountList }) {
  return (
    <ContainerDiv addClass="board">
      <ContainerDiv addClass="board-top">
        <ContainerDiv addClass="board-navi">
          <LifeView />
          <MarkView />
          <TimeView />
        </ContainerDiv>
        <LabelContainer className="row" labelsCountList={ labelsCountList } />
      </ContainerDiv>
      <ContainerDiv addClass="board-buttom">
        <LabelContainer className="column" labelsCountList={ labelsCountList } />
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

function LabelContainer({ className, labelsCountList }) {
  const labelList = Array(cells).fill().map((val, idx) => {
    return <Label key={ idx } labelCountList={ makeLabelCountList(idx) } />
  })

  function makeLabelCountList(idx) {
    const isRow = className == "row" ? 0 : 1
    return [...labelsCountList[isRow][idx]].reverse()
  }

  return (
    <ContainerDiv addClass={ className }>
      { labelList }
    </ContainerDiv>
  )
}

function Label({ labelCountList }) {
  const labelCount = labelCountList.map((val, idx) => {
    return <div key={ idx }>{ val }</div>
  })

  return (
    <ContainerDiv addClass="label">
      { labelCount }
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

    return <Cell key={ idx } cellClassName={ cellClassName } handleClickCell={ () => handleUpdateFieldStateList(idx) }>
      { children }
    </Cell>
  })
  
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

