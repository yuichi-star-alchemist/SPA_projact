"use strict";

{
  const board = document.getElementById("board");
  let cells = 10;
  const TRUE = 1,
    choicedTRUE = 2,
    FALSE = -1,
    choicedFALSE = -2;
  let data = [];
  let life = 3;
  let difficult = 0.5;//0～1 0.5が半々 0に近づくとfalseが増えるので難しくなる
  document.querySelectorAll("#gamestart li").forEach((el, index) => {
    el.onclick = () => { start(index); };
  });
  const choice = document.getElementById("choice");
  choice.onclick = choiced;
  let choiceNow = true;

  function init() {
    const navi = document.getElementById("navi");
    const naviR = document.createElement("div");
    const naviC = document.createElement("div");
    naviR.className = "naviR";
    naviC.className = "naviC";
    navi.appendChild(naviR);
    navi.appendChild(naviC);
    const ul = document.createElement("ul");
    document.getElementsByClassName("life")[0].appendChild(ul);
    for (let i=0; i<=life-1; i++) {
      ul.appendChild(document.createElement("li")).textContent = "♥";
    }
    for (let i=0; i<=cells - 1; i++) {
      const navir = document.createElement("div");
      navir.className = ("navir");
      naviR.appendChild(navir);

      const navic = document.createElement("div");
      navic.className = ("navic");
      naviC.appendChild(navic);

      const tr = document.createElement("tr");
      board.appendChild(tr);

      data[i] = Array(cells).fill(1);

      for (let j=0; j<=cells - 1; j++) {
        const td = document.createElement("td");
        const cell = document.createElement("div");
        tr.appendChild(td);
        td.appendChild(cell);
        td.className = "cell";
        td.onclick = clicked;
      }
    }

    countCells();
  }

  function clicked() {
    const y = this.parentNode.rowIndex;
    const x = this.cellIndex;
    switch (data[y][x]) {
      case choicedTRUE:
      case choicedFALSE:
        break;
      case TRUE://後で変更--------------------------------------------------------------------------------------
        data[y][x] = choicedTRUE;//盤面に反映させるデータ
        board.rows[y].cells[x].className = "choicedT";//見た目を変える
        if (!choiceNow && life >= 1) {
          life--;
        }
        break;
      default:
        data[y][x] = choicedFALSE;
        board.rows[y].cells[x].textContent = "×";
        if (choiceNow && life >= 1) {
          life--;
        }
    }

    countCells();
  }

  function choiced() {
    if (choiceNow) {
      choiceNow = false;
      choice.className = "choiceF";
      choice.innerHTML = "ここをクリックするとマス塗りと×が切り替わります！<br><span>×</span>";
    } else {
      choiceNow = true;
      choice.className = "choiceT";
      choice.innerHTML = "ここをクリックするとマス塗りと×が切り替わります！<br><span>■</span>";
    }
  }

  function countCells() {
    const navir = document.querySelectorAll(".navir");
    const navic = document.querySelectorAll(".navic");
    for (let i=0; i<=cells-1; i++) {//行の処理----------------------------------------------------------------
      let count = 0;
      let countCell = [];
      let countHide = [];
      let k,
        isLeft,
        isRight;
      
      for (let j=0; j<=cells-1; j++) {
        if (data[i][j] === TRUE || data[i][j] === choicedTRUE) {
          count++;
        } else {
          if(count !== 0) {
            countCell.push(count);
            count = 0;
          }
        }
      }
      if(count !== 0) {
        countCell.push(count);
        count = 0;
      }

      for (let j=0; j<=cells-1; j++) {
        if (data[i][j] === TRUE) {
          //TRUEを見つけたマスから左方向の処理がここから TRUEは左だけで判定できる
          k = j;
          while (true) {
            k--;
            if (k >= 0) {//jが左端のマスでなければ
              if (data[i][k] === choicedTRUE) {
                continue;
              } else
              if (data[i][k] === TRUE) {
                break;
              } else
              if (data[i][k] === FALSE || data[i][k] === choicedFALSE) {
                isLeft = false;
                break;
              } else {
                console.log("error!");
                break;
              }
            } else {
              isLeft = false;
              break;
            }
          }
          //---------------------------------------------ここまで
          isRight = false;
        }
        if (data[i][j] === choicedTRUE) {
          //choicedTRUEを見つけたマスから左方向の処理がここから
          k = j;
          while (true) {
            k--;
            if (k >= 0) {//jが左端のマスでなければ
              if (data[i][k] === choicedTRUE || data[i][k] === TRUE) {
                break;
              } else
              if (data[i][k] === FALSE || data[i][k] === choicedFALSE) {
                isLeft = true;
                break;
              } else {
                console.log("error!");
                break;
              }
            } else {
              isLeft = true;
              break;
            }
          }
          //---------------------------------------------ここまで
          //choicedTRUEを見つけたマスから右方向の処理がここから
          k = j;
          while (true) {
            k++;
            if (k <= cells - 1) {//jが右端のマスでなければ
              if (data[i][k] === choicedTRUE) {
                continue;
              } else
              if (data[i][k] === TRUE) {
                break;
              } else
              if (data[i][k] === FALSE || data[i][k] === choicedFALSE) {
                isRight = true;
                break;
              } else {
                console.log("error!");
                break;
              }
            } else {
              isRight = true;
              break;
            }
          }
          //---------------------------------------------ここまで
        }
        if (isLeft && isRight) {
          countHide.push(true);
        }
        if (isLeft === false && isRight === false) {
          countHide.push(false);
        }
        isLeft = undefined;
        isRight = undefined;
      }
  
      let html = "";
      if (countCell.length > 0 && countHide.length > 0) {
        countCell.forEach((value, index) => {
          if (countHide[index] === false) {
            html += '<span>' + value + '</span>';
          } else
          if (countHide[index] === true) {
            html += '<span class="hide">' + value + '</span>';
          }
        });
        navir[i].innerHTML = html;
      }

      if (countHide.every((value) => value === true)) {
        for (let j=0; j<=cells-1;j++) {
          if (data[i][j] === FALSE) {
            data[i][j] = choicedFALSE;
            board.rows[i].cells[j].textContent = "×";
            board.rows[i].cells[j].animate(
              { opacity: [0.5, 1] },
              { duration: 400, fill: "forwards" }
            )
          }
        }
      }
      countCell = [];
      countHide = [];
    }
    
    //列の処理-------------------------------------------------------
    for (let j=0; j<=cells-1; j++) {
      let count = 0;
      let countCell = [];
      let countHide = [];
      let k,
        isLeft,
        isRight;
      
      for (let i=0; i<=cells-1; i++) {
        if (data[i][j] === TRUE || data[i][j] === choicedTRUE) {
          count++;
        } else {
          if(count !== 0) {
            countCell.push(count);
            count = 0;
          }
        }
      }
      if(count !== 0) {
        countCell.push(count);
        count = 0;
      }

      for (let i=0; i<=cells-1; i++) {
        if (data[i][j] === TRUE) {
          //TRUEを見つけたマスから上方向の処理がここから TRUEは上だけで判定できる(上=左)
          k = i;
          while (true) {
            k--;
            if (k >= 0) {//jが上端のマスでなければ
              if (data[k][j] === choicedTRUE) {
                continue;
              } else
              if (data[k][j] === TRUE) {
                break;
              } else
              if (data[k][j] === FALSE || data[k][j] === choicedFALSE) {
                isLeft = false;
                break;
              } else {
                console.log("error!");
                break;
              }
            } else {
              isLeft = false;
              break;
            }
          }
          //---------------------------------------------ここまで
          isRight = false;
        }
        if (data[i][j] === choicedTRUE) {
          //choicedTRUEを見つけたマスから上方向の処理がここから
          k = i;
          while (true) {
            k--;
            if (k >= 0) {//iが上端のマスでなければ
              if (data[k][j] === choicedTRUE || data[k][j] === TRUE) {
                break;
              } else
              if (data[k][j] === FALSE || data[k][j] === choicedFALSE) {
                isLeft = true;
                break;
              } else {
                console.log("error!");
                break;
              }
            } else {
              isLeft = true;
              break;
            }
          }
          //---------------------------------------------ここまで
          //choicedTRUEを見つけたマスから下方向の処理がここから
          k = i;
          while (true) {
            k++;
            if (k <= cells - 1) {//jが下端のマスでなければ
              if (data[k][j] === choicedTRUE) {
                continue;
              } else
              if (data[k][j] === TRUE) {
                break;
              } else
              if (data[k][j] === FALSE || data[k][j] === choicedFALSE) {
                isRight = true;
                break;
              } else {
                console.log("error!");
                break;
              }
            } else {
              isRight = true;
              break;
            }
          }
          //---------------------------------------------ここまで
        }
        if (isLeft && isRight) {
          countHide.push(true);
        }
        if (isLeft === false && isRight === false) {
          countHide.push(false);
        }
        isLeft = undefined;
        isRight = undefined;
      }
  
      let html = "";
      if (countCell.length > 0 && countHide.length > 0) {
        countCell.forEach((value, index) => {
          if (countHide[index] === false) {
            html += '<span>' + value + '</span>';
          } else
          if (countHide[index] === true) {
            html += '<span class="hide">' + value + '</span>';
          }
        });
        navic[j].innerHTML = html;
      }

      if (countHide.every((value) => value === true)) {
        for (let i=0; i<=cells-1;i++) {
          if (data[i][j] === FALSE) {
            data[i][j] = choicedFALSE;
            board.rows[i].cells[j].textContent = "×";
            board.rows[i].cells[j].animate(
              { opacity: [0.5, 1] },
              { duration: 400, fill: "forwards" }
            )
          }
        }
      }
      countCell = [];
      countHide = [];
    }
    
    checkBoard();
  }
  
  function checkBoard() {
    const lifeLi = document.querySelectorAll('.life li');
    if (life >= 0 && life <= lifeLi.length - 1) {
      for (let i=0; i<=lifeLi.length-1-life; i++) {
        // lifeLi[lifeLi.length - 1- i].classList.add('damaged');
        lifeLi[lifeLi.length - 1- i].setAttribute("id", "damaged");
      }
    }

    const gameend = document.getElementById("gameend");
    if (life === 0) {
      gameend.style.zIndex = 2;
    }

    const result = [];
    for (let i=0; i<=cells-1; i++) {
      result.push(data[i].includes(TRUE));
    }
    if (!result.includes(true)) {
      gameend.style.zIndex = 2;
      gameend.innerHTML = 'Game Clear !!!<br><span onclick="location.reload()">もう一度</span>';
    }
  }

  function start(index) {
    document.getElementById("gamestart").style.zIndex = -1;
    switch (index) {
      case 0:
        difficult = 0.8;
        break;
      case 1:
        difficult = 0.6;
        break;
      case 2:
        difficult = 0.3;
        break;
      default:
        break;
    }
    
    for (let i=0; i<=cells - 1; i++) {
      for (let j=0; j<=cells - 1; j++) {
        if (Math.random() > difficult) {
          data[i][j] = FALSE;
        } else {
          data[i][j] = TRUE;
        }
      }
    }

    countCells();
  }
  //カウントの調整

  init();

}