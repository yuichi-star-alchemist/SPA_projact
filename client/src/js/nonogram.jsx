import { ContainerDiv, LinkButton, OnClickButton } from "./components";

export default Game

function Game() {
  let content;
  let isGame = true;
  isGame = false;

  if (isGame) {
    content = <Board />
  } else {
    content = <GameInit />
  }

  return (
    <ContainerDiv addClass="content">
      <GameHeader />
      { content }
    </ContainerDiv>
  );
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

function GameInit() {
  const buttonTitles = ["簡単", "普通", "熟練", "鬼畜", "運ゲー"]
  const childrenList = Array(5).fill().map((val, idx) => {
    return (
      <OnClickButton  key={ idx } onClick={ () => handleClick(idx) }>
        { buttonTitles[idx] }
      </OnClickButton>
    )
  })

  function handleClick(idx) {
    console.log(idx)
  }

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

function Board() {
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
        <CellContainer className="cell-container" />
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
  const time = Date.now().toString() + " sec";
  return time;
}

function LabelContainer({ className }) {
  const labelList = Array(20).fill().map((val, idx) => {
    return <Label key={ idx } />
  });

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

function CellContainer({ className }) {
  const cellList = Array(20 ** 2).fill().map((val, idx) => {
    return <Cell key={ idx } onClick={ () => cellClick(idx) }/>
  });
  
  return (
    <ContainerDiv addClass={ className }>
      { cellList }
    </ContainerDiv>
  )
}

function Cell({ onClick }) {
  return (
    <button className="cell" onClick={ onClick }>x</button>
  )
}

function cellClick(idx) {
  console.log(idx)
}
