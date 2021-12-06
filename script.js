function renderBoard(numRows, numCols){
    let boardEl = document.querySelector("#board");
    for (let i=0; i < numRows; i++) {
        let trEl=document.createElement("tr");
        for (let j=0; j < numRows; j++) {
            let tdEl=document.createElement("td");
            trEl.append(tdEl);
        }
        boardEl.append(trEl);
     }
}
renderBoard(9, 9);