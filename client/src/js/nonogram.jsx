import { ContainerDiv, LinkButton, OnClickButton, HeartMark } from "./components"
import { useState } from "react"

export default Game

const CELLS = 20
const TRUE = 1
const FALSE = -1
const CHOICED_TRUE = 2
const CHOICED_FALSE = -2
const NUL_STATE = 0
const ROW = 0
const COLUMN = 1
const MAX_LIFE_POINT = 5
const COUNT_STOP_TIME = 9999

function Game() {
  /* フィールドの構造
  0  1  2...  |CELLS==20
  20 21 22
  .
  .
  380......CELLS**2-1
  -----------------*/
  let content
  const [isGame, setIsGame] = useState(false)
  // -2, -1, 1, 2の値で状態とあたり判定を管理
  const [fieldStateList, setFieldStateList] = useState(Array(CELLS ** 2))
  // row, column 連続数を保持
  const [labelsCountList, setLabelsCountList] = useState()
  // row, column trueの開始位置を保持
  const [labelsBoolIndex, setLabelsBoolIndex] = useState()
  const [currentLifePoint, setCurrentLifePoint] = useState(MAX_LIFE_POINT)
  const [gameEnd, setGameEnd] = useState(false)
  const [choice, setChoice] = useState(TRUE)
  const [currentTime, setCurrentTime] = useState(0)

// ------------------------init専用------------------------------
  function handleInitGame(difficultyIndex) {
    startTimer()
    const newFieldStateList = createFieldStateList(difficultyIndex)
    const updatedFieldStateList = tryFillingAllColumns(newFieldStateList)

    updateField(updatedFieldStateList)
  }

  function startTimer() {
    const startTime = Date.now()
    let elapsedTime
    const timeoutId = setInterval(() => {
      elapsedTime = Date.now() - startTime
      setCurrentTime(elapsedTime)
      if (elapsedTime > COUNT_STOP_TIME * 1000) clearInterval(timeoutId)
    }, 1000)
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
    const newFieldList = Array(CELLS ** 2).fill().map(() => {
      return Math.random() > lebel ? TRUE : FALSE
    })

    return newFieldList
  }
  
  function makeCountList(newFieldStateList) {
    const countList = [[], []]
    for (let i=0; i<2; i++) {
      for (let j=0; j<CELLS; j++) {
        countList[i].push(getCountInColumn(newFieldStateList, i, j))
      }
    }
    
    return countList
  }
  
  function makeLabelsBoolIndexList(newFieldStateList) {
    // 開始位置を保持する配列を初期化
    const countList = [
      Array(CELLS).fill().map(() => []),
      Array(CELLS).fill().map(() => [])
    ]

    let isConcatRow = false
    let isConcatColumn = false
    for (let i=0; i<CELLS; i++) {
      for (let j=0; j<CELLS; j++) {
        const cellRow = newFieldStateList[CELLS * j + i]
        if (!isConcatRow && cellRow > NUL_STATE) {
          countList[ROW][i].push(j)
          isConcatRow = true
        } else if (isConcatRow && cellRow < NUL_STATE){
          isConcatRow = false
        }
        
        const cellColumn = newFieldStateList[CELLS * i + j]
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
    for (let i=0; i<CELLS; i++) {
      const fldIdx = CELLS * i + i
      updatedFieldStateList = updateFieldStateList(fldIdx, updatedFieldStateList)
    }

    return updatedFieldStateList
  }
// -------------------init専用ここまで-------------------------------
  function getCountInColumn(newFieldStateList, isRow, colIdx) {
    const result = []
    let count = 0
    let fldIdx
    for (let k=0; k<CELLS; k++) {
      if (isRow == ROW) {// rowは左からj行目
        fldIdx = CELLS * k + colIdx
      } else {// columnは上からj列目
        fldIdx = CELLS * colIdx + k
      }
      if (newFieldStateList[fldIdx] > NUL_STATE) {
        count++
      } else {
        if (count) {
          result.push(count)
          count = 0
        }
      }
      if (k == CELLS - 1 && count) result.push(count)
    }
    
    return result
  }

  function onUpdateFieldStateList(fldIdx) {
    if (gameEnd) return
    const isLifeDamaged = isGame && isCellMisstake(fldIdx)
    const updatedFieldStateList = updateFieldStateList(fldIdx)
    updateField(updatedFieldStateList, isLifeDamaged)
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
    let colIdx = isRow == ROW ? fldIdx % CELLS : Math.floor(fldIdx / CELLS)
    const checkArray = isRow == ROW ? [] : newFieldStateList.slice(colIdx * CELLS, (colIdx + 1) * CELLS)
    if (isRow == ROW) {
      for (let i=0; i<CELLS; i++) {
        checkArray.push(newFieldStateList[CELLS * i + colIdx])
      }
    }

    return checkArray.includes(TRUE)
  }

  function fillEmptyField(newFieldStateList, isRow, fldIdx) {
    let colIdx = isRow == ROW ? fldIdx % CELLS : Math.floor(fldIdx / CELLS)
    const updatedFieldStateList = [...newFieldStateList]
    for (let i=0; i<CELLS; i++) {
      const cellIdx = isRow == ROW ? CELLS * i + colIdx : CELLS * colIdx + i
      if (newFieldStateList[cellIdx] == FALSE) updatedFieldStateList[cellIdx] = CHOICED_FALSE
    }

    return updatedFieldStateList
  }

  function isCellMisstake(fldIdx) {
    switch (fieldStateList[fldIdx]) {
      case CHOICED_FALSE:
      case CHOICED_TRUE:
        return false
      case TRUE:
        return choice == FALSE
      case FALSE:
        return choice == TRUE
    }
  }

  function onChangeChoice() {
    if (gameEnd) return
    setChoice(choice == TRUE ? FALSE : TRUE)
  }

// setを行う
  function updateField(newFieldStateList, isLifeDamaged = false) {
    setFieldStateList(newFieldStateList)
    if (isLifeDamaged && currentLifePoint <= 1) setGameEnd(true)
    if (isLifeDamaged) setCurrentLifePoint(currentLifePoint - 1)

    if (isGame) return
    setLabelsCountList(makeCountList(newFieldStateList))
    setLabelsBoolIndex(makeLabelsBoolIndexList(newFieldStateList))
    setIsGame(true)
  }


  if (isGame) {
    content = <Board handleUpdateFieldStateList={ onUpdateFieldStateList } fieldStateList={ fieldStateList } labelsCountList={ labelsCountList } labelsBoolIndex={ labelsBoolIndex } currentLifePoint={ currentLifePoint } gameEnd={ gameEnd } choice={ choice } handleChangeChoice={ onChangeChoice } currentTime={ currentTime } />
  } else {
    content = <GameInit onInitGame={ handleInitGame } />
  }


  const gameEndView = gameEnd ? (
    <ContainerDiv addClass="game-end">
      <GameEndView />
    </ContainerDiv>
  ) : null

  return (
    <>
      { gameEndView }
      <ContainerDiv addClass="content">
        <GameHeader />
        {/* <button onClick={ () => console.log(labelsCountList, labelsBoolIndex) } className="debug" ></button> */}
        { content }
      </ContainerDiv>
    </>
  )
}

function GameHeader() {
  return (
    <ContainerDiv addClass="game-header">
      nonogram建設中・・・
      <a href="/">ホームへ戻る</a><br/>
      <SettingsButton />
      <RestartButton />
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
  return (
    <>
      <p className="game-end-text">
        game over!
        </p>
      <p className="game-end-info">
        結果の確認と再チャレンジは
        </p>
      <img src="/images/Arrow.png" className="game-end-logo"></img>
    </>
  )
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

function Board({ handleUpdateFieldStateList, fieldStateList, labelsCountList, currentLifePoint, choice, handleChangeChoice, currentTime }) {
  return (
    <ContainerDiv addClass="board">
      <ContainerDiv addClass="board-top">
        <ContainerDiv addClass="board-navi">
          <LifeView currentLifePoint={ currentLifePoint } />
          <MarkView choice={ choice } handleChangeChoice={ handleChangeChoice } />
          <TimeView currentTime={ currentTime } />
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

function LifeView({ currentLifePoint }) {
  const lifePointList = Array(MAX_LIFE_POINT).fill().map((val, idx) => {
    const addClass = currentLifePoint <= idx ? "damaged" : ""
    return <HeartMark key={ idx } addClass={ addClass } />
  })
  return (
    <>
      <p>
        残りライフ
      </p>
      <ContainerDiv addClass="life">
        { lifePointList }
      </ContainerDiv>
    </>
  )
}

function MarkView({ choice, handleChangeChoice }) {
  const choicedView = choice == TRUE ? "〇" : "✕"
  return (
    <ContainerDiv addClass="choice">
      <p>
        { choicedView }を選択中
      </p>
      <OnClickButton className="change-choice" onClick={ handleChangeChoice }>
        切り替え
      </OnClickButton>
    </ContainerDiv>
  )
}

function TimeView({ currentTime }) {
  return (
    <ContainerDiv addClass="time-view">
      <p>
        { Math.floor(currentTime / 1000) } 秒経過
      </p>
      Bestは9999 秒
    </ContainerDiv>
  )
}

function LabelContainer({ className, labelsCountList }) {
  const labelList = Array(CELLS).fill().map((val, idx) => {
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
  const cellList = Array(CELLS ** 2).fill().map((val, idx) => {
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

