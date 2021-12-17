function renderBoard(numRows, numCols, grid) {
    let boardEl = document.querySelector("#board");
    for (let i=0; i < numRows; i++) {
        let trEl=document.createElement("tr");
        for (let j=0; j < numCols; j++) {
            let cellEl = document.createElement("div");
            cellEl.className = "cell";
            grid[i][j].cellEl = cellEl;

            if(grid[i][j].count === -1) {
                cellEl.innerText = "*";
            } //else {
                //cellEl.innerText=grid[i][j].count;
            //}

            cellEl.addEventListener("click",(e)=>{

                if (grid[i][j].count === -1){
                    explode(grid,i,j,numRows,numCols)
                    return;
                }
                if (grid[i][j].count === 0) {
                    searchClearArea(grid,i, j,numRows,numCols);
                } else if (grid[i][j].count > 0){
                    grid[i][j].clear = true;
                    cellEl.classList.add("clear");
                    grid[i][j].cellEl.innerText=grid[i][j].count;
                }

                checkAllClear(grid);
                cellEl.classList.add("clear")
            })

            let tdEl=document.createElement("td");
            tdEl.append(cellEl);

            trEl.append(tdEl);
        }
        boardEl.append(trEl);
     }
}

const directions =[            //雷区八个方向
    [-1,-1],[-1,0],[-1,1],    //TL, Top, TR
    [0,-1],[0,1],             //L,R
    [1,-1],[1,0],[1,1]        //BL,Bottom,BR 
]
function initialize(numRows, numCols,numMines) {
    let grid = new Array(numRows);
    for (let i =0;i<numRows;i++) {
        grid[i] = new Array(numCols);
        for (let j=0;j<numCols;j++) {
            grid[i][j] = {
                clear: false,
                count:0
            }
        }
    }

    let mines = [];
    for (let k=0;k < numMines; k++) {
        let cellSn = Math.trunc(Math.random() * numRows * numCols);
        //console.log(cellSn);
        let row = Math.trunc(cellSn / numCols);
        let col = cellSn % numCols;

        //console.log([row,col]);

        grid[row][col].count= -1;
        mines.push([row,col]);
    }

    //计算有雷的周边为零的雷数
    for (let [row, col] of mines) {
        for (let [drow,dcol] of directions) {
            let cellRow = row+ drow;
            let cellCol = col+ dcol;
            if (cellRow <0 || cellRow>=numRows || cellCol <0 ||cellCol>= numCols) {
                continue;
            }
            if (grid[cellRow][cellCol].count === 0) {
                let count = 0;
                for (let [arow,acol] of directions){
                    let ambientRow = cellRow+ arow;
                    let ambientCol = cellCol+ acol;
                    if (ambientRow <0 || ambientRow>=numRows || ambientCol <0 ||ambientCol>= numCols) {
                        continue;
                    }
                    //console.log("zz: ",ambientRow,ambientCol);
                    if(grid[ambientRow][ambientCol].count === -1) {
                        count += 1;
                    }
                }

                if (count > 0) {
                    grid[cellRow][cellCol].count = count;
                }
            }
            //console.log(row,col,row+ drow,col+ dcol);
        }
     
    }

    
    //console.log(grid);

    return grid
}

function searchClearArea(grid,row,col,numRows,numCols){
    let gridCell = grid[row][col];
    gridCell.clear = true;
    gridCell.cellEl.classList.add("clear");

    for (let [drow,dcol] of directions) {
        let cellRow = row+ drow;
        let cellCol = col+ dcol;
        console.log(cellRow,cellCol,numRows,numCols);
        if (cellRow <0 || cellRow>=numRows || cellCol <0 ||cellCol>= numCols) {
            continue;
        }

        let gridCell = grid[cellRow][cellCol];

        console.log(cellRow,cellCol,gridCell);

        if (!gridCell.clear) {
            gridCell.clear = true;
            gridCell.cellEl.classList.add("clear");
            if (gridCell.count === 0) {
                searchClearArea(grid,cellRow,cellCol,numRows,numCols);
            }  else if (gridCell.count > 0) {
                gridCell.cellEl.innerText = gridCell.count;
            }
        }
    }
}

function explode(grid,row,col,numRows,numCols){
    grid[row][col].cellEl.classList.add("exploded");

    for (let cellRow =0;cellRow<numRows;cellRow++) {
        for (let cellCol=0;cellCol<numCols;cellCol++) {
            let cell = grid[cellRow][cellCol];
            cell.clear = true;
            cell.cellEl.classList.add("clear");

            if (cell.count ===-1){
                cell.cellEl.classList.add("landmine");
            }
        } 
    }
}

function checkAllClear(grid) {
    for (let row = 0;row < grid.length;row++) {
        let gridRow =grid[row];
        for (let col = 0;col < gridRow.length;col++) {
            let cell =gridRow[col];
            if (cell.count !== -1 && !cell.clear){
                return false;
            }
        }
    }

    for (let row = 0;row < grid.length;row++) {
        let gridRow =grid[row];
        for (let col = 0;col < gridRow.length;col++) {
            let cell =gridRow[col];

            if (cell.count ===-1){
                cell.cellEl.classList.add("landmine");
            }

            cell.cellEl.classList.add("success");
        }
    }
    return true;
}

let grid = initialize(16, 16, 40);
renderBoard(16, 16,grid);

    