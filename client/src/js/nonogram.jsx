import { ContainerDiv, LinkButton, OnClickButton } from "./components"
import { useState } from "react"

export default Game

const cells = 20
const TRUE = 1
const FALSE = -1
const CHOICED_TRUE = 2
const CHOICED_FALSE = -2
const NUL_STATE = 0
const ROW = 0
const COLUMN = 1

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
  // -2, -1, 1, 2の値で状態とあたり判定を管理
  const [fieldStateList, setFieldStateList] = useState(Array(cells ** 2))
  // row, column 連続数を保持
  const [labelsCountList, setLabelsCountList] = useState()
  // row, column trueの開始位置を保持
  const [labelsBoolIndex, setLabelsBoolIndex] = useState()

  if (isGame) {
    content = <Board handleUpdateFieldStateList={ onUpdateFieldStateList } fieldStateList={ fieldStateList } labelsCountList={ labelsCountList } labelsBoolIndex={ labelsBoolIndex } />
  } else {
    content = <GameInit onInitGame={ handleInitGame } />
  }
// ------------------------init専用------------------------------
  function handleInitGame(difficultyIndex) {
    const newFieldStateList = createFieldStateList(difficultyIndex)
    const updatedFieldStateList = tryFillingAllColumns(newFieldStateList)

    updateField(updatedFieldStateList)
  }
  
  function createFieldStateList(difficultyIndex) {
    const levelList = [
      0.2,// ↑ easy
      0.4,
      0.6,
      0.7,
      0.8,
    ]
    const lebel = levelList[difficultyIndex]
    const newFieldList = Array(cells ** 2).fill().map(() => {
      return Math.random() > lebel ? TRUE : FALSE
    })

    return newFieldList
  }
  
  function makeCountList(newFieldStateList) {
    const countList = [[], []]
    for (let i=0; i<2; i++) {
      for (let j=0; j<cells; j++) {
        countList[i].push(getCountInColumn(newFieldStateList, i, j))
      }
    }
    
    return countList
  }
  
  function makeLabelsBoolIndexList(newFieldStateList) {
    // 開始位置を保持する配列を初期化
    const countList = [
      Array(cells).fill().map(() => []),
      Array(cells).fill().map(() => [])
    ]

    let isConcatRow = false
    let isConcatColumn = false
    for (let i=0; i<cells; i++) {
      for (let j=0; j<cells; j++) {
        const cellRow = newFieldStateList[cells * j + i]
        if (!isConcatRow && cellRow > NUL_STATE) {
          countList[ROW][i].push(j)
          isConcatRow = true
        } else if (isConcatRow && cellRow < NUL_STATE){
          isConcatRow = false
        }
        
        const cellColumn = newFieldStateList[cells * i + j]
        if (!isConcatColumn && cellColumn > NUL_STATE) {
          countList[COLUMN][i].push(j)
          isConcatColumn = true
        } else if (isConcatColumn && cellColumn < NUL_STATE){
          isConcatColumn = false
        }
      }
    }
    
    return countList
  }

  function tryFillingAllColumns(newFieldStateList) {
    let updatedFieldStateList = [...newFieldStateList]
    for (let i=0; i<cells; i++) {
      const fldIdx = cells * i + i
      updatedFieldStateList = updateFieldStateList(fldIdx, updatedFieldStateList)
    }

    return updatedFieldStateList
  }
// -------------------init専用ここまで-------------------------------
  function getCountInColumn(newFieldStateList, isRow, colIdx) {
    const result = []
    let count = 0
    let fldIdx
    for (let k=0; k<cells; k++) {
      if (isRow == ROW) {// rowは左からj行目
        fldIdx = cells * k + colIdx
      } else {// columnは上からj列目
        fldIdx = cells * colIdx + k
      }
      if (newFieldStateList[fldIdx] > NUL_STATE) {
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

  function onUpdateFieldStateList(fldIdx) {
    const updatedFieldStateList = updateFieldStateList(fldIdx)
    updateField(updatedFieldStateList)
  }

  function updateFieldStateList(fldIdx, previousFieldStateList = fieldStateList) {
    if (previousFieldStateList[fldIdx] == CHOICED_TRUE || previousFieldStateList[fldIdx] == CHOICED_FALSE) return previousFieldStateList

    let updatedFieldStateList = [...previousFieldStateList]
    if (isGame) {
      if (previousFieldStateList[fldIdx] == TRUE) updatedFieldStateList[fldIdx] = CHOICED_TRUE
      if (previousFieldStateList[fldIdx] == FALSE) updatedFieldStateList[fldIdx] = CHOICED_FALSE
    }

    if (!checkIsTrueInColumn(updatedFieldStateList, ROW, fldIdx)) {
      updatedFieldStateList = fillEmptyField(updatedFieldStateList, ROW, fldIdx)
    }
    if (!checkIsTrueInColumn(updatedFieldStateList, COLUMN, fldIdx)) {
      updatedFieldStateList = fillEmptyField(updatedFieldStateList, COLUMN, fldIdx)
    }

    return updatedFieldStateList
  }

  function checkIsTrueInColumn(newFieldStateList, isRow, fldIdx) {
    let colIdx = isRow == ROW ? fldIdx % cells : Math.floor(fldIdx / cells)
    const checkArray = isRow == ROW ? [] : newFieldStateList.slice(colIdx * cells, (colIdx + 1) * cells)
    if (isRow == ROW) {
      for (let i=0; i<cells; i++) {
        checkArray.push(newFieldStateList[cells * i + colIdx])
      }
    }

    return checkArray.includes(TRUE)
  }

  function fillEmptyField(newFieldStateList, isRow, fldIdx) {
    let colIdx = isRow == ROW ? fldIdx % cells : Math.floor(fldIdx / cells)
    const updatedFieldStateList = [...newFieldStateList]
    for (let i=0; i<cells; i++) {
      const cellIdx = isRow == ROW ? cells * i + colIdx : cells * colIdx + i
      if (newFieldStateList[cellIdx] == FALSE) updatedFieldStateList[cellIdx] = CHOICED_FALSE
    }

    return updatedFieldStateList
  }
// setを行う
  function updateField(newFieldStateList) {
    setFieldStateList(newFieldStateList)

    if (isGame) return
    setLabelsCountList(makeCountList(newFieldStateList))
    setLabelsBoolIndex(makeLabelsBoolIndexList(newFieldStateList))
    setIsGame(true)
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

function Board({ handleUpdateFieldStateList, fieldStateList, labelsCountList }) {
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
        <CellContainer className="cell-container" handleUpdateFieldStateList={ handleUpdateFieldStateList } fieldStateList={ fieldStateList } />
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
    const isRow = className == "row" ? ROW : 1
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

function CellContainer({ className, handleUpdateFieldStateList, fieldStateList }) {
  const cellList = Array(cells ** 2).fill().map((val, idx) => {
    let cellClassName = "cell"
    let children = ""
    if (fieldStateList[idx] == CHOICED_TRUE) cellClassName += " pushed-true"
    if (fieldStateList[idx] == CHOICED_FALSE) children = "✕"

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

