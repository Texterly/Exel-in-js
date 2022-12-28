function matrixArray(rows,columns){
    let arr = new Array();
    for(let i=0; i<rows; i++){
        arr[i] = new Array();
        for(let j=0; j<columns; j++){
            arr[i][j] = null;
        }
    }
    return arr;
}

let data = matrixArray(99,27);

function convertToNumber(letter) {
    return letter.toUpperCase().charCodeAt(0) - 65
}

function getCoords(cell) {
    const row = +cell.slice(1) - 1
    const column = convertToNumber(cell[0])
    return [row, column]
}

function set(cell, value) {
    const [row, column] = getCoords(cell)
    data[row][column] = value
}

function getValue(row, column) {
    const value = data[row][column];
    if (typeof value === "string" && value.slice(0, 6) === '=FIELD')
    {
        const [newRow, newColumn] = getCoords(value.slice(7, value.length-1))
        return getValue(newRow, newColumn)
    }
  else if (typeof value === "string" && value.slice(0, 5) === '=CALC')
  {
    const [cellFrom, cellTo] = value.match(/\((.*)\)/)[1].split(',')
    return calc(cellFrom, cellTo);
  }
    else
    {
        return value;
    }
}

function print(cell) {
    const [row, column] = getCoords(cell);
    console.log(getValue(row, column));
}

function getCoordsFromRange(cellFrom, cellTo) {
    const fromCoords = getCoords(cellFrom);
    const toCoords = getCoords(cellTo);
  const xFrom = fromCoords[0] < toCoords[0] ? fromCoords[0] : toCoords[0]
  const yFrom = fromCoords[1] < toCoords[1] ? fromCoords[1] : toCoords[1]
  
  const xTo = fromCoords[0] > toCoords[0] ? fromCoords[0] : toCoords[0]  
  const yTo = fromCoords[1] > toCoords[1] ? fromCoords[1] : toCoords[1]

    let result = [];
    for(let i = xFrom; i<= xTo; i++) {
        for(let j = yFrom; j <= yTo; j++) {
            result.push([i, j]);
        }
    }
    return result;
}

function fill(cellFrom, cellTo, value) {
    const coordsToFill = getCoordsFromRange(cellFrom, cellTo);

    coordsToFill.forEach(coord => {
        data[coord[0]][coord[1]] = value;
    })
}

function calc(cellFrom, cellTo) {
  let sum = 0;
    const coordsToCalc = getCoordsFromRange(cellFrom, cellTo);

    coordsToCalc.forEach(coord => {
        sum += getValue(coord[0], coord[1]);
    })
  
  return sum;
}

function add(cell, number) {
  const [row, column] = getCoords(cell);
    data[row][column] += number;
}

function subtract(cell, number) {
  const [row, column] = getCoords(cell);
    data[row][column] -= number;
}

set("C4", 123); //Присваем ячейке С4 значение 123
print("C4") //Выводим значение ячейки С4 = 123
set("c5", "=FIELD(C4)");  //Присваем ячейке С5 значение ячейки С5
print("C5"); //Выводим значение ячейки С5 = 123
fill("d4", "e5", 1); //Заполняем ячуйки в диапазоне d4 - e5 значением 1 
set("c1", "=CALC(D4,E5)"); //В ячейке с1 считаем сумму в диапазоне d4 - e5
print("C1"); //Выводим значение ячейки С1 = 4
set("A2", "=CALC(C4,E5)"); //В ячейке A2 считаем сумму в диапазоне c4 - e5
print("A2"); //Выводим значение ячейки A2 = 250
set("A3", "=CALC(E5,C4)"); //В ячейке A3 считаем сумму в диапазоне e5 - c4 в обратном порядке
print("A3"); //Выводим значение ячейки A3 = 250
add("C4", 20); //Добавляем к ячейке С4 значение 20
print("C4"); //Выводим значение ячейки C4 = 143
print("A2"); //Выводим значение ячейки A2 = 290, значение динамически пересчиталось
subtract("C4", 10); //Вычитаем из ячейки С4 значение 10
print("C4"); //Выводим значение ячейки C4 = 133
print("A2"); //Выводим значение ячейки A2 = 270, значение динамически пересчиталось